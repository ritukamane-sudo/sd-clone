import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const contractId = formData.get("contract_id") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const supabase = await createClient();
  const ext = file.name.split(".").pop();
  const path = contractId
    ? `${contractId}/${Date.now()}.${ext}`
    : `uploads/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("contracts")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("contracts").getPublicUrl(path);

  return NextResponse.json({
    path: data.path,
    url: urlData.publicUrl,
    name: file.name,
    size: file.size,
  });
}
