import * as THREE from 'three'
import type { Galaxy } from '../types'
import { useSpiralLayout } from './useSpiralLayout'
import { createSoftParticleMaterial, createSoftParticleGeometry } from './useSoftParticles'

interface ArmStyle {
  coreCount: number
  haloCount: number
  sparkCount: number
  dustCount: number
  coreSize: number
  haloSize: number
  sparkSize: number
  dustSize: number
  opacity: number
}

export function useLearningPath(parent: THREE.Group, galaxies: Galaxy[]) {
  const armGroup = new THREE.Group()
  armGroup.name = 'spiral-arms'
  parent.add(armGroup)

  const spiral = useSpiralLayout(galaxies)
  const particleMaterials: THREE.ShaderMaterial[] = []

  const armStyles: ArmStyle[] = [
    { coreCount: 6000, haloCount: 4000, sparkCount: 600, dustCount: 8000, coreSize: 0.06, haloSize: 0.14, sparkSize: 0.16, dustSize: 0.03, opacity: 0.65 },
    { coreCount: 5000, haloCount: 3500, sparkCount: 500, dustCount: 7000, coreSize: 0.07, haloSize: 0.16, sparkSize: 0.18, dustSize: 0.035, opacity: 0.60 },
    { coreCount: 4000, haloCount: 3000, sparkCount: 450, dustCount: 6000, coreSize: 0.08, haloSize: 0.18, sparkSize: 0.20, dustSize: 0.04, opacity: 0.55 },
    { coreCount: 7000, haloCount: 4500, sparkCount: 700, dustCount: 9000, coreSize: 0.055, haloSize: 0.12, sparkSize: 0.15, dustSize: 0.028, opacity: 0.68 },
    { coreCount: 5500, haloCount: 3800, sparkCount: 550, dustCount: 7500, coreSize: 0.065, haloSize: 0.15, sparkSize: 0.17, dustSize: 0.032, opacity: 0.62 },
  ]

  function createArmParticles(armIndex: number, style: ArmStyle) {
    const arm = spiral.arms[armIndex]
    if (!arm) return

    const baseColor = new THREE.Color(arm.color)

    function varyColor(base: THREE.Color, variance: number): THREE.Color {
      const hsl: { h: number; s: number; l: number } = {} as any
      base.getHSL(hsl)
      const h = Math.max(0, Math.min(1, hsl.h + (Math.random() - 0.5) * variance))
      const s = Math.min(1, hsl.s + (Math.random() - 0.5) * 0.2)
      const l = Math.min(1, Math.max(0.1, hsl.l + (Math.random() - 0.5) * 0.3))
      return new THREE.Color().setHSL(h, s, l)
    }

    // Core: bright backbone, moderately spread
    const core = spiral.generateArmParticles(armIndex, style.coreCount, 0.5)
    for (let i = 0; i < style.coreCount; i++) {
      core.sizes[i] = style.coreSize * (0.4 + Math.random() * 1.2)
    }
    const coreGeo = createSoftParticleGeometry(core.positions, core.colors, core.sizes)
    const coreMat = createSoftParticleMaterial(style.coreSize * 2.2, style.opacity)
    particleMaterials.push(coreMat)
    armGroup.add(new THREE.Points(coreGeo, coreMat))

    // Halo: wide soft glow, adds thickness
    const halo = spiral.generateArmParticles(armIndex, style.haloCount, 1.0)
    for (let i = 0; i < style.haloCount; i++) {
      halo.sizes[i] = style.haloSize * (0.3 + Math.random() * 1.4)
      halo.colors[i * 3] = baseColor.r * 0.2 + Math.random() * 0.08
      halo.colors[i * 3 + 1] = baseColor.g * 0.2 + Math.random() * 0.08
      halo.colors[i * 3 + 2] = baseColor.b * 0.2 + Math.random() * 0.08
    }
    const haloGeo = createSoftParticleGeometry(halo.positions, halo.colors, halo.sizes)
    const haloMat = createSoftParticleMaterial(style.haloSize * 1.8, style.opacity * 0.28)
    particleMaterials.push(haloMat)
    armGroup.add(new THREE.Points(haloGeo, haloMat))

    // Sparkles: bright dots scattered through the track
    const spark = spiral.generateArmParticles(armIndex, style.sparkCount, 0.45)
    for (let i = 0; i < style.sparkCount; i++) {
      spark.sizes[i] = style.sparkSize * (0.4 + Math.random() * 2.0)
      const color = varyColor(baseColor, 0.2)
      spark.colors[i * 3] = color.r
      spark.colors[i * 3 + 1] = color.g
      spark.colors[i * 3 + 2] = color.b
    }
    const sparkGeo = createSoftParticleGeometry(spark.positions, spark.colors, spark.sizes)
    const sparkMat = createSoftParticleMaterial(style.sparkSize * 2.8, style.opacity * 0.9)
    particleMaterials.push(sparkMat)
    armGroup.add(new THREE.Points(sparkGeo, sparkMat))

    // Micro-dust: wide volume fill, creates the thick-line look from distance
    const dust = spiral.generateArmParticles(armIndex, style.dustCount, 1.5)
    for (let i = 0; i < style.dustCount; i++) {
      dust.sizes[i] = style.dustSize * (0.3 + Math.random() * 1.4)
      const color = varyColor(baseColor, 0.3)
      dust.colors[i * 3] = color.r * 0.5 + Math.random() * 0.12
      dust.colors[i * 3 + 1] = color.g * 0.5 + Math.random() * 0.12
      dust.colors[i * 3 + 2] = color.b * 0.5 + Math.random() * 0.12
    }
    const dustGeo = createSoftParticleGeometry(dust.positions, dust.colors, dust.sizes)
    const dustMat = createSoftParticleMaterial(style.dustSize * 2.2, style.opacity * 0.32)
    particleMaterials.push(dustMat)
    armGroup.add(new THREE.Points(dustGeo, dustMat))
  }

  for (let i = 0; i < 5; i++) {
    createArmParticles(i, armStyles[i])
  }

  return { armGroup, spiral, particleMaterials }
}
