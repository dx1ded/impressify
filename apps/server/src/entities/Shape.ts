import { Column, ChildEntity } from "typeorm"
import { Element, type ElementConstructorProps } from "./Element"
import { Shape as IShape, ShapeType } from "../graphql/__generated__"

type ShapeConstructorProps = ElementConstructorProps & Shape

@ChildEntity()
export class Shape extends Element implements IShape {
  @Column({ type: "enum", enum: ShapeType })
  type: ShapeType

  @Column()
  fillColor: string

  @Column()
  strokeColor: string

  @Column()
  strokeWidth: number

  @Column()
  proportional: boolean

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
      type,
      fillColor,
      strokeColor,
      strokeWidth,
      proportional,
      slide,
    }: ShapeConstructorProps = {} as ShapeConstructorProps,
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
    this.type = type
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokeWidth
    this.proportional = proportional
  }
}
