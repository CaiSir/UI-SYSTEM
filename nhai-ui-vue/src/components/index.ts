/**
 * 组件统一导出入口
 * 按基础组件、高级组件、业务组件分类
 */

// 导出分类组件
export * from './basic'
export * from './advanced'
// business 目录当前为空，暂不导出

// 为了向后兼容，保留原有的直接导出方式
// 基础组件 - 表单组件
export { VueButton, NhaiButtonCommand, LightweightButtonCommand } from './basic/Button'
export { VueInput, NhaiInputCommand } from './basic/Input'
export { VueSelect, NhaiSelectCommand } from './basic/Select'
export { VueSwitch, NhaiSwitchCommand } from './basic/Switch'
export { VueCheckbox, NhaiCheckboxCommand } from './basic/Checkbox'

// 基础组件 - 布局组件
export { VueGrid, NhaiGridCommand } from './basic/Grid'
export { VueRow, NhaiRowCommand } from './basic/Row'
export { VueCol, NhaiColCommand } from './basic/Col'
export { VueContainer, NhaiContainerCommand } from './basic/Container'
export { VueAbsolutePanel, AbsolutePanelCommand } from './basic/AbsolutePanel'
export { VueLayoutBuilder, NhaiLayoutBuilderCommand } from './basic/LayoutBuilder'

// 基础组件 - 容器组件
export { VueDialog, NhaiDialogCommand } from './basic/Dialog'
export { Widget, NhaiWidgetCommand } from './basic/Widget'

// 高级组件
export { VueSplitPanel, NhaiSplitPanelCommand } from './advanced/SplitPanel'
export { VueCard, NhaiCardCommand } from './advanced/Card'
export { VueBreadcrumb, NhaiBreadcrumbCommand } from './advanced/Breadcrumb'
export { VueTabs, NhaiTabsCommand } from './advanced/Tabs'
export { VueMenuBar, NhaiMenuBarCommand } from './advanced/MenuBar'

// 为了向后兼容示例文件，添加 Vue*Command 别名（指向 Nhai*Command）
export { NhaiButtonCommand as VueButtonCommand } from './basic/Button'
export { NhaiInputCommand as VueInputCommand } from './basic/Input'
export { NhaiSelectCommand as VueSelectCommand } from './basic/Select'
export { NhaiSwitchCommand as VueSwitchCommand } from './basic/Switch'
export { NhaiCheckboxCommand as VueCheckboxCommand } from './basic/Checkbox'
export { NhaiGridCommand as VueGridCommand } from './basic/Grid'
export { NhaiRowCommand as VueRowCommand } from './basic/Row'
export { NhaiColCommand as VueColCommand } from './basic/Col'
export { NhaiContainerCommand as VueContainerCommand } from './basic/Container'
export { AbsolutePanelCommand as VueAbsolutePanelCommand } from './basic/AbsolutePanel'
export { NhaiLayoutBuilderCommand as VueLayoutBuilderCommand } from './basic/LayoutBuilder'
export { NhaiDialogCommand as VueDialogCommand } from './basic/Dialog'
export { NhaiWidgetCommand as VueWidgetCommand } from './basic/Widget'
export { NhaiSplitPanelCommand as VueSplitPanelCommand } from './advanced/SplitPanel'
export { NhaiCardCommand as VueCardCommand } from './advanced/Card'
export { NhaiBreadcrumbCommand as VueBreadcrumbCommand } from './advanced/Breadcrumb'
export { NhaiTabsCommand as VueTabsCommand } from './advanced/Tabs'
export { NhaiMenuBarCommand as VueMenuBarCommand } from './advanced/MenuBar'

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

