import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb(); if (!db) return new NextResponse("Database is not configured", { status: 503 });
  const { id } = await params; const result = await db.request().input("id", sql.UniqueIdentifier, id).query("SELECT TOP 1 data, mime_type FROM dbo.ProductImages WHERE id=@id"); const row = result.recordset[0];
  if (!row) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(row.data, { headers: { "Content-Type": row.mime_type, "Cache-Control": "public, max-age=86400" } });
}
