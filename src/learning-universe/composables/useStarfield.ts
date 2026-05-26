import * as THREE from 'three'

// Generate cross flare texture on canvas
function createCrossFlareTexture(): THREE.Texture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const half = size / 2

  // Main cross shape
  const gradientH = ctx.createLinearGradient(0, half, size, half)
  gradientH.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradientH.addColorStop(0.45, 'rgba(255, 255, 255, 0.05)')
  gradientH.addColorStop(0.5, 'rgba(255, 255, 255, 1)')
  gradientH.addColorStop(0.55, 'rgba(255, 255, 255, 0.05)')
  gradientH.addColorStop(1, 'rgba(255, 255, 255, 0)')

  const gradientV = ctx.createLinearGradient(0, 0, 0, size)
  gradientV.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradientV.addColorStop(0.45, 'rgba(255, 255, 255, 0.05)')
  gradientV.addColorStop(0.5, 'rgba(255, 255, 255, 1)')
  gradientV.addColorStop(0.55, 'rgba(255, 255, 255, 0.05)')
  gradientV.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradientH
  ctx.fillRect(0, half - 1, size, 2)
  ctx.fillStyle = gradientV
  ctx.fillRect(half - 1, 0, 2, size)

  // Center glow
  const glow = ctx.createRadialGradient(half, half, 0, half, half, half * 0.3)
  glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
  glow.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)')
  glow.addColorStop(0.4, 'rgba(200, 220, 255, 0.3)')
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Vertex shader for stars with GPU twinkling
const starVertexShader = /* glsl */ `
  attribute float phase;
  attribute float speed;
  attribute float baseSize;
  attribute vec3 color;

  varying vec3 vColor;
  varying float vAlpha;

  uniform float uTime;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 0.6 + 0.4 * sin(uTime * speed + phase);
    // Add secondary frequency for more natural twinkling
    twinkle += 0.15 * sin(uTime * speed * 1.7 + phase + 1.3);
    twinkle = clamp(twinkle, 0.2, 1.1);

    gl_PointSize = baseSize * twinkle * (220.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
    vAlpha = 0.6 + 0.4 * twinkle;
  }
`

const starFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // Soft circular point with glow
    float core = exp(-d * d * 8.0);
    float glow = exp(-d * d * 2.5) * 0.3;
    float alpha = core + glow;
    if (alpha < 0.015) discard;
    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`

function milkyWayPhi(): number {
  // Concentrate stars near the XZ equatorial plane with spread
  const r = Math.random()
  if (r < 0.75) {
    // Band stars: concentrated near equator
    const spread = 0.35
    return Math.PI / 2 + (Math.random() - 0.5) * spread
  } else if (r < 0.95) {
    // Halo stars: wider but still somewhat concentrated
    return Math.acos(2 * Math.random() - 1) * 0.7 + Math.PI * 0.15
  } else {
    // Scattered: uniform on sphere
    return Math.acos(2 * Math.random() - 1)
  }
}

interface StarLayer {
  points: THREE.Points
  material: THREE.ShaderMaterial
}

export function useStarfield(scene: THREE.Scene) {
  const group = new THREE.Group()
  group.name = 'starfield'
  scene.add(group)

  const layers: StarLayer[] = []
  const brightStars: THREE.Sprite[] = []
  const crossTexture = createCrossFlareTexture()

  // Layer definitions
  const layerDefs = [
    { count: 600, minR: 35, maxR: 55, baseSize: 0.22, opacity: 0.9 },
    { count: 1200, minR: 55, maxR: 90, baseSize: 0.15, opacity: 0.75 },
    { count: 800, minR: 85, maxR: 140, baseSize: 0.10, opacity: 0.55 },
  ]

  for (const def of layerDefs) {
    const count = def.count
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const baseSizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = milkyWayPhi()
      const radius = def.minR + Math.random() * (def.maxR - def.minR)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      // Star color temperature
      const colorRand = Math.random()
      const color = new THREE.Color()
      if (colorRand < 0.08) {
        // Warm orange/red
        color.setHSL(0.1 + Math.random() * 0.05, 0.5, 0.7 + Math.random() * 0.3)
      } else if (colorRand < 0.25) {
        // Hot blue-white
        color.setHSL(0.58 + Math.random() * 0.08, 0.2, 0.8 + Math.random() * 0.2)
      } else {
        // White to cool white
        color.setHSL(0.55 + Math.random() * 0.12, 0.1 + Math.random() * 0.15, 0.65 + Math.random() * 0.35)
      }
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = 1.5 + Math.random() * 5.0
      baseSizes[i] = def.baseSize * (0.4 + Math.random() * 1.6)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))
    geometry.setAttribute('baseSize', new THREE.BufferAttribute(baseSizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    points.name = `stars-${def.minR}`
    group.add(points)
    layers.push({ points, material })
  }

  // Bright stars with cross flares (subset of ~40 stars)
  const brightCount = 40
  for (let i = 0; i < brightCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = milkyWayPhi()
    const radius = 40 + Math.random() * 120

    const spriteMat = new THREE.SpriteMaterial({
      map: crossTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.3 + Math.random() * 0.5,
      color: new THREE.Color().setHSL(
        Math.random() < 0.2 ? 0.12 : 0.58 + Math.random() * 0.1,
        0.2,
        0.7 + Math.random() * 0.3,
      ),
    })

    const sprite = new THREE.Sprite(spriteMat)
    sprite.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    )
    const s = 0.4 + Math.random() * 1.2
    sprite.scale.set(s, s, 1)
    sprite.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 1.0 + Math.random() * 3.0,
      baseScale: s,
    }
    group.add(sprite)
    brightStars.push(sprite)
  }

  // Animation update
  function update(time: number) {
    for (const layer of layers) {
      layer.material.uniforms.uTime.value = time
    }

    for (const sprite of brightStars) {
      const { phase, speed, baseScale } = sprite.userData
      const twinkle = 0.5 + 0.5 * Math.sin(time * speed + phase)
      const s = baseScale * (0.7 + twinkle * 0.6)
      sprite.scale.set(s, s, 1)
      sprite.material.opacity = 0.2 + twinkle * 0.5
    }
  }

  return { group, update }
}
