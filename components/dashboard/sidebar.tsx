"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  Clock,
  CreditCard,
  RefreshCw,
  Receipt,
  Users,
  Handshake,
  Settings,
  HeadphonesIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface SidebarProps {
  user: { name: string; email: string; credits: number } | null;
}

const navSections = [
  {
    title: "OPERACIONAL",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Meus Rastreios", icon: Package, href: "/dashboard/trackings" },
      { label: "Novo Rastreio", icon: Plus, href: "/dashboard/new-tracking" },
      { label: "Envios Pendentes", icon: Clock, href: "/dashboard/pending-shipments" },
    ],
  },
  {
    title: "FINANCEIRO",
    items: [
      { label: "Créditos", icon: CreditCard, href: "/dashboard/credits" },
      { label: "Recuperação", icon: RefreshCw, href: "/dashboard/recovery" },
      { label: "Taxação", icon: Receipt, href: "/dashboard/taxation" },
      { label: "Indicações", icon: Users, href: "/dashboard/referrals" },
      { label: "Parceria", icon: Handshake, href: "/dashboard/partnership" },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { label: "Configurações", icon: Settings, href: "/dashboard/settings" },
      { label: "Suporte", icon: HeadphonesIcon, href: "/dashboard/tickets" },
    ],
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Até logo!");
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 relative flex-shrink-0"
      style={{
        width: collapsed ? "64px" : "240px",
        backgroundColor: "#1a1d2e",
        color: "#fff",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 overflow-hidden">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(13,148,136,0.25)" }}
        >
          <Navigation className="w-4 h-4" style={{ color: "#2dd4bf" }} />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight whitespace-nowrap">
            Loggi<span style={{ color: "#2dd4bf" }}>X</span>
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-14 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors"
        style={{ backgroundColor: "#0d9488", color: "#fff" }}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Credits badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg border border-white/15 flex items-center justify-between">
          <span className="text-xs text-gray-400">Créditos</span>
          <span className="text-sm font-bold text-white">{user?.credits ?? 0}</span>
        </div>
      )}
      {collapsed && (
        <div className="mx-2 mt-3 px-2 py-1.5 rounded-lg border border-white/15 text-center">
          <span className="text-xs font-bold text-white">{user?.credits ?? 0}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item flex items-center gap-3 px-2 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                    active
                      ? "sidebar-item-active text-white"
                      : "text-gray-400"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: active ? "#2dd4bf" : undefined }}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 mb-2 ${collapsed ? "justify-center" : ""}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: "#0d9488", color: "#fff" }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name ?? "Usuário"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? ""}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
