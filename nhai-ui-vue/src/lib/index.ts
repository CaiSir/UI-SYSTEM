export { BaseCommand } from './BaseCommand'
export { ComponentRegistry, Component } from './ComponentRegistry'
export { UIHelpers } from './UIHelpers'

// 导出便捷函数
export { 
  createText, 
  createSeparator, 
  createBlankLine
} from './UIHelpers'

// 导出类型
export type {
  CommandRenderResult,
  Option
} from './types'

// 重新导出组件类型（避免重复）
export type {
  SelectOption,
  BreadcrumbItem,
  TabItem,
  MenuItem,
  LayoutItem,
  AbsoluteItem
} from '../components'

