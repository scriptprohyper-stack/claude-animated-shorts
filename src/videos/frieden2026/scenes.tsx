import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Character, Expression } from "./Character";
import { FPS, WIDTH, HEIGHT, SUBS, SubCue } from "./cues";

// --- Helpers -------------------------------------------------------------

const t = (sec: number) => sec * FPS;

const ease = (v: number) => Easing.bezier(0.42, 0, 0.58, 1)(v);

function isTalking(id: string, frame: number): boolean {
  const c = SUBS.find((s) => s.id === id);
  if (!c) return false;
  // Mund schnappt im 6-Frame-Rhythmus auf/zu, solange die Zeile laeuft.
  if (frame / FPS < c.start || frame / FPS > c.end - 0.15) return false;
  return Math.floor(frame / 3) % 2 === 0;
}

function sceneTime(frame: number, startSec: number) {
  return frame / FPS - startSec;
}

// Blink (alle 1.5-2.3 s, 4 Frames lang) — kleines Kuenstler-Detail.
function blinkScale(frame: number, seed: number): number {
  const period = 65 + ((seed * 13) % 25);
  const phase = (frame + seed * 7) % period;
  return phase < 3 ? 0.12 : 1;
}

// --- SCENE 1: Weltkonferenz (0-6s) --------------------------------------

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const lt = sceneTime(frame, 0); // 0..6

  // Kamera-Zoom auf Hauptfigur bei 5.5s
  const zoom = interpolate(lt, [5.3, 5.9], [1, 2.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const camY = interpolate(lt, [5.3, 5.9], [0, -200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  // Hintergrund: Konferenzsaal, dunkelblau mit Logo
  return (
    <g transform={`translate(${WIDTH / 2} ${HEIGHT / 2 + camY}) scale(${zoom}) translate(${-WIDTH / 2} ${-HEIGHT / 2})`}>
      {/* Wand */}
      <rect x={0} y={0} width={WIDTH} height={HEIGHT * 0.55} fill="#213a5c" />
      {/* UNO-Logo-Ersatz */}
      <circle cx={WIDTH / 2} cy={HEIGHT * 0.17} r={120} fill="none" stroke="#f0d57b" strokeWidth={10} />
      <text
        x={WIDTH / 2}
        y={HEIGHT * 0.195}
        textAnchor="middle"
        fontFamily="Impact, sans-serif"
        fontSize={60}
        fill="#f0d57b"
        letterSpacing={2}
      >
        WPK
      </text>
      <text
        x={WIDTH / 2}
        y={HEIGHT * 0.28}
        textAnchor="middle"
        fontFamily="Impact, sans-serif"
        fontSize={44}
        fill="#f0d57b"
      >
        WELTFRIEDENSKONFERENZ 2026
      </text>

      {/* Boden */}
      <rect x={0} y={HEIGHT * 0.55} width={WIDTH} height={HEIGHT * 0.45} fill="#8a3b3b" />
      <rect x={0} y={HEIGHT * 0.55} width={WIDTH} height={14} fill="#5a2525" />

      {/* Konferenztisch — grosses dunkles Rechteck in Perspektive */}
      <path
        d={`M ${WIDTH * 0.08} ${HEIGHT * 0.72}
            L ${WIDTH * 0.92} ${HEIGHT * 0.72}
            L ${WIDTH * 0.98} ${HEIGHT * 0.95}
            L ${WIDTH * 0.02} ${HEIGHT * 0.95} Z`}
        fill="#3d2817"
        stroke="#0a0a0a"
        strokeWidth={6}
      />
      <path
        d={`M ${WIDTH * 0.08} ${HEIGHT * 0.72}
            L ${WIDTH * 0.92} ${HEIGHT * 0.72}`}
        stroke="#1a1004"
        strokeWidth={10}
      />

      {/* 4 Nebenpolitiker hinter dem Tisch */}
      {[
        { x: WIDTH * 0.16, shirt: "#5c3737", tie: "#e6c54c" },
        { x: WIDTH * 0.38, shirt: "#2b2b2b", tie: "#c33" },
        { x: WIDTH * 0.62, shirt: "#283d5e", tie: "#f0d57b" },
        { x: WIDTH * 0.84, shirt: "#3b2a3b", tie: "#99d" },
      ].map((p, i) => {
        const talking = i === 1 && isTalking("s1_pol1", frame);
        const expr: Expression = i === 1 && lt > 2.5 && lt < 5.5 ? "smug" : "neutral";
        const bob = Math.sin(lt * 2 + i) * 4;
        return (
          <g key={i} transform={`scale(${blinkYScale(frame, i)}, 1)`}>
            <Character
              x={p.x}
              y={HEIGHT * 0.58}
              size={150}
              shirt={p.shirt}
              tie={p.tie}
              expression={expr}
              talking={talking}
              bobY={bob}
            />
          </g>
        );
      })}

      {/* Hauptfigur in der Mitte vorne */}
      <Character
        x={WIDTH / 2}
        y={HEIGHT * 0.78}
        size={210}
        shirt="#3a7a4a"
        expression={lt > 5.3 ? "shocked" : "neutral"}
        bobY={Math.sin(lt * 3) * 3}
        squash={lt > 5.3 ? 1.08 : 1}
      />
    </g>
  );
};

// Augen-Blinken via Y-Skalierung des umschliessenden <g>
function blinkYScale(frame: number, seed: number): number {
  const s = blinkScale(frame, seed);
  return s === 1 ? 1 : 1; // Platzhalter — Character selbst blinkt nicht,
  // aber Abwesenheit ist akzeptabel bei 30s / hoher Dichte.
}

// --- SCENE 2: Prioritaeten (6-12s) --------------------------------------

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const lt = sceneTime(frame, 6); // 0..6

  // Panzer rollt von rechts nach links zwischen Sekunde 2.6 und 4.6 der Szene
  const tankT = interpolate(lt, [2.6, 4.6], [1.3, -0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tankX = WIDTH * tankT;

  // Politiker-Begeisterung ab 4.6s
  const politicianExcited = lt > 4.6;

  return (
    <g>
      {/* Himmel-Hintergrund, blau-beige */}
      <defs>
        <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb6d9" />
          <stop offset="1" stopColor="#e6d3a8" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#s2sky)" />
      <rect x={0} y={HEIGHT * 0.72} width={WIDTH} height={HEIGHT * 0.28} fill="#6a8142" />
      <rect x={0} y={HEIGHT * 0.72} width={WIDTH} height={10} fill="#4a5c2e" />

      {/* Schulhaus im Hintergrund hinter Hauptfigur */}
      <g opacity={lt > 2 ? 0.4 : 0.9} transform={`translate(${WIDTH * 0.1} ${HEIGHT * 0.45})`}>
        <rect x={0} y={0} width={240} height={200} fill="#dcb278" stroke="#0a0a0a" strokeWidth={6} />
        <path d={`M -10 0 L 120 -70 L 250 0 Z`} fill="#8c3b2a" stroke="#0a0a0a" strokeWidth={6} />
        <rect x={100} y={70} width={40} height={60} fill="#3a241a" />
        <rect x={30} y={40} width={40} height={40} fill="#d0e4f0" stroke="#0a0a0a" strokeWidth={3} />
        <rect x={170} y={40} width={40} height={40} fill="#d0e4f0" stroke="#0a0a0a" strokeWidth={3} />
      </g>

      {/* Hauptfigur links */}
      <Character
        x={WIDTH * 0.3}
        y={HEIGHT * 0.65}
        size={200}
        shirt="#3a7a4a"
        expression={politicianExcited ? "sad" : "neutral"}
        talking={isTalking("s2_haupt", frame)}
        bobY={Math.sin(lt * 3) * 3}
      />

      {/* Politiker rechts */}
      <Character
        x={WIDTH * 0.72}
        y={HEIGHT * 0.65}
        size={220}
        shirt="#2b2b2b"
        tie="#c33"
        expression={
          politicianExcited
            ? "cheer"
            : lt > 2.3 && lt < 3.5
              ? "angry"
              : "neutral"
        }
        talking={
          isTalking("s2_polno", frame) || isTalking("s2_polyay", frame)
        }
        bobY={politicianExcited ? Math.sin(lt * 10) * 10 : Math.sin(lt * 2.5 + 1) * 3}
        squash={politicianExcited ? 1.05 + Math.sin(lt * 10) * 0.05 : 1}
      />

      {/* Panzer */}
      <g transform={`translate(${tankX} ${HEIGHT * 0.78})`}>
        <Tank />
      </g>

      {/* "KEIN BUDGET!" Textblitz 8.5-9.7s (lt 2.5..3.7) */}
      {lt > 2.5 && lt < 3.7 && (
        <g
          transform={`translate(${WIDTH * 0.5} ${HEIGHT * 0.25}) rotate(${Math.sin(lt * 20) * 4})`}
        >
          <text
            textAnchor="middle"
            fontFamily="Impact, sans-serif"
            fontSize={120}
            fill="#e63946"
            stroke="#0a0a0a"
            strokeWidth={8}
            paintOrder="stroke"
          >
            KEIN BUDGET!
          </text>
        </g>
      )}
    </g>
  );
};

const Tank: React.FC = () => (
  <g>
    {/* Ketten */}
    <rect x={-150} y={0} width={300} height={70} rx={30} fill="#3a3a3a" stroke="#0a0a0a" strokeWidth={6} />
    <circle cx={-110} cy={35} r={22} fill="#1a1a1a" stroke="#0a0a0a" strokeWidth={4} />
    <circle cx={-40} cy={35} r={22} fill="#1a1a1a" stroke="#0a0a0a" strokeWidth={4} />
    <circle cx={40} cy={35} r={22} fill="#1a1a1a" stroke="#0a0a0a" strokeWidth={4} />
    <circle cx={110} cy={35} r={22} fill="#1a1a1a" stroke="#0a0a0a" strokeWidth={4} />
    {/* Rumpf */}
    <rect x={-130} y={-70} width={260} height={75} rx={14} fill="#4e5a3a" stroke="#0a0a0a" strokeWidth={6} />
    {/* Turm */}
    <rect x={-60} y={-130} width={120} height={70} rx={10} fill="#5e6a44" stroke="#0a0a0a" strokeWidth={6} />
    {/* Rohr */}
    <rect x={40} y={-110} width={220} height={22} rx={6} fill="#3a4425" stroke="#0a0a0a" strokeWidth={6} />
    {/* Mini-Herz drueber — Satire */}
    <path
      d="M 0 -170 l -12 -14 a 10 10 0 1 1 12 -6 a 10 10 0 1 1 12 6 z"
      fill="#e63946"
      stroke="#0a0a0a"
      strokeWidth={3}
    />
  </g>
);

// --- SCENE 3: Friedensliebe (12-19s) ------------------------------------

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const lt = sceneTime(frame, 12); // 0..7

  // A und B rufen abwechselnd, kleine Schock-Zooms
  // 0.2-1.3 A1   1.55-2.55 B1   2.6-5.0 A2   5.1-6.1 B2   6-7 jubel
  const aBob = lt < 2.55 ? Math.sin(lt * 6) * 8 : lt < 5.1 ? Math.sin(lt * 8) * 14 : Math.sin(lt * 12) * 10;
  const bBob = (lt > 1.4 && lt < 2.6) || (lt > 5 && lt < 6.1)
    ? Math.sin(lt * 10) * 14
    : Math.sin(lt * 5) * 4;

  const jubel = lt > 6.0;

  // Hauptfigur Facepalm ab 6.1s
  const facepalm = lt > 6.1;

  return (
    <g>
      <defs>
        <linearGradient id="s3bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c0d6ea" />
          <stop offset="1" stopColor="#f3e5c4" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#s3bg)" />
      <rect x={0} y={HEIGHT * 0.78} width={WIDTH} height={HEIGHT * 0.22} fill="#b0a788" />
      <rect x={0} y={HEIGHT * 0.78} width={WIDTH} height={8} fill="#7a7055" />

      {/* Riesige "FRIEDEN!" Banner-Fahnen links und rechts */}
      <g transform={`translate(${WIDTH * 0.2} ${HEIGHT * 0.2})`}>
        <path d="M 0 0 L 140 0 L 140 160 L 70 130 L 0 160 Z" fill="#d7e8c6" stroke="#0a0a0a" strokeWidth={6} />
        <text x={70} y={80} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={34} fill="#0a0a0a">PEACE</text>
      </g>
      <g transform={`translate(${WIDTH * 0.8 - 140} ${HEIGHT * 0.2})`}>
        <path d="M 0 0 L 140 0 L 140 160 L 70 130 L 0 160 Z" fill="#d7e8c6" stroke="#0a0a0a" strokeWidth={6} />
        <text x={70} y={80} textAnchor="middle" fontFamily="Impact, sans-serif" fontSize={34} fill="#0a0a0a">PEACE</text>
      </g>

      {/* Hauptfigur in der Mitte, hinten */}
      <Character
        x={WIDTH * 0.5}
        y={HEIGHT * 0.45}
        size={140}
        shirt="#3a7a4a"
        expression={facepalm ? "facepalm" : "sad"}
      />

      {/* Politiker A links */}
      <Character
        x={WIDTH * 0.26}
        y={HEIGHT * 0.7}
        size={240}
        shirt="#2b4d7a"
        tie="#e63946"
        hatTag="A"
        expression={jubel ? "cheer" : "angry"}
        talking={isTalking("s3_a1", frame) || isTalking("s3_a2", frame)}
        bobY={aBob}
        leanDeg={lt > 2.6 && lt < 5 ? 6 : -3}
        squash={jubel ? 1.06 + Math.sin(lt * 14) * 0.04 : 1}
      />

      {/* Politiker B rechts */}
      <Character
        x={WIDTH * 0.74}
        y={HEIGHT * 0.7}
        size={240}
        shirt="#7a2b4d"
        tie="#f0d57b"
        hatTag="B"
        expression={jubel ? "cheer" : "angry"}
        talking={isTalking("s3_b1", frame) || isTalking("s3_b2", frame)}
        bobY={bBob}
        leanDeg={-4}
        mirrored
        squash={jubel ? 1.06 + Math.sin(lt * 14 + 1) * 0.04 : 1}
      />

      {/* Riesige Waffensilhouetten blitzen ab Sek 2.6 im Hintergrund (Satire) */}
      {lt > 2.6 && lt < 5 && (
        <g opacity={0.25 + Math.abs(Math.sin(lt * 8)) * 0.15}>
          <text x={WIDTH / 2} y={HEIGHT * 0.95} textAnchor="middle" fontSize={200}>🚀</text>
        </g>
      )}
    </g>
  );
};

// --- SCENE 4: Die bittere Wahrheit (19-25s) -----------------------------

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const lt = sceneTime(frame, 19); // 0..6

  // Diagramm-Balken wachsen ueber 0..3.5 s
  const grow = interpolate(lt, [0.3, 3.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const barMax = HEIGHT * 0.45;

  // Waffenverkaeufer kommt ab 3.5s rein
  const sellerT = interpolate(lt, [3.5, 4.3], [-0.3, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <g>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#efe6d3" />
      <rect x={0} y={HEIGHT * 0.84} width={WIDTH} height={HEIGHT * 0.16} fill="#c0b48d" />

      {/* Projektionswand / Flipchart */}
      <rect
        x={WIDTH * 0.08}
        y={HEIGHT * 0.1}
        width={WIDTH * 0.84}
        height={HEIGHT * 0.52}
        fill="#fcf9f0"
        stroke="#0a0a0a"
        strokeWidth={10}
      />
      <text
        x={WIDTH * 0.5}
        y={HEIGHT * 0.17}
        textAnchor="middle"
        fontFamily="Impact, sans-serif"
        fontSize={56}
        fill="#0a0a0a"
      >
        MILITÄRAUSGABEN
      </text>

      {/* Balkendiagramm — 5 Balken, exponentiell wachsend */}
      {[0.15, 0.3, 0.5, 0.75, 0.98].map((h, i) => {
        const bh = h * barMax * grow;
        const bx = WIDTH * 0.16 + i * WIDTH * 0.145;
        const by = HEIGHT * 0.58 - bh;
        const label = ["2022", "2023", "2024", "2025", "2026"][i];
        return (
          <g key={i}>
            <rect
              x={bx}
              y={by}
              width={WIDTH * 0.1}
              height={bh}
              fill="#c0392b"
              stroke="#0a0a0a"
              strokeWidth={5}
            />
            <text
              x={bx + WIDTH * 0.05}
              y={HEIGHT * 0.615}
              textAnchor="middle"
              fontFamily="Arial"
              fontSize={28}
              fill="#0a0a0a"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Hauptfigur links vorm Diagramm, zeigt darauf */}
      <Character
        x={WIDTH * 0.2}
        y={HEIGHT * 0.78}
        size={200}
        shirt="#3a7a4a"
        expression="sad"
        bobY={Math.sin(lt * 3) * 3}
      />

      {/* Geldberg + Waffenverkaeufer — rechts, schiebt sich ins Bild */}
      <g transform={`translate(${WIDTH * sellerT} ${HEIGHT * 0.7})`}>
        {/* Geldberg */}
        <path
          d={`M -20 180 L 60 20 L 220 60 L 300 180 Z`}
          fill="#5aa15a"
          stroke="#0a0a0a"
          strokeWidth={6}
        />
        {/* $-Zeichen */}
        {[
          [60, 100],
          [130, 70],
          [190, 110],
          [40, 150],
          [220, 150],
        ].map(([x, y], i) => (
          <text
            key={i}
            x={x}
            y={y}
            fontFamily="Impact, sans-serif"
            fontSize={42}
            fill="#2a502a"
          >
            $
          </text>
        ))}
        {/* Figur auf dem Berg */}
        <Character
          x={140}
          y={-50}
          size={160}
          shirt="#704022"
          tie="#f0d57b"
          expression={isTalking("s4_sell", frame) ? "smug" : "smug"}
          talking={isTalking("s4_sell", frame)}
          bobY={Math.sin(lt * 4) * 4}
        />
      </g>
    </g>
  );
};

// --- SCENE 5: Die Pointe (25-30s) ---------------------------------------

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const lt = sceneTime(frame, 25); // 0..5

  // Erde schwebt rein, wippt leicht
  const earthScale = interpolate(lt, [0, 0.6], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const earthX = WIDTH / 2;
  const earthY = HEIGHT * 0.38 + Math.sin(lt * 2.5) * 10;

  // Textblock 2.8-5s mit Flackern
  const showText = lt > 2.8;
  const flickerOpacity =
    showText && Math.floor((lt - 2.8) * 15) % 2 === 0 ? 1 : 0.4;

  return (
    <g>
      {/* Weltraum-Schwarz mit Sternen */}
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#0a0820" />
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (i * 97) % WIDTH;
        const y = (i * 73) % (HEIGHT * 0.9);
        const r = 1 + ((i * 7) % 4);
        return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.6 + (i % 3) * 0.1} />;
      })}

      {/* Erde — grosser blauer Kreis, mit Pflastern */}
      <g transform={`translate(${earthX} ${earthY}) scale(${earthScale})`}>
        {/* Augenringe = dunklere Schatten um die Augen */}
        <circle cx={0} cy={0} r={280} fill="#4a8bd4" stroke="#0a0a0a" strokeWidth={10} />
        {/* Kontinente */}
        <path
          d="M -140 -80 Q -90 -130 -20 -110 Q 30 -90 60 -140 Q 100 -100 70 -40 Q 40 20 -30 10 Q -100 20 -140 -80 Z"
          fill="#5aa15a"
          stroke="#0a0a0a"
          strokeWidth={5}
        />
        <path
          d="M 90 40 Q 150 30 170 100 Q 160 170 100 180 Q 60 160 90 40 Z"
          fill="#5aa15a"
          stroke="#0a0a0a"
          strokeWidth={5}
        />
        {/* Pflaster */}
        <g transform="translate(-100 60) rotate(-20)">
          <rect x={-60} y={-18} width={120} height={36} rx={6} fill="#efd6a8" stroke="#0a0a0a" strokeWidth={5} />
          <line x1={-30} y1={-18} x2={-30} y2={18} stroke="#b89c70" strokeWidth={3} />
          <line x1={30} y1={-18} x2={30} y2={18} stroke="#b89c70" strokeWidth={3} />
        </g>
        <g transform="translate(140 -150) rotate(35)">
          <rect x={-50} y={-14} width={100} height={28} rx={5} fill="#efd6a8" stroke="#0a0a0a" strokeWidth={5} />
        </g>

        {/* Gesicht */}
        {/* Augenringe */}
        <ellipse cx={-80} cy={-30} rx={38} ry={16} fill="#2e4a74" opacity={0.6} />
        <ellipse cx={80} cy={-30} rx={38} ry={16} fill="#2e4a74" opacity={0.6} />
        {/* Augen */}
        <circle cx={-80} cy={-35} r={14} fill="#fff" stroke="#0a0a0a" strokeWidth={4} />
        <circle cx={80} cy={-35} r={14} fill="#fff" stroke="#0a0a0a" strokeWidth={4} />
        <circle cx={-80} cy={-32} r={6} fill="#0a0a0a" />
        <circle cx={80} cy={-32} r={6} fill="#0a0a0a" />
        {/* Mund — leicht offen wenn spricht */}
        {isTalking("s5_erde", frame) ? (
          <ellipse cx={0} cy={60} rx={34} ry={20} fill="#0a0a0a" />
        ) : (
          <path
            d="M -40 70 Q 0 50 40 70"
            stroke="#0a0a0a"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* Hauptfigur unten, Kamera-Blick */}
      <Character
        x={WIDTH * 0.5}
        y={HEIGHT * 0.82}
        size={180}
        shirt="#3a7a4a"
        expression={lt > 2.8 ? "shocked" : "sad"}
      />

      {/* Fehlermeldungs-Textblock */}
      {showText && (
        <g opacity={flickerOpacity} transform={`translate(${WIDTH / 2} ${HEIGHT * 0.7})`}>
          <rect
            x={-WIDTH * 0.42}
            y={-70}
            width={WIDTH * 0.84}
            height={160}
            fill="#c0c7d0"
            stroke="#0a0a0a"
            strokeWidth={10}
          />
          <rect
            x={-WIDTH * 0.42}
            y={-70}
            width={WIDTH * 0.84}
            height={34}
            fill="#2b55a8"
          />
          <text
            x={-WIDTH * 0.4}
            y={-47}
            fontFamily="Arial, sans-serif"
            fontSize={26}
            fill="#fff"
            fontWeight="bold"
          >
            Systemfehler
          </text>
          <text
            x={0}
            y={-5}
            textAnchor="middle"
            fontFamily="Impact, sans-serif"
            fontSize={48}
            fill="#0a0a0a"
          >
            MENSCHHEIT 2026
          </text>
          <text
            x={0}
            y={60}
            textAnchor="middle"
            fontFamily="Impact, sans-serif"
            fontSize={38}
            fill="#c0392b"
          >
            UPDATE FEHLGESCHLAGEN
          </text>
        </g>
      )}
    </g>
  );
};

// --- Subtitles overlay ---------------------------------------------------

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  // s5_text wird bereits als Fehlerdialog im Bild gezeigt, nicht zusaetzlich unten.
  const active = SUBS.filter(
    (c) => sec >= c.start && sec < c.end && c.id !== "s5_text",
  );
  if (active.length === 0) return null;
  // Nimm den juengsten (groessten Startwert) — vermeidet Ueberlappungen.
  const cue = active.reduce((a, b) => (a.start > b.start ? a : b));

  return (
    <g transform={`translate(${WIDTH / 2} ${HEIGHT * 0.9})`}>
      <rect
        x={-WIDTH * 0.46}
        y={-60}
        width={WIDTH * 0.92}
        height={110}
        fill="rgba(0,0,0,0.72)"
        rx={16}
      />
      {cue.speaker && (
        <text
          x={0}
          y={-25}
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize={26}
          fill="#f0d57b"
          fontWeight="bold"
        >
          {cue.speaker}
        </text>
      )}
      <text
        x={0}
        y={cue.speaker ? 22 : 10}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize={36}
        fill="#fff"
        fontWeight="bold"
      >
        {germanize(cue.text)}
      </text>
    </g>
  );
};

// Replace ASCII 'ae'/'oe'/'ue'/'ss' back to proper German letters.
// (audio_build.py uses ASCII to keep espeak-ng happy on some locales.)
function germanize(s: string): string {
  return s
    .replace(/\bNaechst/g, "Nächst")
    .replace(/\bnaechst/g, "nächst")
    .replace(/Koennten/g, "Könnten")
    .replace(/koennten/g, "könnten")
    .replace(/fuer/g, "für")
    .replace(/Fuer/g, "Für")
    .replace(/Waffenverkaeufer/g, "Waffenverkäufer")
    .replace(/MILITAeRAUSGABEN/g, "MILITÄRAUSGABEN");
}
