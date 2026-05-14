"use client";

import { useState, useEffect } from "react";
import { Users, Copy, Gift, TrendingUp, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageLoader } from "@/components/ui/spinner";
import toast from "react-hot-toast";

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("referred_by", profile?.referral_code ?? "");
      setReferralCode(profile?.referral_code ?? "");
      setTotalReferrals(count ?? 0);
      setCreditsEarned((count ?? 0) * 7);
      setLoading(false);
    };
    fetch();
  }, []);

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copiado!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Código copiado!");
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programa de Indicações</h1>
        <p className="text-sm text-gray-500">
          Convide amigos e ganhe créditos quando eles fizerem a primeira recarga
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Indicados", value: totalReferrals, color: "#3b82f6" },
          { icon: Gift, label: "Créditos Ganhos", value: creditsEarned, color: "#0d9488" },
          { icon: TrendingUp, label: "Por indicação", value: "7 créditos", color: "#f97316" },
        ].map((stat, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}18` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Seu Link de Indicação</h2>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Link para compartilhar</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
              <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{referralLink}</span>
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
              style={{ backgroundColor: "#0d9488" }}
            >
              <Copy className="w-4 h-4" />
              Copiar Link
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Código de indicação</label>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed rounded-lg"
              style={{ borderColor: "#0d9488", backgroundColor: "rgba(13,148,136,0.05)" }}
            >
              <Gift className="w-4 h-4" style={{ color: "#0d9488" }} />
              <span className="font-mono font-bold text-lg tracking-widest" style={{ color: "#0d9488" }}>
                {referralCode}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Como funciona</h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Compartilhe seu link",
              desc: "Envie seu link ou código de indicação para amigos lojistas.",
            },
            {
              step: "2",
              title: "Eles se cadastram",
              desc: "Seu amigo cria uma conta usando seu link ou inserindo seu código.",
            },
            {
              step: "3",
              title: "Ganhe créditos",
              desc: "Quando seu indicado fizer a primeira recarga, você recebe 7 créditos automaticamente.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                style={{ backgroundColor: "#0d9488" }}
              >
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
