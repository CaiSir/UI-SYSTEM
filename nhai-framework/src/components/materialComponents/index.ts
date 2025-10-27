/**
 * NHAI Material Components 导出文件
 * 统一导出所有 Material Design 组件
 * 
 * @author NHAI Framework Team
 * @version 1.0.0
 * @since 2024
 */

// ========== 基础组件导出 ==========
export { MaterialButton } from './basic/Button'
export { MaterialInput } from './basic/Input'
export { MaterialSelect } from './basic/Select'
export { MaterialCheckbox } from './basic/Checkbox'
export { MaterialRadio } from './basic/Radio'
export { MaterialSwitch } from './basic/Switch'
export { MaterialSlider } from './basic/Slider'
export { MaterialRate } from './basic/Rate'

// ========== 数据展示组件导出 ==========
export { MaterialTable } from './data/Table'
export { MaterialList } from './data/List'
export { MaterialCard } from './data/Card'
export { MaterialTag } from './data/Tag'
export { MaterialBadge } from './data/Badge'
export { MaterialAvatar } from './data/Avatar'

// ========== 布局组件导出 ==========
export { MaterialContainer } from './layout/Container'
export { MaterialGrid } from './layout/Grid'
export { MaterialSplitPanel } from './layout/SplitPanel'
export { MaterialCollapse } from './layout/Collapse'
export { MaterialDirectorySidebar } from './layout/DirectorySidebar'

// ========== 导航组件导出 ==========
export { MaterialMenuBar } from './menubar/MaterialMenuBar'
export { MaterialMenu } from './navigation/Menu'
export { MaterialTabs } from './navigation/Tabs'
export { MaterialBreadcrumb } from './navigation/Breadcrumb'
export { MaterialTableOfContents } from './navigation/TableOfContents'
export { MaterialTree } from './navigation/Tree'

// ========== 工具栏组件导出 ==========
export { MaterialToolbar } from './toolbar/MaterialToolbar'

// ========== 反馈组件导出 ==========
export { MaterialDialog } from './feedback/Dialog'
export { MaterialMessage } from './feedback/Message'
export { MaterialLoading } from './feedback/Loading'

// ========== 工具组件导出 ==========
export { MaterialTooltip } from './utility/Tooltip'
export { MaterialColorPicker } from './utility/ColorPicker'

// ========== 枚举类型导出 ==========
export { ButtonType, ButtonSize, ButtonColor } from './basic/Button'
export { InputType, InputSize, InputState } from './basic/Input'
export { SelectType, SelectSize, SelectState } from './basic/Select'
export { MenuBarLayoutType, MenuItemType } from './menubar/MaterialMenuBar'
export { ToolbarLayoutType, ToolbarAlignment } from './toolbar/MaterialToolbar'

// MenuItemType 现在包含：
// - ITEM: 普通菜单项
// - SUBMENU: 子菜单
// - SEPARATOR: 分隔符
// - CHECKBOX: 复选框菜单项
// - RADIO: 单选菜单项
// - GROUP: 菜单组
// - WIDGET: 嵌入控件 (新增)

// ========== 接口类型导出 ==========
export type { SelectOption, CascadeOption, TreeOption } from './basic/Select'
export type { TableColumn, TableData } from './data/Table'
export type { ListItem } from './data/List'
export type { MenuItem as NavigationMenuItem } from './navigation/Menu'
export type { BreadcrumbItem } from './navigation/Breadcrumb'
export type { TOCItem } from './navigation/TableOfContents'
export type { TreeNode } from './navigation/Tree'
export type { DirectoryItem } from './layout/DirectorySidebar'
export type { MenuItem, MenuBarConfig } from './menubar/MaterialMenuBar'
export type { ToolbarItem, ToolbarGroup, ToolbarConfig } from './toolbar/MaterialToolbar'