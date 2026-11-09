// Farb-Tokens aus STYLE_GUIDE.md §4. Nur ueber diese Namen verwenden.
// (Keine Hex-Codes direkt in Szenen.)

export const T = {
  figureFill: "#ffffff",
  ink: "#0a0a0a",

  bgDeep: "#2a1a52",
  bgMid: "#5d4ab7",
  bgSoft: "#a99bff",
  bgSky: "#b5dbff",

  accentGreen: "#8cf542",
  accentGreenDeep: "#3bbf2a",
  accentPink: "#ff6eb7",
  accentPinkDeep: "#e04a90",
  accentCyan: "#4de1ff",
  accentCyanDeep: "#1fa3c1",
  accentYellow: "#ffda47",
  accentTan: "#e6d3a8",

  mouthInner: "#e04a90",
} as const;

export const INK_W = 9; // Standard-Outline-Breite bei 1080x1920
export const INK_W_FINE = 6; // feinere Elemente (Mund, Augenbrauen)
