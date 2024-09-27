import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { historyRepository, presentationRepository, presentationUserRepository } from "../../database"
import { HistoryRecord } from "../../entities/HistoryRecord"

export default {
  Mutation: {
    async addRecord(_, { presentationId }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["history", "history.records", "history.records.user", "history.records.user.props"],
        where: { id: presentationId },
      })

      const existingUserRecord = presentation.history.records.find((record) => record.user.props.id === user.id)
      if (existingUserRecord) {
        existingUserRecord.lastOpened = new Date()
        presentation.history.records = presentation.history.records.map((record) =>
          record.id === existingUserRecord.id ? existingUserRecord : record,
        )
        await presentationRepository.save(presentation)
        return existingUserRecord
      }

      const presentationUser = await presentationUserRepository.findOne({
        relations: ["props"],
        where: { presentation: { id: presentationId }, props: { id: user.id } },
      })
      const newRecord = new HistoryRecord(presentation.history, presentationUser)
      presentation.history.records.push(newRecord)
      const savedPresentation = await presentationRepository.save(presentation)
      return savedPresentation.history.records.find((record) => record.user.props.id === user.id)
    },
  },
  HistoryRecord: {
    user(parent) {
      return presentationUserRepository.findOneBy({ record: { id: parent.id } })
    },
    history(parent) {
      return historyRepository.findOneBy({ records: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
