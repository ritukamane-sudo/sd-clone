import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";
import { resolve6Sync, setServers } from "node:dns";

const globalForDb = globalThis as unknown as { client: postgres.Sql | undefined; db: ReturnType<typeof drizzle> | undefined };

function resolveHostnameSync(hostname: string): string {
  try {
    setServers(["8.8.8.8", "8.8.4.4"]);
    const addresses = resolve6Sync(hostname);
    if (addresses.length > 0) {
      return `[${addresses[0]}]`;
    }
  } catch { }
  return hostname;
}

function getConnectionUrl(): string {
  const url = process.env.DATABASE_URL!;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".supabase.co")) {
      parsed.hostname = resolveHostnameSync(parsed.hostname);
    }
  } catch { }
  return url;
}

if (!globalForDb.client) {
  globalForDb.client = postgres(getConnectionUrl(), { prepare: false });
}

if (!globalForDb.db) {
  globalForDb.db = drizzle(globalForDb.client, { schema });
}

export const db = globalForDb.db;