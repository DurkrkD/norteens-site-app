import React from "react";
import { motion } from "framer-motion";
import { EASE_SAIDA, useEfeitosFinos } from "@/lib/movimento";

const IMAGEM = {
  oculto: { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
  visivel: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
};

// Foto que se revela por uma máscara subindo de baixo (com um leve zoom saindo) ao entrar na tela.
// Quem é observado é a moldura, não a foto: o navegador considera uma imagem 100% recortada como fora
// da tela, e ela nunca seria revelada. "moldura" posiciona essa moldura (padrão: cobre o pai).
// Recorte + escala em muitas fotos pesa no celular: lá (e com "reduzir movimento") é uma <img> comum.
export default function ImagemRevelada({ atraso = 0, moldura = "absolute inset-0", ...props }) {
  const ativo = useEfeitosFinos();
  if (!ativo) return <img {...props} />;
  return (
    <motion.div
      className={moldura}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      <motion.img {...props} variants={IMAGEM} transition={{ duration: 1, ease: EASE_SAIDA, delay: atraso }} />
    </motion.div>
  );
}
