import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Circle extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "aspectRatio" | "points">) {
    super(props)
    this.aspectRatio = "1/1"
    this.points = [[0.5, 0.5]]
  }
}
