import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MARCOS, calcularNivel, todosConcluidos } from "@/utils/progresso";
import { ArrowLeft, Send, Lock, CheckCircle2, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const marcoLinks = {
  marco_teste: "/teste",
  marco_resultado: "/resultado",
  marco_profissoes: "/profissoes",
  marco_comunidade: "/comunidade",
};

export default function Feedback() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [texto, setTexto] = useState("");
  const [autorizar, setAutorizar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const isDono = user.papel === "dono";
  const completo = todosConcluidos(user);
  const nivel = calcularNivel(user);
  const desbloqueado = isDono || completo;

  const handleSubmit = async () => {
    if (!texto.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.Feedback.create({
        autor: user.id,
        texto: texto.trim(),
        autorizar_exibicao: autorizar,
      });
      setSubmitting(false);
      setSent(true);
      setTexto("");
      setAutorizar(false);
      toast({ title: "Feedback enviado!", description: "Obrigado por compartilhar sua experiência." });
    } catch {
      setSubmitting(false);
      toast({ title: "Erro ao enviar", description: "Tente novamente em instantes.", variant: "destructive" });
    }
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(126,142,91,0.15)" }}>
          <Send className="w-8 h-8" style={{ color: "#5E6B43" }} />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-accent mb-2">Obrigado!</h1>
        <p className="text-muted-foreground mb-8">Seu feedback foi recebido com sucesso.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => setSent(false)}>Enviar outro</Button>
          <Link to="/"><Button variant="light">Voltar ao início</Button></Link>
        </div>
      </div>
    );
  }

  // Blocked state
  if (!desbloqueado) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="font-heading text-3xl font-bold text-accent mb-2">Seu Feedback</h1>
        <p className="text-muted-foreground mb-8">
          Complete sua jornada para desbloquear o formulário de feedback.
        </p>

        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Feedback bloqueado</p>
              <p className="text-sm text-muted-foreground">Nível {nivel} de {MARCOS.length}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(nivel / MARCOS.length) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {MARCOS.map((m) => {
              const done = !!user[m.key];
              return (
                <Link
                  key={m.key}
                  to={marcoLinks[m.key]}
                  className={`flex items-center gap-3 p-3 rounded-[12px] transition-colors ${done ? "bg-secondary/10" : "bg-muted/50 hover:bg-muted"}`}
                >
                  {done ? <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                  <span className={`text-sm font-medium ${done ? "text-secondary" : "text-foreground"}`}>{m.label}</span>
                  {!done && <span className="ml-auto text-xs text-primary font-medium">Concluir →</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Unlocked — show form
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="font-heading text-3xl font-bold text-accent mb-2">Seu Feedback</h1>
      <p className="text-muted-foreground mb-8">
        Escreva livremente sobre sua experiência com a Norteens. Sua opinião é muito importante para nós.
      </p>
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Conte o que achou da sua jornada, o que mais gostou, o que poderia melhorar..."
          className="min-h-[200px] resize-y"
        />
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <Checkbox checked={autorizar} onCheckedChange={(v) => setAutorizar(!!v)} className="mt-0.5" />
          <span className="text-sm text-muted-foreground">
            Autorizo mostrar meu depoimento na tela inicial como exemplo.
          </span>
        </label>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground">{texto.length} caracteres</span>
          <Button onClick={handleSubmit} disabled={submitting || !texto.trim()}>
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>Enviar <Send className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}