import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { historyRecordRepository, presentationRepository } from "../../database"

export default {
  History: {
    presentation(parent) {
      return presentationRepository.findOneBy({ history: { id: parent.id } })
    },
    records(parent) {
      return historyRecordRepository.findBy({ history: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
