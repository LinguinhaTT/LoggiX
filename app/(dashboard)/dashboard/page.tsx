import { createClient } from "@/lib/supabase/server";
import {
  Package,
  CheckCircle,
  Truck,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import type { TrackingStatus } from "@/lib/supabase/types";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, credits")
    .eq("id", user!.id)
    .single();

  const { data: trackings } = await supabase
    .from("trackings")
    .select("id, code, recipient_name, carrier, status, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(8);

  const { count: totalCount } = await supabase
    .from("trackings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: deliveredCount } = await supabase
    .from("trackings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("status", "entregue");

  const { count: transitCount } = await supabase
    .from("trackings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .in("status", ["em_transito", "em_entrega"]);

  const name = profile?.name?.split(" ")[0] ?? "Lojista";
  const credits = profile?.credits ?? 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {name}! 👋
          </h1>
          <p className="text-sm text-gray-500 capitalize">{dateStr}</p>
        </div>
        <Link
          href="/dashboard/new-tracking"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#0d9488" }}
        >
          <Plus className="w-4 h-4" />
          Novo Rastreio
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total de Rastreios"
          value={totalCount ?? 0}
          color="#3b82f6"
          sub="todos os tempos"
        />
        <StatCard
          icon={CheckCircle}
          label="Entregues"
          value={deliveredCount ?? 0}
          color="#0d9488"
          sub="com sucesso"
        />
        <StatCard
          icon={Truck}
          label="Em Trânsito"
          value={transitCount ?? 0}
          color="#60a5fa"
          sub="em movimento"
        />
        <StatCard
          icon={CreditCard}
          label="Créditos"
          value={credits}
          color="#f97316"
          sub="disponíveis"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/dashboard/new-tracking"
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(13,148,136,0.1)" }}
          >
            <Plus className="w-5 h-5" style={{ color: "#0d9488" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Novo Rastreio</p>
            <p className="text-xs text-gray-400">Criar envio</p>
          </div>
        </Link>
        <Link
          href="/dashboard/pending-shipments"
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(249,115,22,0.1)" }}
          >
            <Clock className="w-5 h-5" style={{ color: "#f97316" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Pendentes</p>
            <p className="text-xs text-gray-400">Ver envios</p>
          </div>
        </Link>
        <Link
          href="/dashboard/credits"
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Recarregar</p>
            <p className="text-xs text-gray-400">Comprar créditos</p>
          </div>
        </Link>
      </div>

      {/* Recent trackings */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Rastreios Recentes</h2>
          <Link
            href="/dashboard/trackings"
            className="text-sm font-medium hover:underline"
            style={{ color: "#0d9488" }}
          >
            Ver todos →
          </Link>
        </div>

        {!trackings || trackings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "rgba(13,148,136,0.08)" }}
            >
              <Package className="w-7 h-7" style={{ color: "#0d9488" }} />
            </div>
            <p className="text-gray-800 font-semibold mb-1">Nenhum rastreio ainda</p>
            <p className="text-sm text-gray-400 mb-4">
              Comece criando seu primeiro rastreio personalizado.
            </p>
            <Link
              href="/dashboard/new-tracking"
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#0d9488" }}
            >
              Criar primeiro rastreio
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">
                    Código
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">
                    Destinatário
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">
                    Transportadora
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {trackings.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-sm font-semibold text-gray-800">
                        {t.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {t.recipient_name}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {t.carrier}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status as TrackingStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credits warning */}
      {credits < 3 && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}
        >
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#f97316" }} />
          <div>
            <p className="text-sm font-semibold text-orange-800">
              Créditos baixos — {credits} restante{credits !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-orange-700">
              Recarregue seus créditos para continuar criando rastreios.{" "}
              <Link href="/dashboard/credits" className="font-semibold underline">
                Recarregar agora
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
