import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageLoading, EmptyState } from "@/components/layout/Page";

const CORES_AVATAR = [
  "from-accent/25 to-accent/10 text-accent",
  "from-secondary/25 to-secondary/10 text-secondary",
  "from-highlight/35 to-highlight/10 text-[#8a5a12]",
];

const iniciais = (nome = "") =>
  nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function Famosos() {
  const [famosos, setFamosos] = useState([]);
  const [profissoes, setProfissoes] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filtro = searchParams.get("profissao") || "";

  useEffect(() => {
    Promise.all([norteens.listarFamosos(), norteens.listarProfissoes()])
      .then(([f, p]) => {
        setFamosos(f);
        setProfissoes(Object.fromEntries(p.map((pr) => [pr.id, pr])));
      })
      .catch(() => setFamosos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  // só as profissões que têm pelo menos um famoso viram filtro
  const comFamosos = [...new Set(famosos.map((f) => f.profissao_id))]
    .map((id) => profissoes[id])
    .filter(Boolean)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const visiveis = filtro ? famosos.filter((f) => String(f.profissao_id) === filtro) : famosos;

  const chip = (ativo) =>
    `shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition-colors ${
      ativo ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
    }`;

  return (
    <div>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Inspiração</p>
          <h1 className="mt-3 text-[2.4rem] sm:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance max-w-3xl">
            Gente que chegou{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">lá.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
            Pessoas reais que construíram carreira nas profissões que você está explorando.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {famosos.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Nenhuma referência cadastrada ainda"
            description="Em breve você vai conhecer quem inspira em cada profissão."
          />
        ) : (
          <>
            {comFamosos.length > 1 && (
              // uma linha só, rolando para o lado (com muitas profissões, quebrar em várias linhas polui a página)
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin] [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-32px),transparent)]">
                <button onClick={() => setSearchParams({}, { replace: true })} className={chip(!filtro)}>
                  Todas <span className="opacity-60 ml-1">{famosos.length}</span>
                </button>
                {comFamosos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSearchParams({ profissao: String(p.id) }, { replace: true })}
                    className={chip(filtro === String(p.id))}
                  >
                    {p.icone} {p.nome}
                  </button>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visiveis.map((f, i) => {
                const prof = profissoes[f.profissao_id];
                return (
                  <article key={f.id} className="flex flex-col rounded-2xl bg-card border border-border p-6">
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br font-heading font-bold text-lg flex items-center justify-center shrink-0 ${
                          CORES_AVATAR[i % CORES_AVATAR.length]
                        }`}
                      >
                        {iniciais(f.nome)}
                      </span>
                      <h2 className="text-lg font-bold text-foreground leading-snug">{f.nome}</h2>
                    </div>
                    {f.bio && (
                      <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line flex-1">{f.bio}</p>
                    )}
                    {prof && (
                      <Link
                        to={`/profissoes/${prof.id}`}
                        className="group mt-5 pt-4 border-t border-border flex items-center justify-between gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                      >
                        <span className="truncate">
                          {prof.icone} {prof.nome}
                        </span>
                        <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
