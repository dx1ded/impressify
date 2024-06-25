import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Rectangle extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points">) {
    super(props)
    this.aspectRatio = null
    this.points = [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 0],
      [0, 0],
    ]
  }
}
