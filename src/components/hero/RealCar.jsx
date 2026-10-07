import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/*
  Real 3D car for the drift intro.

  Model: "Car Concept" by Eric Chadwick, © 2024 Darmstadt Graphics Group GmbH,
  CC BY 4.0 — https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept
  Prepared for the web (Khronos/3D Commerce logos removed, textures → WebP, meshopt) — see README.

  To use a different car: drop a .glb at public/models/car.glb with wheel nodes named
  WheelFrontL / WheelFrontR / WheelRearL / WheelRearR (or edit WHEEL_NODES), nose pointing +Z.
*/

export const CAR_URL = '/models/car.glb'
const WHEEL_NODES = ['WheelFrontL', 'WheelFrontR', 'WheelRearL', 'WheelRearR'] // → FL, FR, RL, RR
const Y = new THREE.Vector3(0, 1, 0)

// useGLTF(url, draco = false (not needed), meshopt = true)
useGLTF.preload(CAR_URL, false, true)

function plateTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#ecebe6'
  g.fillRect(0, 0, 512, 128)
  g.strokeStyle = '#1a1a1a'
  g.lineWidth = 8
  g.strokeRect(6, 6, 500, 116)
  g.fillStyle = '#141414'
  g.font = 'bold 74px Arial, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('DZ MOTORS', 256, 68)
  const tex = new THREE.CanvasTexture(c)
  tex.flipY = false // glTF UV convention
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/**
 * Re-parents the loaded model into a drivable rig (car frame: nose +X, ground y = 0, centred):
 *
 *   root ─┬─ suspension (pivot ≈ centre of mass) ─ offset ─ orient (+Z nose → +X) ─ model body
 *         └─ wheel mounts ×4 (steer about Y) ─ wheel node (spins about its own axle)
 *
 * Wheels hang off root, not the suspension, so the body can roll/pitch over them.
 */
function buildRig(gltfScene) {
  const model = gltfScene.clone(true)
  const root = new THREE.Group()
  const suspension = new THREE.Group()
  const offset = new THREE.Group()
  const orient = new THREE.Group()
  suspension.position.y = 0.5
  offset.position.y = -0.5
  orient.rotation.y = Math.PI / 2
  root.add(suspension)
  suspension.add(offset)
  offset.add(orient)
  orient.add(model)

  root.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(model, true)
  orient.position.x -= (box.min.x + box.max.x) / 2
  orient.position.z -= (box.min.z + box.max.z) / 2
  orient.position.y -= box.min.y
  root.updateMatrixWorld(true)

  // ---- materials ----
  const mats = {}
  model.traverse(o => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) mats[m.name] = m
  })
  const glass = mats['Glass']
  if (glass) {
    // tinted see-through glass without the costly transmission render pass
    glass.transmission = 0
    glass.transparent = true
    glass.opacity = 0.38
    glass.color?.set('#0f1620')
    glass.roughness = 0.03
    glass.metalness = 0.2
    glass.envMapIntensity = 1.6
    glass.depthWrite = false
    glass.needsUpdate = true
  }
  const paint = mats['Paint 1 Carmine']
  if (paint) {
    paint.clearcoat = Math.max(paint.clearcoat ?? 0, 1)
    paint.clearcoatRoughness = 0.05
    paint.envMapIntensity = 1.3
  }
  const brake = mats['Brakelight']
  const head = mats['Headlight']
  if (head) head.emissiveIntensity = 3.5
  const plate = mats['License']
  const plateTex = plateTexture()
  if (plate) {
    plate.map = plateTex
    plate.color.set('#ffffff')
    plate.needsUpdate = true
  }

  // headlight beam on the asphalt (rides with the body)
  const nose = (box.max.z - box.min.z) / 2
  const beam = new THREE.SpotLight('#eef4ff', 60, 26, 0.5, 0.7, 1.6)
  beam.position.set(nose - 0.2, 0.65, 0)
  beam.target.position.set(nose + 8, -0.4, 0)
  offset.add(beam, beam.target)

  // ---- wheels ----
  const wheels = WHEEL_NODES.map(name => {
    const node = model.getObjectByName(name)
    if (!node) return null
    const wb = new THREE.Box3().setFromObject(node, true)
    const center = wb.getCenter(new THREE.Vector3())
    const radius = (wb.max.y - wb.min.y) / 2
    const mount = new THREE.Group()
    mount.position.copy(center)
    root.add(mount)
    root.updateMatrixWorld(true)
    mount.attach(node) // keep its world transform

    // the model ships with the front wheels turned — measure that and cancel it out
    const axle = new THREE.Vector3(1, 0, 0).applyQuaternion(node.quaternion)
    const a = axle.z < 0 ? axle.clone().negate() : axle.clone()
    const baseYaw = -Math.atan2(a.x, a.z)
    mount.rotation.y = baseYaw
    // spin direction so that positive distance = rolling forward (+X)
    const axleCar = axle.clone().applyAxisAngle(Y, baseYaw)
    const spinSign = axleCar.z > 0 ? -1 : 1

    return {
      mount,
      baseYaw,
      contact: [center.x, center.z],
      roll(distance) {
        node.rotateX((spinSign * distance) / radius)
      },
    }
  }).filter(Boolean)

  const api = {
    suspension,
    wheels,
    contacts: wheels.map(w => w.contact),
    steer(angle) {
      wheels.slice(0, 2).forEach(w => (w.mount.rotation.y = w.baseYaw + angle))
    },
    brake(on) {
      if (brake) brake.emissiveIntensity = on ? 9 : 2.2
    },
  }
  api.brake(false)

  return { root, api, paint, dispose: () => plateTex.dispose() }
}

const RealCar = forwardRef(function RealCar({ color }, ref) {
  const { scene } = useGLTF(CAR_URL, false, true)
  const rig = useMemo(() => buildRig(scene), [scene])

  useEffect(() => {
    if (color && rig.paint) rig.paint.color.set(color)
  }, [color, rig])
  useEffect(() => () => rig.dispose(), [rig])
  useImperativeHandle(ref, () => rig.api, [rig])

  return <primitive object={rig.root} />
})

export default RealCar
