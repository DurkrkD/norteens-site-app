import React from "react";
import { Info } from "lucide-react";
import { PERGUNTAS_TESTE } from "@/data/perguntasTeste";
import { SecaoHeader } from "@/components/painel/ui";

// mesmos perfis de server/perfisTeste.js
const PERFIS = {
  D: { nome: "Executor(a)", resumo: "Decide rápido, lidera, foca em resultado.", cor: "bg-accent/15 text-accent" },
  I: { nome: "Comunicador(a)", resumo: "Sociável, entusiasmado(a), influencia o grupo.", cor: "bg-highlight/25 text-[#8a5a12]" },
  S: { nome: "Cuidador(a)", resumo: "Paciente, leal, valoriza estabilidade e harmonia.", cor: "bg-secondary/15 text-secondary" },
  C: { nome: "Analista", resumo: "Detalhista, organizado(a), decide com dados.", cor: "bg-primary/10 text-primary" },
};

export default function PainelPerguntas() {
  return (
    <div>
      <SecaoHeader
        titulo="Perguntas do teste"
        descricao="As 12 perguntas que o aluno responde, agrupadas pelo perfil que cada uma mede."
      />

      <div className="flex gap-3 p-4 rounded-2xl bg-muted/60 border border-border mb-6 text-sm text-foreground/80 leading-relaxed">
        <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p>
          Cada resposta vai de 0 a 100 (do lado esquerdo ao direito, que representa o traço). O sistema tira a média
          de cada perfil e o maior vence; em empate, vale a ordem Executor, Comunicador, Cuidador, Analista. Não há IA
          envolvida: <strong>as mesmas respostas sempre dão o mesmo resultado</strong>. Por isso as perguntas são fixas
          e não podem ser editadas por aqui.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {Object.entries(PERFIS).map(([eixo, perfil]) => (
          <section key={eixo} className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-10 h-10 rounded-xl font-heading font-bold flex items-center justify-center ${perfil.cor}`}>
                {eixo}
              </span>
              <div>
                <h2 className="font-semibold text-foreground">{perfil.nome}</h2>
                <p className="text-xs text-muted-foreground">{perfil.resumo}</p>
              </div>
            </div>
            <ol className="space-y-3">
              {PERGUNTAS_TESTE.filter((p) => p.eixo === eixo).map((p) => (
                <li key={p.id} className="text-sm">
                  <p className="font-medium text-foreground">{p.id}. {p.enunciado}</p>
                  <div className="mt-1.5 grid grid-cols-[1fr_auto_1fr] items-start gap-2 text-xs leading-snug">
                    <span className="text-muted-foreground">{p.lado_esquerdo}</span>
                    <span className="text-muted-foreground" aria-hidden="true">→</span>
                    <span className="text-right font-medium text-foreground">{p.lado_direito}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
