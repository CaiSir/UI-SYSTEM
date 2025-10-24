/**
 * Material Components 统一导出
 * 基于 Materialize CSS 框架的命令式 API 实现
 */

// 基础交互组件（8个）
export * from './basic'

// 数据展示组件（6个）
export * from './data'

// 布局容器组件（4个）
export * from './layout'

// 导航组件（3个）
export * from './navigation'

// 反馈组件（3个）
export * from './feedback'

// 工具组件（2个）
export * from './utility'

// 工具栏组件
export * from './toolbar'

// 菜单栏组件
export { MaterialMenuBar, MenuItemType } from './menubar'

// 重新导出所有组件类
export {
  // 基础交互组件
  MaterialButton,
  MaterialInput,
  MaterialSelect,
  MaterialCheckbox,
  MaterialRadio,
  MaterialSwitch,
  MaterialSlider,
  MaterialRate
} from './basic'

export {
  // 数据展示组件
  MaterialTable,
  MaterialList,
  MaterialCard,
  MaterialTag,
  MaterialBadge,
  MaterialAvatar
} from './data'

export {
  // 布局容器组件
  MaterialContainer,
  MaterialGrid,
  MaterialSplitPanel,
  MaterialCollapse
} from './layout'

export {
  // 导航组件
  MaterialMenu,
  MaterialTabs,
  MaterialBreadcrumb
} from './navigation'

export {
  // 反馈组件
  MaterialMessage,
  MaterialDialog,
  MaterialLoading
} from './feedback'

export {
  // 工具组件
  MaterialTooltip,
  MaterialColorPicker
} from './utility'

export {
  // 工具栏组件
  MaterialToolbar
} from './toolbar'

// 重新导出所有类型
export type {
  SelectOption
} from './basic'

export type {
  TableColumn,
  TableData,
  ListItem
} from './data'

export type {
  GridItem,
  CollapsePanel
} from './layout'

export type {
  MenuItem as NavigationMenuItem,
  TabItem,
  BreadcrumbItem
} from './navigation'

export type {
  MessageConfig,
  DialogAction
} from './feedback'

export type {
  ToolbarItem,
  ToolbarConfig,
  ToolbarLayoutType,
  ToolbarAlignment
} from './toolbar'

export type {
  MenuItem as MenuBarMenuItem,
  MenuBarConfig,
  MenuBarLayoutType
} from './menubar'
