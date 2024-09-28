import { ILike } from "typeorm"
import type { ApolloContext } from ".."
import type { Resolvers } from "../__generated__"
import { userRepository } from "../../database"

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
} as Resolvers<ApolloContext>
