import { Column, Entity, ManyToMany, PrimaryColumn, type Relation } from "typeorm"

import { Presentation } from "./Presentation"

import { User as IUser } from "../graphql/__generated__"

@Entity()
export class User implements IUser {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @ManyToMany(() => Presentation, (presentation) => presentation.users)
  presentations: Relation<Presentation>[]

  constructor(id: string, firstName: string, lastName: string) {
    this.id = id
    this.name = `${firstName} ${lastName}`
  }
}
