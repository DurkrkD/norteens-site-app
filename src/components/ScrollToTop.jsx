import { useEffect } from "react";
import { rolarPara } from "@/lib/rolagem";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

// Recebe a página que está sendo exibida (não a do endereço): com a cortina de transição, a troca
// só acontece com a tela coberta, e é nessa hora que a rolagem volta ao topo.
export default function ScrollToTop({ location, navigationType }) {
  const { pathname, hash } = location;

  useEffect(() => {
    if (navigationType === "POP") return;

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        rolarPara(document.getElementById(id));
      }, 50);
      return () => window.clearTimeout(timer);
    }

    rolarPara(0, { imediato: true });
  }, [pathname, hash, navigationType]);

  return null;
}
