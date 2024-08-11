import { nanoid } from "nanoid"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Presentation } from "./Presentation"
import { Element } from "./Element"
import { Text } from "./Text"
import { Image } from "./Image"
import { Shape } from "./Shape"
import { Slide as ISlide } from "../graphql/__generated__"

type SlideConstructorType = { presentation: Relation<Presentation> } & Partial<
  Omit<Slide, "presentation" | "createdAt" | "elements">
>

@Entity()
export class Slide implements ISlide {
  @PrimaryColumn()
  id: string

  @OneToMany(() => Element, (element) => element.slide, { cascade: true })
  elements: Relation<(Text | Image | Shape)[]>

  @ManyToOne(() => Presentation, (presentation) => presentation.slides, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  presentation: Relation<Presentation>

  @Column()
  bg: string

  @Column()
  transition: string

  @Column()
  thumbnailUrl: string

  @Column()
  position: number

  @CreateDateColumn()
  createdAt: Date

  constructor(
    { id, presentation, bg, transition, thumbnailUrl, position }: SlideConstructorType = {} as SlideConstructorType,
  ) {
    this.id = id || nanoid(8)
    this.presentation = presentation
    this.bg = bg || "rgb(255, 255, 255)"
    this.transition = transition || "none"
    // Plain white background
    this.thumbnailUrl =
      thumbnailUrl ||
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/erDEdIAAAAASUVORK5CYII="
    this.position = position || 0
  }
}
