import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "rgba(13,148,136,0.1)" }}
      >
        <Icon className="w-8 h-8" style={{ color: "#0d9488" }} />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{subtitle}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
