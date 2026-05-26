import * as THREE from 'three'
import type { Galaxy } from '../types'

export interface PlanetLayout {
  courseId: number
  position: THREE.Vector3
  armIndex: number
  galaxyId: string
}

interface SpiralArm {
  startAngle: number
  galaxyId: string
  color: string
  planetIds: number[]
}

export function useSpiralLayout(galaxies: Galaxy[]) {
  const angleStep = (Math.PI * 2) / 5

  const arms: SpiralArm[] = [
    { startAngle: angleStep * 0, galaxyId: 'programming', color: '#4FC3F7', planetIds: galaxies.find(g => g.id === 'programming')?.planetIds || [] },
    { startAngle: angleStep * 1, galaxyId: 'systems',     color: '#81C784', planetIds: galaxies.find(g => g.id === 'systems')?.planetIds || [] },
    { startAngle: angleStep * 2, galaxyId: 'software',    color: '#FFB74D', planetIds: galaxies.find(g => g.id === 'software')?.planetIds || [] },
    { startAngle: angleStep * 3, galaxyId: 'ai',          color: '#BA68C8', planetIds: galaxies.find(g => g.id === 'ai')?.planetIds || [] },
    { startAngle: angleStep * 4, galaxyId: 'frontier',    color: '#E57373', planetIds: galaxies.find(g => g.id === 'frontier')?.planetIds || [] },
  ]

  // Spiral: r(θ) = a * e^(b * θ)
  const a = 8.0
  const b = 0.28
  const rEnd = 32

  const thetaTotal = Math.log(rEnd / a) / b

  function computePlanetPositions(): PlanetLayout[] {
    const layouts: PlanetLayout[] = []

    for (const arm of arms) {
      const count = arm.planetIds.length
      const thetaStep = count > 1 ? thetaTotal / (count - 1) : 0

      arm.planetIds.forEach((courseId, index) => {
        const relativeTheta = index * thetaStep
        const theta = arm.startAngle + relativeTheta
        const r = a * Math.exp(b * relativeTheta)

        // Planet sits exactly on the XZ spiral
        const x = Math.cos(theta) * r
        const z = Math.sin(theta) * r

        layouts.push({
          courseId,
          position: new THREE.Vector3(x, 0, z),
          armIndex: arms.indexOf(arm),
          galaxyId: arm.galaxyId,
        })
      })
    }

    return layouts
  }

  function generateArmParticles(armIndex: number, particleCount = 1000, scatterMult = 1.0): {
    positions: Float32Array
    colors: Float32Array
    sizes: Float32Array
  } {
    const arm = arms[armIndex]
    if (!arm) return { positions: new Float32Array(0), colors: new Float32Array(0), sizes: new Float32Array(0) }

    const count = arm.planetIds.length
    const thetaMax = count > 1 ? thetaTotal + 1.5 : 2.0
    const maxR = a * Math.exp(b * thetaMax)

    const positions = new Float32Array(particleCount * 3)
    const colorsArr = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const baseColor = new THREE.Color(arm.color)

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random()
      const relativeTheta = t * thetaMax
      const theta = arm.startAngle + relativeTheta
      const r = a * Math.exp(b * relativeTheta)

      const perpAngle = theta + Math.PI / 2
      const scatterMag = 1.2 * scatterMult * (1 - r / maxR * 0.3)
      const scatterX = (Math.random() - 0.5) * scatterMag
      const scatterZ = (Math.random() - 0.5) * scatterMag
      const scatterY = (Math.random() - 0.5) * 0.6 * scatterMult * (1 - r / maxR * 0.4)

      positions[i * 3] = Math.cos(theta) * r + Math.cos(perpAngle) * scatterX
      positions[i * 3 + 1] = scatterY
      positions[i * 3 + 2] = Math.sin(theta) * r + Math.sin(perpAngle) * scatterZ

      const brightness = 0.35 + 0.65 * (1 - t)
      colorsArr[i * 3] = baseColor.r * brightness
      colorsArr[i * 3 + 1] = baseColor.g * brightness
      colorsArr[i * 3 + 2] = baseColor.b * brightness

      sizes[i] = 0.03 + Math.random() * 0.07 * brightness
    }

    return { positions, colors: colorsArr, sizes }
  }

  return { arms, computePlanetPositions, generateArmParticles }
}
