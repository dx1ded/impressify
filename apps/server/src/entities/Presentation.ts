import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { nanoid } from "nanoid"
import { User } from "./User"
import { Slide } from "./Slide"
import { Presentation as IPresentation } from "../graphql/__generated__"

@Entity()
export class Presentation implements IPresentation {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => Slide, (slide) => slide.presentation, { cascade: true })
  slides: Relation<Slide>[]

  @ManyToMany(() => User, (user) => user.presentations)
  @JoinTable()
  users: Relation<User>[]

  constructor(name: string, users: Relation<User>[]) {
    this.id = nanoid(6)
    this.name = name
    this.users = users
  }
}
