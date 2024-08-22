import _ from "lodash"
import type { ApolloContext } from ".."
import { elementRepository, presentationRepository } from "../../database"
import { Image } from "../../entities/Image"
import { Shape } from "../../entities/Shape"
import { Slide } from "../../entities/Slide"
import { Text } from "../../entities/Text"
import { uploadImageToFirebaseStorage } from "../../helpers"
import { EVENT } from "../../pubsub"
import { isDataUrl } from "../../utils"
import { PresentationOperation, type PresentationState, type Resolvers } from "../__generated__"

export default {
  Mutation: {
    async saveSlides(__, { presentationId, slides }, { user, storage, pubsub, connections }) {
      if (!user || !slides.length) return null
      /*
        By the way, we're working with presentationRepository (not slideRepository) because slides cannot exist if they're not
        ... connected to a presentation. Since we need to update presentation.slides (when they change) it's more convenient
        ... with presentation because it updates both presentation and slides at the same time.
      */
      const presentation = await presentationRepository.findOne({
        relations: ["slides", "slides.elements", "users"],
        where: { id: presentationId },
      })
      // Return null if presentation not found OR user has nothing to do with the presentation
      if (!presentation || !presentation.users.find((_user) => _user.id === user.id)) return null
      presentation.slides = await Promise.all(
        slides.map(async (slide, slideIndex) => {
          const previousSlideCopy: Slide | undefined = presentation.slides.find((_slide) => _slide.id === slide.id)
          const newSlide = previousSlideCopy
            ? // Omit `elements` because it's not the structure type as in the schema, so we just iterate it later
              { ...previousSlideCopy, presentation, position: slideIndex, ..._.omit(slide, ["elements"]) }
            : new Slide({ presentation, position: slideIndex, ...slide })

          newSlide.elements = []

          // We upload dataUrl pics to Firebase Storage and then replace these urls with the generated url
          // First we start with thumbnail url
          if (isDataUrl(newSlide.thumbnailUrl)) {
            newSlide.thumbnailUrl = await uploadImageToFirebaseStorage(
              storage,
              newSlide.thumbnailUrl,
              `${newSlide.id}/thumbnail`,
            )
          }
          // Then we go to bg (which might be an image as well)
          if (isDataUrl(newSlide.bg)) {
            newSlide.bg = await uploadImageToFirebaseStorage(storage, newSlide.bg, `${newSlide.id}/bgColor`)
          }
          // Then we iterate `slide.elements` to transform its structure (again, because of GraphQL limitations)
          // In addition, for Image we upload `imageUrl` (if that's a dataUrl) to Firebase Storage
          // Also, we use create a new instance even for elements that already exist because we need its metadata and it's just easier
          slide.elements.text.forEach(({ position, ...element }) => {
            const elementAlreadyExists = previousSlideCopy?.elements.find((_element) => _element.id === element.id)
            newSlide.elements[position] = new Text({
              ...(elementAlreadyExists || {}),
              ...element,
              position,
              slide: newSlide,
            })
          })
          // Had to use `.map` over here because `.forEach` can't have async functions as an callback
          await Promise.all(
            slide.elements.image.map(async ({ position, ...element }) => {
              const elementAlreadyExists = previousSlideCopy?.elements.find((_element) => _element.id === element.id)
              newSlide.elements[position] = new Image({
                ...(elementAlreadyExists || {}),
                ...element,
                position,
                imageUrl: isDataUrl(element.imageUrl)
                  ? await uploadImageToFirebaseStorage(
                      storage,
                      element.imageUrl,
                      `${newSlide.id}/elements/${element.id}`,
                    )
                  : element.imageUrl,
                slide: newSlide,
              })
            }),
          )
          slide.elements.shape.forEach(({ position, ...element }) => {
            const elementAlreadyExists = previousSlideCopy?.elements.find((_element) => _element.id === element.id)
            newSlide.elements[position] = new Shape({
              ...(elementAlreadyExists || {}),
              ...element,
              position,
              slide: newSlide,
            })
          })

          return newSlide
        }),
      )

      // Updating connection as well so new users that join have the latest copy of it
      connections.updateSynchronizedState(presentationId, { slides: presentation.slides, isSaving: false })
      await presentationRepository.save(presentation)
      await pubsub.publish(EVENT.PRESENTATION_UPDATED, {
        presentationUpdated: {
          operation: PresentationOperation.Update,
          slides: presentation.slides,
          isSaving: false,
          _userUpdatedStateId: user.id,
          _presentationId: presentationId,
        } as PresentationState,
      })
      return presentation.slides
    },
  },
  Slide: {
    async elements(parent, _, __, info) {
      // This is done for subscriptions. It would pass an object (which is not slide) with ready elements, so no need to find them in database
      // ... we only want to transform them to GraphQL-format with `__typename` prop
      const elements =
        info.operation.operation === "subscription"
          ? parent.elements
          : await elementRepository.find({
              where: { slide: { id: parent.id } },
              order: { position: "ASC" },
            })

      return elements.map((element) => {
        if (element instanceof Text) {
          return { __typename: "Text", ...element }
        }
        if (element instanceof Image) {
          return { __typename: "Image", ...element }
        }
        return { __typename: "Shape", ...element }
      })
    },
  },
} as Resolvers<ApolloContext>
