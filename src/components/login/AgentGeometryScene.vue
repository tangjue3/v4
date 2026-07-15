<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

interface AgentNode {
  name: string
  short: string
  angle: number
  radius: number
  color: number
}

const props = defineProps<{
  compact?: boolean
  showCopy?: boolean
}>()

const agents: AgentNode[] = [
  { name: 'ProfileAgent', short: 'Profile', angle: -90, radius: 3.55, color: 0x67b8f9 },
  { name: 'ResourceAgent', short: 'Resource', angle: -38, radius: 3.85, color: 0x7ac8f0 },
  { name: 'PathAgent', short: 'Path', angle: 13, radius: 3.58, color: 0x60a5fa },
  { name: 'TutorAgent', short: 'Tutor', angle: 64, radius: 3.76, color: 0x93c5fd },
  { name: 'EvaluationAgent', short: 'Evaluation', angle: 121, radius: 3.6, color: 0x93c5fd },
  { name: 'ReflectionAgent', short: 'Reflection', angle: 176, radius: 3.88, color: 0xb8d8ff },
  { name: 'KnowledgePathAgent', short: 'KnowledgePath', angle: 232, radius: 3.62, color: 0x7dd3fc },
]

const containerRef = ref<HTMLElement | null>(null)
const activeAgent = ref<string | null>(null)
const nodeScreenPositions = ref<Array<{ name: string, x: number, y: number }>>([])

const rootClass = computed(() => props.compact ? 'agent-scene compact' : 'agent-scene')

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let frameId = 0
let resizeObserver: ResizeObserver | null = null
let coreGroup: THREE.Group | null = null
let nodeGroup: THREE.Group | null = null
let particleField: THREE.Points | null = null
let flowDots: THREE.Mesh[] = []
let nodeMeshes: THREE.Mesh[] = []
let disposables: Array<{ dispose: () => void }> = []
const pointer = new THREE.Vector2(0, 0)
const targetPointer = new THREE.Vector2(0, 0)
const nodeWorldPositions: THREE.Vector3[] = []
const raycaster = new THREE.Raycaster()
const mouseNdc = new THREE.Vector2(99, 99)

function track<T extends { dispose: () => void }>(resource: T): T {
  disposables.push(resource)
  return resource
}

function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
  gradient.addColorStop(0.24, 'rgba(120,184,255,0.52)')
  gradient.addColorStop(1, 'rgba(120,184,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  return track(new THREE.CanvasTexture(canvas))
}

function makeLine(points: THREE.Vector3[], color = 0x78bfff, opacity = 0.28) {
  const geometry = track(new THREE.BufferGeometry().setFromPoints(points))
  const material = track(new THREE.LineBasicMaterial({
    color,
    opacity,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }))
  return new THREE.Line(geometry, material)
}

function createCore() {
  const group = new THREE.Group()

  const wireMaterial = track(new THREE.MeshBasicMaterial({
    color: 0xb8d8ff,
    opacity: 0.22,
    transparent: true,
    wireframe: true,
    blending: THREE.AdditiveBlending,
  }))
  const surfaceMaterial = track(new THREE.MeshBasicMaterial({
    color: 0x5a9fd8,
    opacity: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }))

  const icosahedron = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.32, 2)), wireMaterial)
  const inner = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.9, 1)), surfaceMaterial)
  group.add(icosahedron, inner)

  const ringMaterial = track(new THREE.MeshBasicMaterial({
    color: 0x78bfff,
    opacity: 0.28,
    transparent: true,
    wireframe: true,
    blending: THREE.AdditiveBlending,
  }))
  const ringGeometry = track(new THREE.TorusGeometry(2.08, 0.01, 8, 144))
  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.set(i * 1.05, i * 0.62, i * 0.44)
    group.add(ring)
  }

  const positions: number[] = []
  const particleCount = props.compact ? 320 : 720
  for (let i = 0; i < particleCount; i += 1) {
    const radius = 1.7 + Math.random() * 1.6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions.push(
      Math.sin(phi) * Math.cos(theta) * radius,
      Math.cos(phi) * radius * 0.78,
      Math.sin(phi) * Math.sin(theta) * radius,
    )
  }

  const pointGeometry = track(new THREE.BufferGeometry())
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const pointMaterial = track(new THREE.PointsMaterial({
    color: 0xe0edff,
    size: props.compact ? 0.022 : 0.018,
    opacity: 0.62,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }))
  group.add(new THREE.Points(pointGeometry, pointMaterial))

  return group
}

function createAgentNetwork() {
  const group = new THREE.Group()
  const glowTexture = createGlowTexture()
  const nodeGeometry = track(new THREE.SphereGeometry(0.095, 24, 16))

  agents.forEach((agent) => {
    const angle = THREE.MathUtils.degToRad(agent.angle)
    const position = new THREE.Vector3(
      Math.cos(angle) * agent.radius,
      Math.sin(angle) * agent.radius * 0.72,
      Math.sin(angle * 1.7) * 0.72,
    )
    nodeWorldPositions.push(position)

    const material = track(new THREE.MeshBasicMaterial({
      color: agent.color,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    }))
    const node = new THREE.Mesh(nodeGeometry, material)
    node.position.copy(position)
    node.userData.agentName = agent.name
    nodeMeshes.push(node)
    group.add(node)

    if (glowTexture) {
      const spriteMaterial = track(new THREE.SpriteMaterial({
        map: glowTexture,
        color: agent.color,
        opacity: 0.42,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }))
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(position)
      sprite.scale.setScalar(0.82)
      group.add(sprite)
    }

    group.add(makeLine([new THREE.Vector3(0, 0, 0), position], agent.color, 0.2))
  })

  for (let i = 0; i < nodeWorldPositions.length; i += 1) {
    const current = nodeWorldPositions[i]
    const next = nodeWorldPositions[(i + 1) % nodeWorldPositions.length]
    group.add(makeLine([current, next], 0x78bfff, 0.16))
  }

  const dotGeometry = track(new THREE.SphereGeometry(0.035, 12, 8))
  for (let i = 0; i < 28; i += 1) {
    const material = track(new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x93c5fd : 0x67b8f9,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    }))
    const dot = new THREE.Mesh(dotGeometry, material)
    dot.userData.edge = i % nodeWorldPositions.length
    dot.userData.offset = Math.random()
    dot.userData.centerEdge = i % 2 === 0
    flowDots.push(dot)
    group.add(dot)
  }

  return group
}

function createParticleField() {
  const count = props.compact ? 380 : 920
  const positions: number[] = []
  const colors: number[] = []
  const color = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    positions.push(
      (Math.random() - 0.5) * 13,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
    )
    const mix = Math.random()
    if (mix < 0.4) color.setHex(0x78bfff)
    else if (mix < 0.7) color.setHex(0xb8d8ff)
    else color.setHex(0xf0f6ff)
    colors.push(color.r, color.g, color.b)
  }

  const geometry = track(new THREE.BufferGeometry())
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = track(new THREE.PointsMaterial({
    size: props.compact ? 0.018 : 0.015,
    vertexColors: true,
    opacity: 0.44,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }))

  return new THREE.Points(geometry, material)
}

function updateScreenPositions() {
  if (!camera || !containerRef.value || !nodeGroup) return

  const rect = containerRef.value.getBoundingClientRect()
  const projected = agents.map((agent, index) => {
    const position = nodeWorldPositions[index].clone()
    nodeGroup!.localToWorld(position)
    position.project(camera!)

    return {
      name: agent.name,
      x: (position.x * 0.5 + 0.5) * rect.width,
      y: (-position.y * 0.5 + 0.5) * rect.height,
    }
  })

  nodeScreenPositions.value = projected
}

function resize() {
  if (!containerRef.value || !renderer || !camera) return

  const { width, height } = containerRef.value.getBoundingClientRect()
  const safeWidth = Math.max(1, width)
  const safeHeight = Math.max(1, height)
  camera.aspect = safeWidth / safeHeight
  camera.updateProjectionMatrix()
  renderer.setSize(safeWidth, safeHeight, false)
}

function animate(start = performance.now()) {
  if (!renderer || !scene || !camera || !coreGroup || !nodeGroup) return

  const now = performance.now()
  const elapsed = (now - start) / 1000

  pointer.lerp(targetPointer, 0.055)
  coreGroup.rotation.y = elapsed * 0.26 + pointer.x * 0.16
  coreGroup.rotation.x = Math.sin(elapsed * 0.38) * 0.12 + pointer.y * 0.12
  const breath = 1 + Math.sin(elapsed * 1.15) * 0.045
  coreGroup.scale.setScalar(breath)

  nodeGroup.rotation.z = elapsed * 0.045
  nodeGroup.rotation.y = Math.sin(elapsed * 0.28) * 0.16 + pointer.x * 0.12
  nodeGroup.position.x = pointer.x * 0.22
  nodeGroup.position.y = -pointer.y * 0.16

  if (particleField) {
    particleField.rotation.y = elapsed * 0.035
    particleField.rotation.x = Math.sin(elapsed * 0.2) * 0.08
  }

  flowDots.forEach((dot, index) => {
    const edge = dot.userData.edge as number
    const offset = dot.userData.offset as number
    const centerEdge = dot.userData.centerEdge as boolean
    const t = (elapsed * (0.18 + (index % 5) * 0.025) + offset) % 1
    const from = centerEdge ? new THREE.Vector3(0, 0, 0) : nodeWorldPositions[edge]
    const to = nodeWorldPositions[(edge + 1) % nodeWorldPositions.length]
    dot.position.copy(from).lerp(to, t)
    dot.scale.setScalar(0.75 + Math.sin(elapsed * 6 + index) * 0.22)
  })

  raycaster.setFromCamera(mouseNdc, camera)
  const hit = raycaster.intersectObjects(nodeMeshes, false)[0]
  activeAgent.value = hit?.object.userData.agentName ?? null

  camera.position.x += (pointer.x * 0.52 - camera.position.x) * 0.02
  camera.position.y += (-pointer.y * 0.36 - camera.position.y) * 0.02
  camera.lookAt(0, 0, 0)

  updateScreenPositions()
  renderer.render(scene, camera)
  frameId = requestAnimationFrame(() => animate(start))
}

function handlePointerMove(event: PointerEvent) {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  targetPointer.set((x - 0.5) * 2, (y - 0.5) * 2)
  mouseNdc.set(x * 2 - 1, -(y * 2 - 1))
}

function handlePointerLeave() {
  targetPointer.set(0, 0)
  mouseNdc.set(99, 99)
  activeAgent.value = null
}

function initScene() {
  try {
    const container = containerRef.value
    if (!container) return

    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a1a35, 0.05)

    const { width, height } = container.getBoundingClientRect()
    camera = new THREE.PerspectiveCamera(42, Math.max(1, width) / Math.max(1, height), 0.1, 100)
    camera.position.set(0, 0, props.compact ? 8.2 : 7.4)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, props.compact ? 1.3 : 1.75))
    renderer.setSize(Math.max(1, width), Math.max(1, height), false)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    particleField = createParticleField()
    coreGroup = createCore()
    nodeGroup = createAgentNetwork()
    scene.add(particleField, coreGroup, nodeGroup)

    const ambient = new THREE.AmbientLight(0xb8d8ff, 0.4)
    const blueLight = new THREE.PointLight(0x78bfff, 2.2, 12)
    blueLight.position.set(-2.8, 2.2, 3)
    const violetLight = new THREE.PointLight(0x9bbff0, 1.6, 10)
    violetLight.position.set(3.2, -1.5, 2.4)
    scene.add(ambient, blueLight, violetLight)

    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)

    animate()
  } catch (err) {
    console.warn('AgentGeometryScene: WebGL initialization failed, using fallback', err)
    if (renderer) {
      try { renderer.dispose() } catch {}
      renderer = null
    }
  }
}

function cleanup() {
  cancelAnimationFrame(frameId)

  const container = containerRef.value
  container?.removeEventListener('pointermove', handlePointerMove)
  container?.removeEventListener('pointerleave', handlePointerLeave)
  resizeObserver?.disconnect()
  resizeObserver = null

  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  disposables.forEach((resource) => resource.dispose())
  disposables = []
  flowDots = []
  nodeMeshes = []
  nodeWorldPositions.length = 0
  renderer = null
  scene = null
  camera = null
  coreGroup = null
  nodeGroup = null
  particleField = null
}

onMounted(initScene)
onBeforeUnmount(cleanup)
</script>

<template>
  <section :class="rootClass" aria-label="多智能体几何核心">
    <div ref="containerRef" class="scene-canvas" />

    <div v-if="showCopy !== false" class="scene-hud" aria-hidden="true">
      <span>PROFILE TO PATH</span>
      <span>TRACE VERIFIED</span>
      <span>ORCHESTRATED LOOP</span>
    </div>

    <button
      v-for="(agent, index) in agents"
      :key="agent.name"
      class="agent-label"
      type="button"
      :style="{
        transform: `translate(${nodeScreenPositions[index]?.x ?? 0}px, ${nodeScreenPositions[index]?.y ?? 0}px) translate(-50%, -50%)`,
      }"
      @mouseenter="activeAgent = agent.name"
      @focus="activeAgent = agent.name"
    >
      <i />
      <span>{{ agent.short }}</span>
    </button>

    <div class="agent-tooltip" :class="{ visible: activeAgent }">
      {{ activeAgent ?? 'Agent Orchestrator' }}
    </div>

    <div v-if="showCopy !== false" class="scene-copy">
      <p>Dynamic Agent Geometry</p>
      <h2>学习智能体生命体</h2>
      <span>
        混沌输入在协作网络中被组织成画像、资源、路径、辅导、评估与反馈重规划。
      </span>
    </div>
  </section>
</template>

<style scoped>
.agent-scene {
  position: relative;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  border-radius: 0;
}

.scene-canvas {
  position: absolute;
  inset: 0;
}

.scene-canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.agent-scene::before,
.agent-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.agent-scene::before {
  background:
    radial-gradient(circle at 48% 46%, rgba(120, 184, 255, 0.12), transparent 30%),
    radial-gradient(circle at 62% 54%, rgba(184, 216, 255, 0.09), transparent 35%),
    linear-gradient(90deg, rgba(10, 26, 53, 0.25), transparent 40%, rgba(10, 26, 53, 0.08));
  mix-blend-mode: screen;
}

.agent-scene::after {
  opacity: 0.12;
  background-image:
    linear-gradient(rgba(150, 200, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150, 200, 255, 0.06) 1px, transparent 1px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 4px);
  background-size: 74px 74px, 74px 74px, 100% 4px;
  mask-image: radial-gradient(circle at 52% 48%, #000 0 56%, transparent 78%);
}

.scene-hud {
  position: absolute;
  left: clamp(24px, 4vw, 64px);
  top: clamp(24px, 5vh, 62px);
  display: grid;
  gap: 10px;
  color: rgba(226, 245, 255, 0.36);
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  animation: fade-rise 900ms cubic-bezier(0.19, 1, 0.22, 1) both;
}

.agent-label {
  position: absolute;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(125, 211, 252, 0.12);
  border-radius: 999px;
  padding: 5px 8px;
  color: rgba(226, 245, 255, 0.56);
  background: rgba(2, 8, 23, 0.22);
  font-size: 10px;
  letter-spacing: 0.06em;
  pointer-events: auto;
  cursor: default;
  opacity: 0.58;
  backdrop-filter: blur(8px);
  transition:
    opacity 360ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 360ms cubic-bezier(0.16, 1, 0.3, 1),
    background 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.agent-label:hover,
.agent-label:focus-visible {
  opacity: 1;
  border-color: rgba(103, 232, 249, 0.55);
  background: rgba(2, 8, 23, 0.46);
  outline: none;
}

.agent-label i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #67e8f9;
  box-shadow: 0 0 12px rgba(103, 232, 249, 0.9);
}

.agent-tooltip {
  position: absolute;
  right: clamp(26px, 4vw, 62px);
  top: clamp(28px, 5vh, 70px);
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 14px;
  padding: 12px 14px;
  color: #e0f8ff;
  background: rgba(2, 8, 23, 0.42);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 180ms ease, transform 180ms ease;
  backdrop-filter: blur(14px);
}

.agent-tooltip.visible {
  opacity: 1;
  transform: translateY(0);
}

.scene-copy {
  position: absolute;
  left: clamp(24px, 4vw, 64px);
  bottom: clamp(28px, 7vh, 72px);
  max-width: 390px;
  animation: fade-rise 900ms cubic-bezier(0.19, 1, 0.22, 1) 120ms both;
}

.scene-copy p {
  margin: 0 0 14px;
  color: #67e8f9;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.scene-copy h2 {
  margin: 0;
  color: #f4fbff;
  font-size: clamp(34px, 5vw, 72px);
  line-height: 0.98;
  letter-spacing: 0.03em;
}

.scene-copy span {
  display: block;
  max-width: 340px;
  margin-top: 18px;
  color: rgba(201, 222, 237, 0.72);
  font-size: 14px;
  line-height: 1.9;
}

@keyframes fade-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: none;
    filter: blur(0);
  }
}

@media (max-width: 900px) {
  .agent-scene {
    min-height: 100svh;
    height: 100svh;
  }

  .agent-scene.compact .agent-label,
  .agent-scene.compact .agent-tooltip {
    display: none;
  }

  .scene-copy {
    max-width: 320px;
  }

  .scene-copy h2 {
    font-size: clamp(30px, 9vw, 48px);
  }
}
</style>
