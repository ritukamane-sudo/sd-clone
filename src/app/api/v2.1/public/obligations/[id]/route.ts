import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { obligations } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const [updated] = await db
    .update(obligations)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(obligations.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
