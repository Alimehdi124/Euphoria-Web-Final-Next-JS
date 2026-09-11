import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/sqlserver/auth";
export async function GET() { return NextResponse.json({ user: await getCurrentUser() }); }
