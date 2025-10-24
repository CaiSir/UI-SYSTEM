// /**
//  * NHAI框架主入口文件
//  * 提供统一的API接口
//  */

// // 导出核心系统
// export {
//   NHAIObject,
//   NHAIWidget,
//   NHAIFrameworkRegistry,
//   NHAIFrameworkDetector,
//   initNHAI,
//   NHAI
// } from './core/NHAICore'

// // 导出类型
// export type {
//   NHAIFrameworkAdapter,
//   NHAIEventCallback,
//   NHAIComponentProps,
//   NHAIRenderContext
// } from './core/NHAICore'

// // 导出工厂
// export type { NHAIObjectFactory } from './factory/NHAIFactory'
// export { nhaiFactory } from './factory/NHAIFactory'

// // 导出适配器
// export { VanillaAdapter, vanillaAdapter } from './adapters/VanillaAdapter'
// export { VueAdapter, vueAdapter, useNHAI as useNHAIVue, NHAIPlugin } from './adapters/VueAdapter'
// export { ReactAdapter, reactAdapter, useNHAI as useNHAIReact, withNHAI } from './adapters/ReactAdapter'
// export { SvelteAdapter, svelteAdapter, createNHAIStore, nhaiAction } from './adapters/SvelteAdapter'

// // 导出动态组件系统
// export { NHAIDynamicComponents } from './components/DynamicComponents'

/**
 * NHAI框架主入口文件
 * 提供统一的API接口
 */

// 导出核心系统
export {
  NHAIObject,
  NHAIWidget,
  NHAIFrameworkRegistry,
  NHAIFrameworkDetector,
  initNHAI,
  NHAI
} from './core/NHAICore'

// 导出类型
export type {
  NHAIFrameworkAdapter,
  NHAIEventCallback,
  NHAIComponentProps,
  NHAIRenderContext
} from './core/NHAICore'

// 导出工厂
export { NHAIObjectFactory, nhaiFactory } from './factory/NHAIFactory'

// 导出适配器
export { VanillaAdapter, vanillaAdapter } from './adapters/VanillaAdapter'
export { VueAdapter, vueAdapter, useNHAI as useNHAIVue, NHAIPlugin } from './adapters/VueAdapter'
export { ReactAdapter, reactAdapter, useNHAI as useNHAIReact, withNHAI } from './adapters/ReactAdapter'
export { SvelteAdapter, svelteAdapter, createNHAIStore, nhaiAction } from './adapters/SvelteAdapter'

// 导出动态组件系统
export { NHAIDynamicComponents } from './components/cusComponents/DynamicComponents'

// 导出现代化组件
export { ModernNHAIButton, ModernButtonExample } from './components/cusComponents/NHAIButton/ModernNHAIButton'

// 导出组件组合器
export { 
  NHAIComponentComposer,
  ComponentRegistry,
  PropertyManager,
  TemplateManager
} from './components/cusComponents/professional/NHAIComponentComposer'

// 导出 Material 组件
export { MaterialMenuBar } from './components/materialComponents/menubar'
export { MenuItemType } from './components/materialComponents/menubar'
export type { MenuBarConfig, MenuBarLayoutType } from './components/materialComponents/menubar'
