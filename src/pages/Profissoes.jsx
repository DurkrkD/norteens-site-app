import React, { useState, useEffect } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { norteens } from "@/api/norteensClient";
import { Search, ArrowRight, Briefcase, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageLoading, EmptyState } from "@/components/layout/Page";
import { marcarMarco } from "@/utils/progresso";
import { isEquipe } from "@/utils/papeis";

// tira acentos para a busca achar "medico" em "Médico"
const normalizar = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Profissoes() {
  const { user, setUser } = useOutletContext();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const busca = searchParams.get("q") || "";

  useEffect(() => {
    norteens
      .listarProfissoes()
      .then(setProfissoes)
      .catch(() => setProfissoes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && !user.marco_profissoes) {
      marcarMarco(user, setUser, "marco_profissoes");
    }
  }, [user, setUser]);

  const setBusca = (valor) => setSearchParams(valor ? { q: valor } : {}, { replace: true });

  const filtradas = profissoes.filter(
    (p) => normalizar(p.nome).includes(normalizar(busca)) || normalizar(p.descricao).includes(normalizar(busca))
  );

  if (loading) return <PageLoading />;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Guia vocacional"
        title="Profissões"
        description="Fichas honestas de cada carreira: o que faz, formação, competências e quanto ganha."
      />

      {profissoes.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-11"
              aria-label="Buscar profissão"
            />
          </div>
          <p className="text-sm text-muted-foreground sm:ml-auto">
            {filtradas.length} de {profissoes.length} {profissoes.length === 1 ? "profissão" : "profissões"}
          </p>
        </div>
      )}

      {profissoes.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Nenhuma profissão cadastrada ainda"
          description="As fichas de carreira aparecem aqui assim que a equipe da Norteens publicar."
          action={
            isEquipe(user) && (
              <Button asChild>
                <Link to="/painel/profissoes">
                  <Plus /> Cadastrar profissão
                </Link>
              </Button>
            )
          }
        />
      ) : filtradas.length === 0 ? (
        <EmptyState
          icon={Search}
          title={`Nada encontrado para “${busca}”`}
          description="Tente outro termo ou limpe a busca para ver todas."
          action={<Button variant="outline" onClick={() => setBusca("")}>Limpar busca</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtradas.map((p) => (
            <Link
              key={p.id}
              to={`/profissoes/${p.id}`}
              className="group flex flex-col p-6 bg-card rounded-2xl border border-border hover:border-primary/25 hover:shadow-soft-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl mb-4">
                {p.icone || "💼"}
              </div>
              <h2 className="text-lg font-semibold text-foreground">{p.nome}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                {p.descricao || "Ficha em construção."}
              </p>
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                {p.salario ? (
                  <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full truncate">
                    {p.salario}
                  </span>
                ) : (
                  <span />
                )}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground shrink-0">
                  Ver ficha
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
