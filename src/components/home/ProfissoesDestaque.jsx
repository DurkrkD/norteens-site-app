import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CabecalhoSecao } from "@/components/home/Secao";
import CardProfissao from "@/components/profissoes/CardProfissao";

export default function ProfissoesDestaque({ profissoes }) {
  if (!profissoes.length) return null;

  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <CabecalhoSecao
            centro={false}
            sobretitulo="Guia vocacional"
            titulo="Profissões para"
            destaque="começar a explorar."
          />
          <Link
            to="/profissoes"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground shrink-0 hover:text-accent transition-colors"
          >
            Ver todas as {profissoes.length} profissões
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* no celular só 3, para a página não ficar comprida demais */}
          {profissoes.slice(0, 6).map((p, i) => (
            <div key={p.id} className={i >= 3 ? "hidden sm:block" : ""}>
              <CardProfissao profissao={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
