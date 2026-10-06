import { useEffect, useState } from "react";
import { norteens } from "@/api/norteensClient";

// As ofertas aparecem em várias páginas (início, resultado, profissões, planos): busca uma vez só.
let cache = null;
let pedidoEmAndamento = null;

function buscar() {
  if (!pedidoEmAndamento) {
    pedidoEmAndamento = norteens
      .listarOfertas()
      .then((lista) => (cache = lista))
      .catch(() => (cache = [])) // sem ofertas, as aparições simplesmente somem
      .finally(() => (pedidoEmAndamento = null));
  }
  return pedidoEmAndamento;
}

// depois que o admin edita, a próxima página já mostra a versão nova
export function esquecerOfertas() {
  cache = null;
}

export function useOfertas() {
  const [ofertas, setOfertas] = useState(cache);

  useEffect(() => {
    if (cache) return;
    let vivo = true;
    buscar().then((lista) => vivo && setOfertas(lista));
    return () => { vivo = false; };
  }, []);

  const lista = ofertas || [];
  return {
    carregando: ofertas === null,
    disc: lista.find((o) => o.tipo === "disc") || null,
    mentorias: lista.filter((o) => o.tipo === "mentoria"),
  };
}
