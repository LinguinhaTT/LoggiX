"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Navigation } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const saved = localStorage.getItem("dialog-remember-email");
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("E-mail ou senha incorretos.");
      return;
    }
    if (rememberEmail) {
      localStorage.setItem("dialog-remember-email", email);
    } else {
      localStorage.removeItem("dialog-remember-email");
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
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

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Entrar na sua conta
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Digite suas credenciais para acessar o painel
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
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

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium hover:underline"
                    style={{ color: "#0d9488" }}
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#0d9488]"
                />
                <span className="text-sm text-gray-600">Lembrar meu e-mail</span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar →"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-semibold hover:underline"
                style={{ color: "#0d9488" }}
              >
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-12"
        style={{ backgroundColor: "#1e2a4a" }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
          style={{ backgroundColor: "rgba(13,148,136,0.2)" }}
        >
          <Navigation className="w-10 h-10" style={{ color: "#2dd4bf" }} />
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-4 max-w-xs">
          Gerencie seus envios com facilidade
        </h2>
        <p className="text-gray-400 text-center text-sm leading-relaxed max-w-sm">
          Acesse seu painel para criar rastreios, acompanhar entregas e gerenciar
          créditos de forma simples e profissional.
        </p>
      </div>
    </div>
  );
}
