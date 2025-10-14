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

// 导出组件
export {
  NHAIButton,
  NHAILabel,
  NHAIInput,
  NHAICard,
  NHAIContainer,
  NHAIWindow
} from './components/NHAIComponents'

// 导出布局
export {
  NHAILayout,
  NHAIVBoxLayout,
  NHAIHBoxLayout,
  NHAIGridLayout
} from './components/NHAILayouts'

// 导出工厂
export type { NHAIObjectFactory } from './factory/NHAIFactory'
export { nhaiFactory } from './factory/NHAIFactory'

// 导出适配器
export { VanillaAdapter, vanillaAdapter } from './adapters/VanillaAdapter'
export { VueAdapter, vueAdapter, useNHAI as useNHAIVue, NHAIPlugin } from './adapters/VueAdapter'
export { ReactAdapter, reactAdapter, useNHAI as useNHAIReact, withNHAI } from './adapters/ReactAdapter'
export { SvelteAdapter, svelteAdapter, createNHAIStore, nhaiAction } from './adapters/SvelteAdapter'

// 默认导出
import { initNHAI, NHAIFrameworkRegistry, NHAIFrameworkDetector } from './core/NHAICore'
import { nhaiFactory } from './factory/NHAIFactory'
import { VanillaAdapter } from './adapters/VanillaAdapter'
import { VueAdapter } from './adapters/VueAdapter'
import { ReactAdapter } from './adapters/ReactAdapter'
import { SvelteAdapter } from './adapters/SvelteAdapter'
import { NHAIButton, NHAILabel, NHAIInput, NHAICard, NHAIContainer, NHAIWindow } from './components/NHAIComponents'
import { NHAIVBoxLayout, NHAIHBoxLayout, NHAIGridLayout } from './components/NHAILayouts'

export default {
  // 核心API
  init: initNHAI,
  FrameworkRegistry: NHAIFrameworkRegistry,
  FrameworkDetector: NHAIFrameworkDetector,
  
  // 工厂
  Factory: nhaiFactory,
  
  // 适配器
  Adapters: {
    VanillaAdapter,
    VueAdapter,
    ReactAdapter,
    SvelteAdapter
  },
  
  // 组件
  Components: {
    Button: NHAIButton,
    Label: NHAILabel,
    Input: NHAIInput,
    Card: NHAICard,
    Container: NHAIContainer,
    Window: NHAIWindow
  },
  
  // 布局
  Layouts: {
    VBoxLayout: NHAIVBoxLayout,
    HBoxLayout: NHAIHBoxLayout,
    GridLayout: NHAIGridLayout
  }
}
