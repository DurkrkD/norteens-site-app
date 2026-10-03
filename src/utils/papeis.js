// Papéis de usuário (iguais aos do backend: usuarios.papel)
//   usuario -> aluno
//   arp     -> mentor: cuida do conteúdo (profissões, famosos) e lê os feedbacks
//   admin   -> tudo do ARP + usuários e papéis
export const PAPEIS = {
  usuario: { label: "Aluno", descricao: "Usa a plataforma" },
  arp: { label: "ARP", descricao: "Cuida do conteúdo e lê os feedbacks" },
  admin: { label: "Admin", descricao: "Acesso total, inclusive usuários" },
};

export const isAdmin = (user) => user?.papel === "admin";
export const isEquipe = (user) => user?.papel === "arp" || user?.papel === "admin";
