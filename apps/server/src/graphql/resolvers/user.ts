import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { userRepository, presentationRepository } from "../../database"

export default {
  Mutation: {
    async invite(_, { email, presentationId }, { user }) {
      if (!user) return null
      const foundUser = await userRepository.findOneBy({ email })
      if (!foundUser) return false
      const presentation = await presentationRepository.findOne({
        relations: ["users"],
        where: { id: presentationId },
      })
      if (!presentation || presentation.users.find((user) => user.email === email)) return false
      presentation.users.push(foundUser)
      await presentationRepository.save(presentation)
      return true
    },
    async sendHelpRequest(_, { text }, { user }) {
      if (!user) return null

      // Send email code
      console.log(text)

      return true
    },
  },
} as Resolvers<ApolloContext>
