export interface MenuItem {
  id: string | number
  label: string
  icon?: string | object  // 支持字符串图标（emoji/文本）或组件对象
  disabled?: boolean
  children?: MenuItem[]
}

