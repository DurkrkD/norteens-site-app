import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { norteens } from "@/api/norteensClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { applyUserColor, clearUserColor } from "@/utils/userColor";
import { Check, Loader2, RotateCcw } from "lucide-react";

const presets = [
  { label: "Terracota", color: "#E07A5F" },
  { label: "Oceano", color: "#2E86AB" },
  { label: "Floresta", color: "#3A8A5C" },
  { label: "Ametista", color: "#9B4DCA" },
  { label: "Pôr do Sol", color: "#E8743D" },
  { label: "Rosa", color: "#D14D7E" },
];

export default function ConfigAparencia() {
  const { user, setUser } = useOutletContext();
  const { toast } = useToast();
  const [color, setColor] = useState(user?.cor_personalizada || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.cor_personalizada) {
      applyUserColor(user.cor_personalizada);
    }
  }, []);

  const handleColorChange = (hex) => {
    setColor(hex);
    applyUserColor(hex);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await norteens.updateMe({ cor_personalizada: color });
      setUser({ ...user, cor_personalizada: color });
      toast({ title: "Aparência salva!" });
    } catch {
      toast({ title: "Erro ao salvar.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleReset = async () => {
    setSaving(true);
    clearUserColor();
    setColor("");
    try {
      await norteens.updateMe({ cor_personalizada: "" });
      setUser({ ...user, cor_personalizada: "" });
      toast({ title: "Cor padrão restaurada." });
    } catch {
      toast({ title: "Erro ao restaurar.", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
        Aparência
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Personalize a cor de destaque do site para a sua experiência. A mudança
        é aplicada na hora e salva na sua conta.
      </p>

      {/* Color picker */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-5">
        <p className="font-semibold text-sm text-foreground mb-3">
          Cor personalizada
        </p>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color || "#E07A5F"}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-14 h-14 rounded-xl border border-border cursor-pointer bg-card"
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {color ? color.toUpperCase() : "Padrão"}
            </p>
            <p className="text-xs text-muted-foreground">
              Clique para escolher uma cor
            </p>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-6">
        <p className="font-semibold text-sm text-foreground mb-3">
          Temas prontos
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((p) => {
            const active = color?.toLowerCase() === p.color.toLowerCase();
            return (
              <button
                key={p.color}
                onClick={() => handleColorChange(p.color)}
                className={`p-3 rounded-[14px] border-2 flex items-center gap-3 transition-all ${
                  active
                    ? "border-primary shadow-soft"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: p.color }}
                >
                  {active && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={saving}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar padrão
        </Button>
      </div>
    </div>
  );
}