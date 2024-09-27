import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { presentationRepository, presentationUserRepository } from "../../database"

export default {
  PresentationUser: {
    presentation(parent) {
      return presentationRepository.findOneBy({ id: parent.presentation.id })
    },
    async props(parent) {
      const presentationUser = await presentationUserRepository.findOne({
        relations: ["props"],
        select: ["props"],
        where: { id: parent.id },
      })

      return presentationUser.props
    },
  },
} as Resolvers<ApolloContext>
