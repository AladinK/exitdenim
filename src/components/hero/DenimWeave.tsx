import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Signature hero moment: a raw-indigo denim-weave plane.
 * Cursor gently displaces the surface; scroll slowly rolls it.
 * One scene, one Canvas, tuned to be light — instanced-free, single mesh.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vDisp;
  void main() {
    vUv = uv;
    vec3 p = position;
    float d = distance(uv, uMouse);
    float ripple = smoothstep(0.55, 0.0, d) * 0.22;
    float wave = sin((uv.x + uv.y) * 6.0 + uTime * 0.35 + uScroll * 1.6) * 0.02;
    p.z += ripple + wave;
    vDisp = ripple + wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uWarp;    // vertical yarn (dark indigo)
  uniform vec3 uWeft;    // horizontal yarn (ecru/undyed)
  uniform vec3 uHi;      // highlight
  uniform float uScroll;
  varying vec2 vUv;
  varying float vDisp;

  // Cheap hash noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Twill 2/1 weave pattern
    float freq = 260.0;
    vec2 g = vUv * vec2(freq, freq * 0.72);
    vec2 cell = floor(g);
    vec2 f = fract(g);
    // Diagonal offset -> twill line
    float twill = mod(cell.x + cell.y * 2.0, 3.0);
    float warpMask = step(twill, 1.0);          // vertical yarn shows
    // Yarn shading: rounded highlight per cell
    float yarnH = 1.0 - abs(f.y - 0.5) * 2.0;   // horizontal yarn shading
    float yarnV = 1.0 - abs(f.x - 0.5) * 2.0;   // vertical yarn shading
    float yarn = mix(yarnH, yarnV, warpMask);
    yarn = pow(clamp(yarn, 0.0, 1.0), 1.4);

    // Base fibre tone: warp indigo where warpMask==1, weft ecru elsewhere
    vec3 base = mix(uWeft, uWarp, warpMask);

    // Slub/fibre grain
    float grain = noise(vUv * 800.0) * 0.08;
    // Broad indigo shading variation
    float shade = noise(vUv * 6.0 + uTime * 0.02) * 0.10;

    vec3 col = base * (0.72 + yarn * 0.55) - grain + shade;

    // Cursor/scroll driven highlight sheen
    float sheen = smoothstep(0.02, 0.22, vDisp);
    col = mix(col, uHi, sheen * 0.35);

    // Subtle vignette
    float vig = smoothstep(1.15, 0.35, length(vUv - 0.5));
    col *= mix(0.78, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function WeavePlane() {
  const mesh = useRef<THREE.Mesh>(null!);
  const { viewport, size } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const scroll = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uWarp: { value: new THREE.Color("#1a2a48") },
      uWeft: { value: new THREE.Color("#c9bfa8") },
      uHi: { value: new THREE.Color("#f5f0e7") },
    }),
    [],
  );

  useFrame((state, delta) => {
    // Client-side pointer read (SSR-safe: this callback only runs in browser)
    const px = state.pointer.x * 0.5 + 0.5;
    const py = state.pointer.y * 0.5 + 0.5;
    target.current.set(px, py);
    mouse.current.lerp(target.current, 0.08);
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uTime.value += delta;
    // scroll-driven roll
    const sy = typeof window !== "undefined" ? window.scrollY : 0;
    scroll.current += (sy * 0.0004 - scroll.current) * 0.06;
    uniforms.uScroll.value = scroll.current;
  });

  // Sized to fill viewport (three.js viewport units)
  const w = Math.max(viewport.width, 4);
  const h = Math.max(viewport.height, 4);
  const segs = Math.min(180, Math.floor(size.width / 8));

  return (
    <mesh ref={mesh} rotation={[-0.18, 0, 0]}>
      <planeGeometry args={[w * 1.2, h * 1.4, segs, segs]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

export default function DenimWeave() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 3.2], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#141d2f"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <WeavePlane />
    </Canvas>
  );
}
