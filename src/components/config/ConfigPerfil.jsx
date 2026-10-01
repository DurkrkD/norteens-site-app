import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import UserAvatar from "@/components/UserAvatar";
import { Camera, Loader2 } from "lucide-react";

export default function ConfigPerfil() {
  const { user, setUser } = useOutletContext();
  const { toast } = useToast();
  const [form, setForm] = useState({
    nome: user?.nome || user?.full_name || "",
    apelido: user?.apelido || "",
    bio: user?.bio || "",
    serie_idade: user?.serie_idade || "",
    cidade: user?.cidade || "",
    foto_url: user?.foto_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await norteens.uploadImagem(file);
      setForm((prev) => ({ ...prev, foto_url: url }));
      const atualizado = await norteens.updateMe({ foto_url: url });
      setUser(atualizado);
      toast({ title: "Foto atualizada com sucesso!" });
    } catch {
      toast({ title: "Erro ao enviar foto.", variant: "destructive" });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const atualizado = await norteens.updateMe({
        nome: form.nome.trim(),
        apelido: form.apelido.trim(),
        bio: form.bio.trim(),
        serie_idade: form.serie_idade.trim(),
        cidade: form.cidade.trim(),
        foto_url: form.foto_url,
      });
      setUser(atualizado);
      toast({ title: "Perfil salvo com sucesso!" });
    } catch {
      toast({ title: "Erro ao salvar perfil.", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
        Meu Perfil
      </h2>

      {/* Photo */}
      <div className="flex items-center gap-4 mb-6">
        <UserAvatar user={{ ...user, ...form }} size="lg" />
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            <Camera className="w-4 h-4" />
            {uploading ? "Enviando..." : "Trocar foto"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {form.foto_url && (
            <button
              onClick={async () => {
                setForm((prev) => ({ ...prev, foto_url: "" }));
                const atualizado = await norteens.updateMe({ foto_url: "" });
                setUser(atualizado);
              }}
              className="ml-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Remover
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Seu nome"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="apelido">Apelido</Label>
          <Input
            id="apelido"
            value={form.apelido}
            onChange={(e) => setForm({ ...form, apelido: e.target.value })}
            placeholder="Como gostaria de ser chamado"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Conte um pouco sobre você..."
            className="mt-1.5 min-h-[100px] resize-y"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="serie_idade">Série / Idade (opcional)</Label>
            <Input
              id="serie_idade"
              value={form.serie_idade}
              onChange={(e) => setForm({ ...form, serie_idade: e.target.value })}
              placeholder="Ex: 3º ano do EM / 17 anos"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade (opcional)</Label>
            <Input
              id="cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              placeholder="Sua cidade"
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="mt-6">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </div>
  );
}