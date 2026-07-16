import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";

export default function PostCard({ post, user, onUpdate }) {
  const [autor, setAutor] = useState(null);
  const [curtidas, setCurtidas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    base44.entities.User.get(post.autor).then(setAutor).catch(() => {});
    base44.entities.Curtida.filter({ post: post.id }).then(setCurtidas);
    base44.entities.Comentario.filter({ post: post.id }, "criado_em").then(setComentarios);
  }, [post.id, post.autor]);

  const liked = user && curtidas.some((c) => c.usuario === user.id);

  const handleLike = async () => {
    if (!user) return;
    const wasLiked = liked;
    const prevCurtidas = curtidas;

    // Optimistic update — toggle heart immediately
    if (wasLiked) {
      setCurtidas(curtidas.filter((c) => c.usuario !== user.id));
    } else {
      setCurtidas([...curtidas, { id: "optimistic", usuario: user.id, post: post.id }]);
    }

    try {
      if (wasLiked) {
        const mine = prevCurtidas.find((c) => c.usuario === user.id);
        if (mine) await base44.entities.Curtida.delete(mine.id);
      } else {
        await base44.entities.Curtida.create({ usuario: user.id, post: post.id });
      }
      // Sync with server after the call completes
      const updated = await base44.entities.Curtida.filter({ post: post.id });
      setCurtidas(updated);
    } catch {
      // Revert on failure
      setCurtidas(prevCurtidas);
    }
  };

  const handleComment = async () => {
    if (!user || !novoComentario.trim()) return;

    // Optimistic: append comment immediately
    const tempComment = {
      id: `optimistic-${Date.now()}`,
      autor: user.id,
      post: post.id,
      texto: novoComentario.trim(),
      criado_em: new Date().toISOString(),
      _optimistic: true,
    };
    setComentarios((prev) => [...prev, tempComment]);
    const commentText = novoComentario.trim();
    setNovoComentario("");

    try {
      await base44.entities.Comentario.create({
        autor: user.id,
        post: post.id,
        texto: commentText,
        criado_em: tempComment.criado_em,
      });
      const updated = await base44.entities.Comentario.filter({ post: post.id }, "criado_em");
      setComentarios(updated);
    } catch {
      // Revert on failure
      setComentarios((prev) => prev.filter((c) => c.id !== tempComment.id));
    } finally {
      setSendingComment(false);
    }
  };

  const handleDelete = async () => {
    await base44.entities.Post.delete(post.id);
    onUpdate();
  };

  const isOwner = user && post.autor === user.id;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <UserAvatar user={autor} size="sm" />
          <div>
            <p className="font-semibold text-foreground text-sm">{autor?.nome || autor?.apelido || autor?.full_name || autor?.email || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{moment(post.criado_em || post.created_date).fromNow()}</p>
          </div>
        </div>
        {isOwner && (
          <button onClick={handleDelete} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-foreground whitespace-pre-line mb-4">{post.texto}</p>
      {post.imagem && (
        <img src={post.imagem} alt="" className="rounded-xl max-h-80 w-full object-cover mb-4" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          {curtidas.length > 0 && curtidas.length}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {comentarios.length > 0 && comentarios.length}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3">
          {comentarios.map((c) => (
            <CommentItem key={c.id} comentario={c} />
          ))}
          {user && (
            <div className="flex gap-2">
              <Input
                placeholder="Escreva um comentário..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                className="text-sm"
              />
              <Button size="sm" onClick={handleComment} disabled={sendingComment || !novoComentario.trim()} variant="outline">
                Enviar
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comentario }) {
  const [autor, setAutor] = useState(null);
  useEffect(() => {
    base44.entities.User.get(comentario.autor).then(setAutor).catch(() => {});
  }, [comentario.autor]);

  return (
    <div className="bg-muted/50 rounded-xl px-4 py-3 flex gap-2.5">
      <UserAvatar user={autor} size="sm" />
      <div>
        <p className="text-xs font-medium text-foreground">{autor?.nome || autor?.apelido || autor?.full_name || autor?.email || "Usuário"}</p>
        <p className="text-sm text-muted-foreground mt-1">{comentario.texto}</p>
      </div>
    </div>
  );
}