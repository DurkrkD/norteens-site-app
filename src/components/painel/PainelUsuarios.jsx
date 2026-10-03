import React, { useState, useEffect } from "react";
import { Search, Users, CheckCircle2, Circle } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import UserAvatar from "@/components/UserAvatar";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { SecaoHeader, Lista } from "@/components/painel/ui";
import { PAPEIS } from "@/utils/papeis";

export default function PainelUsuarios({ user }) {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    norteens
      .listarUsuarios()
      .then(setUsuarios)
      .catch((e) => toast({ title: e.message || "Erro ao carregar usuários.", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const mudarPapel = async (u, papel) => {
    try {
      const atualizado = await norteens.mudarPapel(u.id, papel);
      setUsuarios((lista) => lista.map((x) => (x.id === u.id ? atualizado : x)));
      toast({ title: `${u.nome || u.email} agora é ${PAPEIS[papel].label}.` });
    } catch (err) {
      toast({ title: err.message || "Erro ao mudar papel.", variant: "destructive" });
    }
  };

  if (loading) return <PageLoading />;

  const termo = busca.toLowerCase();
  const visiveis = usuarios.filter(
    (u) =>
      (filtro === "todos" || u.papel === filtro) &&
      ((u.nome || "").toLowerCase().includes(termo) || (u.email || "").toLowerCase().includes(termo))
  );

  return (
    <div>
      <SecaoHeader titulo="Usuários" descricao="Todas as contas da plataforma. Aqui você define quem é aluno, ARP ou admin." />

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {Object.entries(PAPEIS).map(([id, p]) => (
          <div key={id} className="px-4 py-3 rounded-xl bg-card border border-border">
            <p className="text-sm font-semibold text-foreground">
              {p.label} <span className="text-muted-foreground font-normal">· {usuarios.filter((u) => u.papel === id).length}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.descricao}</p>
          </div>
        ))}
      </div>

      {usuarios.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum usuário" />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou e-mail..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {[["todos", "Todos"], ...Object.entries(PAPEIS).map(([id, p]) => [id, p.label])].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setFiltro(id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${
                    filtro === id ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Lista cabecalho={<div className="grid grid-cols-[1fr_120px_110px_150px] gap-4"><span>Usuário</span><span>Teste</span><span>Cadastro</span><span>Papel</span></div>}>
            {visiveis.map((u) => {
              const souEu = u.id === user.id;
              return (
                <li key={u.id} className="px-5 py-3.5 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_110px_150px] gap-4 items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar user={u} size="md" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {u.nome || "Sem nome"} {souEu && <span className="text-xs text-muted-foreground font-normal">(você)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                  <span className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    {u.teste_feito ? (
                      <><CheckCircle2 className="w-4 h-4 text-secondary" /> Feito</>
                    ) : (
                      <><Circle className="w-4 h-4" /> Pendente</>
                    )}
                  </span>
                  <span className="hidden md:block text-sm text-muted-foreground">
                    {u.criado_em ? new Date(u.criado_em).toLocaleDateString("pt-BR") : "—"}
                  </span>
                  <Select value={u.papel} onValueChange={(v) => mudarPapel(u, v)} disabled={souEu}>
                    <SelectTrigger className="w-[140px] md:w-full h-9" title={souEu ? "Você não pode mudar o próprio papel" : undefined}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAPEIS).map(([id, p]) => (
                        <SelectItem key={id} value={id}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </li>
              );
            })}
            {visiveis.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">Ninguém encontrado com esse filtro.</li>
            )}
          </Lista>
        </>
      )}
    </div>
  );
}
