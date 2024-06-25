import { Column, ChildEntity } from "typeorm"
import { Element } from "./Element"
import { Image as IImage } from "../graphql/__generated__"

@ChildEntity()
export class Image extends Element implements IImage {
  @Column()
  imageUrl: string

  constructor(
    { layer, x1, y1, x2, y2, angle, imageUrl, slide }: Omit<Element, "id"> & Image = {} as Omit<Element, "id"> & Image,
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
    this.imageUrl = imageUrl
  }
}
