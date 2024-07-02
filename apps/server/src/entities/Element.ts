import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation, TableInheritance } from "typeorm"
import { Slide } from "./Slide"
import { Element as IElement } from "../graphql/__generated__"

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Element implements IElement {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  x: number

  @Column()
  y: number

  @Column()
  width: number

  @Column()
  height: number

  @Column()
  angle: number

  @ManyToOne(() => Slide, (slide) => slide.elements, { onDelete: "CASCADE" })
  slide: Relation<Slide>

  constructor({ x, y, width, height, angle, slide }: Omit<Element, "id"> = {} as Omit<Element, "id">) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.angle = angle
    this.slide = slide
  }
}
