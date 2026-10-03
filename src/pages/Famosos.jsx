import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageContainer, PageHeader, PageLoading, EmptyState } from "@/components/layout/Page";

const CORES_AVATAR = ["bg-accent/15 text-accent", "bg-secondary/15 text-secondary", "bg-highlight/25 text-[#8a5a12]"];

export default function Famosos() {
  const [famosos, setFamosos] = useState([]);
  const [profissoes, setProfissoes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([norteens.listarFamosos(), norteens.listarProfissoes()])
      .then(([f, p]) => {
        setFamosos(f);
        const map = {};
        p.forEach((pr) => (map[pr.id] = pr));
        setProfissoes(map);
      })
      .catch(() => setFamosos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Inspiração"
        title="Famosos"
        description="Pessoas reais que construíram carreira nas profissões que você está explorando."
      />

      {famosos.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nenhum famoso cadastrado ainda"
          description="Em breve você vai conhecer quem inspira em cada profissão."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {famosos.map((f, i) => {
            const prof = profissoes[f.profissao_id];
            return (
              <article key={f.id} className="flex flex-col p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-12 h-12 rounded-full font-heading font-semibold text-lg flex items-center justify-center shrink-0 ${
                      CORES_AVATAR[i % CORES_AVATAR.length]
                    }`}
                  >
                    {f.nome?.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-foreground leading-snug">{f.nome}</h2>
                    {prof && (
                      <Link
                        to={`/profissoes/${prof.id}`}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {prof.icone} {prof.nome}
                      </Link>
                    )}
                  </div>
                </div>
                {f.bio && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{f.bio}</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
