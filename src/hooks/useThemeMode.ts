import { computed } from 'vue'
import { useSettingsStore } from '@/store'
import { overrides } from '@/constant/theme'
import { darkTheme } from 'naive-ui'

export function useThemeMode() {
  const settingsStore = useSettingsStore()

  const getDarkTheme = computed(() => {
    const theme = settingsStore.darkTheme ? 'dark' : 'light'

    document.documentElement.setAttribute('theme-mode', theme)

    return settingsStore.darkTheme ? darkTheme : undefined
  })

  const getThemeOverride = computed(() => {
    if (settingsStore.darkTheme) {
      overrides.common.bodyColor = '#202124'
      overrides.common.baseColor = '#ffffff'
    }

    return overrides
  })

  return { getDarkTheme, getThemeOverride }
}
