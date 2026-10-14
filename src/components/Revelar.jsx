import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_SAIDA, useCelular } from "@/lib/movimento";

// As entradas usam o IntersectionObserver do framer-motion (whileInView), não posições calculadas:
// se a página crescer depois (dados chegando, imagens), nada fica preso invisível.
// Para quem pediu menos movimento no sistema, tudo aqui é um elemento comum, já visível.
const VIEWPORT = { once: true, margin: "0px 0px -8% 0px" };

// Aparece suavemente (sobe e ganha opacidade) quando entra na tela, uma vez só.
// "atraso" escalona itens de uma grade.
export default function Revelar({ children, atraso = 0, className = "", as = "div" }) {
  const reduzir = useReducedMotion();
  const celular = useCelular();
  if (reduzir) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Componente = motion[as] || motion.div;
  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y: celular ? 12 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: celular ? 0.4 : 0.6, ease: EASE_SAIDA, delay: atraso }}
    >
      {children}
    </Componente>
  );
}

// Grade/lista cujos itens (ItemCascata) entram um depois do outro quando ela aparece na tela.
export function Cascata({ children, className = "", as = "div", intervalo = 0.08 }) {
  const reduzir = useReducedMotion();
  const celular = useCelular();
  if (reduzir) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Componente = motion[as] || motion.div;
  return (
    <Componente
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={VIEWPORT}
      variants={{ visivel: { transition: { staggerChildren: celular ? intervalo * 0.6 : intervalo } } }}
    >
      {children}
    </Componente>
  );
}

const ITEM = {
  computador: {
    oculto: { opacity: 0, y: 40, scale: 0.98 },
    visivel: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: EASE_SAIDA } },
  },
  celular: {
    oculto: { opacity: 0, y: 16 },
    visivel: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_SAIDA } },
  },
};

// Item de uma Cascata. Envolva o cartão (não aplique no próprio cartão se ele já move com hover:
// o transform da animação brigaria com o hover:-translate do Tailwind).
export function ItemCascata({ children, className = "", as = "div" }) {
  const reduzir = useReducedMotion();
  const celular = useCelular();
  if (reduzir) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Componente = motion[as] || motion.div;
  return (
    <Componente className={className} variants={celular ? ITEM.celular : ITEM.computador}>
      {children}
    </Componente>
  );
}
