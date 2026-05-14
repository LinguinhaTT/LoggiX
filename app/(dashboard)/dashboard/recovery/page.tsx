import { RefreshCw, MessageCircle, Mail, ShoppingCart, TrendingUp } from "lucide-react";

export default function RecoveryPage() {
  const stats = [
    { label: "Carrinhos Recuperados", value: "0", icon: ShoppingCart, color: "#0d9488" },
    { label: "Taxa de Recuperação", value: "0%", icon: TrendingUp, color: "#3b82f6" },
    { label: "Mensagens Enviadas", value: "0", icon: MessageCircle, color: "#f97316" },
  ];

  const channels = [
    {
      icon: MessageCircle,
      name: "WhatsApp",
      desc: "Envie mensagens automáticas para clientes com carrinho abandonado",
      color: "#25d366",
      status: "Em breve",
    },
    {
      icon: Mail,
      name: "E-mail",
      desc: "Sequência de e-mails personalizados de recuperação de carrinho",
      color: "#3b82f6",
      status: "Em breve",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recuperação de Carrinho</h1>
        <p className="text-sm text-gray-500">
          Recupere vendas perdidas com mensagens automáticas para clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${s.color}18` }}
            >
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Channels */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Canais de Recuperação</h2>
        <div className="grid grid-cols-2 gap-4">
          {channels.map((ch, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${ch.color}18` }}
                  >
                    <ch.icon className="w-5 h-5" style={{ color: ch.color }} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{ch.name}</h3>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#fff7ed", color: "#c2410c" }}
                >
                  {ch.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{ch.desc}</p>
              <button
                disabled
                className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold text-gray-400 bg-gray-100 cursor-not-allowed"
              >
                Configurar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon banner */}
      <div
        className="rounded-xl p-6 flex items-start gap-4"
        style={{ backgroundColor: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)" }}
      >
        <RefreshCw className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#0d9488" }} />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Funcionalidade em desenvolvimento
          </h3>
          <p className="text-sm text-gray-600">
            A recuperação automática de carrinhos está sendo desenvolvida. Em breve você
            poderá configurar mensagens automáticas via WhatsApp e e-mail para clientes
            que abandonaram o carrinho. Aguarde novidades!
          </p>
        </div>
      </div>
    </div>
  );
}
