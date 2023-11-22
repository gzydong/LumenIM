import { computed } from 'vue'
import { useNotifyStore } from '@/store'
import { overrides } from '@/constant/theme'
import { darkTheme } from 'naive-ui'

export function useThemeMode() {
  const notifyStore = useNotifyStore()

  const getDarkTheme = computed(() => {
    let theme = notifyStore.darkTheme ? 'dark' : 'light'

    document.getElementsByTagName('html')[0].dataset.theme = theme
    document.getElementsByTagName('html')[0].style = ''

    return notifyStore.darkTheme ? darkTheme : undefined
  })

  const getThemeOverride = computed(() => {
    if (notifyStore.darkTheme) {
      overrides.common.bodyColor = '#202124'
      overrides.common.baseColor = '#ffffff'
    }

    return overrides
  })

  return { getDarkTheme, getThemeOverride }
}
