import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomTabs from "@/components/layout/MobileBottomTabs";
import BarraLateral, { LARGURA_BARRA } from "@/components/layout/BarraLateral";
import PaineisRapidos from "@/components/layout/PaineisRapidos";
import FaixaNovidade from "@/components/ofertas/FaixaNovidade";
import { PageLoading } from "@/components/layout/Page";
import { norteens } from "@/api/norteensClient";
import { applyUserColor } from "@/utils/userColor";

const CHAVE_BARRA = "norteens-barra-expandida";

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandida, setExpandida] = useState(() => {
    try { return localStorage.getItem(CHAVE_BARRA) === "1"; } catch { return false; }
  });
  const [painel, setPainel] = useState(null); // "busca" | "jornada" | null
  const location = useLocation();
  // painel (ferramenta de trabalho) e teste (foco total na pergunta) ficam sem rodapé
  const semRodape = location.pathname.startsWith("/painel") || location.pathname.startsWith("/teste");

  useEffect(() => {
    const load = async () => {
      const me = await norteens.me();
      if (me) {
        setUser(me);
        if (me.cor_personalizada) {
          applyUserColor(me.cor_personalizada);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const alternarBarra = () => {
    setExpandida((e) => {
      try { localStorage.setItem(CHAVE_BARRA, e ? "0" : "1"); } catch { /* só não lembra da escolha */ }
      return !e;
    });
  };
  const fecharPainel = useCallback(() => setPainel(null), []);

  // trocar de página fecha o painel rápido
  useEffect(() => { setPainel(null); }, [location.pathname]);

  // Ctrl+K / ⌘K abre a busca de qualquer lugar
  useEffect(() => {
    const tecla = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPainel((p) => (p === "busca" ? null : "busca"));
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageLoading />
      </div>
    );
  }

  const recuo = expandida ? LARGURA_BARRA.aberta : LARGURA_BARRA.fechada;

  return (
    <div className="min-h-screen bg-background">
      <BarraLateral
        user={user}
        expandida={expandida}
        onAlternar={alternarBarra}
        painel={painel}
        onPainel={setPainel}
      />
      <PaineisRapidos painel={painel} onFechar={fecharPainel} user={user} recuo={recuo} />

      {/* o conteúdo abre espaço para a barra (só no computador; no celular a navegação fica no topo e embaixo) */}
      <div
        className="min-h-screen flex flex-col pb-16 md:pb-0 md:pl-[var(--recuo)] transition-[padding] duration-300 ease-out"
        style={{ "--recuo": `${recuo}px` }}
      >
        <Navbar user={user} onBuscar={() => setPainel("busca")} />
        <FaixaNovidade />
        <main className="flex-1">
          {/* só o conteúdo anima ao trocar de página; barra e menus ficam parados */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Outlet context={{ user, setUser }} />
          </motion.div>
        </main>
        {!semRodape && <Footer />}
      </div>
      <MobileBottomTabs />
    </div>
  );
}
