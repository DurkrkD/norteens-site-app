import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageLoading } from "@/components/layout/Page";
import TituloRevelado from "@/components/TituloRevelado";
import Revelar, { Cascata, ItemCascata } from "@/components/Revelar";
import CartaoConteudo from "@/components/conteudos/CartaoConteudo";
import { TIPOS, ORDEM_TIPOS } from "@/lib/conteudos";

const chip = (ativo) =>
  `shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition-colors ${
    ativo ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
  }`;

// Estante vazia: em vez de só "nada aqui", mostra os quatro tipos de material que estão chegando.
function EstanteVazia() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-14 sm:px-12 sm:py-16 text-center">
      <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
      <Cascata className="relative flex justify-center items-end gap-3 sm:gap-4" intervalo={0.1}>
        {ORDEM_TIPOS.map((t, i) => {
          const tipo = TIPOS[t];
          const Icone = tipo.icone;
          return (
            <ItemCascata key={t}>
              <div
                className="grao relative w-16 sm:w-24 rounded-xl shadow-soft-lg flex items-center justify-center"
                style={{ backgroundColor: tipo.fundo, color: tipo.tinta, height: `${[7, 8.5, 6.5, 7.75][i]}rem`, rotate: `${[-4, 2, -1.5, 3.5][i]}deg` }}
              >
                <span className="absolute inset-y-0 left-0 w-1.5 bg-black/15 rounded-l-xl" />
                <Icone className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.6} />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-muted-foreground">{tipo.plural}</p>
            </ItemCascata>
          );
        })}
      </Cascata>
      <Revelar atraso={0.3} className="relative">
        <h2 className="mt-10 font-heading text-2xl sm:text-3xl font-bold text-foreground text-balance">
          A estante está sendo <span className="font-serif font-normal italic text-accent">montada.</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto text-pretty">
          E-books, audiobooks, videobooks e listas de exercícios de provas por área. Uma parte vai ser gratuita para
          todo mundo; o resto, exclusivo para membros.
        </p>
        <Link
          to="/profissoes"
          className="group mt-7 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Enquanto isso, explore as profissões <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Revelar>
    </div>
  );
}

export default function Conteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = TIPOS[searchParams.get("tipo")] ? searchParams.get("tipo") : "";
  const area = searchParams.get("area") || "";

  // busca tudo de uma vez: são poucos itens, e assim os filtros mostram quantos há em cada um
  useEffect(() => {
    norteens
      .listarConteudos()
      .then(setConteudos)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  const filtrar = (mudancas) => {
    const novo = { tipo, area, ...mudancas };
    setSearchParams(Object.fromEntries(Object.entries(novo).filter(([, v]) => v)), { replace: true });
  };

  const doTipo = tipo ? conteudos.filter((c) => c.tipo === tipo) : conteudos;
  const areas = [...new Set(doTipo.map((c) => c.area).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const visiveis = area ? doTipo.filter((c) => (c.area || "").toLowerCase() === area.toLowerCase()) : doTipo;
  const gratuitos = conteudos.filter((c) => c.gratuito).length;

  return (
    <div>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Biblioteca</p>
          <TituloRevelado className="mt-3 text-[2.4rem] sm:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance max-w-3xl">
            Materiais para ir{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">mais longe.</span>
          </TituloRevelado>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
            E-books, audiobooks, videobooks e exercícios de provas por área. Comece pelos gratuitos; os exclusivos chegam
            em breve para membros.
          </p>
          {conteudos.length > 0 && (
            <Revelar atraso={0.3} className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-secondary/10 text-secondary font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> {gratuitos} {gratuitos === 1 ? "gratuito" : "gratuitos"}
              </span>
              <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-muted text-foreground font-semibold">
                <Lock className="w-3.5 h-3.5" /> {conteudos.length - gratuitos} {conteudos.length - gratuitos === 1 ? "exclusivo" : "exclusivos"}
              </span>
            </Revelar>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {carregando ? (
          <PageLoading />
        ) : erro ? (
          <p className="text-center text-muted-foreground py-16">Não foi possível carregar os conteúdos agora. Tente de novo em instantes.</p>
        ) : conteudos.length === 0 ? (
          <EstanteVazia />
        ) : (
          <>
            {/* filtros: uma linha só, rolando para o lado no celular */}
            <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin]">
              <button onClick={() => filtrar({ tipo: "", area: "" })} className={chip(!tipo)}>
                Todos <span className="opacity-60 ml-1">{conteudos.length}</span>
              </button>
              {ORDEM_TIPOS.map((t) => {
                const n = conteudos.filter((c) => c.tipo === t).length;
                return (
                  <button key={t} onClick={() => filtrar({ tipo: t, area: "" })} className={chip(tipo === t)} disabled={n === 0 && tipo !== t}>
                    {TIPOS[t].plural} <span className="opacity-60 ml-1">{n}</span>
                  </button>
                );
              })}
            </div>
            {areas.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin] items-center">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mr-1">Área</span>
                <button onClick={() => filtrar({ area: "" })} className={chip(!area)}>Todas</button>
                {areas.map((a) => (
                  <button key={a} onClick={() => filtrar({ area: a })} className={chip(area.toLowerCase() === a.toLowerCase())}>
                    {a}
                  </button>
                ))}
              </div>
            )}

            {visiveis.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-heading text-xl font-bold text-foreground">Nada por aqui ainda.</p>
                <p className="mt-2 text-muted-foreground">Ainda não há conteúdo com esses filtros.</p>
                <button onClick={() => filtrar({ tipo: "", area: "" })} className="mt-5 text-sm font-semibold text-secondary">
                  <span className="sublinhado">Ver todos os conteúdos</span>
                </button>
              </div>
            ) : (
              // a key remonta a grade a cada filtro: a cascata toca de novo com os itens novos
              <Cascata key={`${tipo}|${area}`} className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
                {visiveis.map((c) => (
                  <ItemCascata key={c.id}>
                    <CartaoConteudo conteudo={c} />
                  </ItemCascata>
                ))}
              </Cascata>
            )}
          </>
        )}
      </div>
    </div>
  );
}
