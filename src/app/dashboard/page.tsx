import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminContent } from "@/components/dashboard/AdminContent";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!user || user.email !== adminEmail) {
    redirect("/login");
  }

  return <AdminContent />;
}
