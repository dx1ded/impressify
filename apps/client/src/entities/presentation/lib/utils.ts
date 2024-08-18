import dayjs from "dayjs"
import type { ImageConfig } from "konva/lib/shapes/Image"
import { nanoid } from "nanoid"
import {
  Arrow as KonvaArrow,
  Circle as KonvaCircle,
  Image as KonvaImage,
  Line as KonvaLine,
  Rect as KonvaRect,
  Star as KonvaStar,
} from "react-konva"

import {
  type ImageInput,
  type ShapeInput,
  type SlideInput,
  type TextInput,
  Alignment,
  ShapeType,
  Transition,
} from "~/__generated__/graphql"
import {
  type AddImageProps,
  type AddShapeProps,
  type AddTextProps,
  type ElementId,
  type ElementProps,
  type ImageProps,
  type ShapeProps,
  type ShapesConfig,
  type SlideProps,
  type TextProps,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_SHAPE_HEIGHT,
  DEFAULT_SHAPE_WIDTH,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TEXT_HEIGHT,
  DEFAULT_TEXT_WIDTH,
  EDIT_ELEMENT_ID,
} from "~/entities/presentation"
import { createImage, ptToPx } from "~/shared/lib"
import { EditableText, type EditableTextConfig } from "~/shared/ui/EditableText"

export const formatDate = (timestamp: number) => {
  const dateNow = Date.now()
  const dayjsInstance = dayjs(timestamp)

  return dateNow - 1000 * 60 * 60 * 24 < timestamp
    ? dayjsInstance.format("h.mm a")
    : dateNow - 1000 * 60 * 60 * 48 < timestamp
      ? `Yesterday, ${dayjsInstance.format("h.mm a")}`
      : dayjsInstance.format("MMM D, YYYY")
}

export const generateEditElementId = (id: ElementId) => `${EDIT_ELEMENT_ID}-${id}`

export const textProps = (props: ElementProps): EditableTextConfig => {
  if (props.__typename !== "Text") return {}

  return {
    text: props.text,
    textColor: props.textColor,
    fill: props.fillColor,
    borderColor: props.borderColor,
    fontFamily: props.fontFamily,
    fontSize: ptToPx(props.fontSize),
    fontStyle: props.bold ? `${props.italic ? "italic" : "normal"} 700` : `${props.italic ? "italic" : "normal"} 400`,
    textDecoration: props.underlined ? "underline" : "",
    align: props.alignment === Alignment.Left ? "left" : props.alignment === Alignment.Center ? "center" : "right",
    verticalAlign: "middle",
    wrap: "char",
    lineHeight: props.lineHeight,
  }
}

export const imageProps = (props: ElementProps): ImageConfig => {
  if (props.__typename !== "Image") return {} as ImageConfig
  return { image: createImage(props.imageUrl), height: props.height }
}

export const shapeProps = (props: ElementProps): ShapesConfig => {
  if (props.__typename === "Shape") {
    const commonProps = {
      fill: props.fillColor,
      stroke: props.strokeColor,
      strokeWidth: props.strokeWidth,
    }

    if (props.type === ShapeType.Line || props.type === ShapeType.Arrow) {
      return { ...commonProps, points: [0, 0, props.width, 0] } as ShapesConfig
    }
    if (props.type === ShapeType.Star) {
      return { ...commonProps, numPoints: 5, innerRadius: 30, outerRadius: 70 } as ShapesConfig
    }

    return commonProps as ShapesConfig
  }

  return {} as ShapesConfig
}

export const getElement = (element: ElementProps) => {
  if (element.__typename === "Text") return EditableText
  if (element.__typename === "Image") return KonvaImage
  if (element.__typename === "Shape")
    return element.type === ShapeType.Rectangle || element.type === ShapeType.Square
      ? KonvaRect
      : element.type === ShapeType.Line
        ? KonvaLine
        : element.type === ShapeType.Circle
          ? KonvaCircle
          : element.type === ShapeType.Arrow
            ? KonvaArrow
            : KonvaStar
}

export const getAnchors = (element: ElementProps) => {
  if (element.__typename === "Shape") {
    if (element.proportional) return ["top-left", "top-right", "bottom-left", "bottom-right"]
    if (element.type === ShapeType.Arrow || element.type === ShapeType.Line) return ["middle-left", "middle-right"]
  }
  return [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "middle-left",
    "middle-right",
    "bottom-center",
    "top-center",
  ]
}

export const getSlideConfig = (): SlideProps => ({
  id: nanoid(8),
  elements: [],
  bg: "rgb(255, 255, 255)",
  transition: Transition.None,
  thumbnailUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/erDEdIAAAAASUVORK5CYII=",
})

export const getTextConfig = (props: AddTextProps): TextProps => ({
  // Leave ...props on top because `height` (which is used for Image) is going to be 0
  ...props,
  __typename: "Text",
  id: nanoid(8),
  width: DEFAULT_TEXT_WIDTH,
  height: DEFAULT_TEXT_HEIGHT,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  text: "",
  x: props.x - DEFAULT_TEXT_WIDTH / 2,
  y: props.y - DEFAULT_TEXT_HEIGHT / 2,
})

export const getImageConfig = (props: AddImageProps): ImageProps => ({
  ...props,
  __typename: "Image",
  id: nanoid(8),
  width: DEFAULT_IMAGE_WIDTH,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  x: props.x - DEFAULT_IMAGE_WIDTH / 2,
  y: props.y - props.height / 2,
})

export const getShapeConfig = (props: AddShapeProps): ShapeProps => ({
  // Leave ...props on top because `height` (which is used for Image) is going to be 0
  ...props,
  __typename: "Shape",
  id: nanoid(8),
  width: DEFAULT_SHAPE_WIDTH,
  height: props.type === ShapeType.Line || props.type === ShapeType.Arrow ? DEFAULT_STROKE_WIDTH : DEFAULT_SHAPE_HEIGHT,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  proportional: props.type === ShapeType.Square || props.type === ShapeType.Circle,
  x: [ShapeType.Circle, ShapeType.Star].includes(props.type) ? props.x : props.x - DEFAULT_SHAPE_WIDTH / 2,
  y: [ShapeType.Circle, ShapeType.Star, ShapeType.Line, ShapeType.Arrow].includes(props.type)
    ? props.y
    : props.y - DEFAULT_SHAPE_HEIGHT / 2,
})

export const transformSlidesIntoInput = (slides: SlideProps[]): SlideInput[] =>
  slides.map(({ __typename, ...slide }) => ({
    // `__typename` is omitted by the deconstruction
    ...slide,
    // For elements, we filter items by text, image, and shape. In addition, for each field we remove `__typename` because
    // ... it's not present in the TextInput | ImageInput | ShapeInput definitions
    elements: {
      text: slide.elements
        .filter((element) => element.__typename === "Text")
        .map(
          ({ __typename, ...element }) =>
            ({
              ...element,
              position: slide.elements.findIndex((_element) => _element.id === element.id),
            }) as TextInput,
        ),
      image: slide.elements
        .filter((element) => element.__typename === "Image")
        .map(
          ({ __typename, ...element }) =>
            ({
              ...element,
              position: slide.elements.findIndex((_element) => _element.id === element.id),
            }) as ImageInput,
        ),
      shape: slide.elements
        .filter((element) => element.__typename === "Shape")
        .map(
          ({ __typename, ...element }) =>
            ({
              ...element,
              position: slide.elements.findIndex((_element) => _element.id === element.id),
            }) as ShapeInput,
        ),
    },
  }))
