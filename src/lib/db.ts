import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";

const globalForDb = globalThis as unknown as { client: postgres.Sql | undefined; db: ReturnType<typeof drizzle> | undefined };

function getClient() {
  if (!globalForDb.client) {
    globalForDb.client = postgres(process.env.DATABASE_URL!, { prepare: false });
  }
  return globalForDb.client;
}

if (!globalForDb.db) {
  globalForDb.db = drizzle(getClient(), { schema });
}

export const db = globalForDb.db;