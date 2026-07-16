import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
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
    const data = await base44.entities.Post.list("-criado_em", 50);
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    if (user && !user.marco_comunidade) {
      marcarMarco(user, setUser, "marco_comunidade");
    }
  }, [user, setUser]);

  const { pullDistance, refreshing, progress, containerProps } = usePullToRefresh(loadPosts);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12" {...containerProps}>
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} progress={progress} />

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-accent mb-2">Comunidade</h1>
      <p className="text-muted-foreground mb-8">Compartilhe experiências e conecte-se com outros estudantes.</p>

      {user && <CreatePost user={user} onCreated={loadPosts} />}

      <div className="space-y-6 mt-8">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhuma publicação ainda. Seja o primeiro!</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} user={user} onUpdate={loadPosts} />
          ))
        )}
      </div>
    </div>
  );
}