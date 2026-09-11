import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const result = await db.request().query("SELECT (SELECT COUNT(*) FROM dbo.Products) products, (SELECT COUNT(*) FROM dbo.Users) users, (SELECT COUNT(*) FROM dbo.Orders) orders, (SELECT COUNT(*) FROM dbo.Orders WHERE status = N'pending') pending, (SELECT COUNT(*) FROM dbo.Orders WHERE status = N'delivered') completed; SELECT TOP 5 id, status, total, created_at FROM dbo.Orders ORDER BY created_at DESC");
  const counts = result.recordset[0];
  const recentOrders = Array.isArray(result.recordsets) ? result.recordsets[1] || [] : [];
  return NextResponse.json({ counts, recentOrders });
}
