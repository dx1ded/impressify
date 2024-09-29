import type { onDisconnectPayload } from "@hocuspocus/server"
import type { WithHocuspocusContext, YPresentation } from "./types"
import { save } from "./save"
import { documentRepository } from "../database"

export async function onDisconnect({
  clientsCount,
  documentName,
  document,
  context,
}: WithHocuspocusContext<onDisconnectPayload>) {
  if (clientsCount !== 0) return
  await documentRepository.delete({ name: documentName })
  const yPresentation = document.getMap() as YPresentation
  if (yPresentation.get("isSaving")) {
    await save(document, context.pubsub)
  }
}
