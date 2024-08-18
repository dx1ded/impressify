import type { Slide } from "./graphql/__generated__"

export interface ConnectionState {
  name: string | null
  slides: Slide[]
  isSaving: boolean
}
