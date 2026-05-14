export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div
      className={`${sizes[size]} rounded-full border-[3px] border-transparent animate-spin`}
      style={{
        borderTopColor: "#0d9488",
        borderRightColor: "rgba(13,148,136,0.3)",
        borderBottomColor: "rgba(13,148,136,0.3)",
        borderLeftColor: "rgba(13,148,136,0.3)",
      }}
    />
  );
}

export function PageLoader({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" />
      <p className="text-gray-500 text-sm font-medium">{text}</p>
    </div>
  );
}
