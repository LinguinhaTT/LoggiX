"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Package, Plus, ExternalLink, Copy, Lock, X, CheckCircle, AlertTriangle } from "lucide-react";
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
  release_fee: number | null;
  release_fee_reason: string | null;
  release_fee_pix: string | null;
  release_fee_customer_cpf: string | null;
  release_fee_status: "pendente" | "pago" | null;
};

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "pendente", label: "Pendente" },
  { value: "postado", label: "Postado" },
  { value: "em_transito", label: "Em Trânsito" },
  { value: "em_entrega", label: "Em Entrega" },
  { value: "nao_entregue", label: "Não Entregue" },
  { value: "entregue", label: "Entregue" },
];

const feeReasons = [
  "Pedido bloqueado na alfândega",
  "Endereço incorreto ou incompleto",
  "Ausência na entrega (taxa de reentrega)",
  "Pacote retido por conferência",
  "Taxa de armazenagem",
  "Outro motivo",
];

type FeeModal = {
  tracking: Tracking;
  fee: string;
  reason: string;
  cpf: string;
  saving: boolean;
};

export default function TrackingsPage() {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [feeModal, setFeeModal] = useState<FeeModal | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchTrackings = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("trackings")
      .select("id, code, carrier_code, carrier, recipient_name, recipient_email, status, created_at, release_fee, release_fee_reason, release_fee_pix, release_fee_status")
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

  const openFeeModal = (t: Tracking) => {
    setFeeModal({
      tracking: t,
      fee: t.release_fee ? String(t.release_fee) : "",
      reason: t.release_fee_reason ?? feeReasons[0],
      cpf: t.release_fee_customer_cpf ?? "",
      saving: false,
    });
  };

  const saveFee = async () => {
    if (!feeModal) return;
    const feeValue = parseFloat(feeModal.fee.replace(",", "."));
    if (!feeModal.fee || isNaN(feeValue) || feeValue <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    const cpfClean = feeModal.cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      toast.error("Informe o CPF completo do destinatário.");
      return;
    }
    setFeeModal((m) => m && { ...m, saving: true });

    const res = await fetch("/api/freepay/create-pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tracking_id: feeModal.tracking.id,
        amount: feeValue,
        reason: feeModal.reason,
        cpf: cpfClean,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error ?? "Erro ao gerar PIX.");
      setFeeModal((m) => m && { ...m, saving: false });
      return;
    }

    toast.success("PIX gerado! O cliente já pode ver o QR code.");
    console.log("FreePay response:", JSON.stringify(data));
    setFeeModal(null);
    fetchTrackings();
  };

  const removeFee = async (id: string) => {
    const { error } = await supabase
      .from("trackings")
      .update({ release_fee: null, release_fee_reason: null, release_fee_pix: null, release_fee_status: null })
      .eq("id", id);
    if (!error) {
      toast.success("Taxa removida.");
      fetchTrackings();
    }
  };

  const markFeePaid = async (id: string) => {
    const { error } = await supabase
      .from("trackings")
      .update({ release_fee_status: "pago" })
      .eq("id", id);
    if (!error) {
      toast.success("Taxa marcada como paga!");
      fetchTrackings();
    }
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
              <option key={o.value} value={o.value}>{o.label}</option>
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
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Taxa</th>
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
                        <button onClick={() => copyCode(t.code)} className="text-gray-400 hover:text-gray-600">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-800 font-medium">{t.recipient_name}</p>
                      {t.recipient_email && <p className="text-xs text-gray-400">{t.recipient_email}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{t.carrier}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      {t.release_fee ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: t.release_fee_status === "pago" ? "#dcfce7" : "#fef3c7",
                              color: t.release_fee_status === "pago" ? "#166534" : "#92400e",
                            }}
                          >
                            {t.release_fee_status === "pago" ? "✓ Pago" : `R$ ${t.release_fee.toFixed(2)}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/track/${t.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                          style={{ color: "#0d9488" }}
                        >
                          Ver
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-gray-200">|</span>
                        {t.release_fee && t.release_fee_status === "pendente" ? (
                          <>
                            <button
                              onClick={() => markFeePaid(t.id)}
                              className="text-xs font-medium text-green-600 hover:underline flex items-center gap-0.5"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Pago
                            </button>
                            <button
                              onClick={() => removeFee(t.id)}
                              className="text-xs font-medium text-red-400 hover:underline"
                            >
                              Remover
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openFeeModal(t)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 hover:underline"
                          >
                            <Lock className="w-3 h-3" />
                            Taxa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de taxa de liberação */}
      {feeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fef3c7" }}>
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Taxa de Liberação</h3>
                  <p className="text-xs text-gray-500 font-mono">{feeModal.tracking.code}</p>
                </div>
              </div>
              <button onClick={() => setFeeModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Motivo do bloqueio
                </label>
                <select
                  value={feeModal.reason}
                  onChange={(e) => setFeeModal((m) => m && { ...m, reason: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                >
                  {feeReasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Valor da taxa (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">R$</span>
                  <input
                    type="text"
                    value={feeModal.fee}
                    onChange={(e) => setFeeModal((m) => m && { ...m, fee: e.target.value })}
                    placeholder="0,00"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  CPF do destinatário
                </label>
                <input
                  type="text"
                  value={feeModal.cpf}
                  onChange={(e) => setFeeModal((m) => m && { ...m, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Necessário para gerar o PIX via FreePay.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-xs text-orange-700 leading-relaxed">
                  <strong>Atenção:</strong> Ao salvar, o cliente verá um aviso de taxa pendente na página de rastreio com as instruções de pagamento.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setFeeModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveFee}
                disabled={feeModal.saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "#f97316" }}
              >
                {feeModal.saving ? "Salvando..." : "Cobrar taxa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
