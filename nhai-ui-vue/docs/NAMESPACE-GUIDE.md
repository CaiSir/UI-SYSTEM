# 命名空间使用指南

本文档介绍如何为 NHAI UI Vue 组件库定义和使用命名空间，使代码结构更清晰、避免命名冲突。

## 命名空间方案

### 方案 1: 对象命名空间（推荐）

将组件按功能分类组织到命名空间对象中。

#### 1. 修改导出结构

**文件：** `src/index.ts`

```typescript
/**
 * NHAI UI Vue - Vue 3 + Element Plus Component Library
 * 
 * 统一导出入口（命名空间版本）
 */

// 导入 Element Plus 样式
import 'element-plus/dist/index.css'

// 导入所有组件
import * as Components from './components'
import * as Lib from './lib'

// 定义命名空间对象
export const NHAIUIVue = {
  // 基础组件
  Components: {
    Button: Components.NhaiButtonCommand,
    Input: Components.NhaiInputCommand,
    Select: Components.NhaiSelectCommand,
    Switch: Components.NhaiSwitchCommand,
    Checkbox: Components.NhaiCheckboxCommand,
    Card: Components.NhaiCardCommand,
  },
  
  // 布局组件
  Layout: {
    Row: Components.NhaiRowCommand,
    Col: Components.NhaiColCommand,
    Grid: Components.NhaiGridCommand,
    Container: Components.NhaiContainerCommand,
    SplitPanel: Components.NhaiSplitPanelCommand,
    AbsolutePanel: Components.AbsolutePanelCommand,
  },
  
  // 导航组件
  Navigation: {
    Breadcrumb: Components.NhaiBreadcrumbCommand,
    Tabs: Components.NhaiTabsCommand,
    MenuBar: Components.NhaiMenuBarCommand,
  },
  
  // 容器组件
  Container: {
    Widget: Components.NhaiWidgetCommand,
    Dialog: Components.NhaiDialogCommand,
  },
  
  // 核心库
  Core: {
    BaseCommand: Lib.BaseCommand,
    ComponentRegistry: Lib.ComponentRegistry,
  },
  
  // Vue 组件（声明式使用）
  Vue: {
    Button: Components.VueButton,
    Input: Components.VueInput,
    Select: Components.VueSelect,
    // ... 其他 Vue 组件
  }
}

// 默认导出命名空间对象
export default NHAIUIVue

// 也支持平铺导出（向后兼容）
export * from './components'
export * from './lib'
```

#### 2. 使用方式

**ES Module 方式：**

```typescript
// 方式 1: 使用命名空间
import { NHAIUIVue } from 'nhai-ui-vue'

const button = new NHAIUIVue.Components.Button('按钮')
button.setType('primary')

const row = new NHAIUIVue.Layout.Row()
const col = new NHAIUIVue.Layout.Col({ span: 12 })
row.addChild(col)
```

**UMD 方式（全局变量）：**

```html
<script src="./dist/index.umd.js"></script>
<script>
  // 使用命名空间
  const { NHAIUIVue } = window.NHAIUIVue
  
  const button = new NHAIUIVue.Components.Button('按钮')
  button.setType('primary')
  
  const row = new NHAIUIVue.Layout.Row()
  const col = new NHAIUIVue.Layout.Col({ span: 12 })
  row.addChild(col)
</script>
```

### 方案 2: TypeScript 命名空间

使用 TypeScript 的 `namespace` 关键字定义命名空间。

#### 1. 定义命名空间

**文件：** `src/namespace.ts`

```typescript
/**
 * NHAI UI Vue 命名空间定义
 */

import * as Components from './components'
import * as Lib from './lib'

export namespace NHAIUIVue {
  // 基础组件命名空间
  export namespace Components {
    export const Button = Components.NhaiButtonCommand
    export const Input = Components.NhaiInputCommand
    export const Select = Components.NhaiSelectCommand
    export const Switch = Components.NhaiSwitchCommand
    export const Checkbox = Components.NhaiCheckboxCommand
    export const Card = Components.NhaiCardCommand
  }
  
  // 布局组件命名空间
  export namespace Layout {
    export const Row = Components.NhaiRowCommand
    export const Col = Components.NhaiColCommand
    export const Grid = Components.NhaiGridCommand
    export const Container = Components.NhaiContainerCommand
    export const SplitPanel = Components.NhaiSplitPanelCommand
    export const AbsolutePanel = Components.AbsolutePanelCommand
  }
  
  // 导航组件命名空间
  export namespace Navigation {
    export const Breadcrumb = Components.NhaiBreadcrumbCommand
    export const Tabs = Components.NhaiTabsCommand
    export const MenuBar = Components.NhaiMenuBarCommand
  }
  
  // 核心库命名空间
  export namespace Core {
    export const BaseCommand = Lib.BaseCommand
    export const ComponentRegistry = Lib.ComponentRegistry
  }
}

// 导出命名空间
export { NHAIUIVue }
```

#### 2. 使用方式

```typescript
import { NHAIUIVue } from 'nhai-ui-vue'

// 使用命名空间
const button = new NHAIUIVue.Components.Button('按钮')
const row = new NHAIUIVue.Layout.Row()
const col = new NHAIUIVue.Layout.Col({ span: 12 })
```

### 方案 3: 全局变量命名空间（UMD）

修改构建配置，让全局变量有层级结构。

#### 1. 修改构建配置

**文件：** `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NHAI.UI.Vue',  // 👈 使用点号分隔的命名空间
      formats: ['es', 'cjs', 'umd'],
      // ...
    }
  }
})
```

#### 2. 使用方式

```html
<script src="./dist/index.umd.js"></script>
<script>
  // 全局变量命名空间
  const { NHAIUIVue } = window.NHAI.UI.Vue
  
  // 或者直接使用
  const button = new window.NHAI.UI.Vue.NHAIUIVue.Components.Button('按钮')
</script>
```

**注意：** 这种方式可能在某些环境下有问题，不推荐使用。

## 推荐方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **对象命名空间** | ✅ 简单清晰、兼容性好 | ⚠️ 需要手动组织 | ⭐⭐⭐⭐⭐ |
| **TypeScript 命名空间** | ✅ 类型安全、IDE 支持好 | ⚠️ 仅限 TypeScript | ⭐⭐⭐⭐ |
| **全局变量命名空间** | ✅ 层级清晰 | ❌ 兼容性问题 | ⭐⭐ |

## 完整实现示例

### 使用对象命名空间（推荐）

**文件：** `src/index.ts`

```typescript
import 'element-plus/dist/index.css'
import * as Components from './components'
import * as Lib from './lib'

// 定义命名空间对象
export const NHAIUIVue = {
  // 基础组件
  Components: {
    Button: Components.NhaiButtonCommand,
    Input: Components.NhaiInputCommand,
    Select: Components.NhaiSelectCommand,
    Switch: Components.NhaiSwitchCommand,
    Checkbox: Components.NhaiCheckboxCommand,
    Card: Components.NhaiCardCommand,
  },
  
  // 布局组件
  Layout: {
    Row: Components.NhaiRowCommand,
    Col: Components.NhaiColCommand,
    Grid: Components.NhaiGridCommand,
    Container: Components.NhaiContainerCommand,
    SplitPanel: Components.NhaiSplitPanelCommand,
    AbsolutePanel: Components.AbsolutePanelCommand,
  },
  
  // 导航组件
  Navigation: {
    Breadcrumb: Components.NhaiBreadcrumbCommand,
    Tabs: Components.NhaiTabsCommand,
    MenuBar: Components.NhaiMenuBarCommand,
  },
  
  // 容器组件
  Container: {
    Widget: Components.NhaiWidgetCommand,
    Dialog: Components.NhaiDialogCommand,
  },
  
  // 核心库
  Core: {
    BaseCommand: Lib.BaseCommand,
    ComponentRegistry: Lib.ComponentRegistry,
  },
}

// 默认导出
export default NHAIUIVue

// 向后兼容：平铺导出
export * from './components'
export * from './lib'
```

**使用示例：**

```typescript
// ES Module
import { NHAIUIVue } from 'nhai-ui-vue'

const button = new NHAIUIVue.Components.Button('按钮')
button.setType('primary')

const row = new NHAIUIVue.Layout.Row()
row.setGutter(16)

const col = new NHAIUIVue.Layout.Col({ span: 12 })
col.addChild(button)
row.addChild(col)

// UMD 全局变量
const { NHAIUIVue } = window.NHAIUIVue
const button = new NHAIUIVue.Components.Button('按钮')
```

## 类型定义

为命名空间添加 TypeScript 类型支持：

**文件：** `src/types/namespace.d.ts`

```typescript
import type * as Components from '../components'
import type * as Lib from '../lib'

export interface NHAIUIVueNamespace {
  Components: {
    Button: typeof Components.NhaiButtonCommand
    Input: typeof Components.NhaiInputCommand
    Select: typeof Components.NhaiSelectCommand
    Switch: typeof Components.NhaiSwitchCommand
    Checkbox: typeof Components.NhaiCheckboxCommand
    Card: typeof Components.NhaiCardCommand
  }
  
  Layout: {
    Row: typeof Components.NhaiRowCommand
    Col: typeof Components.NhaiColCommand
    Grid: typeof Components.NhaiGridCommand
    Container: typeof Components.NhaiContainerCommand
    SplitPanel: typeof Components.NhaiSplitPanelCommand
    AbsolutePanel: typeof Components.AbsolutePanelCommand
  }
  
  Navigation: {
    Breadcrumb: typeof Components.NhaiBreadcrumbCommand
    Tabs: typeof Components.NhaiTabsCommand
    MenuBar: typeof Components.NhaiMenuBarCommand
  }
  
  Container: {
    Widget: typeof Components.NhaiWidgetCommand
    Dialog: typeof Components.NhaiDialogCommand
  }
  
  Core: {
    BaseCommand: typeof Lib.BaseCommand
    ComponentRegistry: typeof Lib.ComponentRegistry
  }
}

// 全局变量类型声明（UMD 使用）
declare global {
  interface Window {
    NHAIUIVue: {
      NHAIUIVue: NHAIUIVueNamespace
    }
  }
}
```

## 总结

**推荐方案：对象命名空间**

1. ✅ **简单清晰**：代码组织更直观
2. ✅ **兼容性好**：支持 ES Module 和 UMD
3. ✅ **向后兼容**：保留平铺导出
4. ✅ **类型安全**：支持 TypeScript

**使用方式：**

```typescript
// 命名空间方式
import { NHAIUIVue } from 'nhai-ui-vue'
const button = new NHAIUIVue.Components.Button('按钮')

// 或平铺方式（向后兼容）
import { NhaiButtonCommand } from 'nhai-ui-vue'
const button = new NhaiButtonCommand('按钮')
```

这样可以同时支持命名空间和传统导入方式，满足不同场景的需求。

