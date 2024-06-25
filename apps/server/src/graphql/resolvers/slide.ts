import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { elementRepository } from "../../database"

export default {
  Slide: {
    elements(parent) {
      return elementRepository.findBy({ slide: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
