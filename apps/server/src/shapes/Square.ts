import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Square extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points">) {
    super(props)
    this.aspectRatio = "1/1"
    this.points = [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 0],
      [0, 0],
    ]
  }
}
