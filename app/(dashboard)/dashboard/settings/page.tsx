"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageLoader } from "@/components/ui/spinner";
import toast from "react-hot-toast";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
}

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email, phone")
        .eq("id", user.id)
        .single();
      setName(profile?.name ?? "");
      setEmail(profile?.email ?? user.email ?? "");
      setPhone(profile?.phone ? formatPhone(profile.phone) : "");
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ name, phone: phone.replace(/\D/g, "") })
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) {
      toast.error("Erro ao salvar perfil.");
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      toast.error("Erro ao alterar senha. Verifique a senha atual.");
    } else {
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (loading) return <PageLoader />;

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Gerencie seu perfil e preferências da conta</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          style={{ backgroundColor: "#0d9488" }}
        >
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSaveProfile} className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: "#0d9488" }} />
          Informações Pessoais
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 opacity-70 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={savingProfile} className="btn-primary" style={{ width: "auto" }}>
            {savingProfile ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Perfil
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Password form */}
      <form onSubmit={handleChangePassword} className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: "#0d9488" }} />
          Alterar Senha
        </h2>

        {[
          { label: "Nova senha", value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
          { label: "Confirmar nova senha", value: confirmPassword, set: setConfirmPassword, show: false, toggle: () => {} },
        ].map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={i === 0 && field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
              {i === 0 && (
                <button
                  type="button"
                  onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" disabled={savingPassword} className="btn-primary" style={{ width: "auto" }}>
            {savingPassword ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Alterando...
              </span>
            ) : (
              "Alterar Senha"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
