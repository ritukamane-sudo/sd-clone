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
    const { db } = await import("@/lib/db");
    const { sql } = await import("drizzle-orm");
    const [result] = await db.execute(sql`SELECT 1 as ok`);
    return NextResponse.json({ status: "ok", db: true, env: envCheck, result });
  } catch (e: any) {
    return NextResponse.json({ status: "error", db: false, env: envCheck, error: e.message, cause: e.cause?.message }, { status: 500 });
  }
}