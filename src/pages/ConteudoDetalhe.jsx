import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, Lock, Briefcase, Library } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { PageLoading, EmptyState } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import TituloRevelado from "@/components/TituloRevelado";
import Revelar from "@/components/Revelar";
import Magnetico from "@/components/Magnetico";
import { Capa, SeloAcesso } from "@/components/conteudos/CartaoConteudo";
import { TIPOS, comoExibir } from "@/lib/conteudos";
import { useCelular } from "@/lib/movimento";

// O material em si (só para conteúdo gratuito: o backend nem manda o link dos exclusivos)
function Player({ conteudo: c }) {
  const celular = useCelular();
  const exibir = comoExibir(c.tipo, c.arquivo_url);
  const moldura = "w-full rounded-2xl border border-border bg-muted overflow-hidden shadow-soft-lg";

  if (exibir.modo === "video" || exibir.modo === "drive-midia") {
    return (
      <div className={`${moldura} aspect-video`}>
        <iframe
          src={exibir.src}
          title={c.titulo}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  if (exibir.modo === "video-arquivo") {
    return <video src={exibir.src} controls preload="metadata" className={`${moldura} aspect-video bg-black`} />;
  }
  if (exibir.modo === "audio") {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft">
        <p className="text-sm font-semibold text-foreground">Ouça agora</p>
        <audio src={exibir.src} controls preload="metadata" className="mt-4 w-full" />
      </div>
    );
  }

  // documento (PDF): visualizador embutido + abrir/baixar. No celular o navegador costuma não
  // desenhar PDF dentro da página, então os botões vêm primeiro e o visualizador fica menor.
  const botoes = (
    <div className="flex flex-col sm:flex-row gap-3">
      <Magnetico>
        <a
          href={exibir.src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft-lg hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Abrir em tela cheia
        </a>
      </Magnetico>
      <Magnetico forca={0.2}>
        <a
          href={exibir.baixar}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-card border border-border font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" /> Baixar
        </a>
      </Magnetico>
    </div>
  );
  return (
    <div className="space-y-4">
      {celular && botoes}
      <div className={`${moldura} ${celular ? "h-[60vh]" : "h-[80vh] min-h-[520px]"}`}>
        <iframe src={exibir.src} title={c.titulo} className="w-full h-full" loading="lazy" />
      </div>
      {!celular && botoes}
    </div>
  );
}

// Exclusivo: o que vem por aí, sem o material
function EmBreveParaMembros() {
  return (
    <div className="grao relative overflow-hidden rounded-[28px] bg-[#0f2e26] text-[#f8f0e6] p-7 sm:p-10">
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-accent/25 blur-3xl" aria-hidden />
      <span className="relative w-12 h-12 rounded-2xl bg-white/10 text-highlight flex items-center justify-center">
        <Lock className="w-5 h-5" />
      </span>
      <h2 className="relative mt-6 font-heading text-2xl sm:text-3xl font-bold tracking-[-0.02em]">
        Em breve para <span className="font-serif font-normal italic text-highlight">membros.</span>
      </h2>
      <p className="relative mt-3 text-[#f8f0e6]/75 max-w-lg leading-relaxed">
        Este material faz parte da biblioteca exclusiva da Norteens, que está sendo preparada. Conte para a gente que você
        quer acesso e avisamos quando abrir.
      </p>
      <Magnetico className="relative mt-7">
        <Link
          to="/feedback"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#f8f0e6] text-[#0f2e26] font-semibold hover:bg-white transition-colors"
        >
          Quero acesso
        </Link>
      </Magnetico>
    </div>
  );
}

export default function ConteudoDetalhe() {
  const { id } = useParams();
  const [conteudo, setConteudo] = useState(null);
  const [estado, setEstado] = useState("carregando"); // carregando | ok | nao-achou

  useEffect(() => {
    norteens
      .getConteudo(id)
      .then((c) => { setConteudo(c); setEstado("ok"); })
      .catch(() => setEstado("nao-achou"));
  }, [id]);

  if (estado === "carregando") return <PageLoading />;
  if (estado === "nao-achou") {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          icon={Library}
          title="Conteúdo não encontrado"
          description="Ele pode ter saído do ar ou o endereço está errado."
          action={<Button asChild variant="outline"><Link to="/conteudos">Ver todos os conteúdos</Link></Button>}
        />
      </div>
    );
  }

  const c = conteudo;
  const tipo = TIPOS[c.tipo] || TIPOS.ebook;
  const Icone = tipo.icone;
  // gratuito com link: mostra o material. Exclusivo (ou gratuito sem link, por segurança): o bloco de membros.
  const liberado = c.gratuito && c.arquivo_url;

  return (
    <div>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grade mask-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <Link to="/conteudos" className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> <span className="sublinhado">Conteúdos</span>
          </Link>
          <div className="mt-8 grid md:grid-cols-[minmax(0,240px)_1fr] gap-8 md:gap-12 items-end">
            <Revelar className="w-40 sm:w-48 md:w-full">
              <Capa conteudo={c} className="aspect-[3/4] rounded-2xl shadow-elevated" />
            </Revelar>
            <div className="min-w-0">
              <Revelar className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-accent/15 text-accent text-[11px] font-semibold uppercase tracking-[0.1em]">
                  <Icone className="w-3.5 h-3.5" /> {tipo.rotulo}
                </span>
                <SeloAcesso gratuito={c.gratuito} />
                {c.area && <span className="text-sm text-muted-foreground">{c.area}</span>}
              </Revelar>
              <TituloRevelado className="mt-4 text-[2.2rem] sm:text-5xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground text-balance">
                {c.titulo}
              </TituloRevelado>
              {c.descricao && (
                <Revelar as="p" atraso={0.25} className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-line text-pretty">
                  {c.descricao}
                </Revelar>
              )}
              {c.profissao_id && c.profissao_nome && (
                <Revelar atraso={0.35} className="mt-5">
                  <Link to={`/profissoes/${c.profissao_id}`} className="group inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Briefcase className="w-4 h-4" /> <span className="sublinhado">Ligado à profissão {c.profissao_nome}</span>
                  </Link>
                </Revelar>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Revelar>{liberado ? <Player conteudo={c} /> : <EmBreveParaMembros />}</Revelar>
      </div>
    </div>
  );
}
