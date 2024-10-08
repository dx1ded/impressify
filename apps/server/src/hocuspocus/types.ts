import type { debounce } from "moderndash"
import type * as Y from "yjs"
import type { User } from "@clerk/clerk-sdk-node"
import type { TypedMap } from "yjs-types"
import type { Storage } from "firebase-admin/storage"
import type { PubSub } from "graphql-subscriptions"
import type { save } from "./save"
import type { Presentation } from "../entities/Presentation"
import type { PresentationUser } from "../entities/PresentationUser"
import type { Slide } from "../entities/Slide"
import type { Text } from "../entities/Text"
import type { Image } from "../entities/Image"
import type { Shape } from "../entities/Shape"

export interface HocuspocusContext {
  user: User | null
  debouncedSave: ReturnType<typeof debounce<typeof save>>
  storage: Storage
  pubsub: PubSub
}

export type WithHocuspocusContext<T> = Omit<T, "context"> & { context: HocuspocusContext }

export type NormalizedYPresentation = Pick<Presentation, "id" | "name"> & {
  slides: NormalizedYSlide[]
  users: NormalizedYUser[]
  template?: NormalizedYTemplate
}

export type NormalizedYSlide = Omit<Slide, "presentation" | "elements" | "position" | "createdAt"> & {
  elements: NormalizedYElement[]
}

export type NormalizedYElement =
  | (Omit<Text, "slide" | "position"> & {
      __typename: "Text"
    })
  | (Omit<Image, "slide" | "position"> & {
      __typename: "Image"
    })
  | (Omit<Shape, "slide" | "position"> & {
      __typename: "Shape"
    })

export type NormalizedYUser = Pick<PresentationUser, "role"> & {
  id: User["id"]
}

export type NormalizedYTemplate = {
  defaultBg: string
  defaultThumbnailUrl: string
}

export type YPresentation = TypedMap<
  Pick<Presentation, "id"> & {
    name: Y.Text
    slides: Y.Array<YSlide>
    users: Y.Array<YUser>
    template?: YTemplate
    isSaving: boolean
  }
>

export type YSlide = TypedMap<
  Omit<Slide, "presentation" | "elements" | "position" | "createdAt"> & {
    elements: Y.Array<YElement>
  }
>

export type YElement = YText & YImage & YShape

export type YText = TypedMap<
  Omit<Text, "slide" | "position" | "text"> & {
    __typename: "Text"
    text: Y.Text
  }
>

export type YImage = TypedMap<
  Omit<Image, "slide" | "position"> & {
    __typename: "Image"
  }
>

export type YShape = TypedMap<
  Omit<Shape, "slide" | "position"> & {
    __typename: "Shape"
  }
>

export type YUser = TypedMap<NormalizedYUser>
export type YTemplate = TypedMap<NormalizedYTemplate>

export type UserAwareness = {
  id: string
  name: string
  profilePicUrl: string
  color: string
  currentSlideId: string
  selectedId: string
  cursor: {
    x: number | null
    y: number | null
    isOutsideBoundaries: boolean
  }
}
