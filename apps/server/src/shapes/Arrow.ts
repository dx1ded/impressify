import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Arrow extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points">) {
    super(props)
    this.aspectRatio = null
    this.points = [
      [0, 0.5],
      [1, 0.5],
      [0.75, 0],
      [1, 0.5],
      [0.75, 1],
    ]
  }
}
