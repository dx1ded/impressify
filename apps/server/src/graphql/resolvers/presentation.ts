import { withFilter } from "graphql-subscriptions"
import _ from "lodash"
import { ILike, In } from "typeorm"
import type { ApolloContext } from ".."
import { historyRepository, presentationRepository, slideRepository, userRepository } from "../../database"
import { History } from "../../entities/History"
import { Image } from "../../entities/Image"
import { Presentation } from "../../entities/Presentation"
import { Shape } from "../../entities/Shape"
import { Slide } from "../../entities/Slide"
import { Text } from "../../entities/Text"
import { EVENT } from "../../pubsub"
import { PresentationOperation, type PresentationState, type Resolvers, type Subscription } from "../__generated__"

export default {
  Query: {
    async findUserPresentations(_, __, { user }) {
      if (!user) return null

      const sortBy = __.sortBy as "newest" | "oldest" | "a_z" | "z_a"
      const _ids = await presentationRepository.find({
        select: { id: true },
        where: { users: { id: user.id } },
      })

      return presentationRepository.find({
        where: { id: In(_ids.map(({ id }) => id)) },
        order: {
          ...(sortBy === "newest" || sortBy === "oldest"
            ? {
                history: {
                  records: {
                    lastOpened: sortBy === "newest" ? "DESC" : "ASC",
                  },
                },
              }
            : sortBy === "a_z" || sortBy === "z_a"
              ? {
                  name: sortBy === "a_z" ? "ASC" : "DESC",
                }
              : {}),
        },
      })
    },
    getPresentation(_, { id }, { user }) {
      if (!user) return null
      return presentationRepository.findOneBy({ id })
    },
    async searchPresentations(_, { name }, { user }) {
      if (!user) return null

      const _ids = await presentationRepository.find({
        select: { id: true },
        where: { users: { id: user.id } },
      })

      return presentationRepository.findBy({
        id: In(_ids.map(({ id }) => id)),
        name: ILike(`${name}%`),
      })
    },
    async getPresentationInfo(_, { id }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users", "slides", "slides.elements"],
        where: { id },
      })
      if (!presentation) return null

      const totalSlides = presentation.slides.length
      const totalUsers = presentation.users.length
      const totalTextElements = presentation.slides.reduce(
        (acc, slide) => acc + slide.elements.filter((el) => el instanceof Text).length,
        0,
      )
      const totalImageElements = presentation.slides.reduce(
        (acc, slide) => acc + slide.elements.filter((el) => el instanceof Image).length,
        0,
      )
      const totalShapeElements = presentation.slides.reduce(
        (acc, slide) => acc + slide.elements.filter((el) => el instanceof Shape).length,
        0,
      )

      return {
        totalSlides,
        totalUsers,
        totalTextElements,
        totalImageElements,
        totalShapeElements,
      }
    },
  },
  Mutation: {
    async createPresentation(_, { name }, { user }) {
      if (!user) return null

      const presentation = new Presentation(name, [await userRepository.findOneBy({ id: user.id })])
      const slide = new Slide({ presentation })
      const history = new History(presentation)

      slide.elements = []
      history.records = []
      presentation.slides = [slide]
      presentation.history = history

      return presentationRepository.save(presentation)
    },
    async renamePresentation(_, { id, name }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOneBy({ id })
      if (!presentation) return null
      presentation.name = name
      return presentationRepository.save(presentation)
    },
    async duplicatePresentation(__, { id }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["slides", "slides.elements"],
        where: { id },
      })

      if (!presentation) return null
      const newPresentation = new Presentation(presentation.name, [await userRepository.findOneBy({ id: user.id })])
      const history = new History(newPresentation)

      history.records = []
      newPresentation.history = history
      newPresentation.slides = presentation.slides.map((slide) => {
        const newSlide = new Slide({
          presentation: newPresentation,
          bg: slide.bg,
          transition: slide.transition,
          thumbnailUrl: slide.thumbnailUrl,
        })
        newSlide.elements = slide.elements.map((element) => {
          const commonProps = {
            ..._.pick(element, ["id", "x", "y", "width", "height", "angle", "scaleX", "scaleY", "position"]),
            slide: newSlide,
          }
          if (element instanceof Text) {
            return new Text({
              ...commonProps,
              ..._.pick(element, [
                "text",
                "textColor",
                "fillColor",
                "borderColor",
                "fontFamily",
                "fontSize",
                "bold",
                "italic",
                "underlined",
                "alignment",
                "lineHeight",
              ]),
            })
          }
          if (element instanceof Image) {
            return new Image({
              ...commonProps,
              imageUrl: element.imageUrl,
            })
          }
          return new Shape({
            ...commonProps,
            ..._.pick(element, ["type", "fillColor", "strokeColor", "strokeWidth", "proportional"]),
          })
        })
        return newSlide
      })
      return presentationRepository.save(newPresentation)
    },
    async deletePresentation(_, { id }, { user, pubsub }) {
      if (!user) return null
      await presentationRepository.delete({ id })
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationUpdated: {
          operation: PresentationOperation.Delete,
          _userUpdatedStateId: user.id,
          _presentationId: id,
        } as PresentationState,
      })
      return true
    },
    async synchronizePresentationState(_, { state }, { user, pubsub, connections }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users", "slides"],
        where: { id: state.id },
      })
      if (!presentation || !presentation.users.some((_user) => _user.id === user.id)) return null
      // Updating connections (state.connectedUser props + other users' currentSlide (in case it got deleted or moved)
      connections.updateMultipleUsers(presentation.id, (_user) => {
        // Already updating user's props (if it's the one who sent the request - `state.connectedUser.id`)
        const newUser = _user.id === state.connectedUser.id ? { ..._user, ...state.connectedUser } : _user
        // Finding a new slide index that was moved (even if it didn't get moved we still do this just in case)
        const movedSlideIndex = state.slides.findIndex((_slide) => _slide.id === newUser.currentSlideId)
        return {
          ...newUser,
          // Basically if `movedSlideIndex` was not found (and its value is -1) it only means it got deleted.
          // So, we just set the id of the last slide in `state.slides`
          currentSlideId:
            movedSlideIndex !== -1 ? state.slides[movedSlideIndex].id : state.slides[state.slides.length - 1].id,
        }
      })

      const newState: PresentationState = {
        ...state,
        operation: PresentationOperation.Update,
        slides: state.slides.map((slide, slideIndex) => {
          const previousSlideCopy = presentation.slides.find((_slide) => _slide.id === slide.id)
          const updatedSlide: Slide = {
            ...slide,
            elements: [],
            presentation,
            position: slideIndex,
            createdAt: previousSlideCopy ? previousSlideCopy.createdAt : new Date(),
          }
          // We use new Text / Image / Shape because it will be used in transforming data with `__typename` in `slides.ts -> resolver -> elements`
          slide.elements.text.forEach((element) => {
            updatedSlide.elements[element.position] = new Text({ ...element, slide: updatedSlide })
          })
          slide.elements.image.forEach((element) => {
            updatedSlide.elements[element.position] = new Image({ ...element, slide: updatedSlide })
          })
          slide.elements.shape.forEach((element) => {
            updatedSlide.elements[element.position] = new Shape({ ...element, slide: updatedSlide })
          })
          return updatedSlide
        }),
        connectedUsers: connections.getUsers(presentation.id),
        _userUpdatedStateId: user.id,
        _presentationId: presentation.id,
      }

      // Updating the values in connection as well so new users that join the presentation receive the synchronized state
      connections.updateSynchronizedState(presentation.id, {
        name: newState.name,
        slides: newState.slides,
        isSaving: newState.isSaving,
      })
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, { presentationUpdated: newState })
      return newState
    },
  },
  Subscription: {
    presentationUpdated: {
      subscribe: (_, args, { user, pubsub }) => ({
        [Symbol.asyncIterator]: withFilter(
          () => pubsub.asyncIterator(EVENT.PRESENTATION_UPDATED),
          async (payload: Pick<Subscription, "presentationUpdated">) => {
            // if (args.presentationId !== payload.presentationUpdated._presentationId) return false
            const presentation = await presentationRepository.findOne({
              relations: ["users"],
              where: { id: args.presentationId },
            })
            if (!presentation) return false
            const { _userUpdatedStateId } = payload.presentationUpdated
            return (
              (_userUpdatedStateId ? _userUpdatedStateId !== user?.id : true) &&
              presentation.users.some((_user) => _user.id === user?.id)
            )
          },
        ),
      }),
    },
  },
  Presentation: {
    async slides(parent, _, { connections }, { operation, variableValues }) {
      // if (operation.name.value === "getPresentation") {
      //   const synchronizedSlidesExist = connections.getSynchronizedSlides(parent.id)
      //   if (synchronizedSlidesExist) return synchronizedSlidesExist
      // }
      const preview = variableValues.preview || false
      if (preview) {
        // Return only the first slide if preview is true
        const firstSlide = await slideRepository.findOne({
          where: { presentation: { id: parent.id } },
          order: { position: "ASC" },
        })
        return firstSlide ? [firstSlide] : []
      }
      return slideRepository.find({
        where: { presentation: { id: parent.id } },
        order: { position: "ASC" },
      })
    },
    users(parent) {
      return userRepository.findBy({ presentations: { id: parent.id } })
    },
    async history(parent) {
      return historyRepository.findOneBy({ presentation: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
