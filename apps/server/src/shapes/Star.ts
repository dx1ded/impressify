import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Star extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "type" | "proportional">) {
    super(props)
    this.type = "star"
    this.proportional = false
  }
}
