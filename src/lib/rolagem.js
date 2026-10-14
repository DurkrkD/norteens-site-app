// Rolagem suave (Lenis) movida pelo relógio do GSAP: um único loop de animação para os dois,
// e o ScrollTrigger sempre sabe a posição real da rolagem.
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MQ_REDUZIR, prefereMenosMovimento } from "@/lib/movimento";

let lenis = null;

function iniciar() {
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.12,
    // painéis e menus com rolagem própria continuam rolando por dentro
    allowNestedScroll: true,
  });
  lenis.on("scroll", ScrollTrigger.update);

  const tique = (tempo) => lenis.raf(tempo * 1000);
  gsap.ticker.add(tique);
  gsap.ticker.lagSmoothing(0);

  // modais e gavetas (Radix/Vaul) travam a rolagem do fundo marcando o body
  const trava = new MutationObserver(() => {
    if (document.body.hasAttribute("data-scroll-locked")) lenis.stop();
    else lenis.start();
  });
  trava.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });

  return () => {
    trava.disconnect();
    gsap.ticker.remove(tique);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
    lenis = null;
  };
}

// Liga a rolagem suave no site inteiro; desliga (e volta à nativa) se o sistema pedir menos movimento.
// Também avisa o ScrollTrigger quando a página muda de altura (dados chegando, troca de página,
// acordeão abrindo): sem isso o parallax de baixo usaria posições antigas.
export function useRolagemSuave() {
  useEffect(() => {
    let espera;
    const altura = new ResizeObserver(() => {
      clearTimeout(espera);
      espera = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    altura.observe(document.body);
    return () => {
      clearTimeout(espera);
      altura.disconnect();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MQ_REDUZIR);
    let parar = null;
    const aplicar = () => {
      parar?.();
      parar = mq.matches ? null : iniciar();
    };
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => {
      mq.removeEventListener("change", aplicar);
      parar?.();
    };
  }, []);
}

// Rola até um número (px) ou elemento, passando pelo Lenis quando ele está ativo
// (window.scrollTo direto deixaria o Lenis com a posição antiga e a página "pularia" no próximo giro).
export function rolarPara(alvo, { imediato = false } = {}) {
  if (alvo == null) return;
  if (lenis) {
    lenis.scrollTo(alvo, { immediate: imediato, force: true });
    return;
  }
  const behavior = imediato || prefereMenosMovimento() ? "instant" : "smooth";
  if (typeof alvo === "number") window.scrollTo({ top: alvo, left: 0, behavior });
  else alvo?.scrollIntoView({ behavior });
}
