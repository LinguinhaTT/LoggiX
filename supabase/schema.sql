-- ============================================================
-- DiaLOG - Schema SQL para Supabase
-- Execute este script no SQL Editor do painel do Supabase
-- ============================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABELA: profiles (dados do lojista)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  credits    INTEGER NOT NULL DEFAULT 3,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: trackings (rastreios criados pelo lojista)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trackings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code                TEXT NOT NULL UNIQUE,
  carrier_code        TEXT,
  carrier             TEXT NOT NULL,
  recipient_name      TEXT NOT NULL,
  recipient_email     TEXT,
  recipient_phone     TEXT,
  zip_code            TEXT,
  product_description TEXT,
  status              TEXT NOT NULL DEFAULT 'pendente'
                      CHECK (status IN ('pendente','postado','em_transito','em_entrega','nao_entregue','entregue')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trackings_user_id ON public.trackings(user_id);
CREATE INDEX IF NOT EXISTS idx_trackings_code    ON public.trackings(code);

-- ============================================================
-- TABELA: tracking_events (linha do tempo do rastreio)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id UUID NOT NULL REFERENCES public.trackings(id) ON DELETE CASCADE,
  status      TEXT NOT NULL
              CHECK (status IN ('pendente','postado','em_transito','em_entrega','nao_entregue','entregue')),
  description TEXT NOT NULL,
  location    TEXT,
  event_date  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_tracking_id ON public.tracking_events(tracking_id);

-- ============================================================
-- TABELA: credits_transactions (histórico de créditos)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.credits_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('credito', 'debito')),
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_txns_user_id ON public.credits_transactions(user_id);

-- ============================================================
-- TABELA: support_tickets
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'aberto'
             CHECK (status IN ('aberto', 'em_andamento', 'fechado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.support_tickets(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trackings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets    ENABLE ROW LEVEL SECURITY;

-- profiles: cada usuário vê e edita apenas o próprio perfil
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- trackings: lojista acessa apenas seus rastreios
-- leitura pública por código (para página de rastreio do cliente)
CREATE POLICY "trackings_select_own"   ON public.trackings FOR SELECT USING (auth.uid() = user_id OR TRUE);
CREATE POLICY "trackings_insert_own"   ON public.trackings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trackings_update_own"   ON public.trackings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trackings_delete_own"   ON public.trackings FOR DELETE USING (auth.uid() = user_id);

-- tracking_events: públicos para leitura (cliente rastreia), lojista insere
CREATE POLICY "events_select_all"  ON public.tracking_events FOR SELECT USING (TRUE);
CREATE POLICY "events_insert_owner" ON public.tracking_events FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.trackings WHERE id = tracking_id)
  );

-- credits_transactions: apenas próprio usuário
CREATE POLICY "txns_select_own"  ON public.credits_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "txns_insert_own"  ON public.credits_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- support_tickets: apenas próprio usuário
CREATE POLICY "tickets_select_own" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tickets_insert_own" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNÇÃO: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_trackings_updated_at
  BEFORE UPDATE ON public.trackings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
