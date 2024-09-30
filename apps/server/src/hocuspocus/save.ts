import type * as Y from "yjs"
import type { PubSub } from "graphql-subscriptions"
import type { Storage } from "firebase-admin/storage"
import type { YPresentation } from "./types"
import { normalizePresentation } from "./transform"
import { type PresentationUpdate, PresentationUpdateType } from "../graphql/__generated__"
import { EVENT } from "../graphql/pubsub"
import { isDataUrl } from "../utils"
import { uploadImageToFirebaseStorage } from "../helpers"
import { presentationRepository } from "../database"
import { Slide } from "../entities/Slide"
import { Text } from "../entities/Text"
import { Image } from "../entities/Image"
import { Shape } from "../entities/Shape"

export async function save(document: Y.Doc, storage: Storage, pubsub: PubSub) {
  const yPresentation = document.getMap() as YPresentation
  // Omitting `users` (just in case)
  const { users, ...normalizedPresentation } = normalizePresentation(yPresentation)
  const presentation = await presentationRepository.findOne({
    relations: ["slides", "slides.elements", "slides.presentation", "users", "users.props"],
    where: { id: normalizedPresentation.id },
  })
  if (!presentation) return

  presentation.name = normalizedPresentation.name
  presentation.slides = await Promise.all(
    normalizedPresentation.slides.map(async ({ elements, ...normalizedSlide }, slideIndex) => {
      const previousSlideCopy = presentation.slides.find((_slide) => _slide.id === normalizedSlide.id)
      const newSlide = previousSlideCopy
        ? { ...previousSlideCopy, ...normalizedSlide, position: slideIndex }
        : new Slide({ presentation, position: slideIndex, ...normalizedSlide })

      if (isDataUrl(newSlide.thumbnailUrl)) {
        newSlide.thumbnailUrl = await uploadImageToFirebaseStorage(
          storage,
          newSlide.thumbnailUrl,
          `${presentation.id}/${newSlide.id}/thumbnail`,
        )
        yPresentation.get("slides").get(slideIndex).set("thumbnailUrl", newSlide.thumbnailUrl)
      }

      newSlide.elements = elements.map(({ __typename, ...normalizedElement }, elementIndex) => {
        const previousElementCopy = previousSlideCopy?.elements.find((_element) => _element.id === normalizedElement.id)
        const ElementConstructor = __typename === "Text" ? Text : __typename === "Image" ? Image : Shape
        return previousElementCopy
          ? { ...previousElementCopy, ...normalizedElement }
          : new ElementConstructor({ ...normalizedElement, slide: newSlide, position: elementIndex } as Text &
              Image &
              Shape)
      })

      return newSlide
    }),
  )

  // Checking if presentation still exists because it may have been deleted while executing the function
  const presentationStillExists = await presentationRepository.existsBy({ id: presentation.id })
  if (presentationStillExists) {
    // Publishing updates to users (if applicable)
    if (
      presentation.name !== yPresentation.get("name").toJSON() ||
      presentation.slides[0].thumbnailUrl !== yPresentation.get("slides").get(0).get("thumbnailUrl")
    ) {
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationListUpdated: {
          type: PresentationUpdateType.Changed,
          presentation,
        } as PresentationUpdate,
      })
    }

    // Saving presentation
    await presentationRepository.save(presentation)
  }

  yPresentation.set("isSaving", false)
}
