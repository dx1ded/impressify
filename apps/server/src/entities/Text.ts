import { Column, ChildEntity } from "typeorm"
import { Element, type ElementConstructorProps } from "./Element"
import { Text as IText } from "../graphql/__generated__"

type TextConstructorProps = ElementConstructorProps & Text

@ChildEntity()
export class Text extends Element implements IText {
  @Column()
  text: string

  @Column()
  textColor: string

  @Column()
  fillColor: string

  @Column()
  borderColor: string

  @Column()
  fontFamily: string

  /**
   * in pt
   */
  @Column()
  fontSize: number

  @Column()
  bold: boolean

  @Column()
  italic: boolean

  @Column()
  underlined: boolean

  // "left" | "center" | "right"
  @Column()
  alignment: string

  @Column("float")
  lineHeight: number

  constructor(
    {
      id,
      x,
      y,
      width,
      height,
      angle,
      scaleX,
      scaleY,
      position,
      text,
      textColor,
      fillColor,
      borderColor,
      fontFamily,
      fontSize,
      bold,
      italic,
      underlined,
      alignment,
      lineHeight,
      slide,
    }: TextConstructorProps = {} as TextConstructorProps,
  ) {
    super({
      id,
      x,
      y,
      width,
      height,
      angle,
      scaleX,
      scaleY,
      position,
      slide,
    })
    this.text = text
    this.textColor = textColor
    this.fillColor = fillColor
    this.borderColor = borderColor
    this.fontFamily = fontFamily
    this.fontSize = fontSize
    this.bold = bold
    this.italic = italic
    this.underlined = underlined
    this.alignment = alignment
    this.lineHeight = lineHeight
  }
}
