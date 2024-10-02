import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, type Relation } from "typeorm"
import { nanoid } from "nanoid"
import { PresentationUser } from "./PresentationUser"
import { Slide } from "./Slide"
import { History } from "./History"
import { Template } from "./Template"
import { Presentation as IPresentation } from "../graphql/__generated__"

@Entity()
export class Presentation implements IPresentation {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => Slide, (slide) => slide.presentation, { cascade: true })
  slides: Relation<Slide[]>

  @OneToMany(() => PresentationUser, (presentationUser) => presentationUser.presentation, { cascade: true })
  users: Relation<PresentationUser[]>

  @OneToOne(() => History, (history) => history.presentation, { cascade: true })
  @JoinColumn()
  history: Relation<History>

  @ManyToOne(() => Template, { nullable: true })
  template: Relation<Template>

  constructor(name: string, template?: Relation<Template>) {
    this.id = nanoid(6)
    this.name = name
    if (template) {
      this.template = template
    }
  }
}
