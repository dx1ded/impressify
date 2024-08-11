import _ from "lodash"
import type { ApolloContext } from ".."
import { Slide } from "../../entities/Slide"
import { Text } from "../../entities/Text"
import { Image } from "../../entities/Image"
import { Shape } from "../../entities/Shape"
import type { Resolvers } from "../__generated__"
import { elementRepository, presentationRepository } from "../../database"
import { isDataUrl } from "../../utils"
import { uploadImageToFirebaseStorage } from "../../helpers"

export default {
  Mutation: {
    async saveSlides(__, { presentationId, slides }, { user, storage }) {
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
            ? // Omit `elements` because we define it as an empty array later
              { ...previousSlideCopy, presentation, position: slideIndex, ..._.omit(slide, ["elements"]) }
            : new Slide({ presentation, position: slideIndex, ...slide })
          // We don't update elements here because ElementsInput has different view ({ text: [...], image: [...], shape: [...] })
          // We just make it as an empty array because we iterate `slide.elements` and change it later
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
          slide.elements.text.forEach(({ index, ...element }, elementIndex) => {
            // We try to find if element already exists to just update it and not create a new one using the constructor
            const elementAlreadyExists = previousSlideCopy?.elements.find((_element) => _element.id === element.id)
            if (elementAlreadyExists) {
              newSlide.elements[index] = { ...elementAlreadyExists, position: elementIndex, ...element }
            } else {
              newSlide.elements[index] = new Text({ ...element, position: elementIndex, slide: newSlide })
            }
          })
          slide.elements.image.forEach(({ index, ...element }, elementIndex) => {
            const elementAlreadyExists = previousSlideCopy?.elements.find((_element) => _element.id === element.id)
            if (elementAlreadyExists) {
              newSlide.elements[index] = { ...elementAlreadyExists, position: elementIndex, ...element }
            } else {
              newSlide.elements[index] = new Image({ ...element, position: elementIndex, slide: newSlide })
            }
          })
          slide.elements.shape.forEach(({ index, ...element }, elementIndex) => {
            const elementAlreadyExists = previousSlideCopy?.elements.find((_element) => _element.id === element.id)
            if (elementAlreadyExists) {
              newSlide.elements[index] = { ...elementAlreadyExists, position: elementIndex, ...element }
            } else {
              newSlide.elements[index] = new Shape({ ...element, position: elementIndex, slide: newSlide })
            }
          })

          return newSlide
        }),
      )
      await presentationRepository.save(presentation)
      return presentation.slides
    },
  },
  Slide: {
    async elements(parent) {
      const _elements = await elementRepository.find({
        where: { slide: { id: parent.id } },
        order: { position: "ASC" },
      })
      return _elements.map((element) => {
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
