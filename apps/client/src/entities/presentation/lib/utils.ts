import dayjs from "dayjs"
import {
  Text as KonvaText,
  Image as KonvaImage,
  Rect as KonvaRect,
  Line as KonvaLine,
  Circle as KonvaCircle,
  Arrow as KonvaArrow,
  Star as KonvaStar,
} from "react-konva"
import type { ImageConfig } from "konva/lib/shapes/Image"
import type { TextConfig } from "konva/lib/shapes/Text"

import type {
  AddImagePayload,
  AddShapePayload,
  AddTextPayload,
  ElementProps,
  ShapesConfig,
} from "~/entities/presentation"

export const formatDate = (timestamp: number) => {
  const dateNow = Date.now()
  const dayjsInstance = dayjs(timestamp)

  return dateNow - 1000 * 60 * 60 * 24 < timestamp
    ? dayjsInstance.format("h.mm a")
    : dateNow - 1000 * 60 * 60 * 48 < timestamp
      ? `Yesterday, ${dayjsInstance.format("h.mm a")}`
      : dayjsInstance.format("MMM D, YYYY")
}

export const textProps = (props: ElementProps): TextConfig => {
  return props.__typename === "Text"
    ? {
        text: props.text,
        fill: props.textColor,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        fontStyle: props.bold ? `${props.italic ? "italic" : ""} 700` : `${props.italic ? "italic" : ""} 400`,
        textDecoration: props.underlined ? "underline" : "",
        align: props.alignment,
        lineHeight: props.lineHeight,
      }
    : {}
}

export const imageProps = (props: ElementProps): ImageConfig => {
  if (props.__typename !== "Image") return {} as ImageConfig
  const image = new Image()
  image.src = props.imageUrl
  return { image }
}

export const shapeProps = (props: ElementProps): ShapesConfig => {
  if (props.__typename === "Shape") {
    const commonProps = {
      fill: props.fillColor,
      stroke: props.strokeColor,
      strokeWidth: props.strokeWidth,
    }

    if (props.type === "arrow") {
      return { ...commonProps, points: [0, 0, props.width / 2, props.height / 2] } as ShapesConfig
    }

    return commonProps as ShapesConfig
  }

  return {} as ShapesConfig
}

export const getElement = (element: ElementProps) => {
  if (element.__typename === "Text") return KonvaText
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

export const getDefaultTextConfig = (props: AddTextPayload): ElementProps & { __typename: "Text" } => ({
  __typename: "Text",
  id: Math.random(),
  x: props.x,
  y: props.y,
  width: 50,
  height: 50,
  angle: 0,
  text: "Text",
  fillColor: "#fff",
  borderColor: "#000",
  textColor: "#000",
  fontFamily: "Arial",
  fontSize: 20,
  bold: false,
  italic: false,
  underlined: false,
  alignment: "left",
  lineHeight: 1,
})

export const getDefaultImageConfig = (props: AddImagePayload): ElementProps & { __typename: "Image" } => ({
  __typename: "Image",
  id: Math.random(),
  imageUrl: props.imageUrl,
  x: props.x,
  y: props.y,
  width: 200,
  height: 200,
  angle: 0,
})

export const getDefaultShapeConfig = (props: AddShapePayload): ElementProps & { __typename: "Shape" } => ({
  __typename: "Shape",
  id: Math.random(),
  type: props.type,
  x: props.x,
  y: props.y,
  width: 200,
  height: 200,
  angle: 0,
  fillColor: "#000",
  strokeColor: "#000",
  strokeWidth: 0,
  proportional: props.type === "square" || props.type === "circle",
})
