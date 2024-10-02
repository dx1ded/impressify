import { Column, Entity, PrimaryColumn } from "typeorm"
import { User as IUser } from "../graphql/__generated__"

@Entity()
export class User implements IUser {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  profilePicUrl: string

  constructor(id: string, firstName: string, lastName: string, email: string, profilePicUrl: string) {
    this.id = id
    this.name = `${firstName} ${lastName}`
    this.email = email
    this.profilePicUrl = profilePicUrl
  }
}
