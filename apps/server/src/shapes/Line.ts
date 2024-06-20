import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Line extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points">) {
    super(props)
    this.aspectRatio = null
    this.points = [
      [0, 0.5],
      [1, 0.5],
    ]
  }
}
