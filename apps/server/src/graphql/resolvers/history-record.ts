import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { historyRepository, userRepository } from "../../database"

export default {
  HistoryRecord: {
    user(parent) {
      return userRepository.findOneBy({ records: { id: parent.id } })
    },
    history(parent) {
      return historyRepository.findOneBy({ records: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
