import type { UserAwareness } from "@server/hocuspocus/types"

import { DEFAULT_USER_NAME } from "~/entities/user"

type getInitialAwarenessArgument = Pick<UserAwareness, "id" | "profilePicUrl" | "currentSlideId"> & {
  name: string | null
}

export function generateUserColor() {
  // Generate a random hue (0-360)
  const hue = Math.floor(Math.random() * 360)

  // Keep saturation high (70-100%) for vibrant colors
  const saturation = Math.floor(Math.random() * 30) + 70

  // Keep lightness in the mid-range (50-80%) for non-dark colors
  const lightness = Math.floor(Math.random() * 30) + 50

  // Return the HSL color string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function getInitialAwareness({
  id,
  name,
  profilePicUrl,
  currentSlideId,
}: getInitialAwarenessArgument): UserAwareness {
  const _name = name || DEFAULT_USER_NAME

  return {
    id,
    name: _name,
    profilePicUrl,
    color: generateUserColor(),
    currentSlideId,
    cursor: {
      x: null,
      y: null,
      isOutsideBoundaries: true,
    },
  }
}
