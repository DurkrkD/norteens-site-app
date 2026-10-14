import React, { Children, cloneElement, isValidElement, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_SAIDA, ehCelular } from "@/lib/movimento";
import { useAtrasoEntrada } from "@/components/TransicaoPaginas";

const TEMPOS = {
  computador: { duracao: 0.7, entrePalavras: 0.045 },
  celular: { duracao: 0.45, entrePalavras: 0.03 },
};

const palavra = {
  oculto: { y: "125%" },
  visivel: { y: "0%" },
};

// Quebra o texto em palavras, inclusive dentro de elementos (ex.: o <span> em serifa itálica),
// mantendo os espaços como texto comum para as linhas quebrarem exatamente como antes.
function separar(filhos, transicao) {
  return Children.toArray(filhos).flatMap((no, n) => {
    if (typeof no === "string" || typeof no === "number") {
      return String(no)
        .split(/(\s+)/)
        .filter(Boolean)
        .map((parte, i) =>
          /^\s+$/.test(parte) ? (
            parte
          ) : (
            // a máscara é um clip-path (overflow: hidden tiraria a palavra da linha de base e o itálico
            // de outra fonte ficaria desalinhado) e sobra um pouco em volta para acentos, descendentes e
            // a inclinação do itálico
            <span key={`${n}-${i}`} className="inline-block [clip-path:inset(-0.12em_-0.1em_-0.2em_-0.1em)]">
              <motion.span className="inline-block" variants={palavra} transition={transicao}>
                {parte}
              </motion.span>
            </span>
          )
        );
    }
    if (isValidElement(no) && no.props.children != null) {
      return [cloneElement(no, undefined, separar(no.props.children, transicao))];
    }
    return [no];
  });
}

// Título que se revela palavra por palavra, cada uma subindo de dentro da própria linha.
// Para quem pediu menos movimento no sistema, é um título comum (sem divisão nem animação).
export default function TituloRevelado({ as = "h1", children, className = "", atraso = 0 }) {
  const reduzir = useReducedMotion();
  const atrasoEntrada = useAtrasoEntrada();
  const [t] = useState(() => (ehCelular() ? TEMPOS.celular : TEMPOS.computador));
  const Tag = as;

  if (reduzir) return <Tag className={className}>{children}</Tag>;

  const Componente = motion[as] || motion.h1;
  return (
    <Componente
      className={className}
      initial="oculto"
      animate="visivel"
      variants={{
        visivel: { transition: { staggerChildren: t.entrePalavras, delayChildren: atrasoEntrada + atraso } },
      }}
    >
      {separar(children, { duration: t.duracao, ease: EASE_SAIDA })}
    </Componente>
  );
}
