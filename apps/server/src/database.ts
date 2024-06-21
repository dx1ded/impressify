import "reflect-metadata"
import { DataSource } from "typeorm"
import { Element } from "./entities/Element"
import { Slide } from "./entities/Slide"
import { Presentation } from "./entities/Presentation"
import { History } from "./entities/History"
import { HistoryRecord } from "./entities/HistoryRecord"
import { Text } from "./entities/Text"
import { Image } from "./entities/Image"
import { Shape } from "./entities/Shape"
import { User } from "./entities/User"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  entities: [`${__dirname}/entities/**/*.js`],
})

export const userRepository = AppDataSource.getRepository(User)
export const presentationRepository = AppDataSource.getRepository(Presentation)
export const historyRepository = AppDataSource.getRepository(History)
export const historyRecordRepository = AppDataSource.getRepository(HistoryRecord)
export const slideRepository = AppDataSource.getRepository(Slide)
export const elementRepository = AppDataSource.getRepository(Element)
export const textRepository = AppDataSource.getRepository(Text)
export const imageRepository = AppDataSource.getRepository(Image)
export const shapeRepository = AppDataSource.getRepository(Shape)

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch((e) => console.error(e))
