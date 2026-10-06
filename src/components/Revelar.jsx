import React from "react";
import { motion } from "framer-motion";

// Aparece suavemente (sobe e ganha opacidade) quando entra na tela, uma vez só.
// "atraso" escalona itens de uma grade. Com "reduzir movimento" no sistema, o MotionConfig do App desliga.
export default function Revelar({ children, atraso = 0, className = "", as = "div" }) {
  const Componente = motion[as] || motion.div;
  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: atraso }}
    >
      {children}
    </Componente>
  );
}
