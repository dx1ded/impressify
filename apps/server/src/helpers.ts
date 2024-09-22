import { type ClerkClient, verifyToken } from "@clerk/clerk-sdk-node"
import type { Storage } from "firebase-admin/storage"

export async function deletePresentationFiles(storage: Storage, presentationId: string) {
  const bucket = storage.bucket(process.env.FIREBASE_BUCKET_NAME)
  await bucket.deleteFiles({ prefix: presentationId })
}

export async function validateTokenAndGetUser(authorization: string, clerk: ClerkClient) {
  try {
    const token = authorization.replace("Bearer ", "")
    const verifiedToken = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    return await clerk.users.getUser(verifiedToken.sub)
  } catch (e) {
    return null
  }
}
