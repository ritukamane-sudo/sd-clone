import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contracts, counterparties, users } from "@/db/schema/index";
import { eq, like, or, sql, and } from "drizzle-orm";

function serialize(rows: any[]) {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    kind: r.kind,
    counterparty_name: r.counterparty_name,
    counterparty_email: r.counterparty_email,
    contract_type: r.contract_type || r.tags?.[0] || "General",
    template_name: r.template_name,
    value: r.value,
    currency: r.currency,
    tags: r.tags || [],
    start_date: r.start_date?.toISOString().split("T")[0],
    end_date: r.end_date?.toISOString().split("T")[0],
    created_by_name: r.created_by_name,
    created_by_email: r.created_by_email,
    created_at: r.created_at?.toISOString(),
    updated_at: r.updated_at?.toISOString(),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("page_size") || "20");

  const baseQuery = db
    .select({
      id: contracts.id,
      title: contracts.title,
      description: contracts.description,
      status: contracts.status,
      kind: contracts.kind,
      value: contracts.value,
      currency: contracts.currency,
      tags: contracts.tags,
      start_date: contracts.startDate,
      end_date: contracts.endDate,
      created_at: contracts.createdAt,
      updated_at: contracts.updatedAt,
      counterparty_name: counterparties.name,
      counterparty_email: counterparties.email,
      created_by_name: users.name,
      created_by_email: users.email,
    })
    .from(contracts)
    .leftJoin(counterparties, eq(contracts.counterpartyId, counterparties.id))
    .leftJoin(users, eq(contracts.createdById, users.id));

  const conditions: any[] = [];
  if (search) {
    conditions.push(
      or(
        like(sql`LOWER(${contracts.title})`, `%${search}%`),
        like(sql`LOWER(${counterparties.name})`, `%${search}%`),
      ),
    );
  }
  if (status) conditions.push(eq(contracts.status, status as any));

  const totalCount = db
    .select({ count: sql<number>`count(*)` })
    .from(contracts)
    .leftJoin(counterparties, eq(contracts.counterpartyId, counterparties.id));

  const [totalResult] = conditions.length > 0
    ? await totalCount.where(and(...conditions))
    : await totalCount;
  const total = Number(totalResult?.count || 0);

  const query = conditions.length > 0
    ? baseQuery.where(and(...conditions))
    : baseQuery;

  const results = await query
    .offset((page - 1) * pageSize)
    .limit(pageSize);

  return NextResponse.json({ results: serialize(results), total });
}

export async function POST(request: Request) {
  const body = await request.json();
  const [c] = await db
    .insert(contracts)
    .values({
      title: body.title,
      description: body.description,
      status: body.status || "draft",
      kind: body.kind || "new",
      organizationId: body.organization_id,
      createdById: body.created_by_id,
      counterpartyId: body.counterparty_id,
      tags: body.tags || [],
      value: body.value,
      currency: body.currency || "USD",
    })
    .returning();

  return NextResponse.json({ id: c.id, ...body }, { status: 201 });
}
