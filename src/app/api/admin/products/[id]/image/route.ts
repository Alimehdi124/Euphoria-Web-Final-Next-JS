import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const { id } = await params; const file = (await request.formData()).get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Please upload an image smaller than 5 MB" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  await db.request().input("productId", sql.UniqueIdentifier, id).query("UPDATE dbo.ProductImages SET is_primary=0 WHERE product_id=@productId");
  const result = await db.request().input("productId", sql.UniqueIdentifier, id).input("data", sql.VarBinary(sql.MAX), buffer).input("mime", sql.NVarChar(100), file.type).input("name", sql.NVarChar(255), file.name).query("INSERT INTO dbo.ProductImages (product_id, data, mime_type, original_name, is_primary) OUTPUT INSERTED.id VALUES (@productId, @data, @mime, @name, 1)");
  return NextResponse.json({ url: `/api/images/${result.recordset[0].id}` });
}
