import type { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function useCameraController(
  camera: PerspectiveCamera,
  container: HTMLElement,
) {
  const controls = new OrbitControls(camera, container)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 5
  controls.maxDistance = 60
  controls.maxPolarAngle = Math.PI * 0.75
  controls.target.set(0, 0, 0)
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.15
  controls.update()

  return { controls }
}
