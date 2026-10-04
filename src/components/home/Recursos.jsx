import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, MessageCircle, Check } from "lucide-react";
import { CabecalhoSecao } from "@/components/home/Secao";
import { PERFIS, ORDEM_EIXOS } from "@/data/perfis";

function Cartao({ to, className = "", escuro = false, titulo, texto, children }) {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition-all hover:-translate-y-0.5 hover:shadow-soft-lg ${
        escuro ? "bg-[#0f2e26] border-[#0f2e26] text-[#f8f0e6]" : "bg-card border-border"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`text-xl font-bold ${escuro ? "text-[#f8f0e6]" : "text-foreground"}`}>{titulo}</h3>
          <p className={`mt-2 leading-relaxed max-w-sm ${escuro ? "text-[#f8f0e6]/70" : "text-muted-foreground"}`}>{texto}</p>
        </div>
        <span
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            escuro ? "bg-white/10 group-hover:bg-white/20" : "bg-muted group-hover:bg-foreground group-hover:text-background"
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <div className="mt-8 flex-1 flex items-end">{children}</div>
    </Link>
  );
}

export default function Recursos({ profissoes = [], famosos = [] }) {
  const exemplosProf = profissoes.slice(0, 3);
  const exemplosFam = famosos.slice(0, 5);

  return (
    <section className="py-24 sm:py-28 bg-cream-2/60 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <CabecalhoSecao
          sobretitulo="A plataforma"
          titulo="Tudo o que você precisa para"
          destaque="decidir melhor."
          texto="Ferramentas pensadas para quem está no ensino médio, na faculdade ou pensando em mudar de rumo."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {/* teste */}
          <Cartao
            to="/teste"
            escuro
            className="lg:col-span-4"
            titulo="Teste comportamental"
            texto="Baseado no modelo DISC. Mostra em qual dos quatro perfis você se encaixa e o quanto de cada traço você tem."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {ORDEM_EIXOS.map((e) => (
                <div key={e} className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                  <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center font-heading font-bold text-sm ${PERFIS[e].cor} ${e === "I" ? "text-[#0f2e26]" : "text-white"}`}>
                    {e}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#f8f0e6]">{PERFIS[e].nome}</p>
                  <p className="mt-0.5 text-xs text-[#f8f0e6]/55">{PERFIS[e].traco}</p>
                </div>
              ))}
            </div>
          </Cartao>

          {/* comunidade */}
          <Cartao
            to="/comunidade"
            className="lg:col-span-2"
            titulo="Comunidade"
            texto="Tire dúvidas e troque experiências com outros jovens."
          >
            <div className="w-full rounded-2xl bg-muted/70 p-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">J</span>
                <span className="text-xs font-semibold text-foreground">Júlia</span>
                <span className="text-[11px] text-muted-foreground">· agora</span>
              </div>
              <p className="mt-2 text-sm text-foreground/85">Deu Analista no teste! Alguém aqui também pensa em TI?</p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-accent text-accent" /> 12</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 4</span>
              </div>
            </div>
          </Cartao>

          {/* profissões */}
          <Cartao
            to="/profissoes"
            className="lg:col-span-2"
            titulo="Guia de profissões"
            texto="Rotina, formação, competências e faixa salarial de cada carreira."
          >
            <ul className="w-full space-y-2">
              {(exemplosProf.length ? exemplosProf : [{ id: 0, icone: "💼", nome: "Fichas completas", salario: "com faixa salarial" }]).map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl bg-muted/70 px-3 py-2.5">
                  <span className="text-lg">{p.icone || "💼"}</span>
                  <span className="text-sm font-medium text-foreground truncate flex-1">{p.nome}</span>
                  {p.salario && <span className="text-[11px] text-muted-foreground truncate max-w-[45%]">{p.salario}</span>}
                </li>
              ))}
            </ul>
          </Cartao>

          {/* famosos */}
          <Cartao
            to="/famosos"
            className="lg:col-span-2"
            titulo="Quem inspira"
            texto="Conheça pessoas que construíram carreira em cada área."
          >
            {exemplosFam.length > 0 ? (
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {exemplosFam.map((f, i) => (
                    <span
                      key={f.id}
                      title={f.nome}
                      className={`w-11 h-11 rounded-full border-[3px] border-card flex items-center justify-center font-heading font-bold ${
                        ["bg-accent/20 text-accent", "bg-secondary/20 text-secondary", "bg-highlight/30 text-[#8a5a12]"][i % 3]
                      }`}
                    >
                      {f.nome?.charAt(0)}
                    </span>
                  ))}
                </div>
                <span className="ml-4 text-sm text-muted-foreground">
                  {famosos.length} {famosos.length === 1 ? "referência" : "referências"}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Em breve.</span>
            )}
          </Cartao>

          {/* jornada */}
          <Cartao
            to="/teste"
            className="lg:col-span-2"
            titulo="Sua jornada"
            texto="Acompanhe cada passo, do teste à escolha da profissão."
          >
            <ol className="w-full space-y-2">
              {["Fez o teste", "Viu o resultado", "Explorou profissões", "Entrou na comunidade"].map((m, i) => (
                <li key={m} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      i < 2 ? "bg-secondary text-white" : "border-2 border-border"
                    }`}
                  >
                    {i < 2 && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                  <span className={i < 2 ? "text-foreground" : "text-muted-foreground"}>{m}</span>
                </li>
              ))}
            </ol>
          </Cartao>
        </div>
      </div>
    </section>
  );
}
