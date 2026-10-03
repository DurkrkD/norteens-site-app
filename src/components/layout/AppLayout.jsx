import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomTabs from "@/components/layout/MobileBottomTabs";
import { PageLoading } from "@/components/layout/Page";
import { norteens } from "@/api/norteensClient";
import { applyUserColor } from "@/utils/userColor";

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const noPainel = location.pathname.startsWith("/painel");

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <Navbar user={user} />
      <main className="flex-1">
        <Outlet context={{ user, setUser }} />
      </main>
      {!noPainel && <Footer />}
      <MobileBottomTabs />
    </div>
  );
}
