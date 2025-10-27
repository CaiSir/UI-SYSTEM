# Vue 组件设计说明

## 为什么不用 `.vue` 文件？

在 NHAI 框架的 `vueComponents` 中，我们**不使用** `.vue` 单文件组件，而是使用 **TypeScript 类** + Vue 运行时 API。原因如下：

## 两种方式的区别

### 方式1: Vue SFC (单文件组件) - ❌ 不使用

```vue
<!-- VueButton.vue -->
<template>
  <el-button 
    :type="buttonType" 
    :size="buttonSize"
    @click="handleClick"
  >
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const text = ref('按钮')
const buttonType = ref('primary')
const buttonSize = ref('default')

const handleClick = () => {
  console.log('clicked')
}
</script>
```

**问题**：
- ❌ 需要 Webpack/Vite 等构建工具支持
- ❌ 不能直接在 TypeScript 中控制
- ❌ 与 NHAI 的命令式 API 设计不匹配
- ❌ 需要额外的编译步骤

### 方式2: TypeScript 类 + 运行时 API - ✅ 使用

```typescript
// VueButton.ts
import { createApp, h } from 'vue'
import { ElButton } from 'element-plus'

export class VueButton extends NHAIWidget {
  private _text: string = ''
  private _type: string = 'primary'
  
  setText(text: string): void {
    this._text = text
  }
  
  render() {
    const self = this
    const app = createApp({
      setup() {
        const handleClick = () => {
          if (self._onClick) self._onClick()
        }
        
        return () => h(ElButton, {
          type: self._type,
          onClick: handleClick
        }, {
          default: () => self._text
        })
      }
    })
    
    app.mount(container)
  }
}
```

**优势**：
- ✅ 纯 TypeScript，无需特殊构建配置
- ✅ 完全命令式 API，与 NHAI 设计一致
- ✅ 可以直接导入和使用
- ✅ 灵活控制渲染时机和方式

## 核心概念

### 使用 `h` 函数

`h` 函数是 Vue 的**渲染函数**，可以在 TypeScript 中动态创建虚拟节点：

```typescript
import { h } from 'vue'

// 等价于 <el-button type="primary">文本</el-button>
const vnode = h(ElButton, {
  type: 'primary',
  onClick: handleClick
}, {
  default: () => '文本'
})
```

### 使用 `createApp`

`createApp` 用于创建 Vue 应用实例，并挂载到 DOM：

```typescript
import { createApp } from 'vue'

const app = createApp({
  setup() {
    return () => h(ElButton, { /* props */ })
  }
})

app.mount(containerElement)
```

## 实际的实现流程

```typescript
// 1. 用户创建组件
const button = new VueButton('点击我')
button.setType(VueButtonType.PRIMARY)
button.setText('提交')

// 2. 调用 render() 方法
const element = button.render()

// 3. VueButton 内部流程
// - 动态导入 Element Plus Button
// - 使用 createApp 创建 Vue 应用
// - 使用 h 函数创建虚拟节点
// - 挂载到容器元素
// - 返回渲染后的 DOM 元素

// 4. 用户添加到页面
document.body.appendChild(element)
```

## 与 Vue SFC 的对比示例

### 传统的 Vue 方式

```vue
<template>
  <el-button type="primary">按钮</el-button>
</template>
<script setup>
// 声明式，需要编译器
</script>
```

### NHAI 的方式

```typescript
const button = new VueButton('按钮')
button.setType(VueButtonType.PRIMARY)
const element = button.render()
// 命令式，纯 JavaScript/TypeScript
```

## 总结

- **不使用** `.vue` 文件，因为：
  1. 需要额外的编译工具支持
  2. 与 NHAI 的命令式 API 设计不匹配
  3. 增加了构建复杂度

- **使用** TypeScript 类 + Vue 运行时 API：
  1. 纯 TypeScript，无需特殊构建
  2. 完全命令式，与框架设计一致
  3. 灵活可控，适合封装

- **核心技术**：
  1. `h()` - 创建虚拟节点
  2. `createApp()` - 创建 Vue 应用
  3. 动态 `import()` - 按需加载 Element Plus

