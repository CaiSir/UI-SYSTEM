/**
 * 组件统一导出入口
 * 按基础组件、高级组件、业务组件分类
 */

// 导出分类组件
export * from './basic'
export * from './advanced'
// business 目录当前为空，暂不导出

// 命令式 API 导出（只导出命令式 API，不导出 Vue 组件）
// 基础组件 - 表单组件
export { NhaiButtonCommand, LightweightButtonCommand } from './basic/Button'
export { NhaiInputCommand } from './basic/Input'
export { NhaiSelectCommand } from './basic/Select'
export { NhaiSwitchCommand } from './basic/Switch'
export { NhaiCheckboxCommand } from './basic/Checkbox'

// 基础组件 - 布局组件
export { NhaiGridCommand } from './basic/Grid'
export { NhaiRowCommand } from './basic/Row'
export { NhaiColCommand } from './basic/Col'
export { NhaiContainerCommand } from './basic/Container'
export { AbsolutePanelCommand } from './basic/AbsolutePanel'
export { NhaiLayoutBuilderCommand } from './basic/LayoutBuilder'

// 基础组件 - 容器组件
export { NhaiDialogCommand } from './basic/Dialog'
export { NhaiWidgetCommand } from './basic/Widget'

// 高级组件
export { NhaiSplitPanelCommand } from './advanced/SplitPanel'
export { NhaiCardCommand } from './advanced/Card'
export { NhaiBreadcrumbCommand } from './advanced/Breadcrumb'
export { NhaiTabsCommand } from './advanced/Tabs'
export { NhaiMenuBarCommand } from './advanced/MenuBar'

// 重新导出类型
export type { SelectOption } from './basic/Select'
export type { GridOptions, GridEvents, GridItemConfig } from './basic/Grid'
export type { RowOptions, RowEvents } from './basic/Row'
export type { ColOptions, ColEvents, ResponsiveProps } from './basic/Col'
export type { LayoutItem } from './basic/LayoutBuilder'
export type { AbsoluteItem } from './basic/AbsolutePanel'
export type { MenuItem as WidgetMenuItem } from './basic/Widget'
export type { BreadcrumbItem } from './advanced/Breadcrumb'
export type { TabItem } from './advanced/Tabs'
export type { MenuItem } from './advanced/MenuBar'

