import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroMascots from "@/components/home/Mascots";

export default function HeroSection({ user }) {
  const ctaPrimary = user
    ? user.teste_feito
      ? { to: "/resultado", label: "Ver meu resultado" }
      : { to: "/teste", label: "Fazer teste" }
    : { to: "/register", label: "Fazer teste" };

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              Orientação de carreira com propósito
            </span>
            <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-[3.7rem] font-medium text-foreground leading-[1.06] tracking-tight">
              Descubra seu caminho.{" "}
              <em className="not-italic">
                <span className="italic text-primary">Construa seu futuro</span>
              </em>{" "}
              com propósito.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
              Testes, conteúdos e ferramentas para você se conhecer e encontrar a
              profissão que combina com quem você é — sem medo e sem estar sozinho.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 lg:justify-start justify-center">
              <Link
                to={ctaPrimary.to}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-[15px] shadow-soft hover:bg-primary/90 hover:-translate-y-px transition-all"
              >
                {ctaPrimary.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/profissoes"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border bg-transparent text-foreground rounded-full font-semibold text-[15px] hover:bg-muted transition-all"
              >
                Explorar profissões
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-2.5 text-sm text-muted-foreground">
              <div className="flex">
                <span className="w-7 h-7 rounded-full border-2 border-background -ml-2 first:ml-0 bg-primary" />
                <span className="w-7 h-7 rounded-full border-2 border-background -ml-2 bg-secondary" />
                <span className="w-7 h-7 rounded-full border-2 border-background -ml-2 bg-highlight" />
                <span className="w-7 h-7 rounded-full border-2 border-background -ml-2 bg-accent" />
              </div>
              +1,2 mil jovens já começaram a se encontrar aqui
            </div>
          </div>

          <div className="relative">
            <HeroMascots className="relative w-full h-auto max-w-[480px] mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}