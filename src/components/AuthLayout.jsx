import React from "react";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";
import { MascotCap, MascotGirl } from "@/components/home/Mascots";

const beneficios = [
  "Teste comportamental que dá sempre o mesmo resultado para as mesmas respostas",
  "Fichas de profissões com rotina, formação e salário",
  "Uma comunidade de jovens decidindo o futuro, como você",
];

// Layout das telas de entrar, criar conta e senha.
// Desktop: painel da marca à esquerda + formulário. Celular: só o formulário.
export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-background">
      <aside className="hidden lg:flex flex-col justify-between bg-[#0f2e26] text-[#f8f0e6] p-12 xl:p-16 relative overflow-hidden">
        <Logo inverted />

        <div className="relative z-10 max-w-md">
          <h2 className="text-[2.4rem] font-medium leading-[1.12] text-[#f8f0e6]">
            Seu caminho <span className="italic text-highlight">começa por você.</span>
          </h2>
          <ul className="mt-8 space-y-3.5">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-[#f8f0e6]/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-highlight/20 text-highlight flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-44" aria-hidden="true">
          <div className="absolute -left-6 bottom-[-48px] w-64 h-64 rounded-full bg-accent/20" />
          <div className="absolute left-40 bottom-[-30px] w-48 h-48 rounded-full bg-highlight/10" />
          <MascotGirl className="absolute left-6 bottom-[-12px] w-32 h-auto" />
          <MascotCap className="absolute left-36 bottom-[-12px] w-32 h-auto" />
        </div>
      </aside>

      <main className="flex flex-col justify-center px-4 sm:px-8 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo />
          </div>

          <div className="mb-8 text-center lg:text-left">
            {Icon && (
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
            )}
            <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-soft p-6 sm:p-8">{children}</div>

          {footer && <p className="text-center text-sm mt-6 text-muted-foreground">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
