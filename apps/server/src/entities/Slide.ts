import { nanoid } from "nanoid"
import { Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Presentation } from "./Presentation"
import { Element } from "./Element"
import { Text } from "./Text"
import { Image } from "./Image"
import { Shape } from "./Shape"
import { Slide as ISlide } from "../graphql/__generated__"

@Entity()
export class Slide implements ISlide {
  @PrimaryColumn()
  id: string

  @OneToMany(() => Element, (element) => element.slide, { cascade: true })
  elements: Relation<Text | Image | Shape>[]

  @ManyToOne(() => Presentation, (presentation) => presentation.slides, { onDelete: "CASCADE" })
  presentation: Relation<Presentation>

  constructor() {
    this.id = nanoid(8)
  }
}
