import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCw, ArrowRight, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";

// "Tipos" das cartas (como os tipos de uma carta colecionável): a cor vem da profissão,
// então famosos da mesma área ficam com a mesma moldura.
const TIPOS = [
  { moldura: "from-[#e8835f] via-[#f6c27a] to-[#d4633f]", fundo: "bg-[#fbeee6]", faixa: "bg-[#d4633f]", texto: "text-[#8f3a1d]" }, // terracota
  { moldura: "from-[#e9b949] via-[#fbe7a6] to-[#c99520]", fundo: "bg-[#fbf3dc]", faixa: "bg-[#c99520]", texto: "text-[#7a5a0c]" }, // ouro
  { moldura: "from-[#3f8f6b] via-[#a7d8bd] to-[#245a44]", fundo: "bg-[#e6f2ec]", faixa: "bg-[#2e7556]", texto: "text-[#1d4d39]" }, // floresta
  { moldura: "from-[#4b7fb0] via-[#b4d3ee] to-[#2d5a85]", fundo: "bg-[#e7eff7]", faixa: "bg-[#3b6b8f]", texto: "text-[#24496a]" }, // oceano
  { moldura: "from-[#8c5ab8] via-[#d8c1ee] to-[#653b8f]", fundo: "bg-[#f1eaf8]", faixa: "bg-[#7a4aa6]", texto: "text-[#4d2a70]" }, // ametista
];
export const tipoDa = (profissaoId) => TIPOS[(Number(profissaoId) || 0) % TIPOS.length];

const iniciais = (nome = "") => nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const movimentoReduzido = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function CartaFamoso({ famoso: f, profissao }) {
  const [virada, setVirada] = useState(false);
  const caixa = useRef(null);
  const tipo = tipoDa(f.profissao_id);
  const numero = String(f.id).padStart(3, "0");

  // inclinação 3D + brilho holográfico seguindo o mouse (só com mouse e sem "reduzir movimento")
  const mover = (e) => {
    if (e.pointerType !== "mouse" || movimentoReduzido()) return;
    const r = caixa.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const s = caixa.current.style;
    s.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    s.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
    s.setProperty("--brilho", "1");
  };
  const sair = () => {
    const s = caixa.current.style;
    s.setProperty("--rx", "0deg");
    s.setProperty("--ry", "0deg");
    s.setProperty("--brilho", "0");
  };
  const virar = () => setVirada((v) => !v);
  const tecla = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      virar();
    }
  };

  return (
    <div
      ref={caixa}
      onPointerMove={mover}
      onPointerLeave={sair}
      className="carta-cena group/carta w-full max-w-[300px] mx-auto"
    >
      <div className="carta-inclinacao">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={virada}
        aria-label={virada ? `Mostrar a frente da carta de ${f.nome}` : `Virar a carta e ler a história de ${f.nome}`}
        onClick={virar}
        onKeyDown={tecla}
        className={`carta-corpo relative aspect-[5/7] cursor-pointer rounded-[22px] outline-none focus-visible:ring-4 focus-visible:ring-ring/40 ${virada ? "carta-virada" : ""}`}
      >
        {/* ------------------------------------------------ FRENTE */}
        <div aria-hidden={virada} className={`carta-face absolute inset-0 rounded-[22px] p-[7px] bg-gradient-to-br ${tipo.moldura} shadow-soft-lg group-hover/carta:shadow-elevated transition-shadow`}>
          <div className={`relative h-full rounded-[16px] ${tipo.fundo} p-2.5 sm:p-3 flex flex-col overflow-hidden`}>
            <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.08em]">
              <span className={tipo.texto}>Nº {numero}</span>
              <span className="w-7 h-7 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-sm" title={profissao?.nome}>
                {profissao?.icone || "✦"}
              </span>
            </div>

            {/* janela da foto */}
            <div className="relative mt-2 flex-1 min-h-0 rounded-xl overflow-hidden ring-[3px] ring-white/80 shadow-inner bg-gradient-to-br from-white/60 to-black/5">
              {f.foto_url ? (
                <img src={f.foto_url} alt="" loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover object-[50%_22%]" />
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${tipo.moldura}`}>
                  <span className="absolute text-[9rem] opacity-20 select-none">{profissao?.icone || "✦"}</span>
                  <span className="relative font-heading text-6xl font-extrabold text-white drop-shadow-md">{iniciais(f.nome)}</span>
                </div>
              )}
              {/* holográfico: faixa de cor que acompanha o mouse */}
              <div className="carta-holo absolute inset-0 pointer-events-none" />
            </div>

            {/* faixa da área, como a "espécie" de uma carta colecionável */}
            <div className={`mt-2.5 -mx-3 px-3 py-1 ${tipo.faixa} text-white text-[10px] font-semibold uppercase tracking-[0.12em] truncate`}>
              {profissao?.nome || "Inspiração"}
            </div>

            <h2 className="mt-2 sm:mt-2.5 font-heading text-[1.02rem] sm:text-[1.35rem] leading-tight font-extrabold text-[#14231e] tracking-[-0.02em] line-clamp-2">{f.nome}</h2>
            <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-[#14231e]/55">
              <span className="inline-flex items-center gap-1">
                <RotateCw className="w-3 h-3 transition-transform duration-500 group-hover/carta:rotate-180" /> <span className="sm:hidden">Virar</span><span className="hidden sm:inline">Toque para ler a história</span>
              </span>
              <Sparkles className={`w-3.5 h-3.5 ${tipo.texto}`} />
            </div>
          </div>
          {/* reflexo de luz por cima de tudo */}
          <div className="carta-reflexo absolute inset-0 rounded-[22px] pointer-events-none" />
        </div>

        {/* ------------------------------------------------ VERSO */}
        <div aria-hidden={!virada} className={`carta-face carta-verso absolute inset-0 rounded-[22px] p-[7px] bg-gradient-to-br ${tipo.moldura} shadow-elevated`}>
          <div className="grao relative h-full rounded-[16px] bg-[#0f2e26] text-[#f8f0e6] p-3.5 sm:p-5 flex flex-col overflow-hidden">
            <LogoMark inverted className="absolute -right-10 -bottom-10 w-48 h-48 opacity-[0.07]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-highlight"><span className="hidden sm:inline">Trajetória · </span>Nº {numero}</p>
            <h3 className="mt-1.5 font-heading text-base sm:text-xl font-extrabold leading-tight">{f.nome}</h3>
            <div className="mt-2 sm:mt-3 h-px bg-white/15" />
            <p className="mt-2 sm:mt-3 text-[12px] sm:text-[14px] leading-relaxed text-[#f8f0e6]/85 overflow-y-auto pr-1 [scrollbar-width:thin] flex-1 min-h-0 whitespace-pre-line">
              {f.bio || "A história desta pessoa ainda vai ser contada aqui."}
            </p>
            {profissao && (
              <Link
                to={`/profissoes/${profissao.id}`}
                tabIndex={virada ? 0 : -1}
                onClick={(e) => e.stopPropagation()}
                className="relative mt-2.5 sm:mt-4 inline-flex items-center justify-between gap-2 h-8 sm:h-10 px-3 sm:px-4 rounded-full bg-[#f8f0e6] text-[#0f2e26] text-[12px] sm:text-[13px] font-semibold hover:bg-white transition-colors"
              >
                <span className="truncate">{profissao.icone} <span className="hidden sm:inline">Ver a </span>profissão</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            )}
            {f.foto_credito && <p className="relative mt-2 sm:mt-3 text-[8.5px] sm:text-[9.5px] leading-snug text-[#f8f0e6]/40 line-clamp-2">{f.foto_credito}</p>}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
