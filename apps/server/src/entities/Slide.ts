import { nanoid } from "nanoid"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Element } from "./Element"
import { Presentation } from "./Presentation"
import { Text } from "./Text"
import { Shape } from "./Shape"
import { Image } from "./Image"
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
    {
      id = nanoid(8),
      presentation,
      bg = "#ffffff",
      transition = Transition.None,
      thumbnailUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/erDEdIAAAAASUVORK5CYII=",
      position = 0,
    }: SlideConstructorType = {} as SlideConstructorType,
  ) {
    this.id = id
    this.presentation = presentation
    this.position = position

    const template = presentation?.template

    if (template) {
      const { slides } = template.presentation
      const _slide = slides[0] // Assuming there's always at least one slide

      this.bg = _slide.bg
      this.transition = _slide.transition
      this.thumbnailUrl = _slide.thumbnailUrl
    } else {
      // Use default or passed-in values if no template
      this.bg = bg
      this.transition = transition
      this.thumbnailUrl = thumbnailUrl
    }
  }
}
