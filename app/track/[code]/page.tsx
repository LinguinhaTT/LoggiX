import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/auto-refresh";
import { CarrierLogo } from "@/components/carrier-logo";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  XCircle,
  Navigation,
  AlertCircle,
  Calendar,
  Hash,
  User,
} from "lucide-react";
import Link from "next/link";
import type { TrackingStatus } from "@/lib/supabase/types";

const statusConfig: Record<
  TrackingStatus,
  {
    label: string;
    color: string;
    gradient: string;
    lightBg: string;
    icon: React.ElementType;
    emoji: string;
    message: string;
  }
> = {
  pendente: {
    label: "Pendente",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    lightBg: "#fffbeb",
    icon: Clock,
    emoji: "⏳",
    message: "Seu pedido foi recebido e está aguardando postagem.",
  },
  postado: {
    label: "Postado",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    lightBg: "#eff6ff",
    icon: Package,
    emoji: "📦",
    message: "Pedido postado! Já está nas mãos da transportadora.",
  },
  em_transito: {
    label: "Em Trânsito",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    lightBg: "#f5f3ff",
    icon: Truck,
    emoji: "🚚",
    message: "Seu pedido está a caminho! Em breve chegará até você.",
  },
  em_entrega: {
    label: "Em Entrega",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    lightBg: "#fff7ed",
    icon: MapPin,
    emoji: "🛵",
    message: "O entregador está a caminho! Fique por perto.",
  },
  nao_entregue: {
    label: "Não Entregue",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    lightBg: "#fef2f2",
    icon: XCircle,
    emoji: "❌",
    message: "Tentativa de entrega sem sucesso. Entre em contato com a transportadora.",
  },
  entregue: {
    label: "Entregue",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    lightBg: "#f0fdf4",
    icon: CheckCircle,
    emoji: "✅",
    message: "Pedido entregue com sucesso! Aproveite sua compra.",
  },
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
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      <AutoRefresh intervalMs={30000} />
      {/* Hero colorido */}
      <div style={{ background: cfg.gradient }} className="pb-16 pt-0">
        {/* Header */}
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              LoggiX
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            Sou lojista →
          </Link>
        </div>

        {/* Status hero */}
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-2 text-center">
          <div className="text-6xl mb-4">{cfg.emoji}</div>
          <h1 className="text-3xl font-black text-white mb-2">{cfg.label}</h1>
          <p className="text-white/80 text-sm mb-4">{cfg.message}</p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <Hash className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white font-mono font-bold text-sm tracking-widest">
              {tracking.code}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 -mt-8 pb-10 space-y-4">

        {/* Timeline card */}
        {tracking.status !== "nao_entregue" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
              Progresso da entrega
            </h2>
            <div className="flex items-start justify-between relative">
              {/* linha de fundo */}
              <div
                className="absolute top-4 left-4 right-4 h-0.5"
                style={{ backgroundColor: "#e5e7eb", zIndex: 0 }}
              />
              {/* linha de progresso */}
              {currentStepIndex > 0 && (
                <div
                  className="absolute top-4 h-0.5 transition-all"
                  style={{
                    left: "4px",
                    width: `${(currentStepIndex / (timelineStatuses.length - 1)) * 100}%`,
                    backgroundColor: cfg.color,
                    zIndex: 1,
                  }}
                />
              )}
              {timelineStatuses.map((s, i) => {
                const sCfg = statusConfig[s];
                const isCompleted = currentStepIndex >= i;
                const isCurrent = currentStepIndex === i;
                return (
                  <div key={s} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                      style={{
                        backgroundColor: isCompleted ? cfg.color : "#fff",
                        borderColor: isCompleted ? cfg.color : "#e5e7eb",
                        boxShadow: isCurrent ? `0 0 0 4px ${cfg.color}30` : "none",
                      }}
                    >
                      <sCfg.icon
                        className="w-4 h-4"
                        style={{ color: isCompleted ? "#fff" : "#d1d5db" }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold text-center leading-tight"
                      style={{ color: isCompleted ? cfg.color : "#9ca3af" }}
                    >
                      {sCfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${cfg.color}15` }}
            >
              <User className="w-5 h-5" style={{ color: cfg.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Destinatário</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {tracking.recipient_name}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <CarrierLogo name={tracking.carrier} size="sm" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Transportadora</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {tracking.carrier}
              </p>
            </div>
          </div>

          {tracking.carrier_code && (
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${cfg.color}15` }}
              >
                <Hash className="w-5 h-5" style={{ color: cfg.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Cód. Transportadora</p>
                <p className="text-sm font-semibold text-gray-800 font-mono truncate">
                  {tracking.carrier_code}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${cfg.color}15` }}
            >
              <Calendar className="w-5 h-5" style={{ color: cfg.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Criado em</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(tracking.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {tracking.product_description && (
            <div className="col-span-2 bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${cfg.color}15` }}
              >
                <Package className="w-5 h-5" style={{ color: cfg.color }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Produto</p>
                <p className="text-sm font-semibold text-gray-800">
                  {tracking.product_description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Eventos */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
            Histórico de atualizações
          </h2>

          {events && events.length > 0 ? (
            <div className="space-y-0">
              {events.map((ev, i) => {
                const evCfg = statusConfig[ev.status as TrackingStatus];
                return (
                  <div key={ev.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                        style={{
                          backgroundColor: evCfg.lightBg,
                          borderColor: evCfg.color,
                        }}
                      >
                        <evCfg.icon className="w-4 h-4" style={{ color: evCfg.color }} />
                      </div>
                      {i < events.length - 1 && (
                        <div
                          className="w-0.5 flex-1 my-1"
                          style={{ backgroundColor: "#e5e7eb", minHeight: "24px" }}
                        />
                      )}
                    </div>
                    <div className="pb-5 pt-1 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1"
                            style={{
                              backgroundColor: evCfg.lightBg,
                              color: evCfg.color,
                            }}
                          >
                            {evCfg.label}
                          </span>
                          <p className="text-sm font-semibold text-gray-900">{ev.description}</p>
                          {ev.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {ev.location}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                          {new Date(ev.event_date).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${cfg.color}15` }}
              >
                <Package className="w-8 h-8" style={{ color: cfg.color }} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Nenhum evento ainda</p>
              <p className="text-xs text-gray-400 mt-1">
                As atualizações aparecerão aqui conforme seu pedido avança.
              </p>
            </div>
          )}
        </div>

        {/* Ajuda */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ backgroundColor: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}
        >
          <p className="text-sm text-gray-600">
            Dúvidas sobre sua entrega?{" "}
            <span className="font-semibold" style={{ color: cfg.color }}>
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
    title: `Rastreamento ${code} — LoggiX`,
    description: `Acompanhe o status da sua entrega com o código ${code}`,
  };
}
