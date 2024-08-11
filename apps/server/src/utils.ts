import type { UserWebhookEvent } from "@clerk/backend"

export const UserWebhookEventTypes: Record<string, UserWebhookEvent["type"]> = {
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",
}

export function isDataUrl(url: string) {
  return url.startsWith("data:")
}
