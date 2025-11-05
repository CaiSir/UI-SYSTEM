# NHAI UI Vue 外部使用指南

本文档介绍如何在不使用 npm 的情况下，将 NHAI UI Vue 组件库集成到外部项目中。

## 构建产物说明

项目构建后会生成以下文件（在 `dist` 目录）：

- `index.es.js` - ES Module 格式（推荐用于现代浏览器）
- `index.cjs.js` - CommonJS 格式（用于 Node.js 环境）
- `index.umd.js` - UMD 格式（可用于浏览器和 Node.js，会绑定到全局变量）
- `index.css` - 样式文件
- `index.d.ts` - TypeScript 类型定义文件

## 使用方式

### 方式 1: ES Module 方式（推荐）

**适用场景：** 现代浏览器、支持 ES Module 的项目

**优点：**
- 支持 Tree Shaking，只打包使用的代码
- 类型安全（配合 TypeScript）
- 不需要绑定到 window，保持模块化

**使用方法：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>NHAI UI Vue 示例</title>
  <!-- 引入样式 -->
  <link rel="stylesheet" href="./dist/index.css">
  <!-- 需要先引入 Vue 和 Element Plus -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
</head>
<body>
  <div id="app"></div>
  
  <script type="module">
    // 直接导入 ES Module
    import { 
      NhaiButtonCommand,
      NhaiInputCommand,
      NhaiRowCommand,
      NhaiColCommand
    } from './dist/index.es.js'
    
    // 使用组件
    const button = new NhaiButtonCommand('点击我')
    button.setType('primary')
    button.setOnClick(() => alert('按钮被点击了！'))
    
    document.getElementById('app').appendChild(button.render())
  </script>
</body>
</html>
```

**在 TypeScript 项目中使用：**

```typescript
// 假设你已经将 dist 目录复制到项目中
import { 
  NhaiButtonCommand,
  NhaiInputCommand,
  NhaiRowCommand,
  NhaiColCommand
} from './lib/nhai-ui-vue/dist/index.es.js'

// 使用组件
const button = new NhaiButtonCommand('按钮')
button.setType('primary')
```

### 方式 2: UMD 方式（绑定到 window）

**适用场景：** 传统浏览器、需要全局变量的场景

**优点：**
- 兼容性好，支持所有浏览器
- 不需要构建工具
- 可以直接通过 `window` 访问

**使用方法：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>NHAI UI Vue UMD 示例</title>
  <!-- 引入样式 -->
  <link rel="stylesheet" href="./dist/index.css">
  <!-- 先引入依赖 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/element-plus/dist/index.full.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
</head>
<body>
  <div id="app"></div>
  
  <script src="./dist/index.umd.js"></script>
  <script>
    // 通过全局变量访问
    const { NhaiButtonCommand, NhaiInputCommand } = window.NHAIUIVue
    
    const button = new NhaiButtonCommand('点击我')
    button.setType('primary')
    button.setOnClick(() => alert('按钮被点击了！'))
    
    document.getElementById('app').appendChild(button.render())
  </script>
</body>
</html>
```

### 方式 3: CommonJS 方式

**适用场景：** Node.js 环境、使用 require 的项目

**使用方法：**

```javascript
// Node.js 环境
const { 
  NhaiButtonCommand,
  NhaiInputCommand
} = require('./dist/index.cjs.js')

// 使用组件
const button = new NhaiButtonCommand('按钮')
button.setType('primary')
```

### 方式 4: CDN 方式

**适用场景：** 快速原型、演示项目

**使用方法：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>NHAI UI Vue CDN 示例</title>
  <!-- 从 CDN 引入（需要先部署到 CDN） -->
  <link rel="stylesheet" href="https://cdn.example.com/nhai-ui-vue/index.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/element-plus/dist/index.full.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
</head>
<body>
  <div id="app"></div>
  
  <!-- 方式 A: UMD 格式 -->
  <script src="https://cdn.example.com/nhai-ui-vue/index.umd.js"></script>
  <script>
    const { NhaiButtonCommand } = window.NHAIUIVue
    // 使用组件...
  </script>
  
  <!-- 方式 B: ES Module 格式 -->
  <script type="module">
    import { NhaiButtonCommand } from 'https://cdn.example.com/nhai-ui-vue/index.es.js'
    // 使用组件...
  </script>
</body>
</html>
```

### 方式 5: 本地文件引用（相对路径）

**适用场景：** 本地开发、不需要构建工具的项目

**项目结构：**
```
my-project/
├── index.html
├── lib/
│   └── nhai-ui-vue/
│       ├── dist/
│       │   ├── index.es.js
│       │   ├── index.css
│       │   └── index.d.ts
│       └── ...
└── ...
```

**使用方法：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>本地引用示例</title>
  <link rel="stylesheet" href="./lib/nhai-ui-vue/dist/index.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
</head>
<body>
  <div id="app"></div>
  
  <script type="module">
    import { NhaiButtonCommand } from './lib/nhai-ui-vue/dist/index.es.js'
    
    const button = new NhaiButtonCommand('按钮')
    button.setType('primary')
    document.getElementById('app').appendChild(button.render())
  </script>
</body>
</html>
```

## 完整示例

### 示例 1: 使用 Row/Col 布局

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Row/Col 布局示例</title>
  <link rel="stylesheet" href="./dist/index.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
</head>
<body>
  <div id="app"></div>
  
  <script type="module">
    import { 
      NhaiRowCommand, 
      NhaiColCommand, 
      NhaiButtonCommand 
    } from './dist/index.es.js'
    
    const row = new NhaiRowCommand()
    row.setGutter(16)
    
    const col1 = new NhaiColCommand({ span: 8 })
    const col2 = new NhaiColCommand({ span: 8 })
    const col3 = new NhaiColCommand({ span: 8 })
    
    const btn1 = new NhaiButtonCommand('按钮 1')
    btn1.setType('primary')
    col1.addChild(btn1)
    
    const btn2 = new NhaiButtonCommand('按钮 2')
    btn2.setType('success')
    col2.addChild(btn2)
    
    const btn3 = new NhaiButtonCommand('按钮 3')
    btn3.setType('warning')
    col3.addChild(btn3)
    
    row.addChild(col1)
    row.addChild(col2)
    row.addChild(col3)
    
    document.getElementById('app').appendChild(row.render())
  </script>
</body>
</html>
```

### 示例 2: 在 Vue 项目中使用

```vue
<template>
  <div id="app">
    <div ref="container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  NhaiButtonCommand,
  NhaiInputCommand,
  NhaiRowCommand,
  NhaiColCommand
} from './lib/nhai-ui-vue/dist/index.es.js'

const container = ref(null)

onMounted(() => {
  const row = new NhaiRowCommand()
  row.setGutter(16)
  
  const col = new NhaiColCommand({ span: 12 })
  const button = new NhaiButtonCommand('Vue 中的按钮')
  button.setType('primary')
  col.addChild(button)
  
  row.addChild(col)
  
  if (container.value) {
    container.value.appendChild(row.render())
  }
})
</script>
```

## 依赖要求

无论使用哪种方式，都需要确保以下依赖已加载：

1. **Vue 3** - 必须
   ```html
   <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
   ```

2. **Element Plus** - 必须（组件库依赖）
   ```html
   <script src="https://unpkg.com/element-plus/dist/index.full.js"></script>
   <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
   ```

3. **NHAI UI Vue 样式** - 必须
   ```html
   <link rel="stylesheet" href="./dist/index.css">
   ```

## 类型支持（TypeScript）

如果使用 TypeScript，可以引用类型定义文件：

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "types": ["./lib/nhai-ui-vue/dist/index.d.ts"]
  }
}

// 或者直接导入类型
import type { 
  ButtonOptions, 
  InputOptions,
  RowOptions,
  ColOptions
} from './lib/nhai-ui-vue/dist/index.d.ts'
```

## 推荐方案对比

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| ES Module | Tree Shaking、类型安全、模块化 | 需要现代浏览器 | **推荐**：现代项目 |
| UMD | 兼容性好、全局访问 | 无法 Tree Shaking、体积大 | 传统项目、快速集成 |
| CommonJS | Node.js 原生支持 | 仅限 Node.js | Node.js 项目 |
| CDN | 无需本地文件 | 需要网络、CDN 部署 | 演示、原型 |
| 本地文件 | 简单直接 | 需要手动管理文件 | 本地开发 |

## 总结

**最佳实践推荐：**

1. **现代浏览器项目（单应用）** → 使用 **ES Module** 方式（方式 1）
2. **传统浏览器项目** → 使用 **UMD** 方式（方式 2）
3. **Node.js 项目** → 使用 **CommonJS** 方式（方式 3）
4. **分布式/微前端项目** → 使用 **UMD + 全局变量** 方式（避免多份加载）

**重要提示：**

- **单应用场景**：ES Module 方式是最推荐的，它保持了代码的模块化和类型安全，不需要绑定到 window。
- **分布式/微前端场景**：必须使用 UMD + 全局变量方式，避免每个子应用都加载一份组件库，造成内存浪费。详细方案请查看：[分布式项目使用指南](./DISTRIBUTED-USAGE-GUIDE.md)

