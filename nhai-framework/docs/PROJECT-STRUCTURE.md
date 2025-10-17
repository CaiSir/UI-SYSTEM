# NHAI 框架项目结构

## 📁 目录结构说明

```
nhai-framework/
├── 📁 src/                    # 源代码目录
│   ├── 📁 adapters/           # 框架适配器
│   │   ├── ReactAdapter.ts    # React 适配器
│   │   ├── VueAdapter.ts      # Vue 适配器
│   │   ├── SvelteAdapter.ts   # Svelte 适配器
│   │   └── VanillaAdapter.ts  # 原生 JavaScript 适配器
│   ├── 📁 analysis/           # 分析文档
│   │   └── FrameworkComparison.ts
│   ├── 📁 components/         # 组件库
│   │   ├── DynamicComponents.ts
│   │   ├── ModernNHAIButton.ts
│   │   ├── 📁 NHAIButton/     # 按钮组件
│   │   ├── 📁 NHAICard/       # 卡片组件
│   │   ├── 📁 NHAIContainer/  # 容器组件
│   │   ├── 📁 NHAIInput/      # 输入组件
│   │   ├── 📁 NHAILabel/      # 标签组件
│   │   ├── 📁 NHAILayouts/    # 布局组件
│   │   └── 📁 NHAIWindow/     # 窗口组件
│   ├── 📁 core/               # 核心系统
│   │   └── NHAICore.ts
│   ├── 📁 examples/           # 示例代码
│   │   └── APIDynamicComponents.ts
│   ├── 📁 factory/            # 工厂模式
│   │   └── NHAIFactory.ts
│   ├── 📁 types/              # 类型定义
│   └── index.ts               # 主入口文件
├── 📁 dist/                   # 构建输出目录
├── 📁 docs/                   # 文档目录
│   ├── README.md              # 项目说明
│   ├── PERFORMANCE-ANALYSIS.md
│   ├── REACT-VS-VUE-VS-SVELTE-ANALYSIS.md
│   ├── UIFRAMEWORK-WRAPPER-ANALYSIS.md
│   └── NHAITextButton-Links-Guide.md
├── 📁 demos/                  # 演示页面
│   ├── dynamic-components-demo.html
│   ├── framework-wrapper-demo.html
│   ├── react-vue-svelte-comparison.html
│   └── framework-comparison-demo.html
├── 📁 tests/                  # 测试页面
│   ├── actual-performance-test.html
│   ├── performance-comparison-test.html
│   ├── quick-test.html
│   ├── real-performance-test.html
│   └── test-page.html
├── 📁 node_modules/           # 依赖包
├── package.json               # 项目配置
├── package-lock.json          # 依赖锁定
├── rollup.config.js           # 构建配置
└── tsconfig.json              # TypeScript 配置
```

## 🎯 目录用途说明

### 📁 src/ - 源代码
- **adapters/**: 各种前端框架的适配器实现
- **components/**: NHAI 框架的核心组件库
- **core/**: 框架的核心系统和 API
- **examples/**: 使用示例和最佳实践
- **factory/**: 工厂模式实现
- **types/**: TypeScript 类型定义

### 📁 docs/ - 文档
- **README.md**: 项目主要说明文档
- **PERFORMANCE-ANALYSIS.md**: 性能分析报告
- **REACT-VS-VUE-VS-SVELTE-ANALYSIS.md**: 框架对比分析
- **UIFRAMEWORK-WRAPPER-ANALYSIS.md**: UI 框架封装分析
- **NHAITextButton-Links-Guide.md**: 组件使用指南

### 📁 demos/ - 演示页面
- **dynamic-components-demo.html**: 动态组件系统演示
- **framework-wrapper-demo.html**: 框架封装演示
- **react-vue-svelte-comparison.html**: 框架对比演示

### 📁 tests/ - 测试页面
- **actual-performance-test.html**: 实际性能测试
- **performance-comparison-test.html**: 性能对比测试
- **quick-test.html**: 快速功能测试
- **real-performance-test.html**: 真实性能测试
- **test-page.html**: 基础功能测试

### 📁 dist/ - 构建输出
- 包含编译后的 JavaScript 文件
- TypeScript 声明文件
- Source map 文件

## 🚀 快速开始

### 开发环境
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建项目
npm run build
```

### 查看演示
1. 打开 `demos/` 目录中的 HTML 文件
2. 查看各种功能演示

### 运行测试
1. 打开 `tests/` 目录中的 HTML 文件
2. 运行性能测试和功能测试

### 阅读文档
1. 查看 `docs/` 目录中的 Markdown 文件
2. 了解框架设计和使用方法

## 📝 文件命名规范

- **组件文件**: PascalCase (如 `NHAIButton.ts`)
- **适配器文件**: PascalCase + Adapter (如 `ReactAdapter.ts`)
- **演示文件**: kebab-case + demo (如 `dynamic-components-demo.html`)
- **测试文件**: kebab-case + test (如 `performance-test.html`)
- **文档文件**: UPPERCASE + ANALYSIS (如 `PERFORMANCE-ANALYSIS.md`)

## 🔧 维护说明

- 新增组件时，请在 `src/components/` 下创建对应目录
- 新增适配器时，请在 `src/adapters/` 下创建文件
- 新增演示时，请在 `demos/` 目录下创建 HTML 文件
- 新增测试时，请在 `tests/` 目录下创建 HTML 文件
- 更新文档时，请在 `docs/` 目录下更新 Markdown 文件
