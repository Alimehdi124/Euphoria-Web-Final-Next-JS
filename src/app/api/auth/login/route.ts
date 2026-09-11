import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function POST(request: Request) {
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const body = await request.json() as { email?: string; password?: string };
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const result = await db.request().input("email", sql.NVarChar(320), email).query("SELECT TOP 1 id, email, first_name, last_name, phone, role, is_active, password_hash FROM dbo.Users WHERE email = @email");
  const row = result.recordset[0];
  if (!row || !row.is_active || !(await bcrypt.compare(password, row.password_hash))) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  const user = { id: row.id.toString(), email: row.email, firstName: row.first_name || "", lastName: row.last_name || "", phone: row.phone || "", role: row.role } as const;
  await createSession(user);
  return NextResponse.json({ user });
}
