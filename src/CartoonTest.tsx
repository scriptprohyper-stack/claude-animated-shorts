import React, { useMemo, useRef } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Smootherstep (6t^5 - 15t^4 + 10t^3) for gliding camera motion per SKILL.md
const smootherstep = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
};

// Painted-texture canvas (echoes paint.ts: canvas2D with dark seams)
const makePaintedTexture = (
  r: number,
  g: number,
  b: number,
  seed: number,
): THREE.CanvasTexture => {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, size, size);
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 180; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const w = 12 + rand() * 30;
    const h = 6 + rand() * 12;
    const dr = (rand() - 0.5) * 24;
    ctx.fillStyle = `rgba(${Math.max(0, r + dr)},${Math.max(0, g + dr)},${Math.max(0, b + dr)},0.35)`;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = `rgba(0,0,0,0.45)`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const y = (size / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
};

// Bean-head cartoon character on a transparent canvas.
const makeBeanHeadTexture = (): THREE.CanvasTexture => {
  const w = 600;
  const h = 1000;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Contact shadow at soles (y = 975 per SKILL)
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(w / 2, 975, 90, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  const ink = "#241726"; // plum per SKILL
  const skin = "#ffd7b0";
  const shirt = "#e86a4a";
  const pants = "#2b3e63";

  // Torso
  ctx.fillStyle = shirt;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 95, 540, 190, 230, 36);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = ink;
  ctx.stroke();

  // Legs
  ctx.fillStyle = pants;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 80, 760, 65, 210, 20);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(w / 2 + 15, 760, 65, 210, 20);
  ctx.fill();
  ctx.stroke();

  // Shoes
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 92, 963, 85, 18, 8);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(w / 2 + 7, 963, 85, 18, 8);
  ctx.fill();

  // Stick arms
  ctx.strokeStyle = ink;
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(w / 2 - 95, 580);
  ctx.quadraticCurveTo(w / 2 - 180, 660, w / 2 - 160, 760);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w / 2 + 95, 580);
  ctx.quadraticCurveTo(w / 2 + 180, 660, w / 2 + 160, 760);
  ctx.stroke();

  // Bean head
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 150, 450);
  ctx.quadraticCurveTo(w / 2 - 180, 300, w / 2 - 80, 220);
  ctx.quadraticCurveTo(w / 2, 180, w / 2 + 80, 220);
  ctx.quadraticCurveTo(w / 2 + 180, 300, w / 2 + 150, 450);
  ctx.quadraticCurveTo(w / 2 + 110, 540, w / 2, 545);
  ctx.quadraticCurveTo(w / 2 - 110, 540, w / 2 - 150, 450);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = ink;
  ctx.stroke();

  // Hair tuft
  ctx.fillStyle = "#4a2a1a";
  ctx.beginPath();
  ctx.moveTo(w / 2 - 70, 240);
  ctx.quadraticCurveTo(w / 2, 170, w / 2 + 90, 240);
  ctx.quadraticCurveTo(w / 2 + 40, 215, w / 2, 220);
  ctx.quadraticCurveTo(w / 2 - 40, 215, w / 2 - 70, 240);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.arc(w / 2 - 40, 380, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w / 2 + 40, 380, 10, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(w / 2, 445, 30, 0.2, Math.PI - 0.2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// Sky gradient (day: top #3e7fd2 -> horizon #b8d0ec per SKILL)
const makeSkyTexture = (): THREE.CanvasTexture => {
  const w = 16;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, "#3e7fd2");
  grd.addColorStop(1, "#b8d0ec");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

type HouseProps = {
  pos: [number, number, number];
  colour: [number, number, number];
  height: number;
  seed: number;
};

const House: React.FC<HouseProps> = ({ pos, colour, height, seed }) => {
  const tex = useMemo(
    () => makePaintedTexture(colour[0], colour[1], colour[2], seed),
    [colour, seed],
  );
  const roofTex = useMemo(
    () => makePaintedTexture(120, 60, 50, seed + 7),
    [seed],
  );
  return (
    <group position={pos}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, height, 2.4]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      <mesh position={[0, height + 0.55, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.95, 1.3, 4]} />
        <meshStandardMaterial map={roofTex} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.6, 1.201]}>
        <planeGeometry args={[0.6, 1.2]} />
        <meshStandardMaterial color="#3a241a" />
      </mesh>
      <mesh position={[0.7, 1.4, 1.201]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          color="#d8e4f0"
          emissive="#88aacc"
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
};

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const { camera, size } = useThree();

  // Smootherstep glide across the clip
  const prog = smootherstep(frame / durationInFrames);
  const camX = interpolate(prog, [0, 1], [-1.8, 1.8]);
  const camZ = interpolate(prog, [0, 1], [7.4, 6.6]);
  const camY = 2.0 + 0.12 * Math.sin(t * 1.3);
  const lookX = interpolate(prog, [0, 1], [-0.2, 0.2]);

  const persp = camera as THREE.PerspectiveCamera;
  persp.fov = 32;
  persp.aspect = size.width / size.height;
  persp.near = 0.1;
  persp.far = 200;
  persp.position.set(camX, camY, camZ);
  persp.lookAt(lookX, 1.2, 0);
  // 4° roll per SKILL camera section
  persp.rotation.z += (4 * Math.PI) / 180 * Math.sin(t * 0.8) * 0.2;
  persp.updateProjectionMatrix();
  return null;
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const charTex = useMemo(() => makeBeanHeadTexture(), []);
  const skyTex = useMemo(() => makeSkyTexture(), []);
  const groundTex = useMemo(() => makePaintedTexture(118, 138, 92, 42), []);

  // Walk bob
  const bob = 0.05 * Math.abs(Math.sin(t * 6));

  const spriteRef = useRef<THREE.Sprite>(null);

  return (
    <>
      <CameraRig />

      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[60, 32, 16]} />
        <meshBasicMaterial map={skyTex} side={THREE.BackSide} />
      </mesh>

      <fog attach="fog" args={["#b8d0ec", 25, 90]} />

      {/* Sun / key light */}
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.58}
        color="#fff6e6"
      />
      <ambientLight intensity={0.55} color="#aabbd0" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial map={groundTex} roughness={1} />
      </mesh>

      {/* Town */}
      <House pos={[-3.5, 0, -2]} colour={[180, 120, 92]} height={2.8} seed={1} />
      <House pos={[-1.2, 0, -3]} colour={[228, 212, 170]} height={3.3} seed={2} />
      <House pos={[1.4, 0, -2.4]} colour={[190, 140, 86]} height={2.9} seed={3} />
      <House pos={[3.6, 0, -3.1]} colour={[178, 96, 72]} height={3.0} seed={4} />
      <House pos={[-2.5, 0, -6]} colour={[210, 180, 130]} height={3.4} seed={5} />
      <House pos={[0.8, 0, -6.5]} colour={[172, 112, 80]} height={3.1} seed={6} />

      {/* Character billboard */}
      <sprite ref={spriteRef} position={[0, 1.0 + bob, 1.5]} scale={[1.2, 2.0, 1]}>
        <spriteMaterial map={charTex} transparent />
      </sprite>
    </>
  );
};

export const CartoonTest: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#b8d0ec" }}>
      <ThreeCanvas
        width={width}
        height={height}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        linear
      >
        <Scene />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
