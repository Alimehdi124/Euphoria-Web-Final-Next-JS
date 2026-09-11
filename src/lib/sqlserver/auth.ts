import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getDb, sql } from "@/lib/sqlserver/db";

const cookieName = "euphoria_session";
export type AuthUser = { id: string; email: string; firstName: string; lastName: string; phone: string; role: "customer" | "admin" };

function secret() {
  const value = process.env.AUTH_SECRET;
  return value ? new TextEncoder().encode(value) : null;
}

export async function createSession(user: AuthUser) {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET is not configured");
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function clearSession() {
  (await cookies()).set(cookieName, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const key = secret();
  const token = (await cookies()).get(cookieName)?.value;
  if (!key || !token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    const db = await getDb();
    if (!db || !payload.sub) return null;
    const result = await db.request().input("id", sql.UniqueIdentifier, payload.sub).query("SELECT TOP 1 id, email, first_name, last_name, phone, role, is_active FROM dbo.Users WHERE id = @id");
    const row = result.recordset[0];
    if (!row || !row.is_active) return null;
    return { id: row.id.toString(), email: row.email, firstName: row.first_name || "", lastName: row.last_name || "", phone: row.phone || "", role: row.role };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}

export async function requireCustomer() {
  return getCurrentUser();
}
