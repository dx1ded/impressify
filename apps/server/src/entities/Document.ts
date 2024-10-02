import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: "bytea", nullable: true })
  data: Uint8Array

  constructor(name: string, data: Uint8Array) {
    this.name = name
    this.data = data
  }
}
