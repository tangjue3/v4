import * as THREE from 'three'

const PARTICLE_COUNT = 1500

interface Particle {
  queueT: number       // position in queue (0-1), assigned at creation
  radius: number       // distance from curve center
  angle: number        // angle around the curve
  size: number         // base particle size
  speed: number        // flow speed (used after reveal)
}

// Soft round particle vertex shader
const particleVert = `
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
attribute float aPhase;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (320.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`

const particleFrag = `
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  if (dist > 0.5) discard;

  // Bright core + soft glow halo
  float core = exp(-dist * 10.0);
  float glow = exp(-dist * 3.0) * 0.9;
  float alpha = (core + glow) * vAlpha;

  // Center brightness boost
  float brightness = 0.6 + core * 0.5 + glow * 0.2;

  gl_FragColor = vec4(vColor * brightness, alpha);
}
`

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function buildCurveLookup(curve: THREE.CatmullRomCurve3, samples = 200): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= samples; i++) {
    pts.push(curve.getPoint(i / samples))
  }
  return pts
}

function getCurvePoint(lookup: THREE.Vector3[], t: number): THREE.Vector3 {
  const idx = t * (lookup.length - 1)
  const i0 = Math.floor(idx)
  const i1 = Math.min(i0 + 1, lookup.length - 1)
  const frac = idx - i0
  const p0 = lookup[i0]
  const p1 = lookup[i1]
  return new THREE.Vector3().lerpVectors(p0, p1, frac)
}

function getCurveTangent(lookup: THREE.Vector3[], t: number): THREE.Vector3 {
  const dt = 0.005
  const a = getCurvePoint(lookup, Math.max(0, t - dt))
  const b = getCurvePoint(lookup, Math.min(1, t + dt))
  return new THREE.Vector3().subVectors(b, a).normalize()
}

// ─── Label highlighting ───

const LABEL_DEFAULT_STYLE = {
  color: '#ffffff',
  textShadow: '0 0 10px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.8)',
  background: 'rgba(0,0,0,0.4)',
  fontWeight: 'bold',
}

const LABEL_HIGHLIGHT_STYLE = {
  color: '#FFD700',
  textShadow: '0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2)',
  background: 'rgba(255,215,0,0.12)',
  fontWeight: 'bold',
}

function getLabelEl(mesh: THREE.Object3D): HTMLElement | null {
  for (const child of mesh.children) {
    if (child.name === 'planet-label' && 'element' in child) {
      return (child as unknown as { element: HTMLElement }).element
    }
  }
  return null
}

function applyLabelStyle(el: HTMLElement, style: typeof LABEL_DEFAULT_STYLE) {
  el.style.color = style.color
  el.style.textShadow = style.textShadow
  el.style.background = style.background
  el.style.fontWeight = style.fontWeight
}

export function usePathLines(parentGroup: THREE.Group) {
  const group = new THREE.Group()
  group.name = 'path-lines'
  parentGroup.add(group)

  let particleData: Particle[] = []
  let geometry: THREE.BufferGeometry | null = null
  let pointsMesh: THREE.Points | null = null
  let curveLookup: THREE.Vector3[] = []
  let animProgress = 0
  let animating = false
  let flowPhase = 0
  let _planetMeshes: Map<number, THREE.Object3D> = new Map()
  // Pre-computed t value (0-1 along curve) for each planet in the path
  let _planetTValues: Map<number, number> = new Map()
  // Track which planets have been label-highlighted
  let _highlightedPlanets: Set<number> = new Set()

  function updatePath(planetMeshes: Map<number, THREE.Object3D>, courseIds: number[]) {
    disposeCurrent()
    if (courseIds.length < 2) return

    _planetMeshes = planetMeshes

    // Reset all path planet labels to default (they'll highlight progressively)
    const pathIdSet = new Set(courseIds)
    planetMeshes.forEach((mesh, id) => {
      const el = getLabelEl(mesh)
      if (!el) return
      applyLabelStyle(el, pathIdSet.has(id) ? LABEL_DEFAULT_STYLE : LABEL_DEFAULT_STYLE)
    })

    // Pre-compute each planet's t-value along the curve
    _planetTValues.clear()
    _highlightedPlanets.clear()
    courseIds.forEach((id, index) => {
      _planetTValues.set(id, courseIds.length > 1 ? index / (courseIds.length - 1) : 0)
    })

    // Collect exact planet center positions
    const pts: THREE.Vector3[] = []
    for (const id of courseIds) {
      const mesh = planetMeshes.get(id)
      if (mesh) pts.push(mesh.position.clone())
    }
    if (pts.length < 2) return

    const curve = new THREE.CatmullRomCurve3(pts)
    curveLookup = buildCurveLookup(curve)

    // Initialize particles with random queue positions
    particleData = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const queueT = Math.random()
      // Cluster more near center axis for a defined beam look
      const radius = Math.pow(Math.random(), 2.0) * 0.3
      const angle = Math.random() * Math.PI * 2
      const size = 0.25 + Math.random() * 0.35
      const speed = 0.02 + Math.random() * 0.03
      particleData.push({ queueT, radius, angle, size, speed })
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const alphas = new Float32Array(PARTICLE_COUNT)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const phases = new Float32Array(PARTICLE_COUNT)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    pointsMesh = new THREE.Points(geometry, mat)
    group.add(pointsMesh)

    // Start reveal animation
    animProgress = 0
    animating = true
    flowPhase = 0

    // First frame
    updateParticlePositions()
  }

  function updateParticlePositions() {
    if (!geometry || !pointsMesh) return

    const pos = geometry.attributes.position.array as Float32Array
    const sizes = geometry.attributes.aSize.array as Float32Array
    const alphas = geometry.attributes.aAlpha.array as Float32Array
    const colors = geometry.attributes.aColor.array as Float32Array

    const coreColor = new THREE.Color(1.0, 0.97, 0.85)   // warm white core
    const midColor = new THREE.Color(1.0, 0.75, 0.25)     // gold
    const edgeColor = new THREE.Color(1.0, 0.4, 0.1)      // orange edge

    for (let i = 0; i < particleData.length; i++) {
      const p = particleData[i]

      // During reveal: only show particles whose queueT <= animProgress
      // After reveal: particles flow freely
      let displayT: number
      let isVisible: boolean

      if (animating) {
        // Reveal phase: beam extends from first planet to last
        if (p.queueT <= animProgress) {
          displayT = p.queueT
          isVisible = true
        } else {
          isVisible = false
          displayT = 0
        }
      } else {
        // Flow phase: particles flow continuously along the path
        const flowT = (p.queueT + flowPhase * p.speed) % 1
        displayT = flowT
        isVisible = true
      }

      if (!isVisible) {
        alphas[i] = 0
        sizes[i] = 0
        continue
      }

      const basePos = getCurvePoint(curveLookup, displayT)
      const tangent = getCurveTangent(curveLookup, displayT)

      // Perpendicular offsets for beam thickness
      const up = new THREE.Vector3(0, 1, 0)
      if (Math.abs(tangent.dot(up)) > 0.9) up.set(1, 0, 0)
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize()
      const localUp = new THREE.Vector3().crossVectors(right, tangent).normalize()

      const cosA = Math.cos(p.angle)
      const sinA = Math.sin(p.angle)
      const r = p.radius

      pos[i * 3] = basePos.x + (right.x * cosA + localUp.x * sinA) * r
      pos[i * 3 + 1] = basePos.y + (right.y * cosA + localUp.y * sinA) * r
      pos[i * 3 + 2] = basePos.z + (right.z * cosA + localUp.z * sinA) * r

      // Size: larger at core, smaller at edges
      const normR = Math.min(1, r / 0.3)
      sizes[i] = p.size * (1.3 - normR * 0.6)

      // End fade: fade at both ends of the visible beam
      let endFade: number
      if (animating) {
        // During reveal: fade at the front tip
        const tipDist = 1 - smoothstep(animProgress - 0.08, animProgress, displayT)
        endFade = smoothstep(0, 0.04, displayT) * tipDist
      } else {
        // During flow: fade at both physical ends
        endFade = smoothstep(0, 0.04, displayT) * (1 - smoothstep(0.96, 1.0, displayT))
      }

      // Color gradient: core → mid → edge
      const color = new THREE.Color().lerpColors(coreColor, midColor, Math.pow(normR, 0.5))
      if (normR > 0.5) {
        color.lerp(edgeColor, (normR - 0.5) * 2 * 0.5)
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Alpha: brighter at center, softer at edges
      const centerBias = 1 - Math.pow(normR, 4)
      alphas[i] = endFade * (0.6 + centerBias * 0.4)

      // Extra brightness at the reveal front tip
      if (animating) {
          const frontGlow = smoothstep(animProgress - 0.06, animProgress, displayT)
        alphas[i] *= (1 + frontGlow * 0.6)
        sizes[i] *= (1 + frontGlow * 0.4)
      }
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.aSize.needsUpdate = true
    geometry.attributes.aAlpha.needsUpdate = true
    geometry.attributes.aColor.needsUpdate = true
  }

  function updateLabelsForProgress() {
    const progress = animating ? animProgress : 1
    _planetTValues.forEach((tValue, courseId) => {
      if (tValue <= progress && !_highlightedPlanets.has(courseId)) {
        // Highlight this planet's label
        const mesh = _planetMeshes.get(courseId)
        if (mesh) {
          const el = getLabelEl(mesh)
          if (el) applyLabelStyle(el, LABEL_HIGHLIGHT_STYLE)
        }
        _highlightedPlanets.add(courseId)
      }
    })
  }

  function updateAnimation(delta: number) {
    if (!geometry || !pointsMesh) return

    if (animating) {
      animProgress += delta * 0.18
      if (animProgress >= 1) {
        animProgress = 1
        animating = false
      }
      updateLabelsForProgress()
    } else {
      // Flow phase: advance flow phase
      flowPhase += delta
    }

    updateParticlePositions()
  }

  function clearPath() {
    disposeCurrent()
  }

  function disposeCurrent() {
    if (pointsMesh && pointsMesh.parent) {
      group.remove(pointsMesh)
    }
    if (geometry) {
      geometry.dispose()
      geometry = null
    }
    if (pointsMesh) {
      ;(pointsMesh.material as THREE.Material).dispose()
      pointsMesh = null
    }

    // Reset all labels to default
    _planetMeshes.forEach((mesh) => {
      const el = getLabelEl(mesh)
      if (el) applyLabelStyle(el, LABEL_DEFAULT_STYLE)
    })

    particleData = []
    curveLookup = []
    animProgress = 0
    animating = false
    flowPhase = 0
    _planetTValues.clear()
    _highlightedPlanets.clear()
  }

  function dispose() {
    disposeCurrent()
    parentGroup.remove(group)
  }

  return { updatePath, updateAnimation, clearPath, dispose }
}
