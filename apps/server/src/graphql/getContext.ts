import { type User, clerkClient } from "@clerk/clerk-sdk-node"
import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"

import pubsub from "./pubsub"
import { validateTokenAndGetUser } from "../helpers"
import firebaseCredentials from "../impressify-26983-firebase-adminsdk-26c7d-c529d5e383"
import type { ApolloContext } from "."

const firebase = initializeApp({ credential: cert(firebaseCredentials as ServiceAccount) })

export async function getContext(authorization?: string): Promise<ApolloContext> {
  let user: User | null = null

  if (authorization) {
    user = await validateTokenAndGetUser(authorization, clerkClient)
  }

  return {
    storage: getStorage(firebase),
    user,
    pubsub,
  }
}
