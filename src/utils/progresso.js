import { base44 } from "@/api/base44Client";

export const MARCOS = [
  { key: "marco_teste", label: "Fez o teste" },
  { key: "marco_resultado", label: "Viu o resultado" },
  { key: "marco_profissoes", label: "Explorou profissões" },
  { key: "marco_comunidade", label: "Visitou a comunidade" },
];

export function calcularNivel(user) {
  if (!user) return 0;
  return MARCOS.filter((m) => user[m.key]).length;
}

export function todosConcluidos(user) {
  return calcularNivel(user) === MARCOS.length;
}

export async function marcarMarco(user, setUser, milestoneField) {
  if (!user || user[milestoneField]) return;
  await base44.auth.updateMe({ [milestoneField]: true });
  setUser({ ...user, [milestoneField]: true });
}