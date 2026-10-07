import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import RealCar from './RealCar'
import Stage, { StageRing, useBlobShadowTexture } from './Stage'
import Smoke from './Smoke'
import SkidMarks from './SkidMarks'
import { sampleDrift, T_BRAKE, T_STOP } from './driftPath'

const { damp, smoothstep, clamp } = THREE.MathUtils
const START_DELAY = 0.45 // let the first frames (shader compile) pass before the car appears
const LAND_AT = T_STOP - 0.35

// fallback wheel contact points (car frame, FL, FR, RL, RR) — the real model reports its own
const CONTACTS = [
  [1.3, -0.95],
  [1.3, 0.95],
  [-1.5, -0.95],
  [-1.5, 0.95],
]

function DriftRig({ run, instant, onLanded }) {
  const root = useRef()
  const car = useRef()
  const smoke = useRef()
  const skid = useRef()
  const ring = useRef()
  const shadowTex = useBlobShadowTexture()
  const { camera, size, scene, pointer } = useThree()

  const S = useMemo(() => ({ t: -START_DELAY, prev: [null, null, null, null], emitAcc: 0 }), [])
  const k = useMemo(() => ({}), [])
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const camGoal = useMemo(() => new THREE.Vector3(), [])

  // dev only: inspect/seek the intro from the console via window.__drift
  useEffect(() => {
    if (import.meta.env.DEV) window.__drift = Object.assign(S, { refs: { skid, smoke, root } })
  }, [S])

  // (re)start the intro whenever `run` changes
  useEffect(() => {
    S.t = instant ? T_STOP + 2 : -START_DELAY
    S.landed = false
    S.prev = [null, null, null, null]
    S.emitAcc = 0
    S.camInit = false
    smoke.current?.reset()
    skid.current?.reset()
  }, [run, instant, S])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 24) // big hitches slow the car down instead of teleporting it
    S.t += dt
    const t = Math.max(S.t, 0)
    sampleDrift(t, k)

    /* ---------- car transform ---------- */
    const g = root.current
    g.visible = S.t > 0
    g.position.set(k.x, 0, k.z)
    g.rotation.y = k.yaw
    const cos = Math.cos(k.yaw), sin = Math.sin(k.yaw)

    const drift = clamp(Math.sin(k.slip), 0, 1) // 0 = gripping, 1 = fully sideways
    const speedN = clamp(k.speed / 20, 0, 1)
    const settle = t > T_STOP ? t - T_STOP : 0
    const rebound = settle > 0 ? Math.exp(-4.5 * settle) * Math.sin(settle * 13) : 0

    const parts = car.current
    if (parts?.suspension) {
      // body leans to the outside of the slide and dives under braking, then rocks to rest
      parts.suspension.rotation.x = 0.065 * drift * Math.min(speedN * 1.6, 1) - 0.03 * rebound
      parts.suspension.rotation.z = -0.0022 * k.decel + 0.022 * rebound
      parts.suspension.position.y = 0.5 - 0.012 * rebound

      parts.steer(k.steer)
      parts.wheels.forEach((w, i) => {
        const front = i < 2
        const roll = k.speed * dt * (front ? Math.abs(Math.cos(k.slip)) : 1)
        const wheelspin = front ? 0 : 16 * drift * dt * (t < T_STOP + 0.2 ? 1 : 0) // rear tyres spin up while sliding
        w.roll(roll + wheelspin)
      })

      parts.brake(t > T_BRAKE - 0.1 && t < T_STOP + 0.35)
    }
    const contacts = parts?.contacts?.length === 4 ? parts.contacts : CONTACTS

    /* ---------- tyre contact points → skid marks + smoke ---------- */
    const marking = S.t > 0 && t < T_STOP && drift > 0.12 && k.speed > 0.6
    const smoking = S.t > 0 && t > 1.35 && t < T_STOP
    const intensity = drift * (0.25 + speedN)
    S.emitAcc += dt * 70 * intensity
    const puffs = Math.floor(S.emitAcc)
    S.emitAcc -= puffs

    contacts.forEach(([lx, lz], i) => {
      const wx = k.x + lx * cos + lz * sin
      const wz = k.z - lx * sin + lz * cos
      const prev = S.prev[i]
      const rear = i >= 2
      if (marking && prev && (rear || drift > 0.55)) {
        skid.current.add(prev[0], prev[1], wx, wz, rear ? 0.27 : 0.2)
      }
      S.prev[i] = [wx, wz]
      if (smoking && rear && puffs) smoke.current.emit(wx, 0.15, wz, k.vx, k.vz, puffs)
    })

    /* ---------- landing ---------- */
    if (!S.landed && t >= LAND_AT) {
      S.landed = true
      onLanded?.()
    }
    if (ring.current) {
      const on = smoothstep(t, LAND_AT - 0.2, LAND_AT + 0.9)
      ring.current.children[0].material.opacity = on * (0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 2))
      ring.current.children[1].material.opacity = on * 0.6
    }

    /* ---------- camera ---------- */
    const aspect = size.width / size.height
    const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const dist = Math.max(14, (4.7 * 1.45) / (2 * halfTan * aspect)) // keep the car ~70% of width on phones
    const below = aspect < 0.9 ? 0.56 : 0.52 // push the car into the lower part of the frame (text sits above)
    const lookY = 0.6 + dist * halfTan * below
    const follow = 1 - smoothstep(t, T_STOP - 1.4, T_STOP + 0.2)
    const idle = smoothstep(t, T_STOP, T_STOP + 1.5)
    const shake = drift * speedN * 0.05

    lookAt.set(
      k.x * 0.42 * follow + Math.sin(t * 37) * shake,
      lookY + Math.sin(t * 29) * shake * 0.6,
      k.z * 0.25 * follow
    )
    camGoal.set(
      k.x * 0.12 * follow + pointer.x * 0.9 * idle,
      lookY + 0.55 + dist * 0.035 + pointer.y * 0.35 * idle,
      dist
    )
    if (!S.camInit) {
      camera.position.copy(camGoal)
      S.lookCur = lookAt.clone()
      S.camInit = true
    }
    camera.position.x = damp(camera.position.x, camGoal.x, 3.5, dt)
    camera.position.y = damp(camera.position.y, camGoal.y, 3.5, dt)
    camera.position.z = damp(camera.position.z, camGoal.z, 3.5, dt)
    S.lookCur.x = damp(S.lookCur.x, lookAt.x, 5, dt)
    S.lookCur.y = damp(S.lookCur.y, lookAt.y, 5, dt)
    S.lookCur.z = damp(S.lookCur.z, lookAt.z, 5, dt)
    camera.lookAt(S.lookCur)

    if (scene.fog) {
      scene.fog.near = dist + 6
      scene.fog.far = dist + 44
    }
  })

  return (
    <>
      <group ref={root} visible={false}>
        <RealCar ref={car} />
        <mesh rotation-x={-Math.PI / 2} position-y={0.008} renderOrder={2}>
          <planeGeometry args={[5.6, 2.9]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.9} />
        </mesh>
      </group>
      <SkidMarks ref={skid} />
      <Smoke ref={smoke} />
      <StageRing ref={ring} />
    </>
  )
}

export default function DriftScene({ run, instant, onLanded, eventSource }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      eventSource={eventSource}
      eventPrefix="client"
      camera={{ fov: 32, near: 0.1, far: 160, position: [0, 3, 12] }}
      gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <Stage />
      <Suspense fallback={null}>
        <DriftRig run={run} instant={instant} onLanded={onLanded} />
      </Suspense>
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.85} />
        <Vignette offset={0.28} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
