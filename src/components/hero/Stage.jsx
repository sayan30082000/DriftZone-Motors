import { forwardRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Environment, Lightformer } from '@react-three/drei'

/* ---------- procedural textures (no image files) ---------- */
function asphaltTexture() {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const img = g.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const grain = Math.random()
    let v = 118 + grain * 46
    if (grain > 0.985) v += 50 // the odd bright pebble
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  g.putImageData(img, 0, 0)
  // a few darker patches / oil stains
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * size, y = Math.random() * size, r = 20 + Math.random() * 70
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, 'rgba(0,0,0,0.18)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(36, 36)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function skylineTexture() {
  const W = 2048, H = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  // light-pollution glow along the horizon
  const glow = g.createLinearGradient(0, H, 0, 0)
  glow.addColorStop(0, 'rgba(255,110,40,0.22)')
  glow.addColorStop(0.3, 'rgba(255,60,40,0.05)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, W, H)
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  let x = 0
  while (x < W) {
    const w = 22 + rnd() * 60, h = 40 + rnd() * 200
    const top = H - h
    const bg = g.createLinearGradient(0, top, 0, H)
    bg.addColorStop(0, '#191b24')
    bg.addColorStop(1, '#0b0c11')
    g.fillStyle = bg
    g.fillRect(x, top, w, h)
    if (rnd() > 0.7) { // antenna
      g.fillRect(x + w / 2 - 1, top - 30, 2, 30)
      g.fillStyle = 'rgba(255,40,40,0.9)'
      g.fillRect(x + w / 2 - 2, top - 33, 4, 4)
    }
    for (let wy = top + 10; wy < H - 8; wy += 13) {
      for (let wx = x + 6; wx < x + w - 8; wx += 10) {
        if (rnd() > 0.74) {
          g.fillStyle = rnd() > 0.85 ? 'rgba(170,210,255,0.55)' : 'rgba(255,196,130,0.55)'
          g.fillRect(wx, wy, 4, 6)
        }
      }
    }
    x += w + rnd() * 8
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function radialTexture(inner = 'rgba(0,0,0,0.85)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, inner)
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

export function useBlobShadowTexture() {
  const tex = useMemo(() => radialTexture('rgba(0,0,0,0.9)'), [])
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

/* ---------- ground + markings ---------- */
function Ground() {
  const map = useMemo(asphaltTexture, [])
  useEffect(() => () => map.dispose(), [map])
  // lane paint along the entry road (z = -16) — dashed centre + solid edges
  const dashes = useMemo(() => Array.from({ length: 22 }, (_, i) => 11 + i * 3.4), [])
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial map={map} color="#474a53" roughness={0.86} metalness={0.05} roughnessMap={map} />
      </mesh>
      {dashes.map(x => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.003, -16]} receiveShadow>
          <planeGeometry args={[1.7, 0.13]} />
          <meshStandardMaterial color="#c9c9c2" roughness={0.6} />
        </mesh>
      ))}
      {[-19.2, -12.8].map(z => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[52, 0.003, z]} receiveShadow>
          <planeGeometry args={[80, 0.14]} />
          <meshStandardMaterial color="#d8a531" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Skyline() {
  const map = useMemo(skylineTexture, [])
  useEffect(() => () => map.dispose(), [map])
  return (
    <mesh position={[0, 22, -100]}>
      <planeGeometry args={[200, 44]} />
      <meshBasicMaterial map={map} transparent opacity={0.22} fog={false} toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/** Glowing ring the car lands inside — opacity is driven by the animation. */
export const StageRing = forwardRef(function StageRing(_, ref) {
  const glow = useMemo(() => radialTexture('rgba(255,90,30,0.55)'), [])
  useEffect(() => () => glow.dispose(), [glow])
  return (
    <group ref={ref}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.006}>
        <ringGeometry args={[3.35, 3.43, 160]} />
        <meshBasicMaterial color={new THREE.Color('#ff6a1f').multiplyScalar(3)} toneMapped={false} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial map={glow} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
})

export default function Stage() {
  return (
    <>
      <color attach="background" args={['#07080c']} />
      <fog attach="fog" args={['#07080c', 18, 55]} />

      {/* reflections on the paint/glass come from this tiny virtual studio */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ff5a2a" position={[-7, 2, -2]} rotation-y={Math.PI / 2} scale={[10, 0.8, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#9ec2ff" position={[7, 2.5, 2]} rotation-y={-Math.PI / 2} scale={[10, 1, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[0, 2, 9]} scale={[14, 1.2, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[3, 4, 6]} scale={2} />
      </Environment>

      <hemisphereLight args={['#8fa6ff', '#1a0d08', 0.35]} />
      <directionalLight position={[-6, 9, -8]} intensity={0.7} color="#a8bcff" />
      {/* key light: a pool of light where the car comes to rest */}
      <spotLight
        position={[1.5, 11, 4]}
        angle={0.42}
        penumbra={0.85}
        intensity={260}
        decay={2}
        distance={40}
        color="#fff5ea"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      {/* coloured rim lights */}
      <pointLight position={[-6, 3.5, -8]} intensity={30} distance={16} color="#ff3b1f" />
      <pointLight position={[6, 3, -8]} intensity={24} distance={16} color="#ff8a2a" />

      <Ground />
      <Skyline />
    </>
  )
}
