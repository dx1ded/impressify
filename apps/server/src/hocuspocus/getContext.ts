import { type User, clerkClient } from "@clerk/clerk-sdk-node"
import { debounce } from "moderndash"
import type { HocuspocusContext } from "./types"
import { save } from "./save"
import pubsub from "../graphql/pubsub"
import { validateTokenAndGetUser } from "../helpers"

const SAVE_DEBOUNCE_TIME = 8000

export async function getContext(authorization?: string): Promise<HocuspocusContext> {
  let user: User | null = null

  if (authorization) {
    user = await validateTokenAndGetUser(authorization, clerkClient)
  }

  return {
    user,
    debouncedSave: debounce(save, SAVE_DEBOUNCE_TIME),
    pubsub,
  }
}
