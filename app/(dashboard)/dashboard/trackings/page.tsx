"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Package, Plus, ExternalLink, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { TrackingStatus } from "@/lib/supabase/types";

type Tracking = {
  id: string;
  code: string;
  carrier_code: string | null;
  carrier: string;
  recipient_name: string;
  recipient_email: string | null;
  status: TrackingStatus;
  created_at: string;
};

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "pendente", label: "Pendente" },
  { value: "postado", label: "Postado" },
  { value: "em_transito", label: "Em Trânsito" },
  { value: "em_entrega", label: "Em Entrega" },
  { value: "nao_entregue", label: "Não Entregue" },
  { value: "entregue", label: "Entregue" },
];

export default function TrackingsPage() {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const fetchTrackings = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("trackings")
      .select("id, code, carrier_code, carrier, recipient_name, recipient_email, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (statusFilter) query = query.eq("status", statusFilter as TrackingStatus);
    if (search) query = query.ilike("code", `%${search}%`);

    const { data } = await query;
    setTrackings((data as Tracking[]) ?? []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchTrackings, 300);
    return () => clearTimeout(timer);
  }, [fetchTrackings]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Rastreios</h1>
          <p className="text-sm text-gray-500">{trackings.length} rastreio(s) encontrado(s)</p>
        </div>
        <Link
          href="/dashboard/new-tracking"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "#0d9488" }}
        >
          <Plus className="w-4 h-4" />
          Novo Rastreio
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white min-w-[180px]"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {trackings.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Package}
            title="Nenhum rastreio encontrado"
            subtitle="Crie seu primeiro rastreio ou ajuste os filtros de busca."
            action={{ label: "Criar Rastreio", onClick: () => router.push("/dashboard/new-tracking") }}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">Código</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Destinatário</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Transportadora</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Cód. Rastreio</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Data</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {trackings.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-gray-800">{t.code}</span>
                        <button
                          onClick={() => copyCode(t.code)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copiar código"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-800 font-medium">{t.recipient_name}</p>
                      {t.recipient_email && (
                        <p className="text-xs text-gray-400">{t.recipient_email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{t.carrier}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-500">
                        {t.carrier_code ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3.5">
                      <a
                        href={`/track/${t.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                        style={{ color: "#0d9488" }}
                      >
                        Ver página
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
