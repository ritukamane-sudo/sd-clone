import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasDbUrl: !!process.env.DATABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 40) + "...",
  };

  try {
    const url = new URL(process.env.DATABASE_URL!);
    envCheck.dbUrlPrefix = `${url.protocol}//${url.username}:***@${url.hostname}:${url.port}${url.pathname}${url.search}`;
  } catch { }

  try {
    const { db } = await import("@/lib/db");
    const { sql } = await import("drizzle-orm");
    const [result] = await db.execute(sql`SELECT 1 as ok`);
    return NextResponse.json({ status: "ok", db: true, env: envCheck, result });
  } catch (e: any) {
    return NextResponse.json({
      status: "error", db: false, env: envCheck,
      error: e.message,
      stack: e.stack?.split("\n")?.slice(0, 5),
      fullMessage: JSON.stringify(e, Object.getOwnPropertyNames(e))
    }, { status: 500 });
  }
}
