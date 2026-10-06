import React from "react";
import { ClipboardCheck, Compass, Route } from "lucide-react";
import { CabecalhoSecao } from "@/components/home/Secao";
import Revelar from "@/components/Revelar";

const PASSOS = [
  {
    icon: ClipboardCheck,
    titulo: "Faça o teste",
    texto: "12 situações do dia a dia. Em cada uma, você marca o quanto se parece com cada lado. Leva uns 3 minutos.",
  },
  {
    icon: Compass,
    titulo: "Entenda seu perfil",
    texto: "Veja seus pontos fortes, o que desenvolver, seu estilo de trabalho e as carreiras que mais combinam.",
  },
  {
    icon: Route,
    titulo: "Explore e decida",
    texto: "Compare profissões com dados reais, conheça quem chegou lá e troque ideias com outros jovens.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Revelar>
          <CabecalhoSecao sobretitulo="Como funciona" titulo="Do autoconhecimento à escolha, em" destaque="três passos." />
        </Revelar>

        <ol className="mt-16 grid md:grid-cols-3 gap-5">
          {PASSOS.map((p, i) => (
            <Revelar as="li" key={p.titulo} atraso={i * 0.1} className="group relative overflow-hidden rounded-[28px] bg-card border border-border p-8 shadow-soft hover:shadow-soft-lg transition-shadow">
              {/* numeral grande e discreto, no estilo editorial */}
              <span aria-hidden className="absolute right-6 -bottom-10 font-serif italic text-[10rem] leading-none text-foreground/[0.06] select-none transition-colors duration-500 group-hover:text-accent/15">
                {i + 1}
              </span>
              <span className="relative inline-flex w-12 h-12 rounded-2xl bg-[#0f2e26] dark:bg-white/10 text-[#f8f0e6] items-center justify-center">
                <p.icon className="w-5 h-5" strokeWidth={1.9} />
              </span>
              <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Passo {i + 1}</p>
              <h3 className="relative mt-2 text-xl font-bold text-foreground tracking-[-0.01em]">{p.titulo}</h3>
              <p className="relative mt-3 text-muted-foreground leading-relaxed">{p.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}
