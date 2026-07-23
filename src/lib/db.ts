import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";

const globalForDb = globalThis as unknown as { client: postgres.Sql | undefined; db: ReturnType<typeof drizzle> | undefined };

if (!globalForDb.db) {
  const url = new URL(process.env.DATABASE_URL!);
  if (url.hostname.endsWith(".supabase.co")) {
    try {
      const { resolve6 } = await import("node:dns/promises");
      const addresses = await resolve6(url.hostname);
      if (addresses.length > 0) {
        url.hostname = `[${addresses[0]}]`;
      }
    } catch {}
  }
  globalForDb.client = postgres(url.toString(), { prepare: false });
  globalForDb.db = drizzle(globalForDb.client, { schema });
}

export const db = globalForDb.db;