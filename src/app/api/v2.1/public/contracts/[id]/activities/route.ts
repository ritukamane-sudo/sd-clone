import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities, users } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select({
      id: activities.id,
      action: activities.action,
      description: activities.description,
      userName: users.name,
      createdAt: activities.createdAt,
    })
    .from(activities)
    .leftJoin(users, eq(activities.userId, users.id))
    .where(eq(activities.contractId, id))
    .orderBy(activities.createdAt);

  return NextResponse.json({ results: rows });
}
