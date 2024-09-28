import * as Y from "yjs"
import { type fetchPayload, type storePayload, Hocuspocus } from "@hocuspocus/server"
import { Logger } from "@hocuspocus/extension-logger"
import { Database } from "@hocuspocus/extension-database"
import { onAuthenticate } from "./onAuthenticate"
import { onDisconnect } from "./onDisconnect"
import { updateYDocument } from "./update"
import type { WithHocuspocusContext, YPresentation } from "./types"
import { documentRepository, presentationRepository } from "../database"
import { Document } from "../entities/Document"

export default new Hocuspocus({
  onAuthenticate,
  onDisconnect,
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName, document }: WithHocuspocusContext<fetchPayload>) => {
        const doc = await documentRepository.findOne({
          where: { name: documentName },
          order: { id: "DESC" },
        })

        if (doc) return doc.data

        const presentationId = documentName.replace("presentation/", "")
        const presentation = await presentationRepository.findOne({
          relations: ["slides", "slides.elements", "users", "users.props"],
          where: { id: presentationId },
          order: {
            slides: {
              position: "ASC",
              elements: {
                position: "ASC",
              },
            },
          },
        })

        // Updating the document (all transformations and settings are inside the function)
        updateYDocument(document, presentation)

        // Encode the Yjs document state as a Uint8Array
        const yDocState = Y.encodeStateAsUpdate(document)

        // Create and save a new Document entity in the database
        const newDoc = new Document(documentName, yDocState)
        await documentRepository.save(newDoc)

        return yDocState
      },
      store: async ({ documentName, document, state, context }: WithHocuspocusContext<storePayload>) => {
        const yPresentation = document.getMap() as YPresentation
        if (!context.debouncedSave.pending()) {
          yPresentation.set("isSaving", true)
        }
        context.debouncedSave(document, context.pubsub)
        await documentRepository.save({ name: documentName, data: state })
      },
    }),
  ],
})
