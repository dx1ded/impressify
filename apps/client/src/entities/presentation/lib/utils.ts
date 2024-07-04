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
import type { TextConfig } from "konva/lib/shapes/Text"

import {
  type AddImagePayload,
  type AddShapePayload,
  type AddTextPayload,
  DEFAULT_BORDER_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TEXT_HEIGHT,
  DEFAULT_TEXT_WIDTH,
  type ElementProps,
  type ImageProps,
  type ShapeProps,
  type ShapesConfig,
  type TextProps,
} from "~/entities/presentation"
import { EditableText } from "~/entities/presentation/ui/EditableText"
import { ptToPx } from "~/shared/lib"

export const formatDate = (timestamp: number) => {
  const dateNow = Date.now()
  const dayjsInstance = dayjs(timestamp)

  return dateNow - 1000 * 60 * 60 * 24 < timestamp
    ? dayjsInstance.format("h.mm a")
    : dateNow - 1000 * 60 * 60 * 48 < timestamp
      ? `Yesterday, ${dayjsInstance.format("h.mm a")}`
      : dayjsInstance.format("MMM D, YYYY")
}

export const getTextBoxDimensions = ({
  text,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
}: {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
}) => {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")!

  context.font = `${fontWeight} ${fontSize}pt ${fontFamily}`
  const metrics = context.measureText(text)

  return { width: metrics.width, height: fontSize * lineHeight }
}

export const textProps = (props: ElementProps): TextConfig => {
  if (props.__typename !== "Text") return {}
  // const { width, height } = getTextBoxDimensions({
  //   text: props.text,
  //   fontFamily: props.fontFamily,
  //   fontSize: props.fontSize,
  //   fontWeight: props.bold ? 700 : 400,
  //   lineHeight: props.lineHeight,
  // })

  return {
    // width,
    // height,
    text: props.text,
    fill: props.textColor,
    fontFamily: props.fontFamily,
    fontSize: ptToPx(props.fontSize),
    fontStyle: props.bold ? `${props.italic ? "italic" : ""} 700` : `${props.italic ? "italic" : ""} 400`,
    textDecoration: props.underlined ? "underline" : "",
    align: props.alignment,
    verticalAlign: "middle",
    lineHeight: props.lineHeight,
  }
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

export const getDefaultTextConfig = (props: AddTextPayload): TextProps => ({
  __typename: "Text",
  id: Math.random(),
  x: props.x,
  y: props.y,
  width: DEFAULT_TEXT_WIDTH,
  height: DEFAULT_TEXT_HEIGHT,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  text: "Some text",
  fillColor: DEFAULT_FILL_COLOR,
  borderColor: DEFAULT_BORDER_COLOR,
  textColor: DEFAULT_TEXT_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  bold: false,
  italic: false,
  underlined: false,
  alignment: "left",
  lineHeight: 1,
})

export const getDefaultImageConfig = (props: AddImagePayload): ImageProps => ({
  __typename: "Image",
  id: Math.random(),
  imageUrl: props.imageUrl,
  x: props.x,
  y: props.y,
  width: 200,
  height: 200,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
})

export const getDefaultShapeConfig = (props: AddShapePayload): ShapeProps => ({
  __typename: "Shape",
  id: Math.random(),
  type: props.type,
  x: props.x,
  y: props.y,
  width: 200,
  height: 200,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  fillColor: "#000",
  strokeColor: "#000",
  strokeWidth: 0,
  proportional: props.type === "square" || props.type === "circle",
})
