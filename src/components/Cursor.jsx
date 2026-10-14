import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useEfeitosFinos } from "@/lib/movimento";

const CLICAVEL = 'a, button, [role="button"], summary, label, select';
const DIGITAVEL = 'input, textarea, [contenteditable="true"]';

// Anel que segue o cursor com um leve atraso e cresce sobre o que é clicável. O cursor normal do
// sistema continua lá (o anel só acompanha); some sobre campos de texto e quando o mouse sai da janela.
// Só com mouse e tela grande; no toque e com "reduzir movimento" não existe.
export default function Cursor() {
  const ativo = useEfeitosFinos();
  const ref = useRef(null);

  useEffect(() => {
    if (!ativo) return;
    const el = ref.current;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xPara = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yPara = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let visivel = false;

    const mover = (e) => {
      if (e.pointerType !== "mouse") return;
      if (!visivel) {
        // aparece já no lugar, sem atravessar a tela vindo do canto
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
        visivel = true;
      }
      xPara(e.clientX);
      yPara(e.clientY);
      const alvo = e.target instanceof Element ? e.target : null;
      el.dataset.estado = alvo?.closest(DIGITAVEL) ? "texto" : alvo?.closest(CLICAVEL) ? "clicavel" : "";
    };
    const sair = () => {
      if (!visivel) return;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      visivel = false;
    };

    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", sair);
    window.addEventListener("blur", sair);
    return () => {
      window.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", sair);
      window.removeEventListener("blur", sair);
      gsap.killTweensOf(el);
    };
  }, [ativo]);

  if (!ativo) return null;
  return <div ref={ref} aria-hidden="true" className="cursor-anel" />;
}
