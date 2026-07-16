import React from "react";
import { GraduationCap, User, RefreshCw } from "lucide-react";

const audience = [
  {
    icon: GraduationCap,
    title: "Ensino médio",
    desc: "Para escolher um caminho sem pressão e sem chutes, no seu tempo.",
    bg: "bg-secondary/16",
    fg: "text-secondary",
  },
  {
    icon: User,
    title: "Universitários",
    desc: "Para confirmar a rota — ou ajustar a tempo, antes de ir mais longe.",
    bg: "bg-primary/14",
    fg: "text-primary",
  },
  {
    icon: RefreshCw,
    title: "Transição de carreira",
    desc: "Para recomeçar com propósito, aproveitando tudo que você já é.",
    bg: "bg-highlight/18",
    fg: "text-highlight",
  },
];

export default function AudienceSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-5">
          {audience.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-[22px] p-6 text-center shadow-soft"
            >
              <div
                className={`w-12 h-12 rounded-[14px] ${item.bg} ${item.fg} flex items-center justify-center mx-auto mb-3.5`}
              >
                <item.icon className="w-6 h-6" strokeWidth={1.7} />
              </div>
              <h4 className="font-heading text-lg font-medium text-foreground mb-1.5">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}