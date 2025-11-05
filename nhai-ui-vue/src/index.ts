/**
 * NHAI UI Vue - Vue 3 + Element Plus Component Library
 * 
 * 统一导出入口
 */

// 导入 Element Plus 样式
import 'element-plus/dist/index.css'

// 导入所有组件和库
import * as Components from './components'
import * as BasicComponents from './components/basic'
import * as AdvancedComponents from './components/advanced'
import * as Lib from './lib'

// ==================== 命名空间定义 ====================
/**
 * NHAI UI Vue 命名空间对象
 * 提供按功能分类的组件组织方式
 * 
 * @example
 * ```typescript
 * import { NHAIUIVue } from 'nhai-ui-vue'
 * 
 * const button = new NHAIUIVue.Components.Button('按钮')
 * const row = new NHAIUIVue.Layout.Row()
 * const col = new NHAIUIVue.Layout.Col({ span: 12 })
 * ```
 */
// 使用类型断言避免 TS4023 错误（Vue 组件 Props 类型无法在声明文件中命名）
export const NHAIUIVue = {
  // 基础组件（Basic Components）
  Basic: {
    // 表单组件
    Button: BasicComponents.NhaiButtonCommand,
    Input: BasicComponents.NhaiInputCommand,
    Select: BasicComponents.NhaiSelectCommand,
    Switch: BasicComponents.NhaiSwitchCommand,
    Checkbox: BasicComponents.NhaiCheckboxCommand,
    // 布局组件
    Grid: BasicComponents.NhaiGridCommand,
    Row: BasicComponents.NhaiRowCommand,
    Col: BasicComponents.NhaiColCommand,
    Container: BasicComponents.NhaiContainerCommand,
    AbsolutePanel: BasicComponents.AbsolutePanelCommand,
    LayoutBuilder: BasicComponents.NhaiLayoutBuilderCommand,
    // 容器组件
    Dialog: BasicComponents.NhaiDialogCommand,
    Widget: BasicComponents.NhaiWidgetCommand,
  },
  
  // 高级组件（Advanced Components）
  Advanced: {
    // 布局组件
    SplitPanel: AdvancedComponents.NhaiSplitPanelCommand,
    // 展示组件
    Card: AdvancedComponents.NhaiCardCommand,
    // 导航组件
    Breadcrumb: AdvancedComponents.NhaiBreadcrumbCommand,
    Tabs: AdvancedComponents.NhaiTabsCommand,
    MenuBar: AdvancedComponents.NhaiMenuBarCommand,
  },
  
  // 业务组件（Business Components）
  Business: {
    // 当前业务组件目录为空，未来可在此扩展
  },
  
  // 向后兼容：保留原有的分类方式
  Components: {
    Button: Components.NhaiButtonCommand,
    Input: Components.NhaiInputCommand,
    Select: Components.NhaiSelectCommand,
    Switch: Components.NhaiSwitchCommand,
    Checkbox: Components.NhaiCheckboxCommand,
    Card: Components.NhaiCardCommand,
  },
  
  Layout: {
    Row: Components.NhaiRowCommand,
    Col: Components.NhaiColCommand,
    Grid: Components.NhaiGridCommand,
    Container: Components.NhaiContainerCommand,
    SplitPanel: Components.NhaiSplitPanelCommand,
    AbsolutePanel: Components.AbsolutePanelCommand,
    LayoutBuilder: Components.NhaiLayoutBuilderCommand,
  },
  
  Navigation: {
    Breadcrumb: Components.NhaiBreadcrumbCommand,
    Tabs: Components.NhaiTabsCommand,
    MenuBar: Components.NhaiMenuBarCommand,
  },
  
  Container: {
    Widget: Components.NhaiWidgetCommand,
    Dialog: Components.NhaiDialogCommand,
  },
  
  // 核心库
  Core: {
    BaseCommand: Lib.BaseCommand,
    ComponentRegistry: Lib.ComponentRegistry,
  },
  
  // Vue 组件（声明式使用）- 已移除，不再导出
} as const as any

// 默认导出命名空间对象
export default NHAIUIVue

// ==================== 向后兼容：平铺导出 ====================
// 导出所有组件（保持向后兼容）
export * from './components'

// 导出公共库（保持向后兼容）
export * from './lib'

