import { GlobalThemeOverrides } from 'naive-ui'

// 主题配置
export const overrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1890ff',
    primaryColorHover: '#1890ff',
    primaryColorPressed: '#1890ff',
    primaryColorSuppl: '#1890ff',
    bodyColor: '#ffffff'
  },
  Dialog: {
    borderRadius: '10px'
  }
}

export const lightThemeOverrides: GlobalThemeOverrides = {
  ...overrides
}

export const darkThemeOverrides: GlobalThemeOverrides = {
  ...overrides,
  common: {
    ...overrides.common,
    bodyColor: '#1e1e1e'
  }
}
