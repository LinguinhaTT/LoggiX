"use client";

import { useState } from "react";
import { X, Copy, QrCode, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

type Step = "idle" | "cpf" | "loading" | "done" | "error";

export function PayFeeButton({
  trackingId,
  amount,
  reason,
}: {
  trackingId: string;
  amount: number;
  reason: string;
}) {
  const [step, setStep] = useState<Step>("idle");
  const [cpf, setCpf] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [rawData, setRawData] = useState<unknown>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleGenerate = async () => {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) {
      toast.error("CPF inválido. Digite os 11 dígitos.");
      return;
    }
    setStep("loading");
    try {
      const res = await fetch("/api/freepay/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_id: trackingId, amount, reason, cpf: digits }),
      });
      const data = await res.json();
      console.log("[FreePay raw response]", JSON.stringify(data, null, 2));
      if (!res.ok) {
        setErrorMsg(data.error ?? "Erro ao gerar PIX.");
        setStep("error");
        return;
      }
      setQrCode(data.qr_code ?? null);
      setPaymentUrl(data.payment_url ?? null);
      setRawData(data._raw ?? data);
      setStep("done");
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setStep("error");
    }
  };

  const copyQr = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      toast.success("PIX copiado!");
    }
  };

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("cpf")}
        className="block w-full py-3 rounded-xl text-center font-bold text-white text-sm"
        style={{ backgroundColor: "#f97316" }}
      >
        Pagar via PIX →
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <p className="font-bold text-gray-900">
            {step === "done" ? "PIX gerado!" : "Pagar via PIX"}
          </p>
          <button
            onClick={() => { setStep("idle"); setCpf(""); setQrCode(null); setPaymentUrl(null); }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* CPF step */}
          {(step === "cpf" || step === "loading") && (
            <>
              <p className="text-sm text-gray-600">
                Digite seu CPF para gerar o QR code PIX e pagar a taxa de{" "}
                <strong>R$ {amount.toFixed(2).replace(".", ",")}</strong>.
              </p>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Seu CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  disabled={step === "loading"}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:opacity-50"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={step === "loading"}
                className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                style={{ backgroundColor: "#f97316" }}
              >
                {step === "loading" ? "Gerando PIX..." : "Gerar QR Code"}
              </button>
            </>
          )}

          {/* Done step */}
          {step === "done" && (
            <>
              <p className="text-sm text-gray-600 text-center">
                Escaneie o QR code ou copie o código PIX abaixo.
              </p>

              {paymentUrl && (
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm"
                  style={{ backgroundColor: "#f97316" }}
                >
                  <QrCode className="w-4 h-4" />
                  Abrir página de pagamento
                </a>
              )}

              {qrCode && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">PIX Copia e Cola:</p>
                  <p className="text-xs font-mono text-gray-700 break-all leading-relaxed mb-2">
                    {qrCode}
                  </p>
                  <button
                    onClick={copyQr}
                    className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar código PIX
                  </button>
                </div>
              )}

              {!paymentUrl && !qrCode && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Resposta da FreePay (debug):</p>
                  <pre className="text-xs text-gray-700 break-all whitespace-pre-wrap overflow-auto max-h-48">
                    {JSON.stringify(rawData, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}

          {/* Error step */}
          {step === "error" && (
            <>
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
              <button
                onClick={() => setStep("cpf")}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Tentar novamente
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
