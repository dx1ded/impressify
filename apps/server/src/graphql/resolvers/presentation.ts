import { withFilter } from "graphql-subscriptions"
import _ from "lodash"
import { ILike, In } from "typeorm"
import type { ApolloContext } from ".."
import {
  historyRepository,
  presentationRepository,
  presentationUserRepository,
  slideRepository,
  userRepository,
} from "../../database"
import { History } from "../../entities/History"
import { Image } from "../../entities/Image"
import { Presentation } from "../../entities/Presentation"
import { PresentationUser } from "../../entities/PresentationUser"
import { Shape } from "../../entities/Shape"
import { Slide } from "../../entities/Slide"
import { Text } from "../../entities/Text"
import { deletePresentationFiles } from "../../helpers"
import {
  type PresentationUpdate,
  type Resolvers,
  type Subscription,
  PresentationUpdateType,
  Result,
  Role,
} from "../__generated__"
import { EVENT } from "../pubsub"

export default {
  Query: {
    async findUserPresentations(_, __, { user }) {
      if (!user) return null

      const sortBy = __.sortBy as "newest" | "oldest" | "a_z" | "z_a"
      const _ids = await presentationRepository.find({
        select: { id: true },
        where: { users: { props: { id: user.id } } },
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
        where: { users: { props: { id: user.id } } },
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
        name: presentation.name,
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

      const currentUser = await userRepository.findOneBy({ id: user.id })
      const presentation = new Presentation(name)

      presentation.users = [new PresentationUser(presentation, currentUser, Role.Creator)]

      const slide = new Slide({ presentation })
      const history = new History(presentation)

      slide.elements = []
      history.records = []
      presentation.slides = [slide]
      presentation.history = history

      return presentationRepository.save(presentation)
    },
    async renamePresentation(_, { id, name }, { user, pubsub }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users", "users.props"],
        where: { id },
      })
      if (!presentation) return null

      const presentationUser = await presentationUserRepository.findOneBy({
        props: { id: user.id },
        presentation: { id },
      })
      if (presentationUser.role === Role.Reader) return null

      presentation.name = name
      const savedPresentation = await presentationRepository.save(presentation)
      pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationListUpdated: {
          type: PresentationUpdateType.Changed,
          presentation,
        } as PresentationUpdate,
      })

      return savedPresentation
    },
    async duplicatePresentation(__, { id }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["slides", "slides.elements"],
        where: { id },
      })

      if (!presentation) return null
      const newPresentation = new Presentation(presentation.name)

      const currentUser = await userRepository.findOneBy({ id: user.id })
      newPresentation.users = [new PresentationUser(presentation, currentUser, Role.Creator)]

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
    async deletePresentation(_, { id }, { user, storage, pubsub }) {
      if (!user) return null

      const presentationUser = await presentationUserRepository.findOneBy({
        props: { id: user.id },
        presentation: { id },
      })
      if (presentationUser.role !== Role.Creator) return Result.NotAllowed

      const presentationToDelete = await presentationRepository.findOne({
        relations: ["users", "users.props"],
        where: { id },
      })

      // Using typeorm transactions so all operations work atomically (otherwise graphql relations are gonna be loaded AFTER presentation got deleted from the database which will lead to an error)
      await presentationRepository.manager.transaction(async (entityManager) => {
        await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
          presentationListUpdated: {
            type: PresentationUpdateType.Deleted,
            presentation: presentationToDelete,
            userIds: presentationToDelete.users.map((_user) => _user.props.id),
          } as PresentationUpdate,
        })

        await entityManager.delete(Presentation, { id })
        await deletePresentationFiles(storage, id)
      })

      return Result.Success
    },
  },
  Subscription: {
    presentationListUpdated: {
      subscribe: (_, __, { user, pubsub }) => ({
        [Symbol.asyncIterator]: withFilter(
          () => pubsub.asyncIterator(EVENT.PRESENTATION_UPDATED),
          async (payload: Pick<Subscription, "presentationListUpdated">) => {
            if (!user) return false
            const { type, presentation, userIds } = payload.presentationListUpdated
            switch (type) {
              case PresentationUpdateType.Added:
                return userIds.includes(user.id)
              case PresentationUpdateType.Changed:
                return userIds
                  ? userIds.includes(user.id)
                  : presentation.users.some((_user) => _user.props.id === user.id)
              case PresentationUpdateType.Deleted:
                return userIds.includes(user.id)
            }
          },
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
      return presentationUserRepository.findBy({ presentation: { id: parent.id } })
    },
    history(parent) {
      return historyRepository.findOneBy({ presentation: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
