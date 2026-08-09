import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── The signature dark orb ──────────────────────────────────
   A glassy sphere carrying a dark iridescent gradient (muted
   blue → violet → coral, screenshot palette pulled way down into
   the void), a cool fresnel rim, two white cursor-following eyes,
   a drifting field of amber specks, and a soft dark halo. */

const vertexShader = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vObjNormal;
  void main() {
    vObjNormal = normalize(normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mv.xyz;
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`

// Classic Ashima 3D simplex noise
const simplex = /* glsl */ `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vObjNormal;

  ${simplex}

  void main() {
    vec3 n = normalize(vObjNormal);

    // slow flowing distortion of the sampling direction -> liquid look
    float t = uTime * 0.38;
    float flow = snoise(n * 1.6 + vec3(t, t * 0.7, -t)) * 0.5
               + snoise(n * 3.1 + vec3(-t * 0.6, t, t * 0.4)) * 0.25;

    // gradient axis roughly matching the screenshot: top-left blue,
    // centre violet, bottom-right coral
    float gx = dot(n, normalize(vec3(1.0, -0.6, 0.4))) * 0.5 + 0.5;
    gx = clamp(gx + flow * 0.35, 0.0, 1.0);

    vec3 blue   = vec3(0.05, 0.11, 0.34);
    vec3 violet = vec3(0.30, 0.10, 0.42);
    vec3 coral  = vec3(0.44, 0.10, 0.16);

    vec3 col = mix(blue, violet, smoothstep(0.0, 0.55, gx));
    col = mix(col, coral, smoothstep(0.5, 1.0, gx));

    // internal bright veins from the noise, kept restrained
    float veins = smoothstep(0.55, 0.95, flow + 0.5);
    col += veins * vec3(0.22, 0.16, 0.30);

    // fresnel rim — cool, glassy
    vec3 viewDir = normalize(vViewPos);
    float fres = pow(1.0 - clamp(dot(normalize(vNormalV), viewDir), 0.0, 1.0), 2.4);
    col += fres * vec3(0.45, 0.55, 0.85) * 1.15;

    // glossy top-left highlight (the wet sheen) — a touch stronger now that
    // there's no bloom pass to amplify it
    float spec = pow(clamp(dot(normalize(vNormalV), normalize(vec3(-0.5, 0.7, 0.9))), 0.0, 1.0), 6.0);
    col += spec * vec3(0.7, 0.75, 0.9) * 0.72;

    // keep it living in the dark
    col *= 0.92;

    gl_FragColor = vec4(col, 1.0);
  }
`

function OrbBody({ pointer, reducedMotion, mobileOrMini }) {
  const matRef = useRef()
  const groupRef = useRef()
  /* Shared mood state — the Eyes drive the state machine, the body reads
     it for matching body language (shake, bounce, slump). */
  const moodRef = useRef({ name: 'idle', t: 0, dur: 0, next: 6 + Math.random() * 8 })

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state, delta) => {
    if (matRef.current && !reducedMotion) {
      matRef.current.uniforms.uTime.value += delta
    }
    if (groupRef.current) {
      const m = moodRef.current
      // parallax lean toward the cursor (+ a sulky droop while sad)
      const tx = pointer.current.y * 0.3 + (m.name === 'sad' && !reducedMotion ? 0.14 : 0)
      const ty = pointer.current.x * 0.32
      groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.09
      groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * 0.09
      if (!reducedMotion) {
        // idle sway + an angry tremble while mad
        groupRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 0.15) * 0.04 +
          (m.name === 'mad' ? Math.sin(state.clock.elapsedTime * 38) * 0.01 : 0)
        // giggle-bounce while laughing
        const targetScale = m.name === 'laugh' ? 1 + Math.abs(Math.sin(m.t * 13)) * 0.02 : 1
        const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.2)
        groupRef.current.scale.setScalar(s)
      }
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          {/* detail 32 ≈ 20k tris — visually identical to 64 (~83k) under this
              shader, at a quarter of the vertex cost. Mini/mobile go lower. */}
          <icosahedronGeometry args={[1.35, mobileOrMini ? 16 : 32]} />
          <shaderMaterial
            ref={matRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>
      </group>
      {/* eyes live outside the tilt group so tracking stays direct */}
      <Eyes pointer={pointer} reducedMotion={reducedMotion} moodRef={moodRef} />
    </>
  )
}

const R_FACE = 1.36 // radius the eyes ride on, just outside the sphere

/* ── Eyes: gaze, blinking, and moods ─────────────────────────
   The orb mostly follows the cursor, but every so often it takes
   over with a mood of its own — mad (eyes slant inward, squint,
   glare at the cursor with a tremble), sad (eyes droop outward,
   half-close, sink down and away), laugh (eyes squish into happy
   slits and bounce), or a brief wide-eyed surprise. Everything is
   expressed with the two eyes alone; no mouth. */
function Eyes({ pointer, reducedMotion, moodRef }) {
  const posRef = useRef() // moves across the face + hugs the surface
  const lidRef = useRef() // vertical scale = blink/squint, x = wide-eyed
  const leftRef = useRef() // per-eye tilt = expression "brows"
  const rightRef = useRef()
  const pos = useRef({ x: 0, y: 0 })
  const blink = useRef({ active: false, t: 0, next: 2 + Math.random() * 3 })
  // idle wander: when the pointer has been still for a while (or on touch
  // devices, where it never moves), the eyes drift to random spots instead
  // of staring blankly at the centre.
  const wander = useRef({ x: 0, y: 0, next: 1.5 })
  // smoothed expression channels, lerped toward per-mood targets
  const anim = useRef({ rotL: 0, rotR: 0, squint: 1, size: 1 })

  useFrame((_, delta) => {
    const m = moodRef.current

    // ── mood state machine: idle → random mood → back to idle
    if (!reducedMotion) {
      if (m.name === 'idle') {
        m.next -= delta
        if (m.next <= 0) {
          const roll = Math.random()
          m.name = roll < 0.28 ? 'mad' : roll < 0.52 ? 'sad' : roll < 0.88 ? 'laugh' : 'surprise'
          m.t = 0
          m.dur = m.name === 'surprise' ? 1.3 : 2.4 + Math.random() * 1.4
        }
      } else {
        m.t += delta
        if (m.t >= m.dur) {
          m.name = 'idle'
          m.next = 8 + Math.random() * 10 // next mood in 8–18s
        }
      }
    }

    // ── gaze target: cursor, idle wander, or mood override
    const idle = performance.now() - pointer.current.t > 2500
    let px = pointer.current.x
    let py = pointer.current.y
    let k = 0.16
    if (idle && !reducedMotion && m.name === 'idle') {
      const w = wander.current
      w.next -= delta
      if (w.next <= 0) {
        w.x = (Math.random() * 2 - 1) * 0.8
        w.y = (Math.random() * 2 - 1) * 0.6
        w.next = 1.8 + Math.random() * 2.4
      }
      px = w.x
      py = w.y
      k = 0.045
    }
    if (m.name === 'sad') {
      // look down and away, slowly
      px = px * 0.25
      py = -0.85
      k = 0.05
    } else if (m.name === 'laugh') {
      // eyes lift while laughing
      px = 0
      py = 0.35
      k = 0.12
    } else if (m.name === 'mad') {
      k = 0.22 // glare AT the cursor, snappily
    } else if (m.name === 'surprise') {
      k = 0.3
    }

    // map to face coordinates, then clamp to an ellipse sized so that the
    // OUTER edge of each eye always stays well inside the sphere silhouette
    let ex = px * 0.62
    let ey = py * 0.7
    const rad = Math.hypot(ex / 0.52, ey / 0.62)
    if (rad > 1) {
      ex /= rad
      ey /= rad
    }
    pos.current.x += (ex - pos.current.x) * k
    pos.current.y += (ey - pos.current.y) * k

    // mood positional accents: angry tremble, laughing bounce
    let offX = 0
    let offY = 0
    if (!reducedMotion) {
      if (m.name === 'mad') offX = Math.sin(m.t * 26) * 0.02
      else if (m.name === 'laugh') offY = Math.abs(Math.sin(m.t * 13)) * 0.07
    }

    if (posRef.current) {
      const x = pos.current.x + offX
      const y = pos.current.y + offY
      // project onto the sphere so the eyes sit ON the surface, not a flat plane
      const z = Math.sqrt(Math.max(R_FACE * R_FACE - x * x - y * y, 0.01)) + 0.02
      posRef.current.position.set(x, y, z)
    }

    // ── expression targets per mood
    let rotL = 0
    let rotR = 0
    let squint = 1
    let size = 1
    if (!reducedMotion) {
      if (m.name === 'mad') {
        rotL = -0.45 // tops lean toward each other: ∧ angry brows
        rotR = 0.45
        squint = 0.55
      } else if (m.name === 'sad') {
        rotL = 0.34 // tops lean outward: ∨ droop
        rotR = -0.34
        squint = 0.72
      } else if (m.name === 'laugh') {
        squint = 0.2 + Math.abs(Math.sin(m.t * 13)) * 0.1 // bouncing happy slits
      } else if (m.name === 'surprise') {
        size = 1.3
        squint = 1.1
      }
    }
    const a = anim.current
    a.rotL += (rotL - a.rotL) * 0.12
    a.rotR += (rotR - a.rotR) * 0.12
    a.squint += (squint - a.squint) * 0.14
    a.size += (size - a.size) * 0.14

    // ── blinking (compounds with the mood squint)
    const b = blink.current
    if (!reducedMotion) {
      if (!b.active) {
        b.next -= delta
        if (b.next <= 0) {
          b.active = true
          b.t = 0
        }
      } else {
        b.t += delta
        const phase = b.t / 0.16 // ~160ms blink
        if (phase >= 1) {
          b.active = false
          b.next = 2.5 + Math.random() * 4 // next blink in 2.5–6.5s
        }
      }
    }
    if (lidRef.current) {
      const phase = b.active ? Math.min(b.t / 0.16, 1) : 0
      const blinkScale = 1 - Math.sin(phase * Math.PI) * 0.94 // 1 → ~0.06 → 1
      lidRef.current.scale.y = blinkScale * a.squint * a.size
      lidRef.current.scale.x = a.size
    }
    if (leftRef.current) leftRef.current.rotation.z = a.rotL
    if (rightRef.current) rightRef.current.rotation.z = a.rotR
  })

  // white pills, drawn on top of the orb so they never get occluded
  return (
    <group ref={posRef} renderOrder={10}>
      <group ref={lidRef}>
        <mesh ref={leftRef} position={[-0.3, 0, 0]} renderOrder={10}>
          <capsuleGeometry args={[0.088, 0.28, 8, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} depthTest={false} />
        </mesh>
        <mesh ref={rightRef} position={[0.3, 0, 0]} renderOrder={10}>
          <capsuleGeometry args={[0.088, 0.28, 8, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} depthTest={false} />
        </mesh>
      </group>
    </group>
  )
}

function Specks({ count = 320, reducedMotion }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // spherical shell around the orb
      const r = 2.0 + Math.random() * 2.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (ref.current && !reducedMotion) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#f4a13c"
        transparent
        opacity={0.8}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}

/* No post-processing: the Bloom pass cost a full-screen render every frame
   plus ~200KB of bundle. The glow now comes from the shader highlights and
   a cheap CSS radial layer behind the canvas.

   The sphere always sits at the scene origin — the viewport centre. It is
   never repositioned or rescaled by scroll; the hero simply fades it out
   (see Home.jsx), which keeps the canvas geometry untouched. */
function Rig({ pointer, reducedMotion, mobileOrMini }) {
  return (
    <>
      <OrbBody pointer={pointer} reducedMotion={reducedMotion} mobileOrMini={mobileOrMini} />
      <Specks count={mobileOrMini ? 120 : 260} reducedMotion={reducedMotion} />
    </>
  )
}

/* Fills its parent. Tracks the cursor from the window so the orb can stay
   pinned in place while remaining click-through (pointer-events: none). */
export default function Orb({ mini = false }) {
  const pointer = useRef({ x: 0, y: 0, t: 0 })
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const mobileOrMini = mini || isMobile
  const wrapRef = useRef(null)
  const [frameloop, setFrameloop] = useState('always')

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.current.t = performance.now()
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Pause the render loop when the tab is hidden or the orb scrolls off-screen
  useEffect(() => {
    let visible = !document.hidden
    let onscreen = true
    const update = () => setFrameloop(visible && onscreen ? 'always' : 'never')
    const onVis = () => {
      visible = !document.hidden
      update()
    }
    document.addEventListener('visibilitychange', onVis)
    let io
    if (wrapRef.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          onscreen = entry.isIntersecting
          update()
        },
        { threshold: 0 },
      )
      io.observe(wrapRef.current)
    }
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      io?.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* soft dark halo behind the orb, with a faint violet bloom baked in
          (replaces the GPU bloom pass at zero per-frame cost) */}
      {!mini && (
        <div
          className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(108,104,240,0.10) 0%, rgba(108,104,240,0.04) 30%, rgba(0,0,0,0) 55%), radial-gradient(circle, rgba(20,18,30,0.9) 0%, rgba(8,7,12,0.6) 38%, rgba(0,0,0,0) 62%)',
          }}
        />
      )}
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, mini ? 4.2 : isMobile ? 9 : 7], fov: 42 }}
        dpr={mobileOrMini ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Rig pointer={pointer} reducedMotion={reducedMotion} mobileOrMini={mobileOrMini} />
      </Canvas>
    </div>
  )
}
