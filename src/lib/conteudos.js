import { BookOpen, Headphones, Clapperboard, PencilLine } from "lucide-react";

// Os quatro tipos de conteúdo (mesmos valores aceitos pelo backend em conteudos.sql).
// "fundo"/"tinta" pintam a capa gerada quando o admin não cadastra uma imagem.
export const TIPOS = {
  ebook: { rotulo: "E-book", plural: "E-books", icone: BookOpen, fundo: "#0f2e26", tinta: "#f8f0e6", acao: "Ler" },
  audiobook: { rotulo: "Audiobook", plural: "Audiobooks", icone: Headphones, fundo: "#e57a57", tinta: "#fff8f2", acao: "Ouvir" },
  videobook: { rotulo: "Videobook", plural: "Videobooks", icone: Clapperboard, fundo: "#1f3d5c", tinta: "#f1f5fb", acao: "Assistir" },
  exercicios: { rotulo: "Exercícios", plural: "Exercícios", icone: PencilLine, fundo: "#f2b544", tinta: "#0f2e26", acao: "Praticar" },
};
export const ORDEM_TIPOS = ["ebook", "audiobook", "videobook", "exercicios"];

const comoUrl = (link) => {
  try {
    return new URL(link);
  } catch {
    return null;
  }
};

// YouTube: watch?v=, youtu.be/, /embed/, /shorts/ -> player sem cookies de rastreio
export function embedYoutube(link) {
  const u = comoUrl(link);
  if (!u) return null;
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = u.searchParams.get("v") || u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
  }
  return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

// Vimeo: vimeo.com/123456 ou player.vimeo.com/video/123456
export function embedVimeo(link) {
  const u = comoUrl(link);
  if (!u || !/(^|\.)vimeo\.com$/.test(u.hostname)) return null;
  const id = u.pathname.match(/(\d{6,})/)?.[1];
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

// Google Drive: /file/d/ID/... ou ?id=ID -> visualizador embutido e link de download
export function linksDrive(link) {
  const u = comoUrl(link);
  if (!u || u.hostname !== "drive.google.com") return null;
  const id = u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || u.searchParams.get("id");
  if (!id) return null;
  return {
    visualizar: `https://drive.google.com/file/d/${id}/preview`,
    baixar: `https://drive.google.com/uc?export=download&id=${id}`,
  };
}

// Decide como mostrar um conteúdo gratuito a partir do tipo e do link cadastrado.
// O link decide primeiro (um audiobook pode estar no YouTube); depois, o tipo.
export function comoExibir(tipo, link) {
  const video = embedYoutube(link) || embedVimeo(link);
  if (video) return { modo: "video", src: video };
  const drive = linksDrive(link);
  if (drive) return { modo: tipo === "audiobook" || tipo === "videobook" ? "drive-midia" : "documento", src: drive.visualizar, baixar: drive.baixar };
  if (tipo === "audiobook") return { modo: "audio", src: link };
  if (tipo === "videobook") return { modo: "video-arquivo", src: link };
  return { modo: "documento", src: link, baixar: link };
}
