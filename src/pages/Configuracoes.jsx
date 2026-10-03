import React, { useEffect } from "react";
import { Link, useOutletContext, useNavigate, useSearchParams } from "react-router-dom";
import { UserRound, ShieldCheck, Palette, LayoutDashboard, ArrowRight } from "lucide-react";
import ConfigPerfil from "@/components/config/ConfigPerfil";
import ConfigConta from "@/components/config/ConfigConta";
import ConfigAparencia from "@/components/config/ConfigAparencia";
import { PageContainer, PageHeader } from "@/components/layout/Page";
import { isEquipe } from "@/utils/papeis";

const ABAS = [
  { id: "perfil", label: "Meu perfil", icon: UserRound, Componente: ConfigPerfil },
  { id: "conta", label: "Conta e segurança", icon: ShieldCheck, Componente: ConfigConta },
  { id: "aparencia", label: "Aparência", icon: Palette, Componente: ConfigAparencia },
];

export default function Configuracoes() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const aba = ABAS.find((a) => a.id === searchParams.get("aba")) || ABAS[0];
  const { Componente } = aba;

  return (
    <PageContainer size="md">
      <PageHeader eyebrow="Sua conta" title="Configurações" />

      <div className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-start">
        <nav className="flex md:flex-col gap-1 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:sticky md:top-24" aria-label="Seções">
          {ABAS.map((a) => {
            const ativa = a.id === aba.id;
            return (
              <button
                key={a.id}
                onClick={() => setSearchParams({ aba: a.id }, { replace: true })}
                aria-current={ativa ? "page" : undefined}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors text-left ${
                  ativa ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-transparent"
                }`}
              >
                <a.icon className="w-4 h-4 shrink-0" />
                {a.label}
              </button>
            );
          })}

          {isEquipe(user) && (
            <Link
              to="/painel"
              className="hidden md:flex items-center justify-between gap-2 mt-4 px-3.5 py-3 rounded-xl bg-[#0f2e26] text-[#f8f0e6] text-sm font-medium hover:bg-[#0b241d] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" /> Painel da equipe
              </span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>
          )}
        </nav>

        <section className="min-w-0">
          <Componente />
        </section>
      </div>
    </PageContainer>
  );
}
