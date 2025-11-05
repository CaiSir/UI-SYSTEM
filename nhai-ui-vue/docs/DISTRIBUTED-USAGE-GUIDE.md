# 分布式前端项目使用指南

在分布式前端项目（微前端架构）中，如果每个子工程都使用 ES Module 方式引入组件库，会导致内存中存在多份副本，造成资源浪费。本文档提供针对分布式项目的优化方案。

## 问题分析

### 问题场景

```
主应用 (Main App)
├── 子应用 A (Sub App A)
│   └── import { NhaiButtonCommand } from 'nhai-ui-vue'  ❌ 加载一份
├── 子应用 B (Sub App B)
│   └── import { NhaiButtonCommand } from 'nhai-ui-vue'  ❌ 加载一份
└── 子应用 C (Sub App C)
    └── import { NhaiButtonCommand } from 'nhai-ui-vue'  ❌ 加载一份

结果：内存中存在 3 份组件库副本 ❌
```

### 解决方案对比

| 方案 | 内存占用 | 实现复杂度 | 推荐度 |
|------|---------|-----------|--------|
| UMD + 全局变量 | ✅ 单份 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| CDN + 全局变量 | ✅ 单份 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| Module Federation | ✅ 单份 | ⭐⭐⭐ 复杂 | ⭐⭐⭐⭐ |
| SystemJS | ✅ 单份 | ⭐⭐ 中等 | ⭐⭐⭐ |

## 方案 1: UMD + 全局变量（推荐）

### 实现原理

在主应用中加载一次 UMD 文件，绑定到 `window.NHAIUIVue`，所有子应用共享这个全局变量。

> **💡 全局变量定义位置：**
> - **配置位置**：`vite.config.ts` 中的 `name: 'NHAIUIVue'`
> - **生成时机**：执行 `npm run build` 构建 UMD 格式时自动生成
> - **实际位置**：构建后的 `dist/index.umd.js` 文件中
> - 详细说明请查看：[UMD 全局变量定义说明](./UMD-GLOBAL-VARIABLE.md)

### 实现步骤

#### 1. 主应用（Main App）

在主应用的入口文件中加载组件库：

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>主应用</title>
  <!-- 引入依赖 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/element-plus/dist/index.full.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
  
  <!-- 引入 NHAI UI Vue（只加载一次） -->
  <script src="https://cdn.example.com/nhai-ui-vue/index.umd.js"></script>
  <link rel="stylesheet" href="https://cdn.example.com/nhai-ui-vue/index.css">
</head>
<body>
  <div id="app"></div>
  
  <script>
    // 确保组件库已加载
    if (window.NHAIUIVue) {
      console.log('✅ NHAI UI Vue 已加载到全局')
    }
  </script>
</body>
</html>
```

#### 2. 子应用（Sub Apps）

子应用直接使用全局变量，不再单独引入：

```javascript
// sub-app-a/main.js
// ❌ 不要这样做（会导致重复加载）
// import { NhaiButtonCommand } from 'nhai-ui-vue'

// ✅ 正确做法：使用全局变量
// 方式 1: 命名空间方式（推荐）
const { NHAIUIVue } = window.NHAIUIVue
const button = new NHAIUIVue.Components.Button('按钮')
const row = new NHAIUIVue.Layout.Row()

// 方式 2: 平铺方式（向后兼容）
const { NhaiButtonCommand, NhaiRowCommand, NhaiColCommand } = window.NHAIUIVue

// 使用组件
const button = new NhaiButtonCommand('按钮')
button.setType('primary')
document.body.appendChild(button.render())
```

#### 3. TypeScript 支持

为全局变量添加类型定义：

```typescript
// types/nhai-ui-vue.d.ts
import type * as NHAIUIVue from 'nhai-ui-vue'

declare global {
  interface Window {
    NHAIUIVue: typeof NHAIUIVue
  }
}

export {}
```

### 优点

- ✅ **内存优化**：整个应用只加载一份组件库
- ✅ **简单易用**：不需要复杂的配置
- ✅ **兼容性好**：支持所有浏览器
- ✅ **加载速度快**：主应用加载后，子应用立即可用

### 缺点

- ❌ 无法 Tree Shaking（但分布式场景下这不是主要问题）
- ❌ 需要确保主应用先加载

## 方案 2: CDN + 全局变量（最佳实践）

### 实现原理

将组件库部署到 CDN，在主应用中通过 `<script>` 标签加载，所有子应用共享。

### 实现步骤

#### 1. 部署到 CDN

```bash
# 构建组件库
npm run build

# 上传到 CDN
# dist/index.umd.js -> https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js
# dist/index.css -> https://cdn.example.com/nhai-ui-vue/v1.0.0/index.css
```

#### 2. 主应用配置

```html
<!-- main-app/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>主应用</title>
  
  <!-- 依赖 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/element-plus/dist/index.full.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
  
  <!-- NHAI UI Vue（CDN，只加载一次） -->
  <script src="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js"></script>
  <link rel="stylesheet" href="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.css">
</head>
<body>
  <div id="main-app"></div>
  
  <!-- 子应用容器 -->
  <div id="sub-app-a"></div>
  <div id="sub-app-b"></div>
  <div id="sub-app-c"></div>
</body>
</html>
```

#### 3. 子应用使用

```javascript
// sub-app-a/index.js
// 检查组件库是否已加载
function ensureNHAIUIVue() {
  if (window.NHAIUIVue) {
    return Promise.resolve(window.NHAIUIVue)
  }
  
  // 如果未加载，动态加载（通常不会发生，因为主应用已加载）
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js'
    script.onload = () => resolve(window.NHAIUIVue)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 使用组件
ensureNHAIUIVue().then(({ NhaiButtonCommand }) => {
  const button = new NhaiButtonCommand('按钮')
  button.setType('primary')
  document.getElementById('sub-app-a').appendChild(button.render())
})
```

### 版本管理

```html
<!-- 使用固定版本 -->
<script src="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js"></script>

<!-- 或使用 latest（不推荐生产环境） -->
<script src="https://cdn.example.com/nhai-ui-vue/latest/index.umd.js"></script>
```

### 优点

- ✅ **内存优化**：单份加载
- ✅ **缓存优化**：CDN 缓存，加载速度快
- ✅ **版本管理**：可以统一管理版本
- ✅ **网络优化**：CDN 加速

## 方案 3: Module Federation（Webpack 5）

### 实现原理

使用 Webpack 5 的 Module Federation 功能，将组件库作为共享模块。

### 实现步骤

#### 1. 组件库配置（作为 Remote）

```javascript
// nhai-ui-vue/webpack.config.js
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'nhai_ui_vue',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/index.ts'
      },
      shared: {
        vue: { singleton: true },
        'element-plus': { singleton: true }
      }
    })
  ]
}
```

#### 2. 主应用配置（作为 Host）

```javascript
// main-app/webpack.config.js
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'main_app',
      remotes: {
        nhai_ui_vue: 'nhai_ui_vue@https://cdn.example.com/nhai-ui-vue/remoteEntry.js'
      },
      shared: {
        vue: { singleton: true },
        'element-plus': { singleton: true }
      }
    })
  ]
}
```

#### 3. 子应用使用

```javascript
// sub-app-a/index.js
// 动态导入共享模块
const { NhaiButtonCommand } = await import('nhai_ui_vue/components')

const button = new NhaiButtonCommand('按钮')
button.setType('primary')
```

### 优点

- ✅ **内存优化**：共享模块，单份加载
- ✅ **按需加载**：支持动态导入
- ✅ **类型安全**：支持 TypeScript

### 缺点

- ❌ 需要 Webpack 5
- ❌ 配置相对复杂
- ❌ 需要构建工具支持

## 方案 4: SystemJS 模块加载器

### 实现原理

使用 SystemJS 作为模块加载器，实现模块的共享和按需加载。

### 实现步骤

#### 1. 主应用加载 SystemJS

```html
<!-- main-app/index.html -->
<script src="https://cdn.jsdelivr.net/npm/systemjs@6/dist/system.min.js"></script>
<script>
  // 配置 SystemJS
  System.config({
    map: {
      'nhai-ui-vue': 'https://cdn.example.com/nhai-ui-vue/v1.0.0/index.es.js'
    }
  })
  
  // 预加载组件库
  System.import('nhai-ui-vue').then(module => {
    window.NHAIUIVue = module
    console.log('✅ NHAI UI Vue 已加载')
  })
</script>
```

#### 2. 子应用使用

```javascript
// sub-app-a/index.js
// 使用 SystemJS 导入（如果已加载，会使用缓存）
System.import('nhai-ui-vue').then(({ NhaiButtonCommand }) => {
  const button = new NhaiButtonCommand('按钮')
  button.setType('primary')
})
```

## 方案对比总结

| 方案 | 适用场景 | 内存占用 | 实现难度 | 推荐度 |
|------|---------|---------|---------|--------|
| **UMD + 全局变量** | 所有场景 | ✅ 单份 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| **CDN + 全局变量** | 生产环境 | ✅ 单份 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| **Module Federation** | Webpack 5 项目 | ✅ 单份 | ⭐⭐⭐ 复杂 | ⭐⭐⭐⭐ |
| **SystemJS** | 需要动态加载 | ✅ 单份 | ⭐⭐ 中等 | ⭐⭐⭐ |

## 最佳实践推荐

### 生产环境

**推荐：CDN + 全局变量**

```html
<!-- 主应用 -->
<script src="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js"></script>

<!-- 子应用 -->
<script>
  const { NhaiButtonCommand } = window.NHAIUIVue
</script>
```

### 开发环境

**推荐：UMD + 本地文件**

```html
<!-- 主应用 -->
<script src="./lib/nhai-ui-vue/dist/index.umd.js"></script>

<!-- 子应用 -->
<script>
  const { NhaiButtonCommand } = window.NHAIUIVue
</script>
```

### Webpack 5 项目

**推荐：Module Federation**

```javascript
// 配置共享模块
shared: {
  'nhai-ui-vue': { singleton: true }
}
```

## 注意事项

### 1. 版本一致性

确保所有子应用使用相同版本的组件库：

```html
<!-- ✅ 正确：统一版本 -->
<script src="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js"></script>

<!-- ❌ 错误：不同版本会导致冲突 -->
<!-- 主应用：v1.0.0 -->
<!-- 子应用 A：v1.1.0 -->
<!-- 子应用 B：v1.2.0 -->
```

### 2. 加载顺序

确保组件库在主应用加载，子应用后加载：

```html
<!-- ✅ 正确顺序 -->
<script src="vue.js"></script>
<script src="element-plus.js"></script>
<script src="nhai-ui-vue.umd.js"></script>  <!-- 主应用加载 -->
<!-- 然后加载子应用 -->
<script src="sub-app-a.js"></script>
```

### 3. 依赖检查

子应用使用前检查组件库是否已加载：

```javascript
function useNHAIUIVue() {
  if (!window.NHAIUIVue) {
    throw new Error('NHAI UI Vue 未加载，请确保主应用已加载组件库')
  }
  return window.NHAIUIVue
}

const { NhaiButtonCommand } = useNHAIUIVue()
```

## 完整示例

### 主应用示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>主应用</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/element-plus/dist/index.full.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
  
  <!-- 组件库（只加载一次） -->
  <script src="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.umd.js"></script>
  <link rel="stylesheet" href="https://cdn.example.com/nhai-ui-vue/v1.0.0/index.css">
</head>
<body>
  <div id="main-app">
    <h1>主应用</h1>
  </div>
  
  <!-- 子应用容器 -->
  <div id="sub-app-a"></div>
  <div id="sub-app-b"></div>
</body>
</html>
```

### 子应用示例

```javascript
// sub-app-a/index.js
(function() {
  'use strict'
  
  // 检查组件库
  if (!window.NHAIUIVue) {
    console.error('NHAI UI Vue 未加载')
    return
  }
  
  const { NhaiRowCommand, NhaiColCommand, NhaiButtonCommand } = window.NHAIUIVue
  
  // 创建布局
  const row = new NhaiRowCommand()
  row.setGutter(16)
  
  const col1 = new NhaiColCommand({ span: 12 })
  const col2 = new NhaiColCommand({ span: 12 })
  
  const btn1 = new NhaiButtonCommand('按钮 1')
  btn1.setType('primary')
  col1.addChild(btn1)
  
  const btn2 = new NhaiButtonCommand('按钮 2')
  btn2.setType('success')
  col2.addChild(btn2)
  
  row.addChild(col1)
  row.addChild(col2)
  
  // 渲染到容器
  const container = document.getElementById('sub-app-a')
  if (container) {
    container.appendChild(row.render())
  }
})()
```

## 总结

对于分布式前端项目：

1. **推荐方案**：**CDN + 全局变量（UMD）**
   - 内存占用：单份 ✅
   - 实现简单：非常容易 ✅
   - 性能优化：CDN 缓存 ✅

2. **关键点**：
   - 主应用加载一次组件库
   - 子应用使用 `window.NHAIUIVue` 访问
   - 确保版本一致性
   - 注意加载顺序

3. **避免**：
   - ❌ 每个子应用都 `import` 组件库
   - ❌ 使用不同版本的组件库
   - ❌ 子应用先于主应用加载

通过这种方式，整个分布式应用只会加载一份组件库，大大节省内存和网络资源。

