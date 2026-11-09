// Spiegel der audio_build.py-Timings fuer die Composition.
// Alles in Sekunden.

export type SubCue = {
  id: string;
  start: number;
  end: number;
  speaker: string;
  text: string;
};

// Cues treiben die Charakter-State-Machine und Badge-Popups.
// Untertitel werden NICHT ins Video eingeblendet.
export const SUBS: SubCue[] = [
  { id: "hook", start: 0.20, end: 2.86, speaker: "BANK-APP",
    text: "Herzlichen Glückwunsch! Du bist offiziell arm!" },

  { id: "bot1", start: 3.50, end: 6.45, speaker: "BANK-BOT",
    text: "Willkommen im Arm-Programm. Armut ist jetzt spannend!" },

  { id: "bot2", start: 6.80, end: 9.38, speaker: "BANK-BOT",
    text: "Was Sie sich nicht leisten können, bringt Punkte!" },

  { id: "bot3", start: 9.70, end: 12.06, speaker: "BANK-BOT",
    text: "Butter nicht gekauft? Plus fünfzig!" },

  { id: "bot4", start: 12.30, end: 14.80, speaker: "BANK-BOT",
    text: "Heizung aus im Winter? Plus zweihundert!" },

  { id: "bot5", start: 15.00, end: 19.82, speaker: "BANK-BOT",
    text: "Freunde abgesagt, weil Bier zu teuer? Plus fünfhundert — und ein Wellness-Sticker!" },

  { id: "drl2", start: 20.20, end: 21.54, speaker: "DR. L.",
    text: "Und was krieg ich dafür?" },

  { id: "bot6", start: 21.90, end: 24.83, speaker: "BANK-BOT",
    text: "Mit genug Punkten erreichen Sie Premium-Status!" },

  { id: "drl3", start: 24.90, end: 25.85, speaker: "DR. L.",
    text: "Was ist Premium?" },

  { id: "bot7", start: 26.20, end: 29.38, speaker: "BANK-BOT",
    text: "Premium ist Ihr Leben von 2019." },
];

// Badge-Popups (reine Visual-Cues, nicht im VO)
export type Badge = {
  start: number;
  end: number;
  icon: "butter" | "heat" | "friends";
  label: string;
  points: number;
  sticker?: boolean;
};

export const BADGES: Badge[] = [
  { start:  9.60, end: 12.10, icon: "butter",  label: "BUTTER-FREI",    points:  50 },
  { start: 12.20, end: 14.80, icon: "heat",    label: "FROSTFEST",      points: 200 },
  { start: 14.90, end: 19.80, icon: "friends", label: "EINZELGÄNGER",   points: 500, sticker: true },
];

export const FPS = 30;
export const TOTAL_FRAMES = 900;
export const WIDTH = 1080;
export const HEIGHT = 1920;
