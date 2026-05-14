"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, Navigation, ArrowRight } from "lucide-react";

function RastrearForm() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("codigo") ?? "");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Digite o código de rastreio.");
      return;
    }
    router.push(`/track/${trimmed}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f6fa" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(13,148,136,0.12)" }}
            >
              <Navigation className="w-4 h-4" style={{ color: "#0d9488" }} />
            </div>
            <span className="font-bold text-lg">
              Loggi<span style={{ color: "#0d9488" }}>X</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold hover:underline"
            style={{ color: "#0d9488" }}
          >
            Sou lojista →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(13,148,136,0.1)" }}
            >
              <Package className="w-10 h-10" style={{ color: "#0d9488" }} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Rastrear meu pedido
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            Digite o código de rastreio que você recebeu do vendedor
          </p>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Código de rastreio
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError("");
                    }}
                    placeholder="Ex: DLGAB12345"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-mono tracking-wide focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    autoFocus
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="mt-1.5 text-xs text-red-500">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-colors"
                style={{ backgroundColor: "#0d9488" }}
              >
                Rastrear pedido
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                O código de rastreio foi enviado pelo vendedor via e-mail ou
                WhatsApp após a confirmação do pedido.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { step: "1", label: "Digite o código", desc: "Recebido por e-mail ou WhatsApp" },
              { step: "2", label: "Consulte o status", desc: "Veja onde está seu pedido" },
              { step: "3", label: "Acompanhe", desc: "Linha do tempo em tempo real" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-2"
                  style={{ backgroundColor: "#0d9488" }}
                >
                  {item.step}
                </div>
                <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-gray-400">
        © 2026 LoggiX · Rastreamento de entregas para e-commerce
      </footer>
    </div>
  );
}

export default function RastrearPage() {
  return (
    <Suspense>
      <RastrearForm />
    </Suspense>
  );
}
