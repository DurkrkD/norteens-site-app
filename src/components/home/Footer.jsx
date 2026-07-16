import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 shrink-0">
    <circle cx="16" cy="16" r="14.5" stroke="var(--primary)" strokeWidth="2" />
    <path d="M16 5 L19.5 16 L16 27 L12.5 16 Z" fill="var(--primary)" />
    <path d="M5 16 L16 12.5 L27 16 L16 19.5 Z" fill="var(--accent)" />
    <circle cx="16" cy="16" r="2.4" fill="var(--background)" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="text-[#CFC9BE]" style={{ background: "#1C2A3A" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 py-14 pb-8">
          <div>
            <div className="flex items-center gap-2 font-heading font-semibold text-xl" style={{ color: "#F7F0E6" }}>
              <Logo />
              Norteens
            </div>
            <p className="mt-3.5 text-sm max-w-[34ch]" style={{ color: "rgba(247,240,230,0.72)" }}>
              Encontre seu caminho começando por você. Orientação de carreira e
              autoconhecimento para cada fase da sua jornada.
            </p>
          </div>
          <div>
            <h5 className="font-sans text-[13px] uppercase tracking-[0.08em] mb-3.5" style={{ color: "#E8B04B" }}>
              Plataforma
            </h5>
            <div className="flex flex-col gap-0">
              <Link to="/" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Início</Link>
              <Link to="/profissoes" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Profissões</Link>
              <Link to="/teste" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Fazer teste</Link>
              <Link to="/comunidade" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Comunidade</Link>
            </div>
          </div>
          <div>
            <h5 className="font-sans text-[13px] uppercase tracking-[0.08em] mb-3.5" style={{ color: "#E8B04B" }}>
              Explorar
            </h5>
            <div className="flex flex-col gap-0">
              <Link to="/famosos" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Famosos</Link>
              <Link to="/comunidade" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Comunidade</Link>
              <Link to="/profissoes" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Profissões</Link>
            </div>
          </div>
          <div>
            <h5 className="font-sans text-[13px] uppercase tracking-[0.08em] mb-3.5" style={{ color: "#E8B04B" }}>
              Conta
            </h5>
            <div className="flex flex-col gap-0">
              <Link to="/login" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Entrar</Link>
              <Link to="/register" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Criar conta</Link>
              <Link to="/configuracoes" className="text-sm py-1.5 transition-colors" style={{ color: "#F7F0E6" }} onMouseEnter={e => e.currentTarget.style.color = "#E8B04B"} onMouseLeave={e => e.currentTarget.style.color = "#F7F0E6"}>Configurações</Link>
            </div>
          </div>
        </div>
        <div
          className="border-t py-4 flex justify-between flex-wrap gap-2 text-[13px]"
          style={{ borderColor: "rgba(255,255,255,0.09)", color: "rgba(247,240,230,0.5)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
        >
          <span>Norteens © 2026</span>
          <div className="flex gap-2.5">
            <a
              href="https://instagram.com/careernorteens"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-[9px] flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.08)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(232,176,75,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}