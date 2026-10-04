import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowRight, CheckCircle2, TrendingUp, Check, Briefcase, MessagesSquare, Info } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageLoading } from "@/components/layout/Page";
import { marcarMarco } from "@/utils/progresso";
import { PERFIS, ORDEM_EIXOS } from "@/data/perfis";

// O texto do perfil (server/perfisTeste.js) vem em Markdown:
// "## Seu perfil: X", um parágrafo de introdução e blocos "**Título**" seguidos de lista ou parágrafo.
// Aqui ele vira partes separadas para cada uma ganhar seu próprio visual.
function separarTexto(texto = "") {
  const titulo = texto.match(/^##\s*Seu perfil:\s*(.+)$/m);
  const corpo = titulo ? texto.replace(titulo[0], "") : texto;
  const pedacos = corpo.split(/^\*\*(.+?)\*\*\s*$/m);
  const blocos = {};
  for (let i = 1; i < pedacos.length; i += 2) blocos[pedacos[i].trim()] = pedacos[i + 1].trim();
  const itens = (s = "") => s.split("\n").map((l) => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
  return {
    perfil: titulo ? titulo[1].trim() : null,
    intro: pedacos[0].trim(),
    fortes: itens(blocos["Pontos fortes"]),
    desenvolver: itens(blocos["Áreas de desenvolvimento"]),
    estilo: blocos["Estilo de trabalho preferido"] || "",
    carreiras: itens(blocos["Carreiras recomendadas"]),
    entendeu: Object.keys(blocos).length >= 3,
  };
}

const markdown = {
  p: ({ children }) => <p className="text-[15px] text-foreground/85 leading-relaxed mb-4">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 mb-5 text-[15px] text-foreground/85">{children}</ul>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold text-foreground mt-6 mb-2">{children}</h3>,
};

function Lista({ icon: Icon, titulo, itens, cor }) {
  return (
    <section className="rounded-2xl bg-card border border-border p-6">
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${cor}`}>
          <Icon className="w-4 h-4" />
        </span>
        {titulo}
      </h2>
      <ul className="mt-5 space-y-3">
        {itens.map((i) => (
          <li key={i} className="flex gap-3 text-[15px] text-foreground/85 leading-snug">
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}

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

  const r = separarTexto(user.perfil_resultado);
  const eixo = ORDEM_EIXOS.find((e) => PERFIS[e].nome === r.perfil);
  const pontuacao = user.perfil_pontuacao; // pode faltar para quem fez o teste antes do gráfico existir
  const escolhida = profissoes.find((p) => String(p.id) === String(user.profissao_escolhida));
  const primeiroNome = (user.apelido || user.nome || "").split(" ")[0];

  return (
    <div>
      {/* destaque do perfil */}
      <section className="relative overflow-hidden bg-[#0f2e26] text-[#f8f0e6]">
        <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/3 -bottom-40 w-96 h-96 rounded-full bg-highlight/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f8f0e6]/60">
              {primeiroNome ? `${primeiroNome}, seu perfil é` : "Seu perfil é"}
            </p>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-[-0.035em] leading-[0.95]">
              {r.perfil ? (
                <span className="font-serif font-normal italic tracking-normal text-highlight">{r.perfil}</span>
              ) : (
                "Seu resultado"
              )}
            </h1>
            {eixo && (
              <p className="mt-5 text-xl text-[#f8f0e6]/85 max-w-lg">{PERFIS[eixo].resumo}</p>
            )}
            {eixo && (
              <span className="mt-6 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white/10 text-sm font-medium">
                Traço dominante: <strong className="font-semibold">{PERFIS[eixo].traco}</strong>
              </span>
            )}
          </div>

          {pontuacao && (
            <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-7 backdrop-blur">
              <p className="text-sm font-semibold text-[#f8f0e6]">Seus quatro traços</p>
              <div className="mt-6 space-y-5">
                {ORDEM_EIXOS.map((e) => (
                  <div key={e}>
                    <div className="flex items-baseline justify-between">
                      <span className={`text-sm font-semibold ${e === eixo ? "text-[#f8f0e6]" : "text-[#f8f0e6]/70"}`}>
                        {PERFIS[e].traco}
                        <span className="ml-2 text-xs font-normal text-[#f8f0e6]/50">{PERFIS[e].nome}</span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums">{pontuacao[e]}%</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${PERFIS[e].cor}`} style={{ width: `${pontuacao[e]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div className="min-w-0 space-y-6">
          {r.entendeu ? (
            <>
              {r.intro && <p className="text-xl text-foreground leading-relaxed text-pretty">{r.intro}</p>}
              <div className="grid md:grid-cols-2 gap-5">
                {r.fortes.length > 0 && (
                  <Lista icon={CheckCircle2} titulo="Pontos fortes" itens={r.fortes} cor="bg-secondary/15 text-secondary" />
                )}
                {r.desenvolver.length > 0 && (
                  <Lista icon={TrendingUp} titulo="Para desenvolver" itens={r.desenvolver} cor="bg-highlight/25 text-[#8a5a12]" />
                )}
              </div>
              {r.estilo && (
                <section className="rounded-2xl bg-cream-2 border border-border p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Estilo de trabalho preferido</p>
                  <p className="mt-3 text-lg text-foreground leading-relaxed text-pretty">{r.estilo}</p>
                </section>
              )}
              {r.carreiras.length > 0 && (
                <section className="rounded-2xl bg-card border border-border p-6">
                  <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
                    <span className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    Carreiras que combinam com você
                  </h2>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {r.carreiras.map((c) => (
                      <li key={c} className="px-3.5 py-2 rounded-xl bg-muted text-sm font-medium text-foreground">{c}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <article className="rounded-2xl bg-card border border-border p-6 sm:p-8">
              <ReactMarkdown components={markdown}>{user.perfil_resultado || ""}</ReactMarkdown>
            </article>
          )}

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-4 h-4 shrink-0" />
            Resultado inspirado no modelo DISC. Use como ponto de partida para se conhecer, não como uma regra sobre o
            que você pode ou não fazer.
          </p>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {escolhida ? (
            <Link to={`/profissoes/${escolhida.id}`} className="group block p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
              <p className="mt-3 text-sm text-muted-foreground">Sua profissão escolhida</p>
              <p className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                {escolhida.icone} {escolhida.nome}
              </p>
            </Link>
          ) : (
            <Link to="/profissoes" className="group block p-6 rounded-2xl bg-card border border-border shadow-soft-lg hover:border-foreground/15 transition-colors">
              <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-foreground" strokeWidth={1.8} />
              </span>
              <p className="mt-4 font-heading text-lg font-bold text-foreground">Próximo passo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore as profissões com esse perfil em mente e escolha a que mais combina com você.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                Explorar profissões <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
          <Link to="/comunidade" className="group block p-6 rounded-2xl bg-card border border-border hover:border-foreground/15 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MessagesSquare className="w-5 h-5 text-foreground" strokeWidth={1.8} />
            </span>
            <p className="mt-4 font-heading text-lg font-bold text-foreground">Converse com quem entende</p>
            <p className="mt-1 text-sm text-muted-foreground">Conte seu resultado na comunidade e troque ideias.</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Ir para a comunidade <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
