import { type Storage, getDownloadURL } from "firebase-admin/storage"

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
