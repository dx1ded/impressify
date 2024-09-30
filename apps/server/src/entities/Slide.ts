import { nanoid } from "nanoid"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Element } from "./Element"
import { Image } from "./Image"
import { Presentation } from "./Presentation"
import { Shape } from "./Shape"
import { Text } from "./Text"
import { Slide as ISlide, Transition } from "../graphql/__generated__"

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

  @Column({ type: "enum", enum: Transition, default: Transition.None })
  transition: Transition

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
    this.bg = bg || "#ffffff"
    this.transition = transition || Transition.None
    // Plain white background
    this.thumbnailUrl =
      thumbnailUrl ||
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/erDEdIAAAAASUVORK5CYII="
    this.position = position || 0
  }
}
