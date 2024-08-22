import type { ArrowConfig } from "konva/lib/shapes/Arrow"
import type { CircleConfig } from "konva/lib/shapes/Circle"
import type { LineConfig } from "konva/lib/shapes/Line"
import type { RectConfig } from "konva/lib/shapes/Rect"
import type { StarConfig } from "konva/lib/shapes/Star"
import type { Image, Line, Rect, Circle, Arrow, Star } from "react-konva"

import type { FindUserPresentationsQuery, GetPresentationQuery, SlideFieldsFragment } from "~/__generated__/graphql"
import type { ArrayElement } from "~/shared/lib"
import type { EditableText } from "~/shared/ui/EditableText"

export type FindPresentationItem = ArrayElement<NonNullable<FindUserPresentationsQuery["findUserPresentations"]>>
export type Presentation = NonNullable<GetPresentationQuery["getPresentation"]>

export type Mode = "cursor" | "text" | "image" | "shape"
export type ShapesConfig = RectConfig & LineConfig & CircleConfig & ArrowConfig & StarConfig

export type Coordinates = { x: number; y: number }
export type AddElementPayload = Coordinates & { height: number }
export type AddTextProps = Coordinates & TextEditProps
export type AddImageProps = Coordinates & ImageEditProps
export type AddShapeProps = Coordinates & ShapeEditProps

export type SlideProps = SlideFieldsFragment
export type ElementProps = SlideProps["elements"][number]
export type SlideId = SlideProps["id"]
export type ElementId = ElementProps["id"]

export type TextProps = ElementProps & { __typename: "Text" }
export type ImageProps = ElementProps & { __typename: "Image" }
export type ShapeProps = ElementProps & { __typename: "Shape" }

export type TextEditProps = Pick<
  TextProps,
  | "textColor"
  | "fillColor"
  | "borderColor"
  | "fontFamily"
  | "fontSize"
  | "bold"
  | "italic"
  | "underlined"
  | "alignment"
  | "lineHeight"
>
export type ImageEditProps = Pick<ImageProps, "imageUrl" | "height">
export type ShapeEditProps = Pick<ShapeProps, "type" | "fillColor" | "strokeColor" | "strokeWidth">

export type ElementComponent =
  | typeof EditableText
  | typeof Image
  | typeof Line
  | typeof Rect
  | typeof Circle
  | typeof Arrow
  | typeof Star

export type HistoryAction = "UNDO" | "REDO"
export type HistoryRecord =
  | {
      type: "ADD"
      element: ElementProps
      position: number
    }
  | { type: "EDIT"; oldProps: Partial<ElementProps> }
  | { type: "DELETE"; id: ElementProps["id"] }
