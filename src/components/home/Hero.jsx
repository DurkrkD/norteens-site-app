import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { PERFIS, ORDEM_EIXOS } from "@/data/perfis";

// valores ilustrativos da prévia do resultado (não é dado de ninguém)
const EXEMPLO = { D: 38, I: 84, S: 61, C: 47 };

function PreviaProduto() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none" aria-hidden="true">
      {/* brilho de fundo */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-accent/20 via-highlight/10 to-secondary/20 blur-3xl rounded-[48px]" />

      {/* cartão: pergunta do teste */}
      <div className="relative ml-auto w-[88%] rounded-2xl bg-card border border-border shadow-soft-lg p-5 animate-fade-up">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span>PERGUNTA 4 DE 12</span>
          <span>33%</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-accent to-highlight" />
        </div>
        <p className="mt-4 font-heading font-semibold text-foreground">Em uma festa ou evento novo, você...</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground w-16">Observa</span>
          <div className="flex items-center gap-1.5">
            {[18, 14, 11, 9, 11, 14, 18].map((s, i) => (
              <span
                key={i}
                style={{ width: s, height: s }}
                className={`rounded-full border-2 ${
                  i === 5 ? "bg-accent border-accent" : i < 3 ? "border-secondary/50" : i > 3 ? "border-accent/50" : "border-border"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground w-16 text-right">Conversa</span>
        </div>
      </div>

      {/* cartão: resultado */}
      <div className="relative -mt-4 mr-auto w-[92%] rounded-2xl bg-card border border-border shadow-elevated overflow-hidden animate-fade-up [animation-delay:120ms]">
        <div className="px-5 py-4 bg-[#0f2e26] text-[#f8f0e6] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#f8f0e6]/60">SEU PERFIL</p>
            <p className="font-heading text-xl font-bold">Comunicador(a)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-highlight text-[#0f2e26]">
            <Sparkles className="w-3 h-3" /> Influência
          </span>
        </div>
        <div className="p-5 space-y-3">
          {ORDEM_EIXOS.map((e) => (
            <div key={e}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground">{PERFIS[e].traco}</span>
                <span className="text-muted-foreground tabular-nums">{EXEMPLO[e]}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${PERFIS[e].cor}`} style={{ width: `${EXEMPLO[e]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* selo: próximos passos */}
      <div className="absolute -bottom-14 right-0 sm:-right-4 rounded-2xl bg-card border border-border shadow-soft-lg px-4 py-3 animate-fade-up [animation-delay:240ms]">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">CARREIRAS PARA EXPLORAR</p>
        <div className="mt-2 flex gap-1.5">
          {["📣 Comunicação", "🧠 Psicologia", "✈️ Turismo"].map((c) => (
            <span key={c} className="text-[11px] font-medium px-2 py-1 rounded-lg bg-muted text-foreground whitespace-nowrap">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ user }) {
  const cta = user
    ? user.teste_feito
      ? { to: "/resultado", label: "Ver meu resultado" }
      : { to: "/teste", label: "Fazer o teste" }
    : { to: "/register", label: "Fazer o teste grátis" };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-card border border-border shadow-soft text-xs font-medium text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">Grátis</span>
              Teste comportamental · 12 perguntas · 3 min
            </span>

            <h1 className="mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.1rem] font-bold tracking-[-0.03em] text-foreground text-balance">
              Descubra quem você é.{" "}
              <span className="font-serif font-normal italic tracking-normal text-accent">Escolha</span> com
              clareza.
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty">
              A Norteens ajuda jovens a entender o próprio perfil e a conectar isso a profissões reais, com
              rotina, formação e salário, antes de tomar uma das maiores decisões da vida.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to={cta.to}
                className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft-lg hover:bg-primary/90 transition-all"
              >
                {cta.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/profissoes"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-card border border-border font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Explorar profissões
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["100% gratuito", "Resultado na hora", "Mesmas respostas, mesmo resultado"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-secondary" strokeWidth={2.5} /> {t}
                </li>
              ))}
            </ul>
          </div>

          <PreviaProduto />
        </div>
      </div>
    </section>
  );
}
