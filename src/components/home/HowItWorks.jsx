import React from "react";
import { Heart, Search, Target } from "lucide-react";

const steps = [
  {
    n: "Passo 1",
    icon: Heart,
    title: "Se conheça",
    desc: "Responda o teste comportamental e entenda seu perfil, suas forças e o que te move de verdade.",
    bg: "bg-secondary/15",
    fg: "text-secondary",
  },
  {
    n: "Passo 2",
    icon: Search,
    title: "Explore possibilidades",
    desc: "Descubra profissões que combinam com você, com dados reais de rotina, mercado e salário.",
    bg: "bg-primary/15",
    fg: "text-primary",
  },
  {
    n: "Passo 3",
    icon: Target,
    title: "Tome decisões",
    desc: "Monte seu plano, aproveite oportunidades e conte com mentoria para seguir com clareza.",
    bg: "bg-highlight/20",
    fg: "text-highlight",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-11">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            Como funciona
          </span>
          <h2 className="mt-2.5 font-heading text-3xl sm:text-[2.1rem] font-medium text-foreground">
            Sua jornada em <span className="italic text-primary">3 passos</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div
              key={step.title}
              className="bg-card border border-border rounded-[22px] p-7 shadow-soft relative"
            >
              <span className="font-heading text-[15px] text-primary font-semibold">
                {step.n}
              </span>
              <div
                className={`w-12 h-12 rounded-[13px] ${step.bg} ${step.fg} flex items-center justify-center my-3.5 mb-4`}
              >
                <step.icon className="w-6 h-6" strokeWidth={1.7} />
              </div>
              <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}