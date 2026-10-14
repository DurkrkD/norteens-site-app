import React from "react";
import TituloRevelado from "@/components/TituloRevelado";
import Revelar from "@/components/Revelar";

// Cabeçalho padrão das seções da página inicial: sobretítulo, título (com destaque em serifa) e texto.
// O título se revela palavra por palavra ao entrar na tela; sobretítulo e texto sobem junto.
export function CabecalhoSecao({ sobretitulo, titulo, destaque, texto, centro = true }) {
  return (
    <div className={`max-w-2xl ${centro ? "mx-auto text-center" : ""}`}>
      {sobretitulo && (
        <Revelar as="p" className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{sobretitulo}</Revelar>
      )}
      <TituloRevelado
        as="h2"
        aoRolar
        atraso={0.05}
        className="mt-3 text-3xl sm:text-[2.6rem] leading-[1.1] font-bold tracking-[-0.025em] text-foreground text-balance"
      >
        {titulo}{" "}
        {destaque && <span className="font-serif font-normal italic tracking-normal text-accent">{destaque}</span>}
      </TituloRevelado>
      {texto && (
        <Revelar as="p" atraso={0.2} className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">
          {texto}
        </Revelar>
      )}
    </div>
  );
}
