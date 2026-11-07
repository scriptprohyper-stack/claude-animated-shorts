// Timing-Cues fuer die Komposition — spiegeln audio_build.py.
// Alle Zeiten in Sekunden; die Komposition laeuft 30 s bei 30 fps.

export type SubCue = {
  id: string;
  start: number;
  end: number;
  speaker: string;
  text: string;
};

// end leicht VOR dem naechsten Start, damit sich Untertitel nicht ueberlappen.
export const SUBS: SubCue[] = [
  { id: "s1_narr", start: 0.30, end: 4.80, speaker: "SPRECHER", text: "Willkommen zur Weltfriedenskonferenz 2026!" },
  { id: "s1_pol1", start: 2.60, end: 5.50, speaker: "POLITIKER 1", text: "Wer gewinnt eigentlich den naechsten Weltkrieg?" },

  { id: "s2_haupt", start: 6.10, end: 8.40, speaker: "HAUPTFIGUR", text: "Koennten wir mehr Geld fuer Schulen bekommen?" },
  { id: "s2_polno", start: 8.50, end: 9.70, speaker: "POLITIKER", text: "KEIN BUDGET!" },
  { id: "s2_polyay", start: 10.80, end: 12.00, speaker: "POLITIKER", text: "OH! IST DER NEU?!" },

  { id: "s3_a1", start: 12.20, end: 13.50, speaker: "POLITIKER A", text: "WIR WOLLEN FRIEDEN!" },
  { id: "s3_b1", start: 13.55, end: 14.55, speaker: "POLITIKER B", text: "WIR AUCH!" },
  { id: "s3_a2", start: 14.60, end: 17.00, speaker: "POLITIKER A", text: "DESHALB BRAUCHEN WIR MEHR WAFFEN!" },
  { id: "s3_b2", start: 17.10, end: 18.10, speaker: "POLITIKER B", text: "WIR AUCH!" },

  { id: "s4_narr", start: 19.20, end: 23.00, speaker: "SPRECHER", text: "Fuer Waffen ist Geld da. Fuer alles andere wird's schwierig." },
  { id: "s4_sell", start: 22.80, end: 24.60, speaker: "WAFFENVERKAEUFER", text: "Ich liebe Frieden!" },

  { id: "s5_erde", start: 25.20, end: 27.60, speaker: "ERDE", text: "Kann mich bitte jemand deinstallieren?" },
  { id: "s5_text", start: 27.80, end: 30.00, speaker: "", text: "MENSCHHEIT 2026 — UPDATE FEHLGESCHLAGEN." },
];

// Szenen-Grenzen (Sek) — rein visuell, nicht VO-gebunden.
export const SCENES = [
  { id: "S1_konferenz",   start:  0.0, end:  6.0 },
  { id: "S2_prioritaet",  start:  6.0, end: 12.0 },
  { id: "S3_friedenslob", start: 12.0, end: 19.0 },
  { id: "S4_wahrheit",    start: 19.0, end: 25.0 },
  { id: "S5_pointe",      start: 25.0, end: 30.0 },
] as const;

export const FPS = 30;
export const TOTAL_FRAMES = 900; // 30 s
export const WIDTH = 1080;
export const HEIGHT = 1920;
