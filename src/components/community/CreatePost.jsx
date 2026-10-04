import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import UserAvatar from "@/components/UserAvatar";

const LIMITE = 1000;

export default function CreatePost({ user, onCreated }) {
  const { toast } = useToast();
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const campo = useRef(null);

  // o campo cresce conforme o texto, até um limite
  const digitar = (e) => {
    setTexto(e.target.value.slice(0, LIMITE));
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 320)}px`;
  };

  const publicar = async () => {
    if (!texto.trim() || sending) return;
    setSending(true);
    try {
      await norteens.criarPost(texto.trim(), imagem || undefined);
      setTexto("");
      setImagem("");
      if (campo.current) campo.current.style.height = "auto";
      onCreated();
    } catch (err) {
      // o texto continua no campo para a pessoa tentar de novo
      toast({ title: "Não foi possível publicar", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  const enviarImagem = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      setImagem(await norteens.uploadImagem(file));
    } catch (err) {
      toast({ title: "Não foi possível enviar a imagem", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft">
      <div className="flex gap-3 p-4 sm:p-5">
        <UserAvatar user={user} size="md" />
        <div className="flex-1 min-w-0">
          <textarea
            ref={campo}
            rows={2}
            value={texto}
            onChange={digitar}
            onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && publicar()}
            placeholder="Compartilhe uma dúvida, descoberta ou conquista..."
            aria-label="Escreva sua publicação"
            className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none pt-1.5 leading-relaxed"
          />
          {imagem && (
            <div className="relative mt-3 inline-block">
              <img src={imagem} alt="Imagem anexada" className="rounded-xl max-h-60 border border-border object-cover" />
              <button
                onClick={() => setImagem("")}
                aria-label="Remover imagem"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border">
        <label
          className={`inline-flex items-center gap-2 h-9 px-3 rounded-full text-sm font-medium text-muted-foreground transition-colors ${
            uploading ? "opacity-60" : "cursor-pointer hover:bg-muted hover:text-foreground"
          }`}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? "Enviando..." : "Imagem"}
          <input type="file" accept="image/*" onChange={enviarImagem} className="hidden" disabled={uploading} />
        </label>
        <div className="flex items-center gap-3">
          {texto.length > LIMITE * 0.8 && (
            <span className={`text-xs tabular-nums ${texto.length >= LIMITE ? "text-destructive" : "text-muted-foreground"}`}>
              {texto.length}/{LIMITE}
            </span>
          )}
          <Button onClick={publicar} disabled={sending || uploading || !texto.trim()}>
            {sending && <Loader2 className="animate-spin" />}
            Publicar
          </Button>
        </div>
      </div>
    </div>
  );
}
