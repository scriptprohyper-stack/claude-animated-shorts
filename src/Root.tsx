import React from "react";
import { Composition } from "remotion";
import { CartoonTest } from "./CartoonTest";

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
    </>
  );
};
