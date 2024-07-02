import { Element } from "../entities/Element"
import { Shape } from "../entities/Shape"

export class Rectangle extends Shape {
  constructor(props: Omit<Element, "id"> & Omit<Shape, "type" | "proportional">) {
    super(props)
    this.type = "rectangle"
    this.proportional = false
  }
}
