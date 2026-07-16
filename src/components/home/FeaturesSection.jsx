import React from "react";
import { CheckCircle, BookOpen, TrendingUp, MessageCircle } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Teste de personalidade",
    desc: "Um retrato claro de quem você é e de como você decide.",
    bg: "bg-primary/14",
    fg: "text-primary",
  },
  {
    icon: BookOpen,
    title: "Guia vocacional",
    desc: "Fichas honestas de cada profissão, com rotina e realidade.",
    bg: "bg-secondary/16",
    fg: "text-secondary",
  },
  {
    icon: TrendingUp,
    title: "Plano de carreira",
    desc: "Próximos passos concretos, no seu tempo e no seu ritmo.",
    bg: "bg-highlight/18",
    fg: "text-highlight",
  },
  {
    icon: MessageCircle,
    title: "Mentoria e consultoria",
    desc: "Um ARP ao seu lado para cuidar do lado emocional da escolha.",
    bg: "bg-accent/9",
    fg: "text-accent",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-cream-2 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-[2rem] font-medium text-foreground">
            Tudo que você precisa{" "}
            <span className="italic text-primary">para decidir melhor</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-[14px] p-5"
            >
              <div
                className={`w-10 h-10 rounded-[11px] ${f.bg} ${f.fg} flex items-center justify-center mb-3.5`}
              >
                <f.icon className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <h4 className="font-heading text-[17px] font-medium text-foreground mb-1.5">
                {f.title}
              </h4>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}