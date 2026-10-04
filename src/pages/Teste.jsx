import React, { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, ListChecks, Scale, Loader2, Info, CheckCircle2 } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PERGUNTAS_TESTE } from "@/data/perguntasTeste";
import { useToast } from "@/components/ui/use-toast";

// escala de 7 pontos -> valor 0..100 que o backend espera (0 = lado esquerdo, 100 = lado direito)
const ESCALA = [0, 17, 33, 50, 67, 83, 100];
const ROTULOS = [
  "Totalmente como a primeira frase",
  "Bastante como a primeira frase",
  "Um pouco como a primeira frase",
  "Neutro",
  "Um pouco como a segunda frase",
  "Bastante como a segunda frase",
  "Totalmente como a segunda frase",
];
const TAMANHOS = ["w-12 h-12 sm:w-14 sm:h-14", "w-10 h-10 sm:w-12 sm:h-12", "w-8 h-8 sm:w-10 sm:h-10", "w-7 h-7 sm:w-8 sm:h-8", "w-8 h-8 sm:w-10 sm:h-10", "w-10 h-10 sm:w-12 sm:h-12", "w-12 h-12 sm:w-14 sm:h-14"];
const TOTAL = PERGUNTAS_TESTE.length;
const CHAVE = "norteens-teste-andamento"; // respostas guardadas para não perder num recarregamento

function lerAndamento() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE)) || {};
  } catch {
    return {};
  }
}

export default function Teste() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  /** @type {[Record<number, number>, Function]} */
  const [respostas, setRespostas] = useState(lerAndamento);
  const [etapa, setEtapa] = useState(() => (Object.keys(lerAndamento()).length ? "perguntas" : "intro"));
  const [atual, setAtual] = useState(() => Math.min(Object.keys(lerAndamento()).length, TOTAL - 1));
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.teste_feito) navigate("/resultado");
  }, [user, navigate]);

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify(respostas));
    } catch { /* sem armazenamento: segue sem salvar o andamento */ }
  }, [respostas]);

  // trava durante a transição: sem ela, dois cliques rápidos pulariam uma pergunta sem responder
  const emTransicao = useRef(false);
  const responder = useCallback(
    (indice) => {
      if (emTransicao.current) return;
      emTransicao.current = true;
      const pergunta = PERGUNTAS_TESTE[atual];
      setRespostas((r) => ({ ...r, [pergunta.id]: ESCALA[indice] }));
      // avança sozinho depois de um instante, para a pessoa ver a marcação
      setTimeout(() => {
        if (atual < TOTAL - 1) setAtual(atual + 1);
        else setEtapa("fim");
        emTransicao.current = false;
      }, 280);
    },
    [atual]
  );

  // teclado: 1 a 7 respondem, seta para a esquerda volta
  useEffect(() => {
    if (etapa !== "perguntas") return;
    const tecla = (e) => {
      if (e.key >= "1" && e.key <= "7") responder(Number(e.key) - 1);
      if (e.key === "ArrowLeft" && atual > 0) setAtual(atual - 1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [etapa, atual, responder]);

  const enviar = async () => {
    setEnviando(true);
    try {
      const atualizado = await norteens.calcularTeste(PERGUNTAS_TESTE.map((p) => ({ id: p.id, valor: respostas[p.id] })));
      try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ }
      setUser(atualizado);
      navigate("/resultado");
    } catch (error) {
      toast({
        title: "Não foi possível calcular o resultado",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
      setEnviando(false);
    }
  };

  if (!user || user.teste_feito) return null;

  const respondidas = PERGUNTAS_TESTE.filter((p) => respostas[p.id] !== undefined).length;

  // ---------- introdução ----------
  if (etapa === "intro") {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Teste comportamental</p>
          <h1 className="mt-4 text-[2.4rem] sm:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance">
            Vamos descobrir{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">como você funciona.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
            Para cada situação, escolha o quanto você se parece com cada uma das duas frases. Responda pensando em
            como você realmente é, não em como gostaria de ser.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-3 text-left">
            {[
              { icon: ListChecks, titulo: `${TOTAL} situações`, texto: "Do dia a dia: escola, amigos, decisões." },
              { icon: Clock, titulo: "Cerca de 3 minutos", texto: "Dá para fazer de uma vez, sem pressa." },
              { icon: Scale, titulo: "Sem certo ou errado", texto: "Todos os perfis têm forças diferentes." },
            ].map((i) => (
              <div key={i.titulo} className="rounded-2xl bg-card border border-border p-5">
                <i.icon className="w-5 h-5 text-accent" strokeWidth={1.8} />
                <p className="mt-3 font-heading font-bold text-foreground">{i.titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{i.texto}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setEtapa("perguntas")}
            className="group mt-10 inline-flex items-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground text-[17px] font-semibold shadow-soft-lg hover:bg-primary/90 transition-colors"
          >
            Começar o teste
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>

          <p className="mt-8 flex items-start gap-2 text-xs text-muted-foreground max-w-md mx-auto text-left">
            <Info className="w-4 h-4 shrink-0 mt-px" />
            Inspirado no modelo DISC. É um ponto de partida para o autoconhecimento, não um diagnóstico psicológico.
            O teste é feito uma vez por conta.
          </p>
        </div>
      </div>
    );
  }

  // ---------- conclusão ----------
  if (etapa === "fim") {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center animate-fade-up">
        <span className="inline-flex w-16 h-16 rounded-2xl bg-secondary/15 text-secondary items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-[-0.03em] text-foreground">Tudo respondido!</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Você respondeu as {respondidas} situações. Quando quiser, veja o seu perfil.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setEtapa("perguntas"); setAtual(TOTAL - 1); }}
            disabled={enviando}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-card border border-border font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Revisar respostas
          </button>
          <button
            onClick={enviar}
            disabled={enviando || respondidas < TOTAL}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {enviando ? "Calculando seu perfil..." : "Ver meu resultado"}
            {!enviando && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  // ---------- perguntas ----------
  const pergunta = PERGUNTAS_TESTE[atual];
  const valorAtual = respostas[pergunta.id];
  const progresso = (respondidas / TOTAL) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* progresso */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => (atual > 0 ? setAtual(atual - 1) : setEtapa("intro"))}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-highlight transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {atual + 1}/{TOTAL}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center">
        <div key={pergunta.id} className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-up">
          <p className="text-center text-sm font-semibold text-accent">Situação {atual + 1}</p>
          <h1 className="mt-3 text-center text-[1.75rem] sm:text-4xl font-bold tracking-[-0.02em] leading-tight text-foreground text-balance">
            {pergunta.enunciado}
          </h1>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6">
            <div className="rounded-2xl bg-secondary/10 border border-secondary/20 px-4 py-4 sm:px-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">Frase A</p>
              <p className="mt-1 text-[15px] sm:text-base font-medium text-foreground leading-snug">{pergunta.lado_esquerdo}</p>
            </div>
            <div className="rounded-2xl bg-accent/10 border border-accent/20 px-4 py-4 sm:px-5 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Frase B</p>
              <p className="mt-1 text-[15px] sm:text-base font-medium text-foreground leading-snug">{pergunta.lado_direito}</p>
            </div>
          </div>

          <div role="radiogroup" aria-label={pergunta.enunciado} className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
            {ESCALA.map((valor, i) => {
              const marcado = valorAtual === valor;
              const lado = i < 3 ? "secondary" : i > 3 ? "accent" : "neutro";
              const cores =
                lado === "secondary"
                  ? marcado ? "bg-secondary border-secondary" : "border-secondary/60 hover:bg-secondary/15"
                  : lado === "accent"
                    ? marcado ? "bg-accent border-accent" : "border-accent/60 hover:bg-accent/15"
                    : marcado ? "bg-muted-foreground border-muted-foreground" : "border-muted-foreground/40 hover:bg-muted";
              return (
                <button
                  key={valor}
                  role="radio"
                  aria-checked={marcado}
                  aria-label={ROTULOS[i]}
                  title={ROTULOS[i]}
                  onClick={() => responder(i)}
                  className={`${TAMANHOS[i]} rounded-full border-2 transition-all duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 ${cores} ${
                    marcado ? "scale-110 shadow-soft" : ""
                  }`}
                />
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-xs sm:text-sm font-medium max-w-md mx-auto px-1">
            <span className="text-secondary">Mais como A</span>
            <span className="text-muted-foreground">Neutro</span>
            <span className="text-accent">Mais como B</span>
          </div>

          <p className="mt-12 text-center text-xs text-muted-foreground hidden sm:block">
            Dica: use as teclas <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">1</kbd> a{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">7</kbd> para responder e{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">←</kbd> para voltar.
          </p>
        </div>
      </div>
    </div>
  );
}
