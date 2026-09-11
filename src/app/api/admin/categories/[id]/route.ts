import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) { if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 }); const { id } = await params; await db.request().input("id", sql.UniqueIdentifier, id).query("DELETE FROM dbo.Categories WHERE id=@id"); return NextResponse.json({ ok: true }); }
