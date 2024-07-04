import { Column, ChildEntity } from "typeorm"
import { Element } from "./Element"
import { Shape as IShape } from "../graphql/__generated__"

@ChildEntity()
export class Shape extends Element implements IShape {
  @Column()
  type: string

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
      x,
      y,
      width,
      height,
      angle,
      scaleX,
      scaleY,
      fillColor,
      strokeColor,
      strokeWidth,
      slide,
    }: Omit<Element, "id"> & Omit<Shape, "type" | "proportional"> = {} as Omit<Element, "id"> &
      Omit<Shape, "type" | "proportional">,
  ) {
    super({
      x,
      y,
      width,
      height,
      angle,
      scaleX,
      scaleY,
      slide,
    })
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokeWidth
  }
}
