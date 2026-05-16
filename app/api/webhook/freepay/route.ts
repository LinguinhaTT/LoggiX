import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Id, Status } = body;

    if (!Id || !Status) {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    if (Status === "PAID") {
      const supabase = await createClient();

      // Usa a função SECURITY DEFINER para atualizar sem precisar de sessão
      await supabase.rpc("confirm_release_fee_payment", {
        p_transaction_id: Id,
      });
    }

    // FreePay exige sempre 200
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook FreePay error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
