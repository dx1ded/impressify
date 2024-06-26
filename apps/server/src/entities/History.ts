import { Entity, OneToOne, OneToMany, type Relation, PrimaryGeneratedColumn } from "typeorm"
import { HistoryRecord } from "./HistoryRecord"
import { Presentation } from "./Presentation"
import { History as IHistory } from "../graphql/__generated__"

@Entity()
export class History implements IHistory {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Presentation, (presentation) => presentation.history)
  presentation: Relation<Presentation>

  @OneToMany(() => HistoryRecord, (record) => record.history, { cascade: true })
  records: Relation<HistoryRecord[]>

  constructor(presentation: Relation<Presentation>) {
    this.presentation = presentation
  }
}
