import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { templates } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const base = db.select().from(templates);
  const results = category ? await base.where(eq(templates.category, category)) : await base;
  return NextResponse.json({
    results: results.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      created_at: t.createdAt?.toISOString(),
      updated_at: t.updatedAt?.toISOString(),
    })),
  });
}
