import { EVENT } from "../pubsub"
import type { ApolloContext } from ".."
import { PresentationUser } from "../../entities/PresentationUser"
import { type PresentationUpdate, type Resolvers, PresentationUpdateType, Result, Role } from "../__generated__"
import { presentationRepository, presentationUserRepository, userRepository } from "../../database"

export default {
  Mutation: {
    async invite(_, { userId, presentationId, role }, { user, pubsub }) {
      if (!user) return null

      const foundUser = await userRepository.findOneBy({ id: userId })
      if (!foundUser) return Result.NotFound

      const presentation = await presentationRepository.findOne({
        relations: ["users", "users.props"],
        where: { id: presentationId },
      })
      if (!presentation || presentation.users.some((user) => user.props.id === userId)) return Result.NotFound
      if (presentation.users.find((_user) => _user.role === Role.Creator).props.id !== user.id) return Result.NotAllowed

      presentation.users.push(new PresentationUser(presentation, foundUser, role))

      await presentationRepository.save(presentation)
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationListUpdated: {
          type: PresentationUpdateType.Added,
          presentation,
          userIds: [userId],
        } as PresentationUpdate,
      })

      return Result.Success
    },
    async changeUserRole(_, { userId, presentationId, role }, { user, pubsub }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users", "users.props"],
        where: { id: presentationId },
      })
      if (!presentation || !presentation.users.some((user) => user.props.id === userId)) return Result.NotFound
      if (presentation.users.find((_user) => _user.role === Role.Creator).props.id !== user.id) return Result.NotAllowed

      presentation.users = presentation.users.map((_user) => (_user.props.id === userId ? { ..._user, role } : _user))

      await presentationRepository.save(presentation)
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationListUpdated: {
          type: PresentationUpdateType.Changed,
          presentation,
          userIds: [userId],
        } as PresentationUpdate,
      })

      return Result.Success
    },
    async kick(_, { userId, presentationId }, { user, pubsub }) {
      if (!user) return null

      const presentation = await presentationRepository.findOne({
        relations: ["users", "users.props", "users.record", "history", "history.records"],
        where: { id: presentationId },
      })
      if (!presentation || !presentation.users.some((user) => user.props.id === userId)) return Result.NotFound
      if (presentation.users.find((_user) => _user.role === Role.Creator).props.id !== user.id) return Result.NotAllowed

      const userToDelete = presentation.users.find((_user) => _user.props.id === userId)

      presentation.users = presentation.users.filter((_user) => _user.props.id !== userId)
      // Deleting the record this way because `orphanedRowAction` will not delete it after `presentation.users` filter
      // Honestly, idk what's the problem, either typeorm doesn't support nested `orphanedRowAction` or it violates the foreign key from `History`
      presentation.history.records = presentation.history.records.filter(
        (record) => record.id !== userToDelete.record?.id,
      )

      await presentationRepository.save(presentation)
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationListUpdated: {
          type: PresentationUpdateType.Deleted,
          presentation,
          userIds: [userId],
        } as PresentationUpdate,
      })

      return Result.Success
    },
    async sendHelpRequest(_, { text }, { user }) {
      if (!user) return null

      // Send email code
      console.log(text)

      return Result.Success
    },
  },
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
