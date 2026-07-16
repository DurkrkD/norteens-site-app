import React from "react";
import { useOutletContext } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AudienceSection from "@/components/home/AudienceSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CtaBand from "@/components/home/CtaBand";
import Footer from "@/components/home/Footer";
import ProgressoCard from "@/components/progresso/ProgressoCard";

export default function Home() {
  const { user } = useOutletContext();

  return (
    <div>
      <HeroSection user={user} />
      {user && <ProgressoCard user={user} />}
      <AboutSection />
      <AudienceSection />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialSection />
      <CtaBand user={user} />
      <Footer />
    </div>
  );
}