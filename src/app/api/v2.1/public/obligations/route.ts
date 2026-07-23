import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { obligations, contracts as c } from "@/db/schema/index";
import { eq, and, like, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const base = db
    .select({
      id: obligations.id,
      contract_id: obligations.contractId,
      contract_title: c.title,
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
    .leftJoin(c, eq(obligations.contractId, c.id));

  const conditions: any[] = [];
  if (search) conditions.push(like(sql`LOWER(${obligations.title})`, `%${search}%`));
  if (status) conditions.push(eq(obligations.status, status));
  if (priority) conditions.push(eq(obligations.priority, priority));

  const results = conditions.length > 0 ? await base.where(and(...conditions)) : await base;
  return NextResponse.json({ results });
}
