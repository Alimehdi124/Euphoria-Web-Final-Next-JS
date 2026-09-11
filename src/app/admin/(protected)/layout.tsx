import { requireAdmin } from "@/lib/sqlserver/auth";
import AdminShell from "@/components/admin/AdminShell";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");
  return <AdminShell email={user.email ?? "admin"}>{children}</AdminShell>;
}
