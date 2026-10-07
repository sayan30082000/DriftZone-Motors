import * as THREE from 'three'

/*
  The intro, seen from above (camera sits at +z looking toward -z):

      far background road  z = -16
      <==================================  car enters from the right, heading west (-x)
                         \
                          \  left turn toward the camera
                           |
                           v   handbrake: the rear swings out, the car slides
                         [car]  sideways toward the camera and stops at (0, 0, 0)
                               nose pointing +x, side profile facing the camera

  Heading convention: the car model's nose points +x at rotation.y = 0.
  rotation.y = θ  →  nose direction (cos θ, -sin θ) in (x, z).
*/

const V = (x, z) => new THREE.Vector3(x, 0, z)
const R = 8 // turn radius
const K = 0.5523 * R // cubic-bezier quarter-circle handle

const path = new THREE.CurvePath()
path.add(new THREE.LineCurve3(V(36, -16), V(8, -16)))
path.add(new THREE.CubicBezierCurve3(V(8, -16), V(8 - K, -16), V(0, -16 + R - K), V(0, -16 + R)))
path.add(new THREE.LineCurve3(V(0, -16 + R), V(0, 0)))
const LENGTH = path.getLength()

// Speed profile: constant cruise, then brake with v = v0·(1-u)² so the car eases to a dead stop.
export const T_BRAKE = 1.55 // seconds of cruising before the brakes go on
const BRAKE_DUR = 2.15
export const T_STOP = T_BRAKE + BRAKE_DUR // ≈ 3.7 s — car is stationary at centre
const V0 = LENGTH / (T_BRAKE + BRAKE_DUR / 3)

function distanceAt(t) {
  if (t <= T_BRAKE) return V0 * t
  const u = Math.min((t - T_BRAKE) / BRAKE_DUR, 1)
  return V0 * T_BRAKE + ((V0 * BRAKE_DUR) / 3) * (1 - Math.pow(1 - u, 3))
}
function speedAt(t) {
  if (t <= T_BRAKE) return V0
  const u = Math.min((t - T_BRAKE) / BRAKE_DUR, 1)
  return V0 * (1 - u) * (1 - u)
}
function decelAt(t) {
  if (t <= T_BRAKE || t >= T_STOP) return 0
  const u = (t - T_BRAKE) / BRAKE_DUR
  return ((2 * V0) / BRAKE_DUR) * (1 - u)
}

// Keyframed extras (seconds → radians). Slip = body angle relative to direction of travel.
const deg = d => (d * Math.PI) / 180
const SLIP = [[0, 0], [1.2, 0], [1.6, deg(18)], [2.2, deg(66)], [2.85, deg(104)], [3.3, deg(85)], [3.7, deg(90)]]
// Front-wheel steer: turn in, then counter-steer through the slide, then relax.
const STEER = [[0, 0], [1.1, 0], [1.38, deg(20)], [1.7, deg(4)], [2.1, deg(-22)], [2.75, deg(-28)], [3.25, deg(-14)], [3.9, deg(-8)]]

const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
function track(keys, t) {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1]
      const [t1, v1] = keys[i]
      return v0 + (v1 - v0) * easeInOut((t - t0) / (t1 - t0))
    }
  }
  return keys[keys.length - 1][1]
}

const _p = new THREE.Vector3()
const _tan = new THREE.Vector3()

/** Full car state at time t (seconds since the intro started). */
export function sampleDrift(t, out = {}) {
  const u = Math.min(distanceAt(t) / LENGTH, 1)
  path.getPointAt(u, _p)
  path.getTangentAt(u, _tan)
  let pathYaw = Math.atan2(-_tan.z, _tan.x)
  if (pathYaw < 0) pathYaw += Math.PI * 2 // unwrap: travel heading runs π → 3π/2
  const slip = track(SLIP, t)

  out.x = _p.x
  out.z = _p.z
  out.yaw = pathYaw + slip // ends at 2π → nose +x, broadside to camera
  out.slip = slip
  out.speed = speedAt(t)
  out.decel = decelAt(t)
  out.steer = track(STEER, t)
  // direction of travel (for smoke drift)
  out.vx = _tan.x * out.speed
  out.vz = _tan.z * out.speed
  return out
}

export const DRIFT_START = sampleDrift(0)
