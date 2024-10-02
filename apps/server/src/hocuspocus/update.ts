import * as Y from "yjs"
import type { Document } from "@hocuspocus/server"
import type { YPresentation, YSlide, YElement, YUser, YTemplate } from "./types"
import { transformNormalizedToYUser } from "./transform"
import type { Presentation } from "../entities/Presentation"
import { Text } from "../entities/Text"
import { Image } from "../entities/Image"
import { Shape } from "../entities/Shape"

export function updateYDocument(document: Document, presentation: Presentation) {
  const yMap = document.getMap() as YPresentation
  yMap.set("id", presentation.id)
  yMap.set("name", new Y.Text(presentation.name))

  const yUsers = new Y.Array<YUser>()
  yUsers.push(presentation.users.map((user) => transformNormalizedToYUser({ id: user.props.id, role: user.role })))
  yMap.set("users", yUsers)

  if (presentation.template) {
    const yTemplate = new Y.Map() as YTemplate
    yTemplate.set("defaultBg", presentation.template.defaultBg)
    yTemplate.set("defaultThumbnailUrl", presentation.template.defaultThumbnailUrl)
    yMap.set("template", yTemplate)
  }

  const ySlides = new Y.Array<YSlide>()
  ySlides.push(
    presentation.slides.map(({ elements, ...slide }) => {
      const ySlide = new Y.Map() as YSlide

      ySlide.set("id", slide.id)
      ySlide.set("bg", slide.bg)
      ySlide.set("thumbnailUrl", slide.thumbnailUrl)
      ySlide.set("transition", slide.transition)

      const yElements = new Y.Array<YElement>()

      elements.forEach((element) => {
        const yElement = new Y.Map() as YElement

        yElement.set("id", element.id)
        yElement.set("x", element.x)
        yElement.set("y", element.y)
        yElement.set("width", element.width)
        yElement.set("height", element.height)
        yElement.set("angle", element.angle)
        yElement.set("scaleX", element.scaleX)
        yElement.set("scaleY", element.scaleY)

        if (element instanceof Text) {
          yElement.set("__typename", "Text")
          yElement.set("text", new Y.Text(element.text))
          yElement.set("textColor", element.textColor)
          yElement.set("fillColor", element.fillColor)
          yElement.set("borderColor", element.borderColor)
          yElement.set("fontFamily", element.fontFamily)
          yElement.set("fontSize", element.fontSize)
          yElement.set("bold", element.bold)
          yElement.set("italic", element.italic)
          yElement.set("underlined", element.underlined)
          yElement.set("alignment", element.alignment)
          yElement.set("lineHeight", element.lineHeight)
        } else if (element instanceof Image) {
          yElement.set("__typename", "Image")
          yElement.set("imageUrl", element.imageUrl)
        } else if (element instanceof Shape) {
          yElement.set("__typename", "Shape")
          yElement.set("type", element.type)
          yElement.set("fillColor", element.fillColor)
          yElement.set("strokeColor", element.strokeColor)
          yElement.set("strokeWidth", element.strokeWidth)
          yElement.set("proportional", element.proportional)
        }

        yElements.push([yElement])
      })

      ySlide.set("elements", yElements)
      return ySlide
    }),
  )
  yMap.set("slides", ySlides)
}
