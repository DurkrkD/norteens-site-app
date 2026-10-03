import React from "react";
import { Link } from "react-router-dom";

const CREME = "#f8f0e6";
const VERDE_ESCURO = "#0f2e26";

// Bússola da Norteens. Na versão normal as cores vêm do tema (acompanham a cor personalizada do
// usuário; precisa de hsl(var(--x)) porque as variáveis guardam só os números do HSL).
// A versão "inverted" é para fundos verde-escuros fixos (rodapé), então usa cores fixas.
export function LogoMark({ className = "w-7 h-7", inverted = false }) {
  const traco = inverted ? CREME : "hsl(var(--primary))";
  const miolo = inverted ? VERDE_ESCURO : "hsl(var(--background))";
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke={traco} strokeWidth="2" />
      <path d="M16 5 L19.5 16 L16 27 L12.5 16 Z" fill={traco} />
      <path d="M5 16 L16 12.5 L27 16 L16 19.5 Z" fill="hsl(var(--accent))" />
      <circle cx="16" cy="16" r="2.4" fill={miolo} />
    </svg>
  );
}

export default function Logo({ inverted = false, className = "", to = "/" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 font-heading font-semibold text-xl tracking-tight ${
        inverted ? "text-[#f8f0e6]" : "text-foreground"
      } ${className}`}
    >
      <LogoMark inverted={inverted} />
      Norteens
    </Link>
  );
}
