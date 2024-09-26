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

  constructor(user: Relation<PresentationUser>, history: Relation<History>) {
    this.user = user
    this.history = history
  }
}
