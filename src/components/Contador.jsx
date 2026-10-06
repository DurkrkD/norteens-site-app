import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Número que conta de 0 até o valor quando aparece na tela (uma vez). Texto que não é número aparece direto.
export default function Contador({ valor, duracao = 1200 }) {
  const ref = useRef(null);
  const visivel = useInView(ref, { once: true, margin: "-40px" });
  const reduzir = useReducedMotion();
  const numero = typeof valor === "number" ? valor : null;
  const [atual, setAtual] = useState(numero === null || reduzir ? valor : 0);

  useEffect(() => {
    if (numero === null || reduzir || !visivel) {
      setAtual(valor);
      return;
    }
    let quadro;
    const inicio = performance.now();
    const passo = (agora) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - t, 3); // desacelera no fim
      setAtual(Math.round(numero * suave));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [numero, valor, visivel, reduzir, duracao]);

  return <span ref={ref}>{atual}</span>;
}
