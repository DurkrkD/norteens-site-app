import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { norteens } from "@/api/norteensClient";
import Hero from "@/components/home/Hero";
import Numeros from "@/components/home/Numeros";
import ComoFunciona from "@/components/home/ComoFunciona";
import Recursos from "@/components/home/Recursos";
import ProfissoesDestaque from "@/components/home/ProfissoesDestaque";
import TestimonialSection from "@/components/home/TestimonialSection";
import Perguntas from "@/components/home/Perguntas";
import ChamadaFinal from "@/components/home/ChamadaFinal";
import ProgressoCard from "@/components/progresso/ProgressoCard";
import { isEquipe } from "@/utils/papeis";

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
      {user && !isEquipe(user) && <ProgressoCard user={user} />}
      <Numeros profissoes={profissoes.length} famosos={famosos.length} />
      <ComoFunciona />
      <Recursos profissoes={profissoes} famosos={famosos} />
      <ProfissoesDestaque profissoes={profissoes} />
      <TestimonialSection />
      <Perguntas />
      <ChamadaFinal user={user} />
    </div>
  );
}
