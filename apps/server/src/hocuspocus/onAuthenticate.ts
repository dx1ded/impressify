import type { onAuthenticatePayload } from "@hocuspocus/server"
import { getContext } from "./getContext"
import { presentationRepository } from "../database"

export async function onAuthenticate({ token, documentName }: onAuthenticatePayload) {
  if (!token) throw new Error("Token is not provided")

  const context = await getContext(token)
  if (!context.user) throw new Error("Not authorized")

  const presentationId = documentName.replace("presentation/", "")
  if (!presentationId) throw new Error("No presentation id found")

  const presentationExists = await presentationRepository.existsBy({
    id: presentationId,
    users: { id: context.user.id },
  })
  if (!presentationExists) throw new Error("Presentation doesn't exist")

  return context
}
