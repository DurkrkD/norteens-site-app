import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileBarChart2, Compass, Gift } from "lucide-react";
import { CabecalhoSecao } from "@/components/home/Secao";
import { useOfertas } from "@/components/ofertas/useOfertas";
import BotaoInteresse from "@/components/ofertas/BotaoInteresse";

// Vitrine discreta na página inicial: dois cartões que levam para /planos. Some se o admin esconder tudo.
export default function OfertasHome({ user }) {
  const { disc, mentorias } = useOfertas();
  if (!disc && mentorias.length === 0) return null;
  const comPresente = mentorias.filter((m) => (m.presentes || []).length > 0).length;

  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <CabecalhoSecao
            centro={false}
            sobretitulo="Em breve"
            titulo="Quando quiser ir"
            destaque="mais fundo."
            texto="O teste é o começo. Para quem quer se aprofundar, estamos preparando uma avaliação completa e uma mentoria individual."
          />
          <Link to="/planos" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent transition-colors shrink-0">
            Conhecer os planos <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {disc && (
            <article className="grao relative overflow-hidden flex flex-col p-8 rounded-[28px] bg-[#0f2e26] text-[#f8f0e6]">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-highlight/15 blur-3xl" aria-hidden />
              <span className="relative w-12 h-12 rounded-2xl bg-white/10 text-highlight flex items-center justify-center">
                <FileBarChart2 className="w-6 h-6" />
              </span>
              <h3 className="relative mt-6 text-2xl font-bold tracking-[-0.02em]">{disc.nome}</h3>
              <p className="relative mt-1 font-serif italic text-xl text-highlight">{disc.subtitulo}</p>
              <p className="relative mt-3 text-[#f8f0e6]/70 leading-relaxed flex-1">{disc.descricao}</p>
              <div className="relative mt-7 flex flex-wrap items-center gap-3">
                <BotaoInteresse oferta={disc} user={user} className="h-11 px-5 rounded-full bg-[#f8f0e6] text-[#0f2e26] text-sm font-semibold hover:bg-white transition-colors" />
                <Link to="/planos" className="h-11 px-4 inline-flex items-center text-sm font-semibold text-[#f8f0e6]/80 hover:text-white">Saiba mais</Link>
              </div>
            </article>
          )}
          {mentorias.length > 0 && (
            <Link to="/planos#mentoria" className="group relative overflow-hidden flex flex-col p-8 rounded-[28px] bg-card border border-border shadow-soft hover:shadow-soft-lg transition-shadow">
              <span className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </span>
              <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em]">Mentoria individual</h3>
              <p className="mt-1 font-serif italic text-xl text-accent">no seu ritmo</p>
              <p className="mt-3 text-muted-foreground leading-relaxed flex-1">
                {mentorias.length === 1 ? "Um plano" : `${mentorias.length} planos`} de acompanhamento com um mentor da
                Norteens, para organizar o que você descobriu e planejar os próximos passos.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-2">
                {mentorias.map((m) => (
                  <span key={m.id} className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-foreground">{m.nome}</span>
                ))}
                {comPresente > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-sm font-medium text-accent">
                    <Gift className="w-3.5 h-3.5" /> com presente
                  </span>
                )}
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                Comparar planos <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
