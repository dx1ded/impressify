import { type User, clerkClient } from "@clerk/clerk-sdk-node"
import { getStorage } from "firebase-admin/storage"

import pubsub from "./pubsub"
import { validateTokenAndGetUser } from "../helpers"
import type { ApolloContext } from "."

export async function getContext(authorization?: string): Promise<ApolloContext> {
  let user: User | null = null

  if (authorization) {
    user = await validateTokenAndGetUser(authorization, clerkClient)
  }

  return {
    storage: getStorage(),
    user,
    pubsub,
  }
}
