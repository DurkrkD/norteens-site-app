import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";
import UserAvatar from "@/components/UserAvatar";
import { CabecalhoSecao } from "@/components/home/Secao";

// Depoimentos escolhidos pela equipe (só os que o aluno autorizou). Sem nenhum destacado, a seção some.
export default function TestimonialSection() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    norteens.listarFeedbacksPublicos().then(setFeedbacks).catch(() => {});
  }, []);

  if (feedbacks.length === 0) return null;

  const autor = (f) => ({ nome: f.autor_nome, apelido: f.autor_apelido, foto_url: f.autor_foto });

  // um depoimento só: citação grande
  if (feedbacks.length === 1) {
    const f = feedbacks[0];
    return (
      <section className="py-20 sm:py-24">
        <figure className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Quem já passou por aqui</p>
          <blockquote className="mt-6 font-serif text-3xl sm:text-[2.6rem] leading-[1.2] text-foreground text-balance">
            “{f.texto}”
          </blockquote>
          <figcaption className="mt-8 inline-flex items-center gap-3">
            <UserAvatar user={autor(f)} size="md" />
            <span className="text-left">
              <b className="block text-sm text-foreground">{f.autor_nome || f.autor_apelido || "Usuário"}</b>
              <span className="text-sm text-muted-foreground">Usuário Norteens</span>
            </span>
          </figcaption>
        </figure>
      </section>
    );
  }

  // vários: grade de cartões
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <CabecalhoSecao sobretitulo="Depoimentos" titulo="Quem já passou" destaque="por aqui." />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feedbacks.slice(0, 6).map((f) => (
            <figure key={f.id} className="flex flex-col rounded-2xl bg-card border border-border p-7">
              <span className="font-serif text-5xl leading-none text-accent/40" aria-hidden="true">“</span>
              <blockquote className="mt-2 text-[17px] text-foreground leading-relaxed flex-1">{f.texto}</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <UserAvatar user={autor(f)} size="md" />
                <span>
                  <b className="block text-sm text-foreground">{f.autor_nome || f.autor_apelido || "Usuário"}</b>
                  <span className="text-xs text-muted-foreground">Usuário Norteens</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
