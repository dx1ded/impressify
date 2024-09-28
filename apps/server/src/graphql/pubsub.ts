import { PubSub } from "graphql-subscriptions"

export default new PubSub()

export enum EVENT {
  PRESENTATION_UPDATED = "PRESENTATION_UPDATED",
}
