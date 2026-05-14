import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/whatsapp-button";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DiaLOG - Sistema de Rastreamento de Entregas para E-commerce",
  description:
    "Gerencie seus envios com facilidade. Crie rastreios personalizados, acompanhe entregas em tempo real e gere notas fiscais simplificadas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "8px", fontSize: "14px", fontWeight: "500" },
            success: { style: { background: "#0d9488", color: "#fff" } },
            error: { style: { background: "#ef4444", color: "#fff" } },
          }}
        />
        <WhatsAppButton />
      </body>
    </html>
  );
}
