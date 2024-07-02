import type { ArrowConfig } from "konva/lib/shapes/Arrow"
import type { CircleConfig } from "konva/lib/shapes/Circle"
import type { LineConfig } from "konva/lib/shapes/Line"
import type { RectConfig } from "konva/lib/shapes/Rect"
import type { StarConfig } from "konva/lib/shapes/Star"
import type { Text, Image, Line, Rect, Circle, Arrow, Star } from "react-konva"

import type { FindUserPresentationsQuery, GetPresentationQuery } from "~/__generated__/graphql"
import type { ArrayElement } from "~/shared/lib"

export type FindPresentationItem = ArrayElement<NonNullable<FindUserPresentationsQuery["findUserPresentations"]>>
export type Presentation = NonNullable<GetPresentationQuery["getPresentation"]>

export type Mode = "cursor" | "text" | "image" | "shape"
export type Shapes = "line" | "square" | "rectangle" | "circle" | "arrow" | "star"
export type ShapesConfig = RectConfig & LineConfig & CircleConfig & ArrowConfig & StarConfig

export type Coordinates = { x: number; y: number }
export type AddTextPayload = Coordinates
export type AddImagePayload = Coordinates & { imageUrl: string }
export type AddShapePayload = Coordinates & { type: string }

export type ElementProps = Presentation["slides"][number]["elements"][number]
export type ElementComponent =
  | typeof Text
  | typeof Image
  | typeof Line
  | typeof Rect
  | typeof Circle
  | typeof Arrow
  | typeof Star
