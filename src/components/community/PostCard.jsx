import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";

export default function PostCard({ post, user, onUpdate }) {
  const [totalCurtidas, setTotalCurtidas] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  // autor já vem junto do post (via JOIN no servidor)
  const autor = {
    nome: post.autor_nome,
    apelido: post.autor_apelido,
    foto_url: post.autor_foto,
  };

  useEffect(() => {
    norteens.getCurtidas(post.id).then((c) => {
      setTotalCurtidas(c.total);
      setLiked(c.curtido);
    }).catch(() => {});
    norteens.getComentarios(post.id).then(setComentarios).catch(() => {});
  }, [post.id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const c = await norteens.curtir(post.id);
      setTotalCurtidas(c.total);
      setLiked(c.curtido);
    } catch { /* ignora */ }
  };

  const handleComment = async () => {
    if (!user || !novoComentario.trim()) return;
    setSendingComment(true);
    const texto = novoComentario.trim();
    setNovoComentario("");
    try {
      await norteens.comentar(post.id, texto);
      const updated = await norteens.getComentarios(post.id);
      setComentarios(updated);
    } catch { /* ignora */ } finally {
      setSendingComment(false);
    }
  };

  const handleDeleteComment = async (comentarioId) => {
    try {
      await norteens.apagarComentario(comentarioId);
      const updated = await norteens.getComentarios(post.id);
      setComentarios(updated);
    } catch { /* ignora */ }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja apagar este post?")) return;
    try {
      await norteens.apagarPost(post.id);
      onUpdate();
    } catch { /* ignora */ }
  };

  const isOwner = user && post.autor_id === user.id;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <UserAvatar user={autor} size="sm" />
          <div>
            <p className="font-semibold text-foreground text-sm">{autor.nome || autor.apelido || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{moment(post.criado_em).fromNow()}</p>
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
          {totalCurtidas > 0 && totalCurtidas}
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
            <CommentItem key={c.id} comentario={c} user={user} onDelete={handleDeleteComment} />
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

function CommentItem({ comentario, user, onDelete }) {
  const autor = {
    nome: comentario.autor_nome,
    apelido: comentario.autor_apelido,
    foto_url: comentario.autor_foto,
  };
  const isOwner = user && comentario.autor_id === user.id;

  return (
    <div className="bg-muted/50 rounded-xl px-4 py-3 flex gap-2.5 items-start">
      <UserAvatar user={autor} size="sm" />
      <div className="flex-1">
        <p className="text-xs font-medium text-foreground">{autor.nome || autor.apelido || "Usuário"}</p>
        <p className="text-sm text-muted-foreground mt-1">{comentario.texto}</p>
      </div>
      {isOwner && (
        <button onClick={() => onDelete(comentario.id)} className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}