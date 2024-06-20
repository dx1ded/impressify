import { Column, ChildEntity } from "typeorm"
import { Element } from "./Element"
import { Shape as IShape } from "../graphql/__generated__"

@ChildEntity()
export class Shape extends Element implements IShape {
  @Column()
  fillColor: string

  @Column()
  strokeColor: string

  @Column()
  strokeWidth: number

  @Column()
  aspectRatio: string

  @Column("int", { array: true })
  points: number[][]

  constructor(
    {
      layer,
      x1,
      y1,
      x2,
      y2,
      angle,
      fillColor,
      strokeColor,
      strokeWidth,
      slide,
    }: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points"> = {} as Omit<Element, "id"> &
      Omit<Shape, "aspectRatio" | "points">,
  ) {
    super({
      layer,
      x1,
      y1,
      x2,
      y2,
      angle,
      slide,
    })
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.strokeWidth = strokeWidth
  }
}
