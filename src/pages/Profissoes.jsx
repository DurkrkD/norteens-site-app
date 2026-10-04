import React, { useState, useEffect } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { Search, Briefcase, Plus, X, Compass, ArrowRight } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import CardProfissao from "@/components/profissoes/CardProfissao";
import { marcarMarco } from "@/utils/progresso";
import { isEquipe } from "@/utils/papeis";

// tira acentos para a busca achar "medico" em "Médico"
const normalizar = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// maior valor em reais escrito no texto livre do salário ("R$ 4.000 a R$ 18.000+" -> 18000)
const maiorSalario = (texto) =>
  Math.max(0, ...((texto || "").match(/\d{1,3}(?:\.\d{3})+|\d+/g) || []).map((n) => Number(n.replace(/\./g, ""))));

const ORDENS = {
  nome: { label: "Nome (A–Z)", comparar: (a, b) => a.nome.localeCompare(b.nome, "pt-BR") },
  salario: { label: "Maior faixa salarial", comparar: (a, b) => maiorSalario(b.salario) - maiorSalario(a.salario) },
};

export default function Profissoes() {
  const { user, setUser } = useOutletContext();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const busca = searchParams.get("q") || "";
  const ordem = ORDENS[searchParams.get("ordem")] ? searchParams.get("ordem") : "nome";

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

  const atualizar = (mudancas) => {
    const novo = { q: busca, ordem, ...mudancas };
    const params = {};
    if (novo.q) params.q = novo.q;
    if (novo.ordem !== "nome") params.ordem = novo.ordem;
    setSearchParams(params, { replace: true });
  };

  const filtradas = profissoes
    .filter((p) => normalizar(p.nome).includes(normalizar(busca)) || normalizar(p.descricao).includes(normalizar(busca)))
    .sort(ORDENS[ordem].comparar);

  if (loading) return <PageLoading />;

  const mostrarConviteTeste = !isEquipe(user) && !user?.teste_feito;

  return (
    <div>
      {/* cabeçalho em faixa */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Guia vocacional</p>
          <h1 className="mt-3 text-[2.4rem] sm:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance max-w-3xl">
            Conheça cada carreira{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">por dentro.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
            O que a pessoa faz no dia a dia, que formação precisa, quais competências usa e quanto ganha.
          </p>

          {profissoes.length > 0 && (
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar por nome ou palavra-chave, ex: dados, design..."
                value={busca}
                onChange={(e) => atualizar({ q: e.target.value })}
                aria-label="Buscar profissão"
                className="w-full h-14 pr-12 pl-[3.25rem] rounded-2xl bg-card border border-border shadow-soft text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {busca && (
                <button
                  onClick={() => atualizar({ q: "" })}
                  aria-label="Limpar busca"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
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
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtradas.length}</span>{" "}
                {filtradas.length === 1 ? "profissão" : "profissões"}
                {busca && <> para “{busca}”</>}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Ordenar por</span>
                <select
                  value={ordem}
                  onChange={(e) => atualizar({ ordem: e.target.value })}
                  className="h-9 pl-3 pr-8 rounded-full bg-card border border-border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {Object.entries(ORDENS).map(([id, o]) => (
                    <option key={id} value={id}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {mostrarConviteTeste && !busca && (
              <Link
                to={user ? "/teste" : "/register"}
                className="group mb-6 flex items-center gap-4 rounded-2xl bg-[#0f2e26] text-[#f8f0e6] px-5 py-4 sm:px-6 hover:bg-[#0b241d] transition-colors"
              >
                <span className="w-10 h-10 rounded-xl bg-highlight/20 text-highlight flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold">Não sabe por onde começar?</span>
                  <span className="block text-sm text-[#f8f0e6]/70">
                    Faça o teste comportamental grátis e veja quais carreiras combinam com seu perfil.
                  </span>
                </span>
                <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            {filtradas.length === 0 ? (
              <EmptyState
                icon={Search}
                title={`Nada encontrado para “${busca}”`}
                description="Tente outro termo ou limpe a busca para ver todas."
                action={<Button variant="outline" onClick={() => atualizar({ q: "" })}>Limpar busca</Button>}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtradas.map((p) => (
                  <CardProfissao key={p.id} profissao={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
