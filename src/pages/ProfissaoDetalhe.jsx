import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { ChevronRight, GraduationCap, Brain, Star, MapPin, Wrench, CheckCircle2, SearchX, Wallet, ArrowRight } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PageContainer, PageLoading, EmptyState } from "@/components/layout/Page";
import CardProfissao from "@/components/profissoes/CardProfissao";
import { isEquipe } from "@/utils/papeis";
import { useOfertas } from "@/components/ofertas/useOfertas";
import { ChamadaMentoria } from "@/components/ofertas/Cartoes";

// bloco de conteúdo da ficha: título com ícone + texto, separado por linha
function Bloco({ icon: Icon, titulo, children }) {
  return (
    <section className="py-8 border-t border-border first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-3 text-xl font-bold text-foreground">
        <span className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
        </span>
        {titulo}
      </h2>
      <div className="mt-4 pl-12">{children}</div>
    </section>
  );
}

// listas cadastradas podem vir separadas por vírgula OU uma por linha: aqui viram itens separados
const itensDe = (lista) =>
  (lista || []).flatMap((s) => String(s).split(/\n+/)).map((s) => s.trim().replace(/[.;]$/, "")).filter(Boolean);

function Etiquetas({ itens }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {itens.map((t) => (
        <li key={t} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-card border border-border text-foreground">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Fato({ icon: Icon, rotulo, valor }) {
  if (!valor) return null;
  return (
    <div className="flex-1 min-w-[180px] rounded-2xl bg-card border border-border px-5 py-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="w-3.5 h-3.5" /> {rotulo}
      </p>
      <p className="mt-1.5 font-semibold text-foreground leading-snug">{valor}</p>
    </div>
  );
}

export default function ProfissaoDetalhe() {
  const { id } = useParams();
  const { user, setUser } = useOutletContext();
  const temMentoria = useOfertas().mentorias.length > 0;
  const { toast } = useToast();
  const [profissao, setProfissao] = useState(null);
  const [famosos, setFamosos] = useState([]);
  const [outras, setOutras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    Promise.all([norteens.getProfissao(id), norteens.getFamosos(id)])
      .then(([p, f]) => {
        setProfissao(p);
        setFamosos(f);
      })
      .catch(() => setProfissao(null))
      .finally(() => setLoading(false));
    norteens
      .listarProfissoes()
      .then((todas) => setOutras(todas.filter((p) => String(p.id) !== String(id)).slice(0, 3)))
      .catch(() => {});
  }, [id]);

  const handleEscolher = async () => {
    if (!user || user.profissao_escolhida) return;
    setChoosing(true);
    try {
      const atualizado = await norteens.updateMe({ profissao_escolhida: Number(id) });
      setUser(atualizado);
      toast({ title: "Profissão escolhida!", description: `Você escolheu ${profissao.nome}.` });
    } catch {
      toast({ title: "Não foi possível salvar sua escolha.", variant: "destructive" });
    }
    setChoosing(false);
  };

  if (loading) return <PageLoading />;

  if (!profissao) {
    return (
      <PageContainer size="md">
        <EmptyState
          icon={SearchX}
          title="Profissão não encontrada"
          description="Ela pode ter sido removida ou o link está incorreto."
          action={
            <Button asChild variant="outline">
              <Link to="/profissoes">Ver todas as profissões</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const escolhida = user && String(user.profissao_escolhida) === String(profissao.id);
  const p = profissao;
  const tecnicas = itensDe(p.tecnicas);
  const regioes = itensDe(p.regioes);
  const ferramentas = itensDe(p.ferramentas);

  return (
    <div>
      {/* cabeçalho */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pb-12">
          <nav aria-label="Caminho" className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/profissoes" className="hover:text-foreground transition-colors">Profissões</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate">{p.nome}</span>
          </nav>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-20 h-20 rounded-3xl bg-card border border-border shadow-soft-lg flex items-center justify-center text-5xl shrink-0">
              {p.icone || "💼"}
            </div>
            <div className="min-w-0">
              <h1 className="text-[2.2rem] sm:text-5xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance">
                {p.nome}
              </h1>
              {p.descricao && (
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line text-pretty">
                  {p.descricao}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Fato icon={Wallet} rotulo="Faixa salarial" valor={p.salario} />
            <Fato icon={MapPin} rotulo="Onde há vagas" valor={regioes.length ? `${regioes.length} ${regioes.length === 1 ? "área de atuação" : "áreas de atuação"}` : null} />
            <Fato icon={Star} rotulo="Habilidades técnicas" valor={tecnicas.length ? `${tecnicas.length} principais` : null} />
            <Fato icon={Wrench} rotulo="Ferramentas" valor={ferramentas.length ? `${ferramentas.length} do dia a dia` : null} />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-12 items-start">
        <article>
          {p.formacao && (
            <Bloco icon={GraduationCap} titulo="Formação">
              <p className="text-[15px] text-foreground/85 leading-relaxed whitespace-pre-line">{p.formacao}</p>
            </Bloco>
          )}
          {p.comportamentais && (
            <Bloco icon={Brain} titulo="Competências comportamentais">
              <p className="text-[15px] text-foreground/85 leading-relaxed whitespace-pre-line">{p.comportamentais}</p>
            </Bloco>
          )}
          {tecnicas.length > 0 && (
            <Bloco icon={Star} titulo="Habilidades técnicas">
              <Etiquetas itens={tecnicas} />
            </Bloco>
          )}
          {ferramentas.length > 0 && (
            <Bloco icon={Wrench} titulo="Ferramentas do dia a dia">
              <Etiquetas itens={ferramentas} />
            </Bloco>
          )}
          {regioes.length > 0 && (
            <Bloco icon={MapPin} titulo="Onde há vagas">
              <Etiquetas itens={regioes} />
            </Bloco>
          )}
          {!p.formacao && !p.comportamentais && !tecnicas.length && !ferramentas.length && !regioes.length && (
            <p className="text-muted-foreground">Os detalhes desta ficha ainda estão sendo preparados.</p>
          )}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-8">
          {user && escolhida && (
            <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
              <CheckCircle2 className="w-6 h-6 text-secondary mb-3" />
              <p className="font-heading font-bold text-foreground">Esta é a sua profissão escolhida</p>
              <p className="text-sm text-muted-foreground mt-1">Ela aparece no seu resultado.</p>
            </div>
          )}
          {user && !user.profissao_escolhida && !isEquipe(user) && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-soft-lg">
              <p className="font-heading text-lg font-bold text-foreground">Essa profissão combina com você?</p>
              <p className="text-sm text-muted-foreground mt-1.5 mb-5">
                Marque como sua escolha para acompanhar no seu resultado. Depois não dá para trocar.
              </p>
              <Button onClick={handleEscolher} disabled={choosing} size="lg" className="w-full">
                {choosing ? "Salvando..." : "Escolher esta profissão"}
              </Button>
            </div>
          )}
          {!user && (
            <div className="p-6 rounded-2xl bg-[#0f2e26] text-[#f8f0e6]">
              <p className="font-heading text-lg font-bold">Combina com você?</p>
              <p className="text-sm text-[#f8f0e6]/70 mt-1.5 mb-5">
                Faça o teste e descubra seu perfil em 3 minutos.
              </p>
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 h-12 rounded-full bg-[#f8f0e6] text-[#0f2e26] font-semibold hover:bg-white transition-colors"
              >
                Começar agora <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}

          {famosos.length > 0 && (
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                Quem inspira nessa área
              </p>
              <ul className="space-y-5">
                {famosos.map((f, i) => (
                  <li key={f.id} className="flex gap-3">
                    {f.foto_url ? (
                      <img src={f.foto_url} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover object-top shrink-0" />
                    ) : (
                      <span
                        className={`w-10 h-10 rounded-full font-heading font-bold flex items-center justify-center shrink-0 ${
                          ["bg-accent/15 text-accent", "bg-secondary/15 text-secondary", "bg-highlight/25 text-[#8a5a12]"][i % 3]
                        }`}
                      >
                        {f.nome?.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{f.nome}</p>
                      {f.bio && <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-3">{f.bio}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {temMentoria && <ChamadaMentoria />}
        </aside>
      </div>

      {outras.length > 0 && (
        <section className="border-t border-border bg-cream-2/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Continue explorando</h2>
              <Link to="/profissoes" className="text-sm font-semibold text-foreground hover:text-accent transition-colors">
                Ver todas
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {outras.map((o) => (
                <CardProfissao key={o.id} profissao={o} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
