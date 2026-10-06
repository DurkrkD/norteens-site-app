import React from "react";
import { Link } from "react-router-dom";

// Faixa que rola devagar com as profissões cadastradas (só as reais do banco). Para ao passar o mouse.
export default function FaixaCarreiras({ profissoes }) {
  if (profissoes.length < 4) return null; // com poucas, a emenda da rolagem fica aparente
  const itens = [...profissoes, ...profissoes]; // duplicada: andar -50% emenda no começo sem pulo

  return (
    <section aria-label="Profissões no guia" className="relative pb-10 -mt-4 overflow-hidden group">
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <ul className="flex w-max gap-3 animate-faixa group-hover:[animation-play-state:paused]">
        {itens.map((p, i) => (
          <li key={`${p.id}-${i}`} aria-hidden={i >= profissoes.length || undefined}>
            <Link
              to={`/profissoes/${p.id}`}
              tabIndex={i >= profissoes.length ? -1 : undefined}
              className="flex items-center gap-2.5 h-11 pl-2 pr-4 rounded-full bg-card border border-border text-sm font-medium text-foreground whitespace-nowrap hover:border-foreground/20 hover:shadow-soft transition-all"
            >
              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-base">{p.icone || "💼"}</span>
              {p.nome}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
