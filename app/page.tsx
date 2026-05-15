import Link from "next/link";
import {
  Navigation,
  Package,
  Truck,
  BarChart3,
  Shield,
  Bell,
  CheckCircle,
  ArrowRight,
  Star,
  Search,
  Plus,
  Share2,
  Eye,
  CreditCard,
  Users,
  Zap,
  Clock,
  MapPin,
  ChevronDown,
} from "lucide-react";

const howItWorks = [
  {
    step: "01",
    icon: Plus,
    title: "Crie sua conta grátis",
    desc: "Cadastre-se em menos de 1 minuto e ganhe 3 créditos para começar a rastrear seus pedidos agora mesmo.",
    color: "#0d9488",
  },
  {
    step: "02",
    icon: Package,
    title: "Cadastre o envio",
    desc: "Preencha os dados do pedido: nome do cliente, transportadora, produto e código da transportadora.",
    color: "#3b82f6",
  },
  {
    step: "03",
    icon: Share2,
    title: "Compartilhe o link",
    desc: "Envie o link de rastreio para o cliente por WhatsApp ou e-mail. Ele acessa sem precisar de cadastro.",
    color: "#8b5cf6",
  },
  {
    step: "04",
    icon: Eye,
    title: "Cliente acompanha",
    desc: "O cliente vê o status em tempo real, a linha do tempo e o histórico de movimentações do pedido.",
    color: "#f97316",
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Painel completo",
    desc: "Veja todos os seus rastreios em um só lugar com filtros por status, transportadora e período.",
    color: "#0d9488",
  },
  {
    icon: Bell,
    title: "Histórico de eventos",
    desc: "Adicione atualizações de status com localização e descrição detalhada para cada etapa.",
    color: "#f97316",
  },
  {
    icon: Truck,
    title: "Múltiplas transportadoras",
    desc: "Correios, Jadlog, Total Express, DHL, FedEx, Melhor Envio e muito mais.",
    color: "#3b82f6",
  },
  {
    icon: Search,
    title: "Página de rastreio pública",
    desc: "Cada pedido tem uma URL única. O cliente rastreia pelo link sem precisar de app ou login.",
    color: "#8b5cf6",
  },
  {
    icon: Shield,
    title: "Seguro e confiável",
    desc: "Dados protegidos com criptografia. Sua conta e a dos seus clientes sempre seguras.",
    color: "#10b981",
  },
  {
    icon: CreditCard,
    title: "Sistema de créditos",
    desc: "Pague apenas pelo que usar. Sem mensalidade fixa, sem surpresa na fatura.",
    color: "#ec4899",
  },
];

const carriers = [
  { name: "Correios", abbr: "ECT", bg: "#003087", text: "#FFC107" },
  { name: "Jadlog", abbr: "JDL", bg: "#E30613", text: "#fff" },
  { name: "Total Express", abbr: "TOT", bg: "#FF6B00", text: "#fff" },
  { name: "DHL", abbr: "DHL", bg: "#FFCC00", text: "#D40511" },
  { name: "FedEx", abbr: "FDX", bg: "#4D148C", text: "#FF6600" },
  { name: "Melhor Envio", abbr: "ME", bg: "#3BB54A", text: "#fff" },
  { name: "Azul Cargo", abbr: "AZL", bg: "#003087", text: "#fff" },
  { name: "Shopee Express", abbr: "SPE", bg: "#EE4D2D", text: "#fff" },
];

const plans = [
  { credits: 10, price: "R$ 9,90", per: "R$ 0,99/rastreio", highlight: false },
  { credits: 50, price: "R$ 39,90", per: "R$ 0,79/rastreio", highlight: true },
  { credits: 100, price: "R$ 69,90", per: "R$ 0,69/rastreio", highlight: false },
];

const faqs = [
  {
    q: "O que é um crédito?",
    a: "Cada crédito equivale à criação de 1 rastreio. Você ganha 3 créditos grátis ao se cadastrar.",
  },
  {
    q: "O cliente precisa ter conta para rastrear?",
    a: "Não. O cliente acessa a página de rastreio pelo link compartilhado, sem precisar de cadastro.",
  },
  {
    q: "Quais transportadoras são suportadas?",
    a: "Suportamos Correios, Jadlog, Total Express, DHL, FedEx, Melhor Envio, Azul Cargo e muito mais. Qualquer transportadora pode ser adicionada manualmente.",
  },
  {
    q: "Posso usar no celular?",
    a: "Sim! O painel e a página de rastreio são totalmente responsivos e funcionam em qualquer dispositivo.",
  },
  {
    q: "Os créditos expiram?",
    a: "Não. Os créditos não têm prazo de validade. Use no seu ritmo.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(13,148,136,0.12)" }}>
              <Navigation className="w-4 h-4" style={{ color: "#0d9488" }} />
            </div>
            <span className="font-bold text-xl">Loggi<span style={{ color: "#0d9488" }}>X</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-gray-900 transition-colors">Como funciona</a>
            <a href="#funcionalidades" className="hover:text-gray-900 transition-colors">Funcionalidades</a>
            <a href="#precos" className="hover:text-gray-900 transition-colors">Preços</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "#0d9488" }}>
              Cadastro Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: "rgba(13,148,136,0.08)", color: "#0d9488" }}>
            <Star className="w-4 h-4" />
            Sistema de rastreamento para lojistas
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Rastreamento profissional{" "}
            <span style={{ color: "#0d9488" }}>para o seu e-commerce</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Crie links de rastreio personalizados, acompanhe todos os seus envios em um painel e ofereça uma experiência incrível para os seus clientes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-opacity hover:opacity-90" style={{ backgroundColor: "#0d9488" }}>
              Criar conta grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/rastrear" className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-gray-300 text-lg transition-colors">
              <Search className="w-5 h-5" />
              Rastrear pedido
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-400">
            ✓ 3 créditos grátis ao criar sua conta · ✓ Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6" style={{ backgroundColor: "#f5f6fa" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "1.847", label: "Pedidos rastreados", icon: Package },
              { value: "98.7%", label: "Taxa de entrega", icon: CheckCircle },
              { value: "8+", label: "Transportadoras", icon: Truck },
              { value: "< 1min", label: "Para criar rastreio", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <stat.icon className="w-7 h-7 mx-auto mb-2" style={{ color: "#0d9488" }} />
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Simples assim</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Como funciona?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Em menos de 2 minutos você já tem seu primeiro rastreio ativo e o link pronto para compartilhar.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 z-0" style={{ backgroundColor: "#e5e7eb" }} />
                )}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative z-10 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="text-2xl font-black" style={{ color: `${item.color}40` }}>{item.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview do painel */}
      <section className="py-20 px-6" style={{ backgroundColor: "#1a1d2e" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2dd4bf" }}>O painel</p>
            <h2 className="text-4xl font-black text-white mb-4">Tudo numa tela só</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Gerencie todos os seus envios, veja o status de cada pedido e adicione atualizações em poucos cliques.</p>
          </div>

          {/* Mockup do dashboard */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            {/* Barra do painel */}
            <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: "#0f1117" }}>
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500 ml-2">loggix.netlify.app/dashboard</span>
            </div>
            <div className="flex" style={{ backgroundColor: "#1a1d2e", minHeight: "340px" }}>
              {/* Sidebar */}
              <div className="w-16 flex flex-col items-center py-6 gap-5" style={{ backgroundColor: "#12141f" }}>
                {[BarChart3, Package, Truck, CreditCard, Users].map((Icon, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? "bg-teal-500/20" : ""}`}>
                    <Icon className="w-5 h-5" style={{ color: i === 0 ? "#0d9488" : "#4b5563" }} />
                  </div>
                ))}
              </div>
              {/* Conteúdo */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white font-bold text-lg">Meus Rastreios</p>
                    <p className="text-gray-500 text-xs">5 envios ativos</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#0d9488" }}>
                    <Plus className="w-3.5 h-3.5" />
                    Novo rastreio
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { code: "DLGAB1234", name: "João Silva", carrier: "Jadlog", status: "Em Trânsito", color: "#8b5cf6" },
                    { code: "DLGCD5678", name: "Maria Santos", carrier: "Correios", status: "Em Entrega", color: "#f97316" },
                    { code: "DLGEF9012", name: "Pedro Costa", carrier: "DHL", status: "Entregue", color: "#10b981" },
                    { code: "DLGGH3456", name: "Ana Lima", carrier: "Total Express", status: "Postado", color: "#3b82f6" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      <span className="font-mono text-xs text-gray-400 w-24">{row.code}</span>
                      <span className="text-sm text-white flex-1">{row.name}</span>
                      <span className="text-xs text-gray-500 w-24 hidden md:block">{row.carrier}</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${row.color}20`, color: row.color }}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Funcionalidades</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Tudo que você precisa</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Ferramentas pensadas para lojistas que querem profissionalizar suas entregas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transportadoras */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f6fa" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Compatibilidade</p>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Transportadoras suportadas</h2>
          <p className="text-gray-500 mb-10">Trabalha com qualquer transportadora. Suporte nativo para as principais do Brasil.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {carriers.map((c) => (
              <div key={c.name} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0" style={{ backgroundColor: c.bg, color: c.text }}>
                  {c.abbr}
                </div>
                <span className="text-sm font-semibold text-gray-700">{c.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-dashed border-gray-200">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#f5f6fa" }}>
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-sm font-semibold text-gray-400">E muito mais...</span>
            </div>
          </div>
        </div>
      </section>

      {/* O que o cliente vê */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Para o seu cliente</p>
              <h2 className="text-4xl font-black text-gray-900 mb-5">Experiência que gera confiança</h2>
              <p className="text-gray-500 leading-relaxed mb-8">Seu cliente recebe um link de rastreio e acompanha o pedido em tempo real, sem precisar se cadastrar em nenhum lugar.</p>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: "Linha do tempo com todas as movimentações" },
                  { icon: Clock, text: "Status atualizado em tempo real" },
                  { icon: Truck, text: "Logo da transportadora e código de rastreio" },
                  { icon: Bell, text: "Página com as cores e identidade do pedido" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(13,148,136,0.1)" }}>
                      <item.icon className="w-4 h-4" style={{ color: "#0d9488" }} />
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Mini preview da página de rastreio */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="h-2" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }} />
              <div style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }} className="p-6 text-center">
                <div className="text-4xl mb-2">🚚</div>
                <p className="text-2xl font-black text-white">Em Trânsito</p>
                <p className="text-purple-200 text-sm">Seu pedido está a caminho!</p>
                <div className="inline-flex items-center gap-1 mt-3 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-white font-mono text-xs font-bold">DLGAB12345</span>
                </div>
              </div>
              <div className="bg-white p-5 space-y-3">
                <div className="flex justify-between">
                  {["Postado", "Trânsito", "Entrega", "Entregue"].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: i <= 1 ? "#8b5cf6" : "#e5e7eb", color: i <= 1 ? "#fff" : "#9ca3af" }}>
                        {i <= 1 ? "✓" : "·"}
                      </div>
                      <span className="text-xs" style={{ color: i <= 1 ? "#8b5cf6" : "#9ca3af" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#8b5cf6" }} />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Saiu para entrega em São Paulo</p>
                      <p className="text-xs text-gray-400">15/05 · 08:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-gray-300" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Chegou ao centro de distribuição</p>
                      <p className="text-xs text-gray-400">14/05 · 22:10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-24 px-6" style={{ backgroundColor: "#f5f6fa" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Preços</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Pague só pelo que usar</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Sem mensalidade. Sem surpresa. Compre créditos e use no seu ritmo. Cada crédito = 1 rastreio criado.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 text-center relative"
                style={{
                  backgroundColor: plan.highlight ? "#0d9488" : "#fff",
                  border: plan.highlight ? "none" : "2px solid #e5e7eb",
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    Mais popular
                  </div>
                )}
                <p className="text-5xl font-black mb-1" style={{ color: plan.highlight ? "#fff" : "#111827" }}>
                  {plan.credits}
                </p>
                <p className="text-sm mb-4" style={{ color: plan.highlight ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
                  créditos
                </p>
                <p className="text-3xl font-black mb-1" style={{ color: plan.highlight ? "#fff" : "#111827" }}>
                  {plan.price}
                </p>
                <p className="text-xs mb-6" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "#9ca3af" }}>
                  {plan.per}
                </p>
                <Link
                  href="/register"
                  className="block py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: plan.highlight ? "#fff" : "#0d9488",
                    color: plan.highlight ? "#0d9488" : "#fff",
                  }}
                >
                  Começar agora
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            ✓ Ganhe 3 créditos grátis ao se cadastrar · ✓ Créditos nunca expiram
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>FAQ</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Dúvidas frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6" style={{ backgroundColor: "#1a1d2e" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(13,148,136,0.2)" }}>
            <Navigation className="w-8 h-8" style={{ color: "#2dd4bf" }} />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Comece agora, é grátis
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Crie sua conta em menos de 1 minuto e ganhe 3 rastreios grátis para testar.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0d9488" }}
          >
            Criar conta grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-gray-500 text-sm">Sem cartão de crédito · Sem mensalidade</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5" style={{ color: "#0d9488" }} />
              <span className="font-bold text-gray-900">Loggi<span style={{ color: "#0d9488" }}>X</span></span>
              <span className="text-gray-400 text-sm ml-2">© 2026</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#como-funciona" className="hover:text-gray-900">Como funciona</a>
              <a href="#precos" className="hover:text-gray-900">Preços</a>
              <a href="#faq" className="hover:text-gray-900">FAQ</a>
              <Link href="/rastrear" className="hover:text-gray-900">Rastrear pedido</Link>
              <Link href="/login" className="hover:text-gray-900">Login</Link>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            Empresa em processo de formalização
          </p>
        </div>
      </footer>
    </div>
  );
}
