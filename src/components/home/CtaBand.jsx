import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CtaBand({ user }) {
  const to = user ? (user.teste_feito ? "/resultado" : "/teste") : "/login";

  return (
    <section className="pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-[26px] px-8 sm:px-11 py-10 flex items-center justify-between gap-6 flex-wrap"
          style={{ background: "linear-gradient(120deg, #E88A6F, #E07A5F)", color: "#fff" }}
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-[1.9rem] font-medium text-white">
              Pronto para dar o primeiro passo?
            </h2>
            <p className="mt-1.5 opacity-90">
              Comece pelo teste gratuito. Leva poucos minutos e já entrega clareza.
            </p>
          </div>
          <Link
            to={to}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-[15px] shadow-soft transition-all hover:-translate-y-px"
            style={{ background: "#1C2A3A", color: "#F7F0E6" }}
          >
            Fazer teste gratuito
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}