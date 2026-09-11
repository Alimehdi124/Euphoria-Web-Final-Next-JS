import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";
import { getStorageBucket } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Please upload an image smaller than 5 MB" }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${context.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await context.supabase.storage.from(getStorageBucket()).upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    upsert: false
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = context.supabase.storage.from(getStorageBucket()).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
