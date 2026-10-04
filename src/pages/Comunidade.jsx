import React, { useState, useEffect, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MessagesSquare, HeartHandshake, ShieldCheck, Sparkles, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { norteens } from "@/api/norteensClient";
import PostCard from "@/components/community/PostCard";
import CreatePost from "@/components/community/CreatePost";
import PullToRefreshIndicator from "@/components/community/PullToRefreshIndicator";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { marcarMarco } from "@/utils/progresso";
import { isEquipe } from "@/utils/papeis";

const REGRAS = [
  { icon: HeartHandshake, titulo: "Seja gentil", texto: "Todo mundo aqui está tentando descobrir o próprio caminho." },
  { icon: ShieldCheck, titulo: "Cuide da sua privacidade", texto: "Não publique telefone, endereço ou documentos." },
  { icon: Sparkles, titulo: "Compartilhe o que aprendeu", texto: "Sua experiência pode ajudar alguém a decidir." },
];

export default function Comunidade() {
  const { user, setUser } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    try {
      setPosts(await norteens.listarPosts());
    } catch {
      /* mantém o que já estava na tela */
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    if (user && !user.marco_comunidade) {
      marcarMarco(user, setUser, "marco_comunidade");
    }
  }, [user, setUser]);

  const { pullDistance, refreshing, progress, containerProps } = usePullToRefresh(loadPosts);

  if (loading) return <PageLoading />;

  return (
    <div {...containerProps}>
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} progress={progress} />

      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Comunidade</p>
          <h1 className="mt-3 text-[2.4rem] sm:text-[3.25rem] font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance max-w-3xl">
            Ninguém precisa decidir{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">sozinho.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
            Tire dúvidas, conte suas descobertas e troque ideias com outros jovens que também estão escolhendo o futuro.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="min-w-0 max-w-2xl w-full mx-auto lg:mx-0">
          {user ? (
            <CreatePost user={user} onCreated={loadPosts} />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-soft">
              <div>
                <p className="font-heading font-bold text-foreground">Quer participar da conversa?</p>
                <p className="text-sm text-muted-foreground mt-0.5">Entre para publicar, curtir e comentar.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button asChild variant="outline"><Link to="/login">Entrar</Link></Button>
                <Button asChild><Link to="/register">Criar conta</Link></Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-10 mb-4">
            <h2 className="text-sm font-semibold text-foreground">Publicações recentes</h2>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <EmptyState
                icon={MessagesSquare}
                title="Nenhuma publicação ainda"
                description="Que tal ser a primeira pessoa a puxar assunto?"
              />
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} user={user} onUpdate={loadPosts} />)
            )}
          </div>
        </div>

        <aside className="hidden lg:block space-y-5 sticky top-8">
          <div className="rounded-2xl bg-card border border-border p-6">
            <h2 className="font-heading font-bold text-foreground">Combinados da comunidade</h2>
            <ul className="mt-5 space-y-4">
              {REGRAS.map((r) => (
                <li key={r.titulo} className="flex gap-3">
                  <span className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <r.icon className="w-4 h-4 text-foreground" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.titulo}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{r.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {!isEquipe(user) && !user?.teste_feito && (
            <Link
              to={user ? "/teste" : "/register"}
              className="group block rounded-2xl bg-[#0f2e26] text-[#f8f0e6] p-6 hover:bg-[#0b241d] transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-highlight/20 text-highlight flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </span>
              <p className="mt-4 font-heading font-bold">Ainda não fez o teste?</p>
              <p className="mt-1 text-sm text-[#f8f0e6]/70">Descubra seu perfil em 3 minutos e chegue aqui com mais clareza.</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight">
                Fazer o teste <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
