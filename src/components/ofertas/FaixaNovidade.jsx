import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { useOfertas } from "@/components/ofertas/useOfertas";
import { minusculaInicial } from "@/components/ofertas/Cartoes";

const CHAVE = "norteens-faixa-planos-1"; // mudar o número faz a faixa reaparecer para todos (nova novidade)

// Faixa fina de anúncio no topo do conteúdo. Fechou, não volta (fica lembrado no navegador).
// Não aparece onde atrapalharia: no teste, no painel e na própria página de planos.
export default function FaixaNovidade() {
  const { pathname } = useLocation();
  const { disc, mentorias } = useOfertas();
  const [fechada, setFechada] = useState(() => {
    try { return localStorage.getItem(CHAVE) === "1"; } catch { return false; }
  });

  const escondida = ["/planos", "/painel", "/teste"].some((p) => pathname.startsWith(p));
  if (fechada || escondida || (!disc && mentorias.length === 0)) return null;

  const fechar = () => {
    setFechada(true);
    try { localStorage.setItem(CHAVE, "1"); } catch { /* só não lembra */ }
  };
  const texto = disc && mentorias.length
    ? "Em breve: avaliação DISC completa com devolutiva e mentoria individual."
    : disc ? `Em breve: ${minusculaInicial(disc.nome)} ${disc.subtitulo || ""}.` : "Em breve: mentoria individual com a equipe Norteens.";

  return (
    <div className="relative bg-[#0f2e26] text-[#f8f0e6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pr-12 py-2.5 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-[13px] text-center">
        <span className="px-2 py-0.5 rounded-full bg-highlight text-[#0f2e26] text-[10px] font-bold uppercase tracking-[0.1em]">Novo</span>
        <span className="text-[#f8f0e6]/85">{texto}</span>
        <Link to="/planos" className="group inline-flex items-center gap-1 font-semibold text-highlight hover:text-white transition-colors">
          Entrar na lista <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <button
        onClick={fechar}
        aria-label="Fechar aviso"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#f8f0e6]/60 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
