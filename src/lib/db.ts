import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import "dotenv/config"
import ws from "ws"

neonConfig.webSocketConstructor = ws
// neonConfig.poolQueryViaFetch = true

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const db =
  global.prisma ||
  new PrismaClient({ adapter, log: ["error", "warn"], errorFormat: "pretty" })

if (process.env.NODE_ENV === "development") global.prisma = db

export { db }
