// Regras de movimento do site inteiro: quem pediu "reduzir movimento" no sistema não vê animação;
// no celular (tela estreita ou toque) as animações são mais curtas e sem efeitos pesados.
export const MQ_REDUZIR = "(prefers-reduced-motion: reduce)";
const MQ_CELULAR = "(max-width: 767px), (pointer: coarse)";

const consulta = (mq) => typeof window !== "undefined" && window.matchMedia(mq).matches;

export const prefereMenosMovimento = () => consulta(MQ_REDUZIR);
export const ehCelular = () => consulta(MQ_CELULAR);

// curva "expo out" usada nas entradas (a mesma do Revelar)
export const EASE_SAIDA = [0.22, 1, 0.36, 1];
