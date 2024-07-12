import { nanoid } from "nanoid"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from "typeorm"
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
  elements: Relation<(Text | Image | Shape)[]>

  @ManyToOne(() => Presentation, (presentation) => presentation.slides, { onDelete: "CASCADE" })
  presentation: Relation<Presentation>

  @Column()
  bgColor: string

  @Column()
  transition: string

  @Column()
  thumbnailUrl: string

  @CreateDateColumn()
  createdAt: Date

  constructor(presentation: Relation<Presentation>) {
    this.id = nanoid(8)
    this.presentation = presentation
    this.bgColor = "rgb(255, 255, 255)"
    this.transition = "none"
    // Plain white background
    this.thumbnailUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/erDEdIAAAAASUVORK5CYII="
  }
}
