import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Library, Loader2, ExternalLink, Lock, Sparkles } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import MobileDrawerSelect from "@/components/ui/MobileDrawerSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader, Lista, BotaoIcone, Campo, GrupoForm } from "@/components/painel/ui";
import { TIPOS, ORDEM_TIPOS, comoExibir } from "@/lib/conteudos";

// o seletor (Radix) não aceita valor vazio: "nenhuma" representa "sem profissão"
const SEM_PROFISSAO = "nenhuma";
const vazio = {
  titulo: "", descricao: "", tipo: "ebook", area: "", profissao_id: SEM_PROFISSAO,
  capa_url: "", arquivo_url: "", gratuito: false, publicado: false, ordem: "0",
};

const ehHttps = (v) => !v || /^https:\/\/\S+$/i.test(v.trim());

// como o site vai abrir o link cadastrado: ajuda o admin a perceber um link errado antes de publicar
function ComoVaiAbrir({ tipo, link }) {
  if (!link || !ehHttps(link)) return null;
  const { modo } = comoExibir(tipo, link.trim());
  const texto = {
    video: "vídeo embutido (YouTube/Vimeo)",
    "drive-midia": "player do Google Drive",
    "video-arquivo": "player de vídeo",
    audio: "player de áudio",
    documento: "PDF embutido, com botões de abrir e baixar",
  }[modo];
  return <span className="block text-xs text-secondary font-medium">Vai abrir como: {texto}.</span>;
}

export default function PainelConteudos() {
  const { toast } = useToast();
  const [conteudos, setConteudos] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [mudandoPublicacao, setMudandoPublicacao] = useState(null);

  const load = async () => {
    try {
      const [c, p] = await Promise.all([norteens.listarConteudosAdmin(), norteens.listarProfissoes()]);
      setConteudos(c);
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

  const abrirEdicao = (c) => {
    setEditing(c);
    setForm({
      titulo: c.titulo || "", descricao: c.descricao || "", tipo: c.tipo, area: c.area || "",
      profissao_id: c.profissao_id ? String(c.profissao_id) : SEM_PROFISSAO,
      capa_url: c.capa_url || "", arquivo_url: c.arquivo_url || "",
      gratuito: !!c.gratuito, publicado: !!c.publicado, ordem: String(c.ordem ?? 0),
    });
    setDialogOpen(true);
  };

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const linksOk = ehHttps(form.capa_url) && ehHttps(form.arquivo_url);
  const faltaArquivo = form.gratuito && form.publicado && !form.arquivo_url.trim();

  const salvar = async (e) => {
    e.preventDefault();
    if (!linksOk) return;
    setSalvando(true);
    const payload = {
      ...form,
      profissao_id: form.profissao_id === SEM_PROFISSAO ? null : Number(form.profissao_id),
      ordem: Number(form.ordem) || 0,
    };
    try {
      if (editing) {
        await norteens.editarConteudo(editing.id, payload);
        toast({ title: "Conteúdo atualizado!" });
      } else {
        await norteens.criarConteudo(payload);
        toast({ title: form.publicado ? "Conteúdo publicado!" : "Rascunho salvo." });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast({ title: err.message || "Não foi possível salvar.", variant: "destructive" });
    }
    setSalvando(false);
  };

  const alternarPublicacao = async (c) => {
    setMudandoPublicacao(c.id);
    try {
      await norteens.publicarConteudo(c.id, !c.publicado);
      setConteudos((lista) => lista.map((x) => (x.id === c.id ? { ...x, publicado: !c.publicado } : x)));
      toast({ title: c.publicado ? "Conteúdo tirado do ar." : "Conteúdo publicado!" });
    } catch (err) {
      toast({ title: err.message || "Não foi possível mudar a publicação.", variant: "destructive" });
    }
    setMudandoPublicacao(null);
  };

  const apagar = async (c) => {
    if (!window.confirm(`Apagar "${c.titulo}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await norteens.apagarConteudo(c.id);
      toast({ title: "Conteúdo removido." });
      load();
    } catch (err) {
      toast({ title: err.message || "Não foi possível apagar.", variant: "destructive" });
    }
  };

  if (loading) return <PageLoading />;

  const publicados = conteudos.filter((c) => c.publicado).length;

  return (
    <div>
      <SecaoHeader
        titulo="Conteúdos"
        descricao={`E-books, audiobooks, videobooks e exercícios da página Conteúdos. ${publicados} de ${conteudos.length} no ar.`}
        acoes={<Button onClick={abrirNovo}><Plus /> Novo conteúdo</Button>}
      />

      {conteudos.length === 0 ? (
        <EmptyState
          icon={Library}
          title="Nenhum conteúdo ainda"
          description="Cadastre o primeiro material. Os arquivos ficam em links externos (YouTube, Vimeo, Google Drive ou PDF hospedado)."
          action={<Button onClick={abrirNovo}><Plus /> Cadastrar o primeiro</Button>}
        />
      ) : (
        <Lista cabecalho={<div className="grid grid-cols-[1fr_130px_110px_90px_80px] gap-4"><span>Conteúdo</span><span>Tipo</span><span>Acesso</span><span>No ar</span><span /></div>}>
          {conteudos.map((c) => {
            const tipo = TIPOS[c.tipo] || TIPOS.ebook;
            const Icone = tipo.icone;
            return (
              <li key={c.id} className="px-5 py-4 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_130px_110px_90px_80px] gap-x-4 gap-y-3 items-center">
                <div className="flex items-center gap-3 min-w-0">
                  {c.capa_url ? (
                    <img src={c.capa_url} alt="" className="w-10 h-12 rounded-md object-cover shrink-0" />
                  ) : (
                    <span className="w-10 h-12 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: tipo.fundo, color: tipo.tinta }}>
                      <Icone className="w-4 h-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{c.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[c.area, c.profissao_nome].filter(Boolean).join(" · ") || "Sem área"}
                      {!c.arquivo_url && " · sem arquivo"}
                    </p>
                  </div>
                </div>
                <span className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icone className="w-4 h-4" /> {tipo.rotulo}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-sm">
                  {c.gratuito ? (
                    <span className="inline-flex items-center gap-1 text-secondary font-medium"><Sparkles className="w-3.5 h-3.5" /> Gratuito</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-foreground font-medium"><Lock className="w-3.5 h-3.5" /> Exclusivo</span>
                  )}
                </span>
                <span className="col-start-1 md:col-start-auto flex items-center gap-2">
                  <Switch
                    checked={c.publicado}
                    disabled={mudandoPublicacao === c.id}
                    onCheckedChange={() => alternarPublicacao(c)}
                    aria-label={c.publicado ? `Tirar "${c.titulo}" do ar` : `Publicar "${c.titulo}"`}
                  />
                  <span className="md:hidden text-xs text-muted-foreground">{c.publicado ? "No ar" : "Rascunho"}</span>
                </span>
                <div className="row-start-1 col-start-2 md:row-start-auto md:col-start-auto flex items-center justify-end gap-0.5">
                  {c.publicado && (
                    <Link to={`/conteudos/${c.id}`} target="_blank" aria-label="Ver no site" title="Ver no site" className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  <BotaoIcone label="Editar" onClick={() => abrirEdicao(c)}><Pencil className="w-4 h-4" /></BotaoIcone>
                  <BotaoIcone label="Apagar" perigo onClick={() => apagar(c)}><Trash2 className="w-4 h-4" /></BotaoIcone>
                </div>
              </li>
            );
          })}
        </Lista>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editing ? "Editar conteúdo" : "Novo conteúdo"}</DialogTitle>
            <DialogDescription>Aparece na página Conteúdos quando estiver publicado.</DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-7 mt-2">
            <GrupoForm titulo="Sobre o material">
              <Campo label="Título">
                <Input value={form.titulo} onChange={mudar("titulo")} required maxLength={200} />
              </Campo>
              <Campo label="Tipo">
                <MobileDrawerSelect
                  value={form.tipo}
                  onValueChange={(v) => setForm({ ...form, tipo: v })}
                  placeholder="Selecione o tipo"
                  options={ORDEM_TIPOS.map((t) => ({ value: t, label: TIPOS[t].rotulo }))}
                />
              </Campo>
              <Campo label="Descrição" dica="Aparece na página do conteúdo, inclusive nos exclusivos.">
                <Textarea value={form.descricao} onChange={mudar("descricao")} rows={3} />
              </Campo>
              <div className="grid sm:grid-cols-2 gap-4">
                <Campo label="Área" dica="Ex.: Saúde, Tecnologia, Vestibular. Vira filtro na página.">
                  <Input value={form.area} onChange={mudar("area")} />
                </Campo>
                <Campo label="Ordem" dica="Menor aparece primeiro.">
                  <Input type="number" step="1" value={form.ordem} onChange={mudar("ordem")} />
                </Campo>
              </div>
              <Campo label="Profissão ligada (opcional)">
                <MobileDrawerSelect
                  value={form.profissao_id}
                  onValueChange={(v) => setForm({ ...form, profissao_id: v })}
                  placeholder="Nenhuma"
                  options={[
                    { value: SEM_PROFISSAO, label: "Nenhuma" },
                    ...profissoes.map((p) => ({ value: String(p.id), label: `${p.icone || ""} ${p.nome}`.trim() })),
                  ]}
                />
              </Campo>
            </GrupoForm>

            <GrupoForm titulo="Links (só https)">
              <Campo label="Link do arquivo" dica="YouTube, Vimeo, Google Drive (compartilhado com 'qualquer pessoa com o link') ou PDF hospedado.">
                <Input type="url" inputMode="url" placeholder="https://" value={form.arquivo_url} onChange={mudar("arquivo_url")} aria-invalid={!ehHttps(form.arquivo_url)} />
                {!ehHttps(form.arquivo_url) && <span className="block text-xs text-destructive">O link precisa começar com https://</span>}
                <ComoVaiAbrir tipo={form.tipo} link={form.arquivo_url} />
              </Campo>
              <Campo label="Link da capa (opcional)" dica="Sem capa, o site gera uma com a cor e o ícone do tipo.">
                <Input type="url" inputMode="url" placeholder="https://" value={form.capa_url} onChange={mudar("capa_url")} aria-invalid={!ehHttps(form.capa_url)} />
                {!ehHttps(form.capa_url) && <span className="block text-xs text-destructive">O link precisa começar com https://</span>}
              </Campo>
            </GrupoForm>

            <GrupoForm titulo="Acesso">
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <span>
                  <span className="block text-sm font-medium text-foreground">Gratuito</span>
                  <span className="block text-xs text-muted-foreground">
                    Desligado, é exclusivo: o público vê só capa, título e descrição, e o link nunca sai do servidor.
                  </span>
                </span>
                <Switch checked={form.gratuito} onCheckedChange={(v) => setForm({ ...form, gratuito: v })} />
              </label>
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <span>
                  <span className="block text-sm font-medium text-foreground">Publicado</span>
                  <span className="block text-xs text-muted-foreground">Desligado, fica como rascunho, só no painel.</span>
                </span>
                <Switch checked={form.publicado} onCheckedChange={(v) => setForm({ ...form, publicado: v })} />
              </label>
              {faltaArquivo && <p className="text-xs text-destructive">Conteúdo gratuito publicado precisa do link do arquivo.</p>}
            </GrupoForm>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvando || !linksOk || faltaArquivo}>
                {salvando && <Loader2 className="animate-spin" />}
                {editing ? "Salvar alterações" : form.publicado ? "Publicar" : "Salvar rascunho"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
