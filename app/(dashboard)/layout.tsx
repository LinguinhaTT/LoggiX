import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, credits")
    .eq("id", user.id)
    .single();

  const userInfo = {
    name: profile?.name ?? user.email?.split("@")[0] ?? "Usuário",
    email: user.email ?? "",
    credits: profile?.credits ?? 0,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f5f6fa" }}>
      <Sidebar user={userInfo} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
