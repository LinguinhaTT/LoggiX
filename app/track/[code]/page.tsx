import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  XCircle,
  Navigation,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { TrackingStatus } from "@/lib/supabase/types";

const statusConfig: Record<
  TrackingStatus,
  { label: string; color: string; icon: React.ElementType; bg: string }
> = {
  pendente: { label: "Pendente", color: "#f59e0b", icon: Clock, bg: "#fffbeb" },
  postado: { label: "Postado", color: "#3b82f6", icon: Package, bg: "#eff6ff" },
  em_transito: { label: "Em Trânsito", color: "#60a5fa", icon: Truck, bg: "#eff6ff" },
  em_entrega: { label: "Em Entrega", color: "#10b981", icon: MapPin, bg: "#f0fdf4" },
  nao_entregue: { label: "Não Entregue", color: "#ef4444", icon: XCircle, bg: "#fef2f2" },
  entregue: { label: "Entregue", color: "#0d9488", icon: CheckCircle, bg: "#f0fdfa" },
};

const timelineStatuses: TrackingStatus[] = [
  "postado",
  "em_transito",
  "em_entrega",
  "entregue",
];

export default async function TrackingPublicPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: tracking } = await supabase
    .from("trackings")
    .select("id, code, carrier, recipient_name, status, created_at, updated_at, product_description, carrier_code")
    .eq("code", code.toUpperCase())
    .single();

  if (!tracking) notFound();

  const { data: events } = await supabase
    .from("tracking_events")
    .select("id, status, description, location, event_date")
    .eq("tracking_id", tracking.id)
    .order("event_date", { ascending: false });

  const cfg = statusConfig[tracking.status as TrackingStatus];
  const StatusIcon = cfg.icon;

  const currentStepIndex = timelineStatuses.indexOf(tracking.status as TrackingStatus);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6fa" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(13,148,136,0.12)" }}
            >
              <Navigation className="w-4 h-4" style={{ color: "#0d9488" }} />
            </div>
            <span className="font-bold text-lg">
              Dia<span style={{ color: "#0d9488" }}>LOG</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold hover:underline"
            style={{ color: "#0d9488" }}
          >
            Sou lojista →
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* Status card */}
        <div className="card p-6" style={{ backgroundColor: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cfg.color}20` }}
              >
                <StatusIcon className="w-6 h-6" style={{ color: cfg.color }} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Status atual</p>
                <p className="text-xl font-bold" style={{ color: cfg.color }}>
                  {cfg.label}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Código</p>
              <p className="font-mono font-bold text-gray-900">{tracking.code}</p>
            </div>
          </div>

          {tracking.status === "entregue" && (
            <div
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#0d9488" }}
            >
              <CheckCircle className="w-4 h-4" />
              Seu pedido foi entregue com sucesso!
            </div>
          )}
          {tracking.status === "nao_entregue" && (
            <div className="flex items-center gap-2 text-sm font-medium text-red-600">
              <AlertCircle className="w-4 h-4" />
              Houve uma tentativa de entrega sem sucesso. Entre em contato com a transportadora.
            </div>
          )}
        </div>

        {/* Tracking info */}
        <div className="card p-5 grid grid-cols-2 gap-4">
          {[
            { label: "Destinatário", value: tracking.recipient_name },
            { label: "Transportadora", value: tracking.carrier },
            { label: "Código da Transportadora", value: tracking.carrier_code ?? "—" },
            {
              label: "Criado em",
              value: new Date(tracking.created_at).toLocaleDateString("pt-BR"),
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 font-mono">{item.value}</p>
            </div>
          ))}
          {tracking.product_description && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">Produto</p>
              <p className="text-sm font-medium text-gray-800">{tracking.product_description}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-5">Linha do Tempo</h2>

          {/* Progress bar */}
          {tracking.status !== "nao_entregue" && (
            <div className="flex items-center gap-0 mb-6">
              {timelineStatuses.map((s, i) => {
                const isCompleted = currentStepIndex >= i;
                const sCfg = statusConfig[s];
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                        style={{
                          backgroundColor: isCompleted ? sCfg.color : "#fff",
                          borderColor: isCompleted ? sCfg.color : "#e5e7eb",
                        }}
                      >
                        <sCfg.icon
                          className="w-4 h-4"
                          style={{ color: isCompleted ? "#fff" : "#d1d5db" }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium whitespace-nowrap"
                        style={{ color: isCompleted ? sCfg.color : "#9ca3af" }}
                      >
                        {sCfg.label}
                      </span>
                    </div>
                    {i < timelineStatuses.length - 1 && (
                      <div
                        className="flex-1 h-0.5 mx-1 -translate-y-3"
                        style={{
                          backgroundColor: currentStepIndex > i ? "#0d9488" : "#e5e7eb",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Events */}
          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map((ev, i) => {
                const evCfg = statusConfig[ev.status as TrackingStatus];
                return (
                  <div key={ev.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${evCfg.color}18` }}
                      >
                        <evCfg.icon className="w-4 h-4" style={{ color: evCfg.color }} />
                      </div>
                      {i < events.length - 1 && (
                        <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: "#e5e7eb" }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-semibold text-gray-900">{ev.description}</p>
                      {ev.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(ev.event_date).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum evento de rastreio disponível ainda.</p>
              <p className="text-xs mt-1">
                Atualizações aparecem aqui conforme seu pedido avança.
              </p>
            </div>
          )}
        </div>

        {/* Help */}
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)" }}
        >
          <p className="text-sm text-gray-600">
            Dúvidas sobre sua entrega?{" "}
            <span className="font-semibold" style={{ color: "#0d9488" }}>
              Fale com o vendedor pelo WhatsApp
            </span>{" "}
            usando o botão verde na tela.
          </p>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return {
    title: `Rastreamento ${code} — DiaLOG`,
    description: `Acompanhe o status da sua entrega com o código ${code}`,
  };
}
