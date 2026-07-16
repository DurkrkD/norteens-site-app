import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ConfigPerguntas() {
  const { toast } = useToast();
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ enunciado: "", lado_esquerdo: "", lado_direito: "", ordem: 1 });

  const load = async () => {
    const data = await base44.entities.Pergunta.list("ordem");
    setPerguntas(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ enunciado: "", lado_esquerdo: "", lado_direito: "", ordem: perguntas.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ enunciado: p.enunciado, lado_esquerdo: p.lado_esquerdo, lado_direito: p.lado_direito, ordem: p.ordem });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await base44.entities.Pergunta.update(editing.id, form);
      toast({ title: "Pergunta atualizada!" });
    } else {
      await base44.entities.Pergunta.create(form);
      toast({ title: "Pergunta criada!" });
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.Pergunta.delete(id);
    toast({ title: "Pergunta removida." });
    load();
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Perguntas do Teste</h2>
        <Button onClick={openNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Nova</Button>
      </div>

      <div className="space-y-3">
        {perguntas.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.ordem}. {p.enunciado}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.lado_esquerdo} ←→ {p.lado_direito}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading">{editing ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Enunciado</Label><Input value={form.enunciado} onChange={(e) => setForm({ ...form, enunciado: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Lado Esquerdo</Label><Input value={form.lado_esquerdo} onChange={(e) => setForm({ ...form, lado_esquerdo: e.target.value })} /></div>
              <div><Label>Lado Direito</Label><Input value={form.lado_direito} onChange={(e) => setForm({ ...form, lado_direito: e.target.value })} /></div>
            </div>
            <div><Label>Ordem</Label><Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} /></div>
            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}