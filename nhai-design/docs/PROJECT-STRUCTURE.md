# NHAI Design 项目结构

## 📁 新的项目结构

```
nhai-design/
├── public/                     # 静态资源
│   └── index.html             # 主 HTML 文件
├── src/                       # 源代码
│   ├── components/            # 组件目录
│   │   ├── ui/               # UI 组件
│   │   │   ├── CodeEditor.vue      # 代码编辑器
│   │   │   ├── OnlineEditor.vue    # 在线编辑器
│   │   │   ├── PreviewArea.vue     # 预览区域
│   │   │   └── SimpleCodeEditor.vue # 简单代码编辑器
│   │   ├── examples/         # 示例组件
│   │   │   ├── buttons/      # 按钮示例
│   │   │   │   ├── ButtonData.ts   # 按钮数据
│   │   │   │   └── ButtonDemos.ts  # 按钮演示
│   │   │   ├── labels/       # 标签示例
│   │   │   │   ├── LabelData.ts    # 标签数据
│   │   │   │   └── LabelDemos.ts   # 标签演示
│   │   │   ├── inputs/       # 输入框示例
│   │   │   └── layouts/      # 布局示例
│   │   ├── demos/            # 演示组件
│   │   └── examples/         # 示例组件
│   ├── lib/                  # 库文件
│   │   ├── data/            # 数据配置
│   │   │   └── index.ts     # 主数据文件
│   │   ├── types/           # 类型定义
│   │   │   └── index.ts     # 类型定义文件
│   │   └── utils/           # 工具函数
│   │       ├── CodeExecutor.ts    # 代码执行器
│   │       ├── SyntaxChecker.ts   # 语法检查器
│   │       └── index.ts           # 工具函数入口
│   ├── stores/               # 状态管理
│   ├── composables/          # 组合式函数
│   ├── App.vue              # 主应用组件
│   ├── App-refactored.vue   # 重构后的主组件
│   ├── main.ts              # 应用入口
│   ├── nhai-theme.css       # NHAI 主题样式
│   └── style.css            # 全局样式
├── examples/                 # 示例页面
│   ├── components-showcase.html    # 组件展示
│   ├── function-test.html          # 功能测试
│   ├── modern-button-demo.html     # 现代按钮演示
│   ├── nhai-test.html              # NHAI 测试
│   ├── online-editor-demo.html     # 在线编辑器演示
│   ├── preview-test.html           # 预览测试
│   ├── render-debug.html           # 渲染调试
│   └── test-nhai-package.html      # 包测试
├── docs/                     # 文档
│   ├── NHAI-FRAMEWORK-SEPARATION-SUMMARY.md  # 框架分离总结
│   ├── ONLINE_EDITOR_README.md               # 在线编辑器说明
│   ├── README.md                            # 项目说明
│   └── REFACTOR-GUIDE.md                    # 重构指南
├── assets/                   # 资源文件
│   └── UICompont.rar        # UI 组件压缩包
├── scripts/                  # 构建脚本
├── package.json              # 项目配置
├── tsconfig.json            # TypeScript 配置
├── tsconfig.node.json       # Node.js TypeScript 配置
└── vite.config.ts           # Vite 配置
```

## 🔄 重构对比

### 原始结构问题
- ❌ HTML 文件散落在根目录
- ❌ 文档文件混在根目录
- ❌ 组件结构不清晰
- ❌ 工具函数分散

### 新结构优势
- ✅ **清晰的目录分层**: 按功能分类组织
- ✅ **组件模块化**: UI 组件、示例组件分离
- ✅ **文档集中**: 所有文档在 docs 目录
- ✅ **示例独立**: 示例页面独立管理
- ✅ **资源管理**: 静态资源统一管理

## 📋 目录说明

### `/public/` - 静态资源
- 存放不需要构建处理的静态文件
- 主 HTML 文件入口

### `/src/components/ui/` - UI 组件
- 核心 UI 组件
- 可复用的基础组件
- 编辑器、预览器等

### `/src/components/examples/` - 示例组件
- 按控件类型组织的示例
- 每个控件有独立的数据和演示文件
- 便于维护和扩展

### `/src/lib/` - 库文件
- 数据配置、类型定义、工具函数
- 核心业务逻辑
- 可复用的功能模块

### `/examples/` - 示例页面
- 独立的 HTML 演示页面
- 功能测试页面
- 组件展示页面

### `/docs/` - 文档
- 项目文档
- 使用指南
- API 文档

### `/assets/` - 资源文件
- 图片、字体等静态资源
- 压缩包等文件

## 🚀 使用方法

### 开发模式
```bash
npm run dev
```

### 构建
```bash
npm run build
```

### 预览
```bash
npm run preview
```

## 🔧 开发指南

### 添加新控件示例
1. 在 `src/components/examples/` 下创建新目录
2. 创建 `*Data.ts` 和 `*Demos.ts` 文件
3. 在 `src/lib/data/index.ts` 中导入并添加

### 添加新 UI 组件
1. 在 `src/components/ui/` 下创建组件
2. 导出组件接口
3. 添加类型定义

### 添加新示例页面
1. 在 `examples/` 下创建 HTML 文件
2. 引用必要的资源
3. 更新文档

## ✨ 重构优势

1. **可维护性**: 清晰的目录结构，易于定位文件
2. **可扩展性**: 模块化设计，便于添加新功能
3. **团队协作**: 职责明确，减少冲突
4. **代码复用**: 组件和工具函数可复用
5. **文档完善**: 集中的文档管理

这次重构大大提升了项目的可维护性和可扩展性！
