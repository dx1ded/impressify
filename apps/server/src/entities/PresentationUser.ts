import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm"
import { User } from "./User"
import { Presentation } from "./Presentation"
import { HistoryRecord } from "./HistoryRecord"
import { type PresentationUser as IPresentationUser, Role } from "../graphql/__generated__"

@Entity()
export class PresentationUser implements IPresentationUser {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Presentation, (presentation) => presentation.users, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  presentation: Relation<Presentation>

  @OneToOne(() => HistoryRecord, (record) => record.user, { cascade: true })
  @JoinColumn()
  record: Relation<HistoryRecord>

  @CreateDateColumn()
  invitedAt: Date

  @ManyToOne(() => User)
  props: Relation<User>

  @Column({ type: "enum", enum: Role })
  role: Role

  constructor(presentation: Relation<Presentation>, props: Relation<User>, role: Role) {
    this.presentation = presentation
    this.props = props
    this.role = role
  }
}
