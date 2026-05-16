export type TrackingStatus =
  | "pendente"
  | "postado"
  | "em_transito"
  | "em_entrega"
  | "nao_entregue"
  | "entregue";

export type TicketStatus = "aberto" | "em_andamento" | "fechado";

export type TransactionType = "credito" | "debito";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          credits: number;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          credits?: number;
          referral_code: string;
          referred_by?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          credits?: number;
        };
        Relationships: [];
      };
      trackings: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          carrier_code: string | null;
          carrier: string;
          recipient_name: string;
          recipient_email: string | null;
          recipient_phone: string | null;
          zip_code: string | null;
          product_description: string | null;
          status: TrackingStatus;
          created_at: string;
          updated_at: string;
          release_fee: number | null;
          release_fee_reason: string | null;
          release_fee_pix: string | null;
          release_fee_status: "pendente" | "pago" | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          carrier_code?: string | null;
          carrier: string;
          recipient_name: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          zip_code?: string | null;
          product_description?: string | null;
          status?: TrackingStatus;
          created_at?: string;
          updated_at?: string;
          release_fee?: number | null;
          release_fee_reason?: string | null;
          release_fee_pix?: string | null;
          release_fee_status?: "pendente" | "pago" | null;
        };
        Update: {
          carrier_code?: string | null;
          status?: TrackingStatus;
          updated_at?: string;
          release_fee?: number | null;
          release_fee_reason?: string | null;
          release_fee_pix?: string | null;
          release_fee_status?: "pendente" | "pago" | null;
        };
        Relationships: [];
      };
      tracking_events: {
        Row: {
          id: string;
          tracking_id: string;
          status: TrackingStatus;
          description: string;
          location: string | null;
          event_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracking_id: string;
          status: TrackingStatus;
          description: string;
          location?: string | null;
          event_date: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      credits_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: TransactionType;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: TransactionType;
          description: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          message: string;
          status: TicketStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          message: string;
          status?: TicketStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: TicketStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
