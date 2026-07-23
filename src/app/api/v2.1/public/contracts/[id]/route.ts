import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contracts, counterparties, users } from "@/db/schema/index";
import { eq } from "drizzle-orm";

function serialize(r: any) {
  return {
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
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [row] = await db
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
    .leftJoin(users, eq(contracts.createdById, users.id))
    .where(eq(contracts.id, id));

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(row));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const [updated] = await db
    .update(contracts)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(contracts.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: updated.id, ...body });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [deleted] = await db
    .delete(contracts)
    .where(eq(contracts.id, id))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
