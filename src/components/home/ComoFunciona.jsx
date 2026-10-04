import React from "react";
import { ClipboardCheck, Compass, Route } from "lucide-react";
import { CabecalhoSecao } from "@/components/home/Secao";

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
        <CabecalhoSecao
          sobretitulo="Como funciona"
          titulo="Do autoconhecimento à escolha, em"
          destaque="três passos."
        />

        <ol className="mt-16 grid md:grid-cols-3 gap-6 md:gap-0 relative">
          {/* linha que liga os passos (desktop) */}
          <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-border via-accent/40 to-border" />
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="relative md:px-8 text-center">
              <div className="relative mx-auto w-12 h-12 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center">
                <p.icon className="w-5 h-5 text-foreground" strokeWidth={1.8} />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground">{p.titulo}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed max-w-xs mx-auto">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
