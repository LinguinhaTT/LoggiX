interface CarrierConfig {
  abbr: string;
  bg: string;
  text: string;
  full?: string;
}

const carriers: Record<string, CarrierConfig> = {
  "correios":       { abbr: "ECT",  bg: "#003087", text: "#FFC107", full: "Correios" },
  "jadlog":         { abbr: "JDL",  bg: "#E30613", text: "#FFFFFF", full: "Jadlog" },
  "total express":  { abbr: "TOT",  bg: "#FF6B00", text: "#FFFFFF", full: "Total Express" },
  "azul cargo":     { abbr: "AZL",  bg: "#003087", text: "#FFFFFF", full: "Azul Cargo" },
  "sequoia":        { abbr: "SEQ",  bg: "#00A651", text: "#FFFFFF", full: "Sequoia" },
  "braspress":      { abbr: "BRS",  bg: "#005BA1", text: "#FFFFFF", full: "Braspress" },
  "tnt":            { abbr: "TNT",  bg: "#FF6200", text: "#FFFFFF", full: "TNT" },
  "dhl":            { abbr: "DHL",  bg: "#FFCC00", text: "#D40511", full: "DHL" },
  "fedex":          { abbr: "FDX",  bg: "#4D148C", text: "#FF6600", full: "FedEx" },
  "ups":            { abbr: "UPS",  bg: "#351C15", text: "#FFB500", full: "UPS" },
  "mandae":         { abbr: "MND",  bg: "#6C2DC7", text: "#FFFFFF", full: "Mandaê" },
  "loggi":          { abbr: "LGI",  bg: "#00B4D8", text: "#FFFFFF", full: "Loggi" },
  "melhor envio":   { abbr: "ME",   bg: "#3BB54A", text: "#FFFFFF", full: "Melhor Envio" },
  "shopee express": { abbr: "SPE",  bg: "#EE4D2D", text: "#FFFFFF", full: "Shopee Express" },
  "mercado envios": { abbr: "ME",   bg: "#FFE600", text: "#333333", full: "Mercado Envios" },
  "shein":          { abbr: "SHN",  bg: "#000000", text: "#FFFFFF", full: "Shein" },
  "amazon":         { abbr: "AMZ",  bg: "#FF9900", text: "#131921", full: "Amazon" },
};

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 35%)`;
}

interface CarrierLogoProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function CarrierLogo({ name, size = "md" }: CarrierLogoProps) {
  const key = name.toLowerCase().trim();
  const cfg = carriers[key];

  const abbr = cfg?.abbr ?? name.slice(0, 3).toUpperCase();
  const bg = cfg?.bg ?? hashColor(name);
  const text = cfg?.text ?? "#FFFFFF";

  const sizes = {
    sm: { box: "w-10 h-10", font: "text-xs" },
    md: { box: "w-14 h-14", font: "text-sm" },
    lg: { box: "w-20 h-20", font: "text-base" },
  };

  const { box, font } = sizes[size];

  return (
    <div
      className={`${box} rounded-2xl flex items-center justify-center font-black tracking-tight shadow-sm flex-shrink-0`}
      style={{ backgroundColor: bg, color: text }}
    >
      <span className={font}>{abbr}</span>
    </div>
  );
}
