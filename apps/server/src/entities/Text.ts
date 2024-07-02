import { Column, ChildEntity } from "typeorm"
import { Element } from "./Element"
import { Text as IText } from "../graphql/__generated__"

@ChildEntity()
export class Text extends Element implements IText {
  @Column()
  text: string

  @Column()
  fillColor: string

  @Column()
  borderColor: string

  @Column()
  textColor: string

  @Column()
  fontFamily: string

  @Column()
  fontSize: number

  @Column()
  bold: boolean

  @Column()
  italic: boolean

  @Column()
  underlined: boolean

  @Column()
  alignment: "left" | "center" | "right"

  @Column()
  lineHeight: number

  constructor(
    {
      x,
      y,
      width,
      height,
      angle,
      fillColor,
      borderColor,
      textColor,
      fontFamily,
      fontSize,
      bold,
      italic,
      underlined,
      alignment,
      lineHeight,
      slide,
    }: Omit<Element, "id"> & Text = {} as Omit<Element, "id"> & Text,
  ) {
    super({
      x,
      y,
      width,
      height,
      angle,
      slide,
    })
    this.fillColor = fillColor
    this.borderColor = borderColor
    this.textColor = textColor
    this.fontFamily = fontFamily
    this.fontSize = fontSize
    this.bold = bold
    this.italic = italic
    this.underlined = underlined
    this.alignment = alignment
    this.lineHeight = lineHeight
  }
}
