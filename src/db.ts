import { join } from 'path'
import { Sequelize } from 'sequelize'

const dbPath = join(__dirname, '../data/db.sqlite3')

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
})

export async function initDB() {
  await sequelize.authenticate()
  await sequelize.sync()
}
