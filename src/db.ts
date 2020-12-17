import { join } from 'path'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import House from './models/house'

const dbPath = join(__dirname, '../data/db.sqlite3')

export async function initDB() {
  await createConnection({
    type: 'sqlite',
    database: dbPath,
    synchronize: true,
    // logging: false,
    entities: [House],
  })
}
