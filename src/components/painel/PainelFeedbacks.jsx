import React, { useState, useEffect } from "react";
import { MessageSquareHeart, Lock, Star } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { useToast } from "@/components/ui/use-toast";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader } from "@/components/painel/ui";

const FILTROS = [
  { id: "todos", label: "Todos", testa: () => true },
  { id: "destaque", label: "Na página inicial", testa: (f) => f.destaque },
  { id: "autorizados", label: "Autorizados", testa: (f) => f.autorizar_exibicao },
  { id: "privados", label: "Privados", testa: (f) => !f.autorizar_exibicao },
];

export default function PainelFeedbacks() {
  const { toast } = useToast();
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

  const alternarDestaque = async (f) => {
    try {
      const { destaque } = await norteens.destacarFeedback(f.id, !f.destaque);
      setFeedbacks((lista) => lista.map((x) => (x.id === f.id ? { ...x, destaque } : x)));
      toast({ title: destaque ? "Feedback destacado na página inicial." : "Feedback retirado da página inicial." });
    } catch (e) {
      toast({ title: e.message, variant: "destructive" });
    }
  };

  if (loading) return <PageLoading />;

  const visiveis = feedbacks.filter(FILTROS.find((f) => f.id === filtro).testa);

  return (
    <div>
      <SecaoHeader
        titulo="Feedbacks"
        descricao="O que os alunos contam depois de completar a jornada. Só aparecem na página inicial os que o aluno autorizou e a equipe destacou."
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
          <div className="flex gap-1.5 mb-5 overflow-x-auto" role="tablist">
            {FILTROS.map((f) => {
              const n = feedbacks.filter(f.testa).length;
              const ativo = f.id === filtro;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={ativo}
                  onClick={() => setFiltro(f.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    ativo ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {f.label} <span className="opacity-60 ml-0.5">{n}</span>
                </button>
              );
            })}
          </div>

          {visiveis.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Nenhum feedback neste filtro.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {visiveis.map((f) => (
                <article
                  key={f.id}
                  className={`flex flex-col p-5 rounded-2xl bg-card border ${f.destaque ? "border-highlight/60 ring-1 ring-highlight/30" : "border-border"}`}
                >
                  <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap flex-1">“{f.texto}”</p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{f.autor_nome || "Usuário"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {f.autor_email} · {new Date(f.criado_em).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    {f.autorizar_exibicao ? (
                      <button
                        onClick={() => alternarDestaque(f)}
                        aria-pressed={f.destaque}
                        className={`inline-flex items-center gap-1.5 shrink-0 h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                          f.destaque
                            ? "bg-highlight/25 border-highlight/50 text-[#8a5a12] hover:bg-highlight/35"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${f.destaque ? "fill-current" : ""}`} />
                        {f.destaque ? "Na página inicial" : "Destacar"}
                      </button>
                    ) : (
                      <span
                        title="O aluno não autorizou exibir este feedback"
                        className="inline-flex items-center gap-1 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        <Lock className="w-3 h-3" /> Privado
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
