import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { obligations, contracts as c } from "@/db/schema/index";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select({
      id: obligations.id,
      contract_id: obligations.contractId,
      title: obligations.title,
      description: obligations.description,
      assignee_name: sql<string | null>`NULL`,
      due_date: obligations.dueDate,
      status: obligations.status,
      priority: obligations.priority,
      created_at: obligations.createdAt,
      updated_at: obligations.updatedAt,
    })
    .from(obligations)
    .where(eq(obligations.contractId, id));

  return NextResponse.json({ results: rows });
}
