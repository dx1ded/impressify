import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function ptToPx(pt: number) {
  return pt * 1.333
}

export function isColor(str: string) {
  return str.startsWith("rgb") || str.startsWith("#")
}

export function createImage(url: string) {
  const img = new Image()
  img.src = url
  return img
}

export function convertFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => resolve(fileReader.result!.toString())
    fileReader.onerror = (error) => reject(error)
  })
}

export function getNormalizedImageHeight(dataUrl: string, width: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const aspectRatio = img.width / img.height
      const targetHeight = width / aspectRatio
      resolve(targetHeight)
    }
    img.onerror = (error) => {
      reject(error)
    }
    img.src = dataUrl
  })
}
