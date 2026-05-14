"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Plus, ExternalLink, Copy, Truck } from "lucide-react";
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
  status: TrackingStatus;
  created_at: string;
};

const PENDING_STATUSES: TrackingStatus[] = ["pendente", "postado"];

export default function PendingShipmentsPage() {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchPending = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("trackings")
        .select("id, code, carrier_code, carrier, recipient_name, status, created_at")
        .eq("user_id", user.id)
        .in("status", PENDING_STATUSES)
        .order("created_at", { ascending: false });
      setTrackings((data as Tracking[]) ?? []);
      setLoading(false);
    };
    fetchPending();
  }, []);

  const markAsPosted = async (id: string) => {
    setUpdating(id);
    const { error } = await supabase
      .from("trackings")
      .update({ status: "postado", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status.");
    } else {
      toast.success("Status atualizado para Postado.");
      setTrackings((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "postado" as TrackingStatus } : t))
      );
    }
    setUpdating(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Envios Pendentes</h1>
          <p className="text-sm text-gray-500">
            {trackings.length} envio(s) aguardando atualização
          </p>
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

      {/* Info banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
      >
        <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#d97706" }} />
        <p className="text-sm text-yellow-800">
          Estes rastreios estão com status <strong>Pendente</strong> ou{" "}
          <strong>Postado</strong>. Marque-os como postados assim que o objeto for
          entregue à transportadora.
        </p>
      </div>

      {trackings.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Clock}
            title="Nenhum envio pendente"
            subtitle="Todos os seus rastreios foram atualizados. Crie novos rastreios para envios futuros."
            action={{ label: "Novo Rastreio", onClick: () => router.push("/dashboard/new-tracking") }}
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
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Data</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {trackings.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-gray-800">{t.code}</span>
                        <button
                          onClick={() => copyCode(t.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-800">{t.recipient_name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-gray-400" />
                        {t.carrier}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {t.status === "pendente" && (
                          <button
                            onClick={() => markAsPosted(t.id)}
                            disabled={updating === t.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                            style={{ backgroundColor: "#3b82f6" }}
                          >
                            {updating === t.id ? "..." : "Marcar Postado"}
                          </button>
                        )}
                        <a
                          href={`/track/${t.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:underline flex items-center gap-1"
                          style={{ color: "#0d9488" }}
                        >
                          Ver <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
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
