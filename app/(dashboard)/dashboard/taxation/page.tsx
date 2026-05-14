import { Receipt, FileText, AlertCircle, Download } from "lucide-react";

export default function TaxationPage() {
  const docs = [
    { name: "Nota Fiscal Simplificada", desc: "Gere NFs simplificadas para seus envios", status: "Em breve" },
    { name: "Relatório Fiscal Mensal", desc: "Exportar relatório de transações para contabilidade", status: "Em breve" },
    { name: "Comprovante de Envio", desc: "Gere comprovantes de cada rastreio", status: "Disponível" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Taxação e Documentos Fiscais</h1>
        <p className="text-sm text-gray-500">
          Gerencie documentos fiscais e relatórios dos seus envios
        </p>
      </div>

      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
      >
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3b82f6" }} />
        <p className="text-sm text-blue-800">
          <strong>Atenção:</strong> As funcionalidades fiscais estão em desenvolvimento. Em breve você
          poderá gerar notas fiscais simplificadas e relatórios de transações.
        </p>
      </div>

      <div className="grid gap-4">
        {docs.map((doc, i) => (
          <div key={i} className="card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(13,148,136,0.08)" }}
              >
                {i === 2 ? (
                  <FileText className="w-5 h-5" style={{ color: "#0d9488" }} />
                ) : (
                  <Receipt className="w-5 h-5" style={{ color: "#0d9488" }} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={
                  doc.status === "Disponível"
                    ? { backgroundColor: "#ccfbf1", color: "#0f766e" }
                    : { backgroundColor: "#fff7ed", color: "#c2410c" }
                }
              >
                {doc.status}
              </span>
              {doc.status === "Disponível" && (
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: "#0d9488" }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Gerar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: "#0d9488" }} />
          Informações Fiscais
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Regime tributário", value: "Simples Nacional" },
            { label: "CNPJ", value: "— Não informado —" },
            { label: "Inscrição Estadual", value: "— Não informada —" },
            { label: "Responsável fiscal", value: "— Não informado —" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="font-medium text-gray-700">{item.value}</p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 text-sm font-semibold hover:underline"
          style={{ color: "#0d9488" }}
        >
          Atualizar informações fiscais →
        </button>
      </div>
    </div>
  );
}
