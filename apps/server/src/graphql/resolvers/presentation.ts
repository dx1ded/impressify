import _ from "lodash"
import { ILike, In } from "typeorm"
import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { presentationRepository, slideRepository, userRepository, historyRepository } from "../../database"
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
  },
  Mutation: {
    async createPresentation(_, { name }, { user }) {
      if (!user) return null

      const presentation = new Presentation(name, [await userRepository.findOneBy({ id: user.id })])
      const slide = new Slide(presentation)
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
      presentation.name = name
      return presentationRepository.save(presentation)
    },
    async deletePresentation(_, { id }, { user }) {
      if (!user) return null

      await presentationRepository.delete({ id })
      return true
    },
    async copyPresentation(__, { id }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["slides", "slides.elements"],
        where: { id },
      })

      const newPresentation = new Presentation(presentation.name, [await userRepository.findOneBy({ id: user.id })])
      const history = new History(newPresentation)
      history.records = []
      newPresentation.history = history
      newPresentation.slides = presentation.slides.map((slide) => {
        const newSlide = new Slide(newPresentation)
        newSlide.bgColor = slide.bgColor
        newSlide.transition = slide.transition
        newSlide.thumbnailUrl = slide.thumbnailUrl
        newSlide.elements = slide.elements.map((element) => {
          const commonProps = {
            ..._.pick(element, ["id", "x", "y", "width", "height", "angle", "scaleX", "scaleY"]),
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
  },
  Presentation: {
    async slides(parent, _, __, { variableValues }) {
      const preview = variableValues.preview ? variableValues.preview : true
      if (preview) {
        // Return only the first slide if preview is true
        const firstSlide = await slideRepository.findOne({
          where: { presentation: { id: parent.id } },
          order: { createdAt: "ASC" },
        })
        return firstSlide ? [firstSlide] : []
      }
      return slideRepository.findBy({ presentation: { id: parent.id } })
    },
    users(parent) {
      return userRepository.findBy({ presentations: { id: parent.id } })
    },
    async history(parent) {
      return historyRepository.findOneBy({ presentation: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
