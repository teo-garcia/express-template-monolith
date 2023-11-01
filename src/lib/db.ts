import "dotenv/config";
import { DataSource } from "typeorm";

const db = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  username: process.env.POSTGRES_USER ?? "",
  password: process.env.POSTGRES_PASSWORD ?? "",
  database: process.env.POSTGRES_DB ?? "",
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.ts"],
  subscribers: [],
  migrations: ["src/migrations/*.ts"],
  schema: "public",
});

export { db };
