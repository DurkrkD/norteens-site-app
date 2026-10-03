import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Compass, ArrowRight, CheckCircle2 } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageLoading } from "@/components/layout/Page";
import { marcarMarco } from "@/utils/progresso";

// Estilos do texto do perfil (o projeto não usa o plugin de "prose" do Tailwind)
const markdown = {
  h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mt-2 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-[15px] text-foreground/85 leading-relaxed mb-4">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  ul: ({ children }) => <ul className="space-y-2 mb-6">{children}</ul>,
  li: ({ children }) => (
    <li className="flex gap-2.5 text-[15px] text-foreground/85 leading-relaxed">
      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
      <span>{children}</span>
    </li>
  ),
};

export default function Resultado() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.teste_feito) { navigate("/teste"); return; }
    norteens
      .listarProfissoes()
      .then(setProfissoes)
      .catch(() => setProfissoes([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.teste_feito && !user.marco_resultado) {
      marcarMarco(user, setUser, "marco_resultado");
    }
  }, [user, setUser]);

  if (!user || loading) return <PageLoading />;

  // o texto começa com "## Seu perfil: <Nome>" — destacamos o nome e mostramos o resto abaixo
  const texto = user.perfil_resultado || "";
  const titulo = texto.match(/^##\s*Seu perfil:\s*(.+)$/m);
  const perfil = titulo ? titulo[1].trim() : null;
  // linhas que são só "**Assim**" viram subtítulo (no texto salvo, algumas vêm coladas no parágrafo seguinte)
  const corpo = (titulo ? texto.replace(titulo[0], "").trim() : texto).replace(/^\*\*(.+?)\*\*\s*$/gm, "\n### $1\n");

  const escolhida = profissoes.find((p) => String(p.id) === String(user.profissao_escolhida));
  const primeiroNome = (user.apelido || user.nome || "").split(" ")[0];

  return (
    <PageContainer size="md">
      <PageHeader
        eyebrow="Seu resultado"
        title={primeiroNome ? `${primeiroNome}, este é o seu perfil` : "Este é o seu perfil"}
        description="Baseado nas suas respostas do teste comportamental."
      />

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <article className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          {perfil && (
            <div className="px-6 sm:px-8 py-6 bg-[#0f2e26] text-[#f8f0e6] flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-highlight/20 text-highlight flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f8f0e6]/60">Seu perfil</p>
                <p className="font-heading text-2xl font-semibold">{perfil}</p>
              </div>
            </div>
          )}
          <div className="p-6 sm:p-8">
            <ReactMarkdown components={markdown}>{corpo}</ReactMarkdown>
          </div>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {escolhida ? (
            <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
              <CheckCircle2 className="w-6 h-6 text-secondary mb-2" />
              <p className="text-sm text-muted-foreground">Sua profissão escolhida</p>
              <Link
                to={`/profissoes/${escolhida.id}`}
                className="font-heading text-lg font-semibold text-foreground hover:text-accent transition-colors"
              >
                {escolhida.icone} {escolhida.nome}
              </Link>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="font-heading font-semibold text-foreground">Próximo passo</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Explore as profissões com esse perfil em mente e escolha a que mais combina com você.
              </p>
              <Button asChild className="w-full">
                <Link to="/profissoes">
                  Explorar profissões <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <p className="font-heading font-semibold text-foreground">Converse com quem entende</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Leve seu resultado para a comunidade e troque ideias com outros jovens.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/comunidade">Ir para a comunidade</Link>
            </Button>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
