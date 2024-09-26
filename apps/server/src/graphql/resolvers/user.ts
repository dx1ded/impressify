import { ILike } from "typeorm"
import type { ApolloContext } from ".."
import { type Resolvers, Result, Role } from "../__generated__"
import { userRepository, presentationRepository } from "../../database"
import { PresentationUser } from "../../entities/PresentationUser"

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
    async invite(_, { userId, presentationId, role }, { user }) {
      if (!user) return null

      const foundUser = await userRepository.findOneBy({ id: userId })
      if (!foundUser) return Result.NotFound

      const presentation = await presentationRepository.findOne({
        relations: ["users"],
        where: { id: presentationId },
      })
      if (!presentation || presentation.users.some((user) => user.id === userId)) return Result.Error
      if (presentation.users.find((_user) => _user.role === Role.Creator).id !== user.id) return Result.NotAllowed

      presentation.users.push(new PresentationUser(presentation, foundUser, role))

      await presentationRepository.save(presentation)
      return Result.Success
    },
    async changeUserRole(_, { userId, presentationId, role }, { user }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users"],
        where: { id: presentationId },
      })
      if (!presentation || !presentation.users.some((user) => user.id === userId)) return Result.Error
      if (presentation.users.find((_user) => _user.role === Role.Creator).id !== user.id) return Result.NotAllowed

      presentation.users = presentation.users.map((_user) => (_user.id === userId ? { ..._user, role } : _user))

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
