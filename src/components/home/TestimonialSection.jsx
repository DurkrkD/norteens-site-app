import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";

export default function TestimonialSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    norteens.listarFeedbacksPublicos()
      .then(setFeedbacks)
      .catch(() => {
        // silently ignore — section stays hidden
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || feedbacks.length === 0) return null;

  const fb = feedbacks[0];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-[30px] py-16 px-8 sm:px-10 text-center relative overflow-hidden border border-border shadow-soft"
          style={{ background: "#FFFDF8" }}
        >
          {/* decorative dots */}
          <span className="absolute w-2 h-2 rounded-full top-10 left-14" style={{ background: "#E8B04B" }} />
          <span className="absolute w-2.5 h-2.5 rounded-full bottom-12 right-16" style={{ background: "#E07A5F" }} />
          <span className="absolute w-1.5 h-1.5 rounded-full top-16 right-28" style={{ background: "#7E8E5B" }} />
          <span className="absolute w-1.5 h-1.5 rounded-full bottom-20 left-28" style={{ background: "#7E8E5B" }} />

          <blockquote
            className="font-heading text-xl sm:text-[2.1rem] font-medium leading-[1.32] max-w-[28ch] mx-auto relative"
            style={{ color: "#2B2A26" }}
          >
            "{fb.texto}"
          </blockquote>
          <div className="mt-6 relative">
            <b className="block text-[15px]" style={{ color: "#E07A5F" }}>
              {fb.autor_nome || fb.autor_apelido || "Usuário"}
            </b>
            <span className="text-sm" style={{ color: "#726A5F" }}>
              Usuário Norteens
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}