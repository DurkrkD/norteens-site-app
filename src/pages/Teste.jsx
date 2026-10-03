import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { norteens } from "@/api/norteensClient";
import { PERGUNTAS_TESTE } from "@/data/perguntasTeste";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/Page";

const respostasIniciais = () => {
  /** @type {Record<number, number>} */
  const initial = {};
  PERGUNTAS_TESTE.forEach((p) => (initial[p.id] = 50));
  return initial;
};

export default function Teste() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [respostas, setRespostas] = useState(respostasIniciais);
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.teste_feito) {
      navigate("/resultado");
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const respostasFormatadas = PERGUNTAS_TESTE.map((p) => ({
        id: p.id,
        valor: respostas[p.id],
      }));

      const atualizado = await norteens.calcularTeste(respostasFormatadas);

      setUser(atualizado);
      toast({ title: "Teste concluído!", description: "Veja seu resultado agora." });
      navigate("/resultado");
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Tente novamente.";
      toast({ title: "Erro ao calcular o resultado", description: mensagem, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.teste_feito) return null;

  const pergunta = PERGUNTAS_TESTE[current];
  const progress = ((current + 1) / PERGUNTAS_TESTE.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        eyebrow="Teste comportamental"
        title="Como você costuma agir?"
        description="Arraste para o lado que mais combina com você. Não existem respostas certas ou erradas."
      />

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Pergunta {current + 1} de {PERGUNTAS_TESTE.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-highlight transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card rounded-2xl border border-border shadow-soft p-6 sm:p-10 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-8 leading-snug">
          {pergunta.enunciado}
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 text-sm font-medium">
            <span className="p-3 rounded-xl bg-muted/70 text-foreground">{pergunta.lado_esquerdo}</span>
            <span className="p-3 rounded-xl bg-muted/70 text-foreground text-right">{pergunta.lado_direito}</span>
          </div>
          <Slider
            value={[respostas[pergunta.id]]}
            onValueChange={(v) => setRespostas({ ...respostas, [pergunta.id]: v[0] })}
            max={100}
            min={0}
            step={1}
            className="py-2"
          />
          <div className="text-center text-sm text-muted-foreground">
            {respostas[pergunta.id] < 30 ? pergunta.lado_esquerdo : respostas[pergunta.id] > 70 ? pergunta.lado_direito : "Neutro"}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>

        {current === PERGUNTAS_TESTE.length - 1 ? (
          <Button onClick={handleSubmit} disabled={submitting} className="bg-primary hover:bg-primary/90">
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Analisando...
              </>
            ) : (
              <>
                Concluir <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={() => setCurrent(current + 1)}>
            Próxima <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}