import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emails as emailsTable } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(emailsTable)
    .where(eq(emailsTable.contractId, id))
    .orderBy(emailsTable.sentAt);

  return NextResponse.json({ results: rows });
}
