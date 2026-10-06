import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { norteens } from "@/api/norteensClient";
import Hero from "@/components/home/Hero";
import Numeros from "@/components/home/Numeros";
import FaixaCarreiras from "@/components/home/FaixaCarreiras";
import ComoFunciona from "@/components/home/ComoFunciona";
import Recursos from "@/components/home/Recursos";
import ProfissoesDestaque from "@/components/home/ProfissoesDestaque";
import TestimonialSection from "@/components/home/TestimonialSection";
import OfertasHome from "@/components/home/OfertasHome";
import Perguntas from "@/components/home/Perguntas";
import ChamadaFinal from "@/components/home/ChamadaFinal";
import ProgressoCard from "@/components/progresso/ProgressoCard";
import { isEquipe } from "@/utils/papeis";
import Revelar from "@/components/Revelar";

export default function Home() {
  const { user } = useOutletContext();
  const [profissoes, setProfissoes] = useState([]);
  const [famosos, setFamosos] = useState([]);

  // conteúdo real para os números, a grade de recursos e as profissões em destaque
  useEffect(() => {
    norteens.listarProfissoes().then(setProfissoes).catch(() => {});
    norteens.listarFamosos().then(setFamosos).catch(() => {});
  }, []);

  return (
    <div>
      <Hero user={user} />
      <FaixaCarreiras profissoes={profissoes} />
      {user && !isEquipe(user) && <ProgressoCard user={user} />}
      <Numeros profissoes={profissoes.length} famosos={famosos.length} />
      <ComoFunciona />
      {/* cada seção entra suavemente ao aparecer na tela */}
      <Revelar><Recursos profissoes={profissoes} famosos={famosos} /></Revelar>
      <Revelar><ProfissoesDestaque profissoes={profissoes} /></Revelar>
      <Revelar><OfertasHome user={user} /></Revelar>
      <Revelar><TestimonialSection /></Revelar>
      <Revelar><Perguntas /></Revelar>
      <Revelar><ChamadaFinal user={user} /></Revelar>
    </div>
  );
}
