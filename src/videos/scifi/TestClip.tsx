/**
 * 10-s-Testclip — demonstriert den Sci-Fi-Stil:
 *   Hauptfigur in Mad Lab, sarkastischer Side-Eye, zeigt mit der rechten
 *   Hand auf ein gruenes Portal. Kamera driftet leicht.
 *
 * 300 Frames @ 30 fps = 10 s.
 * Keine Audio-Spur (bewusst — reine Visual-Demonstration des Styles).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { MadLab } from "../../shared/scifi/Environments";
import { PortalRing } from "../../shared/scifi/Props";
import { Character } from "../../shared/scifi/Character";
import { T } from "../../shared/scifi/tokens";

const W = 1080;
const H = 1920;

const ease = Easing.bezier(0.42, 0, 0.58, 1);

export const ScifiTestClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Kamera-Drift: leichter Zoom + Pan nach links
  const zoom = interpolate(t, [0, 10], [1.0, 1.08], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const panX = interpolate(t, [0, 10], [0, -40], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  // Zoom-Punch auf "Reveal" bei t=1.5s (Figur dreht Kopf)
  const punch = t > 1.4 && t < 1.9 ? Math.sin((t - 1.4) * 6.28) * 0.025 : 0;

  // Hero-Beat: nach 2 s wechselt Expression auf sarcastic
  const expression = t > 2.0 ? "sarcastic" : "neutral";

  // Idle-Bob
  const bob = Math.sin(t * 2.4) * 4;

  // Portal pulsiert leicht
  const portalScale = 1 + Math.sin(t * 2) * 0.03;

  // Portal-Position (rechts im Lab)
  const portalX = W * 0.78;
  const portalY = H * 0.5;

  // Pointing-Ziel (Portal-Mitte, relativ zum Charakter)
  const charX = W * 0.36;
  const charY = H * 0.68;
  const pointAt = { x: portalX - charX, y: portalY - charY };

  // Nach t=2.5s wechselt Pose auf pointing
  const pose = t > 2.5 ? "pointing" : t > 1.0 ? "side_eye" : "idle";

  return (
    <AbsoluteFill style={{ backgroundColor: T.bgDeep }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <g
          transform={`translate(${W / 2 + panX} ${H / 2}) scale(${zoom + punch}) translate(${-W / 2} ${-H / 2})`}
        >
          {/* Umgebung */}
          <MadLab width={W} height={H} time={t} />

          {/* Portal */}
          <g transform={`scale(${portalScale})`} style={{ transformOrigin: `${portalX}px ${portalY}px` }}>
            <PortalRing x={portalX} y={portalY} r={240} time={t} color={T.accentGreen} />
          </g>

          {/* Hauptfigur */}
          <Character
            x={charX}
            y={charY}
            size={900}
            expression={expression}
            pose={pose}
            accessories={{ goggles: true, backpack: true, canister: true }}
            pointAt={pointAt}
            bob={bob}
            leanDeg={t > 1.0 ? -4 : 0}
            showEmote={t > 2.2}
          />
        </g>

        {/* Hook-Text (fuer die ersten 2 s) */}
        {t < 2.0 && (
          <g transform={`translate(${W / 2} ${H * 0.12})`} opacity={interpolate(t, [0, 0.3, 1.7, 2.0], [0, 1, 1, 0])}>
            <rect x={-W * 0.42} y={-50} width={W * 0.84} height={100} fill="rgba(0,0,0,0.75)" rx={16} />
            <text
              textAnchor="middle"
              y={18}
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize={60}
              fill={T.accentGreen}
              stroke={T.ink}
              strokeWidth={4}
              paintOrder="stroke"
            >
              NA, NEUGIERIG?
            </text>
          </g>
        )}

        {/* Untertitel (wenn Figur „spricht") */}
        {t > 3.0 && t < 9.5 && (
          <g transform={`translate(${W / 2} ${H * 0.88})`}>
            <rect x={-W * 0.46} y={-55} width={W * 0.92} height={110} fill="rgba(0,0,0,0.72)" rx={16} />
            <text
              textAnchor="middle"
              y={-10}
              fontFamily="Arial, sans-serif"
              fontSize={26}
              fill={T.accentYellow}
              fontWeight="bold"
            >
              HAUPTFIGUR
            </text>
            <text
              textAnchor="middle"
              y={30}
              fontFamily="Arial, sans-serif"
              fontSize={36}
              fill="#fff"
              fontWeight="bold"
            >
              {t < 6.5
                ? "Da drüben? Na klar, das ist voll sicher."
                : "Nach dir."}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
