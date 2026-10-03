import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { norteens } from "@/api/norteensClient";
import { ArrowLeft, GraduationCap, Brain, Star, MapPin, Wrench, CheckCircle2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PageContainer, PageLoading, EmptyState } from "@/components/layout/Page";
import { isEquipe } from "@/utils/papeis";

function Secao({ icon: Icon, titulo, children }) {
  return (
    <section className="p-6 bg-card rounded-2xl border border-border">
      <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5 mb-3">
        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Etiquetas({ itens, cor }) {
  return (
    <div className="flex flex-wrap gap-2">
      {itens.map((t) => (
        <span key={t} className={`px-3 py-1 text-xs font-medium rounded-full ${cor}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function ProfissaoDetalhe() {
  const { id } = useParams();
  const { user, setUser } = useOutletContext();
  const { toast } = useToast();
  const [profissao, setProfissao] = useState(null);
  const [famosos, setFamosos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([norteens.getProfissao(id), norteens.getFamosos(id)])
      .then(([p, f]) => {
        setProfissao(p);
        setFamosos(f);
      })
      .catch(() => setProfissao(null))
      .finally(() => setLoading(false));
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
  const temListas = profissao.tecnicas?.length || profissao.regioes?.length || profissao.ferramentas?.length;

  return (
    <PageContainer>
      <Link
        to="/profissoes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Todas as profissões
      </Link>

      {/* cabeçalho da ficha */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center text-4xl shrink-0">
          {profissao.icone || "💼"}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent mb-1.5">Ficha da profissão</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">{profissao.nome}</h1>
          {profissao.salario && (
            <span className="inline-block mt-3 text-sm font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              {profissao.salario}
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-5">
          {profissao.descricao && (
            <p className="text-[17px] text-foreground/90 leading-relaxed whitespace-pre-line">{profissao.descricao}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {profissao.formacao && (
              <Secao icon={GraduationCap} titulo="Formação">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{profissao.formacao}</p>
              </Secao>
            )}
            {profissao.comportamentais && (
              <Secao icon={Brain} titulo="Competências comportamentais">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profissao.comportamentais}
                </p>
              </Secao>
            )}
          </div>

          {temListas ? (
            <div className="grid sm:grid-cols-3 gap-5">
              {profissao.tecnicas?.length > 0 && (
                <Secao icon={Star} titulo="Técnicas">
                  <Etiquetas itens={profissao.tecnicas} cor="bg-primary/10 text-primary" />
                </Secao>
              )}
              {profissao.regioes?.length > 0 && (
                <Secao icon={MapPin} titulo="Onde há vagas">
                  <Etiquetas itens={profissao.regioes} cor="bg-secondary/10 text-secondary" />
                </Secao>
              )}
              {profissao.ferramentas?.length > 0 && (
                <Secao icon={Wrench} titulo="Ferramentas">
                  <Etiquetas itens={profissao.ferramentas} cor="bg-accent/15 text-accent" />
                </Secao>
              )}
            </div>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {user && escolhida && (
            <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
              <CheckCircle2 className="w-6 h-6 text-secondary mb-2" />
              <p className="font-heading font-semibold text-foreground">Esta é a sua profissão escolhida</p>
              <p className="text-sm text-muted-foreground mt-1">Ela aparece no seu resultado.</p>
            </div>
          )}
          {user && !user.profissao_escolhida && !isEquipe(user) && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
              <p className="font-heading font-semibold text-foreground">Essa profissão combina com você?</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Marque como sua escolha. Atenção: depois não dá para trocar.
              </p>
              <Button onClick={handleEscolher} disabled={choosing} className="w-full">
                {choosing ? "Salvando..." : "Escolher esta profissão"}
              </Button>
            </div>
          )}
          {!user && (
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="font-heading font-semibold text-foreground">Combina com você?</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Crie sua conta, faça o teste e descubra seu perfil.
              </p>
              <Button asChild className="w-full">
                <Link to="/register">Criar conta grátis</Link>
              </Button>
            </div>
          )}

          {famosos.length > 0 && (
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
                Quem inspira nessa área
              </p>
              <ul className="space-y-4">
                {famosos.map((f) => (
                  <li key={f.id} className="flex gap-3">
                    <span className="w-9 h-9 rounded-full bg-accent/15 text-accent font-semibold text-sm flex items-center justify-center shrink-0">
                      {f.nome?.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{f.nome}</p>
                      {f.bio && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">{f.bio}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </PageContainer>
  );
}
