/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Live2DPetDebugApi {
  getPresetId: () => string
  getState: () => string
  getMotionCapability: () => {
    groups: Record<string, number>
    groupNames: string[]
    totalMotions: number
  }
  getMotionHitState: () => {
    source: 'state' | 'manual'
    requestedState: string
    requestedMotionGroup: string | null
    requestedMotionIndex: number | null
    hit: boolean
    fallbackUsed: boolean
    fallbackReason: string | null
    finalMotionKey: string
  }
  getRendererStatus?: () => {
    ready: boolean
    live2dFailed: boolean
    canvasCount: number
  }
  setPresetId: (presetId: string) => void
  setState: (state: string) => void
  testMotion: (groupName: string, index: number) => Promise<boolean>
}

interface Window {
  __live2dPetDebug?: Live2DPetDebugApi
}
