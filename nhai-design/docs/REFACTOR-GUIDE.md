# NHAI Design 项目结构重构说明

## 📁 新的项目结构

```
nhai-design/
├── src/
│   ├── components/           # 组件目录
│   │   ├── buttons/         # 按钮控件
│   │   │   ├── ButtonDemos.ts    # 按钮演示函数
│   │   │   └── ButtonData.ts     # 按钮数据配置
│   │   ├── labels/          # 标签控件
│   │   │   ├── LabelDemos.ts     # 标签演示函数
│   │   │   └── LabelData.ts      # 标签数据配置
│   │   ├── inputs/          # 输入框控件
│   │   ├── layouts/         # 布局控件
│   │   ├── demos/           # 演示组件
│   │   ├── CodeEditor.vue   # 代码编辑器
│   │   ├── OnlineEditor.vue # 在线编辑器
│   │   ├── PreviewArea.vue  # 预览区域
│   │   └── SimpleCodeEditor.vue # 简单代码编辑器
│   ├── data/               # 数据配置
│   │   └── index.ts        # 主数据文件
│   ├── types/              # 类型定义
│   │   └── index.ts        # 类型定义文件
│   ├── utils/              # 工具函数
│   │   └── index.ts        # 工具函数文件
│   ├── App.vue             # 原始主文件 (2900+ 行)
│   ├── App-refactored.vue  # 重构后的主文件 (500+ 行)
│   ├── main.ts             # 入口文件
│   ├── nhai-theme.css      # 主题样式
│   └── style.css           # 全局样式
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔄 重构对比

### 原始 App.vue (2900+ 行)
- ❌ 所有代码都在一个文件中
- ❌ 难以维护和扩展
- ❌ 代码重复严重
- ❌ 没有模块化结构

### 重构后的结构
- ✅ **模块化设计**: 按控件类型分离
- ✅ **职责清晰**: 每个文件有明确的职责
- ✅ **易于维护**: 修改某个控件不影响其他部分
- ✅ **可扩展性**: 新增控件只需添加对应目录
- ✅ **代码复用**: 演示函数和数据结构可复用

## 📋 文件职责说明

### 1. 类型定义 (`src/types/index.ts`)
- `ExampleItem`: 示例项接口
- `ComponentType`: 组件类型接口
- `Category`: 分类接口
- `Framework`: 框架接口
- `DemoFunction`: 演示函数类型

### 2. 工具函数 (`src/utils/index.ts`)
- `frameworks`: 支持的框架配置
- `switchFramework`: 框架切换函数
- `toggleCategory`: 分类展开/收起
- `toggleComponentType`: 组件类型展开/收起
- `selectExample`: 示例选择函数
- `copyCode`: 代码复制函数
- `switchMode`: 模式切换函数
- `loadToEditor`: 加载到编辑器函数

### 3. 按钮控件 (`src/components/buttons/`)
- `ButtonDemos.ts`: 包含所有按钮演示函数
  - `createGeneralButtonDemo`: 通用按钮演示
  - `createTextButtonDemo`: 文本按钮演示
  - `createModernButtonDemo`: ModernNHAIButton 演示
  - `createLinkButtonDemo`: 链接按钮演示
- `ButtonData.ts`: 按钮控件的数据配置

### 4. 标签控件 (`src/components/labels/`)
- `LabelDemos.ts`: 包含所有标签演示函数
  - `createBasicLabelDemo`: 基础标签演示
  - `createStyledLabelDemo`: 样式标签演示
  - `createComprehensiveLabelDemo`: 综合标签演示
- `LabelData.ts`: 标签控件的数据配置

### 5. 主数据文件 (`src/data/index.ts`)
- `treeData`: 树形目录的完整数据结构
- 整合所有控件的数据配置

### 6. 重构后的主文件 (`src/App-refactored.vue`)
- 从 2900+ 行减少到 500+ 行
- 只保留核心的模板和逻辑
- 导入并使用模块化的组件和函数

## 🚀 使用方法

### 1. 替换主文件
```bash
# 备份原始文件
mv src/App.vue src/App-original.vue

# 使用重构后的文件
mv src/App-refactored.vue src/App.vue
```

### 2. 添加新控件
1. 在 `src/components/` 下创建新目录 (如 `cards/`)
2. 创建 `CardDemos.ts` 和 `CardData.ts`
3. 在 `src/data/index.ts` 中导入并添加到 `treeData`

### 3. 修改现有控件
- 修改演示逻辑: 编辑对应的 `*Demos.ts` 文件
- 修改数据配置: 编辑对应的 `*Data.ts` 文件
- 修改类型定义: 编辑 `src/types/index.ts`

## ✨ 重构优势

1. **可维护性**: 每个控件独立管理，修改不会影响其他部分
2. **可扩展性**: 新增控件只需按照现有模式添加文件
3. **代码复用**: 演示函数和数据结构可以在不同地方复用
4. **团队协作**: 不同开发者可以同时开发不同的控件
5. **测试友好**: 每个模块可以独立测试
6. **性能优化**: 按需加载，减少初始加载时间

## 🔧 技术特点

- **TypeScript**: 完整的类型定义和类型安全
- **模块化**: ES6 模块化设计
- **组合式 API**: Vue 3 组合式 API
- **响应式**: Vue 3 响应式系统
- **组件化**: 高度组件化的架构

这次重构大大提升了代码的可维护性和可扩展性，为后续的功能开发奠定了良好的基础。
