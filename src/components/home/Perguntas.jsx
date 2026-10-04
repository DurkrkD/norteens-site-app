import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CabecalhoSecao } from "@/components/home/Secao";

const FAQ = [
  {
    p: "Quanto custa?",
    r: "Hoje, criar a conta e fazer o teste de perfil não tem custo. Em breve a Norteens vai oferecer recursos complementares, como a avaliação DISC completa, com uma análise mais aprofundada. Os detalhes serão anunciados aqui.",
  },
  {
    p: "Quanto tempo leva?",
    r: "Cerca de 3 minutos. São 12 situações do dia a dia, e em cada uma você indica para qual lado tende mais.",
  },
  {
    p: "Em que o teste se baseia?",
    r: "É uma versão resumida inspirada no modelo DISC, que descreve quatro estilos de comportamento: iniciativa, influência, estabilidade e precisão. O resultado é um ponto de partida para o autoconhecimento, não um diagnóstico psicológico nem uma sentença sobre o seu futuro.",
  },
  {
    p: "Posso refazer o teste e ter outro resultado?",
    r: "O teste é feito uma vez por conta. Não existe sorteio nem inteligência artificial no cálculo: as mesmas respostas sempre geram o mesmo resultado.",
  },
  {
    p: "Preciso criar uma conta?",
    r: "Para ver profissões e famosos, não. Para fazer o teste, guardar seu resultado e participar da comunidade, sim. Leva menos de um minuto.",
  },
  {
    p: "Quem vê meus dados?",
    r: "Seu e-mail nunca aparece para outros usuários. Na comunidade, aparecem seu nome e sua foto. Um feedback seu só vai para a página inicial se você autorizar.",
  },
];

export default function Perguntas() {
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <CabecalhoSecao
          centro={false}
          sobretitulo="Dúvidas"
          titulo="Perguntas"
          destaque="frequentes."
          texto="Não achou o que procurava? Pergunte na comunidade."
        />
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.p} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline">
                {f.p}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed pr-8">{f.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
