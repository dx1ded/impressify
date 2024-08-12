import _ from "lodash"
import { ILike, In } from "typeorm"
import { withFilter } from "graphql-subscriptions"
import type { ApolloContext } from ".."
import type { PresentationState, Resolvers, Subscription, SlideStateItem } from "../__generated__"
import { presentationRepository, slideRepository, userRepository, historyRepository } from "../../database"
import pubsub, { EVENT } from "../../pubsub"
import { Presentation } from "../../entities/Presentation"
import { History } from "../../entities/History"
import { Slide } from "../../entities/Slide"
import { Text } from "../../entities/Text"
import { Image } from "../../entities/Image"
import { Shape } from "../../entities/Shape"

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
      const savedPresentation = await presentationRepository.save(presentation)
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, { presentation: { name } })
      return savedPresentation
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
    async deletePresentation(_, { id }, { user }) {
      if (!user) return null
      await presentationRepository.delete({ id })
      return true
    },
    async synchronizePresentationState(_, { changes }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users"],
        where: { id: changes.id },
      })
      if (!presentation || !presentation.users.some((_user) => _user.id === user.id)) return null
      const state: PresentationState = {
        name: changes.name,
        slides: changes.slides?.map((slide) => {
          const updatedSlide: SlideStateItem = { ...slide, elements: [] }
          ;[...slide.elements.text, ...slide.elements.image, ...slide.elements.shape].forEach((element) => {
            slide.elements[element.position] = element
          })
          return updatedSlide
        }),
        users: changes.users
          ? [
              ...presentation.users,
              ...(await userRepository.findBy({ id: In(changes.users.map((_user) => _user.id)) })),
            ]
          : presentation.users,
        isSaving: changes.isSaving,
        _userUpdatedStateId: changes._userUpdatedStateId,
      }
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, { presentationUpdated: state })
      return state
    },
  },
  Subscription: {
    presentationUpdated: {
      subscribe: (_, __, { user }) => ({
        [Symbol.asyncIterator]: withFilter(
          () => pubsub.asyncIterator(EVENT.PRESENTATION_UPDATED),
          (payload: Pick<Subscription, "presentationUpdated">) =>
            payload.presentationUpdated.users.some(
              (_user) => _user.id !== payload.presentationUpdated._userUpdatedStateId && _user.id === user.id,
            ),
        ),
      }),
    },
  },
  Presentation: {
    async slides(parent, _, __, { variableValues }) {
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
