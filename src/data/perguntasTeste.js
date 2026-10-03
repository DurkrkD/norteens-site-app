// Perguntas fixas do teste comportamental (perfil DISC simplificado).
// Cada pergunta pertence a um eixo (D, I, S ou C). O lado_direito representa
// a expressão "alta" desse traço e o lado_esquerdo a expressão "baixa".
// Se mudar aqui, espelhe os ids e eixos em server/perguntasTeste.js.
export const PERGUNTAS_TESTE = [
  {
    id: 1,
    eixo: "D",
    enunciado: "Quando um trabalho em grupo trava, o que você faz?",
    lado_esquerdo: "Espero alguém tomar a iniciativa",
    lado_direito: "Assumo a liderança e decido o próximo passo",
  },
  {
    id: 2,
    eixo: "D",
    enunciado: "Diante de um problema difícil, você prefere...",
    lado_esquerdo: "Pensar com calma antes de agir",
    lado_direito: "Agir rápido e ajustar o rumo depois",
  },
  {
    id: 3,
    eixo: "D",
    enunciado: "Em uma competição ou desafio, você...",
    lado_esquerdo: "Participa mais pela experiência",
    lado_direito: "Joga para vencer",
  },
  {
    id: 4,
    eixo: "I",
    enunciado: "Em uma festa ou evento novo, você...",
    lado_esquerdo: "Fica mais reservado(a), observando",
    lado_direito: "Conversa com pessoas novas facilmente",
  },
  {
    id: 5,
    eixo: "I",
    enunciado: "Ao apresentar um trabalho para a turma, você...",
    lado_esquerdo: "Prefere que outra pessoa apresente",
    lado_direito: "Gosta de estar na frente, falando",
  },
  {
    id: 6,
    eixo: "I",
    enunciado: "Quando algo bom acontece, você...",
    lado_esquerdo: "Guarda a alegria pra você",
    lado_direito: "Compartilha com todo mundo ao redor",
  },
  {
    id: 7,
    eixo: "S",
    enunciado: "Quando um amigo está triste, você...",
    lado_esquerdo: "Dá espaço e deixa ele(a) vir até você",
    lado_direito: "Fica por perto, oferecendo apoio",
  },
  {
    id: 8,
    eixo: "S",
    enunciado: "Sobre mudanças na rotina, você...",
    lado_esquerdo: "Se adapta fácil, gosta de novidade",
    lado_direito: "Prefere estabilidade e previsibilidade",
  },
  {
    id: 9,
    eixo: "S",
    enunciado: "Diante de um conflito entre colegas, você...",
    lado_esquerdo: "Fala o que pensa, mesmo se gerar atrito",
    lado_direito: "Busca acalmar e manter a harmonia",
  },
  {
    id: 10,
    eixo: "C",
    enunciado: "Antes de entregar uma tarefa, você...",
    lado_esquerdo: "Entrega e segue pra próxima coisa",
    lado_direito: "Revisa os detalhes com cuidado antes",
  },
  {
    id: 11,
    eixo: "C",
    enunciado: "Ao tomar uma decisão importante, você...",
    lado_esquerdo: "Confia na intuição",
    lado_direito: "Pesquisa e compara dados antes de decidir",
  },
  {
    id: 12,
    eixo: "C",
    enunciado: "Sobre regras e procedimentos, você...",
    lado_esquerdo: "Prefere flexibilidade, cada caso é um caso",
    lado_direito: "Gosta de seguir um processo claro",
  },
];
