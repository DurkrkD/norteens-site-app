import React from "react";

// Cabeçalho padrão das seções da página inicial: sobretítulo, título (com destaque em serifa) e texto.
export function CabecalhoSecao({ sobretitulo, titulo, destaque, texto, centro = true }) {
  return (
    <div className={`max-w-2xl ${centro ? "mx-auto text-center" : ""}`}>
      {sobretitulo && (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{sobretitulo}</p>
      )}
      <h2 className="mt-3 text-3xl sm:text-[2.6rem] leading-[1.1] font-bold tracking-[-0.025em] text-foreground text-balance">
        {titulo}{" "}
        {destaque && <span className="font-serif font-normal italic tracking-normal text-accent">{destaque}</span>}
      </h2>
      {texto && <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">{texto}</p>}
    </div>
  );
}
