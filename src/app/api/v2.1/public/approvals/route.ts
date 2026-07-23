import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contractApprovals, contracts as c, users } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const base = db
    .select({
      id: contractApprovals.id,
      contract_id: contractApprovals.contractId,
      contract_title: c.title,
      approver_name: users.name,
      approver_email: users.email,
      status: contractApprovals.status,
      comment: contractApprovals.comment,
      created_at: contractApprovals.createdAt,
      updated_at: contractApprovals.updatedAt,
    })
    .from(contractApprovals)
    .leftJoin(c, eq(contractApprovals.contractId, c.id))
    .leftJoin(users, eq(contractApprovals.approverId, users.id));

  const results = status ? await base.where(eq(contractApprovals.status, status)) : await base;
  return NextResponse.json({ results });
}
