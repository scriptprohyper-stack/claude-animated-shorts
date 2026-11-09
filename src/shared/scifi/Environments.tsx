/**
 * Sci-Fi-Umgebungen. SVG mit leichter Perspektive via Fluchtlinien.
 */
import React from "react";
import { T, INK_W, INK_W_FINE } from "./tokens";

export type EnvProps = {
  width: number;
  height: number;
  time?: number; // Sekunden fuer Animationen (Scanlines, Flimmern)
};

// --- Mad Lab -----------------------------------------------------------

export const MadLab: React.FC<EnvProps> = ({ width, height, time = 0 }) => {
  const cx = width / 2;
  // Fluchtpunkt knapp ueber Mitte
  const vp = { x: cx, y: height * 0.42 };
  const floorTop = height * 0.6;

  return (
    <g>
      {/* Lila Gradient-Rueckwand */}
      <defs>
        <linearGradient id="ml_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.bgDeep} />
          <stop offset="1" stopColor={T.bgMid} />
        </linearGradient>
        <radialGradient id="ml_vig" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>
        <linearGradient id="ml_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3b8f" />
          <stop offset="1" stopColor="#2d2160" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={width} height={floorTop} fill="url(#ml_sky)" />
      <rect x={0} y={floorTop} width={width} height={height - floorTop} fill="url(#ml_floor)" />

      {/* Perspektiv-Bodenlinien */}
      {[0.1, 0.25, 0.45, 0.7].map((t) => {
        const y = floorTop + t * (height - floorTop);
        return (
          <line
            key={`floorH_${t}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={T.bgSoft}
            strokeOpacity={0.3}
            strokeWidth={2 + t * 4}
          />
        );
      })}
      {[-3, -2, -1, 0, 1, 2, 3].map((k) => {
        const x = cx + k * width * 0.22;
        return (
          <line
            key={`floorV_${k}`}
            x1={x}
            y1={floorTop}
            x2={cx + k * width * 0.5}
            y2={height}
            stroke={T.bgSoft}
            strokeOpacity={0.25}
            strokeWidth={3}
          />
        );
      })}

      {/* Wand-Panels (leichte Perspektive durch Groesse) */}
      {[-2, -1, 1, 2].map((k) => {
        const px = cx + k * width * 0.22;
        const py = height * 0.22;
        const pw = width * 0.14;
        const ph = height * 0.14;
        return (
          <g key={`panel_${k}`}>
            <rect x={px - pw / 2} y={py - ph / 2} width={pw} height={ph} fill={T.bgMid} stroke={T.ink} strokeWidth={INK_W_FINE} rx={10} />
            <rect x={px - pw / 2 + 10} y={py - ph / 2 + 10} width={pw - 20} height={ph - 20} fill={T.bgDeep} rx={6} />
            {/* kleine LED */}
            <circle cx={px - pw / 2 + 20} cy={py - ph / 2 + 20} r={5} fill={k % 2 === 0 ? T.accentCyan : T.accentPink} />
          </g>
        );
      })}

      {/* Pipes von oben — gebogene Rohre */}
      <Pipes width={width} height={height} />

      {/* Zwei Kolben mit Kreaturen (links & weit links) */}
      <Flask
        cx={width * 0.09}
        cyBottom={floorTop + 20}
        w={110}
        h={200}
        fluidColor={T.accentCyan}
        creatureColor={T.accentPink}
        time={time}
      />
      <Flask
        cx={width * 0.22}
        cyBottom={floorTop + 20}
        w={90}
        h={160}
        fluidColor={T.accentGreen}
        creatureColor={T.bgDeep}
        time={time + 0.4}
      />

      {/* Monitor auf der rechten Seite (hinter dem Portal gezeichnet) */}
      <Monitor
        cx={width * 0.78}
        cy={height * 0.3}
        w={200}
        h={140}
        time={time}
      />

      {/* Vignette */}
      <rect x={0} y={0} width={width} height={height} fill="url(#ml_vig)" />
    </g>
  );
};

const Pipes: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const topY = -20;
  const pipeColor = "#8171c9";
  const pipeStroke = INK_W;
  return (
    <g>
      {/* 4 Rohre, die oben ins Bild kommen und auf die Seite verschwinden */}
      {[
        { x: width * 0.3, color: pipeColor, bend: 180 },
        { x: width * 0.55, color: "#9b89d9", bend: 220 },
        { x: width * 0.72, color: "#7262bd", bend: 160 },
        { x: width * 0.42, color: "#8171c9", bend: 140 },
      ].map((p, i) => (
        <g key={i}>
          <path
            d={`M ${p.x} ${topY}
                L ${p.x} ${80 + i * 18}
                Q ${p.x} ${110 + i * 18} ${p.x + p.bend} ${110 + i * 18}
                L ${width + 50} ${110 + i * 18}`}
            stroke={p.color}
            strokeWidth={28}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${p.x} ${topY}
                L ${p.x} ${80 + i * 18}
                Q ${p.x} ${110 + i * 18} ${p.x + p.bend} ${110 + i * 18}
                L ${width + 50} ${110 + i * 18}`}
            stroke={T.ink}
            strokeWidth={pipeStroke}
            fill="none"
            strokeLinecap="round"
          />
          {/* Flansche */}
          <rect x={p.x - 22} y={80 + i * 18 - 10} width={44} height={18} fill={p.color} stroke={T.ink} strokeWidth={INK_W_FINE} rx={4} />
        </g>
      ))}
    </g>
  );
};

const Flask: React.FC<{
  cx: number;
  cyBottom: number;
  w: number;
  h: number;
  fluidColor: string;
  creatureColor: string;
  time: number;
}> = ({ cx, cyBottom, w, h, fluidColor, creatureColor, time }) => {
  const wobble = Math.sin(time * 1.6) * 6;
  const bubbleY = cyBottom - h * 0.3 - ((time * 40) % (h * 0.5));
  return (
    <g>
      {/* Standfuss */}
      <rect x={cx - w * 0.5} y={cyBottom - 10} width={w} height={20} fill="#555" stroke={T.ink} strokeWidth={INK_W_FINE} rx={4} />
      {/* Glas */}
      <rect
        x={cx - w * 0.4}
        y={cyBottom - h}
        width={w * 0.8}
        height={h}
        fill="rgba(255,255,255,0.1)"
        stroke={T.ink}
        strokeWidth={INK_W}
        rx={14}
      />
      {/* Fluid */}
      <rect
        x={cx - w * 0.36}
        y={cyBottom - h * 0.7}
        width={w * 0.72}
        height={h * 0.66}
        fill={fluidColor}
        opacity={0.75}
        rx={6}
      />
      {/* Creature = Blob mit Wobble */}
      <ellipse
        cx={cx + wobble}
        cy={cyBottom - h * 0.35 + Math.sin(time * 2) * 4}
        rx={w * 0.22}
        ry={h * 0.18}
        fill={creatureColor}
        stroke={T.ink}
        strokeWidth={INK_W_FINE}
      />
      {/* Augen auf der Kreatur */}
      <circle cx={cx + wobble - 10} cy={cyBottom - h * 0.4} r={5} fill="#fff" stroke={T.ink} strokeWidth={2} />
      <circle cx={cx + wobble + 10} cy={cyBottom - h * 0.4} r={5} fill="#fff" stroke={T.ink} strokeWidth={2} />
      <circle cx={cx + wobble - 10} cy={cyBottom - h * 0.4} r={2} fill={T.ink} />
      <circle cx={cx + wobble + 10} cy={cyBottom - h * 0.4} r={2} fill={T.ink} />
      {/* Blase */}
      <circle cx={cx + 8} cy={bubbleY} r={6} fill="rgba(255,255,255,0.6)" />
      {/* Glanz */}
      <rect x={cx - w * 0.3} y={cyBottom - h + 10} width={6} height={h * 0.6} fill="rgba(255,255,255,0.3)" rx={3} />
    </g>
  );
};

const Monitor: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  time: number;
}> = ({ cx, cy, w, h, time }) => {
  // Linien eines EKG-aehnlichen Scopes
  const amp = h * 0.22;
  const pts: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = cx - w * 0.4 + t * w * 0.8;
    const y = cy + Math.sin((t * 8 + time * 4) * Math.PI) * amp * Math.exp(-(((t - 0.5) * 2) ** 2));
    pts.push(`${x},${y}`);
  }
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill={T.bgDeep} stroke={T.ink} strokeWidth={INK_W} rx={8} />
      <rect x={cx - w / 2 + 10} y={cy - h / 2 + 10} width={w - 20} height={h - 20} fill="#0a1830" rx={4} />
      <polyline points={pts.join(" ")} fill="none" stroke={T.accentCyan} strokeWidth={4} />
      {/* Scanline */}
      <rect
        x={cx - w / 2 + 10}
        y={cy - h / 2 + 10 + ((time * 180) % (h - 20))}
        width={w - 20}
        height={6}
        fill="rgba(77,225,255,0.18)"
      />
    </g>
  );
};
