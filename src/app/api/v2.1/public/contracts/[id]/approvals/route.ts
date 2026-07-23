import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contractApprovals, users } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select({
      id: contractApprovals.id,
      contract_id: contractApprovals.contractId,
      approver_name: users.name,
      approver_email: users.email,
      status: contractApprovals.status,
      comment: contractApprovals.comment,
      created_at: contractApprovals.createdAt,
      updated_at: contractApprovals.updatedAt,
    })
    .from(contractApprovals)
    .leftJoin(users, eq(contractApprovals.approverId, users.id))
    .where(eq(contractApprovals.contractId, id));

  return NextResponse.json({ results: rows });
}
