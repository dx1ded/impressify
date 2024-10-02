import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm"
import { Presentation } from "./Presentation"
import type { Template as ITemplate } from "../graphql/__generated__"

@Entity()
export class Template implements ITemplate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  defaultBg: string

  @Column()
  defaultThumbnailUrl: string

  @OneToOne(() => Presentation)
  @JoinColumn()
  presentation: Relation<Presentation>

  constructor(name: string, presentation: Relation<Presentation>) {
    this.name = name
    this.presentation = presentation
  }
}
