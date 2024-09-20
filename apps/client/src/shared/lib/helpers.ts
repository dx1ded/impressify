import { ref, getStorage, getDownloadURL, uploadString } from "firebase/storage"

/**
 * @param dataUrl
 * @param path
 * will be used to insert the image to Firebase Storage. Do not include extension
 */
export async function uploadImageToStorage(dataUrl: string, path: string) {
  const imageStorageRef = ref(getStorage(), `${path}.png`)

  try {
    await uploadString(imageStorageRef, dataUrl, "data_url")
  } catch (e) {
    throw new Error(`Could not upload image to storage: ${e}`)
  }

  return getDownloadURL(imageStorageRef)
}
