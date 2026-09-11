import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function GET() {
  const user = await requireCustomer(); if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const result = await db.request().input("userId", sql.UniqueIdentifier, user.id).query("SELECT id, status, total, created_at FROM dbo.Orders WHERE user_id=@userId ORDER BY created_at DESC");
  return NextResponse.json({ orders: result.recordset.map((row) => ({ ...row, id: row.id.toString() })) });
}

export async function POST(request: Request) {
  await requireCustomer();
  return NextResponse.json({ error: "Payment is required. Use the Stripe checkout endpoint." }, { status: 402 });
}
