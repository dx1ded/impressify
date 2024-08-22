import _ from "lodash"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { CustomDebouncedFunc } from "~/shared/lib"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isNotNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function ptToPx(pt: number) {
  return pt * 1.333
}

export function isColor(str: string) {
  return str.startsWith("rgb") || str.startsWith("#")
}

// I made a custom debounce fn upon the lodash one to have a pending state
export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): CustomDebouncedFunc<T> {
  let pending = false
  let lastArgs: Parameters<T> | undefined

  const debouncedFn = _.debounce(function (this: any, ...args: Parameters<T>) {
    pending = false
    lastArgs = undefined // Clear after execution
    fn.apply(this, args)
  }, wait)

  const wrappedFn = function (this: any, ...args: Parameters<T>) {
    pending = true
    lastArgs = args
    debouncedFn.apply(this, args)
  } as CustomDebouncedFunc<T>

  wrappedFn.pending = function () {
    return pending
  }

  wrappedFn.cancel = function () {
    pending = false
    lastArgs = undefined
    debouncedFn.cancel()
  }

  wrappedFn.flush = function () {
    pending = false
    debouncedFn.flush()
    lastArgs = undefined
    return undefined
  }

  wrappedFn.lastArgs = function () {
    return lastArgs
  }

  return wrappedFn
}

export function createImage(url: string) {
  const img = new Image()
  img.src = url
  img.crossOrigin = "anonymous"
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
