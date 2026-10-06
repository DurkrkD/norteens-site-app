import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Shuffle } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import { norteens } from "@/api/norteensClient";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import CartaFamoso from "@/components/famosos/CartaFamoso";

// Fisher–Yates: cada ordem tem a mesma chance
function embaralhada(lista) {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

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
  const embaralhar = () => setFamosos((l) => embaralhada(l));

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
            Uma coleção de pessoas reais que construíram carreira nas profissões que você está explorando. Vire as
            cartas para conhecer cada trajetória.
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

            <div className="flex items-center justify-between gap-4 mb-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{visiveis.length}</span> {visiveis.length === 1 ? "carta" : "cartas"} ·
                toque em uma para ler a história
              </p>
              <button
                onClick={embaralhar}
                className="group inline-flex items-center gap-2 h-10 px-4 rounded-full bg-card border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors shrink-0"
              >
                <Shuffle className="w-4 h-4 transition-transform duration-500 group-active:rotate-180" /> Embaralhar
              </button>
            </div>

            <LayoutGroup>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {visiveis.map((f, i) => (
                  // entram "sendo distribuídas", uma depois da outra; ao embaralhar, deslizam para o novo lugar
                  <motion.div
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: 40, rotate: i % 2 ? 4 : -4, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18, delay: Math.min(i, 12) * 0.06 }}
                  >
                    <CartaFamoso famoso={f} profissao={profissoes[f.profissao_id]} />
                  </motion.div>
                ))}
              </div>
            </LayoutGroup>
          </>
        )}
      </div>
    </div>
  );
}
