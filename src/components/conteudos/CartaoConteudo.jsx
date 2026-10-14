import React from "react";
import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { TIPOS } from "@/lib/conteudos";
import ImagemRevelada from "@/components/ImagemRevelada";

// Capa: a imagem cadastrada ou, sem ela, uma capa de livro gerada com a cor e o ícone do tipo.
export function Capa({ conteudo: c, className = "" }) {
  const tipo = TIPOS[c.tipo] || TIPOS.ebook;
  const Icone = tipo.icone;
  if (c.capa_url) {
    return (
      <div className={`relative overflow-hidden bg-muted ${className}`}>
        <ImagemRevelada src={c.capa_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`grao relative overflow-hidden flex flex-col justify-between p-5 ${className}`}
      style={{ backgroundColor: tipo.fundo, color: tipo.tinta }}
      aria-hidden="true"
    >
      {/* lombada do livro */}
      <span className="absolute inset-y-0 left-0 w-2.5 bg-black/15" />
      <Icone className="w-7 h-7 opacity-80" strokeWidth={1.6} />
      <p className="font-serif italic text-[1.6rem] leading-[1.05] line-clamp-4 text-balance">{c.titulo}</p>
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">Norteens</span>
    </div>
  );
}

export function SeloAcesso({ gratuito, className = "" }) {
  return gratuito ? (
    <span className={`inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-secondary text-white text-[11px] font-semibold ${className}`}>
      <Sparkles className="w-3 h-3" /> Gratuito
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#0f2e26] text-[#f8f0e6] text-[11px] font-semibold ${className}`}>
      <Lock className="w-3 h-3" /> Exclusivo
    </span>
  );
}

// Cartão da vitrine: capa em formato de livro, tipo, título e selo de acesso.
export default function CartaoConteudo({ conteudo: c }) {
  const tipo = TIPOS[c.tipo] || TIPOS.ebook;
  const Icone = tipo.icone;
  return (
    <Link to={`/conteudos/${c.id}`} className="group block">
      <div className="relative">
        <Capa
          conteudo={c}
          className="aspect-[3/4] rounded-2xl shadow-soft transition-all duration-500 group-hover:shadow-soft-lg group-hover:-translate-y-1"
        />
        <SeloAcesso gratuito={c.gratuito} className="absolute top-3 right-3 shadow-sm" />
      </div>
      <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        <Icone className="w-3.5 h-3.5" /> {tipo.rotulo}
        {c.area && <span className="text-muted-foreground normal-case tracking-normal font-medium">· {c.area}</span>}
      </p>
      <h3 className="mt-1.5 font-heading text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
        {c.titulo}
      </h3>
    </Link>
  );
}
