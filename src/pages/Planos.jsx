import React from "react";
import { useOutletContext, Link } from "react-router-dom";
import { BellRing, Mail, Users, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CabecalhoSecao } from "@/components/home/Secao";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { useOfertas } from "@/components/ofertas/useOfertas";
import { DestaqueDisc, CartaoPlano } from "@/components/ofertas/Cartoes";
import Revelar from "@/components/Revelar";

const PASSOS = [
  { icon: BellRing, titulo: "Entre na lista", texto: "Escolha o que te interessa e deixe seu e-mail. Leva 30 segundos e não tem custo." },
  { icon: Mail, titulo: "Receba o aviso", texto: "Quando abrir, você recebe um e-mail com valores, datas e como funciona." },
  { icon: Users, titulo: "Decida com calma", texto: "Converse com sua família e só então decida. Sem pressa e sem compromisso." },
];

// Perguntas honestas: nada de prazo inventado, vaga limitada ou promessa de resultado.
const FAQ = [
  { p: "Já posso contratar?", r: "Ainda não. A avaliação completa e a mentoria estão sendo preparadas. Entrando na lista de interesse, você recebe um e-mail assim que abrir, com valores e datas." },
  { p: "Entrar na lista tem algum custo ou compromisso?", r: "Nenhum. A lista serve só para avisar você no lançamento. Nada é cobrado e você pode pedir para sair a qualquer momento." },
  { p: "Sou menor de idade. Posso participar?", r: "Pode entrar na lista. Na hora de contratar, quem contrata é um responsável — e ele é bem-vindo nas conversas." },
  { p: "O teste de perfil continua disponível?", r: "Sim. O teste de perfil, o guia de profissões e a comunidade continuam disponíveis para quem tem conta. A avaliação completa e a mentoria são aprofundamentos opcionais." },
  { p: "Como são os encontros de mentoria?", r: "Individuais e online, com um mentor da equipe Norteens. A ideia é ajudar você a organizar o que descobriu e a planejar os próximos passos — a decisão é sempre sua." },
];

export default function Planos() {
  const { user } = useOutletContext();
  const { carregando, disc, mentorias } = useOfertas();

  if (carregando) return <PageLoading />;

  return (
    <div>
      {/* topo */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-14 sm:pt-20 sm:pb-16 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border shadow-soft text-xs font-medium text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Novidade da Norteens
          </span>
          <h1 className="mt-6 text-[2.5rem] sm:text-6xl leading-[1.04] font-bold tracking-[-0.035em] text-balance max-w-3xl mx-auto">
            Vá além do teste.{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">Com quem entende.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            Uma avaliação de perfil mais completa e uma mentoria individual para transformar o que você descobriu em
            um plano de verdade.
          </p>
        </div>
      </section>

      {!disc && mentorias.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 py-16">
          <EmptyState icon={Sparkles} title="Novidades em breve" description="Estamos preparando os planos. Volte em breve!" />
        </div>
      ) : (
        <>
          {disc && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20">
              <Revelar><DestaqueDisc oferta={disc} user={user} /></Revelar>
            </section>
          )}

          {mentorias.length > 0 && (
            <section id="mentoria" className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
              <CabecalhoSecao
                sobretitulo="Mentoria"
                titulo="Escolha o ritmo"
                destaque="da sua jornada."
                texto="Encontros individuais com um mentor da Norteens. Os planos mudam no tempo de acompanhamento — e alguns vêm com presente."
              />
              <div className={`mt-14 grid gap-6 lg:gap-5 items-stretch ${mentorias.length >= 3 ? "lg:grid-cols-3" : mentorias.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "max-w-md mx-auto"}`}>
                {mentorias.map((m, i) => (
                  <Revelar key={m.id} atraso={i * 0.08} className="flex">
                    <CartaoPlano oferta={m} user={user} />
                  </Revelar>
                ))}
              </div>
            </section>
          )}

          {/* como funciona a lista */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
            <div className="rounded-[32px] border border-border bg-card p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Como funciona</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.02em]">Ainda não é uma compra.</h2>
              <ol className="mt-8 grid md:grid-cols-3 gap-8">
                {PASSOS.map((p, i) => (
                  <li key={p.titulo}>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                        <p.icon className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground tabular-nums">0{i + 1}</span>
                    </div>
                    <p className="mt-4 font-semibold text-foreground">{p.titulo}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </>
      )}

      {/* dúvidas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-28 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <CabecalhoSecao centro={false} sobretitulo="Dúvidas" titulo="Antes de" destaque="decidir." texto="Ficou alguma dúvida? Pergunte na comunidade." />
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.p} value={`p-${i}`} className="border-border">
              <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline text-left">{f.p}</AccordionTrigger>
              <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed pr-8">{f.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {!user && (
        <p className="pb-16 -mt-8 text-center text-sm text-muted-foreground">
          Enquanto isso, comece pelo{" "}
          <Link to="/register" className="font-semibold text-secondary hover:underline">teste de perfil</Link>.
        </p>
      )}
    </div>
  );
}
