/**
 * Minimalistische Cartoon-Figur, weisser runder Kopf + dicke schwarze Outline.
 * Alle Teile sind SVG und skalieren sauber auf 1080x1920.
 */
import React from "react";

export type Expression =
  | "neutral"
  | "shocked"
  | "angry"
  | "cheer"
  | "facepalm"
  | "smug"
  | "sad"
  | "happy";

export type CharacterProps = {
  x: number;
  y: number;
  size?: number;           // Kopfdurchmesser in px (default 180)
  expression?: Expression;
  talking?: boolean;       // Mund auf
  leanDeg?: number;        // Oberkoerperneigung
  bobY?: number;           // Vertikale Wippe
  squash?: number;         // 1 = normal; <1 gestaucht, >1 gestreckt
  skin?: string;           // Gesichtsfarbe (weiss by default, Erde: hellblau etc.)
  shirt?: string;          // Anzug/Oberteil
  tie?: string;            // Krawatte, optional
  mirrored?: boolean;      // Links/rechts drehen
  hatTag?: string;         // Optionales Label (z.B. "A" / "B")
  opacity?: number;
};

const INK = "#0a0a0a";
const INK_WIDTH = 7;

export const Character: React.FC<CharacterProps> = ({
  x,
  y,
  size = 180,
  expression = "neutral",
  talking = false,
  leanDeg = 0,
  bobY = 0,
  squash = 1,
  skin = "#ffffff",
  shirt = "#2b2b2b",
  tie,
  mirrored = false,
  hatTag,
  opacity = 1,
}) => {
  const s = size / 180;
  const headR = size / 2;
  const bodyW = size * 1.05;
  const bodyH = size * 1.35;

  // Mundgeometrie je nach Expression
  const mouth = renderMouth(expression, talking, size);
  const eyes = renderEyes(expression, size);
  const brows = renderBrows(expression, size);
  const hand = renderFacepalmHand(expression, size);

  return (
    <g
      transform={`translate(${x} ${y + bobY}) rotate(${leanDeg}) scale(${mirrored ? -1 : 1} 1) scale(${1 / squash} ${squash})`}
      opacity={opacity}
    >
      {/* Schatten am Boden */}
      <ellipse
        cx={0}
        cy={bodyH + headR + 10}
        rx={bodyW * 0.55}
        ry={9 * s}
        fill="rgba(0,0,0,0.28)"
      />

      {/* Koerper */}
      <path
        d={bodyPath(bodyW, bodyH, headR)}
        fill={shirt}
        stroke={INK}
        strokeWidth={INK_WIDTH}
        strokeLinejoin="round"
      />
      {tie && (
        <path
          d={`M ${-10 * s} ${headR + 4 * s} L ${10 * s} ${headR + 4 * s} L ${18 * s} ${headR + 55 * s} L ${0} ${headR + 85 * s} L ${-18 * s} ${headR + 55 * s} Z`}
          fill={tie}
          stroke={INK}
          strokeWidth={INK_WIDTH * 0.7}
          strokeLinejoin="round"
        />
      )}

      {/* Arme — einfache Stummel, bei Jubel nach oben */}
      {renderArms(expression, size, bodyW, headR)}

      {/* Beine */}
      <path
        d={`M ${-bodyW * 0.22} ${headR + bodyH - 10 * s}
            L ${-bodyW * 0.22} ${headR + bodyH + 55 * s}`}
        stroke={INK}
        strokeWidth={INK_WIDTH * 1.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${bodyW * 0.22} ${headR + bodyH - 10 * s}
            L ${bodyW * 0.22} ${headR + bodyH + 55 * s}`}
        stroke={INK}
        strokeWidth={INK_WIDTH * 1.4}
        strokeLinecap="round"
        fill="none"
      />

      {/* Kopf */}
      <circle
        cx={0}
        cy={0}
        r={headR}
        fill={skin}
        stroke={INK}
        strokeWidth={INK_WIDTH}
      />
      {brows}
      {eyes}
      {mouth}
      {hand}
      {hatTag && (
        <g transform={`translate(0 ${-headR - 16 * s}) scale(${mirrored ? -1 : 1} 1)`}>
          <rect
            x={-28 * s}
            y={-28 * s}
            width={56 * s}
            height={28 * s}
            rx={6 * s}
            fill="#ffe66d"
            stroke={INK}
            strokeWidth={INK_WIDTH}
          />
          <text
            x={0}
            y={-7 * s}
            textAnchor="middle"
            fontFamily="Impact, sans-serif"
            fontSize={22 * s}
            fill={INK}
          >
            {hatTag}
          </text>
        </g>
      )}
    </g>
  );
};

function bodyPath(w: number, h: number, headR: number): string {
  const top = headR + 4;
  const bot = headR + h;
  return `M ${-w / 2} ${top}
          Q ${-w / 2 - 6} ${top + h * 0.5}, ${-w / 2 + 4} ${bot}
          L ${w / 2 - 4} ${bot}
          Q ${w / 2 + 6} ${top + h * 0.5}, ${w / 2} ${top}
          Z`;
}

function renderEyes(expr: Expression, size: number): React.ReactNode {
  const s = size / 180;
  const dx = 32 * s;
  const dy = -8 * s;
  const r = 7 * s;

  if (expr === "shocked") {
    return (
      <>
        <circle cx={-dx} cy={dy} r={r * 1.7} fill="#fff" stroke={INK} strokeWidth={3} />
        <circle cx={dx} cy={dy} r={r * 1.7} fill="#fff" stroke={INK} strokeWidth={3} />
        <circle cx={-dx} cy={dy} r={r * 0.7} fill={INK} />
        <circle cx={dx} cy={dy} r={r * 0.7} fill={INK} />
      </>
    );
  }
  if (expr === "angry") {
    return (
      <>
        <circle cx={-dx} cy={dy + 2} r={r} fill={INK} />
        <circle cx={dx} cy={dy + 2} r={r} fill={INK} />
      </>
    );
  }
  if (expr === "cheer" || expr === "happy") {
    // Lachbogen-Augen
    return (
      <>
        <path d={`M ${-dx - 10 * s} ${dy + 2} Q ${-dx} ${dy - 14 * s} ${-dx + 10 * s} ${dy + 2}`} stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d={`M ${dx - 10 * s} ${dy + 2} Q ${dx} ${dy - 14 * s} ${dx + 10 * s} ${dy + 2}`} stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (expr === "sad") {
    return (
      <>
        <circle cx={-dx} cy={dy + 6} r={r} fill={INK} />
        <circle cx={dx} cy={dy + 6} r={r} fill={INK} />
      </>
    );
  }
  if (expr === "smug") {
    return (
      <>
        <path d={`M ${-dx - 10 * s} ${dy + 2} L ${-dx + 10 * s} ${dy + 2}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${dx - 10 * s} ${dy + 2} L ${dx + 10 * s} ${dy + 2}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </>
    );
  }
  // neutral / facepalm
  return (
    <>
      <circle cx={-dx} cy={dy} r={r} fill={INK} />
      <circle cx={dx} cy={dy} r={r} fill={INK} />
    </>
  );
}

function renderBrows(expr: Expression, size: number): React.ReactNode {
  const s = size / 180;
  const dx = 32 * s;
  if (expr === "angry") {
    return (
      <>
        <path d={`M ${-dx - 16 * s} ${-28 * s} L ${-dx + 16 * s} ${-18 * s}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${dx + 16 * s} ${-28 * s} L ${dx - 16 * s} ${-18 * s}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </>
    );
  }
  if (expr === "sad") {
    return (
      <>
        <path d={`M ${-dx - 14 * s} ${-18 * s} L ${-dx + 14 * s} ${-28 * s}`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d={`M ${dx + 14 * s} ${-18 * s} L ${dx - 14 * s} ${-28 * s}`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
      </>
    );
  }
  if (expr === "shocked") {
    return (
      <>
        <path d={`M ${-dx - 14 * s} ${-36 * s} L ${-dx + 14 * s} ${-36 * s}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d={`M ${dx - 14 * s} ${-36 * s} L ${dx + 14 * s} ${-36 * s}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </>
    );
  }
  return null;
}

function renderMouth(expr: Expression, talking: boolean, size: number): React.ReactNode {
  const s = size / 180;
  const y = 28 * s;

  if (expr === "shocked") {
    // Riesige O-Form
    return <ellipse cx={0} cy={y + 6 * s} rx={15 * s} ry={22 * s} fill={INK} />;
  }

  if (talking) {
    // Offener Mund, oval
    return (
      <ellipse cx={0} cy={y + 2 * s} rx={16 * s} ry={9 * s} fill={INK} />
    );
  }

  if (expr === "cheer" || expr === "happy") {
    return (
      <path
        d={`M ${-22 * s} ${y - 4 * s}
            Q 0 ${y + 24 * s}, ${22 * s} ${y - 4 * s}`}
        stroke={INK}
        strokeWidth={5}
        fill="#521010"
        strokeLinecap="round"
      />
    );
  }

  if (expr === "angry") {
    return (
      <path
        d={`M ${-22 * s} ${y + 10 * s}
            Q 0 ${y - 4 * s}, ${22 * s} ${y + 10 * s}`}
        stroke={INK}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (expr === "smug") {
    return (
      <path
        d={`M ${-18 * s} ${y}
            Q ${-6 * s} ${y + 14 * s}, ${18 * s} ${y - 2 * s}`}
        stroke={INK}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (expr === "sad") {
    return (
      <path
        d={`M ${-18 * s} ${y + 8 * s}
            Q 0 ${y - 4 * s}, ${18 * s} ${y + 8 * s}`}
        stroke={INK}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  // neutral (geschlossen)
  return (
    <line
      x1={-12 * s}
      y1={y + 2 * s}
      x2={12 * s}
      y2={y + 2 * s}
      stroke={INK}
      strokeWidth={5}
      strokeLinecap="round"
    />
  );
}

function renderArms(
  expr: Expression,
  size: number,
  bodyW: number,
  headR: number,
): React.ReactNode {
  const s = size / 180;
  const shoulderY = headR + 18 * s;

  if (expr === "cheer") {
    // Arme nach oben, "Jubel"
    return (
      <>
        <path
          d={`M ${-bodyW * 0.42} ${shoulderY}
              Q ${-bodyW * 0.9} ${shoulderY - 60 * s}, ${-bodyW * 0.85} ${shoulderY - 140 * s}`}
          stroke={INK}
          strokeWidth={INK_WIDTH * 1.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${bodyW * 0.42} ${shoulderY}
              Q ${bodyW * 0.9} ${shoulderY - 60 * s}, ${bodyW * 0.85} ${shoulderY - 140 * s}`}
          stroke={INK}
          strokeWidth={INK_WIDTH * 1.5}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={-bodyW * 0.85} cy={shoulderY - 140 * s} r={9 * s} fill={INK} />
        <circle cx={bodyW * 0.85} cy={shoulderY - 140 * s} r={9 * s} fill={INK} />
      </>
    );
  }

  if (expr === "facepalm") {
    // Linker Arm an den Kopf
    return (
      <>
        <path
          d={`M ${-bodyW * 0.42} ${shoulderY}
              Q ${-bodyW * 0.6} ${shoulderY - 30 * s}, ${-20 * s} ${-10 * s}`}
          stroke={INK}
          strokeWidth={INK_WIDTH * 1.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${bodyW * 0.42} ${shoulderY}
              Q ${bodyW * 0.7} ${shoulderY + 60 * s}, ${bodyW * 0.55} ${shoulderY + 150 * s}`}
          stroke={INK}
          strokeWidth={INK_WIDTH * 1.5}
          strokeLinecap="round"
          fill="none"
        />
      </>
    );
  }

  // Normal haengende Arme
  return (
    <>
      <path
        d={`M ${-bodyW * 0.42} ${shoulderY}
            Q ${-bodyW * 0.7} ${shoulderY + 70 * s}, ${-bodyW * 0.55} ${shoulderY + 160 * s}`}
        stroke={INK}
        strokeWidth={INK_WIDTH * 1.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${bodyW * 0.42} ${shoulderY}
            Q ${bodyW * 0.7} ${shoulderY + 70 * s}, ${bodyW * 0.55} ${shoulderY + 160 * s}`}
        stroke={INK}
        strokeWidth={INK_WIDTH * 1.5}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function renderFacepalmHand(expr: Expression, size: number): React.ReactNode {
  if (expr !== "facepalm") return null;
  const s = size / 180;
  return (
    <ellipse
      cx={-6 * s}
      cy={-6 * s}
      rx={size * 0.42}
      ry={size * 0.28}
      fill="#ffffff"
      stroke={INK}
      strokeWidth={INK_WIDTH}
      transform={`rotate(-14)`}
    />
  );
}
