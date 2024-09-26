import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { presentationRepository, userRepository } from "../../database"

export default {
  PresentationUser: {
    presentation(parent) {
      return presentationRepository.findOneBy({ id: parent.presentation.id })
    },
    props(parent) {
      return userRepository.findOneBy({ id: parent.id })
    },
  },
} as Resolvers<ApolloContext>
