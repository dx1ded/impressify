import { In } from "typeorm"
import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { presentationRepository, slideRepository, userRepository } from "../../database"
import { Presentation } from "../../entities/Presentation"

export default {
  Query: {
    async findUserPresentations(_, __, { user }) {
      if (!user) return null

      const ids = await presentationRepository.find({
        where: { users: { id: user.id } },
        select: { id: true },
      })

      return presentationRepository.findBy({ id: In(ids) })
    },
  },
  Mutation: {
    async createPresentation(_, { name }, { user }) {
      if (!user) return null

      const presentation = new Presentation(name, [await userRepository.findOneBy({ id: user.id })])
      return presentationRepository.create(presentation)
    },
    async renamePresentation(_, { id, name }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOneBy({ id })
      presentation.name = name
      return presentationRepository.create(presentation)
    },
    async deletePresentation(_, { id }, { user }) {
      if (!user) return null

      await presentationRepository.delete({ id })
      return true
    },
  },
  Presentation: {
    slides(parent) {
      return slideRepository.findBy({ presentation: { id: parent.id } })
    },
    users(parent) {
      return userRepository.findBy({ presentations: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
