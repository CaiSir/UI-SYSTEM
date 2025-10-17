# NHAI Design 开发指南

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装和运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构说明

### 核心目录
- `src/components/ui/` - 核心 UI 组件
- `src/components/examples/` - 组件示例和演示
- `src/lib/` - 工具函数、类型定义、数据配置
- `examples/` - 独立的示例页面
- `docs/` - 项目文档

### 组件开发规范

#### 1. UI 组件 (`src/components/ui/`)
- 可复用的基础组件
- 遵循 Vue 3 组合式 API
- 提供完整的 TypeScript 类型定义
- 支持主题定制

#### 2. 示例组件 (`src/components/examples/`)
- 按控件类型组织目录
- 每个控件包含 `*Data.ts` 和 `*Demos.ts`
- `*Data.ts`: 组件配置和代码示例
- `*Demos.ts`: 演示函数实现

## 🔧 开发工作流

### 添加新控件示例

1. **创建控件目录**
```bash
mkdir src/components/examples/cards
```

2. **创建数据文件** (`CardData.ts`)
```typescript
import type { ComponentType } from '../../lib/types'
import { createCardDemo } from './CardDemos'

export const cardControlsData: ComponentType = {
  name: '卡片控件',
  expanded: false,
  children: [
    {
      id: 'basic-card',
      title: '基础卡片',
      description: '展示基础卡片的样式和功能',
      code: `// 基础卡片示例代码`,
      createDemo: createCardDemo
    }
  ]
}
```

3. **创建演示文件** (`CardDemos.ts`)
```typescript
import type { DemoFunction } from '../../lib/types'

export const createCardDemo: DemoFunction = () => {
  // 演示实现
}
```

4. **更新主数据文件** (`src/lib/data/index.ts`)
```typescript
import { cardControlsData } from '../components/examples/cards/CardData'

export const treeData: Category[] = [
  {
    name: '基础控件',
    children: [
      buttonControlsData,
      labelControlsData,
      cardControlsData, // 添加新控件
      // ...
    ]
  }
]
```

### 添加新 UI 组件

1. **创建组件文件** (`src/components/ui/NewComponent.vue`)
```vue
<template>
  <div class="new-component">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
.new-component {
  /* 组件样式 */
}
</style>
```

2. **导出组件** (`src/components/ui/index.ts`)
```typescript
export { default as NewComponent } from './NewComponent.vue'
```

3. **添加类型定义** (`src/lib/types/index.ts`)
```typescript
export interface NewComponentProps {
  // 组件属性类型
}
```

## 📚 可用脚本

### 开发脚本
- `npm run dev` - 启动开发服务器
- `npm run type-check` - TypeScript 类型检查
- `npm run lint` - 代码检查
- `npm run format` - 代码格式化

### 构建脚本
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run clean` - 清理构建文件

### 示例和文档
- `npm run serve:examples` - 启动示例服务器
- `npm run docs:dev` - 启动文档开发服务器
- `npm run docs:build` - 构建文档
- `npm run docs:preview` - 预览文档

## 🎨 样式指南

### CSS 类命名
- 使用 BEM 命名规范
- 组件前缀: `nhai-`
- 示例: `nhai-button`, `nhai-button--primary`, `nhai-button__text`

### 主题变量
- 在 `src/nhai-theme.css` 中定义主题变量
- 使用 CSS 自定义属性
- 支持暗色/亮色主题切换

## 🧪 测试指南

### 组件测试
- 为每个 UI 组件编写单元测试
- 测试文件放在 `src/components/ui/__tests__/`
- 使用 Vue Test Utils

### 示例测试
- 为每个示例编写集成测试
- 确保演示功能正常工作
- 测试文件放在 `src/components/examples/__tests__/`

## 📖 文档规范

### 组件文档
- 每个组件都要有完整的文档
- 包含使用示例和 API 说明
- 文档放在 `docs/components/`

### API 文档
- 自动生成 API 文档
- 使用 TypeScript 类型信息
- 文档放在 `docs/api/`

## 🚀 部署指南

### 构建配置
- 使用 Vite 进行构建
- 支持多环境配置
- 优化生产构建

### 部署流程
1. 运行 `npm run build`
2. 将 `dist/` 目录部署到服务器
3. 配置服务器支持 SPA 路由

## 🤝 贡献指南

### 代码规范
- 使用 ESLint 和 Prettier
- 遵循 Vue 3 最佳实践
- 编写清晰的注释

### 提交规范
- 使用语义化提交信息
- 格式: `type(scope): description`
- 示例: `feat(button): add new button variant`

### Pull Request
- 确保代码通过所有检查
- 添加适当的测试
- 更新相关文档

## 🔍 调试技巧

### 开发工具
- 使用 Vue DevTools
- 启用 TypeScript 严格模式
- 使用 Vite 的热更新

### 常见问题
- 组件不显示: 检查导入路径
- 类型错误: 检查 TypeScript 配置
- 样式问题: 检查 CSS 作用域

## 📞 支持

如有问题，请：
1. 查看文档
2. 搜索现有 Issue
3. 创建新的 Issue
4. 联系开发团队
