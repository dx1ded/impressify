import { CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm"
import { PresentationUser } from "./PresentationUser"
import { History } from "./History"
import { HistoryRecord as IHistoryRecord } from "../graphql/__generated__"

@Entity()
export class HistoryRecord implements IHistoryRecord {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => PresentationUser, (user) => user.record, { onDelete: "CASCADE" })
  user: Relation<PresentationUser>

  @ManyToOne(() => History, { onDelete: "CASCADE" })
  history: Relation<History>

  @CreateDateColumn()
  lastOpened: Date

  constructor(history: Relation<History>, user: Relation<PresentationUser>) {
    this.history = history
    this.user = user
  }
}
