import dotenv from 'dotenv'

dotenv.config()

export const DB_URI = process.env.DB_URI ?? ''

export const TARGET_URL = process.env.TARGET_URL ?? ''

export const WEBHOOK = process.env.WEBHOOK ?? ''

export const SECRET = process.env.SECRET ?? ''
