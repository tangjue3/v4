import * as THREE from 'three'
import { createSoftParticleMaterial, createSoftParticleGeometry } from './useSoftParticles'

function createNebulaTexture(color1: string, color2: string): THREE.Texture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Base gradient
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  bgGrad.addColorStop(0, color1)
  bgGrad.addColorStop(0.4, color2)
  bgGrad.addColorStop(0.7, 'rgba(10, 5, 30, 0.3)')
  bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, size, size)

  // Add irregular blobs for cloud-like appearance
  for (let i = 0; i < 8; i++) {
    const cx = size * (0.2 + Math.random() * 0.6)
    const cy = size * (0.2 + Math.random() * 0.6)
    const r = size * (0.1 + Math.random() * 0.25)
    const blobGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    const alpha = 0.08 + Math.random() * 0.15
    blobGrad.addColorStop(0, `rgba(80, 60, 180, ${alpha})`)
    blobGrad.addColorStop(0.5, `rgba(40, 20, 120, ${alpha * 0.5})`)
    blobGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = blobGrad
    ctx.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

interface NebulaDef {
  position: THREE.Vector3
  scale: number
  texture: THREE.Texture
  opacity: number
}

export function useNebula(scene: THREE.Scene) {
  const nebulaGroup = new THREE.Group()
  nebulaGroup.name = 'nebulas'
  scene.add(nebulaGroup)

  // Generate a few distinct nebula textures
  const textures = [
    createNebulaTexture('rgba(40, 20, 100, 0.25)', 'rgba(80, 40, 160, 0.15)'),
    createNebulaTexture('rgba(20, 40, 100, 0.25)', 'rgba(30, 60, 140, 0.15)'),
    createNebulaTexture('rgba(60, 20, 80, 0.2)', 'rgba(100, 30, 120, 0.12)'),
    createNebulaTexture('rgba(30, 30, 90, 0.22)', 'rgba(50, 50, 130, 0.14)'),
  ]

  const nebulaDefs: NebulaDef[] = [
    { position: new THREE.Vector3(25, 8, -30), scale: 18, texture: textures[0], opacity: 0.35 },
    { position: new THREE.Vector3(-30, -5, -20), scale: 22, texture: textures[1], opacity: 0.3 },
    { position: new THREE.Vector3(-15, 10, 25), scale: 16, texture: textures[2], opacity: 0.28 },
    { position: new THREE.Vector3(20, -8, 20), scale: 20, texture: textures[3], opacity: 0.32 },
    { position: new THREE.Vector3(-25, 3, -35), scale: 14, texture: textures[0], opacity: 0.25 },
    { position: new THREE.Vector3(10, -12, -25), scale: 16, texture: textures[2], opacity: 0.3 },
    { position: new THREE.Vector3(-10, -6, 35), scale: 18, texture: textures[1], opacity: 0.27 },
    { position: new THREE.Vector3(30, 12, 10), scale: 15, texture: textures[3], opacity: 0.22 },
  ]

  const nebulaSprites: THREE.Sprite[] = []

  for (const def of nebulaDefs) {
    const material = new THREE.SpriteMaterial({
      map: def.texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: def.opacity,
    })
    const sprite = new THREE.Sprite(material)
    sprite.position.copy(def.position)
    sprite.scale.set(def.scale, def.scale, 1)
    nebulaGroup.add(sprite)
    nebulaSprites.push(sprite)
  }

  // --- Cosmic dust particles ---
  const dustCount = 600
  const dustPositions = new Float32Array(dustCount * 3)
  const dustColors = new Float32Array(dustCount * 3)
  const dustSizes = new Float32Array(dustCount)
  const dustData: { velocity: THREE.Vector3; range: number }[] = []

  for (let i = 0; i < dustCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 8 + Math.random() * 45
    const height = (Math.random() - 0.5) * 12

    dustPositions[i * 3] = Math.cos(angle) * radius
    dustPositions[i * 3 + 1] = height
    dustPositions[i * 3 + 2] = Math.sin(angle) * radius

    const color = new THREE.Color()
    color.setHSL(0.55 + Math.random() * 0.2, 0.3, 0.25 + Math.random() * 0.35)
    dustColors[i * 3] = color.r
    dustColors[i * 3 + 1] = color.g
    dustColors[i * 3 + 2] = color.b

    dustSizes[i] = Math.random() * 1.5 + 0.3

    dustData.push({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.3,
      ),
      range: radius,
    })
  }

  const dustGeo = createSoftParticleGeometry(dustPositions, dustColors, dustSizes)
  const dustMat = createSoftParticleMaterial(0.07, 0.35)
  const dustPoints = new THREE.Points(dustGeo, dustMat)
  dustPoints.name = 'cosmic-dust'
  nebulaGroup.add(dustPoints)

  // Animation
  function update(delta: number, time: number) {
    // Subtle nebula drift and pulsation
    nebulaSprites.forEach((sprite, i) => {
      const def = nebulaDefs[i]
      const pulse = 1 + Math.sin(time * 0.5 + i) * 0.04
      sprite.scale.set(def.scale * pulse, def.scale * pulse, 1)
      sprite.material.opacity = def.opacity + Math.sin(time * 0.7 + i * 1.5) * 0.04
    })

    // Drift dust particles
    const posArr = dustGeo.attributes.position.array as Float32Array
    for (let i = 0; i < dustCount; i++) {
      const data = dustData[i]
      const idx = i * 3
      posArr[idx] += data.velocity.x * delta
      posArr[idx + 1] += data.velocity.y * delta
      posArr[idx + 2] += data.velocity.z * delta

      // Wrap around when too far
      const dist = Math.sqrt(
        posArr[idx] ** 2 + posArr[idx + 1] ** 2 + posArr[idx + 2] ** 2,
      )
      if (dist > data.range + 10 || dist < data.range - 10) {
        const angle = Math.random() * Math.PI * 2
        const height = (Math.random() - 0.5) * 12
        posArr[idx] = Math.cos(angle) * data.range
        posArr[idx + 1] = height
        posArr[idx + 2] = Math.sin(angle) * data.range
      }
    }
    dustGeo.attributes.position.needsUpdate = true
  }

  return { nebulaGroup, update }
}
