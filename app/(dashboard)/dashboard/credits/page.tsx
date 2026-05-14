"use client";

import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageLoader } from "@/components/ui/spinner";
import toast from "react-hot-toast";

type Transaction = {
  id: string;
  amount: number;
  type: "credito" | "debito";
  description: string;
  created_at: string;
};

const packages = [
  { credits: 10, price: "R$ 9,90", priceNum: 9.9, tag: null },
  { credits: 50, price: "R$ 39,90", priceNum: 39.9, tag: "Popular" },
  { credits: 100, price: "R$ 69,90", priceNum: 69.9, tag: "Melhor valor" },
  { credits: 250, price: "R$ 149,90", priceNum: 149.9, tag: null },
];

export default function CreditsPage() {
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: profile }, { data: txns }] = await Promise.all([
        supabase.from("profiles").select("credits").eq("id", user.id).single(),
        supabase
          .from("credits_transactions")
          .select("id, amount, type, description, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      setCredits(profile?.credits ?? 0);
      setTransactions((txns as Transaction[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handlePurchase = async (pkg: typeof packages[0]) => {
    setPurchasing(pkg.credits);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`Simulação: ${pkg.credits} créditos adicionados!`, { duration: 3000 });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newCredits = credits + pkg.credits;
      await supabase.from("profiles").update({ credits: newCredits }).eq("id", user.id);
      await supabase.from("credits_transactions").insert({
        user_id: user.id,
        amount: pkg.credits,
        type: "credito",
        description: `Recarga de ${pkg.credits} créditos — ${pkg.price}`,
      });
      setCredits(newCredits);
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          amount: pkg.credits,
          type: "credito",
          description: `Recarga de ${pkg.credits} créditos — ${pkg.price}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
    setPurchasing(null);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Créditos</h1>
        <p className="text-sm text-gray-500">Gerencie seus créditos e histórico de transações</p>
      </div>

      {/* Balance card */}
      <div
        className="rounded-2xl p-6 text-white flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }}
      >
        <div>
          <p className="text-teal-100 text-sm mb-1">Saldo disponível</p>
          <p className="text-5xl font-bold">{credits}</p>
          <p className="text-teal-100 text-sm mt-1">créditos</p>
        </div>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <CreditCard className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Packages */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Recarregar Créditos</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.credits}
              className="card p-5 flex flex-col items-center text-center relative hover:shadow-md transition-shadow"
            >
              {pkg.tag && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: "#0d9488" }}
                >
                  {pkg.tag}
                </span>
              )}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "rgba(13,148,136,0.1)" }}
              >
                <Zap className="w-6 h-6" style={{ color: "#0d9488" }} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{pkg.credits}</p>
              <p className="text-sm text-gray-500 mb-3">créditos</p>
              <p className="text-lg font-bold mb-4" style={{ color: "#0d9488" }}>
                {pkg.price}
              </p>
              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing !== null}
                className="btn-primary text-sm"
                style={{ padding: "8px 16px" }}
              >
                {purchasing === pkg.credits ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  "Comprar"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Histórico de Transações</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma transação registrada ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: t.type === "credito" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    }}
                  >
                    {t.type === "credito" ? (
                      <TrendingUp className="w-4 h-4" style={{ color: "#10b981" }} />
                    ) : (
                      <TrendingDown className="w-4 h-4" style={{ color: "#ef4444" }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span
                  className="font-bold text-sm"
                  style={{ color: t.type === "credito" ? "#10b981" : "#ef4444" }}
                >
                  {t.type === "credito" ? "+" : "-"}{t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
