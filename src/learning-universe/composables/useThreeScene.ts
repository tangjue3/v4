import { ref, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createSoftParticleMaterial, createSoftParticleGeometry } from './useSoftParticles'

// --- Central star corona particles ---
function createCoronaParticles(innerR: number, outerR: number, count: number): THREE.Points {
  const positions = new Float32Array(count * 3)
  const colorsArr = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = innerR + Math.random() * (outerR - innerR)
    const height = (Math.random() - 0.5) * 0.4

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const color = new THREE.Color()
    color.setHSL(0.1 + Math.random() * 0.08, 0.9, 0.5 + Math.random() * 0.5)
    colorsArr[i * 3] = color.r
    colorsArr[i * 3 + 1] = color.g
    colorsArr[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 1.5 + 0.3
  }

  const geometry = createSoftParticleGeometry(positions, colorsArr, sizes)
  const material = createSoftParticleMaterial(0.06, 0.7)

  return new THREE.Points(geometry, material)
}

// --- Central star glow shader ---
const glowVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glowFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform vec3 uViewPos;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uFalloff;

  void main() {
    vec3 viewDir = normalize(uViewPos - vWorldPos);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, uFalloff);
    float alpha = fresnel * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function createGlowSphere(radius: number, color: THREE.Color, opacity: number, falloff: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 48, 48)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uViewPos: { value: new THREE.Vector3() },
      uColor: { value: color },
      uOpacity: { value: opacity },
      uFalloff: { value: falloff },
    },
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Mesh(geometry, material)
}

export function useThreeScene(container: HTMLElement) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x030318)

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(0, 20, 40)
  camera.lookAt(0, 0, 0)

  // Clean up any lingering canvas from a previous HMR cycle
  const existingCanvas = container.querySelector('canvas')
  if (existingCanvas) {
    existingCanvas.remove()
  }

  // Create canvas manually for more control over context attributes
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    failIfMajorPerformanceCaveat: false,
  }) || canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    failIfMajorPerformanceCaveat: false,
  })

  if (!context) {
    console.error('WebGL not available on this browser')
    throw new Error('WebGL不可用，请检查浏览器是否支持WebGL，或尝试重启浏览器。')
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 2.2
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild(renderer.domElement)
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0'
  renderer.domElement.style.zIndex = '0'

  // --- CSS2D Renderer for planet labels ---
  const labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(container.clientWidth, container.clientHeight)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0'
  labelRenderer.domElement.style.pointerEvents = 'none'
  labelRenderer.domElement.style.zIndex = '10'
  container.appendChild(labelRenderer.domElement)

  // --- Post Processing ---
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.25,  // strength — reduced bloom for sharper planet details
    0.1,   // radius — tighter bloom spread
    0.85,  // threshold — only very bright things bloom
  )
  composer.addPass(bloomPass)

  // --- Lighting: multi-angle to illuminate planets fully ---
  // Base ambient
  const ambientLight = new THREE.AmbientLight(0x334466, 2.0)
  scene.add(ambientLight)

  // Hemisphere: sky (blue-ish) + ground (warm) for natural fill
  const hemiLight = new THREE.HemisphereLight(0x8899cc, 0x443322, 0.8)
  scene.add(hemiLight)

  // Center star point light
  const sunLight = new THREE.PointLight(0xffeedd, 120, 100, 0.5)
  sunLight.position.set(0, 0, 0)
  sunLight.castShadow = true
  scene.add(sunLight)

  // Key light: top-right-front
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.7)
  keyLight.position.set(15, 25, 20)
  scene.add(keyLight)

  // Fill light: left side
  const fillLeft = new THREE.DirectionalLight(0x8899cc, 0.5)
  fillLeft.position.set(-20, 0, 5)
  scene.add(fillLeft)

  // Fill light: bottom
  const fillBottom = new THREE.DirectionalLight(0x665544, 0.4)
  fillBottom.position.set(0, -15, 0)
  scene.add(fillBottom)

  // Rim light: from behind
  const rimLight = new THREE.DirectionalLight(0xaaccff, 0.35)
  rimLight.position.set(0, 5, -25)
  scene.add(rimLight)

  // --- Central Star System ---
  const starGroup = new THREE.Group()
  starGroup.name = 'central-star'
  scene.add(starGroup)

  // Core: small bright sphere
  const coreGeo = new THREE.SphereGeometry(0.35, 48, 48)
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff8e8 })
  const core = new THREE.Mesh(coreGeo, coreMat)
  starGroup.add(core)

  // Inner glow shell
  const innerGlow = createGlowSphere(0.7, new THREE.Color(0xffcc66), 0.6, 2.5)
  starGroup.add(innerGlow)

  // Mid glow shell
  const midGlow = createGlowSphere(1.2, new THREE.Color(0xff9922), 0.3, 3.5)
  starGroup.add(midGlow)

  // Particle corona (inner ring)
  const corona = createCoronaParticles(0.6, 1.4, 400)
  starGroup.add(corona)

  // Mid corona ring
  const innerCorona = createCoronaParticles(0.3, 0.8, 300)
  starGroup.add(innerCorona)

  // --- Galactic bulge: dense central star cluster ---
  const bulgeCount = 800
  const bulgePositions = new Float32Array(bulgeCount * 3)
  const bulgeColors = new Float32Array(bulgeCount * 3)
  const bulgeSizes = new Float32Array(bulgeCount)

  for (let i = 0; i < bulgeCount; i++) {
    const r = Math.pow(Math.random(), 0.5) * 4.0
    const theta = Math.random() * Math.PI * 2
    const phi = (Math.random() - 0.5) * Math.PI * 0.5

    bulgePositions[i * 3] = Math.cos(theta) * Math.cos(phi) * r
    bulgePositions[i * 3 + 1] = Math.sin(phi) * r * 0.35
    bulgePositions[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r

    const c = new THREE.Color()
    c.setHSL(0.1 + Math.random() * 0.1, 0.25, 0.55 + Math.random() * 0.45)
    bulgeColors[i * 3] = c.r
    bulgeColors[i * 3 + 1] = c.g
    bulgeColors[i * 3 + 2] = c.b

    bulgeSizes[i] = Math.random() * 1.2 + 0.2
  }

  const bulgeGeo = createSoftParticleGeometry(bulgePositions, bulgeColors, bulgeSizes)
  const bulgeMat = createSoftParticleMaterial(0.05, 0.55)
  const bulgeCluster = new THREE.Points(bulgeGeo, bulgeMat)
  bulgeCluster.name = 'galactic-bulge'
  starGroup.add(bulgeCluster)

  // Outer corona ring
  const outerCorona = createCoronaParticles(1.2, 2.6, 500)
  starGroup.add(outerCorona)

  // Store glow materials for view position updates
  const glowMaterials = [innerGlow, midGlow].map(
    (m) => m.material as THREE.ShaderMaterial,
  )

  const clock = new THREE.Clock()
  const animating = ref(true)
  let animationId = 0

  const animationCallbacks: Array<(delta: number, time: number) => void> = []

  function animate() {
    if (!animating.value) return
    animationId = requestAnimationFrame(animate)
    const delta = Math.min(clock.getDelta(), 0.1)
    const time = clock.elapsedTime

    // Animate central star
    core.rotation.y += delta * 0.15
    corona.rotation.y += delta * 0.3
    corona.rotation.x += delta * 0.15
    innerCorona.rotation.y -= delta * 0.4
    innerCorona.rotation.z += delta * 0.2
    outerCorona.rotation.y += delta * 0.25
    outerCorona.rotation.x -= delta * 0.12

    // Bulge cluster slow rotation
    bulgeCluster.rotation.y += delta * 0.1
    bulgeCluster.rotation.x += delta * 0.03

    // Pulse the glow shells
    innerGlow.scale.setScalar(1 + Math.sin(time * 2.3) * 0.08)
    midGlow.scale.setScalar(1 + Math.sin(time * 1.5 + 1) * 0.06)

    // Update glow view position
    for (const mat of glowMaterials) {
      mat.uniforms.uViewPos.value.copy(camera.position)
    }

    // Pulsing point light
    sunLight.intensity = 80 + Math.sin(time * 2.0) * 8 + Math.sin(time * 4.5) * 4

    for (const cb of animationCallbacks) {
      cb(delta, time)
    }

    composer.render()
    labelRenderer.render(scene, camera)
  }

  function onAnimation(cb: (delta: number, time: number) => void) {
    animationCallbacks.push(cb)
  }

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    composer.setSize(container.clientWidth, container.clientHeight)
    labelRenderer.setSize(container.clientWidth, container.clientHeight)
  }

  window.addEventListener('resize', resize)

  onBeforeUnmount(() => {
    animating.value = false
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => {
            m.dispose()
            if ('map' in m && (m as THREE.MeshStandardMaterial).map) {
              (m as THREE.MeshStandardMaterial).map!.dispose()
            }
          })
        } else {
          obj.material?.dispose()
        }
      }
      if (obj instanceof THREE.Points) {
        obj.geometry?.dispose()
        ;(obj.material as THREE.Material)?.dispose()
      }
    })
    scene.clear()

    composer.dispose()
    renderer.dispose()
    if (renderer.domElement.parentElement) {
      container.removeChild(renderer.domElement)
    }
    if (labelRenderer.domElement.parentElement) {
      container.removeChild(labelRenderer.domElement)
    }
  })

  animate()

  return {
    scene,
    camera,
    renderer,
    composer,
    clock,
    core: starGroup,
    labelRenderer,
    onAnimation,
    resize,
  }
}
