import React, { useEffect } from "react";
import { NavLink, Navigate, Link, useOutletContext, useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard, Briefcase, Sparkles, MessageSquareHeart, ClipboardList, Users, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, EmptyState } from "@/components/layout/Page";
import { PapelBadge } from "@/components/layout/Navbar";
import { isAdmin, isEquipe, PAPEIS } from "@/utils/papeis";
import PainelVisaoGeral from "@/components/painel/PainelVisaoGeral";
import PainelProfissoes from "@/components/painel/PainelProfissoes";
import PainelFamosos from "@/components/painel/PainelFamosos";
import PainelFeedbacks from "@/components/painel/PainelFeedbacks";
import PainelPerguntas from "@/components/painel/PainelPerguntas";
import PainelUsuarios from "@/components/painel/PainelUsuarios";

// Seções do painel. "somenteAdmin" some do menu do ARP (e o backend também recusa).
const GRUPOS = [
  {
    titulo: null,
    itens: [{ id: "", label: "Visão geral", icon: LayoutDashboard, Componente: PainelVisaoGeral }],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { id: "profissoes", label: "Profissões", icon: Briefcase, Componente: PainelProfissoes },
      { id: "famosos", label: "Famosos", icon: Sparkles, Componente: PainelFamosos },
    ],
  },
  {
    titulo: "Comunidade",
    itens: [{ id: "feedbacks", label: "Feedbacks", icon: MessageSquareHeart, Componente: PainelFeedbacks }],
  },
  {
    titulo: "Teste",
    itens: [{ id: "perguntas", label: "Perguntas do teste", icon: ClipboardList, Componente: PainelPerguntas }],
  },
  {
    titulo: "Administração",
    somenteAdmin: true,
    itens: [{ id: "usuarios", label: "Usuários", icon: Users, Componente: PainelUsuarios }],
  },
];

export default function Painel() {
  const { user } = useOutletContext();
  const { secao = "" } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  if (!isEquipe(user)) {
    return (
      <PageContainer size="md">
        <EmptyState
          icon={Lock}
          title="Área restrita à equipe"
          description="O painel é usado pelos ARPs e administradores da Norteens."
          action={<Button asChild variant="outline"><Link to="/">Voltar para o início</Link></Button>}
        />
      </PageContainer>
    );
  }

  const admin = isAdmin(user);
  const grupos = GRUPOS.filter((g) => !g.somenteAdmin || admin);
  const atual = grupos.flatMap((g) => g.itens).find((i) => i.id === secao);
  if (!atual) return <Navigate to="/painel" replace />;
  const { Componente } = atual;

  const linkClasse = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
      isActive ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-transparent"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-8 lg:self-start mb-6 lg:mb-0">
        {/* identificação */}
        <div className="hidden lg:block p-4 rounded-2xl bg-[#0f2e26] text-[#f8f0e6] mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f8f0e6]/55">Painel da equipe</p>
          <p className="mt-2 font-heading font-semibold truncate">{user.nome || user.email}</p>
          <div className="mt-2">
            <PapelBadge papel={user.papel} escuro />
          </div>
          <p className="mt-2 text-xs text-[#f8f0e6]/65 leading-relaxed">{PAPEIS[user.papel]?.descricao}</p>
        </div>

        <nav aria-label="Seções do painel" className="flex lg:flex-col gap-1 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-1 lg:pb-0">
          {grupos.map((g, gi) => (
            <React.Fragment key={gi}>
              {g.titulo && (
                <p className="hidden lg:block px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                  {g.titulo}
                </p>
              )}
              {g.itens.map((i) => (
                <NavLink key={i.id} to={i.id ? `/painel/${i.id}` : "/painel"} end className={linkClasse}>
                  <i.icon className="w-4 h-4 shrink-0" />
                  {i.label}
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <Link
          to="/"
          className="hidden lg:inline-flex items-center gap-1.5 mt-6 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao site
        </Link>
      </aside>

      <section className="min-w-0">
        <Componente user={user} />
      </section>
    </div>
  );
}
