import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { templateRepository } from "../../database"

export default {
  Query: {
    findTemplates(_, { offset = 0, limit = 5 }, { user }) {
      if (!user) return null
      return templateRepository.find({
        skip: offset,
        take: limit,
        order: {
          id: "ASC",
        },
      })
    },
  },
  Template: {
    async presentation(parent) {
      const template = await templateRepository.findOne({
        relations: ["presentation"],
        where: { id: parent.id },
      })
      return template.presentation
    },
  },
} as Resolvers<ApolloContext>
