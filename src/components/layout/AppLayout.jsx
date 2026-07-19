import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import MobileBottomTabs from "@/components/layout/MobileBottomTabs";
import NoChat from "@/components/assistente/NoChat";
import { norteens } from "@/api/norteensClient";
import { applyUserColor } from "@/utils/userColor";

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background select-none">
      <Navbar user={user} />
      <main className="pb-20 md:pb-0">
        <Outlet context={{ user, setUser }} />
      </main>
      <MobileBottomTabs />
      <NoChat />
    </div>
  );
}