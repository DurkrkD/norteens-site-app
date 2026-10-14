import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, Briefcase, MessagesSquare, Info } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageLoading } from "@/components/layout/Page";
import { marcarMarco } from "@/utils/progresso";
import { PERFIS, ORDEM_EIXOS } from "@/data/perfis";
import { useOfertas } from "@/components/ofertas/useOfertas";
import { OfertaDiscCompacta } from "@/components/ofertas/Cartoes";
import TituloRevelado from "@/components/TituloRevelado";
import Revelar, { Cascata, ItemCascata } from "@/components/Revelar";
import Contador from "@/components/Contador";
import Parallax from "@/components/Parallax";
import { EASE_SAIDA, useCelular } from "@/lib/movimento";

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

const normalizar = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const palavras = (s) => (s || "").split(/[^\p{L}]+/u).filter((w) => w.length >= 5);

// Leva o cartão da carreira para a busca de profissões. A recomendação fala da área ("Psicologia",
// "Jornalismo") e o cadastro, da profissão ("Psicólogo", "Jornalista"): compara pelo radical (6 letras)
// e busca pela palavra como ela aparece no nome da profissão (nas descrições casaria com qualquer
// "público" ou "comunicar"). Sem nenhuma profissão parecida, o cartão fica sem link.
function buscaDaCarreira(carreira, profissoes) {
  const radicais = palavras(carreira).map((w) => normalizar(w).slice(0, 6));
  for (const p of profissoes) {
    const achada = palavras(p.nome).find((w) => radicais.some((r) => normalizar(w).startsWith(r)));
    if (achada) return achada;
  }
  return null;
}

// Cores dos traços sobre o verde-escuro da abertura. As do tema (ex.: o verde de Estabilidade)
// somem nesse fundo, então aqui cada traço tem uma versão clara própria; a rosca usa as mesmas.
const COR_NO_ESCURO = { D: "#ee8a69", I: "#f4bd4f", S: "#5fc796", C: "#74afe3" };

// barra de um traço: cresce do zero e a porcentagem conta junto quando aparece na tela.
// Quem é observado é o trilho (largura cheia): a barra começa com largura zero, e um elemento sem área
// pode nunca ser dado como visível pelo navegador, deixando a barra vazia.
function BarraTraco({ eixo, valor, dominante, ordem }) {
  const reduzir = useReducedMotion();
  const celular = useCelular();
  const p = PERFIS[eixo];
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className={`text-sm font-semibold ${dominante ? "text-[#f8f0e6]" : "text-[#f8f0e6]/70"}`}>
          {p.traco}
          <span className="ml-2 text-xs font-normal text-[#f8f0e6]/50">{p.nome}</span>
        </span>
        <span className="text-sm font-semibold tabular-nums">
          <Contador valor={valor} duracao={celular ? 700 : 1100} />%
        </span>
      </div>
      <motion.div
        className="mt-2 h-2.5 rounded-full bg-white/10 overflow-hidden"
        initial={reduzir ? "visivel" : "oculto"}
        whileInView="visivel"
        viewport={{ once: true }}
      >
        <motion.div
          className="h-full rounded-full origin-left"
          style={{ width: `${valor}%`, backgroundColor: COR_NO_ESCURO[eixo] }}
          variants={{
            oculto: { scaleX: 0 },
            visivel: { scaleX: 1, transition: { duration: celular ? 0.7 : 1.1, ease: EASE_SAIDA, delay: 0.3 + ordem * (celular ? 0.06 : 0.12) } },
          }}
        />
      </motion.div>
    </div>
  );
}

// "Pizza" (rosca) com o peso de cada traço no perfil: as quatro porcentagens divididas pela soma.
// Cada fatia se desenha em sequência quando a rosca aparece; no centro, o peso do traço dominante.
function RoscaTracos({ pontuacao, eixo }) {
  const reduzir = useReducedMotion();
  const celular = useCelular();
  const total = ORDEM_EIXOS.reduce((soma, e) => soma + (Number(pontuacao[e]) || 0), 0);
  if (!total) return null;

  let inicio = 0;
  const fatias = ORDEM_EIXOS.map((e, i) => {
    const fracao = (Number(pontuacao[e]) || 0) / total;
    const fatia = { e, i, inicio, fracao, peso: Math.round(fracao * 100) };
    inicio += fracao;
    return fatia;
  });
  const dominante = fatias.find((f) => f.e === eixo);
  const descricao = fatias.map((f) => `${PERFIS[f.e].traco} ${f.peso}%`).join(", ");

  return (
    <div className="flex items-center gap-5">
      <motion.svg
        viewBox="0 0 120 120"
        className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 -rotate-90"
        role="img"
        aria-label={`Peso de cada traço no seu perfil: ${descricao}`}
        initial={reduzir ? "visivel" : "oculto"}
        whileInView="visivel"
        viewport={{ once: true }}
      >
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
        {fatias.map((f) => (
          <motion.circle
            key={f.e}
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke={COR_NO_ESCURO[f.e]}
            strokeWidth={f.e === eixo ? 18 : 14}
            // cada fatia começa onde a anterior terminou; um respiro pequeno separa as fatias
            transform={`rotate(${f.inicio * 360} 60 60)`}
            custom={f}
            variants={{
              oculto: { pathLength: 0 },
              visivel: (x) => ({
                pathLength: Math.max(x.fracao - (x.fracao > 0.03 ? 0.012 : 0), 0),
                transition: { duration: celular ? 0.5 : 0.8, ease: EASE_SAIDA, delay: 0.35 + x.i * (celular ? 0.1 : 0.18) },
              }),
            }}
          />
        ))}
      </motion.svg>
      {dominante && (
        <div className="min-w-0">
          <p className="font-heading text-4xl sm:text-5xl font-bold tabular-nums leading-none" style={{ color: COR_NO_ESCURO[eixo] }}>
            <Contador valor={dominante.peso} duracao={celular ? 700 : 1100} />%
          </p>
          <p className="mt-2 text-sm text-[#f8f0e6]/70 leading-snug">
            do seu perfil é <strong className="font-semibold text-[#f8f0e6]">{PERFIS[eixo].traco}</strong>, o traço que mais pesa.
          </p>
        </div>
      )}
    </div>
  );
}

// pontos fortes e pontos para desenvolver em abas: uma lista por vez, em vez de duas lado a lado
function DoisLados({ fortes, desenvolver }) {
  const reduzir = useReducedMotion();
  const abas = [
    fortes.length > 0 && { id: "fortes", rotulo: "Pontos fortes", itens: fortes },
    desenvolver.length > 0 && { id: "desenvolver", rotulo: "Para desenvolver", itens: desenvolver },
  ].filter(Boolean);
  const [aba, setAba] = useState(abas[0]?.id);
  const atual = abas.find((a) => a.id === aba) || abas[0];
  if (!atual) return null;

  const lista = (
    <ol className="divide-y divide-border border-y border-border">
      {atual.itens.map((item, i) => (
        <motion.li
          key={item}
          className="flex gap-5 sm:gap-8 py-5 sm:py-6"
          initial={reduzir ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_SAIDA, delay: i * 0.06 }}
        >
          <span className="font-serif italic text-2xl sm:text-3xl leading-none text-accent tabular-nums w-8 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-lg sm:text-xl text-foreground leading-snug text-pretty">{item}</span>
        </motion.li>
      ))}
    </ol>
  );

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
      <TituloRevelado as="h2" aoRolar className="text-3xl sm:text-[2.6rem] leading-[1.1] font-bold tracking-[-0.025em] text-foreground text-balance">
        Onde você brilha e <span className="font-serif font-normal italic tracking-normal text-accent">onde crescer.</span>
      </TituloRevelado>

      {abas.length > 1 && (
        <Revelar atraso={0.15} className="mt-8">
          <div role="tablist" aria-label="Pontos fortes e pontos para desenvolver" className="inline-flex p-1 rounded-full bg-muted">
            {abas.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={a.id === atual.id}
                onClick={() => setAba(a.id)}
                className={`relative h-10 px-5 rounded-full text-sm font-semibold transition-colors ${
                  a.id === atual.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.id === atual.id && (
                  <motion.span layoutId="aba-resultado" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative">
                  {a.rotulo} <span className="opacity-60 tabular-nums">{a.itens.length}</span>
                </span>
              </button>
            ))}
          </div>
        </Revelar>
      )}

      <Revelar atraso={0.2} className="mt-8">
        {reduzir ? lista : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={atual.id} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              {lista}
            </motion.div>
          </AnimatePresence>
        )}
      </Revelar>
    </section>
  );
}

export default function Resultado() {
  const { user, setUser } = useOutletContext();
  const { disc } = useOfertas();
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
      {/* abertura: o perfil em destaque e os quatro traços */}
      <section className="grao relative overflow-hidden bg-[#0f2e26] text-[#f8f0e6]">
        <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/3 -bottom-40 w-96 h-96 rounded-full bg-highlight/10 blur-3xl" />
        {/* a letra do perfil, gigante ao fundo; fica para trás na rolagem */}
        {eixo && (
          <Parallax
            velocidade={-0.12}
            aria-hidden="true"
            className="absolute -right-6 sm:right-[4%] -bottom-[0.28em] font-serif italic leading-none text-[16rem] sm:text-[24rem] lg:text-[30rem] text-[#f8f0e6]/[0.05] select-none pointer-events-none"
          >
            {eixo}
          </Parallax>
        )}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <Revelar as="p" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f8f0e6]/60">
              {primeiroNome ? `${primeiroNome}, seu perfil é` : "Seu perfil é"}
            </Revelar>
            <TituloRevelado className="mt-4 text-[3.4rem] sm:text-7xl lg:text-8xl font-bold tracking-[-0.035em] leading-[0.95]">
              {r.perfil ? (
                <span className="font-serif font-normal italic tracking-normal text-highlight">{r.perfil}</span>
              ) : (
                "Seu resultado"
              )}
            </TituloRevelado>
            {eixo && (
              <Revelar as="p" atraso={0.35} className="mt-6 text-xl sm:text-2xl text-[#f8f0e6]/85 max-w-lg text-pretty">
                {PERFIS[eixo].resumo}
              </Revelar>
            )}
            {eixo && (
              <Revelar atraso={0.45} className="mt-7">
                <span className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white/10 text-sm font-medium">
                  Traço dominante: <strong className="font-semibold">{PERFIS[eixo].traco}</strong>
                </span>
              </Revelar>
            )}
          </div>

          {pontuacao && (
            <Revelar atraso={0.2} className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-7 backdrop-blur">
              <p className="text-sm font-semibold text-[#f8f0e6]">Seus quatro traços</p>
              <div className="mt-5">
                <RoscaTracos pontuacao={pontuacao} eixo={eixo} />
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-5">
                {ORDEM_EIXOS.map((e, i) => (
                  <BarraTraco key={e} eixo={e} valor={pontuacao[e]} dominante={e === eixo} ordem={i} />
                ))}
              </div>
            </Revelar>
          )}
        </div>
      </section>

      {r.entendeu ? (
        <>
          {/* a introdução sozinha, em destaque */}
          {r.intro && (
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">
              <Revelar as="p" className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Em poucas palavras</Revelar>
              <Revelar as="p" atraso={0.1} className="mt-5 font-heading text-2xl sm:text-[2rem] leading-[1.35] font-medium tracking-[-0.015em] text-foreground text-pretty">
                {r.intro}
              </Revelar>
            </section>
          )}

          <DoisLados fortes={r.fortes} desenvolver={r.desenvolver} />

          {r.estilo && (
            <section className="bg-cream-2/70 border-y border-border">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
                <Revelar as="p" className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Onde você rende mais</Revelar>
                <Revelar as="blockquote" atraso={0.1} className="mt-6 font-serif italic text-[1.7rem] sm:text-[2.4rem] leading-[1.25] text-foreground text-balance">
                  “{r.estilo}”
                </Revelar>
              </div>
            </section>
          )}

          {r.carreiras.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
              <TituloRevelado as="h2" aoRolar className="max-w-2xl text-3xl sm:text-[2.6rem] leading-[1.1] font-bold tracking-[-0.025em] text-foreground text-balance">
                Carreiras que combinam <span className="font-serif font-normal italic tracking-normal text-accent">com você.</span>
              </TituloRevelado>
              <Cascata as="ol" className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {r.carreiras.map((c, i) => {
                  const busca = buscaDaCarreira(c, profissoes);
                  const conteudo = (
                    <>
                      <span className="font-serif italic text-xl text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="mt-6 block font-heading text-lg font-bold text-foreground leading-snug">{c}</span>
                      {busca && (
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                          <span className="sublinhado">Ver profissões</span> <ArrowUpRight className="w-4 h-4" />
                        </span>
                      )}
                    </>
                  );
                  return (
                    <ItemCascata as="li" key={c} className="flex">
                      {busca ? (
                        <Link
                          to={`/profissoes?q=${encodeURIComponent(busca)}`}
                          className="group flex-1 flex flex-col p-6 rounded-2xl bg-card border border-border transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
                        >
                          {conteudo}
                        </Link>
                      ) : (
                        <div className="flex-1 flex flex-col p-6 rounded-2xl bg-card border border-border">{conteudo}</div>
                      )}
                    </ItemCascata>
                  );
                })}
              </Cascata>
            </section>
          )}
        </>
      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <article className="rounded-2xl bg-card border border-border p-6 sm:p-8">
            <ReactMarkdown components={markdown}>{user.perfil_resultado || ""}</ReactMarkdown>
          </article>
        </div>
      )}

      {/* próximos passos: no fim da leitura, não disputando espaço com ela */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="pt-16 border-t border-border">
          <TituloRevelado as="h2" aoRolar className="text-3xl sm:text-[2.6rem] leading-[1.1] font-bold tracking-[-0.025em] text-foreground">
            E <span className="font-serif font-normal italic tracking-normal text-accent">agora?</span>
          </TituloRevelado>
          <Cascata className="mt-10 grid md:grid-cols-3 gap-5">
            <ItemCascata className="flex">
              {escolhida ? (
                <Link to={`/profissoes/${escolhida.id}`} className="group flex-1 block p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <p className="mt-3 text-sm text-muted-foreground">Sua profissão escolhida</p>
                  <p className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {escolhida.icone} {escolhida.nome}
                  </p>
                </Link>
              ) : (
                <Link to="/profissoes" className="group flex-1 block p-6 rounded-2xl bg-card border border-border shadow-soft-lg hover:border-foreground/15 transition-colors">
                  <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-foreground" strokeWidth={1.8} />
                  </span>
                  <p className="mt-4 font-heading text-lg font-bold text-foreground">Escolha uma profissão</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore as profissões com esse perfil em mente e escolha a que mais combina com você.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <span className="sublinhado">Explorar profissões</span> <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )}
            </ItemCascata>
            {disc && (
              <ItemCascata className="flex [&>div]:flex-1">
                <OfertaDiscCompacta oferta={disc} user={user} />
              </ItemCascata>
            )}
            <ItemCascata className="flex">
              <Link to="/comunidade" className="group flex-1 block p-6 rounded-2xl bg-card border border-border hover:border-foreground/15 transition-colors">
                <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <MessagesSquare className="w-5 h-5 text-foreground" strokeWidth={1.8} />
                </span>
                <p className="mt-4 font-heading text-lg font-bold text-foreground">Converse com quem entende</p>
                <p className="mt-1 text-sm text-muted-foreground">Conte seu resultado na comunidade e troque ideias.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span className="sublinhado">Ir para a comunidade</span> <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </ItemCascata>
          </Cascata>

          <p className="mt-12 flex items-start gap-2 text-xs text-muted-foreground max-w-2xl">
            <Info className="w-4 h-4 shrink-0" />
            Resultado inspirado no modelo DISC. Use como ponto de partida para se conhecer, não como uma regra sobre o
            que você pode ou não fazer.
          </p>
        </div>
      </section>
    </div>
  );
}
