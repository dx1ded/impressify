import { join } from "node:path"
import type { ClerkClient, User } from "@clerk/backend"
import type { Storage } from "firebase-admin/storage"

import type { PubSub } from "graphql-subscriptions"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { loadSchemaSync } from "@graphql-tools/load"
import { loadFilesSync } from "@graphql-tools/load-files"
import { dateScalar } from "./scalars/Date"

// Absolute path because @nx doesn't export graphql files
const typeDefs = loadSchemaSync("apps/server/src/graphql/**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
})

const resolvers = loadFilesSync(join(__dirname, "./resolvers/*"))

export interface ApolloContext {
  clerk: ClerkClient
  storage: Storage
  user: User | undefined
  pubsub: PubSub
}

export const schema = makeExecutableSchema<ApolloContext>({
  typeDefs: mergeTypeDefs(typeDefs),
  resolvers: {
    ...mergeResolvers(resolvers),
    Date: dateScalar,
  },
})
