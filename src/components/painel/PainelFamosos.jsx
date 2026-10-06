import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Sparkles, Loader2, ImagePlus } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MobileDrawerSelect from "@/components/ui/MobileDrawerSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader, Lista, BotaoIcone, Campo } from "@/components/painel/ui";

const vazio = { nome: "", bio: "", profissao_id: "", foto_url: "", foto_credito: "" };

export default function PainelFamosos() {
  const { toast } = useToast();
  const [famosos, setFamosos] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  // profissao_id fica como texto no formulário: o seletor (Radix) só aceita valores em texto
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const arquivo = useRef(null);

  const enviarFoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviandoFoto(true);
    try {
      const url = await norteens.uploadImagem(file);
      setForm((f) => ({ ...f, foto_url: url }));
    } catch (err) {
      toast({ title: err.message || "Não foi possível enviar a foto.", variant: "destructive" });
    }
    setEnviandoFoto(false);
  };

  const load = async () => {
    try {
      const [f, p] = await Promise.all([norteens.listarFamosos(), norteens.listarProfissoes()]);
      setFamosos(f);
      setProfissoes(p);
    } catch (e) {
      toast({ title: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const abrirNovo = () => {
    setEditing(null);
    setForm(vazio);
    setDialogOpen(true);
  };

  const abrirEdicao = (f) => {
    setEditing(f);
    setForm({
      nome: f.nome || "", bio: f.bio || "", profissao_id: f.profissao_id ? String(f.profissao_id) : "",
      foto_url: f.foto_url || "", foto_credito: f.foto_credito || "",
    });
    setDialogOpen(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const payload = { ...form, profissao_id: form.profissao_id ? Number(form.profissao_id) : null };
    try {
      if (editing) {
        await norteens.editarFamoso(editing.id, payload);
        toast({ title: "Famoso atualizado!" });
      } else {
        await norteens.criarFamoso(payload);
        toast({ title: "Famoso publicado!" });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast({ title: err.message || "Não foi possível salvar.", variant: "destructive" });
    }
    setSalvando(false);
  };

  const apagar = async (f) => {
    if (!window.confirm(`Apagar "${f.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await norteens.apagarFamoso(f.id);
      toast({ title: "Famoso removido." });
      load();
    } catch (err) {
      toast({ title: err.message || "Não foi possível apagar.", variant: "destructive" });
    }
  };

  if (loading) return <PageLoading />;

  const profMap = Object.fromEntries(profissoes.map((p) => [p.id, p]));
  const semProfissoes = profissoes.length === 0;

  return (
    <div>
      <SecaoHeader
        titulo="Famosos"
        descricao="Pessoas que inspiram em cada profissão. Aparecem na página de famosos e na ficha da profissão."
        acoes={!semProfissoes && <Button onClick={abrirNovo}><Plus /> Novo famoso</Button>}
      />

      {semProfissoes ? (
        <EmptyState
          icon={Sparkles}
          title="Cadastre uma profissão primeiro"
          description="Todo famoso fica ligado a uma profissão."
          action={<Button asChild><Link to="/painel/profissoes">Ir para profissões</Link></Button>}
        />
      ) : famosos.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nenhum famoso ainda"
          description="Mostre aos alunos quem chegou longe em cada carreira."
          action={<Button onClick={abrirNovo}><Plus /> Cadastrar o primeiro</Button>}
        />
      ) : (
        <Lista cabecalho={<div className="grid grid-cols-[1fr_220px_80px] gap-4"><span>Nome</span><span>Profissão</span><span /></div>}>
          {famosos.map((f) => {
            const prof = profMap[f.profissao_id];
            return (
              <li key={f.id} className="px-5 py-4 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_220px_80px] gap-4 items-center">
                <div className="flex items-center gap-3 min-w-0">
                  {f.foto_url ? (
                    <img src={f.foto_url} alt="" className="w-10 h-10 rounded-full object-cover object-top shrink-0" />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-accent/15 text-accent font-semibold flex items-center justify-center shrink-0">
                      {f.nome?.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{f.nome}</p>
                    <p className="text-xs text-muted-foreground truncate">{f.bio || "Sem bio"}</p>
                  </div>
                </div>
                <span className="hidden md:block text-sm text-muted-foreground truncate">
                  {prof ? `${prof.icone || ""} ${prof.nome}` : "—"}
                </span>
                <div className="flex items-center justify-end gap-0.5">
                  <BotaoIcone label="Editar" onClick={() => abrirEdicao(f)}><Pencil className="w-4 h-4" /></BotaoIcone>
                  <BotaoIcone label="Apagar" perigo onClick={() => apagar(f)}><Trash2 className="w-4 h-4" /></BotaoIcone>
                </div>
              </li>
            );
          })}
        </Lista>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editing ? `Editar ${editing.nome}` : "Novo famoso"}</DialogTitle>
            <DialogDescription>Aparece para os alunos junto da profissão escolhida.</DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4 mt-2">
            <Campo label="Nome">
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </Campo>
            <Campo label="Profissão">
              <MobileDrawerSelect
                value={form.profissao_id}
                onValueChange={(v) => setForm({ ...form, profissao_id: v })}
                placeholder="Selecione a profissão"
                options={profissoes.map((p) => ({ value: String(p.id), label: `${p.icone || ""} ${p.nome}`.trim() }))}
              />
            </Campo>
            <Campo label="Bio" dica="Aparece no verso da carta. Algumas frases sobre a trajetória.">
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} />
            </Campo>

            {/* foto da frente da carta */}
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Foto da carta</span>
              <div className="flex items-center gap-4">
                <span className="w-16 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                  {form.foto_url ? <img src={form.foto_url} alt="" className="w-full h-full object-cover object-top" /> : "Sem foto"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={enviandoFoto} onClick={() => arquivo.current?.click()}>
                    {enviandoFoto ? <Loader2 className="animate-spin" /> : <ImagePlus />} {form.foto_url ? "Trocar foto" : "Enviar foto"}
                  </Button>
                  {form.foto_url && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, foto_url: "", foto_credito: "" })}>
                      Remover
                    </Button>
                  )}
                </div>
                <input ref={arquivo} type="file" accept="image/*" className="hidden" onChange={enviarFoto} />
              </div>
              <span className="block text-xs text-muted-foreground">
                Use só fotos que você pode usar: com licença livre (ex.: Wikimedia Commons) ou com autorização. Sem foto, a carta mostra as iniciais.
              </span>
            </div>
            {form.foto_url && (
              <Campo label="Crédito da foto" dica="Exigido pela maioria das licenças livres. Aparece pequeno no verso da carta.">
                <Input value={form.foto_credito} onChange={(e) => setForm({ ...form, foto_credito: e.target.value })} placeholder="Foto: Nome do autor · CC BY 4.0 · Wikimedia Commons" />
              </Campo>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvando}>
                {salvando && <Loader2 className="animate-spin" />}
                {editing ? "Salvar alterações" : "Publicar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
