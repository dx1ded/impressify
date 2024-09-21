import type { TextConfig } from "konva/lib/shapes/Text"

import type { TextProps } from "~/entities/presentation"

export interface EditableTextConfig extends TextConfig, Partial<Pick<TextProps, "textColor" | "borderColor">> {
  borderWidth?: number
}
