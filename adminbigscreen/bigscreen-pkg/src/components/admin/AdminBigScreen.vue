<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  BookOpen,
  Bot,
  BrainCircuit,
  Database,
  FileText,
  Library,
  ListChecks,
  Maximize,
  Network,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-vue-next'

/* ---------- 动效开关 ---------- */
const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const booting = ref(!reducedMotion)
const bootPct = ref(0)
let bootTimer: number | null = null

/* ---------- 时钟与系统运行时长 ---------- */
const now = ref(new Date())
let clockTimer: number | null = null
const weekNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const pad = (n: number) => String(n).padStart(2, '0')
const dateText = computed(() => {
  const d = now.value
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
})
const timeText = computed(() => {
  const d = now.value
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})
const weekText = computed(() => weekNames[now.value.getDay()])

const UPTIME_BASE = 128 * 86400 + 6 * 3600 + 24 * 60 + 31
const mountedAt = Date.now()
const uptimeText = computed(() => {
  void now.value
  const total = UPTIME_BASE + Math.floor((Date.now() - mountedAt) / 1000)
  const days = Math.floor(total / 86400)
  const rest = total % 86400
  return `${days} 天 ${pad(Math.floor(rest / 3600))}:${pad(Math.floor((rest % 3600) / 60))}:${pad(rest % 60)}`
})

/* ---------- 全屏 ---------- */
const rootRef = ref<HTMLElement | null>(null)
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else rootRef.value?.requestFullscreen?.()
}

/* ---------- 数字滚动 ---------- */
function useCountUp(target: number, decimals = 0, duration = 1700, delay = 1350) {
  const value = ref(reducedMotion ? target : 0)
  onMounted(() => {
    if (reducedMotion) return
    window.setTimeout(() => {
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration)
        value.value = target * (1 - Math.pow(1 - p, 3))
        if (p < 1) requestAnimationFrame(tick)
        else value.value = target
      }
      requestAnimationFrame(tick)
    }, delay)
  })
  return computed(() =>
    decimals > 0
      ? value.value.toFixed(decimals)
      : Math.round(value.value).toLocaleString('en-US'),
  )
}

/* ---------- 中央 KPI ---------- */
const centerKpis = [
  { label: '数据采集量（条/秒）', anim: useCountUp(428649) },
  { label: '实时任务数', anim: useCountUp(2368) },
  { label: '策略下发数（次/分）', anim: useCountUp(1256) },
  { label: '风险事件（今日）', anim: useCountUp(23), danger: true },
]

/* ---------- 左 1：平台运行监控（环形仪表） ---------- */
const gauges = [
  { label: '在线智能体数', value: '26', sub: '/30', note: '', pct: 87, tone: '#3e9eff' },
  { label: '任务成功率', value: '98.2', sub: '%', note: '今日', pct: 98, tone: '#35c7ff' },
  { label: '平均响应时延', value: '312', sub: 'ms', note: '近5分钟', pct: 62, tone: '#8f7bff' },
  { label: '系统健康度', value: '96.7', sub: '%', note: '正常', pct: 97, tone: '#23d18b' },
]

/* ---------- 左 2：任务流转趋势（页签 + 双轴） ---------- */
const trendTabs = ['近 1 小时', '近 24 小时', '近 7 天']
const trendTab = ref(1)
const trendSets = [
  {
    total: [1800, 2300, 2100, 2600, 3100, 2800, 3300, 3600, 3200, 2900, 3400, 3800],
    rate: [92, 95, 93, 96, 98, 96, 97, 99, 97, 96, 98, 98],
    ticks: ['-60m', '-50m', '-40m', '-30m', '-20m', '-10m'],
  },
  {
    total: [1200, 2100, 3400, 2800, 2200, 1600, 2400, 3600, 4200, 3800, 3100, 3900],
    rate: [90, 94, 97, 95, 92, 89, 94, 98, 99, 97, 95, 98],
    ticks: ['10:00', '14:00', '18:00', '22:00', '02:00', '06:00'],
  },
  {
    total: [2600, 3100, 2900, 3600, 4100, 3800, 4400, 4000, 3700, 4200, 4600, 4300],
    rate: [93, 95, 94, 97, 98, 96, 99, 97, 96, 98, 99, 98],
    ticks: ['周一', '周二', '周三', '周四', '周五', '周六'],
  },
]
const trendData = computed(() => trendSets[trendTab.value])

function seriesPath(values: number[], max: number, w = 300, h = 88, close = false) {
  const step = w / (values.length - 1)
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * (h - 12)).toFixed(1)}`)
  const line = `M ${pts.join(' L ')}`
  return close ? `M 0,${h} L ${pts.join(' L ')} L ${w},${h} Z` : line
}

function ratePath(values: number[], w = 300, h = 88) {
  const step = w / (values.length - 1)
  return `M ${values
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - 60) / 50) * (h - 12)).toFixed(1)}`)
    .join(' L ')}`
}

/* ---------- 左 3：风险预警 ---------- */
const risks = [
  { level: '高', type: '主机温度异常', scope: '3 个节点', time: '10:23:11', status: '处理中', tone: 'danger', stone: 'run' },
  { level: '高', type: '数据链路中断', scope: '2 个链路', time: '10:18:54', status: '待处理', tone: 'danger', stone: 'wait' },
  { level: '中', type: '任务执行超时', scope: '12 个任务', time: '10:15:32', status: '处理中', tone: 'warn', stone: 'run' },
  { level: '中', type: '模型调用失败', scope: '5 个模型', time: '10:12:07', status: '已处置', tone: 'warn', stone: 'done' },
  { level: '低', type: '知识点掌握率下降', scope: '部分班级', time: '10:09:48', status: '观察中', tone: 'info', stone: 'watch' },
]

/* ---------- 左 4：节点运行状态 ---------- */
const nodeTabs = ['计算节点', '存储节点', '服务节点', '网络节点']
const nodeTab = ref(0)
const nodeSets = [
  [
    { name: 'node-01', status: '正常', cpu: '32%', mem: '46%', load: '0.32', up: '12 天', tone: 'ok' },
    { name: 'node-02', status: '正常', cpu: '28%', mem: '53%', load: '0.28', up: '12 天', tone: 'ok' },
    { name: 'node-03', status: '警告', cpu: '68%', mem: '72%', load: '0.68', up: '8 天', tone: 'warn' },
    { name: 'node-04', status: '正常', cpu: '35%', mem: '49%', load: '0.35', up: '12 天', tone: 'ok' },
    { name: 'node-05', status: '正常', cpu: '21%', mem: '37%', load: '0.21', up: '12 天', tone: 'ok' },
  ],
  [
    { name: 'store-01', status: '正常', cpu: '18%', mem: '61%', load: '0.22', up: '36 天', tone: 'ok' },
    { name: 'store-02', status: '正常', cpu: '16%', mem: '58%', load: '0.19', up: '36 天', tone: 'ok' },
    { name: 'store-03', status: '正常', cpu: '22%', mem: '66%', load: '0.31', up: '21 天', tone: 'ok' },
    { name: 'store-04', status: '警告', cpu: '41%', mem: '83%', load: '0.57', up: '9 天', tone: 'warn' },
  ],
  [
    { name: 'svc-gw', status: '正常', cpu: '37%', mem: '44%', load: '0.41', up: '28 天', tone: 'ok' },
    { name: 'svc-auth', status: '正常', cpu: '24%', mem: '39%', load: '0.26', up: '28 天', tone: 'ok' },
    { name: 'svc-llm', status: '正常', cpu: '58%', mem: '71%', load: '0.66', up: '14 天', tone: 'ok' },
    { name: 'svc-etl', status: '正常', cpu: '33%', mem: '52%', load: '0.38', up: '14 天', tone: 'ok' },
  ],
  [
    { name: 'net-core', status: '正常', cpu: '12%', mem: '26%', load: '0.14', up: '64 天', tone: 'ok' },
    { name: 'net-edge1', status: '正常', cpu: '15%', mem: '31%', load: '0.18', up: '64 天', tone: 'ok' },
    { name: 'net-edge2', status: '正常', cpu: '14%', mem: '28%', load: '0.16', up: '31 天', tone: 'ok' },
  ],
]
const nodeRows = computed(() => nodeSets[nodeTab.value])

/* ---------- 中枢智能体 ---------- */
const hubAgents = [
  { id: 'diag', name: '学习诊断智能体', icon: BrainCircuit, x: 16, y: 16, flow: '数据采集 · 状态上报' },
  { id: 'graph', name: '知识图谱智能体', icon: Network, x: 84, y: 16, flow: '数据采集 · 状态上报' },
  { id: 'res', name: '资源推荐智能体', icon: Library, x: 10, y: 55, flow: '策略分发 · 状态上报' },
  { id: 'task', name: '任务调度智能体', icon: ListChecks, x: 90, y: 55, flow: '策略分发 · 状态上报' },
  { id: 'rev', name: '反向评估智能体', icon: RotateCcw, x: 22, y: 91, flow: '风险回流 · 状态上报' },
  { id: 'portrait', name: '画像生成智能体', icon: Users, x: 78, y: 91, flow: '画像更新 · 状态上报' },
]

const hubStatus = [
  { label: '中枢负载', value: '62%' },
  { label: '任务处理延迟', value: '312ms' },
  { label: '策略执行成功率', value: '98.7%' },
  { label: '数据链路健康度', value: '96.2%' },
]

/* ---------- 五库 ---------- */
const assets = [
  {
    icon: Bot, name: '智能体库', tone: '#3e9eff',
    rows: [['已部署', '26 个'], ['运行中', '24 个'], ['待更新', '9 个'], ['异常', '0 个']],
  },
  {
    icon: BookOpen, name: '知识库', tone: '#23d18b',
    rows: [['知识点', '128,642'], ['知识图谱', '2,368'], ['文档总数', '486,231'], ['今日新增', '3,256']],
  },
  {
    icon: FileText, name: '策略库', tone: '#35c7ff',
    rows: [['策略总数', '2,356'], ['启用策略', '1,856'], ['今日下发', '1,256'], ['命中率', '92.1%']],
  },
  {
    icon: ShieldCheck, name: '案例库', tone: '#8f7bff',
    rows: [['案例总数', '36,721'], ['优质案例', '8,642'], ['今日新增', '326'], ['引用次数', '12,568']],
  },
  {
    icon: Database, name: '画像报告中心', tone: '#ffb648',
    rows: [['报告总数', '16,532'], ['今日生成', '642'], ['待审核', '116'], ['下载次数', '8,215']],
  },
]

/* ---------- 右 1：学生画像概览 ---------- */
const studentTotal = useCountUp(12568)
const studentRates = [
  { label: '覆盖率', value: '98.6%' },
  { label: '活跃率', value: '89.3%' },
  { label: '完整率', value: '92.7%' },
]

/* ---------- 右 2：知识点掌握分析 ---------- */
const masteryTabs = ['总体分布', '学科对比']
const masteryTab = ref(0)
const masterySets = [
  [
    { name: '语文', pct: 86 }, { name: '数学', pct: 78 }, { name: '英语', pct: 74 },
    { name: '物理', pct: 69 }, { name: '化学', pct: 63 }, { name: '历史', pct: 81 },
    { name: '地理', pct: 72 }, { name: '生物', pct: 67 },
  ],
  [
    { name: '语文', pct: 82 }, { name: '数学', pct: 84 }, { name: '英语', pct: 70 },
    { name: '物理', pct: 75 }, { name: '化学', pct: 68 }, { name: '历史', pct: 77 },
    { name: '地理', pct: 69 }, { name: '生物', pct: 71 },
  ],
]
const masteryBars = computed(() => masterySets[masteryTab.value])

const radarDims = ['语文', '数学', '英语', '物理', '生物', '历史']
const radarVals = [86, 78, 74, 69, 67, 81]
const R_C = 58
const R_R = 36
function radarPt(i: number, v: number) {
  const a = ((-90 + i * 60) * Math.PI) / 180
  const r = (v / 100) * R_R
  return `${(R_C + r * Math.cos(a)).toFixed(1)},${(R_C + r * Math.sin(a)).toFixed(1)}`
}
function radarLabelPos(i: number) {
  const a = ((-90 + i * 60) * Math.PI) / 180
  const r = R_R + 14
  return { x: R_C + r * Math.cos(a), y: R_C + r * Math.sin(a) + 3 }
}
const radarPoly = radarVals.map((v, i) => radarPt(i, v)).join(' ')
const radarGrids = [0.33, 0.66, 1].map(s => radarDims.map((_, i) => radarPt(i, s * 100)).join(' '))

/* ---------- 右 3：模型调用统计 ---------- */
const modelStats = [
  { label: 'Token 使用（万）', value: '586.42', delta: '日环比 +12.6%', good: true },
  { label: '调用次数（次）', value: '98.7万', delta: '日环比 +9.8%', good: true },
  { label: '路由占比', value: '43.6%', delta: 'Top 模型占比', good: false },
  { label: '成功率', value: '98.7%', delta: '日环比 +1.2%', good: true },
]
const modelBars = [38, 52, 44, 66, 84, 72, 90, 108, 96, 78, 88, 102]
const modelLine = [3.2, 4.1, 3.6, 4.8, 5.9, 5.1, 6.2, 7.4, 6.8, 5.6, 6.3, 7.1]
const modelTicks = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']

/* ---------- 右 4：区域 / 校区分布 ---------- */
const regions = [
  { name: '华东区', schools: '3,256', rate: '98.1%' },
  { name: '华南区', schools: '2,814', rate: '97.3%' },
  { name: '华北区', schools: '2,105', rate: '96.5%' },
  { name: '西南区', schools: '1,876', rate: '95.8%' },
  { name: '西北区', schools: '1,234', rate: '94.2%' },
  { name: '东北区', schools: '1,283', rate: '96.0%' },
]
const regionDots = Array.from({ length: 36 }, (_, i) => {
  const seed = (i + 7) * 2654435761 % 1000
  return {
    x: 8 + (seed % 84),
    y: 10 + ((seed * 13) % 76),
    r: 1 + ((seed * 7) % 10) / 6,
    a: 0.25 + ((seed * 3) % 50) / 100,
    d: ((seed * 11) % 40) / 10,
  }
})

/* ---------- 粒子星尘 ---------- */
const starCanvas = ref<HTMLCanvasElement | null>(null)
let starRaf = 0
let starObserver: ResizeObserver | null = null

function startStars() {
  const canvas = starCanvas.value
  if (!canvas || reducedMotion) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const fit = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  fit()
  starObserver = new ResizeObserver(fit)
  starObserver.observe(canvas)

  const dots = Array.from({ length: 64 }, () => ({
    x: Math.random(), y: Math.random(),
    r: 0.4 + Math.random() * 1.3,
    vx: (Math.random() - 0.5) * 0.00016,
    vy: (Math.random() - 0.5) * 0.0001,
    a: 0.12 + Math.random() * 0.4,
    tw: 1 + Math.random() * 4,
  }))
  interface Comet { x: number; y: number; vx: number; vy: number; life: number }
  let comet: Comet | null = null
  let nextComet = performance.now() + 2600

  const draw = (t: number) => {
    const { width: w, height: h } = canvas
    ctx.clearRect(0, 0, w, h)
    for (const d of dots) {
      d.x = (d.x + d.vx + 1) % 1
      d.y = (d.y + d.vy + 1) % 1
      const alpha = d.a * (0.6 + 0.4 * Math.sin(t / 1000 * d.tw))
      ctx.beginPath()
      ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(140, 200, 255, ${alpha.toFixed(3)})`
      ctx.fill()
    }
    if (!comet && t > nextComet) {
      const fromLeft = Math.random() > 0.5
      comet = {
        x: fromLeft ? -0.05 : 1.05,
        y: 0.08 + Math.random() * 0.5,
        vx: (fromLeft ? 1 : -1) * (0.0045 + Math.random() * 0.003),
        vy: 0.0011 + Math.random() * 0.0012,
        life: 1,
      }
      nextComet = t + 3800 + Math.random() * 4200
    }
    if (comet) {
      comet.x += comet.vx
      comet.y += comet.vy
      comet.life -= 0.006
      const cx = comet.x * w
      const cy = comet.y * h
      const tail = 90 * (comet.vx > 0 ? -1 : 1)
      const grad = ctx.createLinearGradient(cx, cy, cx + tail, cy - 26)
      grad.addColorStop(0, `rgba(120, 210, 255, ${(0.85 * comet.life).toFixed(3)})`)
      grad.addColorStop(1, 'rgba(120, 210, 255, 0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + tail, cy - 26)
      ctx.stroke()
      if (comet.life <= 0 || comet.x < -0.1 || comet.x > 1.1) comet = null
    }
    starRaf = requestAnimationFrame(draw)
  }
  starRaf = requestAnimationFrame(draw)
}

/* ---------- 流程链 ---------- */
const pipeline = [
  { name: '数据接入', icon: Database },
  { name: '智能协同', icon: Bot },
  { name: '监控预警', icon: ShieldAlert },
  { name: '学情诊断', icon: BrainCircuit },
  { name: '资源调度', icon: Library },
  { name: '画像更新', icon: Users },
  { name: '持续优化', icon: TrendingUp },
]

onMounted(() => {
  clockTimer = window.setInterval(() => { now.value = new Date() }, 1000)
  startStars()
  if (!reducedMotion) {
    bootTimer = window.setInterval(() => {
      bootPct.value = Math.min(100, bootPct.value + 3 + Math.random() * 6)
      if (bootPct.value >= 100 && bootTimer) {
        window.clearInterval(bootTimer)
        bootTimer = null
        window.setTimeout(() => { booting.value = false }, 260)
      }
    }, 34)
  }
})

onBeforeUnmount(() => {
  if (clockTimer) window.clearInterval(clockTimer)
  if (bootTimer) window.clearInterval(bootTimer)
  if (starRaf) cancelAnimationFrame(starRaf)
  starObserver?.disconnect()
})
</script>

<template>
  <div ref="rootRef" class="big-screen" :class="{ live: !booting }">
    <canvas ref="starCanvas" class="star-canvas" aria-hidden="true" />

    <!-- 顶部 -->
    <header class="bs-head">
      <div class="head-side-info">
        <ShieldCheck :size="14" stroke-width="1.8" />
        系统运行时间&ensp;<b>{{ uptimeText }}</b>
      </div>
      <div class="head-title">
        <i class="title-wing left" aria-hidden="true" />
        <div>
          <h1>多智能体教育管理监控中心</h1>
          <p>平台监控 · 智能调度 · 学情总览 · 风险预警</p>
        </div>
        <i class="title-wing right" aria-hidden="true" />
      </div>
      <div class="head-side-info right">
        <b>{{ timeText }}</b>&ensp;{{ dateText }}&ensp;{{ weekText }}
        <button class="fs-btn" type="button" title="全屏" @click="toggleFullscreen">
          <Maximize :size="13" stroke-width="2" />
        </button>
      </div>
    </header>

    <!-- 主体三栏 -->
    <section class="bs-main">
      <!-- 左列 -->
      <div class="bs-col">
        <article class="bs-card" :style="{ '--d': '0.2s' }">
          <h3 class="card-title">平台运行监控</h3>
          <div class="gauge-grid">
            <div v-for="g in gauges" :key="g.label" class="gauge" :style="{ '--tone': g.tone, '--pct': `${g.pct}%` }">
              <i class="gauge-ring"><b>{{ g.value }}<small>{{ g.sub }}</small></b></i>
              <span>{{ g.label }}</span>
              <small>{{ g.note }}</small>
            </div>
          </div>
        </article>

        <article class="bs-card" :style="{ '--d': '0.7s' }">
          <div class="card-head-row">
            <h3 class="card-title">任务流转趋势</h3>
            <div class="tab-row">
              <button
                v-for="(tab, i) in trendTabs" :key="tab" type="button"
                :class="{ active: trendTab === i }" @click="trendTab = i"
              >{{ tab }}</button>
            </div>
          </div>
          <div class="chart-legend">
            <span><i class="sq blue" />任务总数</span>
            <span><i class="sq gold" />成功率（%）</span>
          </div>
          <div class="dual-chart">
            <div class="y-axis left"><span>5,000</span><span>2,500</span><span>0</span></div>
            <svg viewBox="0 0 300 100" preserveAspectRatio="none">
              <line v-for="g in 3" :key="g" x1="0" :y1="g * 25" x2="300" :y2="g * 25" class="grid-line" />
              <path :d="seriesPath(trendData.total, 5000, 300, 88, true)" class="area-blue" />
              <path :d="seriesPath(trendData.total, 5000, 300, 88)" class="line-blue" />
              <path :d="ratePath(trendData.rate)" class="line-gold" />
            </svg>
            <div class="y-axis right"><span>110%</span><span>85%</span><span>60%</span></div>
          </div>
          <div class="x-ticks">
            <span v-for="t in trendData.ticks" :key="t">{{ t }}</span>
          </div>
        </article>

        <article class="bs-card" :style="{ '--d': '1.2s' }">
          <h3 class="card-title">风险预警</h3>
          <div class="mini-table risk-table">
            <div class="tr th">
              <span>风险等级</span><span>风险类型</span><span>影响范围</span><span>触发时间</span><span>处理状态</span>
            </div>
            <div v-for="risk in risks" :key="risk.type" class="tr">
              <span><b class="lv" :class="risk.tone">{{ risk.level }}</b></span>
              <span class="ellip">{{ risk.type }}</span>
              <span>{{ risk.scope }}</span>
              <span class="mono">{{ risk.time }}</span>
              <span><em class="st" :class="risk.stone">{{ risk.status }}</em></span>
            </div>
          </div>
          <p class="card-foot">今日风险事件 <b class="warn-c">23</b> 起，已处置 <b class="ok-c">16</b> 起</p>
        </article>

        <article class="bs-card" :style="{ '--d': '1.7s' }">
          <div class="card-head-row">
            <h3 class="card-title">节点运行状态</h3>
            <div class="tab-row">
              <button
                v-for="(tab, i) in nodeTabs" :key="tab" type="button"
                :class="{ active: nodeTab === i }" @click="nodeTab = i"
              >{{ tab }}</button>
            </div>
          </div>
          <div class="mini-table node-table">
            <div class="tr th">
              <span>节点名称</span><span>状态</span><span>CPU</span><span>内存</span><span>负载</span><span>运行时长</span>
            </div>
            <div v-for="node in nodeRows" :key="node.name" class="tr">
              <span class="mono">{{ node.name }}</span>
              <span><em class="st" :class="node.tone === 'ok' ? 'done' : 'wait'">{{ node.status }}</em></span>
              <span class="mono">{{ node.cpu }}</span>
              <span class="mono">{{ node.mem }}</span>
              <span class="mono">{{ node.load }}</span>
              <span class="mono">{{ node.up }}</span>
            </div>
          </div>
          <p class="card-foot">正常 <b class="ok-c">28</b> · 警告 <b class="warn-c">2</b> · 异常 <b class="dg-c">0</b></p>
        </article>
      </div>

      <!-- 中列 -->
      <div class="bs-col center-col">
        <div class="center-kpis">
          <article
            v-for="(kpi, i) in centerKpis" :key="kpi.label"
            class="bs-card kpi-chip" :class="{ danger: kpi.danger }"
            :style="{ '--d': `${0.1 + i * 0.35}s` }"
          >
            <span>{{ kpi.label }}</span>
            <strong>{{ kpi.anim.value }}</strong>
          </article>
        </div>

        <article class="bs-card hub-card" :style="{ '--d': '0s' }">
          <svg class="hub-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path v-for="agent in hubAgents" :key="agent.id" :d="`M ${agent.x} ${agent.y} L 50 46`" class="hub-link" />
            <path v-for="agent in hubAgents" :key="`f-${agent.id}`" :d="`M ${agent.x} ${agent.y} L 50 46`" class="hub-flow" />
            <circle v-for="(agent, i) in hubAgents" :key="`p-${agent.id}`" r="0.75" class="pulse-dot">
              <animateMotion
                :dur="`${2.4 + i * 0.35}s`" :begin="`${i * 0.42}s`" repeatCount="indefinite"
                :path="`M ${agent.x} ${agent.y} L 50 46`"
              />
            </circle>
          </svg>
          <i class="hub-sweep" aria-hidden="true" />
          <i class="hub-orbit o1" aria-hidden="true" />
          <i class="hub-orbit o2" aria-hidden="true" />
          <i class="hub-platform p1" aria-hidden="true" />
          <i class="hub-platform p2" aria-hidden="true" />
          <i class="hub-beam" aria-hidden="true" />

          <div class="hub-core">
            <span class="ring r1" /><span class="ring r2" />
            <strong>智能调度中枢</strong>
            <small>实时决策 · 全局协调 · 智能调度</small>
          </div>

          <div
            v-for="agent in hubAgents" :key="agent.id"
            class="hub-node" :style="{ left: `${agent.x}%`, top: `${agent.y}%` }"
          >
            <i class="hex"><component :is="agent.icon" :size="17" stroke-width="1.6" /></i>
            <span>{{ agent.name }}</span>
            <small>{{ agent.flow }}</small>
          </div>

          <div class="hub-status">
            <h4>中枢运行状态</h4>
            <div v-for="s in hubStatus" :key="s.label">
              <i /><span>{{ s.label }}</span><b>{{ s.value }}</b>
            </div>
          </div>
        </article>

        <div class="asset-row">
          <article
            v-for="(asset, i) in assets" :key="asset.name"
            class="bs-card asset-card" :style="{ '--d': `${0.5 + i * 0.35}s`, '--tone': asset.tone }"
          >
            <header>
              <i class="asset-orb"><component :is="asset.icon" :size="18" stroke-width="1.6" /></i>
              <strong>{{ asset.name }}</strong>
            </header>
            <div class="asset-rows">
              <div v-for="[k, v] in asset.rows" :key="k">
                <span>{{ k }}</span><b>{{ v }}</b>
              </div>
            </div>
            <button type="button" class="asset-more">查看更多 ›</button>
          </article>
        </div>
      </div>

      <!-- 右列 -->
      <div class="bs-col">
        <article class="bs-card" :style="{ '--d': '0.4s' }">
          <h3 class="card-title">学生画像概览</h3>
          <div class="student-row">
            <div class="student-total">
              <span>全校学生数</span>
              <strong>{{ studentTotal }}<i>人</i></strong>
            </div>
            <div class="student-rates">
              <div v-for="r in studentRates" :key="r.label">
                <b>{{ r.value }}</b><span>{{ r.label }}</span>
              </div>
            </div>
          </div>
        </article>

        <article class="bs-card" :style="{ '--d': '0.9s' }">
          <div class="card-head-row">
            <h3 class="card-title">知识点掌握分析</h3>
            <div class="tab-row">
              <button
                v-for="(tab, i) in masteryTabs" :key="tab" type="button"
                :class="{ active: masteryTab === i }" @click="masteryTab = i"
              >{{ tab }}</button>
            </div>
          </div>
          <div class="chart-legend">
            <span><i class="sq blue" />掌握率</span>
            <span><i class="sq gold" />班级均值</span>
          </div>
          <div class="mastery-row">
            <div class="bar-chart">
              <div v-for="bar in masteryBars" :key="bar.name" class="bar-col">
                <i :style="{ height: `${bar.pct}%` }" />
                <span>{{ bar.name }}</span>
              </div>
            </div>
            <svg viewBox="0 0 116 116" class="mini-radar" aria-label="学科对比雷达">
              <polygon v-for="grid in radarGrids" :key="grid" :points="grid" class="radar-grid" />
              <polygon :points="radarPoly" class="radar-value" />
              <text
                v-for="(dim, i) in radarDims" :key="dim"
                :x="radarLabelPos(i).x" :y="radarLabelPos(i).y" text-anchor="middle"
              >{{ dim }}</text>
            </svg>
          </div>
        </article>

        <article class="bs-card" :style="{ '--d': '1.4s' }">
          <div class="card-head-row">
            <h3 class="card-title">模型调用统计</h3>
            <span class="pill-note">今日调用</span>
          </div>
          <div class="model-stats">
            <div v-for="m in modelStats" :key="m.label">
              <span>{{ m.label }}</span>
              <strong>{{ m.value }}</strong>
              <em :class="{ good: m.good }">{{ m.delta }}</em>
            </div>
          </div>
          <div class="combo-chart">
            <svg viewBox="0 0 300 96" preserveAspectRatio="none">
              <line v-for="g in 3" :key="g" x1="0" :y1="g * 24" x2="300" :y2="g * 24" class="grid-line" />
              <rect
                v-for="(bar, i) in modelBars" :key="i"
                :x="6 + i * 25" :y="88 - (bar / 120) * 78"
                width="12" :height="(bar / 120) * 78" rx="1.5" class="combo-bar"
              />
              <path :d="seriesPath(modelLine, 8, 300, 88)" class="line-gold" />
            </svg>
          </div>
          <div class="x-ticks wide">
            <span v-for="t in modelTicks" :key="t">{{ t }}</span>
          </div>
        </article>

        <article class="bs-card" :style="{ '--d': '1.9s' }">
          <h3 class="card-title">区域 / 校区分布</h3>
          <div class="region-row">
            <svg viewBox="0 0 100 96" class="region-dots" aria-hidden="true">
              <circle
                v-for="(dot, i) in regionDots" :key="i"
                :cx="dot.x" :cy="dot.y" :r="dot.r"
                class="region-dot" :style="{ '--a': dot.a, '--dd': `${dot.d}s` }"
              />
            </svg>
            <div class="mini-table region-table">
              <div class="tr th"><span>区域</span><span>校区数</span><span>覆盖率</span></div>
              <div v-for="region in regions" :key="region.name" class="tr">
                <span>{{ region.name }}</span>
                <span class="mono">{{ region.schools }}</span>
                <span class="mono ok-c">{{ region.rate }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- 流程链 -->
    <footer class="pipeline-row">
      <template v-for="(step, i) in pipeline" :key="step.name">
        <span class="pipe-step">
          <i class="pipe-icon"><component :is="step.icon" :size="15" stroke-width="1.7" /></i>
          <b>{{ step.name }}</b>
        </span>
        <i v-if="i < pipeline.length - 1" class="pipe-arrow" aria-hidden="true" />
      </template>
    </footer>

    <!-- 开机启动序列 -->
    <Transition name="boot">
      <div v-if="booting" class="boot-overlay" aria-hidden="true">
        <div class="boot-box">
          <strong>EDUMIND · 多智能体监控中心</strong>
          <small>SYSTEM INITIALIZING</small>
          <div class="boot-bar"><i :style="{ width: `${bootPct}%` }" /></div>
          <em>{{ Math.round(bootPct) }}%</em>
        </div>
        <i class="boot-scan" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.big-screen {
  --bs-blue: #3e9eff;
  --bs-cyan: #35c7ff;
  --bs-violet: #8f7bff;
  --bs-ok: #23d18b;
  --bs-warn: #ffb648;
  --bs-danger: #ff5f56;
  --bs-ink-1: #eef6ff;
  --bs-ink-2: #a8c4e8;
  --bs-ink-3: #6684ad;
  --bs-line: rgba(62, 158, 255, 0.24);
  position: relative;
  display: grid;
  gap: 11px;
  padding: 14px;
  margin: -12px;
  border-radius: 10px;
  color: var(--bs-ink-1);
  background:
    radial-gradient(1000px 480px at 50% -12%, rgba(46, 123, 255, 0.16), transparent 60%),
    radial-gradient(720px 420px at 8% 108%, rgba(53, 199, 255, 0.08), transparent 55%),
    radial-gradient(720px 420px at 92% 108%, rgba(143, 123, 255, 0.08), transparent 55%),
    linear-gradient(180deg, #050d21 0%, #071431 48%, #081940 100%);
}

.big-screen::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background-image:
    linear-gradient(rgba(62, 158, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(62, 158, 255, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(circle at 50% 34%, #000 0, transparent 78%);
  content: '';
}

.star-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}

.big-screen > *:not(.star-canvas):not(.boot-overlay) {
  position: relative;
  z-index: 1;
}

/* 全屏极淡扫描光带 */
.big-screen::after {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  height: 120px;
  background: linear-gradient(180deg, transparent, rgba(90, 190, 255, 0.045), transparent);
  content: '';
  pointer-events: none;
  animation: screen-scan 8s linear infinite;
}

@keyframes screen-scan {
  0% { top: -140px; }
  100% { top: 110%; }
}

/* ========== 呼吸卡片 + 级联点亮 ========== */
.bs-card {
  position: relative;
  padding: 12px 14px;
  border: 1px solid var(--bs-line);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(62, 158, 255, 0.07), transparent 26%),
    rgba(8, 20, 47, 0.72);
  animation: card-breathe 4.6s ease-in-out var(--d, 0s) infinite;
}

.big-screen.live .bs-card {
  animation:
    card-ignite 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) calc(var(--d, 0s) * 0.22) both,
    card-breathe 4.6s ease-in-out calc(0.9s + var(--d, 0s)) infinite;
}

@keyframes card-breathe {
  0%, 100% {
    border-color: var(--bs-line);
    box-shadow: 0 0 0 rgba(62, 158, 255, 0);
  }
  50% {
    border-color: rgba(62, 158, 255, 0.5);
    box-shadow: 0 0 26px rgba(62, 158, 255, 0.13), inset 0 0 18px rgba(62, 158, 255, 0.05);
  }
}

@keyframes card-ignite {
  0% { opacity: 0; clip-path: inset(0 0 100% 0); }
  55% { opacity: 1; clip-path: inset(0 0 0 0); }
  72% {
    border-color: rgba(120, 200, 255, 0.85);
    box-shadow: 0 0 34px rgba(62, 158, 255, 0.4);
  }
  100% { opacity: 1; clip-path: inset(0 0 0 0); }
}

.bs-card::before {
  position: absolute;
  inset: -1px;
  pointer-events: none;
  background:
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) left 0 top 0 / 14px 2px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) left 0 top 0 / 2px 14px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) right 0 top 0 / 14px 2px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) right 0 top 0 / 2px 14px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) left 0 bottom 0 / 14px 2px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) left 0 bottom 0 / 2px 14px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) right 0 bottom 0 / 14px 2px,
    linear-gradient(var(--bs-cyan), var(--bs-cyan)) right 0 bottom 0 / 2px 14px;
  background-repeat: no-repeat;
  content: '';
  opacity: 0.5;
}

/* ========== 顶部 ========== */
.bs-head {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
  padding: 2px 2px 0;
}

.head-side-info {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: var(--bs-ink-2);
  font-size: 11.5px;
}

.head-side-info b {
  color: var(--bs-ink-1);
  font-family: var(--font-mono);
  font-weight: 800;
}

.head-side-info.right {
  justify-self: end;
}

.head-side-info svg {
  color: var(--bs-cyan);
}

.fs-btn {
  display: grid;
  place-content: center;
  width: 24px;
  height: 24px;
  margin-left: 6px;
  border: 1px solid var(--bs-line);
  border-radius: 5px;
  background: rgba(8, 20, 47, 0.7);
  color: var(--bs-ink-2);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.fs-btn:hover {
  border-color: var(--bs-cyan);
  color: #fff;
}

.head-title {
  display: flex;
  gap: 16px;
  align-items: center;
  text-align: center;
}

.title-wing {
  width: clamp(40px, 6vw, 110px);
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--bs-blue));
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
}

.title-wing.right {
  transform: scaleX(-1);
}

.head-title h1 {
  margin: 0;
  font-size: clamp(20px, 1.9vw, 28px);
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #fff;
  text-shadow: 0 0 22px rgba(62, 158, 255, 0.75), 0 0 44px rgba(53, 199, 255, 0.3);
}

.head-title p {
  margin: 3px 0 0;
  color: #7fa8d9;
  font-size: 10.5px;
  letter-spacing: 0.34em;
}

/* ========== 三栏 ========== */
.bs-main {
  display: grid;
  grid-template-columns: minmax(320px, 0.92fr) minmax(0, 1.6fr) minmax(320px, 0.92fr);
  gap: 11px;
  align-items: stretch;
}

.bs-col {
  display: grid;
  gap: 11px;
  align-content: stretch;
}

.center-col {
  grid-template-rows: auto 1fr auto;
}

.card-title {
  margin: 0 0 9px;
  color: #fff;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.card-title::before {
  display: inline-block;
  width: 3px;
  height: 11px;
  margin-right: 7px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--bs-cyan), var(--bs-blue));
  box-shadow: 0 0 8px rgba(53, 199, 255, 0.7);
  vertical-align: -1px;
  content: '';
}

.card-head-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: center;
  justify-content: space-between;
}

.card-head-row .card-title {
  white-space: nowrap;
}

.tab-row {
  display: inline-flex;
  gap: 3px;
  margin-bottom: 8px;
  padding: 2px;
  border: 1px solid rgba(62, 158, 255, 0.2);
  border-radius: 6px;
  background: rgba(8, 20, 47, 0.6);
}

.tab-row button {
  padding: 3px 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--bs-ink-3);
  font-size: 9.5px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.tab-row button.active {
  background: linear-gradient(160deg, rgba(53, 199, 255, 0.3), rgba(62, 158, 255, 0.24));
  color: #fff;
}

.pill-note {
  padding: 3px 9px;
  border: 1px solid rgba(62, 158, 255, 0.28);
  border-radius: 5px;
  color: var(--bs-ink-2);
  font-size: 10px;
}

/* 环形仪表：呼吸辉光 */
.gauge-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.gauge {
  display: grid;
  gap: 4px;
  justify-items: center;
  text-align: center;
}

.gauge-ring {
  position: relative;
  display: grid;
  place-content: center;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background:
    radial-gradient(closest-side, #081430 74%, transparent 75% 100%),
    conic-gradient(var(--tone) var(--pct), rgba(62, 158, 255, 0.12) 0);
  animation: gauge-breathe 3.4s ease-in-out infinite;
}

@keyframes gauge-breathe {
  0%, 100% { filter: drop-shadow(0 0 3px transparent); }
  50% { filter: drop-shadow(0 0 10px color-mix(in srgb, var(--tone), transparent 40%)); }
}

.gauge-ring b {
  color: #fff;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 800;
}

.gauge-ring small {
  font-size: 9px;
  opacity: 0.7;
}

.gauge > span {
  color: var(--bs-ink-2);
  font-size: 9.5px;
  white-space: nowrap;
}

.gauge > small {
  min-height: 11px;
  color: var(--bs-ink-3);
  font-size: 8.5px;
}

/* 图表通用 */
.chart-legend {
  display: flex;
  gap: 12px;
  margin-bottom: 5px;
  color: var(--bs-ink-3);
  font-size: 9.5px;
}

.chart-legend .sq {
  display: inline-block;
  width: 9px;
  height: 5px;
  margin-right: 4px;
  border-radius: 1px;
  vertical-align: 1px;
}

.chart-legend .blue { background: var(--bs-blue); }
.chart-legend .gold { background: var(--bs-warn); }

.dual-chart {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 5px;
  align-items: stretch;
}

.dual-chart svg {
  width: 100%;
  height: 84px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--bs-ink-3);
  font-family: var(--font-mono);
  font-size: 8px;
  text-align: right;
}

.grid-line {
  stroke: rgba(62, 158, 255, 0.12);
  stroke-width: 1;
}

.area-blue { fill: rgba(62, 158, 255, 0.22); }

.line-blue {
  fill: none;
  stroke: var(--bs-blue);
  stroke-width: 1.6;
  filter: drop-shadow(0 0 5px rgba(62, 158, 255, 0.5));
}

.line-gold {
  fill: none;
  stroke: var(--bs-warn);
  stroke-width: 1.6;
  stroke-linejoin: round;
}

.big-screen.live .line-blue,
.big-screen.live .line-gold {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: line-draw 1.5s cubic-bezier(0.3, 0, 0.3, 1) 1s forwards;
}

@keyframes line-draw {
  to { stroke-dashoffset: 0; }
}

.x-ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 14px;
  color: var(--bs-ink-3);
  font-family: var(--font-mono);
  font-size: 8.5px;
}

.x-ticks.wide { padding: 0 4px; }

/* 表格 */
.mini-table {
  display: grid;
  gap: 4px;
}

.mini-table .tr {
  display: grid;
  gap: 6px;
  align-items: center;
  font-size: 10px;
  color: var(--bs-ink-2);
}

.risk-table .tr { grid-template-columns: 52px 1fr 62px 54px 52px; }
.node-table .tr { grid-template-columns: 62px 40px 40px 40px 40px 1fr; }
.region-table .tr { grid-template-columns: 1fr auto 52px; }

.mini-table .th {
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(62, 158, 255, 0.16);
  color: var(--bs-ink-3);
  font-size: 9px;
}

.mini-table .mono {
  font-family: var(--font-mono);
}

.mini-table .ellip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lv {
  display: inline-grid;
  place-content: center;
  min-width: 20px;
  height: 16px;
  border-radius: 3px;
  font-size: 9.5px;
  font-weight: 800;
}

.lv.danger { background: rgba(255, 95, 86, 0.18); color: var(--bs-danger); }
.lv.warn { background: rgba(255, 182, 72, 0.16); color: var(--bs-warn); }
.lv.info { background: rgba(62, 158, 255, 0.16); color: var(--bs-cyan); }

.st {
  font-size: 9.5px;
  font-style: normal;
  font-weight: 700;
}

.st.run { color: var(--bs-cyan); }
.st.wait { color: var(--bs-warn); }
.st.done { color: var(--bs-ok); }
.st.watch { color: var(--bs-ink-3); }

.card-foot {
  margin: 8px 0 0;
  color: var(--bs-ink-3);
  font-size: 10px;
}

.ok-c { color: var(--bs-ok); }
.warn-c { color: var(--bs-warn); }
.dg-c { color: var(--bs-danger); }

/* ========== 中列 ========== */
.center-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 11px;
}

.kpi-chip {
  padding: 9px 13px;
  text-align: center;
}

.kpi-chip span {
  display: block;
  color: var(--bs-ink-3);
  font-size: 9.5px;
  white-space: nowrap;
}

.kpi-chip strong {
  display: block;
  margin-top: 3px;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 21px;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 0 16px rgba(62, 158, 255, 0.55);
}

.kpi-chip.danger strong {
  color: var(--bs-danger);
  text-shadow: 0 0 16px rgba(255, 95, 86, 0.5);
}

.kpi-chip.danger {
  animation:
    card-breathe 4.6s ease-in-out var(--d, 0s) infinite,
    alarm-pulse 2s ease-in-out infinite;
}

@keyframes alarm-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(255, 95, 86, 0); }
  50% { box-shadow: 0 0 18px rgba(255, 95, 86, 0.28); }
}

/* 中枢 */
.hub-card {
  position: relative;
  min-height: 380px;
  overflow: hidden;
  background:
    radial-gradient(560px 300px at 50% 52%, rgba(46, 123, 255, 0.12), transparent 68%),
    rgba(8, 20, 47, 0.72);
}

.hub-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hub-link {
  stroke: rgba(62, 158, 255, 0.2);
  stroke-width: 0.4;
  fill: none;
}

.hub-flow {
  stroke: rgba(53, 199, 255, 0.85);
  stroke-dasharray: 1.5 6;
  stroke-width: 0.6;
  fill: none;
  animation: hub-dash 1.5s linear infinite;
}

@keyframes hub-dash {
  to { stroke-dashoffset: -7.5; }
}

.pulse-dot {
  fill: #bfe9ff;
  filter: drop-shadow(0 0 3px rgba(120, 210, 255, 0.95));
}

.hub-sweep {
  position: absolute;
  top: 46%;
  left: 50%;
  z-index: 1;
  width: min(76%, 440px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0 76%, rgba(53, 199, 255, 0.14) 88%, rgba(53, 199, 255, 0.02) 92%, transparent 92%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: sweep-spin 6.5s linear infinite;
}

@keyframes sweep-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.hub-orbit {
  position: absolute;
  top: 46%;
  left: 50%;
  z-index: 1;
  border: 1px dashed rgba(62, 158, 255, 0.22);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hub-orbit.o1 {
  width: 42%;
  aspect-ratio: 1;
  animation: orbit-spin 60s linear infinite;
}

.hub-orbit.o2 {
  width: 68%;
  aspect-ratio: 1;
  border-color: rgba(143, 123, 255, 0.18);
  animation: orbit-spin 90s linear infinite reverse;
}

@keyframes orbit-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.hub-platform {
  position: absolute;
  left: 50%;
  z-index: 1;
  border-radius: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.hub-platform.p1 {
  top: 56%;
  width: 290px;
  height: 72px;
  border: 1px solid rgba(62, 158, 255, 0.35);
  background: radial-gradient(closest-side, rgba(46, 123, 255, 0.22), rgba(46, 123, 255, 0.04) 72%, transparent);
  box-shadow: 0 0 44px rgba(46, 123, 255, 0.3);
  animation: platform-breathe 3.6s ease-in-out infinite;
}

@keyframes platform-breathe {
  0%, 100% { box-shadow: 0 0 30px rgba(46, 123, 255, 0.2); }
  50% { box-shadow: 0 0 56px rgba(46, 123, 255, 0.42); }
}

.hub-platform.p2 {
  top: 62%;
  width: 390px;
  height: 90px;
  border: 1px solid rgba(62, 158, 255, 0.16);
  background: radial-gradient(closest-side, rgba(46, 123, 255, 0.1), transparent 76%);
}

.hub-beam {
  position: absolute;
  top: 14%;
  left: 50%;
  z-index: 1;
  width: 150px;
  height: 44%;
  background: linear-gradient(180deg, transparent, rgba(53, 199, 255, 0.09) 40%, rgba(53, 199, 255, 0.16));
  clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
  transform: translateX(-50%);
  pointer-events: none;
  animation: beam-breathe 3.4s ease-in-out infinite;
}

@keyframes beam-breathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

.hub-core {
  position: absolute;
  top: 46%;
  left: 50%;
  z-index: 2;
  display: grid;
  gap: 3px;
  justify-items: center;
  width: 206px;
  padding: 20px 14px;
  border: 1px solid rgba(62, 158, 255, 0.6);
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(46, 123, 255, 0.2), rgba(8, 20, 47, 0.6) 60%),
    rgba(6, 15, 36, 0.92);
  text-align: center;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 40px rgba(46, 123, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.hub-core strong {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #fff;
  text-shadow: 0 0 18px rgba(53, 199, 255, 0.9);
}

.hub-core small {
  color: #8fb4e4;
  font-size: 9.5px;
  letter-spacing: 0.1em;
}

.hub-core .ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(53, 199, 255, 0.4);
  border-radius: 14px;
  transform: translate(-50%, -50%);
  animation: core-ring 3s ease-out infinite;
}

.hub-core .r1 { width: 100%; height: 100%; }
.hub-core .r2 { width: 100%; height: 100%; animation-delay: 1.5s; }

@keyframes core-ring {
  0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.35); }
}

.hub-node {
  position: absolute;
  z-index: 2;
  display: grid;
  gap: 2px;
  justify-items: center;
  transform: translate(-50%, -50%);
  text-align: center;
}

.hub-node .hex {
  display: grid;
  place-content: center;
  width: 44px;
  height: 48px;
  background: linear-gradient(180deg, rgba(46, 123, 255, 0.3), rgba(8, 20, 47, 0.9));
  border: 1px solid rgba(53, 199, 255, 0.65);
  color: #d5efff;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  filter: drop-shadow(0 0 12px rgba(53, 199, 255, 0.45));
  animation: hex-breathe 3.8s ease-in-out infinite;
}

@keyframes hex-breathe {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(53, 199, 255, 0.3)); }
  50% { filter: drop-shadow(0 0 16px rgba(53, 199, 255, 0.65)); }
}

.hub-node span {
  max-width: 118px;
  color: #fff;
  font-size: 10.5px;
  font-weight: 800;
  white-space: nowrap;
  text-shadow: 0 0 10px rgba(46, 123, 255, 0.8);
}

.hub-node small {
  color: var(--bs-cyan);
  font-size: 8.5px;
  opacity: 0.9;
}

/* 中枢运行状态 */
.hub-status {
  position: absolute;
  bottom: 12px;
  left: 50%;
  z-index: 2;
  display: grid;
  gap: 4px;
  min-width: 250px;
  padding: 9px 13px;
  border: 1px solid rgba(62, 158, 255, 0.35);
  border-radius: 8px;
  background: rgba(6, 15, 36, 0.88);
  transform: translateX(-50%);
  box-shadow: 0 0 22px rgba(46, 123, 255, 0.2);
}

.hub-status h4 {
  margin: 0 0 2px;
  color: var(--bs-cyan);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.hub-status > div {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 7px;
  align-items: center;
  font-size: 10px;
}

.hub-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--bs-cyan);
  box-shadow: 0 0 6px var(--bs-cyan);
  animation: dot-blink 1.6s ease-in-out infinite alternate;
}

@keyframes dot-blink {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.hub-status span { color: var(--bs-ink-2); }

.hub-status b {
  color: #fff;
  font-family: var(--font-mono);
}

/* 五库 */
.asset-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 11px;
}

.asset-card {
  display: grid;
  gap: 7px;
}

.asset-card > header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.asset-orb {
  display: grid;
  place-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid color-mix(in srgb, var(--tone), transparent 45%);
  border-radius: 8px;
  background: radial-gradient(circle at 34% 28%, color-mix(in srgb, var(--tone), transparent 62%), rgba(8, 20, 47, 0.8));
  color: #fff;
  filter: drop-shadow(0 0 9px color-mix(in srgb, var(--tone), transparent 45%));
  animation: hex-breathe 4s ease-in-out infinite;
}

.asset-card strong {
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.asset-rows {
  display: grid;
  gap: 3px;
}

.asset-rows > div {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}

.asset-rows span { color: var(--bs-ink-3); }

.asset-rows b {
  color: var(--bs-ink-1);
  font-family: var(--font-mono);
  font-weight: 700;
}

.asset-more {
  padding: 4px 0 0;
  border: 0;
  border-top: 1px solid rgba(62, 158, 255, 0.14);
  background: transparent;
  color: var(--tone, var(--bs-cyan));
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s ease;
}

.asset-more:hover { opacity: 0.75; }

/* ========== 右列 ========== */
.student-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
}

.student-total span {
  display: block;
  color: var(--bs-ink-3);
  font-size: 10px;
}

.student-total strong {
  color: #fff;
  font-family: var(--font-mono);
  font-size: 27px;
  font-weight: 800;
  text-shadow: 0 0 18px rgba(62, 158, 255, 0.55);
}

.student-total strong i {
  margin-left: 3px;
  font-size: 11px;
  font-style: normal;
  opacity: 0.65;
}

.student-rates {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}

.student-rates > div {
  padding: 7px 6px;
  border: 1px solid rgba(62, 158, 255, 0.16);
  border-radius: 6px;
  background: rgba(62, 158, 255, 0.05);
  text-align: center;
}

.student-rates b {
  display: block;
  color: var(--bs-ok);
  font-family: var(--font-mono);
  font-size: 13px;
}

.student-rates span {
  color: var(--bs-ink-3);
  font-size: 9px;
}

/* 掌握分析 */
.mastery-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: end;
}

.bar-chart {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  align-items: end;
  height: 96px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar-col i {
  flex: none;
  width: 70%;
  border-radius: 2px 2px 0 0;
  background: linear-gradient(180deg, var(--bs-cyan), rgba(62, 158, 255, 0.35));
  box-shadow: 0 0 8px rgba(62, 158, 255, 0.35);
  transform-origin: bottom center;
}

.big-screen.live .bar-col i {
  animation: bar-rise 0.9s cubic-bezier(0.2, 0.9, 0.3, 1) 1.1s both;
}

@keyframes bar-rise {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.bar-col span {
  color: var(--bs-ink-3);
  font-size: 8.5px;
  white-space: nowrap;
}

.mini-radar {
  width: 108px;
  height: 108px;
}

.radar-grid {
  fill: none;
  stroke: rgba(62, 158, 255, 0.2);
  stroke-width: 1;
}

.radar-value {
  fill: rgba(62, 158, 255, 0.26);
  stroke: var(--bs-cyan);
  stroke-width: 1.5;
  filter: drop-shadow(0 0 7px rgba(53, 199, 255, 0.6));
}

.mini-radar text {
  fill: var(--bs-ink-3);
  font-size: 8px;
}

/* 模型调用统计 */
.model-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}

.model-stats > div {
  padding: 6px 7px;
  border: 1px solid rgba(62, 158, 255, 0.14);
  border-radius: 6px;
  background: rgba(62, 158, 255, 0.05);
}

.model-stats span {
  display: block;
  color: var(--bs-ink-3);
  font-size: 8.5px;
  white-space: nowrap;
}

.model-stats strong {
  display: block;
  margin: 2px 0;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 13px;
  text-shadow: 0 0 10px rgba(62, 158, 255, 0.4);
}

.model-stats em {
  color: var(--bs-ink-3);
  font-size: 8.5px;
  font-style: normal;
}

.model-stats em.good { color: var(--bs-ok); }

.combo-chart svg {
  width: 100%;
  height: 88px;
}

.combo-bar {
  fill: rgba(62, 158, 255, 0.55);
}

.big-screen.live .combo-bar {
  transform-origin: center bottom;
  animation: bar-rise 0.9s cubic-bezier(0.2, 0.9, 0.3, 1) 1.2s both;
}

/* 区域分布 */
.region-row {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 10px;
  align-items: center;
}

.region-dots {
  width: 96px;
  height: 96px;
}

.region-dot {
  fill: var(--bs-cyan);
  opacity: var(--a, 0.4);
  animation: region-blink 3s ease-in-out var(--dd, 0s) infinite;
}

@keyframes region-blink {
  0%, 100% { opacity: calc(var(--a, 0.4) * 0.5); }
  50% { opacity: var(--a, 0.4); }
}

/* ========== 流程链 ========== */
.pipeline-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border: 1px solid var(--bs-line);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(62, 158, 255, 0.07), transparent 30%),
    rgba(8, 20, 47, 0.72);
  animation: card-breathe 4.6s ease-in-out 2.4s infinite;
}

.pipe-step {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.pipe-icon {
  display: grid;
  place-content: center;
  width: 29px;
  height: 29px;
  border: 1px solid rgba(53, 199, 255, 0.5);
  border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, rgba(46, 123, 255, 0.4), rgba(8, 20, 47, 0.8));
  color: #d5efff;
  box-shadow: 0 0 12px rgba(46, 123, 255, 0.35);
  animation: hex-breathe 4.2s ease-in-out infinite;
}

.pipe-step b {
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.pipe-arrow {
  flex: 1;
  min-width: 20px;
  height: 2px;
  background: linear-gradient(90deg, rgba(53, 199, 255, 0.7), rgba(143, 123, 255, 0.7));
  clip-path: polygon(0 40%, 82% 40%, 82% 0, 100% 50%, 82% 100%, 82% 60%, 0 60%);
  transform: scaleY(3.4);
}

/* ========== 开机启动序列 ========== */
.boot-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-content: center;
  overflow: hidden;
  border-radius: inherit;
  background:
    radial-gradient(680px 380px at 50% 44%, rgba(46, 123, 255, 0.14), transparent 66%),
    linear-gradient(180deg, #040b1d 0%, #061129 100%);
}

.boot-box {
  display: grid;
  gap: 9px;
  justify-items: center;
  text-align: center;
}

.boot-box strong {
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-shadow: 0 0 24px rgba(53, 199, 255, 0.8);
}

.boot-box small {
  color: #6fa0d8;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.5em;
}

.boot-bar {
  width: 300px;
  height: 4px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(62, 158, 255, 0.14);
}

.boot-bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--bs-blue), var(--bs-cyan));
  box-shadow: 0 0 14px rgba(53, 199, 255, 0.9);
  transition: width 0.05s linear;
}

.boot-box em {
  color: var(--bs-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.boot-scan {
  position: absolute;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(53, 199, 255, 0.85), transparent);
  box-shadow: 0 0 22px rgba(53, 199, 255, 0.7);
  animation: boot-scanline 1.15s ease-in-out infinite alternate;
}

@keyframes boot-scanline {
  from { top: 12%; }
  to { top: 88%; }
}

.boot-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.boot-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

/* ========== 降级 ========== */
@media (prefers-reduced-motion: reduce) {
  .bs-card,
  .big-screen::after,
  .hub-sweep,
  .pulse-dot,
  .gauge-ring,
  .hub-platform.p1,
  .hub-beam,
  .hub-node .hex,
  .asset-orb,
  .pipe-icon,
  .pipeline-row,
  .region-dot,
  .kpi-chip.danger,
  .big-screen.live .bar-col i,
  .big-screen.live .combo-bar,
  .big-screen.live .line-blue,
  .big-screen.live .line-gold {
    animation: none !important;
  }
}

/* ========== 响应式 ========== */
@media (max-width: 1500px) {
  .bs-main {
    grid-template-columns: 1fr 1fr;
  }

  .center-col {
    grid-column: 1 / -1;
    grid-row: 1;
  }
}

@media (max-width: 1100px) {
  .bs-main {
    grid-template-columns: 1fr;
  }

  .asset-row,
  .center-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .bs-head {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .head-side-info.right { justify-self: start; }

  .title-wing { display: none; }

  .asset-row,
  .center-kpis,
  .gauge-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
