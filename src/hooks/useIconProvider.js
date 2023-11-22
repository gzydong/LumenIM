import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'

export function useIconProvider() {
  IconProvider({
    ...DEFAULT_ICON_CONFIGS,
    theme: 'outline',
    size: 24,
    strokeWidth: 3,
    strokeLinejoin: 'bevel'
  })
}
