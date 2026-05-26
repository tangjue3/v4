<template>
  <div ref="containerRef" class="universe-canvas">
    <div v-if="webglError" class="error-overlay">
      <div class="error-content">
        <p class="error-icon">!</p>
        <p class="error-text">WebGL 不可用</p>
        <p class="error-hint">请尝试：<br/>1. 重启浏览器<br/>2. 检查 chrome://settings/system 中"使用图形加速"是否开启<br/>3. 使用 Edge 浏览器打开</p>
      </div>
    </div>
    <div v-else-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">宇宙加载中...</p>
        <p class="loading-progress">{{ Math.round(loadProgress) }}%</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '../../composables/useThreeScene'
import { useStarfield } from '../../composables/useStarfield'
import { usePlanetLoader } from '../../composables/usePlanetLoader'
import { useCameraController } from '../../composables/useCameraController'
import { useLearningPath } from '../../composables/useLearningPath'
import { useNebula } from '../../composables/useNebula'
import { usePathLines } from '../../composables/usePathLines'
import { galaxies, courses } from '../../data/courses'
import { learningPaths } from '../../data/learningPaths'
import { useUniverseStore } from '../../stores/universeStore'

const emit = defineEmits<{
  selectPlanet: [courseId: number]
}>()

// Module-level state for click handling (populated in onMounted)
let _three: ReturnType<typeof useThreeScene> | null = null
let _meshes: Map<number, THREE.Object3D> = new Map()
let _onPlanetClick: ((courseId: number) => void) | null = null
let _pathLines: ReturnType<typeof usePathLines> | null = null
const _raycaster = new THREE.Raycaster()
const _mouse = new THREE.Vector2()

function raycastPlanet(e: MouseEvent): number | null {
  if (!_three) return null
  const rect = _three.renderer.domElement.getBoundingClientRect()
  _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  _raycaster.setFromCamera(_mouse, _three.camera)

  const targets: THREE.Object3D[] = []
  _meshes.forEach((m) => targets.push(m))
  const intersects = _raycaster.intersectObjects(targets, true)

  if (intersects.length > 0) {
    let obj: THREE.Object3D | null = intersects[0].object
    while (obj) {
      if (obj.userData.courseId) {
        return obj.userData.courseId as number
      }
      obj = obj.parent
    }
  }
  return null
}

function onWindowClick(e: MouseEvent) {
  if (!_onPlanetClick) return
  const courseId = raycastPlanet(e)
  if (courseId !== null) {
    _onPlanetClick(courseId)
  }
}

const containerRef = ref<HTMLDivElement>()
const loading = ref(true)
const loadProgress = ref(0)
const webglError = ref(false)
const store = useUniverseStore()

const sceneData = shallowRef<ReturnType<typeof useThreeScene> | null>(null)
const planetMeshes = shallowRef<Map<number, THREE.Object3D>>(new Map())

// Hover particle burst
let hoverBurst: THREE.Points | null = null
let burstLife = 0

onMounted(async () => {
  window.addEventListener('click', onWindowClick)

  if (!containerRef.value) return

  let three: ReturnType<typeof useThreeScene>
  try {
    three = useThreeScene(containerRef.value)
  } catch (e) {
    console.error('Failed to initialize Three.js:', e)
    webglError.value = true
    loading.value = false
    return
  }
  sceneData.value = three

  // Starfield (multi-layer, GPU twinkling)
  const starfield = useStarfield(three.scene)

  // Nebulas and cosmic dust
  const nebula = useNebula(three.scene)

  // Camera controller with auto-rotate
  useCameraController(three.camera, containerRef.value)

  // Shared galaxy group: planets + particle arms rotate together
  const galaxyGroup = new THREE.Group()
  galaxyGroup.name = 'galaxy'
  three.scene.add(galaxyGroup)

  const learningPath = useLearningPath(galaxyGroup, galaxies)

  // Learning path golden lines
  const pathLines = usePathLines(galaxyGroup)
  _pathLines = pathLines

  const loader = usePlanetLoader(galaxyGroup)

  // Load planet models
  const meshes = await loader.loadAllPlanets(galaxies, courses, (progress) => {
    loadProgress.value = progress
  })

  // Set module-level refs for click handler
  _three = three
  _meshes = meshes
  planetMeshes.value = meshes

  // Watch selected path — draw golden curve through its planets
  watch(() => store.selectedPath, (pathId) => {
    if (!pathId) {
      pathLines.clearPath()
      return
    }
    const path = learningPaths.find((p) => p.id === pathId)
    if (path) {
      pathLines.updatePath(meshes, path.courseSequence)
    }
  })

  _onPlanetClick = (courseId: number) => {
    store.selectCourse(courseId)
    emit('selectPlanet', courseId)
  }

  // Hover effect
  let hoveredPlanet: THREE.Object3D | null = null
  three.renderer.domElement.addEventListener('mousemove', (e) => {
    const rect = three.renderer.domElement.getBoundingClientRect()
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    _raycaster.setFromCamera(_mouse, three.camera)

    const targets: THREE.Object3D[] = []
    _meshes.forEach((m) => targets.push(m))
    const intersects = _raycaster.intersectObjects(targets, true)

    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object
      while (obj) {
        if (obj.userData.courseId) {
          const courseId = obj.userData.courseId as number

          if (hoveredPlanet && hoveredPlanet.userData.courseId !== courseId) {
            resetPlanetGlow(hoveredPlanet)
          }
          const mesh = _meshes.get(courseId)
          if (mesh) {
            highlightPlanet(mesh)
            hoveredPlanet = mesh
            three.renderer.domElement.style.cursor = 'pointer'
          }
          return
        }
        obj = obj.parent
      }
    }
    if (hoveredPlanet) {
      resetPlanetGlow(hoveredPlanet)
      hoveredPlanet = null
    }
    three.renderer.domElement.style.cursor = 'grab'
  })

  // Main animation callback
  three.onAnimation((delta, time) => {
    // Slowly rotate the entire galaxy (planets + particle arms together)
    galaxyGroup.rotation.y += delta * 0.04

    // Animate particle shader time uniform for subtle pulse
    for (const mat of learningPath.particleMaterials) {
      mat.uniforms.uTime.value = time
    }

    // Update path line reveal + flow animation
    _pathLines?.updateAnimation(delta)

    // Update starfield twinkling
    starfield.update(time)

    // Update nebula and dust
    nebula.update(delta, time)

    // Update hover burst
    if (hoverBurst && burstLife > 0) {
      burstLife -= delta
      const positions = hoverBurst.geometry.attributes.position.array as Float32Array
      const velocities = hoverBurst.userData.velocities as THREE.Vector3[]
      for (let i = 0; i < velocities.length; i++) {
        positions[i * 3] += velocities[i].x * delta
        positions[i * 3 + 1] += velocities[i].y * delta
        positions[i * 3 + 2] += velocities[i].z * delta
      }
      hoverBurst.geometry.attributes.position.needsUpdate = true
      ;(hoverBurst.material as THREE.ShaderMaterial).uniforms.uOpacity.value = Math.max(0, burstLife)
      hoverBurst.scale.multiplyScalar(1 + delta * 2)

      if (burstLife <= 0) {
        three.scene.remove(hoverBurst)
        hoverBurst.geometry.dispose()
        ;(hoverBurst.material as THREE.Material).dispose()
        hoverBurst = null
      }
    }
  })

  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
  _onPlanetClick = null
  if (_pathLines) _pathLines.dispose()
  if (flyCleanup) {
    flyCleanup()
    flyCleanup = null
  }
})

function highlightPlanet(group: THREE.Object3D) {
  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mat = child.material as THREE.MeshStandardMaterial
      mat.emissive = new THREE.Color(0x666666)
      mat.emissiveIntensity = 1.0
    }
  })
}

function resetPlanetGlow(group: THREE.Object3D) {
  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      const mat = child.material
      const courseId = child.userData.courseId as number
      if (!courseId) return
      const state = store.getPlanetState(courseId)
      switch (state) {
        case 'available':
          mat.emissive = new THREE.Color(0x444444)
          mat.emissiveIntensity = 0.3
          break
        case 'completed':
          mat.emissive = new THREE.Color(0x22aa44)
          mat.emissiveIntensity = 0.2
          break
        default:
          mat.emissive = new THREE.Color(0x000000)
          mat.emissiveIntensity = 0
      }
    }
  })
}

// --- Fly to planet: smoothly move camera near the planet ---
let flyCleanup: (() => void) | null = null

function flyToPlanet(courseId: number) {
  const mesh = planetMeshes.value.get(courseId)
  if (!mesh || !sceneData.value) return

  const { camera } = sceneData.value
  const startPos = camera.position.clone()
  const startTime = performance.now() / 1000
  const duration = 1.5

  if (flyCleanup) flyCleanup()
  let active = true

  function animateFly(_delta: number) {
    if (!active || !sceneData.value) return
    const wp = new THREE.Vector3()
    mesh?.getWorldPosition(wp)

    const elapsed = performance.now() / 1000 - startTime
    const t = Math.min(elapsed / duration, 1.0)
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    // Target: 4 units away from planet
    const dirFromPlanet = startPos.clone().sub(wp).normalize()
    const targetCamPos = wp.clone().add(dirFromPlanet.multiplyScalar(4))

    camera.position.lerpVectors(startPos, targetCamPos, ease)
    camera.lookAt(wp)

    if (t >= 1.0) {
      active = false
      flyCleanup = null
      // After arrival, keep tracking the planet
      startFollowMode(courseId)
    }
  }

  function startFollowMode(cId: number) {
    if (flyCleanup) flyCleanup()
    let followActive = true
    function follow(_d: number) {
      if (!followActive || !sceneData.value) return
      const m = planetMeshes.value.get(cId)
      if (!m) return
      const w = new THREE.Vector3()
      m.getWorldPosition(w)
      camera.lookAt(w)
    }
    sceneData.value!.onAnimation(follow)
    flyCleanup = () => { followActive = false }
  }

  sceneData.value.onAnimation(animateFly)
  flyCleanup = () => { active = false }
}

defineExpose({ flyToPlanet, sceneData })
</script>

<style scoped>
.universe-canvas {
  width: 100%;
  height: 100%;
  position: relative;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #0a0a2e 0%, #000010 100%);
  z-index: 100;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #4FC3F7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 18px;
  color: #aac;
  margin-bottom: 8px;
}

.loading-progress {
  font-size: 14px;
  color: #88a;
  margin-bottom: 12px;
}

.progress-bar {
  width: 200px;
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4FC3F7, #BA68C8);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #0a0a2e 0%, #000010 100%);
  z-index: 200;
}

.error-content {
  text-align: center;
}

.error-icon {
  width: 64px;
  height: 64px;
  line-height: 64px;
  border-radius: 50%;
  background: rgba(229, 115, 115, 0.2);
  border: 2px solid rgba(229, 115, 115, 0.5);
  color: #E57373;
  font-size: 32px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.error-text {
  font-size: 20px;
  color: #E57373;
  margin-bottom: 16px;
}

.error-hint {
  font-size: 13px;
  color: #889;
  line-height: 1.8;
  text-align: left;
  display: inline-block;
}
</style>
