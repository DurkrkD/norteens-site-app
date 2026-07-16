import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ConfigProfissoes({ user }) {
  const { toast } = useToast();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const isDono = user.papel === "dono";

  function emptyForm() {
    return { nome: "", icone: "", descricao: "", formacao: "", comportamentais: "", salario: "", tecnicas: "", regioes: "", ferramentas: "" };
  }

  const load = async () => {
    let data;
    if (isDono) {
      data = await base44.entities.Profissao.list();
    } else {
      data = user.profissao_atribuida
        ? [await base44.entities.Profissao.get(user.profissao_atribuida)]
        : [];
    }
    setProfissoes(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      nome: p.nome || "",
      icone: p.icone || "",
      descricao: p.descricao || "",
      formacao: p.formacao || "",
      comportamentais: p.comportamentais || "",
      salario: p.salario || "",
      tecnicas: (p.tecnicas || []).join(", "),
      regioes: (p.regioes || []).join(", "),
      ferramentas: (p.ferramentas || []).join(", "),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      nome: form.nome,
      icone: form.icone,
      descricao: form.descricao,
      formacao: form.formacao,
      comportamentais: form.comportamentais,
      salario: form.salario,
      tecnicas: form.tecnicas.split(",").map((s) => s.trim()).filter(Boolean),
      regioes: form.regioes.split(",").map((s) => s.trim()).filter(Boolean),
      ferramentas: form.ferramentas.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editing) {
      await base44.entities.Profissao.update(editing.id, payload);
      toast({ title: "Profissão atualizada!" });
    } else {
      await base44.entities.Profissao.create(payload);
      toast({ title: "Profissão criada!" });
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.Profissao.delete(id);
    toast({ title: "Profissão removida." });
    load();
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Profissões</h2>
        {isDono && (
          <Button onClick={openNew} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Nova
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {profissoes.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.icone || "💼"}</span>
              <span className="font-medium text-foreground">{p.nome}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              {isDono && (
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Editar Profissão" : "Nova Profissão"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div><Label>Ícone (emoji)</Label><Input value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} /></div>
            </div>
            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} /></div>
            <div><Label>Formação</Label><Textarea value={form.formacao} onChange={(e) => setForm({ ...form, formacao: e.target.value })} rows={3} /></div>
            <div><Label>Competências Comportamentais</Label><Textarea value={form.comportamentais} onChange={(e) => setForm({ ...form, comportamentais: e.target.value })} rows={3} /></div>
            <div><Label>Salário</Label><Input value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} /></div>
            <div><Label>Técnicas (separadas por vírgula)</Label><Input value={form.tecnicas} onChange={(e) => setForm({ ...form, tecnicas: e.target.value })} /></div>
            <div><Label>Regiões (separadas por vírgula)</Label><Input value={form.regioes} onChange={(e) => setForm({ ...form, regioes: e.target.value })} /></div>
            <div><Label>Ferramentas (separadas por vírgula)</Label><Input value={form.ferramentas} onChange={(e) => setForm({ ...form, ferramentas: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}