import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, GraduationCap } from "lucide-react";

// Cartão de profissão usado no catálogo e na página inicial.
export default function CardProfissao({ profissao: p }) {
  return (
    <Link
      to={`/profissoes/${p.id}`}
      className="group relative flex flex-col h-full rounded-2xl bg-card border border-border p-6 transition-all hover:border-foreground/15 hover:shadow-soft-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <span className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">{p.icone || "💼"}</span>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground leading-snug">{p.nome}</h3>
      {/* o flex-1 fica no div: se ficasse no <p>, ele esticaria e o corte em 2 linhas não funcionaria */}
      <div className="flex-1">
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {p.descricao || "Ficha em construção."}
        </p>
      </div>
      <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-2">
        {p.salario && (
          <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">{p.salario}</span>
        )}
        {p.formacao && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5" /> Formação detalhada
          </span>
        )}
      </div>
    </Link>
  );
}
