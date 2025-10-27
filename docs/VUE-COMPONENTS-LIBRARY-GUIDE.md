# 创建独立 Vue 组件库的完整指南

## 🎯 方案概述

创建一个独立的 Vue 3 + Element Plus 组件库项目，专门用于开发可复用的 UI 组件，然后通过命令式 API 封装提供给 NHAI 框架使用。

## 📂 项目结构

```
vue-components-library/
├── .vscode/
│   └── settings.json
├── .husky/
├── .prettierrc
├── .eslintrc.js
├── .gitignore
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── vite.config.ts
└── packages/
    └── nhai-ui-vue/
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        ├── examples/                    # 示例项目
        │   └── App.vue
        ├── src/
        │   ├── components/
        │   │   ├── Button/
        │   │   │   ├── Button.vue
        │   │   │   ├── Button.stories.ts
        │   │   │   ├── Button.test.ts
        │   │   │   ├── buttonCommand.ts  # 命令式封装
        │   │   │   └── index.ts
        │   │   ├── Input/
        │   │   ├── Select/
        │   │   ├── Dialog/
        │   │   └── index.ts             # 导出所有组件
        │   ├── composables/
        │   │   ├── useButtonState.ts
        │   │   └── useForm.ts
        │   ├── utils/
        │   └── index.ts                 # 主入口
        └── dist/
```

## 🚀 快速开始

### 1. 创建项目

```bash
# 创建 Vue 项目
npm create vue@latest vue-components-library
cd vue-components-library

# 安装依赖
npm install
npm install -D element-plus @element-plus/icons-vue
npm install -D @vitejs/plugin-vue-jsx
npm install -D @storybook/vue3 @storybook/addon-essentials
npm install -D vitest @vue/test-utils
```

### 2. 配置文件

#### `package.json`
```json
{
  "name": "nhai-ui-vue",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "build:watch": "vite build --watch",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "element-plus": "^2.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue-jsx": "^4.0.0",
    "@vue/test-utils": "^2.4.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NHAIUIVue',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### 3. 创建第一个组件

#### `src/components/Button/Button.vue`
```vue
<template>
  <el-button
    :type="type"
    :size="size"
    :plain="plain"
    :round="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    :icon="icon ? `<el-icon><${icon} /></el-icon>` : undefined"
    @click="handleClick"
  >
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
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

#### `src/components/Button/buttonCommand.ts`
```typescript
import { createApp, h } from 'vue'
import Button from './Button.vue'

export class VueButtonCommand {
  private text: string = ''
  private type: string = 'primary'
  private size: string = 'default'
  private loading: boolean = false
  private disabled: boolean = false
  private plain: boolean = false
  private round: boolean = false
  private circle: boolean = false
  private icon?: string
  private onClick?: () => void

  constructor(text: string = '') {
    this.text = text
  }

  setText(text: string): void {
    this.text = text
  }

  getText(): string {
    return this.text
  }

  setType(type: string): void {
    this.type = type
  }

  setSize(size: string): void {
    this.size = size
  }

  setLoading(loading: boolean): void {
    this.loading = loading
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  setPlain(plain: boolean): void {
    this.plain = plain
  }

  setRound(round: boolean): void {
    this.round = round
  }

  setCircle(circle: boolean): void {
    this.circle = circle
  }

  setIcon(icon: string): void {
    this.icon = icon
  }

  setOnClick(callback: () => void): void {
    this.onClick = callback
  }

  /**
   * 渲染为 Vue 组件（命令式）
   */
  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const ButtonWrapper = {
      setup() {
        const handleClick = () => {
          if (self.onClick) {
            self.onClick()
          }
        }

        return () => h(Button, {
          text: self.text,
          type: self.type,
          size: self.size,
          plain: self.plain,
          round: self.round,
          circle: self.circle,
          loading: self.loading,
          disabled: self.disabled,
          icon: self.icon,
          onClick: handleClick
        })
      }
    }

    const app = createApp(ButtonWrapper)
    app.mount(container)

    return container
  }

  /**
   * 降级方案：原生按钮
   */
  renderFallback(): HTMLElement {
    const button = document.createElement('button')
    button.textContent = this.text
    button.disabled = this.disabled
    if (this.onClick) {
      button.addEventListener('click', this.onClick)
    }
    return button
  }
}

export default VueButtonCommand
```

#### `src/components/Button/index.ts`
```typescript
export { default as VueButton } from './Button.vue'
export { VueButtonCommand } from './buttonCommand'
export type { VueButtonProps } from './types'
```

#### `src/index.ts`
```typescript
// 组件导出
export { VueButton } from './components/Button'
export { VueButtonCommand } from './components/Button'

// 类型导出
export type { VueButtonProps } from './components/Button'

// 所有组件
export * from './components'
```

## 💻 使用方式

### 在 Vue 项目中使用（声明式）

```vue
<template>
  <div>
    <VueButton
      text="提交"
      type="primary"
      :loading="isLoading"
      @click="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { VueButton } from 'nhai-ui-vue'

const isLoading = ref(false)

const handleSubmit = () => {
  isLoading.value = true
  // ...
}
</script>
```

### 在命令式场景中使用

```typescript
import { VueButtonCommand } from 'nhai-ui-vue'

const button = new VueButtonCommand('提交')
button.setType('primary')
button.setLoading(false)
button.setOnClick(() => {
  console.log('clicked')
})

const element = button.render()
document.body.appendChild(element)
```

## 🔗 在 NHAI 中集成

```typescript
// nhai-framework/src/components/vueComponents/basic/VueButton.ts
import { VueButtonCommand } from 'nhai-ui-vue'

export class VueButton extends NHAIWidget {
  private _command: VueButtonCommand

  constructor(text: string = '', parent?: NHAIObject) {
    super(parent)
    this._command = new VueButtonCommand(text)
  }

  setText(text: string): void {
    this._command.setText(text)
  }

  setType(type: string): void {
    this._command.setType(type)
  }

  render(): HTMLElement {
    return this._command.render()
  }
}
```

## ✅ 优势总结

### 1. **开发体验**
- ✅ 可以使用完整的 Vue 开发工具
- ✅ 支持热重载
- ✅ 可以使用 `.vue` 文件
- ✅ 更好的 TypeScript 支持

### 2. **性能**
- ✅ 可以使用 Vue 的编译优化
- ✅ 更好的 Tree Shaking
- ✅ 可以使用 Vite 的快速热更新

### 3. **维护性**
- ✅ 独立的版本控制
- ✅ 独立的测试和文档
- ✅ 可以独立发布 npm 包

### 4. **扩展性**
- ✅ 可以轻松添加新的 Vue 组件
- ✅ 可以使用 Vue 生态系统的工具
- ✅ 可以集成 Storybook、Vitest 等

## 🎬 下一步

1. **创建独立项目**
   ```bash
   npm create vue@latest vue-components-library
   ```

2. **安装依赖**
   ```bash
   npm install element-plus @element-plus/icons-vue
   ```

3. **创建组件**
   - 创建 Button、Input、Select 等组件
   - 添加命令式封装
   - 添加测试和文档

4. **发布 npm 包**
   ```bash
   npm run build
   npm publish
   ```

5. **在 NHAI 中集成**
   ```bash
   npm install nhai-ui-vue
   ```

## 📝 总结

这个方案的优势：
- ✅ **专业**: 独立的 Vue 项目，完整的开发工具链
- ✅ **高效**: 可以使用 `.vue` 文件，更好的开发体验
- ✅ **可扩展**: 易于添加新组件和维护
- ✅ **灵活**: 既可以声明式使用，也可以命令式使用
- ✅ **可维护**: 独立的版本控制和测试

**强烈推荐使用这个方案！** 🚀

