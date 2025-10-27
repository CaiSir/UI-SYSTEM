# Vue 组件实现方式对比

## 📋 快速对比表

| 特性 | `.vue` 文件 (SFC) | NHAI 方式 (TypeScript) |
|------|------------------|----------------------|
| **文件格式** | `.vue` 单文件组件 | `.ts` TypeScript 类 |
| **构建需求** | 需要 Webpack/Vite | 无需特殊构建 |
| **编译方式** | 需要编译器 | 直接使用 |
| **API 风格** | 声明式 (template) | 命令式 (方法调用) |
| **TypeScript** | 需要额外配置 | 原生支持 |
| **动态性** | 有限 | 完全动态 |
| **使用方式** | `<my-component />` | `new MyComponent()` |
| **状态管理** | 响应式 (ref/reactive) | 私有属性 |

## 🎯 实际代码对比

### 场景：创建一个带点击事件的主要按钮

#### ❌ 传统 Vue SFC 方式（不使用）

```vue
<!-- MyButton.vue -->
<template>
  <el-button 
    :type="buttonType" 
    :size="buttonSize"
    :loading="loading"
    @click="handleClick"
  >
    {{ buttonText }}
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

interface Props {
  text?: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  type: 'primary'
})

const buttonText = ref(props.text)
const buttonType = ref(props.type)
const buttonSize = ref('default')
const loading = ref(false)

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>
```

**使用方式**：
```vue
<template>
  <MyButton text="提交" type="primary" @click="handleSubmit" />
</template>

<script setup>
import MyButton from './MyButton.vue'
import { defineComponent } from 'vue'

const handleSubmit = () => {
  console.log('submitted')
}
</script>
```

#### ✅ NHAI 方式（使用）

```typescript
// MyButton.ts
import { NHAIWidget } from '../../../core/NHAICore'
import { createApp, h } from 'vue'

export class MyButton extends NHAIWidget {
  private _text: string = ''
  private _type: string = 'primary'
  private _size: string = 'default'
  private _loading: boolean = false
  private _onClick?: () => void

  constructor(text: string = '', parent?: NHAIObject) {
    super(parent)
    this._text = text
  }

  setText(text: string): void {
    this._text = text
  }

  setType(type: string): void {
    this._type = type
  }

  setLoading(loading: boolean): void {
    this._loading = loading
  }

  setOnClick(handler: () => void): void {
    this._onClick = handler
  }

  render(_context?: NHAIRenderContext): any {
    const container = this.createContainer()
    
    import('element-plus/es/components/button/index.mjs').then(module => {
      const Button = module.default || module.ElButton
      const self = this

      const app = createApp({
        setup() {
          return () => h(Button, {
            type: self._type,
            size: self._size,
            loading: self._loading,
            onClick: () => {
              if (self._onClick) self._onClick()
            }
          }, {
            default: () => self._text
          })
        }
      })

      app.mount(container)
    })

    return container
  }
}
```

**使用方式**：
```typescript
// 命令式调用
const button = new MyButton('提交')
button.setType('primary')
button.setOnClick(() => console.log('submitted'))

const element = button.render()
document.body.appendChild(element)
```

## 🔍 关键区别

### 1. 声明式 vs 命令式

**Vue SFC** - 声明式：
```vue
<el-button :type="buttonType">
  声明式：告诉 Vue "渲染什么"
</el-button>
```

**NHAI** - 命令式：
```typescript
button.setType('primary')  // 命令式：告诉组件 "做什么"
```

### 2. 组件定义

**Vue SFC** - 单文件组件：
```vue
<template>
  <!-- HTML 模板 -->
</template>
<script setup>
  // JavaScript/TypeScript 逻辑
</script>
<style>
  /* CSS 样式 */
</style>
```

**NHAI** - TypeScript 类：
```typescript
export class MyButton extends NHAIWidget {
  // 所有逻辑在一个 TypeScript 文件中
  // 使用 h() 函数动态生成虚拟节点
}
```

### 3. 构建过程

**Vue SFC**：
```
.vue 文件 → 编译器 → JavaScript → 打包工具 → 输出
```

**NHAI**：
```
TypeScript → TypeScript 编译器 → 输出
（无需特殊的 Vue 编译器）
```

## 💡 为什么 NHAI 选择这种方式？

1. **框架无关性**：NHAI 设计为框架无关，使用纯 TypeScript 更容易实现
2. **命令式 API**：与 NHAI 的设计理念一致（命令式操作）
3. **无需构建配置**：不需要 Webpack/Vite 的特殊配置
4. **灵活动态**：可以在运行时动态创建和修改组件

## 🎬 实际使用示例

### 创建一个带多个状态的按钮

```typescript
// 传统方式：需要在 template 中写逻辑
<button :class="{ primary: isPrimary, disabled: isDisabled }">
  {{ text }}
</button>

// NHAI 方式：直接操作
button.setText('提交')
button.setType(VueButtonType.PRIMARY)
button.setLoading(true)
button.setDisabled(true)
```

## 📚 相关文档

- [Vue 渲染函数文档](https://cn.vuejs.org/guide/extras/render-function.html)
- [createApp API](https://cn.vuejs.org/api/application.html)
- [h 函数文档](https://cn.vuejs.org/api/render-function.html#h)

