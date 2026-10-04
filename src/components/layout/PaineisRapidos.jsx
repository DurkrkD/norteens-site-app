import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Star, CornerDownLeft, Check, ArrowRight, Loader2 } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { MARCOS, calcularNivel } from "@/utils/progresso";
import { PERFIS, ORDEM_EIXOS } from "@/data/perfis";
import { destinosPrincipais } from "@/components/layout/navegacao";

const TITULOS = { busca: "Buscar", jornada: "Minha jornada" };

// Painel que desliza da barra lateral por cima da página (no celular ocupa a tela toda).
// Fecha no X, no Esc, clicando fora ou ao trocar de página.
export default function PaineisRapidos({ painel, onFechar, user, recuo }) {
  useEffect(() => {
    if (!painel) return;
    const tecla = (e) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [painel, onFechar]);

  return (
    <AnimatePresence>
      {painel && (
        <>
          <motion.div
            key="fundo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onFechar}
            className="fixed inset-0 z-[55] bg-[#06140f]/30 backdrop-blur-[2px] md:left-[var(--recuo)]"
            style={{ "--recuo": `${recuo}px` }}
          />
          <motion.section
            key="painel"
            role="dialog"
            aria-modal="true"
            aria-label={TITULOS[painel]}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed z-[60] inset-0 md:inset-auto md:top-0 md:bottom-0 md:left-[var(--recuo)] md:w-[400px] flex flex-col bg-card text-foreground md:border-r border-border md:shadow-elevated"
            style={{ "--recuo": `${recuo}px`, paddingTop: "env(safe-area-inset-top)" }}
          >
            <header className="flex items-center justify-between h-[72px] px-5 shrink-0 border-b border-border">
              <h2 className="text-lg font-bold tracking-tight">{TITULOS[painel]}</h2>
              <button onClick={onFechar} aria-label="Fechar painel" className="p-2 -mr-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>
            {painel === "busca" ? <BuscaRapida user={user} onFechar={onFechar} /> : <JornadaRapida user={user} onFechar={onFechar} />}
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------- busca --------------------------------- */

// guardado entre aberturas do painel: a segunda busca já abre instantânea
let cache = null;
const normalizar = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function BuscaRapida({ user, onFechar }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [dados, setDados] = useState(cache);
  const [sel, setSel] = useState(0);
  const campo = useRef(null);
  const lista = useRef(null);

  useEffect(() => {
    campo.current?.focus();
    if (cache) return;
    Promise.all([norteens.listarProfissoes().catch(() => []), norteens.listarFamosos().catch(() => [])]).then(
      ([profissoes, famosos]) => {
        cache = { profissoes, famosos };
        setDados(cache);
      }
    );
  }, []);

  const grupos = useMemo(() => {
    const termo = normalizar(q.trim());
    const bate = (...textos) => !termo || textos.some((t) => normalizar(t).includes(termo));
    const profissoes = dados?.profissoes || [];
    const nomeProfissao = Object.fromEntries(profissoes.map((p) => [p.id, p]));

    const paginas = destinosPrincipais(user)
      .filter((d) => bate(d.label))
      .map((d) => ({ chave: "pg" + d.to, to: d.to, titulo: d.label, Icone: d.icon }));
    const profs = profissoes
      .filter((p) => bate(p.nome, p.descricao))
      .slice(0, termo ? 8 : 5)
      .map((p) => ({ chave: "pr" + p.id, to: `/profissoes/${p.id}`, titulo: p.nome, sub: p.salario, emoji: p.icone || "💼" }));
    const fams = (dados?.famosos || [])
      .filter((f) => termo && bate(f.nome, f.bio))
      .slice(0, 6)
      .map((f) => {
        const p = nomeProfissao[f.profissao_id];
        return {
          chave: "fa" + f.id,
          to: p ? `/famosos?profissao=${p.id}` : "/famosos",
          titulo: f.nome,
          sub: p ? `${p.icone || ""} ${p.nome}`.trim() : undefined,
          Icone: Star,
        };
      });

    return [
      { titulo: termo ? "Páginas" : "Ir para", itens: paginas },
      { titulo: termo ? "Profissões" : "Profissões em destaque", itens: profs },
      { titulo: "Famosos", itens: fams },
    ].filter((g) => g.itens.length);
  }, [q, dados, user]);

  const planos = grupos.flatMap((g) => g.itens);
  useEffect(() => setSel(0), [q]);

  const abrir = (item) => {
    navigate(item.to);
    onFechar();
  };

  const teclado = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, planos.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && planos[sel]) { e.preventDefault(); abrir(planos[sel]); }
  };

  // mantém o item escolhido pelo teclado visível
  useEffect(() => {
    lista.current?.querySelector(`[data-indice="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  let indice = -1;
  return (
    <>
      <div className="p-4 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
          <input
            ref={campo}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={teclado}
            placeholder="Profissão, famoso ou página..."
            aria-label="Buscar"
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted/60 border border-border text-[15px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/25 focus:bg-card"
          />
        </div>
      </div>

      <div ref={lista} className="flex-1 overflow-y-auto px-3 py-3">
        {!dados && (
          <p className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
          </p>
        )}
        {dados && planos.length === 0 && (
          <div className="px-3 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Nada encontrado para “{q}”</p>
            <p className="mt-1 text-sm text-muted-foreground">Tente outro nome ou veja todas as profissões.</p>
            <Link to="/profissoes" onClick={onFechar} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
              Ver profissões <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        {grupos.map((g) => (
          <div key={g.titulo} className="mb-3">
            <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{g.titulo}</p>
            <ul>
              {g.itens.map((item) => {
                indice += 1;
                const i = indice;
                const ativo = i === sel;
                return (
                  <li key={item.chave}>
                    <button
                      data-indice={i}
                      onClick={() => abrir(item)}
                      onMouseMove={() => setSel(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${ativo ? "bg-muted" : ""}`}
                    >
                      <span className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-lg">
                        {item.emoji || (item.Icone && <item.Icone className="w-[18px] h-[18px] text-muted-foreground" />)}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-foreground truncate">{item.titulo}</span>
                        {item.sub && <span className="block text-xs text-muted-foreground truncate">{item.sub}</span>}
                      </span>
                      {ativo && <CornerDownLeft className="w-4 h-4 text-muted-foreground shrink-0 hidden md:block" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <footer className="hidden md:flex items-center gap-4 px-5 h-11 border-t border-border text-[11px] text-muted-foreground shrink-0">
        <span><Tecla>↑</Tecla> <Tecla>↓</Tecla> navegar</span>
        <span><Tecla>Enter</Tecla> abrir</span>
        <span><Tecla>Esc</Tecla> fechar</span>
      </footer>
    </>
  );
}

const Tecla = ({ children }) => (
  <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-border bg-muted font-sans text-[10px] font-medium text-foreground/70">
    {children}
  </kbd>
);

/* --------------------------------- jornada -------------------------------- */

const DESTINO_MARCO = {
  marco_teste: { to: "/teste", acao: "Fazer o teste" },
  marco_resultado: { to: "/resultado", acao: "Ver resultado" },
  marco_profissoes: { to: "/profissoes", acao: "Explorar" },
  marco_comunidade: { to: "/comunidade", acao: "Visitar" },
};

function JornadaRapida({ user, onFechar }) {
  if (!user) {
    return (
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          Crie sua conta para acompanhar sua jornada de autoconhecimento em quatro passos.
        </p>
        <ol className="mt-5 space-y-2">
          {MARCOS.map((m, i) => (
            <li key={m.key} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <span className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-2">
          <Link to="/register" onClick={onFechar} className="flex items-center justify-center h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Criar minha conta
          </Link>
          <Link to="/login" onClick={onFechar} className="flex items-center justify-center h-11 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
            Já tenho conta
          </Link>
        </div>
      </div>
    );
  }

  const nivel = calcularNivel(user);
  const pct = Math.round((nivel / MARCOS.length) * 100);
  const perfil = user.perfil_resultado?.match(/^##\s*Seu perfil:\s*(.+)$/m)?.[1]?.trim();
  const pontuacao = user.perfil_pontuacao;

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* progresso */}
      <div className="p-5 rounded-2xl bg-[#0f2e26] text-[#f8f0e6]">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f8f0e6]/55">Progresso</p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums">{nivel}<span className="text-[#f8f0e6]/45 text-xl">/{MARCOS.length}</span></p>
          </div>
          <p className="text-sm text-[#f8f0e6]/70">{nivel === MARCOS.length ? "Jornada completa!" : `${pct}% concluído`}</p>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="space-y-2">
        {MARCOS.map((m, i) => {
          const feito = !!user[m.key];
          const destino = DESTINO_MARCO[m.key];
          // o teste não dá para refazer (quem já fez vai ao resultado) e sem teste ainda não há resultado
          let to = destino.to;
          if (m.key === "marco_teste" && user.teste_feito) to = "/resultado";
          if (m.key === "marco_resultado" && !user.teste_feito) to = "/teste";
          return (
            <li key={m.key}>
              <Link
                to={to}
                onClick={onFechar}
                className="group flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/60 transition-colors"
              >
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${feito ? "bg-secondary text-white" : "bg-muted text-muted-foreground"}`}>
                  {feito ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className={`flex-1 text-sm font-medium ${feito ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground"}`}>{m.label}</span>
                {!feito && (
                  <span className="text-xs font-semibold text-secondary inline-flex items-center gap-1">
                    {destino.acao} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {perfil && (
        <div className="p-5 rounded-2xl border border-border">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Seu perfil</p>
          <p className="mt-1 font-serif italic text-3xl text-foreground">{perfil}</p>
          {pontuacao && (
            <ul className="mt-4 space-y-2.5">
              {ORDEM_EIXOS.map((e) => (
                <li key={e}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">{PERFIS[e].traco}</span>
                    <span className="text-muted-foreground tabular-nums">{pontuacao[e]}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${PERFIS[e].cor}`} style={{ width: `${pontuacao[e]}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/resultado" onClick={onFechar} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
            Ver resultado completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {nivel === MARCOS.length && (
        <Link to="/feedback" onClick={onFechar} className="flex items-center justify-center h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          Contar como foi a experiência
        </Link>
      )}
    </div>
  );
}
