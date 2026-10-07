import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import * as THREE from 'three'

const MAX = 2400

/** Rubber left on the asphalt. Call ref.add(x0, z0, x1, z1, width). */
const SkidMarks = forwardRef(function SkidMarks(_, ref) {
  const mesh = useRef()
  const { geo, mat } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: '#020203',
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
    return { geo, mat }
  }, [])
  const state = useMemo(() => ({ count: 0, m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }), [])

  useImperativeHandle(ref, () => ({
    get count() {
      return state.count
    },
    add(x0, z0, x1, z1, width) {
      const dx = x1 - x0
      const dz = z1 - z0
      const len = Math.hypot(dx, dz)
      if (len < 0.01 || state.count >= MAX) return
      state.p.set((x0 + x1) / 2, 0.004, (z0 + z1) / 2)
      state.q.setFromAxisAngle(state.up, Math.atan2(-dz, dx))
      state.s.set(len + width * 0.5, 1, width)
      state.m.compose(state.p, state.q, state.s)
      mesh.current.setMatrixAt(state.count++, state.m)
      mesh.current.count = state.count
      mesh.current.instanceMatrix.needsUpdate = true
    },
    reset() {
      state.count = 0
      if (mesh.current) mesh.current.count = 0
    },
  }))

  return <instancedMesh ref={mesh} args={[geo, mat, MAX]} count={0} frustumCulled={false} renderOrder={1} />
})

export default SkidMarks
