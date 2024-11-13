import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { Element } from "./entities/Element"
import { Slide } from "./entities/Slide"
import { Presentation } from "./entities/Presentation"
import { PresentationUser } from "./entities/PresentationUser"
import { History } from "./entities/History"
import { HistoryRecord } from "./entities/HistoryRecord"
import { Text } from "./entities/Text"
import { Image } from "./entities/Image"
import { Shape } from "./entities/Shape"
import { User } from "./entities/User"
import { Document } from "./entities/Document"
import { Template } from "./entities/Template"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [`${__dirname}/entities/**/*.js`],
})

export const userRepository = AppDataSource.getRepository(User)
export const presentationRepository = AppDataSource.getRepository(Presentation)
export const presentationUserRepository = AppDataSource.getRepository(PresentationUser)
export const historyRepository = AppDataSource.getRepository(History)
export const historyRecordRepository = AppDataSource.getRepository(HistoryRecord)
export const slideRepository = AppDataSource.getRepository(Slide)
export const elementRepository = AppDataSource.getRepository(Element) as Repository<Text | Image | Shape>
export const documentRepository = AppDataSource.getRepository(Document)
export const templateRepository = AppDataSource.getRepository(Template)
export const textRepository = AppDataSource.getRepository(Text)
export const imageRepository = AppDataSource.getRepository(Image)
export const shapeRepository = AppDataSource.getRepository(Shape)

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch((e) => console.error(e))
