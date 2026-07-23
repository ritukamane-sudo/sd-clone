import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";

const globalForDb = globalThis as unknown as { client: postgres.Sql | undefined; db: ReturnType<typeof drizzle> | undefined };

async function initDb() {
  if (globalForDb.db) return;

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

  globalForDb.client = postgres(url.toString(), { prepare: false, max_lifetime: 60 * 30, idle_timeout: 20 });
  globalForDb.db = drizzle(globalForDb.client, { schema });
}

const initPromise = initDb();

export async function getDb() {
  await initPromise;
  return globalForDb.db!;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop: string) {
    return (...args: any[]) => {
      const d = globalForDb.db;
      if (!d) throw new Error("DB not initialized yet - use getDb() for async access");
      return (d as any)[prop](...args);
    };
  },
});
