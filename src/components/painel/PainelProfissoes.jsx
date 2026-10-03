import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Briefcase, ExternalLink, Loader2 } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader, Lista, BotaoIcone, GrupoForm, Campo } from "@/components/painel/ui";

const vazio = () => ({
  nome: "", icone: "", descricao: "", formacao: "", comportamentais: "", salario: "",
  tecnicas: "", regioes: "", ferramentas: "",
});
const paraLista = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function PainelProfissoes() {
  const { toast } = useToast();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(vazio());
  const [salvando, setSalvando] = useState(false);

  const load = async () => {
    try {
      setProfissoes(await norteens.listarProfissoes());
    } catch (e) {
      toast({ title: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const abrirNova = () => {
    setEditing(null);
    setForm(vazio());
    setDialogOpen(true);
  };

  const abrirEdicao = (p) => {
    setEditing(p);
    setForm({
      nome: p.nome || "", icone: p.icone || "", descricao: p.descricao || "", formacao: p.formacao || "",
      comportamentais: p.comportamentais || "", salario: p.salario || "",
      tecnicas: (p.tecnicas || []).join(", "), regioes: (p.regioes || []).join(", "),
      ferramentas: (p.ferramentas || []).join(", "),
    });
    setDialogOpen(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const payload = {
      ...form,
      tecnicas: paraLista(form.tecnicas),
      regioes: paraLista(form.regioes),
      ferramentas: paraLista(form.ferramentas),
    };
    try {
      if (editing) {
        await norteens.editarProfissao(editing.id, payload);
        toast({ title: "Profissão atualizada!" });
      } else {
        await norteens.criarProfissao(payload);
        toast({ title: "Profissão publicada!" });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast({ title: err.message || "Não foi possível salvar.", variant: "destructive" });
    }
    setSalvando(false);
  };

  const apagar = async (p) => {
    const ok = window.confirm(
      `Apagar "${p.nome}"?\n\nOs famosos ligados a ela também serão removidos. Esta ação não pode ser desfeita.`
    );
    if (!ok) return;
    try {
      await norteens.apagarProfissao(p.id);
      toast({ title: "Profissão removida." });
      load();
    } catch (err) {
      toast({ title: err.message || "Não foi possível apagar.", variant: "destructive" });
    }
  };

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const filtradas = profissoes.filter((p) => p.nome?.toLowerCase().includes(busca.toLowerCase()));

  if (loading) return <PageLoading />;

  return (
    <div>
      <SecaoHeader
        titulo="Profissões"
        descricao="As fichas que os alunos veem no guia vocacional. Quanto mais completa, melhor."
        acoes={<Button onClick={abrirNova}><Plus /> Nova profissão</Button>}
      />

      {profissoes.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Nenhuma profissão ainda"
          description="Comece cadastrando a primeira ficha do guia vocacional."
          action={<Button onClick={abrirNova}><Plus /> Cadastrar a primeira</Button>}
        />
      ) : (
        <>
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar profissão..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
          </div>
          <Lista cabecalho={<div className="grid grid-cols-[1fr_180px_120px_96px] gap-4"><span>Profissão</span><span>Salário</span><span>Ficha</span><span /></div>}>
            {filtradas.map((p) => {
              const partes = [p.descricao, p.formacao, p.comportamentais, p.salario, p.tecnicas?.length].filter(Boolean).length;
              return (
                <li key={p.id} className="px-5 py-4 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_180px_120px_96px] gap-4 items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">{p.icone || "💼"}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{p.nome}</p>
                      <p className="text-xs text-muted-foreground truncate md:hidden">{p.salario || "Sem salário informado"}</p>
                    </div>
                  </div>
                  <span className="hidden md:block text-sm text-muted-foreground truncate">{p.salario || "—"}</span>
                  <span className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                      <span className="block h-full bg-secondary rounded-full" style={{ width: `${(partes / 5) * 100}%` }} />
                    </span>
                    {partes}/5
                  </span>
                  <div className="flex items-center justify-end gap-0.5">
                    <Link to={`/profissoes/${p.id}`} target="_blank" title="Ver como aluno" className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <BotaoIcone label="Editar" onClick={() => abrirEdicao(p)}><Pencil className="w-4 h-4" /></BotaoIcone>
                    <BotaoIcone label="Apagar" perigo onClick={() => apagar(p)}><Trash2 className="w-4 h-4" /></BotaoIcone>
                  </div>
                </li>
              );
            })}
            {filtradas.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">Nada encontrado para “{busca}”.</li>
            )}
          </Lista>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editing ? `Editar ${editing.nome}` : "Nova profissão"}</DialogTitle>
            <DialogDescription>Os campos aparecem na ficha pública da profissão.</DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-7 mt-2">
            <GrupoForm titulo="Identificação">
              <div className="grid grid-cols-[1fr_120px] gap-4">
                <Campo label="Nome"><Input value={form.nome} onChange={set("nome")} required placeholder="Ex: Engenharia Civil" /></Campo>
                <Campo label="Ícone"><Input value={form.icone} onChange={set("icone")} placeholder="🏗️" className="text-center text-lg" /></Campo>
              </div>
              <Campo label="Faixa salarial"><Input value={form.salario} onChange={set("salario")} placeholder="Ex: R$ 4.000 a R$ 12.000" /></Campo>
            </GrupoForm>

            <GrupoForm titulo="Sobre a carreira">
              <Campo label="Descrição" dica="O que a pessoa faz no dia a dia.">
                <Textarea value={form.descricao} onChange={set("descricao")} rows={4} />
              </Campo>
              <div className="grid sm:grid-cols-2 gap-4">
                <Campo label="Formação"><Textarea value={form.formacao} onChange={set("formacao")} rows={4} /></Campo>
                <Campo label="Competências comportamentais"><Textarea value={form.comportamentais} onChange={set("comportamentais")} rows={4} /></Campo>
              </div>
            </GrupoForm>

            <GrupoForm titulo="Detalhes (separe por vírgula)">
              <Campo label="Técnicas"><Input value={form.tecnicas} onChange={set("tecnicas")} placeholder="Cálculo estrutural, AutoCAD, ..." /></Campo>
              <div className="grid sm:grid-cols-2 gap-4">
                <Campo label="Onde há vagas"><Input value={form.regioes} onChange={set("regioes")} placeholder="Sudeste, Sul, ..." /></Campo>
                <Campo label="Ferramentas"><Input value={form.ferramentas} onChange={set("ferramentas")} placeholder="Revit, Excel, ..." /></Campo>
              </div>
            </GrupoForm>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvando}>
                {salvando && <Loader2 className="animate-spin" />}
                {editing ? "Salvar alterações" : "Publicar profissão"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
