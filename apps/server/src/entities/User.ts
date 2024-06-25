import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Presentation } from "./Presentation"
import { HistoryRecord } from "./HistoryRecord"
import { User as IUser } from "../graphql/__generated__"

@Entity()
export class User implements IUser {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  profilePicUrl: string

  @ManyToMany(() => Presentation, (presentation) => presentation.users)
  presentations: Relation<Presentation[]>

  @OneToMany(() => HistoryRecord, (record) => record.user)
  records: Relation<HistoryRecord[]>

  constructor(id: string, firstName: string, lastName: string, profilePicUrl: string) {
    this.id = id
    this.name = `${firstName} ${lastName}`
    this.profilePicUrl = profilePicUrl
  }
}
