/**
 * 高级组件（Advanced Components）
 * 复杂的布局和交互组件，提供高级功能和复杂场景支持
 */

// 布局组件（只导出命令式 API）
export { NhaiSplitPanelCommand } from './SplitPanel'

// 展示组件（只导出命令式 API）
export { NhaiCardCommand } from './Card'

// 业务导航组件（放在高级组件中，只导出命令式 API）
export { NhaiBreadcrumbCommand } from './Breadcrumb'
export { NhaiTabsCommand } from './Tabs'
export { NhaiMenuBarCommand } from './MenuBar'

// 重新导出类型
export type { BreadcrumbItem } from './Breadcrumb'
export type { TabItem } from './Tabs'
export type { MenuItem } from './MenuBar'

