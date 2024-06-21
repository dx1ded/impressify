import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm"
import { User } from "./User"
import { History } from "./History"
import { HistoryRecord as IHistoryRecord } from "../graphql/__generated__"

@Entity()
export class HistoryRecord implements IHistoryRecord {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  user: Relation<User>

  @ManyToOne(() => History, { onDelete: "CASCADE" })
  history: Relation<History>

  @Column()
  lastOpened: Date

  constructor(user: User, date: Date) {
    this.user = user
    this.lastOpened = date
  }
}
