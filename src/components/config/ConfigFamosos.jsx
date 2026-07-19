import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MobileDrawerSelect from "@/components/ui/MobileDrawerSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ConfigFamosos() {
  const { toast } = useToast();
  const [famosos, setFamosos] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: "", bio: "", profissao: "" });

  const load = async () => {
    const [f, p] = await Promise.all([
      base44.entities.Famoso.list(),
      base44.entities.Profissao.list(),
    ]);
    setFamosos(f);
    setProfissoes(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ nome: "", bio: "", profissao: "" });
    setDialogOpen(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({ nome: f.nome || "", bio: f.bio || "", profissao: f.profissao || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await base44.entities.Famoso.update(editing.id, form);
      toast({ title: "Famoso atualizado!" });
    } else {
      await base44.entities.Famoso.create(form);
      toast({ title: "Famoso criado!" });
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.Famoso.delete(id);
    toast({ title: "Famoso removido." });
    load();
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;

  const profMap = {};
  profissoes.forEach((p) => (profMap[p.id] = p));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Famosos</h2>
        <Button onClick={openNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Novo</Button>
      </div>

      <div className="space-y-3">
        {famosos.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
            <div>
              <p className="font-medium text-foreground">{f.nome}</p>
              {profMap[f.profissao] && <p className="text-xs text-muted-foreground">{profMap[f.profissao].icone} {profMap[f.profissao].nome}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(f)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(f.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">{editing ? "Editar Famoso" : "Novo Famoso"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
            <div>
              <Label>Profissão</Label>
              <MobileDrawerSelect
                value={form.profissao}
                onValueChange={(v) => setForm({ ...form, profissao: v })}
                placeholder="Selecione"
                options={profissoes.map((p) => ({ value: p.id, label: `${p.icone} ${p.nome}` }))}
              />
            </div>
            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}