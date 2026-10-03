import React, { useState, useEffect, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageLoading, EmptyState } from "@/components/layout/Page";
import { norteens } from "@/api/norteensClient";
import PostCard from "@/components/community/PostCard";
import CreatePost from "@/components/community/CreatePost";
import PullToRefreshIndicator from "@/components/community/PullToRefreshIndicator";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { marcarMarco } from "@/utils/progresso";

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
    <PageContainer size="sm" {...containerProps}>
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} progress={progress} />

      <PageHeader
        eyebrow="Juntos é mais fácil"
        title="Comunidade"
        description="Compartilhe dúvidas e descobertas com outros jovens que também estão decidindo o futuro."
      />

      {user ? (
        <CreatePost user={user} onCreated={loadPosts} />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border">
          <div>
            <p className="font-heading font-semibold text-foreground">Quer participar da conversa?</p>
            <p className="text-sm text-muted-foreground mt-0.5">Entre na sua conta para publicar, curtir e comentar.</p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      )}

      <div className="space-y-5 mt-8">
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
    </PageContainer>
  );
}