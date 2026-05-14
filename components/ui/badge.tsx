import type { TrackingStatus } from "@/lib/supabase/types";

const statusConfig: Record<
  TrackingStatus,
  { label: string; bg: string; text: string }
> = {
  pendente: { label: "Pendente", bg: "#fef3c7", text: "#92400e" },
  postado: { label: "Postado", bg: "#dbeafe", text: "#1e40af" },
  em_transito: { label: "Em Trânsito", bg: "#dbeafe", text: "#1d4ed8" },
  em_entrega: { label: "Em Entrega", bg: "#d1fae5", text: "#065f46" },
  nao_entregue: { label: "Não Entregue", bg: "#fee2e2", text: "#991b1b" },
  entregue: { label: "Entregue", bg: "#ccfbf1", text: "#0f766e" },
};

export function StatusBadge({ status }: { status: TrackingStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

export function StatusDot({ status }: { status: TrackingStatus }) {
  const dotColors: Record<TrackingStatus, string> = {
    pendente: "#f59e0b",
    postado: "#3b82f6",
    em_transito: "#60a5fa",
    em_entrega: "#10b981",
    nao_entregue: "#ef4444",
    entregue: "#0d9488",
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: dotColors[status] }}
    />
  );
}

export { statusConfig };
