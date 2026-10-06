import { Home, ClipboardCheck, BarChart3, Briefcase, Star, MessagesSquare, Gem } from "lucide-react";

// Destinos principais do site — a barra lateral (computador) e o menu do celular usam a mesma lista.
export function destinosPrincipais(user) {
  return [
    { to: "/", label: "Início", icon: Home },
    user?.teste_feito
      ? { to: "/resultado", label: "Meu resultado", icon: BarChart3 }
      : { to: user ? "/teste" : "/register", label: "Teste de perfil", icon: ClipboardCheck, marca: "/teste" },
    { to: "/profissoes", label: "Profissões", icon: Briefcase },
    { to: "/famosos", label: "Famosos", icon: Star },
    { to: "/comunidade", label: "Comunidade", icon: MessagesSquare },
    { to: "/planos", label: "Planos", icon: Gem, novo: true },
  ];
}

// "/" só vale na página inicial; o resto vale também nas subpáginas (/profissoes/12)
export function estaAtivo(pathname, destino) {
  const alvo = destino.marca || destino.to;
  return alvo === "/" ? pathname === "/" : pathname === alvo || pathname.startsWith(alvo + "/");
}
