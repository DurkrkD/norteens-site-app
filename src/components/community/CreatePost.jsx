import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Send } from "lucide-react";

export default function CreatePost({ user, onCreated }) {
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState("");
  const [sending, setSending] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async () => {
    if (!texto.trim()) return;
    setSending(true);

    // Optimistic: create a temp post object so it appears immediately
    const tempId = `optimistic-${Date.now()}`;
    const optimisticPost = {
      id: tempId,
      autor: user.id,
      texto: texto.trim(),
      imagem: imagem.trim() || undefined,
      criado_em: new Date().toISOString(),
      _optimistic: true,
    };
    onCreated(optimisticPost);

    setTexto("");
    setImagem("");
    setShowImageInput(false);

   try {
      await norteens.criarPost(optimisticPost.texto, optimisticPost.imagem);
    } finally {
      setSending(false);
      onCreated(); // sincroniza com o servidor, substituindo o post temporário
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImagem(file_url);
  };
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <Textarea
        placeholder="O que você quer compartilhar?"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        className="resize-none border-0 bg-transparent focus-visible:ring-0 p-0 text-foreground placeholder:text-muted-foreground"
      />
      {imagem && (
        <div className="mt-3 relative">
          <img src={imagem} alt="" className="rounded-xl max-h-48 object-cover" />
          <button onClick={() => setImagem("")} className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
        </div>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div>
          <label className="cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-1 text-sm text-muted-foreground">
            <ImagePlus className="w-4 h-4" /> Imagem
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <Button onClick={handleSubmit} disabled={sending || !texto.trim()} size="sm" className="bg-primary hover:bg-primary/90">
          {sending ? "Publicando..." : <><Send className="w-4 h-4 mr-1" /> Publicar</>}
        </Button>
      </div>
    </div>
  )
};