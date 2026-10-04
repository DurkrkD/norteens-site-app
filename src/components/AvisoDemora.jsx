import React, { useEffect, useState } from "react";
import { Coffee } from "lucide-react";

// Aparece quando uma ação (login, cadastro...) demora: quase sempre é o servidor acordando.
export default function AvisoDemora({ ativo, depois = 4000 }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!ativo) {
      setVisivel(false);
      return;
    }
    const timer = setTimeout(() => setVisivel(true), depois);
    return () => clearTimeout(timer);
  }, [ativo, depois]);

  if (!visivel) return null;
  return (
    <p role="status" className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-muted text-sm text-muted-foreground leading-relaxed">
      <Coffee className="w-4 h-4 mt-0.5 shrink-0" />
      O servidor está acordando — na primeira vez do dia pode levar até 1 minuto. Não precisa clicar de novo.
    </p>
  );
}
