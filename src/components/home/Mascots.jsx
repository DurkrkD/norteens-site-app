import React from "react";

// Mascote: garota com cabelo terracota
export function MascotGirl({ className = "", ...size }) {
  return (
    <svg viewBox="0 0 140 178" className={className} aria-hidden="true" {...size}>
      <rect x="37" y="42" width="66" height="90" rx="33" fill="#C9654B" />
      <path d="M40 122 Q40 106 70 106 Q100 106 100 122 L104 176 Q104 178 100 178 L40 178 Q36 178 36 176 Z" fill="#7E8E5B" />
      <path d="M96 122 q20 -3 24 -26" stroke="#7E8E5B" strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="122" cy="88" r="9" fill="#F0C9A8" />
      <circle cx="70" cy="56" r="33" fill="#C9654B" />
      <circle cx="70" cy="62" r="30" fill="#F0C9A8" />
      <circle cx="61" cy="63" r="3.1" fill="#2B2A26" />
      <circle cx="79" cy="63" r="3.1" fill="#2B2A26" />
      <circle cx="55" cy="71" r="4" fill="#E88A6F" opacity=".5" />
      <circle cx="85" cy="71" r="4" fill="#E88A6F" opacity=".5" />
      <path d="M63 72 Q70 79 77 72" stroke="#2B2A26" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Mascote: garoto com boné verde
export function MascotCap({ className = "", ...size }) {
  return (
    <svg viewBox="0 0 140 178" className={className} aria-hidden="true" {...size}>
      <path d="M40 122 Q40 106 70 106 Q100 106 100 122 L104 176 Q104 178 100 178 L40 178 Q36 178 36 176 Z" fill="#E07A5F" />
      <path d="M97 126 q17 3 20 -13" stroke="#E07A5F" strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="118" cy="110" r="9" fill="#D99B6C" />
      <rect x="115" y="95" width="6" height="15" rx="3" fill="#D99B6C" />
      <circle cx="70" cy="62" r="30" fill="#D99B6C" />
      <path d="M38 54 Q40 22 70 22 Q100 22 102 54 Q86 46 70 46 Q54 46 38 54 Z" fill="#67754A" />
      <path d="M100 51 Q121 49 123 60 Q111 55 100 56 Z" fill="#556140" />
      <circle cx="70" cy="24" r="3" fill="#556140" />
      <circle cx="61" cy="64" r="3.1" fill="#2B2A26" />
      <circle cx="79" cy="64" r="3.1" fill="#2B2A26" />
      <circle cx="55" cy="72" r="4" fill="#C9654B" opacity=".4" />
      <circle cx="85" cy="72" r="4" fill="#C9654B" opacity=".4" />
      <path d="M62 73 Q70 80 78 73" stroke="#2B2A26" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Composição: dois personagens + formas decorativas (estilo protótipo)
export default function HeroMascots({ className = "" }) {
  return (
    <svg viewBox="0 0 480 440" className={className} aria-hidden="true">
      {/* bg circles */}
      <circle cx="360" cy="130" r="112" fill="#7E8E5B" opacity=".16" />
      <circle cx="104" cy="316" r="96" fill="#E07A5F" opacity=".13" />
      <ellipse cx="240" cy="402" rx="166" ry="20" fill="#1C2A3A" opacity=".06" />
      {/* dashed path */}
      <path
        d="M60 300 C 150 300, 150 200, 250 200 S 430 150, 430 96"
        fill="none"
        stroke="#1C2A3A"
        strokeOpacity=".2"
        strokeWidth="3"
        strokeDasharray="1.5 13"
        strokeLinecap="round"
      />
      {/* personagens: SVG dentro de SVG precisa de width/height, senão estica até ocupar tudo */}
      <g transform="translate(248 162) scale(1.3)">
        <MascotCap width="140" height="178" />
      </g>
      <g transform="translate(96 150) scale(1.3)">
        <MascotGirl width="140" height="178" />
      </g>
      {/* compass icon */}
      <g transform="translate(332 66)">
        <circle cx="0" cy="0" r="26" fill="#FFFDF8" stroke="rgba(28,42,58,.1)" />
        <path d="M0 -15 L4 0 L0 15 L-4 0 Z" fill="#E07A5F" />
        <path d="M-15 0 L0 -4 L15 0 L0 4 Z" fill="#1C2A3A" />
      </g>
      {/* small dots */}
      <circle cx="66" cy="120" r="6" fill="#E8B04B" />
      <circle cx="412" cy="292" r="7" fill="#E07A5F" />
      <rect x="50" y="212" width="13" height="13" rx="3.5" fill="#7E8E5B" transform="rotate(20 56 218)" />
      <circle cx="300" cy="58" r="5" fill="#7E8E5B" />
      <path d="M394 92 h10 M399 87 v10" stroke="#E07A5F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="66" r="4" fill="#E8B04B" />
    </svg>
  );
}