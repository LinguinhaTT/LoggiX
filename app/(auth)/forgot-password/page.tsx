"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Navigation, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu e-mail.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Erro ao enviar e-mail. Verifique o endereço.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(13,148,136,0.12)" }}
            >
              <Navigation className="w-4 h-4" style={{ color: "#0d9488" }} />
            </div>
            <span className="font-bold text-lg">
              Loggi<span style={{ color: "#0d9488" }}>X</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] p-8">
            {sent ? (
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(13,148,136,0.1)" }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "#0d9488" }} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  E-mail enviado!
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Verifique sua caixa de entrada e siga as instruções para recuperar
                  sua senha.
                </p>
                <Link
                  href="/login"
                  className="text-sm font-semibold hover:underline flex items-center justify-center gap-1"
                  style={{ color: "#0d9488" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Esqueceu sua senha?
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                  Digite seu e-mail para receber um link de recuperação
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      "Enviar link de recuperação"
                    )}
                  </button>
                </form>

                <div className="mt-5">
                  <Link
                    href="/login"
                    className="text-sm hover:underline flex items-center gap-1"
                    style={{ color: "#0d9488" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o login
                  </Link>
                </div>
              </>
            )}
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
          style={{ backgroundColor: "rgba(13,148,136,0.2)" }}
        >
          <Navigation className="w-10 h-10" style={{ color: "#2dd4bf" }} />
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-4 max-w-xs">
          Recupere seu acesso rapidamente
        </h2>
        <p className="text-gray-400 text-center text-sm leading-relaxed max-w-sm">
          Enviaremos um link seguro para o seu e-mail cadastrado. Em poucos minutos
          você estará de volta ao painel.
        </p>
      </div>
    </div>
  );
}
