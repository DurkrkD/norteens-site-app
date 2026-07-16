import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

export default function Teste() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.teste_feito) {
      navigate("/resultado");
      return;
    }
    base44.entities.Pergunta.list("ordem").then((data) => {
      setPerguntas(data);
      const initial = {};
      data.forEach((p) => (initial[p.id] = 50));
      setRespostas(initial);
      setLoading(false);
    });
  }, [user, navigate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const formatted = perguntas.map((p) => ({
      enunciado: p.enunciado,
      esquerdo: p.lado_esquerdo,
      direito: p.lado_direito,
      valor: respostas[p.id],
    }));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um orientador de carreira. Analise as respostas de um teste comportamental e forneça um perfil de personalidade profissional detalhado em português do Brasil.

As perguntas são em formato de escala: 0 = totalmente alinhado com o lado esquerdo, 100 = totalmente alinhado com o lado direito, 50 = neutro.

Respostas:
${formatted.map((r, i) => `${i + 1}. "${r.enunciado}" (${r.esquerdo} ←→ ${r.direito}): ${r.valor}/100`).join("\n")}

Forneça um perfil comportamental profissional completo com: pontos fortes, áreas de desenvolvimento, estilo de trabalho preferido, e tipos de carreiras recomendadas. Seja acolhedor e motivador. Máximo 800 palavras.`,
      model: "claude_sonnet_4_6",
    });

    await base44.auth.updateMe({
      teste_feito: true,
      perfil_resultado: result,
      marco_teste: true,
    });

    setUser({ ...user, teste_feito: true, perfil_resultado: result, marco_teste: true });
    toast({ title: "Teste concluído!", description: "Veja seu resultado agora." });
    navigate("/resultado");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (perguntas.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Nenhuma pergunta cadastrada ainda. Aguarde o administrador configurar o teste.</p>
      </div>
    );
  }

  const pergunta = perguntas[current];
  const progress = ((current + 1) / perguntas.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-accent mb-2">Teste Comportamental</h1>
      <p className="text-muted-foreground mb-8">Responda com sinceridade — não existem respostas certas ou erradas.</p>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Pergunta {current + 1} de {perguntas.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card rounded-2xl border border-border p-8 mb-8">
        <h2 className="font-heading text-xl font-semibold text-foreground text-center mb-8">
          {pergunta.enunciado}
        </h2>

        <div className="space-y-6">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-secondary max-w-[40%]">{pergunta.lado_esquerdo}</span>
            <span className="text-primary max-w-[40%] text-right">{pergunta.lado_direito}</span>
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

        {current === perguntas.length - 1 ? (
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