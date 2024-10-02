import { withFilter } from "graphql-subscriptions"
import _ from "lodash"
import { nanoid } from "nanoid"
import { Brackets, ILike, In } from "typeorm"
import type { ApolloContext } from ".."
import {
  historyRepository,
  presentationRepository,
  presentationUserRepository,
  slideRepository,
  userRepository,
  templateRepository,
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
  SortParam,
} from "../__generated__"
import { EVENT } from "../pubsub"

export default {
  Query: {
    async findUserPresentations(_, { sortBy }, { user }) {
      if (!user) return null

      // return presentationRepository.find({
      //   where: { users: { props: { id: user.id } } },
      //   order: {
      //     ...(sortBy === SortParam.Newest || sortBy === SortParam.Oldest
      //       ? {
      //           history: {
      //             records: {
      //               lastOpened: sortBy === SortParam.Newest ? "DESC" : "ASC",
      //             },
      //           },
      //         }
      //       : sortBy === SortParam.AZ || sortBy === SortParam.ZA
      //         ? {
      //             name: sortBy === SortParam.AZ ? "ASC" : "DESC",
      //           }
      //         : {}),
      //   },
      // })

      return (
        presentationRepository
          .createQueryBuilder("presentation")
          .innerJoin("presentation.users", "presentationUser")
          .leftJoinAndSelect("presentation.history", "history")
          .leftJoinAndSelect("history.records", "hr")
          .leftJoinAndSelect("hr.user", "hrUser")
          .where("presentationUser.propsId = :userId", { userId: user.id })
          // .andWhere("hrUser.id = presentationUser.id OR hrUser.id IS NULL")
          .orderBy(
            sortBy === SortParam.Newest || sortBy === SortParam.Oldest
              ? `COALESCE(hr.lastOpened, presentationUser.invitedAt)`
              : "presentation.name",
            sortBy === SortParam.Newest || sortBy === SortParam.AZ ? "DESC" : "ASC", // Newest and AZ order in descending, others in ascending
          )
          .getMany()
      )
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
    async createPresentation(_, { name, templateId }, { user }) {
      if (!user) return null

      const template = await templateRepository.findOne({
        relations: ["presentation", "presentation.slides", "presentation.slides.elements"],
        where: { id: templateId === undefined ? -1 : templateId },
      })
      const presentation = new Presentation(name, template)

      const currentUser = await userRepository.findOneBy({ id: user.id })
      presentation.users = [new PresentationUser(presentation, currentUser, Role.Creator)]

      const slide = new Slide({ presentation })
      const history = new History(presentation)

      if (!template) {
        slide.elements = []
      } else {
        slide.elements = template.presentation.slides[0].elements.map((element) => {
          if (element instanceof Text) {
            return new Text({ ...element, slide, id: nanoid() })
          }
          if (element instanceof Image) {
            return new Image({ ...element, slide, id: nanoid() })
          }
          return new Shape({ ...element, slide, id: nanoid() })
        })
      }
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
        relations: ["slides", "slides.elements", "template"],
        where: { id },
      })

      if (!presentation) return null
      const newPresentation = new Presentation(presentation.name)

      const currentUser = await userRepository.findOneBy({ id: user.id })
      newPresentation.users = [new PresentationUser(newPresentation, currentUser, Role.Creator)]

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
            ..._.pick(element, ["x", "y", "width", "height", "angle", "scaleX", "scaleY", "position"]),
            slide: newSlide,
            // Generating a new unique id
            id: nanoid(),
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

      // Setting a template manually (not through the `Presentation` constructor because when creating a slide it will use template props, not the other that I also pass in
      if (presentation.template) {
        newPresentation.template = presentation.template
      }

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
