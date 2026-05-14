import { Handshake, Star, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Parceiro Bronze",
    requirements: "10+ indicações ativas",
    benefits: ["Badge de parceiro", "5% de comissão por recarga", "Suporte prioritário"],
    color: "#cd7f32",
  },
  {
    name: "Parceiro Prata",
    requirements: "50+ indicações ativas",
    benefits: [
      "Badge de parceiro prata",
      "10% de comissão por recarga",
      "Suporte prioritário",
      "Acesso antecipado a novidades",
    ],
    color: "#94a3b8",
  },
  {
    name: "Parceiro Ouro",
    requirements: "100+ indicações ativas",
    benefits: [
      "Badge de parceiro ouro",
      "15% de comissão por recarga",
      "Gerente de conta dedicado",
      "Marca branca disponível",
      "Acesso antecipado a novidades",
    ],
    color: "#eab308",
  },
];

export default function PartnershipPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programa de Parceria</h1>
        <p className="text-sm text-gray-500">
          Torne-se um parceiro LoggiX e ganhe comissões por cada indicação convertida
        </p>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-8 text-white text-center"
        style={{ background: "linear-gradient(135deg, #1a1d2e 0%, #1e2a4a 100%)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "rgba(13,148,136,0.25)" }}
        >
          <Handshake className="w-8 h-8" style={{ color: "#2dd4bf" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Seja um Parceiro LoggiX</h2>
        <p className="text-gray-300 max-w-lg mx-auto text-sm mb-6">
          Indique clientes e ganhe comissões recorrentes em cada recarga realizada.
          Quanto mais você indica, maior sua comissão.
        </p>
        <Link
          href="/dashboard/referrals"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#0d9488" }}
        >
          Começar a indicar
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tiers */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Níveis de Parceria</h2>
        <div className="grid grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div key={tier.name} className="card p-6 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12"
                style={{ backgroundColor: `${tier.color}15` }}
              />
              <Star className="w-6 h-6 mb-3" style={{ color: tier.color }} />
              <h3 className="font-bold text-gray-900 mb-1">{tier.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{tier.requirements}</p>
              <div className="space-y-2">
                {tier.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#0d9488" }} />
                    <span className="text-sm text-gray-600">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-5 flex items-center justify-between"
        style={{ backgroundColor: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)" }}
      >
        <div>
          <p className="font-semibold text-gray-900">Pronto para se tornar um parceiro?</p>
          <p className="text-sm text-gray-500">
            Comece compartilhando seu link de indicação e acumule indicações para subir de nível.
          </p>
        </div>
        <Link
          href="/dashboard/referrals"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap ml-6"
          style={{ backgroundColor: "#0d9488" }}
        >
          Ver meu link
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
