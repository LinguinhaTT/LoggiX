"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, Navigation, Gift } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
}

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralReadonly, setReferralReadonly] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setReferralReadonly(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (password.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      setLoading(false);
      toast.error(error?.message ?? "Erro ao criar conta. Tente novamente.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      email,
      phone: phone.replace(/\D/g, ""),
      credits: 3,
      referral_code: generateReferralCode(),
      referred_by: referralCode || null,
    });

    setLoading(false);

    if (profileError) {
      toast.error("Conta criada, mas erro ao salvar perfil.");
    } else {
      toast.success("Conta criada com sucesso! Bem-vindo ao DiaLOG.");
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(13,148,136,0.12)" }}
            >
              <Navigation className="w-4 h-4" style={{ color: "#0d9488" }} />
            </div>
            <span className="font-bold text-lg">
              Dia<span style={{ color: "#0d9488" }}>LOG</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar sua conta</h1>
            <p className="text-sm text-gray-500 mb-6">
              Preencha os dados abaixo para começar
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Celular (com DDD)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Referral */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <Gift className="w-4 h-4 text-green-500" />
                  Código de indicação{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) =>
                    !referralReadonly && setReferralCode(e.target.value.toUpperCase())
                  }
                  readOnly={referralReadonly}
                  placeholder="EX: ABC12345"
                  className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors uppercase ${
                    referralReadonly ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Quem te indicou recebe 7 créditos quando você fizer sua primeira recarga.
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Criando conta...
                  </span>
                ) : (
                  "Criar conta →"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: "#0d9488" }}>
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-12"
        style={{ backgroundColor: "#1e2a4a" }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
          style={{ backgroundColor: "#0d9488" }}
        >
          <Navigation className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Comece gratuitamente
        </h2>
        <p className="text-gray-400 text-center text-sm leading-relaxed mb-8 max-w-sm">
          Crie sua conta e ganhe acesso ao painel de controle completo para gerenciar
          seus envios de forma profissional.
        </p>

        <div
          className="w-full max-w-xs rounded-xl p-5 space-y-4"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {[
            "Crie rastreios personalizados",
            "Acompanhe status em tempo real",
            "Gere notas fiscais simplificadas",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "#0d9488", color: "#fff" }}
              >
                {i + 1}
              </div>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
