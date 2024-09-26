import { ILike } from "typeorm"
import type { ApolloContext } from ".."
import { type Resolvers, Result, Permission } from "../__generated__"
import { userRepository, presentationRepository } from "../../database"

export default {
  Query: {
    async findUsers(_, { query, offset = 0, limit = 10 }, { user }) {
      if (!user) return null
      return userRepository.find({
        where: [{ name: ILike(`${query}%`) }, { email: ILike(`${query}%`) }],
        skip: offset,
        take: limit,
      })
    },
  },
  Mutation: {
    async invite(_, { userId, presentationId, permission }, { user }) {
      if (!user) return null

      const foundUser = await userRepository.findOneBy({ id: userId })
      if (!foundUser) return Result.NotFound

      const presentation = await presentationRepository.findOne({
        relations: ["users", "owner", "editors", "readers"],
        where: { id: presentationId },
      })
      if (!presentation || presentation.users.some((user) => user.id === userId)) return Result.Error
      if (presentation.owner.id !== user.id) return Result.NotAllowed

      presentation.users.push(foundUser)

      if (permission === Permission.Read) {
        presentation.readers.push(foundUser)
      } else if (permission === Permission.ReadWrite) {
        presentation.editors.push(foundUser)
      }

      await presentationRepository.save(presentation)
      return Result.Success
    },
    async changeUserRole(_, { userId, presentationId, permission }, { user }) {
      if (!user) return null

      const foundUser = await userRepository.findOneBy({ id: userId })
      if (!foundUser) return Result.NotFound

      const presentation = await presentationRepository.findOne({
        relations: ["users", "owner", "editors", "readers"],
        where: { id: presentationId },
      })
      if (!presentation || !presentation.users.some((user) => user.id === userId)) return Result.Error
      if (presentation.owner.id !== user.id) return Result.NotAllowed

      if (permission === Permission.Read) {
        presentation.readers.push(foundUser)
        presentation.editors = presentation.editors.filter((editor) => editor.id !== userId)
      } else if (permission === Permission.ReadWrite) {
        presentation.editors.push(foundUser)
        presentation.readers = presentation.readers.filter((reader) => reader.id !== userId)
      }

      await presentationRepository.save(presentation)
      return Result.Success
    },
    async sendHelpRequest(_, { text }, { user }) {
      if (!user) return null

      // Send email code
      console.log(text)

      return Result.Success
    },
  },
} as Resolvers<ApolloContext>
