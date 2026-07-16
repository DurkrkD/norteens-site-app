import React from "react";

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            O que é a Norteens
          </span>
          <h2 className="mt-3 font-heading text-2xl sm:text-[2.25rem] font-medium text-foreground leading-[1.22]">
            Autoconhecimento e{" "}
            <span className="italic text-primary">carreira</span> no mesmo lugar —
            para você escolher com clareza, não por acaso.
          </h2>
          <p className="mt-4 text-base sm:text-[17px] text-muted-foreground leading-[1.7]">
            Antes de olhar para o mercado, a gente olha para você. Com base em
            inteligência emocional, a Norteens te ajuda a entender quem você é e o
            que te move — e conecta isso a profissões reais, com dados honestos,
            oportunidades e gente ao seu lado. Escolher o futuro deixa de ser um
            chute no escuro e vira uma decisão consciente.
          </p>
        </div>
      </div>
    </section>
  );
}