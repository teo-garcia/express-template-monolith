import { DataSource } from 'typeorm'

const db = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'god',
  password: 'mode',
  database: 'etm-db-dev',
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.ts'],
  subscribers: [],
  migrations: ['src/migrations/*.ts'],
  schema: 'public',
})

export { db }
