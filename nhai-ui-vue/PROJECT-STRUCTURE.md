# NHAI UI Vue - 项目结构

## 📁 目录结构

```
nhai-ui-vue/
├── src/                    # 源代码目录
│   ├── components/         # Vue 组件
│   │   ├── Button/        # 按钮组件
│   │   ├── Input/         # 输入框组件
│   │   ├── Select/        # 选择框组件
│   │   ├── Switch/        # 开关组件
│   │   ├── Checkbox/      # 复选框组件
│   │   ├── Card/          # 卡片组件
│   │   ├── Breadcrumb/    # 面包屑组件
│   │   ├── Tabs/          # 标签页组件
│   │   ├── MenuBar/       # 菜单栏组件
│   │   ├── Container/     # 容器组件
│   │   ├── Grid/          # 网格布局组件
│   │   ├── SplitPanel/    # 分割面板组件
│   │   ├── LayoutBuilder/ # 布局构建器
│   │   ├── AbsolutePanel/ # 绝对定位面板
│   │   └── index.ts       # 组件统一导出
│   ├── lib/               # 核心库
│   │   ├── BaseCommand.ts           # 基础命令类
│   │   ├── ComponentRegistry.ts     # 组件注册表
│   │   ├── UIHelpers.ts             # UI 工具类
│   │   ├── types.ts                 # 类型定义
│   │   └── index.ts                 # 库统一导出
│   ├── App.vue            # 演示应用
│   ├── index.ts           # 库主入口
│   └── main.ts            # 应用入口
├── docs/                  # 文档目录
│   └── README.md          # 文档索引
├── examples/              # 示例代码
│   ├── absolute-layout-demo.html
│   └── custom-layout-demo.html
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目说明

```

## 🏗️ 组件结构

每个组件目录包含：
- `Component.vue` - Vue 单文件组件（声明式使用）
- `componentCommand.ts` - 命令式 API 封装
- `index.ts` - 组件导出

例如 Button 组件：
```
Button/
├── Button.vue           # Vue 组件
├── buttonCommand.ts     # ButtonCommand 类
└── index.ts            # export { Button, ButtonCommand }
```

## 🎯 使用方式

### 1. 声明式使用（Vue SFC）
```vue
<template>
  <VueButton text="点击" @click="handleClick" />
</template>

<script setup>
import { VueButton } from 'nhai-ui-vue'
</script>
```

### 2. 命令式使用（命令 API）
```typescript
import { VueButtonCommand } from 'nhai-ui-vue'

const button = new VueButtonCommand('点击')
button.setOnClick(() => console.log('clicked'))
element.appendChild(button.render())
```

## 🔧 核心类

### BaseCommand
所有命令式组件的基类，提供：
- 生命周期管理（mount/unmount）
- 样式管理（setStyle/setClassName）
- 父子和事件关系

### ComponentRegistry
组件注册表，支持动态创建组件：
```typescript
import { ComponentRegistry } from 'nhai-ui-vue'

ComponentRegistry.register('Button', VueButtonCommand)
const btn = ComponentRegistry.create('Button', ['文本'])
```

## 📝 代码规范

- 组件命名：PascalCase（如 `Button.vue`）
- 命令类命名：PascalCase + Command（如 `ButtonCommand`）
- 文件命名：kebab-case（如 `button-command.ts`）
- 类型定义：在 `lib/types.ts` 中统一管理
- 样式：使用 scoped CSS，避免全局污染

