import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation, TableInheritance } from "typeorm"
import { Slide } from "./Slide"
import { Element as IElement } from "../graphql/__generated__"

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Element implements IElement {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  layer: number

  @Column()
  x1: number

  @Column()
  y1: number

  @Column()
  x2: number

  @Column()
  y2: number

  @Column()
  angle: number

  @ManyToOne(() => Slide, (slide) => slide.elements, { onDelete: "CASCADE" })
  slide: Relation<Slide>

  constructor({ layer, x1, y1, x2, y2, angle, slide }: Omit<Element, "id"> = {} as Omit<Element, "id">) {
    this.layer = layer
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.angle = angle
    this.slide = slide
  }
}
