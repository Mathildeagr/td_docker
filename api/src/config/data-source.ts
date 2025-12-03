import "reflect-metadata"
import { DataSource } from "typeorm"
import 'dotenv/config';
import { Item } from "../entities/Item";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Item],
  migrations: [],
  subscribers: [],
})