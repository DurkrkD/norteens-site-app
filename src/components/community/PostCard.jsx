import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, MessageCircle, Trash2, SendHorizontal } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import UserAvatar from "@/components/UserAvatar";
import { isAdmin } from "@/utils/papeis";

const haQuanto = (data) => formatDistanceToNow(new Date(data), { addSuffix: true, locale: ptBR });

export default function PostCard({ post, user, onUpdate }) {
  const [totalCurtidas, setTotalCurtidas] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  // autor já vem junto do post (via JOIN no servidor)
  const autor = { nome: post.autor_nome, apelido: post.autor_apelido, foto_url: post.autor_foto };

  useEffect(() => {
    norteens
      .getCurtidas(post.id)
      .then((c) => {
        setTotalCurtidas(c.total);
        setLiked(c.curtido);
      })
      .catch(() => {});
    norteens.getComentarios(post.id).then(setComentarios).catch(() => {});
  }, [post.id]);

  const handleLike = async () => {
    if (!user) return;
    // atualiza na hora e confirma com o servidor
    setLiked(!liked);
    setTotalCurtidas((t) => t + (liked ? -1 : 1));
    try {
      const c = await norteens.curtir(post.id);
      setTotalCurtidas(c.total);
      setLiked(c.curtido);
    } catch {
      setLiked(liked);
      setTotalCurtidas((t) => t + (liked ? 1 : -1));
    }
  };

  const handleComment = async (e) => {
    e?.preventDefault();
    if (!user || !novoComentario.trim()) return;
    setSendingComment(true);
    const texto = novoComentario.trim();
    setNovoComentario("");
    try {
      await norteens.comentar(post.id, texto);
      setComentarios(await norteens.getComentarios(post.id));
    } catch {
      setNovoComentario(texto);
    }
    setSendingComment(false);
  };

  const handleDeleteComment = async (comentarioId) => {
    try {
      await norteens.apagarComentario(comentarioId);
      setComentarios(await norteens.getComentarios(post.id));
    } catch { /* ignora */ }
  };

  const isOwner = user && post.autor_id === user.id;
  // o admin modera: apaga posts e comentários de qualquer pessoa
  const admin = isAdmin(user);
  const podeApagar = isOwner || admin;

  const handleDelete = async () => {
    const pergunta = isOwner
      ? "Tem certeza que deseja apagar este post?"
      : `Apagar o post de ${autor.nome || autor.apelido || "este usuário"}? Esta ação não pode ser desfeita.`;
    if (!window.confirm(pergunta)) return;
    try {
      await norteens.apagarPost(post.id);
      onUpdate();
    } catch { /* ignora */ }
  };
  const acao = "inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-colors";

  return (
    <article className="rounded-2xl bg-card border border-border">
      <div className="p-4 sm:p-5">
        <header className="flex items-start gap-3">
          <UserAvatar user={autor} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-[15px] leading-tight">{autor.nome || autor.apelido || "Usuário"}</p>
            <time dateTime={post.criado_em} className="text-xs text-muted-foreground">{haQuanto(post.criado_em)}</time>
          </div>
          {podeApagar && (
            <button
              onClick={handleDelete}
              aria-label="Apagar post"
              title={isOwner ? "Apagar post" : "Apagar post (moderação)"}
              className="p-2 -mr-2 -mt-1 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </header>

        <p className="mt-3 text-[15px] text-foreground leading-relaxed whitespace-pre-line break-words">{post.texto}</p>
        {post.imagem && (
          <img src={post.imagem} alt="" loading="lazy" className="mt-4 rounded-xl border border-border max-h-[480px] w-full object-cover" />
        )}
      </div>

      <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 border-t border-border">
        <button
          onClick={handleLike}
          disabled={!user}
          aria-pressed={liked}
          title={user ? undefined : "Entre para curtir"}
          className={`${acao} ${liked ? "text-accent" : "text-muted-foreground"} ${user ? "hover:bg-accent/10 hover:text-accent" : "cursor-default"}`}
        >
          <Heart className={`w-[18px] h-[18px] ${liked ? "fill-current" : ""}`} />
          {totalCurtidas > 0 ? totalCurtidas : "Curtir"}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          aria-expanded={showComments}
          className={`${acao} text-muted-foreground hover:bg-muted hover:text-foreground`}
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          {comentarios.length > 0
            ? `${comentarios.length} ${comentarios.length === 1 ? "comentário" : "comentários"}`
            : "Comentar"}
        </button>
      </div>

      {showComments && (
        <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-border bg-muted/30 rounded-b-2xl space-y-3">
          {comentarios.map((c) => (
            <CommentItem key={c.id} comentario={c} user={user} onDelete={handleDeleteComment} />
          ))}
          {comentarios.length === 0 && <p className="text-sm text-muted-foreground">Ninguém comentou ainda.</p>}
          {user ? (
            <form onSubmit={handleComment} className="flex items-center gap-2 pt-1">
              <UserAvatar user={user} size="sm" />
              <div className="relative flex-1">
                <input
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Escreva um comentário..."
                  aria-label="Escreva um comentário"
                  className="w-full h-10 pl-4 pr-11 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <button
                  type="submit"
                  disabled={sendingComment || !novoComentario.trim()}
                  aria-label="Enviar comentário"
                  className="absolute right-1 top-1 w-8 h-8 rounded-full flex items-center justify-center text-primary disabled:text-muted-foreground hover:bg-muted"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Entre na sua conta para comentar.</p>
          )}
        </div>
      )}
    </article>
  );
}

function CommentItem({ comentario, user, onDelete }) {
  const autor = { nome: comentario.autor_nome, apelido: comentario.autor_apelido, foto_url: comentario.autor_foto };
  const isOwner = user && comentario.autor_id === user.id;
  const podeApagar = isOwner || isAdmin(user);

  return (
    <div className="group flex gap-2.5 items-start">
      <UserAvatar user={autor} size="sm" />
      <div className="flex-1 min-w-0 rounded-2xl rounded-tl-md bg-card border border-border px-3.5 py-2.5">
        <div className="flex items-baseline gap-2">
          <p className="text-[13px] font-semibold text-foreground">{autor.nome || autor.apelido || "Usuário"}</p>
          {comentario.criado_em && <span className="text-[11px] text-muted-foreground">{haQuanto(comentario.criado_em)}</span>}
        </div>
        <p className="text-sm text-foreground/85 mt-0.5 break-words">{comentario.texto}</p>
      </div>
      {podeApagar && (
        <button
          onClick={() => onDelete(comentario.id)}
          aria-label="Apagar comentário"
          className="p-1.5 mt-1 rounded-full text-muted-foreground sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:text-destructive transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
