import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, HEIGHT, WIDTH, SCENES } from "./cues";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Subtitles } from "./scenes";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  S1_konferenz: Scene1,
  S2_prioritaet: Scene2,
  S3_friedenslob: Scene3,
  S4_wahrheit: Scene4,
  S5_pointe: Scene5,
};

export const FriedenShort: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;

  const current = SCENES.find((s) => sec >= s.start && sec < s.end) ?? SCENES[SCENES.length - 1];
  const Comp = SCENE_COMPONENTS[current.id];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("audio/mix.wav")} />
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Comp />
        <Subtitles />
      </svg>
    </AbsoluteFill>
  );
};
