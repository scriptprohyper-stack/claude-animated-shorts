import React from "react";
import { Composition } from "remotion";
import { CartoonTest } from "./CartoonTest";
import { FriedenShort } from "./videos/frieden2026/Frieden";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./videos/frieden2026/cues";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CartoonTest"
        component={CartoonTest}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FriedenShort"
        component={FriedenShort}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
