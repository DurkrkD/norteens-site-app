import React from "react";
import { Link } from "react-router-dom";
import { Check, Gift, ArrowRight, FileBarChart2, MessagesSquare, Sparkles, Compass } from "lucide-react";
import { PERFIS, ORDEM_EIXOS } from "@/data/perfis";
import BotaoInteresse from "@/components/ofertas/BotaoInteresse";

// "Avaliação DISC completa" -> "avaliação DISC completa" (no meio da frase, sem estragar a sigla)
export const minusculaInicial = (s = "") => s.charAt(0).toLowerCase() + s.slice(1);

// Preço: enquanto o admin não define, mostra "Em breve" (nada de preço inventado nem "desconto" falso)
export function Preco({ oferta, escuro = false, grande = false }) {
  if (oferta.preco) {
    return (
      <p className={`font-heading font-bold tracking-tight ${grande ? "text-4xl" : "text-3xl"} ${escuro ? "text-[#f8f0e6]" : "text-foreground"}`}>
        {oferta.preco}
      </p>
    );
  }
  return (
    <div>
      <p className={`font-serif italic leading-none ${grande ? "text-[2.6rem]" : "text-[2.2rem]"} ${escuro ? "text-highlight" : "text-accent"}`}>Em breve</p>
      <p className={`mt-1.5 text-xs ${escuro ? "text-[#f8f0e6]/55" : "text-muted-foreground"}`}>Valores anunciados no lançamento</p>
    </div>
  );
}

const botaoClaro = "w-full h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors";
const botaoEscuro = "w-full h-12 rounded-full bg-[#f8f0e6] text-[#0f2e26] text-sm font-semibold hover:bg-white transition-colors";

/* ------------------------------------------------------------------ plano de mentoria */
export function CartaoPlano({ oferta, user }) {
  const escuro = oferta.destaque;
  const presentes = oferta.presentes || [];
  return (
    <article
      className={`relative w-full flex flex-col rounded-[28px] p-7 sm:p-8 transition-shadow ${
        escuro
          ? "bg-[#0f2e26] text-[#f8f0e6] shadow-elevated lg:-my-4 lg:py-11"
          : "bg-card border border-border shadow-soft hover:shadow-soft-lg"
      }`}
    >
      {escuro && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-highlight text-[#0f2e26] text-[11px] font-bold uppercase tracking-[0.1em] shadow-soft">
          <Sparkles className="w-3 h-3" /> Recomendado
        </span>
      )}
      <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${escuro ? "text-[#f8f0e6]/50" : "text-muted-foreground"}`}>Mentoria</p>
      <h3 className="mt-1.5 text-[1.75rem] font-bold tracking-[-0.02em]">{oferta.nome}</h3>
      {oferta.subtitulo && <p className={`mt-1 text-sm ${escuro ? "text-[#f8f0e6]/70" : "text-muted-foreground"}`}>{oferta.subtitulo}</p>}

      <div className={`my-6 pt-6 border-t ${escuro ? "border-white/10" : "border-border"}`}>
        <Preco oferta={oferta} escuro={escuro} />
      </div>

      <ul className="space-y-3 flex-1">
        {(oferta.beneficios || []).map((b) => (
          <li key={b} className="flex gap-3 text-[15px] leading-snug">
            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${escuro ? "bg-white/10 text-highlight" : "bg-secondary/15 text-secondary"}`}>
              <Check className="w-3 h-3" strokeWidth={3} />
            </span>
            <span className={escuro ? "text-[#f8f0e6]/90" : "text-foreground/85"}>{b}</span>
          </li>
        ))}
      </ul>

      {presentes.length > 0 && (
        <div className={`mt-6 p-4 rounded-2xl border border-dashed ${escuro ? "border-highlight/40 bg-highlight/10" : "border-accent/35 bg-accent/[0.06]"}`}>
          <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] ${escuro ? "text-highlight" : "text-accent"}`}>
            <Gift className="w-4 h-4" /> {presentes.length === 1 ? "Presente incluso" : "Presentes inclusos"}
          </p>
          <ul className="mt-2 space-y-1">
            {presentes.map((p) => (
              <li key={p} className={`text-sm ${escuro ? "text-[#f8f0e6]/85" : "text-foreground/80"}`}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7">
        <BotaoInteresse oferta={oferta} user={user} className={escuro ? botaoEscuro : botaoClaro} />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ avaliação DISC (destaque largo) */
const AMOSTRA = { D: 42, I: 78, S: 61, C: 35 };

export function DestaqueDisc({ oferta, user }) {
  if (!oferta) return null;
  const pontos = user?.perfil_pontuacao || AMOSTRA;
  return (
    <article className="grao relative overflow-hidden rounded-[32px] bg-[#0f2e26] text-[#f8f0e6]">
      <div className="absolute -left-24 -bottom-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute right-0 top-0 w-[28rem] h-[28rem] rounded-full bg-highlight/10 blur-3xl" aria-hidden />

      <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 p-8 sm:p-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-highlight">
            <FileBarChart2 className="w-3.5 h-3.5" /> {oferta.nome}
          </span>
          <h3 className="mt-5 text-3xl sm:text-[2.6rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
            Seu perfil a fundo,{" "}
            <span className="font-serif font-normal italic tracking-normal text-highlight">{oferta.subtitulo || "com devolutiva"}.</span>
          </h3>
          {oferta.descricao && <p className="mt-4 text-[#f8f0e6]/70 text-lg leading-relaxed max-w-xl">{oferta.descricao}</p>}

          <ul className="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {(oferta.beneficios || []).map((b) => (
              <li key={b} className="flex gap-2.5 text-[15px] text-[#f8f0e6]/90 leading-snug">
                <Check className="w-4 h-4 mt-0.5 text-highlight shrink-0" strokeWidth={3} /> {b}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-6">
            <Preco oferta={oferta} escuro grande />
            <BotaoInteresse oferta={oferta} user={user} className="h-12 px-7 rounded-full bg-[#f8f0e6] text-[#0f2e26] text-sm font-semibold hover:bg-white transition-colors">
              Entrar na lista de interesse
            </BotaoInteresse>
          </div>
        </div>

        {/* prévia do relatório: com os números da própria pessoa quando ela já fez o teste */}
        <div className="relative mx-auto w-full max-w-sm" aria-hidden>
          <div className="rounded-3xl bg-[#f8f0e6] text-[#0f2e26] p-6 shadow-elevated rotate-[1.5deg]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f2e26]/50">Relatório DISC</p>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0f2e26]/[0.07]">Prévia</span>
            </div>
            <p className="mt-3 font-heading text-xl font-bold">{user?.perfil_pontuacao ? "Seus quatro traços" : "Os quatro traços"}</p>
            <div className="mt-4 space-y-3">
              {ORDEM_EIXOS.map((e) => (
                <div key={e}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>{PERFIS[e].traco}</span>
                    <span className="tabular-nums text-[#0f2e26]/60">{pontos[e]}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0f2e26]/[0.08] overflow-hidden">
                    <div className={`h-full rounded-full ${PERFIS[e].cor}`} style={{ width: `${pontos[e]}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-1.5">
              <div className="h-2 rounded-full bg-[#0f2e26]/[0.07] w-full" />
              <div className="h-2 rounded-full bg-[#0f2e26]/[0.07] w-[85%]" />
              <div className="h-2 rounded-full bg-[#0f2e26]/[0.07] w-[60%]" />
            </div>
          </div>
          <div className="absolute -left-6 -bottom-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-card text-foreground shadow-elevated border border-border -rotate-2">
            <span className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <MessagesSquare className="w-[18px] h-[18px]" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Devolutiva com mentor</p>
              <p className="text-xs text-muted-foreground">Conversa individual, online</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ aparições compactas */

// na página de resultado: o passo natural depois de ver o perfil resumido
export function OfertaDiscCompacta({ oferta, user }) {
  if (!oferta) return null;
  return (
    <div className="relative overflow-hidden p-6 rounded-2xl border border-border bg-card">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-highlight/20 blur-2xl" aria-hidden />
      <p className="relative inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
        <Sparkles className="w-3.5 h-3.5" /> Em breve
      </p>
      <p className="relative mt-2 font-heading text-lg font-bold leading-snug">Quer ir mais fundo no seu perfil?</p>
      <p className="relative mt-1.5 text-sm text-muted-foreground leading-relaxed">
        A {minusculaInicial(oferta.nome)} traz um relatório detalhado e uma conversa com um mentor sobre o seu resultado.
      </p>
      <div className="relative mt-4 flex items-center gap-3">
        <BotaoInteresse oferta={oferta} user={user} className="h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors" />
        <Link to="/planos" className="text-sm font-semibold text-secondary hover:underline">Saiba mais</Link>
      </div>
    </div>
  );
}

// na ficha da profissão: para quem ficou em dúvida
export function ChamadaMentoria() {
  return (
    <Link to="/planos" className="group block p-5 rounded-2xl border border-border bg-card hover:shadow-soft-lg transition-shadow">
      <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
        <Compass className="w-5 h-5" />
      </span>
      <p className="mt-3 font-semibold text-foreground">Em dúvida entre carreiras?</p>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">Conheça a mentoria da Norteens: encontros individuais para decidir com mais segurança.</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
        Ver planos <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
