<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  compact?: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_compact;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.82, -0.57, 0.57, 0.82);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.05 + vec2(1.7, 3.1);
    a *= 0.52;
  }
  return v;
}

vec3 palette(float t) {
  vec3 deepNavy = vec3(0.04, 0.08, 0.16);
  vec3 royalBlue = vec3(0.08, 0.22, 0.45);
  vec3 steelBlue = vec3(0.22, 0.40, 0.65);
  vec3 skyBlue = vec3(0.45, 0.65, 0.85);
  vec3 paleBlue = vec3(0.65, 0.78, 0.92);
  vec3 cloudWhite = vec3(0.88, 0.92, 0.98);
  vec3 band = mix(deepNavy, royalBlue, smoothstep(0.0, 0.25, t));
  band = mix(band, steelBlue, smoothstep(0.2, 0.5, t));
  band = mix(band, skyBlue, smoothstep(0.45, 0.7, t));
  band = mix(band, paleBlue, smoothstep(0.65, 0.85, t));
  band = mix(band, cloudWhite, smoothstep(0.8, 1.0, t));
  band += vec3(0.75, 0.85, 1.0) * pow(max(0.0, sin(t * 6.0)), 12.0) * 0.08;
  return band;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_res) / u_res.y;
  vec2 mouse = (u_mouse * 2.0 - u_res) / u_res.y;
  float md = length(uv - mouse);
  float time = u_time * 0.052;

  vec2 p = uv * (1.08 + u_compact * 0.18);
  p += normalize(uv - mouse + 0.0001) * (0.13 / (md + 0.38));
  p.x += sin(time * 1.8 + uv.y * 1.4) * 0.08;
  p.y += cos(time * 1.2 + uv.x * 1.1) * 0.05;

  vec2 q = vec2(fbm(p + time), fbm(p + vec2(5.2, 1.3) - time));
  vec2 r = vec2(
    fbm(p + 3.8 * q + vec2(1.7, 9.2) + time * 1.15),
    fbm(p + 3.8 * q + vec2(8.3, 2.8) - time * 1.05)
  );
  float field = fbm(p + 4.2 * r);
  float ribbon = smoothstep(0.20, 0.92, field + length(r) * 0.58);
  float filament = pow(abs(sin((field + r.x * 0.7 + time) * 18.0)), 7.0);

  vec3 color = palette(field + length(r) * 0.62 + time * 0.75);
  color *= 0.42 + 0.72 * ribbon;
  color += vec3(0.75, 0.88, 1.00) * filament * 0.18;
  color += vec3(0.55, 0.75, 1.00) * pow(max(0.0, 1.0 - md), 3.2) * 0.28;

  float verticalGrad = smoothstep(-1.2, 1.0, uv.y);
  vec3 topColor = vec3(0.05, 0.09, 0.18);
  vec3 midColor = vec3(0.15, 0.30, 0.55);
  vec3 bottomColor = vec3(0.70, 0.82, 0.95);
  vec3 gradColor = mix(topColor, midColor, smoothstep(-0.8, 0.0, uv.y));
  gradColor = mix(gradColor, bottomColor, smoothstep(0.0, 1.0, uv.y));
  color = mix(gradColor, color, 0.55);

  float vignette = smoothstep(1.82, 0.18, length(uv * vec2(0.82, 1.0)));
  float scan = 0.965 + 0.035 * sin(gl_FragCoord.y * 1.45 + u_time * 1.7);
  color *= vignette * scan;

  gl_FragColor = vec4(color, 1.0);
}
`

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let vertexShader: WebGLShader | null = null
let fragmentShader: WebGLShader | null = null
let buffer: WebGLBuffer | null = null
let frameId = 0
let startTime = 0
let reducedMotion = false
const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
const uniforms: {
  res: WebGLUniformLocation | null
  time: WebGLUniformLocation | null
  mouse: WebGLUniformLocation | null
  compact: WebGLUniformLocation | null
} = {
  res: null,
  time: null,
  mouse: null,
  compact: null,
}

function compileShader(type: number, source: string) {
  if (!gl) return null

  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !gl) return

  const dpr = Math.min(window.devicePixelRatio || 1, props.compact ? 1.15 : 1.45)
  const width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
  const height = Math.max(1, Math.floor(canvas.clientHeight * dpr))

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
  }
}

function render(now: number) {
  const canvas = canvasRef.value
  if (!canvas || !gl || !program) return

  resize()
  mouse.x += (mouse.tx - mouse.x) * 0.055
  mouse.y += (mouse.ty - mouse.y) * 0.055

  gl.useProgram(program)
  gl.uniform2f(uniforms.res, canvas.width, canvas.height)
  gl.uniform1f(uniforms.time, reducedMotion ? 0.0 : (now - startTime) / 1000)
  gl.uniform2f(uniforms.mouse, mouse.x * canvas.width, mouse.y * canvas.height)
  gl.uniform1f(uniforms.compact, props.compact ? 1 : 0)
  gl.drawArrays(gl.TRIANGLES, 0, 3)

  frameId = window.requestAnimationFrame(render)
}

function handlePointerMove(event: PointerEvent) {
  mouse.tx = event.clientX / Math.max(1, window.innerWidth)
  mouse.ty = 1 - event.clientY / Math.max(1, window.innerHeight)
}

function handlePointerLeave() {
  mouse.tx = 0.5
  mouse.ty = 0.5
}

function init() {
  const canvas = canvasRef.value
  if (!canvas) return

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: props.compact ? 'low-power' : 'high-performance',
  })

  if (!gl) return

  vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
  fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
  if (!vertexShader || !fragmentShader) return

  program = gl.createProgram()
  if (!program) return

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program))
    return
  }

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  uniforms.res = gl.getUniformLocation(program, 'u_res')
  uniforms.time = gl.getUniformLocation(program, 'u_time')
  uniforms.mouse = gl.getUniformLocation(program, 'u_mouse')
  uniforms.compact = gl.getUniformLocation(program, 'u_compact')

  startTime = performance.now()
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave)
  frameId = window.requestAnimationFrame(render)
}

function cleanup() {
  window.cancelAnimationFrame(frameId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)

  if (gl) {
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
    if (vertexShader) gl.deleteShader(vertexShader)
    if (fragmentShader) gl.deleteShader(fragmentShader)
  }

  gl = null
  program = null
  vertexShader = null
  fragmentShader = null
  buffer = null
}

onMounted(init)
onBeforeUnmount(cleanup)
</script>

<template>
  <div class="ink-field-wrapper" aria-hidden="true">
    <div class="ink-field-bg" />
    <canvas ref="canvasRef" class="ink-field-canvas" />
  </div>
</template>

<style scoped>
.ink-field-wrapper {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.ink-field-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 800px 500px at 30% 30%, rgba(80, 150, 220, 0.15), transparent 60%),
    linear-gradient(180deg, #0a1020 0%, #122848 30%, #2a5080 55%, #5a85b8 75%, #90b5dd 90%, #c8dcf0 100%);
}

.ink-field-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
