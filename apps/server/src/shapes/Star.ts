import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Star extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points">) {
    super(props)
    this.aspectRatio = null
    this.points = [
      [0, 0.5],
      [0.75, 0.25],
      [1, 0.25],
      [0.75, 0.65],
      [0.9, 1],
      [0.5, 0.8],
      [0.1, 1],
      [0.25, 0.65],
      [0, 0.25],
      [0.25, 0.25],
      [0.5, 0],
    ]
  }
}
