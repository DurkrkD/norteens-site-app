import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MascotCap, MascotGirl } from "@/components/home/Mascots";

export default function ChamadaFinal({ user }) {
  const cta = user
    ? user.teste_feito
      ? { to: "/profissoes", label: "Explorar profissões" }
      : { to: "/teste", label: "Fazer o teste agora" }
    : { to: "/register", label: "Começar grátis" };

  return (
    <section className="pb-24 sm:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e26] px-8 sm:px-14 py-14 sm:py-16">
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute right-40 -bottom-32 w-72 h-72 rounded-full bg-highlight/15 blur-3xl" />

          <div className="relative grid md:grid-cols-[1.4fr_1fr] items-center gap-8">
            <div>
              <h2 className="text-3xl sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.025em] text-[#f8f0e6] text-balance">
                Seu futuro merece mais do que{" "}
                <span className="font-serif font-normal italic tracking-normal text-highlight">um chute.</span>
              </h2>
              <p className="mt-4 text-lg text-[#f8f0e6]/70 max-w-lg">
                Comece pelo teste. Em 3 minutos você já sabe por onde começar a olhar.
              </p>
              <Link
                to={cta.to}
                className="group mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#f8f0e6] text-[#0f2e26] font-semibold hover:bg-white transition-colors"
              >
                {cta.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="hidden md:flex justify-center items-end h-full -mb-16" aria-hidden="true">
              <MascotGirl className="w-36 h-auto" />
              <MascotCap className="w-36 h-auto -ml-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
