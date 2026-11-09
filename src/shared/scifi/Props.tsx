/**
 * Sci-Fi-Props. Alle werden im SVG-Koordinatensystem gezeichnet.
 */
import React from "react";
import { T, INK_W, INK_W_FINE } from "./tokens";

type PropBase = {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  time?: number;
};

// --- PortalRing --------------------------------------------------------
// Grosses rundes Portal, Metallring + wirbelnde Energie-Scheibe.

export const PortalRing: React.FC<
  PropBase & { r?: number; color?: string }
> = ({ x, y, r = 240, scale = 1, rotation = 0, time = 0, color = T.accentGreen }) => {
  // Mehrere konzentrische Spiralen, drehen sich mit der Zeit
  const spirals = Array.from({ length: 5 }).map((_, i) => {
    const rot = time * (30 + i * 20) + i * 40;
    const rad = r * (0.72 - i * 0.12);
    const w = r * 0.04 + i * 2;
    return { rot, rad, w, opacity: 0.85 - i * 0.12 };
  });

  const deepColor = darken(color, 0.45);

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* Hintergrund-Glow */}
      <circle cx={0} cy={0} r={r * 1.05} fill={color} opacity={0.18} />
      <circle cx={0} cy={0} r={r * 0.85} fill={color} opacity={0.3} />

      {/* Rotierende Spiralen */}
      {spirals.map((s, i) => (
        <g key={i} transform={`rotate(${s.rot})`}>
          <path
            d={describeSpiral(s.rad, s.w, deepColor)}
            fill={color}
            opacity={s.opacity}
            stroke={T.ink}
            strokeWidth={2}
          />
        </g>
      ))}

      {/* Zentrum heller Kern */}
      <circle cx={0} cy={0} r={r * 0.12} fill="#fff" opacity={0.8} />
      <circle cx={0} cy={0} r={r * 0.18} fill={color} opacity={0.6} />

      {/* Metallring (vorderste Schicht) */}
      <circle cx={0} cy={0} r={r} fill="none" stroke="#9b89c9" strokeWidth={r * 0.14} />
      <circle cx={0} cy={0} r={r} fill="none" stroke={T.ink} strokeWidth={INK_W} />
      <circle cx={0} cy={0} r={r * 0.87} fill="none" stroke={T.ink} strokeWidth={INK_W} />
      {/* Nieten */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 8;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * 0.935}
            cy={Math.sin(a) * r * 0.935}
            r={6}
            fill="#5b4a8c"
            stroke={T.ink}
            strokeWidth={2}
          />
        );
      })}
      {/* Tropfen am unteren Ring-Rand */}
      <path
        d={`M ${-r * 0.5} ${r * 0.88}
            Q ${-r * 0.4} ${r * 1.02}, ${-r * 0.3} ${r * 0.88}
            Q ${-r * 0.1} ${r * 1.05}, ${0.05 * r} ${r * 0.9}
            Q ${0.25 * r} ${r * 1.08}, ${0.45 * r} ${r * 0.88}`}
        fill={color}
        stroke={T.ink}
        strokeWidth={INK_W_FINE}
        strokeLinejoin="round"
      />
    </g>
  );
};

function describeSpiral(radius: number, width: number, _deep: string): string {
  // Teilweise Ringflaeche: aussen- und innenradius, 220° offen
  const outerR = radius;
  const innerR = Math.max(1, radius - width * 2);
  const startDeg = -110;
  const endDeg = 110;
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const x1 = Math.cos(start) * outerR;
  const y1 = Math.sin(start) * outerR;
  const x2 = Math.cos(end) * outerR;
  const y2 = Math.sin(end) * outerR;
  const x3 = Math.cos(end) * innerR;
  const y3 = Math.sin(end) * innerR;
  const x4 = Math.cos(start) * innerR;
  const y4 = Math.sin(start) * innerR;
  const large = 1;
  return `
    M ${x1} ${y1}
    A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2}
    L ${x3} ${y3}
    A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4}
    Z
  `;
}

function darken(hex: string, amount: number): string {
  // simpel: multiplikativer Luma-Shift
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const dr = Math.max(0, Math.round(r * (1 - amount)));
  const dg = Math.max(0, Math.round(g * (1 - amount)));
  const db = Math.max(0, Math.round(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

// --- PortalBlaster -----------------------------------------------------

export const PortalBlaster: React.FC<PropBase> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  time = 0,
}) => {
  const glow = 0.8 + Math.sin(time * 6) * 0.2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* Lauf */}
      <rect x={0} y={-18} width={120} height={36} rx={10} fill={T.bgMid} stroke={T.ink} strokeWidth={INK_W} />
      {/* Energiering vorn */}
      <circle cx={120} cy={0} r={22} fill={T.accentGreen} stroke={T.ink} strokeWidth={INK_W} opacity={glow} />
      <circle cx={120} cy={0} r={10} fill="#fff" opacity={0.8} />
      {/* Mittelring */}
      <rect x={60} y={-26} width={16} height={52} fill={T.bgDeep} stroke={T.ink} strokeWidth={INK_W_FINE} rx={4} />
      {/* Kolben */}
      <path d="M -20 -10 L 20 -10 L 20 40 L -40 60 L -45 20 Z" fill={T.bgMid} stroke={T.ink} strokeWidth={INK_W} strokeLinejoin="round" />
      {/* Griff */}
      <rect x={-5} y={30} width={22} height={48} rx={6} fill={T.bgDeep} stroke={T.ink} strokeWidth={INK_W} />
      {/* Energiepartikel-Punkte */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={95 + i * 10} cy={-20 + ((time * 50 + i * 30) % 40)} r={3} fill={T.accentGreen} />
      ))}
    </g>
  );
};
