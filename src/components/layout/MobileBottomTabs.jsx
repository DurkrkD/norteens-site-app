import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const tabs = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/profissoes", icon: Briefcase, label: "Profissões" },
  { to: "/comunidade", icon: MessageCircle, label: "Comunidade" },
];

export default function MobileBottomTabs() {
  const isMobile = useIsMobile();
  const location = useLocation();

  const handleTabClick = useCallback(
    (e, path) => {
      if (location.pathname === path) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [location.pathname]
  );

  if (!isMobile) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:hidden select-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 select-none">
        {tabs.map((tab) => {
          const active = tab.to === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              onClick={(e) => handleTabClick(e, tab.to)}
              className={`flex flex-col items-center justify-center gap-1 px-6 py-2 transition-colors select-none ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${active ? "fill-primary/10" : ""}`} />
              <span className="text-[10px] font-medium select-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}