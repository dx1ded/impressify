import { type Storage, getDownloadURL } from "firebase-admin/storage"
import type { ConnectedUser, ConnectedUserInput } from "./graphql/__generated__"

export async function uploadImageToFirebaseStorage(storage: Storage, dataUrl: string, filePath: string) {
  const bucket = storage.bucket(process.env.FIREBASE_BUCKET_NAME)
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string")
  }
  const contentType = matches[1]
  const buffer = Buffer.from(matches[2], "base64")
  const fileType = contentType.split("/")[1]

  // Create a reference to the file
  const file = bucket.file(`${filePath}.${fileType}`)

  // Upload the file to Firebase Storage
  await file.save(buffer, {
    contentType,
    public: true,
  })

  return getDownloadURL(file)
}

export function useUserConnections() {
  const userConnections: Record<string, ConnectedUser[]> = {}

  function addUserConnection(presentationId: string, user: ConnectedUser) {
    if (!userConnections[presentationId]) {
      userConnections[presentationId] = []
    }
    userConnections[presentationId].push(user)
  }

  function updateUserConnection(presentationId: string, userInput: ConnectedUserInput) {
    if (!userConnections[presentationId].find((user) => user.id === userInput.id)) return
    userConnections[presentationId] = userConnections[presentationId].map((user) =>
      user.id === userInput.id ? { ...user, ...userInput } : user,
    )
  }

  function updateMultipleUserConnections(presentationId: string, cb: (user: ConnectedUser) => ConnectedUser) {
    if (!userConnections[presentationId]) return
    userConnections[presentationId] = userConnections[presentationId].map(cb)
  }

  function removeUserConnection(presentationId: string, userId: string) {
    if (userConnections[presentationId]) {
      userConnections[presentationId] = userConnections[presentationId].filter((user) => user.id !== userId)
    }
  }

  function getUserConnections(presentationId: string) {
    return userConnections[presentationId] || []
  }

  return {
    addUserConnection,
    updateUserConnection,
    updateMultipleUserConnections,
    removeUserConnection,
    getUserConnections,
  }
}
