import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function POST(request: Request) {
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const body = await request.json() as { firstName?: string; lastName?: string; phone?: string; email?: string; password?: string };
  const firstName = String(body.firstName || "").trim(); const lastName = String(body.lastName || "").trim(); const email = String(body.email || "").trim().toLowerCase(); const password = String(body.password || "");
  if (!firstName || !lastName || !email || password.length < 8) return NextResponse.json({ error: "Please provide valid registration details" }, { status: 400 });
  const hash = await bcrypt.hash(password, 12);
  try {
    const result = await db.request().input("email", sql.NVarChar(320), email).input("hash", sql.NVarChar(255), hash).input("firstName", sql.NVarChar(100), firstName).input("lastName", sql.NVarChar(100), lastName).input("phone", sql.NVarChar(50), String(body.phone || "")).query("INSERT INTO dbo.Users (email, password_hash, first_name, last_name, phone) OUTPUT INSERTED.id, INSERTED.email, INSERTED.first_name, INSERTED.last_name, INSERTED.phone, INSERTED.role VALUES (@email, @hash, @firstName, @lastName, @phone)");
    const row = result.recordset[0];
    const user = { id: row.id.toString(), email: row.email, firstName: row.first_name, lastName: row.last_name, phone: row.phone || "", role: row.role } as const;
    await createSession(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "number" in error && error.number === 2627) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }
}
