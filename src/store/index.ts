import { defineStore } from 'pinia'
import { ref } from 'vue'

const APP_SETTINGS_KEY = 'app-settings'
const COMPANION_RESET_MS: Record<Exclude<CompanionState, 'idle'>, number> = {
  thinking: 900,
  typing: 1200,
  cheer: 1400,
  error: 1600,
}

export type CompanionState = 'idle' | 'thinking' | 'typing' | 'cheer' | 'error'
export type ThemeMode = 'dark' | 'light'
export type Language = 'zh' | 'en'
export type ParticleDensity = 'performance' | 'balanced' | 'quality'
export type BlurStrength = 'weak' | 'medium' | 'strong'
export type PetStyle = 'peachu' | 'live2d'
export type ResourcePreference = 'video' | 'text' | 'exercise'

export interface AppSettings {
  currentTheme: ThemeMode
  language: Language
  desktopPetEnabled: boolean
  petStyle: PetStyle
  inkMouseEnabled: boolean
  particleBgEnabled: boolean
  particleDensity: ParticleDensity
  blurStrength: BlurStrength
  notifications: boolean
  soundEnabled: boolean
  emailDigest: boolean
  studyReminder: boolean
  reminderTime: string
  preferredResource: ResourcePreference
  learningGoal: string
  shareData: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  currentTheme: 'dark',
  language: 'zh',
  desktopPetEnabled: true,
  petStyle: 'peachu',
  inkMouseEnabled: true,
  particleBgEnabled: true,
  particleDensity: 'balanced',
  blurStrength: 'medium',
  notifications: true,
  soundEnabled: true,
  emailDigest: true,
  studyReminder: true,
  reminderTime: '20:00',
  preferredResource: 'video',
  learningGoal: '深度学习工程师',
  shareData: false,
}

function loadPersistedSettings(): Partial<AppSettings> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(APP_SETTINGS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<AppSettings>
  } catch {
    return {}
  }
}

/** 将 blurStrength 映射为 CSS 使用的 px 数值 */
export const BLUR_PX: Record<BlurStrength, number> = {
  weak: 10,
  medium: 20,
  strong: 30,
}

/** 将 particleDensity 映射为粒子数量 */
export const PARTICLE_COUNT: Record<ParticleDensity, { cosmic: number; genre: number }> = {
  performance: { cosmic: 800, genre: 680 },
  balanced: { cosmic: 1380, genre: 1200 },
  quality: { cosmic: 1650, genre: 1450 },
}

export const useAppStore = defineStore('app', () => {
  const persisted = loadPersistedSettings()
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS, ...persisted })

  const currentTheme = ref<ThemeMode>(settings.value.currentTheme)
  const language = ref<Language>(settings.value.language)
  const desktopPetEnabled = ref<boolean>(settings.value.desktopPetEnabled)
  const petStyle = ref<PetStyle>(settings.value.petStyle)
  const inkMouseEnabled = ref<boolean>(settings.value.inkMouseEnabled)
  const particleBgEnabled = ref<boolean>(settings.value.particleBgEnabled)
  const particleDensity = ref<ParticleDensity>(settings.value.particleDensity)
  const blurStrength = ref<BlurStrength>(settings.value.blurStrength)
  const notifications = ref<boolean>(settings.value.notifications)
  const soundEnabled = ref<boolean>(settings.value.soundEnabled)
  const emailDigest = ref<boolean>(settings.value.emailDigest)
  const studyReminder = ref<boolean>(settings.value.studyReminder)
  const reminderTime = ref<string>(settings.value.reminderTime)
  const preferredResource = ref<ResourcePreference>(settings.value.preferredResource)
  const learningGoal = ref<string>(settings.value.learningGoal)
  const shareData = ref<boolean>(settings.value.shareData)

  const companionState = ref<CompanionState>('idle')
  const activeAiRequests = ref(0)
  let companionTimeout: ReturnType<typeof setTimeout> | null = null

  function persistSettings() {
    if (typeof window === 'undefined') return
    const snapshot: AppSettings = {
      currentTheme: currentTheme.value,
      language: language.value,
      desktopPetEnabled: desktopPetEnabled.value,
      petStyle: petStyle.value,
      inkMouseEnabled: inkMouseEnabled.value,
      particleBgEnabled: particleBgEnabled.value,
      particleDensity: particleDensity.value,
      blurStrength: blurStrength.value,
      notifications: notifications.value,
      soundEnabled: soundEnabled.value,
      emailDigest: emailDigest.value,
      studyReminder: studyReminder.value,
      reminderTime: reminderTime.value,
      preferredResource: preferredResource.value,
      learningGoal: learningGoal.value,
      shareData: shareData.value,
    }
    window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(snapshot))
  }

  function setDesktopPetEnabled(enabled: boolean) {
    desktopPetEnabled.value = enabled
    persistSettings()
  }

  function setPetStyle(style: PetStyle) {
    petStyle.value = style
    persistSettings()
  }

  function setInkMouseEnabled(enabled: boolean) {
    inkMouseEnabled.value = enabled
    persistSettings()
  }

  function setParticleBgEnabled(enabled: boolean) {
    particleBgEnabled.value = enabled
    persistSettings()
  }

  function setParticleDensity(density: ParticleDensity) {
    particleDensity.value = density
    persistSettings()
  }

  function setBlurStrength(strength: BlurStrength) {
    blurStrength.value = strength
    persistSettings()
  }

  function setTheme(theme: ThemeMode) {
    currentTheme.value = theme
    persistSettings()
  }

  function setLanguage(lang: Language) {
    language.value = lang
    persistSettings()
  }

  function setNotifications(enabled: boolean) {
    notifications.value = enabled
    persistSettings()
  }

  function setSoundEnabled(enabled: boolean) {
    soundEnabled.value = enabled
    persistSettings()
  }

  function setEmailDigest(enabled: boolean) {
    emailDigest.value = enabled
    persistSettings()
  }

  function setStudyReminder(enabled: boolean) {
    studyReminder.value = enabled
    persistSettings()
  }

  function setReminderTime(time: string) {
    reminderTime.value = time
    persistSettings()
  }

  function setPreferredResource(pref: ResourcePreference) {
    preferredResource.value = pref
    persistSettings()
  }

  function setLearningGoal(goal: string) {
    learningGoal.value = goal
    persistSettings()
  }

  function setShareData(enabled: boolean) {
    shareData.value = enabled
    persistSettings()
  }

  function clearCompanionTimeout() {
    if (!companionTimeout) return
    clearTimeout(companionTimeout)
    companionTimeout = null
  }

  function setCompanionIdle() {
    clearCompanionTimeout()
    companionState.value = 'idle'
  }

  function pulseCompanion(state: Exclude<CompanionState, 'idle'>, duration = COMPANION_RESET_MS[state]) {
    if (!desktopPetEnabled.value) return
    if (activeAiRequests.value > 0 && state === 'thinking') return

    clearCompanionTimeout()
    companionState.value = state
    companionTimeout = setTimeout(() => {
      companionState.value = activeAiRequests.value > 0 ? 'typing' : 'idle'
      companionTimeout = null
    }, duration)
  }

  function triggerPageLoading() {
    pulseCompanion('thinking')
  }

  function beginAiRequest() {
    if (!desktopPetEnabled.value) return

    activeAiRequests.value += 1
    clearCompanionTimeout()
    companionState.value = 'typing'
  }

  function finishAiRequest(success: boolean) {
    activeAiRequests.value = Math.max(0, activeAiRequests.value - 1)
    pulseCompanion(success ? 'cheer' : 'error')
  }

  return {
    // state
    currentTheme,
    language,
    desktopPetEnabled,
    petStyle,
    inkMouseEnabled,
    particleBgEnabled,
    particleDensity,
    blurStrength,
    notifications,
    soundEnabled,
    emailDigest,
    studyReminder,
    reminderTime,
    preferredResource,
    learningGoal,
    shareData,
    companionState,
    activeAiRequests,
    // actions
    setDesktopPetEnabled,
    setPetStyle,
    setInkMouseEnabled,
    setParticleBgEnabled,
    setParticleDensity,
    setBlurStrength,
    setTheme,
    setLanguage,
    setNotifications,
    setSoundEnabled,
    setEmailDigest,
    setStudyReminder,
    setReminderTime,
    setPreferredResource,
    setLearningGoal,
    setShareData,
    setCompanionIdle,
    triggerPageLoading,
    beginAiRequest,
    finishAiRequest,
  }
})
