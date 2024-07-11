import dayjs from "dayjs"
import {
  Image as KonvaImage,
  Rect as KonvaRect,
  Line as KonvaLine,
  Circle as KonvaCircle,
  Arrow as KonvaArrow,
  Star as KonvaStar,
} from "react-konva"
import type { ImageConfig } from "konva/lib/shapes/Image"

import {
  type AddImageProps,
  type AddShapeProps,
  type AddTextProps,
  type ElementProps,
  type ImageProps,
  type ShapeProps,
  type ShapesConfig,
  type TextProps,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_SHAPE_HEIGHT,
  DEFAULT_SHAPE_WIDTH,
  DEFAULT_TEXT_HEIGHT,
  DEFAULT_TEXT_WIDTH,
} from "~/entities/presentation"
import { ptToPx } from "~/shared/lib"
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
    align: props.alignment,
    verticalAlign: "middle",
    wrap: "char",
    lineHeight: props.lineHeight,
  }
}

export const imageProps = (props: ElementProps): ImageConfig => {
  if (props.__typename !== "Image") return {} as ImageConfig
  const image = new Image()
  image.src = props.imageUrl
  return { image, height: props.height }
}

export const shapeProps = (props: ElementProps): ShapesConfig => {
  if (props.__typename === "Shape") {
    const commonProps = {
      fill: props.fillColor,
      stroke: props.strokeColor,
      strokeWidth: props.strokeWidth,
    }

    if (props.type === "line" || props.type === "arrow") {
      return { ...commonProps, points: [0, props.height / 2, props.width, props.height / 2] } as ShapesConfig
    }
    if (props.type === "star") {
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
    return element.type === "rectangle" || element.type === "square"
      ? KonvaRect
      : element.type === "line"
        ? KonvaLine
        : element.type === "circle"
          ? KonvaCircle
          : element.type === "arrow"
            ? KonvaArrow
            : KonvaStar
}

export const getTextConfig = (props: AddTextProps): TextProps => ({
  // Leave ...props on top because `height` (which is used for Image) is going to be 0
  ...props,
  __typename: "Text",
  id: Math.random(),
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
  id: Math.random(),
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
  id: Math.random(),
  width: DEFAULT_SHAPE_WIDTH,
  height: DEFAULT_SHAPE_HEIGHT,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  proportional: props.type === "square" || props.type === "circle",
  x: props.type === "circle" || props.type === "star" ? props.x : props.x - DEFAULT_SHAPE_WIDTH / 2,
  y: props.type === "circle" || props.type === "star" ? props.y : props.y - DEFAULT_SHAPE_HEIGHT / 2,
})
