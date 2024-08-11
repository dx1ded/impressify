import { nanoid } from "nanoid"
import { type Relation, Column, Entity, ManyToOne, PrimaryColumn, TableInheritance } from "typeorm"
import { Slide } from "./Slide"
import { Element as IElement } from "../graphql/__generated__"

export type ElementConstructorProps = Omit<Element, "id"> & { id?: string }

@Entity()
@TableInheritance({ column: { type: "varchar", name: "__type__" } })
export class Element implements IElement {
  @PrimaryColumn()
  id: string

  @Column("float")
  x: number

  @Column("float")
  y: number

  @Column("float")
  width: number

  @Column("float")
  height: number

  @Column()
  angle: number

  @Column("float")
  scaleX: number

  @Column("float")
  scaleY: number

  @Column()
  position: number

  @ManyToOne(() => Slide, (slide) => slide.elements, { onDelete: "CASCADE" })
  slide: Relation<Slide>

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
    }: ElementConstructorProps = {} as ElementConstructorProps,
  ) {
    this.id = id || nanoid(8)
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.angle = angle
    this.scaleX = scaleX
    this.scaleY = scaleY
    this.position = position
    this.slide = slide
  }
}
