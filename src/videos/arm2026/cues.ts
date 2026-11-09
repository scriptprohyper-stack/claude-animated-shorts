// Spiegel der audio_build.py-Timings fuer die Composition.
// Alles in Sekunden.

export type SubCue = {
  id: string;
  start: number;
  end: number;
  speaker: string;
  text: string;
};

export const SUBS: SubCue[] = [
  { id: "hook", start: 0.20, end: 3.10, speaker: "BANK-APP",
    text: "Herzlichen Glückwunsch! Du bist offiziell arm!" },

  { id: "bot1", start: 3.50, end: 6.30, speaker: "BANK-BOT",
    text: "Willkommen im Arm-Programm. Armut ist jetzt spannend!" },

  { id: "bot2", start: 6.20, end: 8.90, speaker: "BANK-BOT",
    text: "Was Sie sich nicht leisten können, bringt Punkte!" },

  { id: "bot3", start: 9.00, end: 11.20, speaker: "BANK-BOT",
    text: "Butter nicht gekauft? Plus fünfzig!" },

  { id: "bot4", start: 11.30, end: 13.70, speaker: "BANK-BOT",
    text: "Heizung aus im Winter? Plus zweihundert!" },

  { id: "bot5", start: 13.70, end: 18.60, speaker: "BANK-BOT",
    text: "Freunde abgesagt, weil Bier zu teuer? Plus fünfhundert — und ein Wellness-Sticker!" },

  { id: "drl2", start: 19.20, end: 20.90, speaker: "DR. L.",
    text: "Und was krieg ich dafür?" },

  { id: "bot6", start: 20.80, end: 23.40, speaker: "BANK-BOT",
    text: "Mit genug Punkten erreichen Sie Premium-Status!" },

  { id: "drl3", start: 23.40, end: 24.70, speaker: "DR. L.",
    text: "Was ist Premium?" },

  { id: "bot7", start: 24.60, end: 28.20, speaker: "BANK-BOT",
    text: "Premium ist das Leben, das Sie 2019 hatten." },
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
  { start:  8.90, end: 11.00, icon: "butter",  label: "BUTTER-FREI",    points:  50 },
  { start: 11.20, end: 13.30, icon: "heat",    label: "FROSTFEST",      points: 200 },
  { start: 13.60, end: 18.60, icon: "friends", label: "EINZELGÄNGER",   points: 500, sticker: true },
];

export const FPS = 30;
export const TOTAL_FRAMES = 900;
export const WIDTH = 1080;
export const HEIGHT = 1920;
