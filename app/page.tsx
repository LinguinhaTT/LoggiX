import Link from "next/link";
import {
  Navigation,
  Package,
  Truck,
  BarChart3,
  Shield,
  Bell,
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Rastreio Personalizado",
    desc: "Crie códigos de rastreio únicos com sua marca para cada envio.",
    color: "#0d9488",
  },
  {
    icon: Truck,
    title: "Múltiplas Transportadoras",
    desc: "Suporte para LoggiX, Loggi, Jadlog, Correios e muito mais.",
    color: "#3b82f6",
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    desc: "Plataforma com criptografia ponta a ponta para seus dados.",
    color: "#10b981",
  },
  {
    icon: Bell,
    title: "Atualização Automática",
    desc: "Notificações automáticas de status por e-mail e WhatsApp.",
    color: "#f97316",
  },
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    desc: "Métricas em tempo real sobre suas entregas e créditos.",
    color: "#8b5cf6",
  },
  {
    icon: FileText,
    title: "Nota Fiscal Simplificada",
    desc: "Gere documentos fiscais dos seus envios com um clique.",
    color: "#ec4899",
  },
];

const integrations = ["Zedy", "Vega V1", "Vega V2", "Luna", "Adoorei", "Corvex", "Shopify"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(13,148,136,0.12)" }}
            >
              <Navigation className="w-4 h-4" style={{ color: "#0d9488" }} />
            </div>
            <span className="font-bold text-xl">
              Loggi<span style={{ color: "#0d9488" }}>X</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#0d9488" }}
            >
              Cadastro Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: "rgba(13,148,136,0.08)", color: "#0d9488" }}
          >
            <Star className="w-4 h-4" />
            Sistema completo de rastreamento para e-commerce
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Rastreie seus envios com{" "}
            <span style={{ color: "#0d9488" }}>controle total</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Crie códigos de rastreio personalizados, acompanhe entregas em tempo real e
            ofereça uma experiência profissional para seus clientes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white text-lg"
              style={{ backgroundColor: "#0d9488" }}
            >
              Criar conta grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-gray-300 text-lg"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6" style={{ backgroundColor: "#f5f6fa" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "234", label: "Envios ativos", icon: Package },
              { value: "1.847", label: "Entregues", icon: CheckCircle },
              { value: "98.7%", label: "Taxa de entrega", icon: BarChart3 },
            ].map((stat, i) => (
              <div key={i} className="card p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: "#0d9488" }} />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-gray-500">
              Ferramentas completas para gerenciar seus envios de forma profissional
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover:shadow-md transition-shadow">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f6fa" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Integrações</h2>
          <p className="text-gray-500 mb-8">
            Compatível com as principais plataformas de e-commerce
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrations.map((name) => (
              <span
                key={name}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: "#1a1d2e" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(13,148,136,0.2)" }}
          >
            <Navigation className="w-8 h-8" style={{ color: "#2dd4bf" }} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Comece hoje mesmo, é grátis
          </h2>
          <p className="text-gray-400 mb-8">
            Crie sua conta em segundos e ganhe 3 créditos para seus primeiros rastreios.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg"
            style={{ backgroundColor: "#0d9488" }}
          >
            Criar conta grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5" style={{ color: "#0d9488" }} />
            <span className="font-bold text-gray-900">
              Loggi<span style={{ color: "#0d9488" }}>X</span>
            </span>
            <span className="text-gray-400 text-sm ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-900">Sobre</Link>
            <Link href="#" className="hover:text-gray-900">Termos</Link>
            <Link href="#" className="hover:text-gray-900">Privacidade</Link>
            <Link href="/login" className="hover:text-gray-900">Login</Link>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Empresa em processo de formalização
        </p>
      </footer>
    </div>
  );
}
