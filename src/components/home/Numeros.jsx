import React from "react";
import Contador from "@/components/Contador";

// Faixa de números — todos reais (contados no banco ou fixos do teste), nada inventado.
export default function Numeros({ profissoes, famosos }) {
  const itens = [
    profissoes > 0 && { valor: profissoes, label: profissoes === 1 ? "profissão detalhada" : "profissões detalhadas" },
    famosos > 0 && { valor: famosos, label: famosos === 1 ? "referência inspiradora" : "referências inspiradoras" },
    { valor: 4, label: "perfis comportamentais" },
    { valor: "3 min", label: "para descobrir seu perfil" },
  ].filter(Boolean);

  return (
    <section className="border-y border-border bg-card/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <dl className={`grid grid-cols-2 ${itens.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} divide-x divide-border`}>
          {itens.map((i, idx) => (
            <div key={i.label} className={`py-8 px-4 text-center ${idx >= 2 ? "border-t lg:border-t-0 border-border" : ""}`}>
              <dt className="sr-only">{i.label}</dt>
              <dd className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums"><Contador valor={i.valor} /></dd>
              <dd className="mt-1 text-sm text-muted-foreground">{i.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
