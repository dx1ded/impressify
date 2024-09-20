import type { onDisconnectPayload } from "@hocuspocus/server"
import type { WithHocuspocusContext } from "./types"
import { save } from "./save"
import { documentRepository } from "../database"

export async function onDisconnect({
  clientsCount,
  documentName,
  document,
}: WithHocuspocusContext<onDisconnectPayload>) {
  if (clientsCount !== 0) return
  await documentRepository.delete({ name: documentName })
  await save(document)
  document.destroy()
}
