import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useSettingsStore } from '@/store'
import { overrides } from '@/constant/theme'
import { darkTheme } from 'naive-ui'

const themeModeKey = 'theme-mode'

export function useThemeMode() {
  const settingsStore = useSettingsStore()
  const sysThemeMode = ref(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  const themeMode = computed(() => {
    const theme = settingsStore.themeMode
    return theme === 'auto' ? sysThemeMode.value : theme
  })

  const applyThemeToDOM = (mode: string) => {
    document.documentElement.setAttribute(themeModeKey, mode)
  }

  const getDarkTheme = computed(() => {
    return themeMode.value === 'dark' ? darkTheme : undefined
  })

  const getThemeOverride = computed(() => {
    if (themeMode.value === 'dark') {
      // overrides.common.bodyColor = '#202124'
      overrides.common.bodyColor = '#1e1e1e'
    }

    return overrides
  })

  const updateSysThemeMode = (e: any) => {
    sysThemeMode.value = e.matches ? 'dark' : 'light'
  }

  watchEffect(() => {
    applyThemeToDOM(themeMode.value)
    settingsStore.currentThemeMode = themeMode.value
  })

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateSysThemeMode)
  })

  onUnmounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.removeEventListener('change', updateSysThemeMode)
  })

  return { getDarkTheme, getThemeOverride }
}
