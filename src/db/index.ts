
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { CodesFive } from "./entity/Codes"
import { RefreshToken } from "./entity/Refresh"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "teste",
    synchronize: true,
    logging: false,
    entities: [User, CodesFive, RefreshToken],
    subscribers: [],
    migrations: [],
})