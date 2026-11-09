/**
 * Faceless Sci-Fi Short: Haupt-Charakter.
 *
 * Direkt aus der Style-Referenz (STYLE_GUIDE.md).
 * Weiss, runder Kopf, keine Nase, kleine ovale Augen, Faeustling-Haende
 * mit Outline, keine Finger. Mimik via Augenbrauen + Mund + Emote-Symbol.
 *
 * API-Kontrakt:
 *   expression:  neutral | happy | angry | confused | sarcastic | shocked | smug
 *   pose:        idle | talking | shrug | pointing | panic_run |
 *                side_eye | shocked_recoil | presenting
 *   accessories: { goggles, backpack, canister, antenna }
 *   pointAt:     { x, y } relativ zum Charakter, wenn pose="pointing"
 *
 * Alles rendert in SVG. Platziere den Charakter in eine <svg>-Szene;
 * x/y sind das Zentrum des Koerpers (etwa Brustmitte).
 */
import React from "react";
import { T, INK_W, INK_W_FINE } from "./tokens";

export type Expression =
  | "neutral"
  | "happy"
  | "angry"
  | "confused"
  | "sarcastic"
  | "shocked"
  | "smug";

export type Pose =
  | "idle"
  | "talking"
  | "shrug"
  | "pointing"
  | "panic_run"
  | "side_eye"
  | "shocked_recoil"
  | "presenting";

export type Accessories = {
  goggles?: boolean;
  backpack?: boolean;
  canister?: boolean; // Guertelkanister rechts
  antenna?: boolean;
};

export type CharacterProps = {
  x: number;
  y: number;
  size?: number; // Gesamt-Figurenhoehe in px (default 820)
  expression?: Expression;
  pose?: Pose;
  accessories?: Accessories;
  bob?: number;     // vertikale Wippe, zusaetzlich zur Pose
  leanDeg?: number; // Kopfneigung
  squash?: number;  // 1 = neutral; <1 breit/flach, >1 hoch/schmal
  mirrored?: boolean;
  pointAt?: { x: number; y: number }; // Welt-Koord., relativ zu x/y
  showEmote?: boolean; // Emote-Symbol anzeigen (default true)
  opacity?: number;
};

// Alle Koordinaten relativ zu einem "unit"-Raster von 300 breit x 500 hoch.
// Die Figur wird dann gleichmaessig auf `size` skaliert.
const UNIT_W = 300;
const UNIT_H = 500;

export const Character: React.FC<CharacterProps> = ({
  x,
  y,
  size = 820,
  expression = "neutral",
  pose = "idle",
  accessories = {},
  bob = 0,
  leanDeg = 0,
  squash = 1,
  mirrored = false,
  pointAt,
  showEmote = true,
  opacity = 1,
}) => {
  const scale = size / UNIT_H;
  const headCenter = { x: 0, y: -170 };
  const headR = 95; // 95 px im Unit-Raster = Radius

  // Body-Deformation per Pose
  const poseSquash = getPoseSquash(pose);
  const bodyTilt = getBodyTilt(pose);

  return (
    <g
      transform={`translate(${x} ${y + bob}) scale(${(mirrored ? -1 : 1) * scale} ${scale})`}
      opacity={opacity}
    >
      {/* Boden-Schatten */}
      <ellipse
        cx={0}
        cy={170}
        rx={110}
        ry={14}
        fill="rgba(0,0,0,0.28)"
      />

      {/* Alles innerhalb dieses Groups kippt leicht mit dem Body-Tilt */}
      <g transform={`rotate(${bodyTilt})`}>
        {/* Beine zuerst (hinten) */}
        <Legs pose={pose} />

        {/* Rucksack (hinter dem Koerper gezeichnet) */}
        {accessories.backpack && <BackpackBehind />}

        {/* Koerper */}
        <Body squash={squash * poseSquash.body} />

        {/* Guertel + Kanister */}
        {accessories.canister && <BeltCanister />}

        {/* Arme - vor dem Koerper */}
        <Arms pose={pose} pointAt={pointAt} />

        {/* Rucksack-Riemen vorn */}
        {accessories.backpack && <BackpackStraps />}

        {/* Kopf */}
        <g transform={`translate(${headCenter.x} ${headCenter.y + poseSquash.headDy}) rotate(${leanDeg})`}>
          <Head r={headR} />
          <Face
            expression={expression}
            pose={pose}
            r={headR}
          />
          {accessories.goggles && <Goggles r={headR} />}
          {accessories.antenna && <Antenna r={headR} />}
        </g>

        {/* Emote-Symbol */}
        {showEmote && (
          <g transform={`translate(${headCenter.x} ${headCenter.y - 20})`}>
            <Emote expression={expression} r={headR} />
          </g>
        )}
      </g>
    </g>
  );
};

// --- Head --------------------------------------------------------------

const Head: React.FC<{ r: number }> = ({ r }) => (
  <circle cx={0} cy={0} r={r} fill={T.figureFill} stroke={T.ink} strokeWidth={INK_W} />
);

// --- Face --------------------------------------------------------------

const Face: React.FC<{ expression: Expression; pose: Pose; r: number }> = ({
  expression,
  pose,
  r,
}) => {
  const eyeDx = 0.36 * r;
  const eyeY = -0.08 * r;
  const eyeRx = 0.13 * r;  // etwas groesser als Spec (hat Charakter)
  const eyeRy = 0.18 * r;
  const mouthY = 0.25 * r;

  // Blickversatz: Sarcastic/Side-Eye blicken nach links.
  const gazeX = expression === "sarcastic" || pose === "side_eye" ? -0.08 * r : 0;

  // Eye rendering per Expression
  const eyes = renderEyes(expression, eyeDx, eyeY, eyeRx, eyeRy, gazeX, r);

  // Brows
  const brows = renderBrows(expression, eyeDx, eyeY, r);

  // Mouth (open/closed decided per expression + pose)
  const mouth = renderMouth(expression, pose, mouthY, r);

  return (
    <>
      {brows}
      {eyes}
      {mouth}
    </>
  );
};

function renderEyes(
  expr: Expression,
  dx: number,
  y: number,
  rx: number,
  ry: number,
  gazeX: number,
  r: number,
): React.ReactNode {
  // Shocked: weisse Scheren-Ovale mit kleinen Pupillen
  if (expr === "shocked") {
    return (
      <>
        <ellipse cx={-dx} cy={y} rx={rx * 1.5} ry={ry * 1.3} fill="#fff" stroke={T.ink} strokeWidth={INK_W_FINE - 1} />
        <ellipse cx={dx} cy={y} rx={rx * 1.5} ry={ry * 1.3} fill="#fff" stroke={T.ink} strokeWidth={INK_W_FINE - 1} />
        <circle cx={-dx} cy={y + 0.03 * r} r={rx * 0.5} fill={T.ink} />
        <circle cx={dx} cy={y + 0.03 * r} r={rx * 0.5} fill={T.ink} />
      </>
    );
  }

  // Happy: nach oben geschlossene Boegen ("^^")
  if (expr === "happy") {
    return (
      <>
        <path
          d={`M ${-dx - rx * 1.2} ${y + ry * 0.5}
              Q ${-dx} ${y - ry * 1.3} ${-dx + rx * 1.2} ${y + ry * 0.5}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${dx - rx * 1.2} ${y + ry * 0.5}
              Q ${dx} ${y - ry * 1.3} ${dx + rx * 1.2} ${y + ry * 0.5}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }

  // Smug: halbgeschlossene Boegen von oben nach unten (Augen-Linien)
  if (expr === "smug") {
    return (
      <>
        <path
          d={`M ${-dx - rx * 1.1} ${y - ry * 0.3}
              Q ${-dx} ${y + ry * 0.7} ${-dx + rx * 1.1} ${y - ry * 0.3}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${dx - rx * 1.1} ${y - ry * 0.3}
              Q ${dx} ${y + ry * 0.7} ${dx + rx * 1.1} ${y - ry * 0.3}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }

  // Confused: ein Auge hoeher, eines tiefer
  if (expr === "confused") {
    return (
      <>
        <ellipse cx={-dx + gazeX} cy={y - 0.04 * r} rx={rx} ry={ry} fill={T.ink} />
        <ellipse cx={dx + gazeX} cy={y + 0.03 * r} rx={rx} ry={ry * 0.8} fill={T.ink} />
      </>
    );
  }

  // Angry: schmaler + nach innen gerueckt
  if (expr === "angry") {
    return (
      <>
        <ellipse cx={-dx + 0.04 * r} cy={y + 0.03 * r} rx={rx * 0.9} ry={ry * 0.85} fill={T.ink} />
        <ellipse cx={dx - 0.04 * r} cy={y + 0.03 * r} rx={rx * 0.9} ry={ry * 0.85} fill={T.ink} />
      </>
    );
  }

  // Sarcastic / default: Ovale mit Gaze-Offset
  return (
    <>
      <ellipse cx={-dx + gazeX} cy={y} rx={rx} ry={ry} fill={T.ink} />
      <ellipse cx={dx + gazeX} cy={y} rx={rx} ry={ry} fill={T.ink} />
    </>
  );
}

function renderBrows(
  expr: Expression,
  dx: number,
  eyeY: number,
  r: number,
): React.ReactNode {
  const browY = eyeY - 0.28 * r;
  const w = 0.24 * r;

  if (expr === "angry") {
    return (
      <>
        <path
          d={`M ${-dx - w * 0.8} ${browY - 0.08 * r} L ${-dx + w * 0.8} ${browY + 0.12 * r}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE + 1}
          strokeLinecap="round"
        />
        <path
          d={`M ${dx + w * 0.8} ${browY - 0.08 * r} L ${dx - w * 0.8} ${browY + 0.12 * r}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE + 1}
          strokeLinecap="round"
        />
      </>
    );
  }

  if (expr === "sarcastic") {
    // Linke Braue hoch, rechte normal
    return (
      <>
        <path
          d={`M ${-dx - w * 0.8} ${browY - 0.16 * r} L ${-dx + w * 0.9} ${browY - 0.26 * r}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE + 1}
          strokeLinecap="round"
        />
        <path
          d={`M ${dx - w * 0.8} ${browY} L ${dx + w * 0.8} ${browY}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE + 1}
          strokeLinecap="round"
        />
      </>
    );
  }

  if (expr === "confused") {
    return (
      <>
        <path
          d={`M ${-dx - w * 0.8} ${browY - 0.1 * r} L ${-dx + w * 0.8} ${browY - 0.25 * r}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE + 1}
          strokeLinecap="round"
        />
        <path
          d={`M ${dx - w * 0.8} ${browY + 0.1 * r} L ${dx + w * 0.8} ${browY}`}
          stroke={T.ink}
          strokeWidth={INK_W_FINE + 1}
          strokeLinecap="round"
        />
      </>
    );
  }

  if (expr === "shocked") {
    return (
      <>
        <path d={`M ${-dx - w} ${browY - 0.3 * r} L ${-dx + w} ${browY - 0.3 * r}`} stroke={T.ink} strokeWidth={INK_W_FINE} strokeLinecap="round" />
        <path d={`M ${dx - w} ${browY - 0.3 * r} L ${dx + w} ${browY - 0.3 * r}`} stroke={T.ink} strokeWidth={INK_W_FINE} strokeLinecap="round" />
      </>
    );
  }

  // Happy / smug / neutral: keine expliziten Brauen (Augen uebernehmen)
  return null;
}

function renderMouth(
  expr: Expression,
  pose: Pose,
  y: number,
  r: number,
): React.ReactNode {
  const openPink = T.mouthInner;
  const open = pose === "talking" || expr === "shocked" || expr === "happy" || expr === "angry";

  if (expr === "shocked") {
    return (
      <ellipse cx={0} cy={y + 0.1 * r} rx={0.17 * r} ry={0.22 * r} fill={openPink} stroke={T.ink} strokeWidth={INK_W_FINE} />
    );
  }

  if (expr === "happy") {
    // Happy: breiter offener Mund mit Zunge
    return (
      <>
        <path
          d={`M ${-0.22 * r} ${y - 0.02 * r}
              Q 0 ${y + 0.3 * r} ${0.22 * r} ${y - 0.02 * r}
              Q 0 ${y + 0.15 * r} ${-0.22 * r} ${y - 0.02 * r} Z`}
          fill={openPink}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          strokeLinejoin="round"
        />
      </>
    );
  }

  if (expr === "angry") {
    return (
      <>
        <path
          d={`M ${-0.18 * r} ${y + 0.02 * r}
              Q 0 ${y + 0.2 * r} ${0.18 * r} ${y + 0.02 * r}
              Q 0 ${y + 0.1 * r} ${-0.18 * r} ${y + 0.02 * r} Z`}
          fill={openPink}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          strokeLinejoin="round"
        />
      </>
    );
  }

  if (pose === "talking") {
    return (
      <ellipse cx={0} cy={y + 0.04 * r} rx={0.13 * r} ry={0.08 * r} fill={openPink} stroke={T.ink} strokeWidth={INK_W_FINE} />
    );
  }

  if (expr === "sarcastic" || expr === "smug") {
    // Smirk: linker Mundwinkel runter, rechter hoch (bei sarcastic, nicht mirrored)
    return (
      <path
        d={`M ${-0.12 * r} ${y + 0.04 * r}
            Q ${-0.03 * r} ${y + 0.12 * r} ${0.14 * r} ${y - 0.03 * r}`}
        stroke={T.ink}
        strokeWidth={INK_W_FINE}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (expr === "confused") {
    return (
      <path
        d={`M ${-0.12 * r} ${y + 0.04 * r}
            Q ${-0.04 * r} ${y - 0.04 * r} ${0.02 * r} ${y + 0.03 * r}
            Q ${0.08 * r} ${y + 0.1 * r} ${0.14 * r} ${y + 0.02 * r}`}
        stroke={T.ink}
        strokeWidth={INK_W_FINE}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  // Neutral: kurze Linie
  return (
    <line
      x1={-0.08 * r}
      y1={y + 0.02 * r}
      x2={0.08 * r}
      y2={y + 0.02 * r}
      stroke={T.ink}
      strokeWidth={INK_W_FINE}
      strokeLinecap="round"
    />
  );
}

// --- Emote-Symbole -----------------------------------------------------

const Emote: React.FC<{ expression: Expression; r: number }> = ({
  expression,
  r,
}) => {
  const above = -r - 30;
  const right = r + 25;

  if (expression === "happy") {
    return (
      <>
        <path d={`M ${-r * 0.6} ${above} L ${-r * 0.3} ${above - 25} L ${-r * 0.4} ${above}`} stroke={T.accentYellow} strokeWidth={INK_W_FINE + 2} strokeLinecap="round" />
        <path d={`M ${r * 0.3} ${above - 25} L ${r * 0.6} ${above} L ${r * 0.4} ${above}`} stroke={T.accentYellow} strokeWidth={INK_W_FINE + 2} strokeLinecap="round" />
      </>
    );
  }

  if (expression === "angry") {
    // Vein-Cluster oben rechts
    return (
      <g transform={`translate(${r * 0.7} ${above + 10})`}>
        {[0, 72, 144, 216, 288].map((deg) => (
          <line
            key={deg}
            x1={0}
            y1={0}
            x2={Math.cos((deg * Math.PI) / 180) * 18}
            y2={Math.sin((deg * Math.PI) / 180) * 18}
            stroke="#e13838"
            strokeWidth={INK_W_FINE}
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  }

  if (expression === "confused") {
    return (
      <g transform={`translate(${right} ${above + 10})`}>
        <text
          textAnchor="middle"
          fontFamily="Impact, sans-serif"
          fontSize={64}
          fill={T.accentPink}
          stroke={T.ink}
          strokeWidth={4}
          paintOrder="stroke"
        >
          ?
        </text>
      </g>
    );
  }

  if (expression === "sarcastic") {
    // Schweisstropfen rechts am Kopf
    return (
      <path
        d={`M ${right - 10} ${above + 40}
            Q ${right - 2} ${above + 55} ${right + 6} ${above + 70}
            Q ${right + 14} ${above + 55} ${right + 6} ${above + 40}
            Q ${right - 2} ${above + 30} ${right - 10} ${above + 40} Z`}
        fill={T.accentCyan}
        stroke={T.ink}
        strokeWidth={INK_W_FINE - 1}
      />
    );
  }

  if (expression === "shocked") {
    // Gelber Starburst ueber Kopf
    const spikes = 8;
    const inner = 18;
    const outer = 42;
    const pts: string[] = [];
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI) / spikes - Math.PI / 2;
      pts.push(`${Math.cos(a) * rad},${Math.sin(a) * rad}`);
    }
    return (
      <g transform={`translate(0 ${above - 10})`}>
        <polygon
          points={pts.join(" ")}
          fill={T.accentYellow}
          stroke={T.ink}
          strokeWidth={INK_W_FINE}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (expression === "smug") {
    // Weisser Sparkle
    return (
      <g transform={`translate(${right} ${above + 20})`}>
        <path
          d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z"
          fill="#fff"
          stroke={T.ink}
          strokeWidth={INK_W_FINE - 1}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  return null;
};

// --- Body --------------------------------------------------------------

const Body: React.FC<{ squash: number }> = ({ squash }) => {
  const w = 170;
  const h = 170;
  const topY = -70;
  const botY = topY + h * squash;
  return (
    <path
      d={`M ${-w * 0.4} ${topY}
          Q ${-w * 0.55} ${topY + h * 0.4}, ${-w * 0.55} ${botY - 30}
          Q ${-w * 0.5} ${botY + 10}, ${0} ${botY + 15}
          Q ${w * 0.5} ${botY + 10}, ${w * 0.55} ${botY - 30}
          Q ${w * 0.55} ${topY + h * 0.4}, ${w * 0.4} ${topY}
          Q ${w * 0.2} ${topY - 5}, ${0} ${topY - 5}
          Q ${-w * 0.2} ${topY - 5}, ${-w * 0.4} ${topY} Z`}
      fill={T.figureFill}
      stroke={T.ink}
      strokeWidth={INK_W}
      strokeLinejoin="round"
    />
  );
};

// --- Legs --------------------------------------------------------------

const Legs: React.FC<{ pose: Pose }> = ({ pose }) => {
  // Standard-Beine
  const legProps = { fill: T.figureFill, stroke: T.ink, strokeWidth: INK_W, strokeLinejoin: "round" as const };

  if (pose === "panic_run") {
    return (
      <>
        {/* Linkes Bein vorn, gestreckt */}
        <path d="M -20 190 L -70 240 L -40 250 L 0 210 Z" {...legProps} />
        {/* Rechtes Bein hinten, angewinkelt */}
        <path d="M 30 190 L 80 220 L 60 240 L 10 215 Z" {...legProps} />
      </>
    );
  }

  return (
    <>
      <path d="M -40 80 L -40 150 L -70 165 L -20 165 L -15 140 L -15 80 Z" {...legProps} />
      <path d="M 40 80 L 40 150 L 70 165 L 20 165 L 15 140 L 15 80 Z" {...legProps} />
    </>
  );
};

// --- Arms --------------------------------------------------------------

const Arms: React.FC<{ pose: Pose; pointAt?: { x: number; y: number } }> = ({
  pose,
  pointAt,
}) => {
  if (pose === "pointing" && pointAt) {
    // Rechter Arm zeigt auf Ziel, linker Hand an Hueftknochen
    const targetX = pointAt.x;
    const targetY = pointAt.y;
    const shoulderR = { x: 70, y: -40 };
    const dx = targetX - shoulderR.x;
    const dy = targetY - shoulderR.y;
    const len = Math.min(220, Math.hypot(dx, dy));
    const ang = Math.atan2(dy, dx);
    const handX = shoulderR.x + Math.cos(ang) * len;
    const handY = shoulderR.y + Math.sin(ang) * len;
    return (
      <>
        {/* Linker Arm (unsere Linke) an Huefte, deutlich seitlich raus */}
        <ArmPath from={{ x: -70, y: -40 }} to={{ x: -125, y: 60 }} />
        <Hand x={-125} y={60} />
        {/* Rechter Arm zum Ziel */}
        <ArmPath from={shoulderR} to={{ x: handX, y: handY }} />
        <Hand x={handX} y={handY} pointing />
      </>
    );
  }

  if (pose === "presenting") {
    return (
      <>
        <ArmPath from={{ x: -70, y: -40 }} to={{ x: -180, y: 40 }} />
        <Hand x={-180} y={40} />
        <ArmPath from={{ x: 70, y: -40 }} to={{ x: 180, y: 40 }} />
        <Hand x={180} y={40} />
      </>
    );
  }

  if (pose === "shrug") {
    return (
      <>
        <ArmPath from={{ x: -70, y: -50 }} to={{ x: -140, y: -70 }} />
        <Hand x={-140} y={-70} palmUp />
        <ArmPath from={{ x: 70, y: -50 }} to={{ x: 140, y: -70 }} />
        <Hand x={140} y={-70} palmUp />
      </>
    );
  }

  if (pose === "panic_run") {
    return (
      <>
        <ArmPath from={{ x: -70, y: -40 }} to={{ x: -140, y: -130 }} />
        <Hand x={-140} y={-130} />
        <ArmPath from={{ x: 70, y: -40 }} to={{ x: 150, y: -110 }} />
        <Hand x={150} y={-110} />
      </>
    );
  }

  if (pose === "shocked_recoil") {
    return (
      <>
        <ArmPath from={{ x: -70, y: -40 }} to={{ x: -130, y: -100 }} />
        <Hand x={-130} y={-100} />
        <ArmPath from={{ x: 70, y: -40 }} to={{ x: 130, y: -100 }} />
        <Hand x={130} y={-100} />
      </>
    );
  }

  // idle / talking / side_eye: haengende Arme
  return (
    <>
      <ArmPath from={{ x: -70, y: -40 }} to={{ x: -115, y: 55 }} />
      <Hand x={-115} y={55} />
      <ArmPath from={{ x: 70, y: -40 }} to={{ x: 115, y: 55 }} />
      <Hand x={115} y={55} />
    </>
  );
};

const ArmPath: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number } }> = ({
  from,
  to,
}) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  // Leichte Bogen-Deformation
  const nx = -(to.y - from.y);
  const ny = to.x - from.x;
  const n = Math.hypot(nx, ny) || 1;
  const bend = 14;
  const cx = midX + (nx / n) * bend;
  const cy = midY + (ny / n) * bend;
  return (
    <path
      d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
      stroke={T.ink}
      strokeWidth={INK_W * 2.6}
      strokeLinecap="round"
      fill="none"
    />
  );
};

const Hand: React.FC<{
  x: number;
  y: number;
  pointing?: boolean;
  palmUp?: boolean;
}> = ({ x, y, pointing, palmUp }) => {
  if (pointing) {
    // Mitten, aber mit Daumen-Andeutung nach oben
    return (
      <g transform={`translate(${x} ${y})`}>
        <ellipse cx={0} cy={0} rx={30} ry={22} fill={T.figureFill} stroke={T.ink} strokeWidth={INK_W} />
        <ellipse cx={-5} cy={-16} rx={10} ry={14} fill={T.figureFill} stroke={T.ink} strokeWidth={INK_W} />
      </g>
    );
  }
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={26}
      ry={palmUp ? 16 : 24}
      fill={T.figureFill}
      stroke={T.ink}
      strokeWidth={INK_W}
    />
  );
};

// --- Accessories -------------------------------------------------------

const Goggles: React.FC<{ r: number }> = ({ r }) => {
  const y = -r * 0.75;
  const lensR = r * 0.3;
  return (
    <g>
      {/* Strap */}
      <path
        d={`M ${-r * 1.02} ${y + lensR * 0.2} Q 0 ${y - lensR * 0.3} ${r * 1.02} ${y + lensR * 0.2}`}
        stroke={T.ink}
        strokeWidth={INK_W}
        fill="none"
      />
      {/* Linsen */}
      <circle cx={-r * 0.4} cy={y} r={lensR} fill={T.accentGreen} stroke={T.ink} strokeWidth={INK_W} />
      <circle cx={r * 0.4} cy={y} r={lensR} fill={T.accentGreen} stroke={T.ink} strokeWidth={INK_W} />
      {/* Glanz */}
      <ellipse cx={-r * 0.4 - lensR * 0.3} cy={y - lensR * 0.3} rx={lensR * 0.25} ry={lensR * 0.15} fill="rgba(255,255,255,0.6)" />
      <ellipse cx={r * 0.4 - lensR * 0.3} cy={y - lensR * 0.3} rx={lensR * 0.25} ry={lensR * 0.15} fill="rgba(255,255,255,0.6)" />
    </g>
  );
};

const Antenna: React.FC<{ r: number }> = ({ r }) => (
  <g>
    <line x1={0} y1={-r} x2={0} y2={-r - 35} stroke={T.ink} strokeWidth={INK_W_FINE} strokeLinecap="round" />
    <circle cx={0} cy={-r - 40} r={8} fill={T.accentPink} stroke={T.ink} strokeWidth={INK_W_FINE} />
  </g>
);

const BackpackBehind: React.FC = () => (
  <g>
    {/* Hinter dem Koerper: Rucksack-Korpus */}
    <rect x={-70} y={-120} width={140} height={190} rx={22} fill={T.bgMid} stroke={T.ink} strokeWidth={INK_W} />
    {/* Mittelstreifen */}
    <rect x={-45} y={-100} width={90} height={150} rx={10} fill={T.bgDeep} stroke={T.ink} strokeWidth={INK_W_FINE} />
  </g>
);

const BackpackStraps: React.FC = () => (
  <g>
    <path d="M -40 -70 L -55 60" stroke={T.ink} strokeWidth={INK_W} strokeLinecap="round" />
    <path d="M 40 -70 L 55 60" stroke={T.ink} strokeWidth={INK_W} strokeLinecap="round" />
  </g>
);

const BeltCanister: React.FC = () => (
  <g transform="translate(70 90) rotate(-8)">
    <rect x={-22} y={-45} width={44} height={75} rx={10} fill={T.accentGreen} stroke={T.ink} strokeWidth={INK_W} />
    <rect x={-18} y={-38} width={36} height={58} rx={6} fill={T.accentGreenDeep} opacity={0.6} />
    <rect x={-26} y={-55} width={52} height={14} rx={6} fill="#aaa" stroke={T.ink} strokeWidth={INK_W_FINE} />
    <circle cx={0} cy={-62} r={5} fill={T.accentYellow} stroke={T.ink} strokeWidth={2} />
    {/* Blasen innen */}
    <circle cx={-6} cy={0} r={3} fill="rgba(255,255,255,0.7)" />
    <circle cx={5} cy={-10} r={2} fill="rgba(255,255,255,0.7)" />
  </g>
);

// --- Pose-Helpers ------------------------------------------------------

function getPoseSquash(pose: Pose): { body: number; headDy: number } {
  if (pose === "shocked_recoil") return { body: 1.12, headDy: -10 };
  if (pose === "panic_run") return { body: 1.08, headDy: -5 };
  if (pose === "shrug") return { body: 0.95, headDy: -4 };
  return { body: 1, headDy: 0 };
}

function getBodyTilt(pose: Pose): number {
  if (pose === "panic_run") return -12;
  if (pose === "shocked_recoil") return 8;
  if (pose === "pointing") return -4;
  return 0;
}
