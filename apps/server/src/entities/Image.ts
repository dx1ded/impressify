import { Column, ChildEntity } from "typeorm"
import { Element, type ElementConstructorProps } from "./Element"
import { Image as IImage } from "../graphql/__generated__"

type ImageConstructorProps = ElementConstructorProps & Image

@ChildEntity()
export class Image extends Element implements IImage {
  @Column()
  imageUrl: string

  constructor(
    {
      id,
      x,
      y,
      width,
      height,
      angle,
      scaleX,
      scaleY,
      position,
      slide,
      imageUrl,
    }: ImageConstructorProps = {} as ImageConstructorProps,
  ) {
    super({
      id,
      x,
      y,
      width,
      height,
      angle,
      scaleX,
      scaleY,
      position,
      slide,
    })
    this.imageUrl = imageUrl
  }
}
