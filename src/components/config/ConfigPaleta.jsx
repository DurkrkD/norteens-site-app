import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const paletas = {
  terracota: {
    label: "Terracota (Padrão)",
    primary: "12 67% 63%",
    secondary: "76 22% 46%",
    accent: "212 35% 17%",
    highlight: "39 78% 60%",
    swatches: ["#E07A5F", "#7E8E5B", "#1C2A3A", "#E8B04B"],
  },
  oceano: {
    label: "Oceano",
    primary: "200 70% 45%",
    secondary: "170 45% 45%",
    accent: "230 60% 25%",
    highlight: "45 80% 60%",
    swatches: ["#2E86AB", "#3DB5A0", "#28304E", "#E8B04B"],
  },
  floresta: {
    label: "Floresta",
    primary: "140 40% 38%",
    secondary: "80 30% 50%",
    accent: "30 50% 30%",
    highlight: "45 75% 55%",
    swatches: ["#3A8A5C", "#9CB347", "#5C3D1E", "#E0A93B"],
  },
  ametista: {
    label: "Ametista",
    primary: "280 50% 50%",
    secondary: "320 40% 55%",
    accent: "260 40% 25%",
    highlight: "45 80% 60%",
    swatches: ["#9B4DCA", "#D14FA0", "#3D2B5C", "#E8B04B"],
  },
  porDoSol: {
    label: "Pôr do Sol",
    primary: "20 80% 58%",
    secondary: "340 55% 55%",
    accent: "280 40% 25%",
    highlight: "45 85% 58%",
    swatches: ["#E8743D", "#D14D7E", "#3D2452", "#E8B04B"],
  },
};

export function applyPalette(key) {
  const p = paletas[key];
  if (!p) return;
  const root = document.documentElement;
  root.style.setProperty("--primary", p.primary);
  root.style.setProperty("--secondary", p.secondary);
  root.style.setProperty("--accent", p.accent);
  root.style.setProperty("--highlight", p.highlight);
}

export async function loadSavedPalette() {
  try {
    const data = await base44.entities.Config.list();
    if (data.length > 0 && data[0].paleta_ativa && paletas[data[0].paleta_ativa]) {
      applyPalette(data[0].paleta_ativa);
      return data[0].paleta_ativa;
    }
  } catch {
    // ignore
  }
  return null;
}

export default function ConfigPaleta() {
  const { toast } = useToast();
  const [ativa, setAtiva] = useState("terracota");
  const [configId, setConfigId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Config.list().then((data) => {
      if (data.length > 0) {
        setAtiva(data[0].paleta_ativa || "terracota");
        setConfigId(data[0].id);
        applyPalette(data[0].paleta_ativa || "terracota");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (key) => {
    setAtiva(key);
    applyPalette(key);

    if (configId) {
      await base44.entities.Config.update(configId, { paleta_ativa: key });
    } else {
      const created = await base44.entities.Config.create({ paleta_ativa: key });
      setConfigId(created.id);
    }
    toast({ title: "Paleta atualizada!" });
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Paleta de Cores</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Escolha a paleta que melhor representa o seu projeto. A mudança é aplicada instantaneamente.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(paletas).map(([key, p]) => (
          <button
            key={key}
            onClick={() => handleSave(key)}
            className={`p-5 rounded-[18px] border-2 text-left transition-all ${
              ativa === key ? "border-primary shadow-soft-lg" : "border-border hover:border-primary/30"
            }`}
          >
            <p className="font-semibold text-foreground mb-3">{p.label}</p>
            <div className="flex gap-2">
              {p.swatches.map((color, i) => (
                <div key={i} className="w-10 h-10 rounded-lg" style={{ background: color }} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}