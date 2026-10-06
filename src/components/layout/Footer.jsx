import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const colunas = [
  {
    titulo: "Plataforma",
    links: [
      { to: "/", label: "Início" },
      { to: "/profissoes", label: "Profissões" },
      { to: "/famosos", label: "Famosos" },
      { to: "/comunidade", label: "Comunidade" },
      { to: "/planos", label: "Planos" },
    ],
  },
  {
    titulo: "Sua jornada",
    links: [
      { to: "/teste", label: "Teste comportamental" },
      { to: "/resultado", label: "Meu resultado" },
      { to: "/feedback", label: "Deixar feedback" },
    ],
  },
  {
    titulo: "Conta",
    links: [
      { to: "/login", label: "Entrar" },
      { to: "/register", label: "Criar conta" },
      { to: "/configuracoes", label: "Configurações" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="grao overflow-hidden bg-[#0f2e26] text-[#f8f0e6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] py-14">
          <div>
            <Logo inverted />
            <p className="mt-4 text-sm leading-relaxed text-[#f8f0e6]/70 max-w-[34ch]">
              Orientação de carreira e autoconhecimento para cada fase da sua jornada. Comece por você.
            </p>
          </div>
          {colunas.map((col) => (
            <div key={col.titulo}>
              <h2 className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-highlight mb-4">
                {col.titulo}
              </h2>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-[#f8f0e6]/85 hover:text-highlight transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* assinatura grande da marca, em serifa, recortada pela borda */}
        <p
          aria-hidden
          className="font-serif italic leading-[0.8] text-[clamp(5rem,17vw,15rem)] tracking-[-0.02em] text-[#f8f0e6]/[0.07] select-none whitespace-nowrap -mb-[0.12em]"
        >
          Norteens
        </p>
        <div
          className="border-t border-white/10 py-5 flex items-center justify-between gap-4 text-[13px] text-[#f8f0e6]/55"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
        >
          <span>© {new Date().getFullYear()} Norteens</span>
          <a
            href="https://instagram.com/careernorteens"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Norteens"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-highlight/25 flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
