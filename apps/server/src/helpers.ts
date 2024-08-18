import { type Storage, getDownloadURL } from "firebase-admin/storage"
import type { ConnectionState } from "./types"
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

export function useConnections() {
  const connections: Record<string, { state: ConnectionState; users: ConnectedUser[] }> = {}

  function getUsers(presentationId: string) {
    return connections[presentationId]?.users || []
  }

  function getSynchronizedState(presentationId: string) {
    return connections[presentationId]?.state || ({} as ConnectionState)
  }

  function addUser(presentationId: string, user: ConnectedUser) {
    if (!connections[presentationId]) {
      connections[presentationId] = { state: { name: null, slides: [], isSaving: false }, users: [] }
    }
    connections[presentationId].users.push(user)
  }

  function updateUser(presentationId: string, userInput: ConnectedUserInput) {
    if (!connections[presentationId].users.find((user) => user.id === userInput.id)) return
    connections[presentationId].users = connections[presentationId].users.map((user) =>
      user.id === userInput.id ? { ...user, ...userInput } : user,
    )
  }

  function updateMultipleUsers(presentationId: string, cb: (user: ConnectedUser) => ConnectedUser) {
    if (!connections[presentationId]) return
    connections[presentationId].users = connections[presentationId].users.map(cb)
  }

  function updateSynchronizedState(presentationId: string, newState: Partial<ConnectionState>) {
    if (!connections[presentationId]) return
    connections[presentationId].state = { ...connections[presentationId].state, ...newState }
  }

  function removeUser(presentationId: string, userId: string) {
    if (connections[presentationId]) {
      connections[presentationId].users = connections[presentationId].users.filter((user) => user.id !== userId)
    }
  }

  function removeConnection(presentationId: string) {
    delete connections[presentationId]
  }

  return {
    getUsers,
    getSynchronizedState,
    addUser,
    updateUser,
    updateMultipleUsers,
    updateSynchronizedState,
    removeUser,
    removeConnection,
  }
}
