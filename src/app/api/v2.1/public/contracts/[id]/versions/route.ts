import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contractVersions, users } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select({
      id: contractVersions.id,
      version: contractVersions.versionNumber,
      content: contractVersions.content,
      authorName: users.name,
      createdAt: contractVersions.createdAt,
    })
    .from(contractVersions)
    .leftJoin(users, eq(contractVersions.createdById, users.id))
    .where(eq(contractVersions.contractId, id))
    .orderBy(contractVersions.versionNumber);

  return NextResponse.json({ results: rows });
}
