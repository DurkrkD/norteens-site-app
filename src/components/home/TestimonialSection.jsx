import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";

export default function TestimonialSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    norteens.listarFeedbacksPublicos()
      .then(setFeedbacks)
      .catch(() => {
        // silently ignore — section stays hidden
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || feedbacks.length === 0) return null;

  const fb = feedbacks[0];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <figure className="rounded-[28px] py-14 sm:py-16 px-8 sm:px-10 text-center relative overflow-hidden border border-border bg-card shadow-soft">
          {/* pontinhos decorativos */}
          <span className="absolute w-2 h-2 rounded-full top-10 left-14 bg-highlight" />
          <span className="absolute w-2.5 h-2.5 rounded-full bottom-12 right-16 bg-accent" />
          <span className="absolute w-1.5 h-1.5 rounded-full top-16 right-28 bg-secondary/60" />
          <span className="absolute w-1.5 h-1.5 rounded-full bottom-20 left-28 bg-secondary/60" />

          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent mb-5">Quem já passou por aqui</p>
          <blockquote className="font-heading text-xl sm:text-[2rem] font-medium leading-[1.32] max-w-[30ch] mx-auto relative text-foreground">
            “{fb.texto}”
          </blockquote>
          <figcaption className="mt-6 relative">
            <b className="block text-[15px] text-accent">{fb.autor_nome || fb.autor_apelido || "Usuário"}</b>
            <span className="text-sm text-muted-foreground">Usuário Norteens</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}