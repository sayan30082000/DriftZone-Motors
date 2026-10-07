import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX = 700

const vertexShader = /* glsl */ `
  attribute vec3 iPos;
  attribute float iSize;
  attribute float iAlpha;
  attribute float iRot;
  varying vec2 vUv;
  varying float vAlpha;
  void main() {
    vUv = uv;
    vAlpha = iAlpha;
    vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
    float c = cos(iRot), s = sin(iRot);
    mv.xy += mat2(c, s, -s, c) * position.xy * iSize; // camera-facing quad
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vAlpha;
  // cheap value noise so puffs aren't perfect circles
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    float n = noise(vUv * 5.0) * 0.5 + noise(vUv * 11.0) * 0.25;
    float a = smoothstep(0.5, 0.05, d + (n - 0.35) * 0.22);
    a *= a;
    gl_FragColor = vec4(uColor * (0.85 + n * 0.3), a * vAlpha);
  }
`

/** Tyre smoke. Call ref.emit(x, y, z, vx, vz, count) from the animation loop. */
const Smoke = forwardRef(function Smoke(_, ref) {
  const sim = useMemo(() => {
    const geo = new THREE.InstancedBufferGeometry()
    const quad = new THREE.PlaneGeometry(1, 1)
    geo.index = quad.index
    geo.setAttribute('position', quad.attributes.position)
    geo.setAttribute('uv', quad.attributes.uv)
    const pos = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3)
    const size = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)
    const alpha = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)
    const rot = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)
    for (const a of [pos, size, alpha, rot]) a.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('iPos', pos)
    geo.setAttribute('iSize', size)
    geo.setAttribute('iAlpha', alpha)
    geo.setAttribute('iRot', rot)
    geo.instanceCount = 0

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uColor: { value: new THREE.Color('#9097a2') } },
      transparent: true,
      depthWrite: false,
    })
    const particles = [] // { x,y,z, vx,vy,vz, size, grow, life, max, a, rot, spin }
    return { geo, mat, particles, pos, size, alpha, rot }
  }, [])

  useImperativeHandle(ref, () => ({
    emit(x, y, z, vx, vz, count) {
      for (let i = 0; i < count && sim.particles.length < MAX; i++) {
        sim.particles.push({
          x: x + (Math.random() - 0.5) * 0.35,
          y: y + Math.random() * 0.15,
          z: z + (Math.random() - 0.5) * 0.35,
          vx: vx * 0.15 + (Math.random() - 0.5) * 2.6,
          vy: 0.15 + Math.random() * 0.45,
          vz: vz * 0.15 + (Math.random() - 0.5) * 2.6,
          size: 0.45 + Math.random() * 0.5,
          grow: 1.3 + Math.random() * 1.5,
          life: 0,
          max: 1.5 + Math.random() * 1.8,
          a: 0.1 + Math.random() * 0.12,
          rot: Math.random() * 6.28,
          spin: (Math.random() - 0.5) * 0.8,
        })
      }
    },
    reset() {
      sim.particles.length = 0
      sim.geo.instanceCount = 0
    },
  }))

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const { particles, pos, size, alpha, rot, geo } = sim
    let n = 0
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.life += dt
      if (p.life >= p.max) continue
      const drag = Math.exp(-1.6 * dt)
      p.vx *= drag
      p.vz *= drag
      p.vy = p.vy * Math.exp(-0.5 * dt) + 0.05 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
      p.size += p.grow * dt
      p.rot += p.spin * dt
      const k = p.life / p.max
      const fade = Math.min(p.life / 0.15, 1) * (1 - k) * (1 - k)
      pos.setXYZ(n, p.x, p.y, p.z)
      size.setX(n, p.size)
      alpha.setX(n, p.a * fade)
      rot.setX(n, p.rot)
      particles[n++] = p
    }
    particles.length = n
    geo.instanceCount = n
    pos.needsUpdate = size.needsUpdate = alpha.needsUpdate = rot.needsUpdate = true
  })

  return <mesh geometry={sim.geo} material={sim.mat} frustumCulled={false} renderOrder={5} />
})

export default Smoke
