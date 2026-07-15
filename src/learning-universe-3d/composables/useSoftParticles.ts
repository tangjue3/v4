import * as THREE from 'three'

const vertShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 color;

  varying vec3 vColor;

  uniform float uSize;
  uniform float uTime;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
  }
`

const fragShader = /* glsl */ `
  varying vec3 vColor;

  uniform float uOpacity;
  uniform float uTime;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // Multi-layer soft glow
    float core = exp(-d * d * 6.0);
    float glow = exp(-d * d * 1.8) * 0.25;
    float alpha = core + glow;
    if (alpha < 0.015) discard;
    // Subtle time-based pulse: each particle area varies brightness slightly
    float pulse = 0.85 + 0.15 * sin(uTime * 2.5 + gl_PointCoord.x * 10.0 + gl_PointCoord.y * 7.0);
    gl_FragColor = vec4(vColor * pulse, alpha * uOpacity);
  }
`

export function createSoftParticleMaterial(
  size: number,
  opacity: number,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSize: { value: size },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
    },
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

export function createSoftParticleGeometry(
  positions: Float32Array,
  colors: Float32Array,
  sizes: Float32Array,
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  return geo
}
