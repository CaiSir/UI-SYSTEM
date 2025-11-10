/**
 * NHAI UI Vue - Vue 3 + Element Plus Component Library
 * 
 * 统一导出入口
 */

// 导入 Element Plus 样式
import 'element-plus/dist/index.css'

// 导入所有组件和库
import * as Components from './components'
    // import * as BasicComponents from './components/basic'
    // import * as AdvancedComponents from './components/advanced'
// import * as Lib from './lib'

// ==================== 命名空间类型定义 ====================
/**
 * NHAI UI Vue 命名空间类型
 * 提供按功能分类的组件组织方式
 */
export interface NHAIUIVueNamespace {
  // 基础组件（Basic Components）
//   Basic: {
//     // 表单组件
//     Button: typeof BasicComponents.NhaiButtonCommand
//     Input: typeof BasicComponents.NhaiInputCommand
//     Select: typeof BasicComponents.NhaiSelectCommand
//     Switch: typeof BasicComponents.NhaiSwitchCommand
//     Checkbox: typeof BasicComponents.NhaiCheckboxCommand
//     // 布局组件
//     Grid: typeof BasicComponents.NhaiGridCommand
//     Row: typeof BasicComponents.NhaiRowCommand
//     Col: typeof BasicComponents.NhaiColCommand
//     Container: typeof BasicComponents.NhaiContainerCommand
//     AbsolutePanel: typeof BasicComponents.AbsolutePanelCommand
//     LayoutBuilder: typeof BasicComponents.NhaiLayoutBuilderCommand
//     // 容器组件
//     Dialog: typeof BasicComponents.NhaiDialogCommand
//     Widget: typeof BasicComponents.NhaiWidgetCommand
//   }
  
//   // 高级组件（Advanced Components）
//   Advanced: {
//     // 布局组件
//     SplitPanel: typeof AdvancedComponents.NhaiSplitPanelCommand
//     // 展示组件
//     Card: typeof AdvancedComponents.NhaiCardCommand
//     // 导航组件
//     Breadcrumb: typeof AdvancedComponents.NhaiBreadcrumbCommand
//     Tabs: typeof AdvancedComponents.NhaiTabsCommand
//     MenuBar: typeof AdvancedComponents.NhaiMenuBarCommand
//   }
  
//   // 业务组件（Business Components）
//   Business: {
//     // 当前业务组件目录为空，未来可在此扩展
//   }
  
//   // 向后兼容：保留原有的分类方式
//   Components: {
//     Button: typeof Components.NhaiButtonCommand
//     Input: typeof Components.NhaiInputCommand
//     Select: typeof Components.NhaiSelectCommand
//     Switch: typeof Components.NhaiSwitchCommand
//     Checkbox: typeof Components.NhaiCheckboxCommand
//     Card: typeof Components.NhaiCardCommand
//   }
  
//   Layout: {
//     Row: typeof Components.NhaiRowCommand
//     Col: typeof Components.NhaiColCommand
//     Grid: typeof Components.NhaiGridCommand
//     Container: typeof Components.NhaiContainerCommand
//     SplitPanel: typeof Components.NhaiSplitPanelCommand
//     AbsolutePanel: typeof Components.AbsolutePanelCommand
//     LayoutBuilder: typeof Components.NhaiLayoutBuilderCommand
//   }
  
//   Navigation: {
//     Breadcrumb: typeof Components.NhaiBreadcrumbCommand
//     Tabs: typeof Components.NhaiTabsCommand
//     MenuBar: typeof Components.NhaiMenuBarCommand
//   }
  
//   Container: {
//     Widget: typeof Components.NhaiWidgetCommand
//     Dialog: typeof Components.NhaiDialogCommand
//   }
  
//   // 核心库
//   Core: {
//     BaseCommand: typeof Lib.BaseCommand
//     ComponentRegistry: typeof Lib.ComponentRegistry
//   }
  
  // 向后兼容：平铺导出的组件（直接访问）
  // 这样可以通过 window.NHAIUIVue.NhaiButtonCommand 直接访问
  NhaiButtonCommand: typeof Components.NhaiButtonCommand
  NhaiInputCommand: typeof Components.NhaiInputCommand
  NhaiSelectCommand: typeof Components.NhaiSelectCommand
  NhaiSwitchCommand: typeof Components.NhaiSwitchCommand
  NhaiCheckboxCommand: typeof Components.NhaiCheckboxCommand
  NhaiCardCommand: typeof Components.NhaiCardCommand
  NhaiRowCommand: typeof Components.NhaiRowCommand
  NhaiColCommand: typeof Components.NhaiColCommand
  NhaiGridCommand: typeof Components.NhaiGridCommand
  NhaiContainerCommand: typeof Components.NhaiContainerCommand
  AbsolutePanelCommand: typeof Components.AbsolutePanelCommand
  NhaiLayoutBuilderCommand: typeof Components.NhaiLayoutBuilderCommand
  NhaiDialogCommand: typeof Components.NhaiDialogCommand
  NhaiWidgetCommand: typeof Components.NhaiWidgetCommand
  NhaiSplitPanelCommand: typeof Components.NhaiSplitPanelCommand
  NhaiBreadcrumbCommand: typeof Components.NhaiBreadcrumbCommand
  NhaiTabsCommand: typeof Components.NhaiTabsCommand
  NhaiMenuBarCommand: typeof Components.NhaiMenuBarCommand
}

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
export const NHAIUIVue: NHAIUIVueNamespace = {
  // 基础组件（Basic Components）
//   Basic: {
//     // 表单组件
//     Button: BasicComponents.NhaiButtonCommand,
//     Input: BasicComponents.NhaiInputCommand,
//     Select: BasicComponents.NhaiSelectCommand,
//     Switch: BasicComponents.NhaiSwitchCommand,
//     Checkbox: BasicComponents.NhaiCheckboxCommand,
//     // 布局组件
//     Grid: BasicComponents.NhaiGridCommand,
//     Row: BasicComponents.NhaiRowCommand,
//     Col: BasicComponents.NhaiColCommand,
//     Container: BasicComponents.NhaiContainerCommand,
//     AbsolutePanel: BasicComponents.AbsolutePanelCommand,
//     LayoutBuilder: BasicComponents.NhaiLayoutBuilderCommand,
//     // 容器组件
//     Dialog: BasicComponents.NhaiDialogCommand,
//     Widget: BasicComponents.NhaiWidgetCommand,
//   },
  
//   // 高级组件（Advanced Components）
//   Advanced: {
//     // 布局组件
//     SplitPanel: AdvancedComponents.NhaiSplitPanelCommand,
//     // 展示组件
//     Card: AdvancedComponents.NhaiCardCommand,
//     // 导航组件
//     Breadcrumb: AdvancedComponents.NhaiBreadcrumbCommand,
//     Tabs: AdvancedComponents.NhaiTabsCommand,
//     MenuBar: AdvancedComponents.NhaiMenuBarCommand,
//   },
  
//   // 业务组件（Business Components）
//   Business: {
//     // 当前业务组件目录为空，未来可在此扩展
//   },
  
//   // 向后兼容：保留原有的分类方式
//   Components: {
//     Button: Components.NhaiButtonCommand,
//     Input: Components.NhaiInputCommand,
//     Select: Components.NhaiSelectCommand,
//     Switch: Components.NhaiSwitchCommand,
//     Checkbox: Components.NhaiCheckboxCommand,
//     Card: Components.NhaiCardCommand,
//   },
  
//   Layout: {
//     Row: Components.NhaiRowCommand,
//     Col: Components.NhaiColCommand,
//     Grid: Components.NhaiGridCommand,
//     Container: Components.NhaiContainerCommand,
//     SplitPanel: Components.NhaiSplitPanelCommand,
//     AbsolutePanel: Components.AbsolutePanelCommand,
//     LayoutBuilder: Components.NhaiLayoutBuilderCommand,
//   },
  
//   Navigation: {
//     Breadcrumb: Components.NhaiBreadcrumbCommand,
//     Tabs: Components.NhaiTabsCommand,
//     MenuBar: Components.NhaiMenuBarCommand,
//   },
  
//   Container: {
//     Widget: Components.NhaiWidgetCommand,
//     Dialog: Components.NhaiDialogCommand,
//   },
  
//   // 核心库
//   Core: {
//     BaseCommand: Lib.BaseCommand,
//     ComponentRegistry: Lib.ComponentRegistry,
//   },
  
  // 向后兼容：平铺导出的组件（直接访问）
  // 这样可以通过 window.NHAIUIVue.NhaiButtonCommand 直接访问
  NhaiButtonCommand: Components.NhaiButtonCommand,
  NhaiInputCommand: Components.NhaiInputCommand,
  NhaiSelectCommand: Components.NhaiSelectCommand,
  NhaiSwitchCommand: Components.NhaiSwitchCommand,
  NhaiCheckboxCommand: Components.NhaiCheckboxCommand,
  NhaiCardCommand: Components.NhaiCardCommand,
  NhaiRowCommand: Components.NhaiRowCommand,
  NhaiColCommand: Components.NhaiColCommand,
  NhaiGridCommand: Components.NhaiGridCommand,
  NhaiContainerCommand: Components.NhaiContainerCommand,
  AbsolutePanelCommand: Components.AbsolutePanelCommand,
  NhaiLayoutBuilderCommand: Components.NhaiLayoutBuilderCommand,
  NhaiDialogCommand: Components.NhaiDialogCommand,
  NhaiWidgetCommand: Components.NhaiWidgetCommand,
  NhaiSplitPanelCommand: Components.NhaiSplitPanelCommand,
  NhaiBreadcrumbCommand: Components.NhaiBreadcrumbCommand,
  NhaiTabsCommand: Components.NhaiTabsCommand,
  NhaiMenuBarCommand: Components.NhaiMenuBarCommand
}

// 默认导出命名空间对象
export default NHAIUIVue

// ==================== 向后兼容：平铺导出 ====================
// 导出所有组件（保持向后兼容）
export * from './components'

// 导出公共库（保持向后兼容）
export * from './lib'

