import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm"
import { nanoid } from "nanoid"
import { User } from "./User"
import { Slide } from "./Slide"
import { History } from "./History"
import { Presentation as IPresentation } from "../graphql/__generated__"

@Entity()
export class Presentation implements IPresentation {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => Slide, (slide) => slide.presentation, { cascade: true })
  slides: Relation<Slide[]>

  @ManyToMany(() => User, (user) => user.presentations, { cascade: true })
  @JoinTable()
  users: Relation<User[]>

  @OneToOne(() => History, (history) => history.presentation, { cascade: true })
  @JoinColumn()
  history: Relation<History>

  @ManyToOne(() => User, (user) => user.ownership, { cascade: true })
  owner: Relation<User>

  @ManyToMany(() => User, (user) => user.reader, { cascade: true })
  @JoinTable()
  readers: Relation<User[]>

  @ManyToMany(() => User, (user) => user.editor, { cascade: true })
  @JoinTable()
  editors: Relation<User[]>

  constructor(name: string) {
    this.id = nanoid(6)
    this.name = name
  }
}
