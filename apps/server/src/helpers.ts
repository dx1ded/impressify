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
  const connectedUsers: Record<string, ConnectedUser[]> = {}

  function addUserConnection(presentationId: string, user: ConnectedUser) {
    if (!connectedUsers[presentationId]) {
      connectedUsers[presentationId] = []
    }
    connectedUsers[presentationId].push(user)
  }

  function updateUserConnection(presentationId: string, userInput: ConnectedUserInput) {
    if (!connectedUsers[presentationId].find((user) => user.id === userInput.id)) return
    connectedUsers[presentationId] = connectedUsers[presentationId].map((user) =>
      user.id === userInput.id ? { ...user, ...userInput } : user,
    )
  }

  function removeUserConnection(presentationId: string, userId: string) {
    if (connectedUsers[presentationId]) {
      connectedUsers[presentationId] = connectedUsers[presentationId].filter((u) => u.id !== userId)
    }
  }

  function getUserConnections(presentationId: string) {
    return connectedUsers[presentationId] || []
  }

  return {
    addUserConnection,
    updateUserConnection,
    removeUserConnection,
    getUserConnections,
  }
}
