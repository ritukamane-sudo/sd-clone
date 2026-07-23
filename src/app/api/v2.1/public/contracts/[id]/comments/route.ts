import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.contractId, id))
    .orderBy(comments.createdAt);

  return NextResponse.json({ results: rows });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const [c] = await db
    .insert(comments)
    .values({
      contractId: id,
      authorName: body.authorName || "Rituka Mane",
      text: body.text,
      parentId: body.parentId || null,
    })
    .returning();

  return NextResponse.json(c, { status: 201 });
}
