// Os 4 perfis do teste comportamental (mesmos eixos de server/perfisTeste.js).
// "cor" é usada em barras e etiquetas; "suave" no fundo de ícones e selos.
export const PERFIS = {
  D: {
    nome: "Executor(a)",
    traco: "Iniciativa",
    resumo: "Decide rápido, assume a liderança e foca em resultado.",
    cor: "bg-accent",
    texto: "text-accent",
    suave: "bg-accent/15 text-accent",
  },
  I: {
    nome: "Comunicador(a)",
    traco: "Influência",
    resumo: "Sociável, entusiasmado(a) e bom(boa) em engajar pessoas.",
    cor: "bg-highlight",
    texto: "text-[#9a6a12]",
    suave: "bg-highlight/25 text-[#8a5a12]",
  },
  S: {
    nome: "Cuidador(a)",
    traco: "Estabilidade",
    resumo: "Paciente, leal e atento(a) ao bem-estar do grupo.",
    cor: "bg-secondary",
    texto: "text-secondary",
    suave: "bg-secondary/15 text-secondary",
  },
  C: {
    nome: "Analista",
    traco: "Precisão",
    resumo: "Detalhista, organizado(a) e guiado(a) por dados.",
    cor: "bg-[#3b6b8f]",
    texto: "text-[#3b6b8f]",
    suave: "bg-[#3b6b8f]/15 text-[#3b6b8f]",
  },
};

export const ORDEM_EIXOS = ["D", "I", "S", "C"];
