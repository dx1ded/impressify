import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { historyRepository, presentationRepository, userRepository } from "../../database"
import { HistoryRecord } from "../../entities/HistoryRecord"

export default {
  Mutation: {
    async addRecord(_, { presentationId }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["history", "history.records", "history.records.user"],
        where: { id: presentationId },
      })

      const userRecordExists = presentation.history.records.find((record) => record.user.id === user.id)
      if (userRecordExists) {
        userRecordExists.lastOpened = new Date()
        presentation.history.records = presentation.history.records.map((record) =>
          record.id === userRecordExists.id ? userRecordExists : record,
        )
        await presentationRepository.save(presentation)
        return userRecordExists
      }

      const _user = await userRepository.findOneBy({ id: user.id })
      const newRecord = new HistoryRecord(_user, presentation.history)
      presentation.history.records.push(newRecord)
      const savedPresentation = await presentationRepository.save(presentation)
      return savedPresentation.history.records.find((record) => record.user.id === user.id)!
    },
  },
  HistoryRecord: {
    user(parent) {
      return userRepository.findOneBy({ records: { id: parent.id } })
    },
    history(parent) {
      return historyRepository.findOneBy({ records: { id: parent.id } })
    },
  },
} as Resolvers<ApolloContext>
