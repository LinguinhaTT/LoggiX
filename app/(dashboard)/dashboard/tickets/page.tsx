"use client";

import { useState, useEffect } from "react";
import React from "react";
import { HeadphonesIcon, Plus, X, Send, Clock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageLoader } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import toast from "react-hot-toast";
import type { TicketStatus } from "@/lib/supabase/types";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  created_at: string;
};

const statusLabel: Record<TicketStatus, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  fechado: "Fechado",
};

const statusStyle: Record<TicketStatus, React.CSSProperties> = {
  aberto: { backgroundColor: "#ffe4e6", color: "#be123c" },
  em_andamento: { backgroundColor: "#dbeafe", color: "#1e40af" },
  fechado: { backgroundColor: "#d1fae5", color: "#065f46" },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const fetchTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("support_tickets")
      .select("id, subject, message, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTickets((data as Ticket[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: subject.trim(),
      message: message.trim(),
      status: "aberto",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao abrir ticket.");
      return;
    }
    toast.success("Ticket aberto com sucesso! Responderemos em até 24h.");
    setSubject("");
    setMessage("");
    setShowForm(false);
    fetchTickets();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suporte</h1>
          <p className="text-sm text-gray-500">Abra tickets e acompanhe seus chamados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "#0d9488" }}
        >
          <Plus className="w-4 h-4" />
          Novo Ticket
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Abrir novo ticket</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Descreva brevemente o problema"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva detalhadamente o que aconteceu..."
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: "auto" }}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar Ticket
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets list */}
      {tickets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={HeadphonesIcon}
            title="Nenhum ticket aberto"
            subtitle="Abra um ticket de suporte e nossa equipe responderá em até 24 horas."
            action={{ label: "Abrir Ticket", onClick: () => setShowForm(true) }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(13,148,136,0.08)" }}
                  >
                    {t.status === "fechado" ? (
                      <CheckCircle className="w-4 h-4" style={{ color: "#0d9488" }} />
                    ) : (
                      <Clock className="w-4 h-4" style={{ color: "#f97316" }} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(t.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={statusStyle[t.status]}
                >
                  {statusLabel[t.status]}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 ml-12">{t.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Contact info */}
      <div
        className="rounded-xl p-5 flex items-start gap-4"
        style={{ backgroundColor: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.15)" }}
      >
        <HeadphonesIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#0d9488" }} />
        <div>
          <p className="font-semibold text-gray-900 text-sm">Precisa de ajuda rápida?</p>
          <p className="text-sm text-gray-600">
            Nosso suporte funciona de segunda a sexta, das 9h às 18h. Você também pode
            nos contatar pelo{" "}
            <span style={{ color: "#0d9488" }} className="font-semibold">
              WhatsApp
            </span>{" "}
            usando o botão no canto da tela.
          </p>
        </div>
      </div>
    </div>
  );
}
