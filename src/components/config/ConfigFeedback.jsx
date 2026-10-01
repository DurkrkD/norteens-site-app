import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";

export default function ConfigFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    norteens.listarFeedbacksAdmin()
      .then(setFeedbacks)
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Feedbacks</h2>

      {loading && (
        <div className="p-6 bg-card rounded-2xl border border-border text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      )}

      {!loading && erro && (
        <div className="p-6 bg-card rounded-2xl border border-border text-center">
          <p className="text-destructive">{erro}</p>
        </div>
      )}

      {!loading && !erro && feedbacks.length === 0 && (
        <div className="p-6 bg-card rounded-2xl border border-border text-center">
          <p className="text-muted-foreground">Nenhum feedback recebido ainda.</p>
        </div>
      )}

      {!loading && !erro && feedbacks.length > 0 && (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div key={f.id} className="p-4 bg-card rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{f.autor_nome}</span>
                <span className="text-xs text-muted-foreground">{new Date(f.criado_em).toLocaleDateString("pt-BR")}</span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{f.texto}</p>
              {f.autorizar_exibicao && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                  Autorizado para exibição pública
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
