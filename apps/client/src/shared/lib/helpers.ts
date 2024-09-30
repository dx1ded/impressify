import { ref, getStorage, getDownloadURL, uploadString } from "firebase/storage"

import { convertFileToDataUrl } from "~/shared/lib"

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

export async function convertImageToDataUrl(imageUrl: string) {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`)
    }

    const blob = await response.blob()
    return convertFileToDataUrl(new File([blob], "image", { type: "image/png" }))
  } catch (error) {
    throw new Error(`Could not copy image to storage: ${error}`)
  }
}
