import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useEfeitosFinos } from "@/lib/movimento";

// Botão "magnético": puxa levemente na direção do cursor e volta ao sair. Envolve o botão (o
// transform fica no invólucro, sem brigar com as transições do próprio botão). inline-grid estica o
// botão quando o invólucro estica (ex.: botões de largura total no celular).
// Só com mouse e tela grande; no toque e com "reduzir movimento" é um invólucro parado.
export default function Magnetico({ children, className = "", forca = 0.3 }) {
  const ref = useRef(null);
  const ativo = useEfeitosFinos();

  useEffect(() => {
    if (!ativo) return;
    const el = ref.current;
    const xPara = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yPara = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    let caixa = null;

    // a caixa é medida ao entrar (ainda parada); medir a cada movimento incluiria o próprio deslocamento
    const entrar = () => {
      caixa = el.getBoundingClientRect();
    };
    const mover = (e) => {
      if (e.pointerType !== "mouse") return;
      if (!caixa) entrar();
      xPara((e.clientX - (caixa.left + caixa.width / 2)) * forca);
      yPara((e.clientY - (caixa.top + caixa.height / 2)) * forca);
    };
    const sair = () => {
      caixa = null;
      xPara(0);
      yPara(0);
    };

    el.addEventListener("pointerenter", entrar);
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", sair);
    return () => {
      el.removeEventListener("pointerenter", entrar);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", sair);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [ativo, forca]);

  return (
    <span ref={ref} className={`inline-grid ${className}`}>
      {children}
    </span>
  );
}
