import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MQ_EFEITOS_FINOS } from "@/lib/movimento";

// Move o elemento com a rolagem numa velocidade diferente da página, para dar profundidade.
// velocidade > 0 sobe mais rápido que a página (parece mais perto); < 0 fica para trás (mais longe).
// Parte da posição original: o "clamp" faz quem já está na tela ao abrir a página não sair do lugar.
// Só no computador com mouse; no celular e com "reduzir movimento" o elemento fica parado.
export default function Parallax({ as: Tag = "div", velocidade = 0.15, className = "", children, ...resto }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add(MQ_EFEITOS_FINOS, () => {
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => -velocidade * window.innerHeight,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "clamp(top bottom)",
            end: "clamp(bottom top)",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
    return () => mm.revert();
  }, [velocidade]);

  return (
    <Tag ref={ref} className={className} {...resto}>
      {children}
    </Tag>
  );
}
