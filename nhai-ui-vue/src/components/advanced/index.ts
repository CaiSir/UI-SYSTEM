/**
 * 高级组件（Advanced Components）
 * 复杂的布局和交互组件，提供高级功能和复杂场景支持
 */

// 布局组件
export { VueSplitPanel, NhaiSplitPanelCommand } from './SplitPanel'

// 展示组件
export { VueCard, NhaiCardCommand } from './Card'

// 业务导航组件（放在高级组件中）
export { VueBreadcrumb, NhaiBreadcrumbCommand } from './Breadcrumb'
export { VueTabs, NhaiTabsCommand } from './Tabs'
export { VueMenuBar, NhaiMenuBarCommand } from './MenuBar'

// 重新导出类型
export type { BreadcrumbItem } from './Breadcrumb'
export type { TabItem } from './Tabs'
export type { MenuItem } from './MenuBar'

