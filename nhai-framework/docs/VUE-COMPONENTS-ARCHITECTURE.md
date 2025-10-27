# Vue Components 架构对比

## 🎯 两种架构方案

### 方案A: 当前方案（在 NHAI 框架内集成）

```
nhai-framework/
├── src/
│   ├── components/
│   │   ├── materialComponents/  (Material Design)
│   │   └── vueComponents/       (Vue + Element Plus)
│   │       ├── VueButton.ts
│   │       └── VueComponentsLoader.ts
└── package.json (包含 Vue, Element Plus)
```

**特点**：
- ✅ 完全集成在 NHAI 框架内
- ✅ 统一的导入方式
- ✅ 共享构建配置
- ⚠️ 每个组件独立 Vue app
- ⚠️ 无法使用 .vue 文件

---

### 方案B: 独立的 Vue 组件库项目（推荐）⭐⭐⭐⭐⭐

```
vue-components-library/
├── packages/
│   └── nhai-ui-vue/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button/
│       │   │   │   ├── Button.vue        # Vue 组件
│       │   │   │   ├── index.ts          # 导出
│       │   │   │   └── ButtonCommon.ts   # 命令式封装
│       │   │   └── Input/
│       │   │       ├── Input.vue
│       │   │       └── index.ts
│       │   └── index.ts                   # 统一导出
│       ├── vite.config.ts
│       └── package.json
└── package.json
```

**特点**：
- ✅ 可以使用 .vue 文件
- ✅ 完整的 Vue 开发体验
- ✅ Element Plus 官方支持
- ✅ 独立的构建和测试
- ✅ 可以作为 npm 包发布

## 📊 详细对比

| 维度 | 方案A（当前） | 方案B（独立项目） |
|------|-------------|----------------|
| **开发体验** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **维护性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **可扩展性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **调试** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **集成度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🚀 方案B 的实现

### 项目结构

```
vue-components/
├── .vscode/
├── .husky/
├── .prettierrc
├── .eslintrc.js
├── .gitignore
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── packages/
    └── nhai-ui-vue/
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        └── src/
            ├── components/
            │   ├── Button/
            │   │   ├── Button.vue              # Vue SFC 组件
            │   │   ├── Button.stories.ts        # Storybook
            │   │   ├── Button.test.ts           # 单元测试
            │   │   ├── buttonCommand.ts         # 命令式封装
            │   │   └── index.ts
            │   ├── Input/
            │   ├── Select/
            │   └── index.ts                     # 导出所有
            ├── composables/                     # 共享逻辑
            ├── utils/
            └── index.ts                         # 主入口
```

### 1. Vue 组件（推荐方式）

```vue
<!-- Button.vue -->
<template>
  <el-button
    :type="type"
    :size="size"
    :plain="plain"
    :loading="loading"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { ElButton } from 'element-plus'

interface Props {
  text?: string
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  round?: boolean
  circle?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'default',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 2. 命令式 API 封装

```typescript
// buttonCommand.ts
import { createApp, h } from 'vue'
import Button from './Button.vue'
import { loadElementPlusButton } from '@/VueComponentsLoader'

export class VueButtonCommand {
  private text: string = ''
  private type: string = 'primary'
  private size: string = 'default'
  private loading: boolean = false
  private disabled: boolean = false
  private onClick?: () => void

  setText(text: string): void {
    this.text = text
  }

  setType(type: string): void {
    this.type = type
  }

  setLoading(loading: boolean): void {
    this.loading = loading
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  setOnClick(callback: () => void): void {
    this.onClick = callback
  }

  /**
   * 渲染为 Vue 组件（命令式）
   */
  render(): HTMLElement {
    const container = document.createElement('div')
    const props = {
      text: this.text,
      type: this.type,
      size: this.size,
      loading: this.loading,
      disabled: this.disabled,
      onClick: () => {
        if (this.onClick) {
          this.onClick()
        }
      }
    }

    // 创建 Vue app 并挂载
    const app = createApp(Button, props)
    app.mount(container)

    return container
  }

  /**
   * 或者：渲染为原生按钮（降级方案）
   */
  renderFallback(): HTMLElement {
    const button = document.createElement('button')
    button.textContent = this.text
    button.disabled = this.disabled
    button.addEventListener('click', () => {
      if (this.onClick) {
        this.onClick()
      }
    })
    return button
  }
}
```

### 3. 使用方式

#### 方式1: 声明式使用（在 Vue 项目中）

```vue
<template>
  <VueButton
    text="提交"
    type="primary"
    :loading="isLoading"
    @click="handleSubmit"
  />
</template>

<script setup>
import { VueButton } from 'nhai-ui-vue'
</script>
```

#### 方式2: 命令式使用（命令式场景）

```typescript
import { VueButtonCommand } from 'nhai-ui-vue/command'

const button = new VueButtonCommand()
button.setText('提交')
button.setType('primary')
button.setOnClick(() => console.log('clicked'))

const element = button.render()
document.body.appendChild(element)
```

## 🎯 两种方案的实际使用

### 在 NHAI 项目中使用

```typescript
// 方案A: 当前方案
import { VueButton } from 'nhai-framework'
const button = new VueButton('文本')
button.render()

// 方案B: 独立项目
import { VueButtonCommand } from 'nhai-ui-vue'
const button = new VueButtonCommand('文本')
button.render()
```

**结果**: 对于用户来说，使用方式完全一样！

## 💡 推荐方案

### ✅ 推荐使用**方案B**（独立 Vue 项目）

**原因**：

1. **开发体验好**
   - 可以使用完整的 Vue 开发工具
   - 支持热重载
   - 可以使用 `.vue` 文件
   - 更好的 TypeScript 支持

2. **性能优化**
   - 可以使用 Vue 的编译优化
   - 更好的 Tree Shaking
   - 可以使用 Vite 的快速热更新

3. **维护性强**
   - 独立的版本控制
   - 独立的测试和文档
   - 可以独立发布 npm 包

4. **扩展性好**
   - 可以轻松添加新的 Vue 组件
   - 可以使用 Vue 生态系统的工具
   - 可以集成 Storybook、Vitest 等

5. **集成简单**
   - 作为 npm 包引入到 NHAI
   - NHAI 只关注命令式封装
   - 职责清晰

### 📦 实施步骤

1. **创建独立的 Vue 项目**
   ```bash
   npm create vue@latest vue-components-library
   cd vue-components-library
   npm install element-plus @element-plus/icons-vue
   ```

2. **创建组件**
   ```bash
   src/components/Button/Button.vue
   src/components/Button/buttonCommand.ts
   ```

3. **发布到 npm**
   ```bash
   npm run build
   npm publish
   ```

4. **在 NHAI 中使用**
   ```bash
   npm install nhai-ui-vue
   ```

## 🎨 架构图

```
┌─────────────────────────────────┐
│   NHAI Framework                │
│                                 │
│   ┌──────────────────────────┐  │
│   │  命令式 API 封装         │  │
│   │  (NHAIWidget)            │  │
│   └───────────┬──────────────┘  │
│               │ import          │
│               ↓                 │
│   ┌──────────────────────────┐  │
│   │  nhai-ui-vue (npm)        │  │
│   │                           │  │
│   │  ┌────────────────────┐   │  │
│   │  │  命令式封装        │   │  │
│   │  │  (VueButtonCommand)│  │  │
│   │  └────────┬───────────┘   │  │
│   │           │ uses          │  │
│   │  ┌────────▼───────────┐   │  │
│   │  │  Vue 组件           │   │  │
│   │  │  (Button.vue)       │   │  │
│   │  └────────────────────┘   │  │
│   └───────────────────────────┘  │
└─────────────────────────────────┘
```

## 📝 总结

| 方面 | 方案A | 方案B（推荐） |
|------|-------|-------------|
| **适用场景** | 快速原型、少量组件 | 大型项目、完整组件库 |
| **开发体验** | ⚠️ 受限 | ✅ 完整 |
| **性能** | ⚠️ 一般 | ✅ 优秀 |
| **维护** | ⚠️ 困难 | ✅ 简单 |
| **扩展** | ⚠️ 有限 | ✅ 灵活 |

**最终建议**：对于大型设计工具，使用**方案B**（独立 Vue 项目）更合适！

