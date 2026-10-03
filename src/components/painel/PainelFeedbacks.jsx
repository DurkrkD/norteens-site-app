import React, { useState, useEffect } from "react";
import { MessageSquareHeart, Globe, Lock } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader } from "@/components/painel/ui";

const FILTROS = [
  { id: "todos", label: "Todos", testa: () => true },
  { id: "publicos", label: "Públicos", testa: (f) => f.autorizar_exibicao },
  { id: "privados", label: "Privados", testa: (f) => !f.autorizar_exibicao },
];

export default function PainelFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    norteens
      .listarFeedbacksAdmin()
      .then(setFeedbacks)
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  const visiveis = feedbacks.filter(FILTROS.find((f) => f.id === filtro).testa);

  return (
    <div>
      <SecaoHeader
        titulo="Feedbacks"
        descricao="O que os alunos contam depois de completar a jornada. Os públicos podem aparecer na página inicial."
      />

      {erro ? (
        <EmptyState icon={MessageSquareHeart} title="Não foi possível carregar" description={erro} />
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon={MessageSquareHeart}
          title="Nenhum feedback ainda"
          description="O formulário é liberado para o aluno quando ele completa os 4 passos da jornada."
        />
      ) : (
        <>
          <div className="flex gap-1.5 mb-5" role="tablist">
            {FILTROS.map((f) => {
              const n = feedbacks.filter(f.testa).length;
              const ativo = f.id === filtro;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={ativo}
                  onClick={() => setFiltro(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    ativo ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {f.label} <span className="opacity-60 ml-0.5">{n}</span>
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {visiveis.map((f) => (
              <article key={f.id} className="flex flex-col p-5 rounded-2xl bg-card border border-border">
                <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap flex-1">“{f.texto}”</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{f.autor_nome || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {f.autor_email} · {new Date(f.criado_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {f.autorizar_exibicao ? (
                    <span className="inline-flex items-center gap-1 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/15 text-secondary">
                      <Globe className="w-3 h-3" /> Público
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      <Lock className="w-3 h-3" /> Privado
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
