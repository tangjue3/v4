<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)

interface InkDrop {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  maxLife: number
  hue: number
  ring: number
}

let drops: InkDrop[] = []
let rafId = 0
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D | null = null
let lastX = -1
let lastY = -1
let frameCount = 0

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function spawnDrops(x: number, y: number, dx: number, dy: number) {
  const speed = Math.hypot(dx, dy)
  const count = Math.min(3, Math.max(1, Math.floor(speed / 6)))
  for (let i = 0; i < count; i++) {
    if (drops.length > 120) drops.shift()
    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2
    const force = Math.random() * 0.6 + 0.2
    drops.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * force + (Math.random() - 0.5) * 0.3,
      vy: Math.sin(angle) * force + (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 6 + 4,
      life: 1,
      maxLife: Math.random() * 0.7 + 0.5,
      hue: 185 + Math.random() * 35 + (Math.random() > 0.7 ? 70 : 0),
      ring: Math.random() * 0.6 + 0.3,
    })
  }
}

function onMouseMove(e: MouseEvent) {
  if (lastX < 0) {
    lastX = e.clientX
    lastY = e.clientY
    return
  }
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  const dist = Math.hypot(dx, dy)
  if (dist < 4) return
  spawnDrops(e.clientX, e.clientY, dx, dy)
  lastX = e.clientX
  lastY = e.clientY
}

function onTouchMove(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  if (lastX < 0) {
    lastX = t.clientX
    lastY = t.clientY
    return
  }
  const dx = t.clientX - lastX
  const dy = t.clientY - lastY
  const dist = Math.hypot(dx, dy)
  if (dist < 4) return
  spawnDrops(t.clientX, t.clientY, dx, dy)
  lastX = t.clientX
  lastY = t.clientY
}

function onLeave() {
  lastX = -1
  lastY = -1
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  frameCount++
  if (frameCount % 2 !== 0 && drops.length < 40) {
    rafId = requestAnimationFrame(draw)
    return
  }

  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]
    d.x += d.vx
    d.y += d.vy
    d.vx *= 0.96
    d.vy *= 0.96
    d.life -= 0.006
    d.radius += 0.18

    if (d.life <= 0) {
      drops.splice(i, 1)
      continue
    }

    const progress = 1 - d.life / d.maxLife
    const alpha = Math.max(0, d.life / d.maxLife) * 0.22
    const innerAlpha = Math.max(0, d.life / d.maxLife) * 0.08

    const r = d.radius * (1 + progress * 1.5)

    // outer halo
    const g1 = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r)
    g1.addColorStop(0, `hsla(${d.hue}, 70%, 55%, ${innerAlpha})`)
    g1.addColorStop(0.55, `hsla(${d.hue}, 60%, 45%, ${alpha})`)
    g1.addColorStop(1, `hsla(${d.hue}, 50%, 30%, 0)`)

    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.beginPath()
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
    ctx.fillStyle = g1
    ctx.fill()

    // inner ink core
    const coreR = r * 0.4
    const g2 = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, coreR)
    g2.addColorStop(0, `hsla(${d.hue}, 80%, 70%, ${alpha * 1.8})`)
    g2.addColorStop(1, `hsla(${d.hue}, 70%, 50%, 0)`)
    ctx.beginPath()
    ctx.arc(d.x, d.y, coreR, 0, Math.PI * 2)
    ctx.fillStyle = g2
    ctx.fill()

    // thin ring
    if (d.ring > 0.5) {
      ctx.beginPath()
      ctx.arc(d.x, d.y, r * 0.78, 0, Math.PI * 2)
      ctx.strokeStyle = `hsla(${d.hue}, 60%, 55%, ${alpha * 0.35})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }
    ctx.restore()
  }

  rafId = requestAnimationFrame(draw)
}

function bindListeners() {
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('mouseleave', onLeave)
}

function unbindListeners() {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('mouseleave', onLeave)
}

function clearCanvas() {
  if (ctx) ctx.clearRect(0, 0, width, height)
  drops = []
  cancelAnimationFrame(rafId)
  rafId = 0
}

function startRendering() {
  resize()
  bindListeners()
  rafId = requestAnimationFrame(draw)
}

function stopRendering() {
  unbindListeners()
  clearCanvas()
}

onMounted(() => {
  if (appStore.inkMouseEnabled) {
    startRendering()
  }
})

onUnmounted(() => {
  stopRendering()
})

// 响应设置页"鼠标拖尾背景"开关
watch(() => appStore.inkMouseEnabled, (enabled) => {
  if (enabled) {
    startRendering()
  } else {
    stopRendering()
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="ink-mouse-background" aria-hidden="true" />
</template>

<style scoped>
.ink-mouse-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  opacity: 0.85;
  mix-blend-mode: screen;
}
</style>
