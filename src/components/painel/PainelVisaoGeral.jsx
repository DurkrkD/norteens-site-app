import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Sparkles, MessageSquareHeart, Users, ClipboardCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/layout/Page";
import { StatCard } from "@/components/painel/ui";
import { isAdmin } from "@/utils/papeis";

// uma ficha está completa quando tem descrição, formação, competências e salário
const fichaCompleta = (p) => p.descricao && p.formacao && p.comportamentais && p.salario;

export default function PainelVisaoGeral({ user }) {
  const admin = isAdmin(user);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    Promise.all([
      norteens.listarProfissoes(),
      norteens.listarFamosos(),
      norteens.listarFeedbacksAdmin(),
      admin ? norteens.listarUsuarios() : Promise.resolve([]),
    ])
      .then(([profissoes, famosos, feedbacks, usuarios]) => setDados({ profissoes, famosos, feedbacks, usuarios }))
      .catch(() => setDados({ profissoes: [], famosos: [], feedbacks: [], usuarios: [] }));
  }, [admin]);

  if (!dados) return <PageLoading />;

  const { profissoes, famosos, feedbacks, usuarios } = dados;
  const incompletas = profissoes.filter((p) => !fichaCompleta(p));
  const alunos = usuarios.filter((u) => u.papel === "usuario");
  const testesFeitos = alunos.filter((u) => u.teste_feito).length;
  const publicos = feedbacks.filter((f) => f.autorizar_exibicao).length;

  const pendencias = [
    profissoes.length === 0 && { texto: "Nenhuma profissão publicada: o guia vocacional está vazio.", to: "/painel/profissoes" },
    incompletas.length > 0 && {
      texto: `${incompletas.length} ${incompletas.length === 1 ? "ficha incompleta" : "fichas incompletas"} (sem descrição, formação, competências ou salário).`,
      to: "/painel/profissoes",
    },
    profissoes.length > 0 && famosos.length === 0 && { texto: "Nenhum famoso cadastrado ainda.", to: "/painel/famosos" },
  ].filter(Boolean);

  const primeiroNome = (user.nome || user.apelido || "").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Olá{primeiroNome ? `, ${primeiroNome}` : ""}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Um resumo da plataforma hoje.</p>
      </div>

      <div className={`grid gap-3 sm:gap-4 grid-cols-2 ${admin ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
        <StatCard icon={Briefcase} label="Profissões" valor={profissoes.length}
          detalhe={profissoes.length ? `${profissoes.length - incompletas.length} com ficha completa` : "Nenhuma publicada"}
          cor="bg-primary/10 text-primary" />
        <StatCard icon={Sparkles} label="Famosos" valor={famosos.length} detalhe="Ligados às profissões" cor="bg-accent/15 text-accent" />
        <StatCard icon={MessageSquareHeart} label="Feedbacks" valor={feedbacks.length}
          detalhe={`${publicos} ${publicos === 1 ? "autorizado" : "autorizados"} para a página inicial`}
          cor="bg-highlight/25 text-[#8a5a12]" />
        {admin && (
          <StatCard icon={Users} label="Alunos" valor={alunos.length}
            detalhe={`${testesFeitos} ${testesFeitos === 1 ? "fez" : "fizeram"} o teste`} cor="bg-secondary/15 text-secondary" />
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <section className="rounded-2xl bg-card border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Feedbacks recentes</h2>
            <Link to="/painel/feedbacks" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {feedbacks.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhum feedback ainda.</p>
          ) : (
            <ul className="divide-y divide-border">
              {feedbacks.slice(0, 4).map((f) => (
                <li key={f.id} className="px-5 py-4">
                  <p className="text-sm text-foreground line-clamp-2">“{f.texto}”</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {f.autor_nome || "Usuário"} · {new Date(f.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3">Precisa de atenção</h2>
            {pendencias.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> Tudo em dia por aqui.
              </p>
            ) : (
              <ul className="space-y-2">
                {pendencias.map((p) => (
                  <li key={p.texto}>
                    <Link to={p.to} className="flex gap-2.5 p-3 rounded-xl bg-highlight/10 hover:bg-highlight/20 transition-colors text-sm text-foreground">
                      <AlertCircle className="w-4 h-4 text-[#8a5a12] shrink-0 mt-0.5" />
                      {p.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-[#0f2e26] text-[#f8f0e6] p-5">
            <h2 className="font-semibold text-[#f8f0e6] mb-1">Ações rápidas</h2>
            <p className="text-xs text-[#f8f0e6]/65 mb-4">O que você mais faz por aqui.</p>
            <div className="grid gap-2">
              <Button asChild className="justify-between bg-[#f8f0e6] text-[#0f2e26] hover:bg-white">
                <Link to="/painel/profissoes">Gerenciar profissões <Briefcase /></Link>
              </Button>
              <Button asChild variant="ghost" className="justify-between text-[#f8f0e6] hover:bg-white/10 hover:text-[#f8f0e6]">
                <Link to="/painel/famosos">Gerenciar famosos <Sparkles /></Link>
              </Button>
              <Button asChild variant="ghost" className="justify-between text-[#f8f0e6] hover:bg-white/10 hover:text-[#f8f0e6]">
                <Link to="/painel/perguntas">Ver perguntas do teste <ClipboardCheck /></Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
