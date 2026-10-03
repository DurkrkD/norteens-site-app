import React from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  Compass,
  Briefcase,
  MessageCircle,
  Check,
} from "lucide-react";
import { MARCOS, calcularNivel, todosConcluidos } from "@/utils/progresso";

const iconMap = {
  marco_teste: ClipboardCheck,
  marco_resultado: Compass,
  marco_profissoes: Briefcase,
  marco_comunidade: MessageCircle,
};

export default function ProgressoCard({ user }) {
  const nivel = calcularNivel(user);
  const completo = todosConcluidos(user);
  const pct = (nivel / MARCOS.length) * 100;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-card rounded-[18px] border border-border shadow-soft p-6 sm:p-8 select-none">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Sua jornada de exploração
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Nível {nivel} de {MARCOS.length}
            </p>
          </div>
          {completo ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/15 text-secondary">
              <Check className="w-3.5 h-3.5" /> Concluído
            </span>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {MARCOS.length - nivel} restantes
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2.5 rounded-full overflow-hidden mb-6 bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-accent to-highlight"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MARCOS.map((marco) => {
            const done = !!user?.[marco.key];
            const Icon = iconMap[marco.key];
            return (
              <div
                key={marco.key}
                className={`rounded-[14px] p-3.5 border text-center transition-all ${
                  done
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <p
                  className={`text-xs font-medium leading-tight ${
                    done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {marco.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Feedback unlock */}
        {completo && (
          <div className="mt-6 rounded-[14px] p-4 flex items-center justify-between gap-4 flex-wrap bg-[#0f2e26]">
            <div>
              <p className="font-heading text-sm font-medium text-[#f8f0e6]">Feedback desbloqueado!</p>
              <p className="text-xs mt-0.5 text-[#f8f0e6]/70">
                Conte como foi sua experiência — pode escrever livremente.
              </p>
            </div>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-px bg-highlight text-[#0f2e26]"
            >
              Deixar feedback
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}