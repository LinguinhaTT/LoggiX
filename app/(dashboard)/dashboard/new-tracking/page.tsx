"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Truck, Hash, FileText, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

function generateCode(): string {
  const prefix = "DLG";
  const rand = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}${rand}`;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
}

function formatZip(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

const carriers = [
  "DiaLOG",
  "Loggi",
  "Jadlog",
  "Correios",
  "Total Express",
  "Sequoia",
  "J&T Express",
  "Outros",
];

export default function NewTrackingPage() {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [carrier, setCarrier] = useState("DiaLOG");
  const [carrierCode, setCarrierCode] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode] = useState(generateCode);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !carrier) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits < 1) {
      setLoading(false);
      toast.error("Créditos insuficientes. Recarregue para continuar.");
      router.push("/dashboard/credits");
      return;
    }

    const { error } = await supabase.from("trackings").insert({
      user_id: user.id,
      code: generatedCode,
      carrier,
      carrier_code: carrierCode || null,
      recipient_name: recipientName,
      recipient_email: recipientEmail || null,
      recipient_phone: recipientPhone ? recipientPhone.replace(/\D/g, "") : null,
      zip_code: zipCode ? zipCode.replace(/\D/g, "") : null,
      product_description: productDescription || null,
      status: "pendente",
    });

    if (error) {
      setLoading(false);
      toast.error("Erro ao criar rastreio. Tente novamente.");
      return;
    }

    await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    await supabase.from("credits_transactions").insert({
      user_id: user.id,
      amount: 1,
      type: "debito",
      description: `Rastreio criado: ${generatedCode}`,
    });

    setLoading(false);
    toast.success(`Rastreio ${generatedCode} criado com sucesso!`);
    router.push("/dashboard/trackings");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Rastreio</h1>
        <p className="text-sm text-gray-500">
          Preencha os dados do destinatário e do envio
        </p>
      </div>

      {/* Generated Code Preview */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center gap-4"
        style={{ backgroundColor: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)" }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(13,148,136,0.15)" }}
        >
          <Hash className="w-5 h-5" style={{ color: "#0d9488" }} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Código do rastreio (gerado automaticamente)</p>
          <p className="font-mono text-lg font-bold" style={{ color: "#0d9488" }}>
            {generatedCode}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: "#0d9488" }} />
            Dados do Destinatário
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nome do destinatário"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP de Destino</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(formatZip(e.target.value))}
                placeholder="00000-000"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm max-w-[180px]"
              />
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="w-4 h-4" style={{ color: "#0d9488" }} />
            Dados do Envio
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transportadora <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
                  required
                >
                  {carriers.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código da Transportadora
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={carrierCode}
                  onChange={(e) => setCarrierCode(e.target.value.toUpperCase())}
                  placeholder="AA123456789BR"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição do Produto
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Ex: Camiseta tamanho M, cor azul"
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            Custo: <strong>1 crédito</strong>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "auto" }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </span>
              ) : (
                "Criar Rastreio →"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
