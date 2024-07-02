import { Column, ChildEntity } from "typeorm"
import { Element } from "./Element"
import { Image as IImage } from "../graphql/__generated__"

@ChildEntity()
export class Image extends Element implements IImage {
  @Column()
  imageUrl: string

  constructor(
    { x, y, width, height, angle, imageUrl, slide }: Omit<Element, "id"> & Image = {} as Omit<Element, "id"> & Image,
  ) {
    super({
      x,
      y,
      width,
      height,
      angle,
      slide,
    })
    this.imageUrl = imageUrl
  }
}
