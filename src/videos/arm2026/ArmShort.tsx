/**
 * „Herzlichen Glueckwunsch! Du bist arm." — 30s satire short
 *
 * Nutzt STYLE_GUIDE-System (scifi):
 *   - MadLab Umgebung
 *   - Dr. L. Charakter mit Expressions & Posen
 *   - Hologramm-Tablet als Prop (inline hier, da UI-spezifisch)
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { MadLab } from "../../shared/scifi/Environments";
import { Character, Expression, Pose } from "../../shared/scifi/Character";
import { T, INK_W } from "../../shared/scifi/tokens";
import { BADGES, FPS, WIDTH, HEIGHT } from "./cues";

const ease = Easing.bezier(0.42, 0, 0.58, 1);
const smootherstep = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
};


// --- Hologramm-Tablet ---------------------------------------------------
// Schwebendes rundes-ecktes UI-Panel vor Dr. L. zeigt die Bank-App.

const Tablet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  time: number;
  screen: React.ReactNode;
  glow?: string;
}> = ({ x, y, w, h, time, screen, glow = T.accentCyan }) => {
  const floatY = Math.sin(time * 1.8) * 6;
  return (
    <g transform={`translate(${x} ${y + floatY})`}>
      {/* Glow */}
      <rect
        x={-w / 2 - 20}
        y={-h / 2 - 20}
        width={w + 40}
        height={h + 40}
        rx={28}
        fill={glow}
        opacity={0.18}
      />
      {/* Bezel */}
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={22}
        fill="#2a1a52"
        stroke={T.ink}
        strokeWidth={INK_W}
      />
      {/* Screen */}
      <rect
        x={-w / 2 + 14}
        y={-h / 2 + 14}
        width={w - 28}
        height={h - 28}
        rx={14}
        fill="#0e0a24"
        stroke={glow}
        strokeWidth={3}
      />
      {/* Content clip */}
      <g>
        {screen}
      </g>
      {/* Scanline */}
      <rect
        x={-w / 2 + 14}
        y={-h / 2 + 14 + ((time * 120) % (h - 28))}
        width={w - 28}
        height={4}
        fill={glow}
        opacity={0.18}
      />
    </g>
  );
};

// Bank-App Screen Content
const AppScreen: React.FC<{ time: number; sec: number }> = ({ time, sec }) => {
  // Confetti spawn: ersten Hook (0 - 2 s) + jedes Badge
  const confettiFrame = sec < 2.5 || (sec >= 9.6 && sec < 10.1) || (sec >= 12.2 && sec < 12.7) || (sec >= 14.9 && sec < 15.4);
  return (
    <g>
      {/* Header "ARM-PROGRAMM" */}
      <rect x={-130} y={-200} width={260} height={46} rx={10} fill={T.accentPink} />
      <text
        x={0}
        y={-170}
        textAnchor="middle"
        fontFamily="Impact, Arial Black, sans-serif"
        fontSize={28}
        fill="#fff"
      >
        ARM-PROGRAMM
      </text>

      {/* Main content changes by beat */}
      {sec < 3.0 && <HookScreenContent time={time} />}
      {sec >= 3.0 && sec < 9.6 && <ProgramIntroContent time={time} />}
      {sec >= 9.6 && sec < 19.8 && <BadgesContent sec={sec} time={time} />}
      {sec >= 19.8 && sec < 24.0 && <PointsBarContent time={time} sec={sec} />}
      {sec >= 24.0 && sec < 28.6 && <PremiumContent time={time} sec={sec} />}
      {sec >= 28.6 && <EmptyAfterRealization />}

      {/* Confetti overlay */}
      {confettiFrame && <ConfettiBurst time={time} />}
    </g>
  );
};

const ConfettiBurst: React.FC<{ time: number }> = ({ time }) => (
  <g>
    {Array.from({ length: 24 }).map((_, i) => {
      const seed = i * 137;
      const sx = ((seed * 17) % 220) - 110;
      const sy = -180;
      const t = (time + (seed % 10) / 10) % 1;
      const y = sy + t * 400;
      const x = sx + Math.sin(t * 6 + i) * 20;
      const col = [T.accentPink, T.accentYellow, T.accentCyan, T.accentGreen][i % 4];
      return (
        <rect
          key={i}
          x={x - 4}
          y={y - 6}
          width={8}
          height={12}
          rx={2}
          fill={col}
          transform={`rotate(${(i * 37) % 360} ${x} ${y})`}
        />
      );
    })}
  </g>
);

const HookScreenContent: React.FC<{ time: number }> = ({ time }) => (
  <g>
    <text
      x={0}
      y={-30}
      textAnchor="middle"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize={54}
      fill={T.accentGreen}
    >
      ARM!
    </text>
    <text
      x={0}
      y={30}
      textAnchor="middle"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize={34}
      fill="#fff"
    >
      OFFIZIELL
    </text>
    <text
      x={0}
      y={75}
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize={22}
      fill={T.accentYellow}
    >
      🎉 Gratulation 🎉
    </text>
  </g>
);

const ProgramIntroContent: React.FC<{ time: number }> = ({ time }) => (
  <g>
    <text x={0} y={-50} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={22} fill="#aaa">BETA · v2.6</text>
    <text x={0} y={-10} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={40} fill={T.accentCyan}>ARMUT = SPASS</text>
    <text x={0} y={30} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={20} fill="#ccc">Jetzt mit Punktesystem!</text>
    {/* Fortschrittsbalken */}
    <rect x={-130} y={60} width={260} height={28} rx={14} fill="#1a1440" stroke={T.accentCyan} strokeWidth={2} />
    <rect x={-128} y={62} width={Math.min(256, 20 + time * 30)} height={24} rx={12} fill={T.accentCyan} />
    <text x={0} y={120} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={16} fill="#999">LOADING FUN…</text>
  </g>
);

const BadgesContent: React.FC<{ sec: number; time: number }> = ({ sec }) => {
  const active = BADGES.filter((b) => sec >= b.start && sec < b.end);
  return (
    <g>
      <text x={0} y={-140} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={18} fill="#aaa">ABZEICHEN</text>
      {/* Stack up to 3 badges, each slide-in */}
      {active.map((b, i) => {
        const age = sec - b.start;
        const slide = smootherstep(Math.min(1, age / 0.3));
        const y = -80 + i * 92;
        const alpha = interpolate(age, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
        return (
          <g key={b.icon} transform={`translate(${-200 + slide * 200} ${y})`} opacity={alpha}>
            <rect x={-130} y={-36} width={260} height={74} rx={14} fill="#1f1848" stroke={T.accentGreen} strokeWidth={3} />
            <BadgeIcon icon={b.icon} x={-96} y={0} />
            <text x={-50} y={-6} fontFamily="Impact, sans-serif" fontSize={22} fill="#fff">{b.label}</text>
            <text x={-50} y={22} fontFamily="Arial, sans-serif" fontSize={18} fill={T.accentGreen} fontWeight="bold">+{b.points} Punkte</text>
            {b.sticker && (
              <g transform="translate(108 -6) rotate(10)">
                <path
                  d="M 0 -18 L 6 -6 L 20 -4 L 10 6 L 14 20 L 0 12 L -14 20 L -10 6 L -20 -4 L -6 -6 Z"
                  fill={T.accentPink}
                  stroke={T.ink}
                  strokeWidth={2}
                />
                <text x={0} y={5} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={13} fill="#fff">WELL</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

const BadgeIcon: React.FC<{ icon: string; x: number; y: number }> = ({ icon, x, y }) => {
  if (icon === "butter") {
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect x={-18} y={-10} width={36} height={20} rx={3} fill={T.accentYellow} stroke={T.ink} strokeWidth={2} />
        <line x1={-22} y1={-14} x2={22} y2={14} stroke="#e13838" strokeWidth={5} />
      </g>
    );
  }
  if (icon === "heat") {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d="M 0 -18 L 0 18 M -16 -10 L 16 10 M 16 -10 L -16 10 M -18 0 L 18 0" stroke={T.accentCyan} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  }
  // friends
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={-8} cy={0} r={10} fill="#fff" stroke={T.ink} strokeWidth={2} />
      <circle cx={-10} cy={-2} r={2} fill={T.ink} />
      <circle cx={-6} cy={-2} r={2} fill={T.ink} />
      <path d="M -11 4 Q -8 1 -5 4" stroke={T.ink} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M 10 -14 L 22 -2 M 22 -14 L 10 -2" stroke="#e13838" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

const PointsBarContent: React.FC<{ time: number; sec: number }> = ({ sec }) => {
  const pts = Math.min(750, 750 * Math.min(1, (sec - 18.6) * 0.8));
  return (
    <g>
      <text x={0} y={-80} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={32} fill="#fff">DEIN SCORE</text>
      <text x={0} y={-30} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={64} fill={T.accentGreen}>
        {Math.floor(pts)}
      </text>
      <rect x={-130} y={10} width={260} height={28} rx={14} fill="#1a1440" stroke={T.accentGreen} strokeWidth={2} />
      <rect x={-128} y={12} width={(pts / 1000) * 256} height={24} rx={12} fill={T.accentGreen} />
      <text x={0} y={70} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={16} fill="#999">
        1000 für PREMIUM
      </text>
    </g>
  );
};

const PremiumContent: React.FC<{ time: number; sec: number }> = ({ sec, time }) => {
  const pulse = 1 + Math.sin(time * 6) * 0.04;
  // Nach bot7 (ab 24.6) zeigen wir die Pointe
  const revealed = sec >= 26.3;
  return (
    <g>
      {!revealed ? (
        <g transform={`scale(${pulse})`}>
          <rect x={-130} y={-60} width={260} height={120} rx={14} fill={T.accentYellow} stroke={T.ink} strokeWidth={4} />
          <text x={0} y={-20} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={36} fill={T.ink}>
            PREMIUM
          </text>
          <text x={0} y={16} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={32} fill={T.ink}>
            STATUS!
          </text>
          <text x={0} y={46} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={16} fill={T.ink}>
            🏆 mit 1000 Punkten 🏆
          </text>
        </g>
      ) : (
        <g>
          <text x={0} y={-80} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={20} fill="#aaa">
            PREMIUM =
          </text>
          <text x={0} y={-30} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={48} fill={T.accentGreen}>
            DEIN LEBEN
          </text>
          <text x={0} y={16} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={54} fill={T.accentPink}>
            2019
          </text>
          <g transform="translate(0 60)">
            <rect x={-70} y={-16} width={60} height={30} rx={3} fill="#9ccf4a" stroke={T.ink} strokeWidth={2} />
            <text x={-40} y={6} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={16} fill={T.ink}>10€</text>
            <text x={10} y={10} fontSize={30}>🍕</text>
          </g>
        </g>
      )}
    </g>
  );
};

const EmptyAfterRealization: React.FC = () => (
  <g>
    <text x={0} y={-10} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={22} fill="#666">
      Verbindung verloren
    </text>
    <text x={0} y={20} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={16} fill="#444">
      … dauerhaft.
    </text>
  </g>
);

// --- Character state machine -------------------------------------------

function pickCharacterState(sec: number, _frame: number): { expression: Expression; pose: Pose } {
  // Hook: neutral, then sarcastic side-eye nach "Du bist offiziell arm!"
  if (sec < 2.6) return { expression: "neutral", pose: "idle" };
  if (sec < 3.3) return { expression: "sarcastic", pose: "side_eye" };

  // Bot-Intro
  if (sec < 6.7) return { expression: "confused", pose: "idle" };
  if (sec < 9.5) return { expression: "angry", pose: "idle" };

  // Badges: zunehmende Toten-Blick-Energie
  if (sec < 12.1) return { expression: "sarcastic", pose: "side_eye" };
  if (sec < 14.8) return { expression: "angry", pose: "idle" };
  if (sec < 19.8) return { expression: "shocked", pose: "shocked_recoil" };

  // "Und was krieg ich dafuer?"
  if (sec < 21.6) return { expression: "neutral", pose: "presenting" };

  // Premium-Teaser
  if (sec < 24.9) return { expression: "confused", pose: "idle" };

  // "Was ist Premium?" + Pointe 2019
  if (sec < 26.3) return { expression: "confused", pose: "idle" };
  if (sec < 28.6) return { expression: "shocked", pose: "shocked_recoil" };

  // Button
  return { expression: "sarcastic", pose: "side_eye" };
}

// Replace invalid expression "sad" from the state picker
function normalizeExpression(e: any): Expression {
  const valid: Expression[] = ["neutral", "happy", "angry", "confused", "sarcastic", "shocked", "smug"];
  return valid.includes(e) ? e : "sarcastic";
}

// --- Final-Overlay ------------------------------------------------------

const AchievementOverlay: React.FC<{ sec: number }> = ({ sec }) => {
  if (sec < 28.6) return null;
  const age = sec - 28.6;
  const slide = smootherstep(Math.min(1, age / 0.25));
  const flicker = Math.floor(age * 20) % 2 === 0 ? 1 : 0.7;
  return (
    <g transform={`translate(${WIDTH / 2} ${HEIGHT * 0.28})`} opacity={slide * flicker}>
      <rect x={-WIDTH * 0.46} y={-170} width={WIDTH * 0.92} height={340} fill="#0a0a14" stroke={T.accentPink} strokeWidth={10} />
      <rect x={-WIDTH * 0.46} y={-170} width={WIDTH * 0.92} height={60} fill={T.accentPink} />
      <text x={0} y={-130} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={32} fill="#fff">
        ERFOLG FREIGESCHALTET
      </text>
      <text x={0} y={-40} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={80} fill={T.accentYellow}>
        REALITÄT
      </text>
      <text x={0} y={40} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={60} fill={T.accentGreen}>
        ERKANNT
      </text>
      <text x={0} y={120} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={24} fill="#aaa">
        — alle Punkte wurden gelöscht.
      </text>
    </g>
  );
};

// --- Composition -------------------------------------------------------

export const ArmShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Subtle camera: slow zoom-in, tiny pan right after each badge
  const baseZoom = interpolate(t, [0, 30], [1.0, 1.08], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  // Punch on each badge + final reveal
  const punch = ((): number => {
    const beats = [9.6, 12.2, 14.9, 26.3, 28.6];
    for (const b of beats) {
      if (t >= b && t < b + 0.35) {
        const u = (t - b) / 0.35;
        return 0.05 * Math.sin(u * Math.PI);
      }
    }
    return 0;
  })();

  // Lab bg
  // Character on the left-ish, tablet floating in front-right
  const charX = WIDTH * 0.3;
  const charY = HEIGHT * 0.68;

  // Tablet to the right of character, floating
  const tabletX = WIDTH * 0.68;
  const tabletY = HEIGHT * 0.48;
  const tabletW = 440;
  const tabletH = 520;

  const state = pickCharacterState(t, frame);
  const expression = normalizeExpression(state.expression);
  const pose = state.pose;

  // Micro-bob
  const bob = Math.sin(t * 2.5) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: T.bgDeep }}>
      <Audio src={staticFile("audio/arm.wav")} />
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <g
          transform={`translate(${WIDTH / 2} ${HEIGHT / 2}) scale(${baseZoom + punch}) translate(${-WIDTH / 2} ${-HEIGHT / 2})`}
        >
          <MadLab width={WIDTH} height={HEIGHT} time={t} />

          <Tablet
            x={tabletX}
            y={tabletY}
            w={tabletW}
            h={tabletH}
            time={t}
            screen={<AppScreen time={t} sec={t} />}
            glow={
              t < 3.0 ? T.accentGreen
              : t >= 26.3 && t < 28.6 ? T.accentPink
              : T.accentCyan
            }
          />

          <Character
            x={charX}
            y={charY}
            size={780}
            expression={expression}
            pose={pose}
            accessories={{ goggles: true, backpack: true, canister: true }}
            bob={bob}
            leanDeg={t > 3 && t < 25 ? -3 : 0}
            showEmote={t > 2.5 && t < 28}
          />
        </g>

        {/* Keine Untertitel — User-Request. */}

        {/* Final achievement unlock overlay */}
        <AchievementOverlay sec={t} />
      </svg>
    </AbsoluteFill>
  );
};
