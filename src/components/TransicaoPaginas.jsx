import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { gsap } from "@/lib/gsap";
import { ehCelular, prefereMenosMovimento } from "@/lib/movimento";
import ScrollToTop from "@/components/ScrollToTop";

// tempos em segundos; no celular tudo é mais curto e o "N" só aparece, sem deslizar
const TEMPOS = {
  computador: { cobrir: 0.5, pausa: 0.08, revelar: 0.6 },
  celular: { cobrir: 0.3, pausa: 0.04, revelar: 0.34 },
};

// Quanto a página nova deve esperar para animar a própria entrada (ex.: o título), para que ela
// aconteça enquanto a cortina sai em vez de por baixo dela. É 0 no primeiro carregamento.
const AtrasoEntrada = createContext(0);
export const useAtrasoEntrada = () => useContext(AtrasoEntrada);

// Cortina verde-escura entre páginas: sobe cobrindo a tela com o "N" no centro, a página troca por
// baixo (e volta ao topo) e a cortina continua subindo, revelando a nova.
// A rota exibida fica "segura" até a tela estar coberta, por isso as rotas recebem a location daqui.
// Sem cortina: primeiro carregamento, voltar/avançar do navegador, mudança só de ?busca ou #âncora,
// e para quem pediu menos movimento no sistema.
export default function TransicaoPaginas({ children }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [exibida, setExibida] = useState({ location, navigationType, atraso: 0 });

  const cortina = useRef(null);
  const letra = useRef(null);
  const traco = useRef(null);
  const exibidaRef = useRef(exibida);
  const ultima = useRef({ location, navigationType });
  const animacao = useRef(null);
  ultima.current = { location, navigationType };

  const mostrar = (proxima) => {
    exibidaRef.current = proxima;
    setExibida(proxima);
  };

  useEffect(() => {
    const atual = exibidaRef.current.location;
    if (location.key === atual.key) return;
    // a cortina já está no caminho: quando cobrir, troca para o endereço mais recente
    if (animacao.current) return;

    if (navigationType === "POP" || location.pathname === atual.pathname || prefereMenosMovimento()) {
      mostrar({ location, navigationType, atraso: 0 });
      return;
    }

    const celular = ehCelular();
    const t = celular ? TEMPOS.celular : TEMPOS.computador;
    const el = cortina.current;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(el, { autoAlpha: 0, yPercent: 100, pointerEvents: "none" });
        animacao.current = null;
        // se o endereço mudou de novo durante a saída, mostra direto (sem outra cortina em seguida)
        const pendente = ultima.current;
        if (pendente.location.key !== exibidaRef.current.location.key) {
          mostrar({ ...pendente, atraso: 0 });
        }
      },
    });
    animacao.current = tl;

    tl.set(el, { autoAlpha: 1, yPercent: 100, pointerEvents: "auto" })
      .to(el, { yPercent: 0, duration: t.cobrir });

    if (celular) {
      tl.set([letra.current, traco.current], { autoAlpha: 1, y: 0, scaleX: 1 }, 0);
    } else {
      tl.fromTo(letra.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, t.cobrir * 0.45)
        .fromTo(traco.current, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power3.out" }, "<0.1");
    }

    tl.add(() => mostrar({ ...ultima.current, atraso: t.revelar * 0.4 }), t.cobrir)
      .to(el, { yPercent: -100, duration: t.revelar }, t.cobrir + t.pausa);

    if (!celular) {
      // o "N" sobe um pouco mais devagar que a cortina: dá profundidade na saída
      tl.to(letra.current, { y: 60, autoAlpha: 0, duration: t.revelar * 0.8, ease: "power2.in" }, "<");
    }
  }, [location, navigationType]);

  useEffect(() => () => animacao.current?.kill(), []);

  return (
    <AtrasoEntrada.Provider value={exibida.atraso}>
      <ScrollToTop location={exibida.location} navigationType={exibida.navigationType} />
      {children(exibida.location)}
      <div
        ref={cortina}
        aria-hidden="true"
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-[#0f2e26] invisible pointer-events-none will-change-transform"
      >
        <span
          ref={letra}
          className="font-heading font-semibold leading-none tracking-tight text-[#f8f0e6] text-[clamp(5rem,16vw,10rem)]"
        >
          N
        </span>
        {/* agulha coral da bússola do logo */}
        <span ref={traco} className="block h-1 w-14 rounded-full bg-[#e57a57] origin-center" />
      </div>
    </AtrasoEntrada.Provider>
  );
}
