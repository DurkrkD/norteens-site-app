import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Gift, Eye, EyeOff, Sparkles, Users, Copy, Download, Trash2, Loader2, ExternalLink, Inbox } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader, Lista, BotaoIcone, GrupoForm, Campo } from "@/components/painel/ui";
import { esquecerOfertas } from "@/components/ofertas/useOfertas";

const linhas = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const QUEM = { estudante: "Estudante", responsavel: "Responsável" };

export default function PainelOfertas() {
  const { toast } = useToast();
  const [aba, setAba] = useState("planos");
  const [ofertas, setOfertas] = useState(null);
  const [interesses, setInteresses] = useState(null);
  const [editando, setEditando] = useState(null);

  const carregar = () => {
    norteens.listarOfertasAdmin().then(setOfertas).catch((e) => toast({ title: e.message, variant: "destructive" }));
    norteens.listarInteresses().then(setInteresses).catch((e) => toast({ title: e.message, variant: "destructive" }));
  };
  useEffect(carregar, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ofertas || !interesses) return <PageLoading />;
  const pendentes = interesses.filter((i) => !i.contatado).length;

  return (
    <div>
      <SecaoHeader
        titulo="Ofertas"
        descricao="A avaliação DISC e os planos de mentoria que aparecem no site, e quem pediu para ser avisado no lançamento."
        acoes={<Button variant="outline" asChild><Link to="/planos" target="_blank"><ExternalLink /> Ver no site</Link></Button>}
      />

      <div className="flex gap-1.5 mb-6" role="tablist">
        {[["planos", "Planos", ofertas.length], ["interessados", "Interessados", interesses.length]].map(([id, rotulo, n]) => (
          <button
            key={id}
            role="tab"
            aria-selected={aba === id}
            onClick={() => setAba(id)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              aba === id ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {rotulo} <span className="opacity-60 ml-0.5">{n}</span>
            {id === "interessados" && pendentes > 0 && (
              <span className="ml-1.5 inline-flex px-1.5 rounded-full bg-accent text-white text-[11px] font-bold">{pendentes} {pendentes === 1 ? "novo" : "novos"}</span>
            )}
          </button>
        ))}
      </div>

      {aba === "planos" ? (
        <div className="grid md:grid-cols-2 gap-4">
          {ofertas.map((o) => (
            <article key={o.id} className={`flex flex-col p-5 rounded-2xl bg-card border ${o.ativo ? "border-border" : "border-dashed border-border opacity-70"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {o.tipo === "disc" ? "Avaliação" : "Mentoria"}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-foreground">{o.nome}</h3>
                  {o.subtitulo && <p className="text-sm text-muted-foreground">{o.subtitulo}</p>}
                </div>
                <BotaoIcone label="Editar" onClick={() => setEditando(o)}><Pencil className="w-4 h-4" /></BotaoIcone>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 text-xs font-medium">
                <span className={`px-2.5 py-1 rounded-full ${o.preco ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>
                  {o.preco || "Preço: em breve"}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${o.ativo ? "bg-muted text-foreground" : "bg-muted text-muted-foreground"}`}>
                  {o.ativo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {o.ativo ? "Visível" : "Escondido"}
                </span>
                {o.destaque && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-highlight/25 text-[#8a5a12]"><Sparkles className="w-3 h-3" /> Recomendado</span>}
                {o.presentes.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent"><Gift className="w-3 h-3" /> {o.presentes.length} {o.presentes.length === 1 ? "presente" : "presentes"}</span>
                )}
              </div>
              <p className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {o.interessados} {o.interessados === 1 ? "interessado" : "interessados"}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <Interessados interesses={interesses} setInteresses={setInteresses} ofertas={ofertas} />
      )}

      <Dialog open={!!editando} onOpenChange={(v) => !v && setEditando(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editando && (
            <EditarOferta
              key={editando.id}
              oferta={editando}
              onSalvo={(nova) => {
                setOfertas((l) => l.map((x) => (x.id === nova.id ? { ...x, ...nova } : x)));
                esquecerOfertas();
                setEditando(null);
                toast({ title: "Oferta atualizada." });
              }}
              onCancelar={() => setEditando(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditarOferta({ oferta, onSalvo, onCancelar }) {
  const { toast } = useToast();
  const [f, setF] = useState({
    nome: oferta.nome || "", subtitulo: oferta.subtitulo || "", descricao: oferta.descricao || "", preco: oferta.preco || "",
    beneficios: (oferta.beneficios || []).join("\n"), presentes: (oferta.presentes || []).join("\n"),
    destaque: oferta.destaque, ativo: oferta.ativo,
  });
  const [salvando, setSalvando] = useState(false);
  const set = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      onSalvo(await norteens.editarOferta(oferta.id, { ...f, beneficios: linhas(f.beneficios), presentes: linhas(f.presentes) }));
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    }
    setSalvando(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Editar {oferta.tipo === "disc" ? "avaliação" : `plano ${oferta.nome}`}</DialogTitle>
        <DialogDescription>As mudanças aparecem no site assim que você salvar.</DialogDescription>
      </DialogHeader>
      <form onSubmit={salvar} className="space-y-7 mt-2">
        <GrupoForm titulo="Apresentação">
          <div className="grid sm:grid-cols-2 gap-4">
            <Campo label="Nome"><Input value={f.nome} onChange={set("nome")} required /></Campo>
            <Campo label="Preço" dica="Deixe vazio para mostrar “Em breve”. Ex: R$ 197 ou 3x de R$ 70">
              <Input value={f.preco} onChange={set("preco")} placeholder="Em breve" />
            </Campo>
          </div>
          <Campo label="Frase curta"><Input value={f.subtitulo} onChange={set("subtitulo")} /></Campo>
          <Campo label="Descrição"><Textarea value={f.descricao} onChange={set("descricao")} rows={3} /></Campo>
        </GrupoForm>

        <GrupoForm titulo="O que inclui (um item por linha)">
          <Campo label="Benefícios"><Textarea value={f.beneficios} onChange={set("beneficios")} rows={5} /></Campo>
          <Campo label="Presentes" dica="Deixe vazio se este plano não tem presente.">
            <Textarea value={f.presentes} onChange={set("presentes")} rows={3} placeholder={"Caderno de bordo Norteens\n..."} />
          </Campo>
        </GrupoForm>

        <GrupoForm titulo="No site">
          <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border">
            <span>
              <span className="block text-sm font-medium">Visível no site</span>
              <span className="block text-xs text-muted-foreground">Desligado, some de todas as páginas (os interessados continuam guardados).</span>
            </span>
            <Switch checked={f.ativo} onCheckedChange={(v) => setF({ ...f, ativo: v })} />
          </label>
          {oferta.tipo === "mentoria" && (
            <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border">
              <span>
                <span className="block text-sm font-medium">Marcar como “Recomendado”</span>
                <span className="block text-xs text-muted-foreground">Destaca o cartão na comparação de planos. Use em um plano só.</span>
              </span>
              <Switch checked={f.destaque} onCheckedChange={(v) => setF({ ...f, destaque: v })} />
            </label>
          )}
        </GrupoForm>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancelar}>Cancelar</Button>
          <Button type="submit" disabled={salvando}>{salvando && <Loader2 className="animate-spin" />} Salvar</Button>
        </div>
      </form>
    </>
  );
}

function Interessados({ interesses, setInteresses, ofertas }) {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState("todas");
  const visiveis = useMemo(
    () => interesses.filter((i) => filtro === "todas" || String(i.oferta_id) === filtro),
    [interesses, filtro]
  );

  if (interesses.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Ninguém na lista ainda"
        description="Quando alguém clicar em “Tenho interesse” na página de planos, aparece aqui com nome e e-mail."
      />
    );
  }

  const alternar = async (i) => {
    try {
      const { contatado } = await norteens.marcarContatado(i.id, !i.contatado);
      setInteresses((l) => l.map((x) => (x.id === i.id ? { ...x, contatado } : x)));
    } catch (e) {
      toast({ title: e.message, variant: "destructive" });
    }
  };
  const remover = async (i) => {
    if (!window.confirm(`Tirar ${i.nome} da lista de interesse?`)) return;
    try {
      await norteens.apagarInteresse(i.id);
      setInteresses((l) => l.filter((x) => x.id !== i.id));
      toast({ title: "Removido da lista." });
    } catch (e) {
      toast({ title: e.message, variant: "destructive" });
    }
  };
  const copiarEmails = async () => {
    const emails = [...new Set(visiveis.map((i) => i.email))].join(", ");
    try {
      await navigator.clipboard.writeText(emails);
      toast({ title: `${visiveis.length} e-mails copiados.` });
    } catch {
      window.prompt("Copie os e-mails:", emails);
    }
  };
  const baixarCsv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      ["Nome", "E-mail", "Quem", "Oferta", "Data", "Contatado"].join(";"),
      ...visiveis.map((i) => [i.nome, i.email, QUEM[i.quem], i.oferta_nome, new Date(i.criado_em).toLocaleDateString("pt-BR"), i.contatado ? "sim" : "não"].map(esc).join(";")),
    ].join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "interessados-norteens.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Filtrar por oferta"
          className="h-10 px-3 rounded-xl border border-border bg-card text-sm"
        >
          <option value="todas">Todas as ofertas</option>
          {ofertas.map((o) => <option key={o.id} value={o.id}>{o.tipo === "mentoria" ? `Mentoria ${o.nome}` : o.nome}</option>)}
        </select>
        <div className="flex gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" onClick={copiarEmails}><Copy /> Copiar e-mails</Button>
          <Button variant="outline" size="sm" onClick={baixarCsv}><Download /> Baixar planilha</Button>
        </div>
      </div>

      <Lista cabecalho={<div className="grid grid-cols-[1.4fr_1fr_110px_150px_80px] gap-4"><span>Pessoa</span><span>Oferta</span><span>Data</span><span>Contato</span><span /></div>}>
        {visiveis.map((i) => (
          <li key={i.id} className="px-5 py-4 grid md:grid-cols-[1.4fr_1fr_110px_150px_80px] gap-x-4 gap-y-2 items-center">
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{i.nome} <span className="ml-1 text-xs font-normal text-muted-foreground">· {QUEM[i.quem]}</span></p>
              <a href={`mailto:${i.email}`} className="text-sm text-muted-foreground hover:text-foreground truncate block">{i.email}</a>
            </div>
            <span className="text-sm text-foreground truncate">{i.oferta_tipo === "mentoria" ? `Mentoria ${i.oferta_nome}` : i.oferta_nome}</span>
            <span className="text-sm text-muted-foreground">{new Date(i.criado_em).toLocaleDateString("pt-BR")}</span>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <Switch checked={i.contatado} onCheckedChange={() => alternar(i)} />
              <span className={i.contatado ? "text-foreground" : "text-muted-foreground"}>{i.contatado ? "Contatado" : "Pendente"}</span>
            </label>
            <div className="flex justify-end">
              <BotaoIcone label="Tirar da lista" perigo onClick={() => remover(i)}><Trash2 className="w-4 h-4" /></BotaoIcone>
            </div>
          </li>
        ))}
      </Lista>
    </>
  );
}
