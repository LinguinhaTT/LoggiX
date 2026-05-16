import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const FREEPAY_URL = "https://api.freepaybrasil.com/v1/payment-transaction/create";
const AUTH = Buffer.from(
  `${process.env.FREEPAY_PUBLIC_KEY}:${process.env.FREEPAY_SECRET_KEY}`
).toString("base64");

export async function POST(req: NextRequest) {
  try {
    const { tracking_id, amount, reason, cpf } = await req.json();

    if (!tracking_id || !amount || !reason || !cpf) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const supabase = await createClient();

    // Busca dados do rastreio
    const { data: tracking, error: fetchError } = await supabase
      .from("trackings")
      .select("id, code, recipient_name, recipient_email, recipient_phone")
      .eq("id", tracking_id)
      .single();

    if (fetchError || !tracking) {
      return NextResponse.json({ error: "Rastreio não encontrado." }, { status: 404 });
    }

    const amountCents = Math.round(amount * 100);
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://loggix.netlify.app"}/api/webhook/freepay`;

    // Cria transação PIX na FreePay
    const freepayRes = await fetch(FREEPAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Basic ${AUTH}`,
      },
      body: JSON.stringify({
        amount: amountCents,
        payment_method: "pix",
        postback_url: webhookUrl,
        metadata: { provider_name: "LoggiX" },
        customer: {
          name: tracking.recipient_name,
          email: tracking.recipient_email ?? "cliente@loggix.app",
          phone: tracking.recipient_phone ? `+55${tracking.recipient_phone.replace(/\D/g, "")}` : "+5511999999999",
          document: {
            number: cpf.replace(/\D/g, ""),
            type: "cpf",
          },
        },
        items: [
          {
            title: reason,
            unit_price: amountCents,
            quantity: 1,
            tangible: false,
            external_ref: `taxa_${tracking.code}`,
          },
        ],
        pix: { expires_in_days: 3 },
      }),
    });

    const freepayData = await freepayRes.json();

    if (!freepayRes.ok) {
      console.error("FreePay error:", freepayData);
      return NextResponse.json({ error: "Erro ao gerar PIX na FreePay." }, { status: 500 });
    }

    // Extrai QR code e URL de pagamento da resposta
    const transactionId = freepayData.id ?? freepayData.Id ?? freepayData.transaction_id;
    const qrCode = freepayData.pix?.qr_code ?? freepayData.pix_qr_code ?? freepayData.qr_code ?? null;
    const paymentUrl = freepayData.pix?.payment_url ?? freepayData.payment_url ?? freepayData.url ?? null;

    // Salva no banco
    const { error: updateError } = await supabase
      .from("trackings")
      .update({
        release_fee: amount,
        release_fee_reason: reason,
        release_fee_status: "pendente",
        release_fee_customer_cpf: cpf.replace(/\D/g, ""),
        release_fee_transaction_id: transactionId,
        release_fee_qr_code: qrCode,
        release_fee_payment_url: paymentUrl,
        release_fee_pix: qrCode ?? paymentUrl,
      })
      .eq("id", tracking_id);

    if (updateError) {
      return NextResponse.json({ error: "Erro ao salvar no banco." }, { status: 500 });
    }

    return NextResponse.json({ success: true, qr_code: qrCode, payment_url: paymentUrl, transaction_id: transactionId, _raw: freepayData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
