import { config } from "dotenv";
config()

export const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST
export const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB
export const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER
export const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD
export const MYSQL_ADDON_PORT = process.env.MYSQL_ADDON_PORT || 3306

export const JWT_CLAVE = process.env.JWT_CLAVE