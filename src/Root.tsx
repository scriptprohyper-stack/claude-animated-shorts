import React from "react";
import { Composition } from "remotion";
import { CartoonTest } from "./CartoonTest";
import { FriedenShort } from "./videos/frieden2026/Frieden";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./videos/frieden2026/cues";
import { ScifiTestClip } from "./videos/scifi/TestClip";
import { ArmShort } from "./videos/arm2026/ArmShort";
import {
  TOTAL_FRAMES as ARM_FRAMES,
  FPS as ARM_FPS,
  WIDTH as ARM_W,
  HEIGHT as ARM_H,
} from "./videos/arm2026/cues";

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
      <Composition
        id="ScifiTestClip"
        component={ScifiTestClip}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ArmShort"
        component={ArmShort}
        durationInFrames={ARM_FRAMES}
        fps={ARM_FPS}
        width={ARM_W}
        height={ARM_H}
      />
    </>
  );
};
