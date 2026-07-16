import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { marcarMarco } from "@/utils/progresso";

export default function Profissoes() {
  const { user, setUser } = useOutletContext();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    base44.entities.Profissao.list().then((data) => {
      setProfissoes(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user && !user.marco_profissoes) {
      marcarMarco(user, setUser, "marco_profissoes");
    }
  }, [user, setUser]);

  const filtered = profissoes.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-accent mb-2">Profissões</h1>
      <p className="text-muted-foreground mb-8">Explore carreiras e descubra qual combina com você.</p>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar profissão..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Nenhuma profissão encontrada.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/profissoes/${p.id}`}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{p.icone || "💼"}</div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {p.nome}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{p.descricao}</p>
              {p.salario && (
                <p className="mt-3 text-sm font-medium text-secondary">{p.salario}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}