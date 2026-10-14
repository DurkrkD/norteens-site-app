import { useEffect, useState } from "react";

// Regras de movimento do site inteiro: quem pediu "reduzir movimento" no sistema não vê animação;
// no celular (tela estreita ou toque) as animações são mais curtas e sem efeitos pesados.
export const MQ_REDUZIR = "(prefers-reduced-motion: reduce)";
const MQ_CELULAR = "(max-width: 767px), (pointer: coarse)";
// efeitos que só fazem sentido com mouse e tela grande: parallax, botões magnéticos, cursor
export const MQ_EFEITOS_FINOS = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const consulta = (mq) => typeof window !== "undefined" && window.matchMedia(mq).matches;

export const prefereMenosMovimento = () => consulta(MQ_REDUZIR);
export const ehCelular = () => consulta(MQ_CELULAR);

// acompanha uma media query (ex.: trocar de mouse para toque, girar o tablet)
export function useMidia(mq) {
  const [bate, setBate] = useState(() => consulta(mq));
  useEffect(() => {
    const m = window.matchMedia(mq);
    const mudar = () => setBate(m.matches);
    mudar();
    m.addEventListener("change", mudar);
    return () => m.removeEventListener("change", mudar);
  }, [mq]);
  return bate;
}

export const useCelular = () => useMidia(MQ_CELULAR);
export const useEfeitosFinos = () => useMidia(MQ_EFEITOS_FINOS);

// curva "expo out" usada nas entradas (a mesma do Revelar)
export const EASE_SAIDA = [0.22, 1, 0.36, 1];
