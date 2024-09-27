import { PubSub } from "graphql-subscriptions"

export default new PubSub()

export enum EVENT {
  PRESENTATION_LIST_CHANGED = "PRESENTATION_LIST_CHANGED",
}
