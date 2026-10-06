import React, { useState } from "react";
import { CheckCircle2, Loader2, BellRing } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Botão "Tenho interesse" + janela da lista de interesse. Não é compra: a pessoa só pede para ser avisada
// quando a oferta abrir, e pode sair da lista quando quiser.
export default function BotaoInteresse({ oferta, user, className = "", children }) {
  const [aberto, setAberto] = useState(false);
  if (!oferta) return null;
  return (
    <>
      <button type="button" onClick={() => setAberto(true)} className={className}>
        {children || "Tenho interesse"}
      </button>
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
          {/* a chave reinicia o formulário a cada abertura */}
          {aberto && <Formulario key={oferta.id} oferta={oferta} user={user} onFechar={() => setAberto(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Formulario({ oferta, user, onFechar }) {
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [quem, setQuem] = useState("estudante");
  const [consentimento, setConsentimento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);
  const titulo = oferta.tipo === "mentoria" ? `Mentoria ${oferta.nome}` : oferta.nome;

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await norteens.registrarInteresse({ oferta_id: oferta.id, nome, email, quem, consentimento });
      setPronto(true);
    } catch (err) {
      setErro(err.message);
    }
    setEnviando(false);
  };

  if (pronto) {
    return (
      <div className="p-8 text-center">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-secondary/15 text-secondary items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </span>
        <DialogTitle className="mt-5 text-xl font-bold">Você está na lista!</DialogTitle>
        <DialogDescription className="mt-2 text-[15px] leading-relaxed">
          Vamos avisar em <strong className="text-foreground font-semibold">{email}</strong> quando a {titulo} abrir,
          com valores e datas. Nada foi cobrado e você não assumiu nenhum compromisso.
        </DialogDescription>
        <button onClick={onFechar} className="mt-6 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          Combinado
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar}>
      <DialogHeader className="p-6 pb-5 bg-[#0f2e26] text-[#f8f0e6] text-left space-y-0">
        <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-semibold uppercase tracking-[0.12em] text-highlight">
          <BellRing className="w-3.5 h-3.5" /> Lista de interesse
        </span>
        <DialogTitle className="pt-3 text-2xl font-bold tracking-tight text-[#f8f0e6]">{titulo}</DialogTitle>
        <DialogDescription className="pt-1.5 text-[#f8f0e6]/70 leading-relaxed">
          Deixe seu contato e avisamos assim que abrir, com valores e datas. Não é uma compra.
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 space-y-4">
        <div role="radiogroup" aria-label="Quem está preenchendo" className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted">
          {[["estudante", "Sou estudante"], ["responsavel", "Sou responsável"]].map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={quem === valor}
              onClick={() => setQuem(valor)}
              className={`h-9 rounded-lg text-sm font-medium transition-all ${quem === valor ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              {rotulo}
            </button>
          ))}
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{quem === "responsavel" ? "Seu nome (responsável)" : "Seu nome"}</span>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={120} autoComplete="name" className="h-11" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">E-mail para o aviso</span>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} autoComplete="email" className="h-11" />
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox checked={consentimento} onCheckedChange={(v) => setConsentimento(v === true)} className="mt-0.5" />
          <span className="text-[13px] text-muted-foreground leading-relaxed">
            Autorizo a Norteens a me enviar e-mail sobre esta oferta. Posso pedir para sair da lista quando quiser.
          </span>
        </label>

        {quem === "estudante" && (
          <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-lg bg-muted/60">
            Menor de 18 anos? Tudo bem entrar na lista — quando abrir, a contratação é feita junto com um responsável.
          </p>
        )}

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <button
          type="submit"
          disabled={enviando || !consentimento}
          className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
        >
          {enviando && <Loader2 className="w-4 h-4 animate-spin" />}
          Quero receber o aviso
        </button>
      </div>
    </form>
  );
}
