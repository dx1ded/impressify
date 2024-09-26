import * as Y from "yjs"
import type {
  YElement,
  YSlide,
  NormalizedYElement,
  NormalizedYSlide,
  YPresentation,
  NormalizedYPresentation,
} from "./types"

export function transformNormalizedToYSlide(slide: NormalizedYSlide) {
  const ySlide = new Y.Map() as YSlide

  ySlide.set("id", slide.id)
  ySlide.set("bg", slide.bg)
  ySlide.set("thumbnailUrl", slide.thumbnailUrl)
  ySlide.set("transition", slide.transition)

  const yElements = new Y.Array<YElement>()
  yElements.push(slide.elements.map((element) => transformNormalizedToYElement(element)))
  ySlide.set("elements", yElements)

  return ySlide
}

export function transformNormalizedToYElement(element: NormalizedYElement) {
  const yElement = new Y.Map() as YElement

  yElement.set("id", element.id)
  yElement.set("x", element.x)
  yElement.set("y", element.y)
  yElement.set("width", element.width)
  yElement.set("height", element.height)
  yElement.set("angle", element.angle)
  yElement.set("scaleX", element.scaleX)
  yElement.set("scaleY", element.scaleY)

  if (element.__typename === "Text") {
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
  } else if (element.__typename === "Image") {
    yElement.set("__typename", "Image")
    yElement.set("imageUrl", element.imageUrl)
  } else if (element.__typename === "Shape") {
    yElement.set("__typename", "Shape")
    yElement.set("type", element.type)
    yElement.set("fillColor", element.fillColor)
    yElement.set("strokeColor", element.strokeColor)
    yElement.set("strokeWidth", element.strokeWidth)
    yElement.set("proportional", element.proportional)
  }

  return yElement
}

export function normalizePresentation(yPresentation: YPresentation): NormalizedYPresentation {
  return {
    id: yPresentation.get("id"),
    name: yPresentation.get("name").toString(),
    editors: yPresentation.get("editors").toArray(),
    readers: yPresentation.get("readers").toArray(),
    ownerId: yPresentation.get("ownerId"),
    slides: yPresentation.get("slides").map(
      (ySlide): NormalizedYSlide => ({
        id: ySlide.get("id"),
        bg: ySlide.get("bg"),
        thumbnailUrl: ySlide.get("thumbnailUrl")!,
        transition: ySlide.get("transition")!,
        elements: ySlide.get("elements")!.map((yElement) => {
          const element = {
            __typename: yElement.get("__typename"),
            id: yElement.get("id"),
            x: yElement.get("x"),
            y: yElement.get("y"),
            width: yElement.get("width"),
            height: yElement.get("height"),
            angle: yElement.get("angle"),
            scaleX: yElement.get("scaleX"),
            scaleY: yElement.get("scaleY"),
          } as NormalizedYElement

          if (element.__typename === "Text") {
            element.text = yElement.get("text").toString()
            element.textColor = yElement.get("textColor")
            element.fillColor = yElement.get("fillColor")
            element.borderColor = yElement.get("borderColor")
            element.fontFamily = yElement.get("fontFamily")
            element.fontSize = yElement.get("fontSize")
            element.bold = yElement.get("bold")
            element.italic = yElement.get("italic")
            element.underlined = yElement.get("underlined")
            element.alignment = yElement.get("alignment")
            element.lineHeight = yElement.get("lineHeight")
          } else if (element.__typename === "Image") {
            element.imageUrl = yElement.get("imageUrl")
          } else {
            element.type = yElement.get("type")
            element.fillColor = yElement.get("fillColor")
            element.strokeColor = yElement.get("strokeColor")
            element.strokeWidth = yElement.get("strokeWidth")
            element.proportional = yElement.get("proportional")
          }

          return element
        }),
      }),
    ),
  }
}
