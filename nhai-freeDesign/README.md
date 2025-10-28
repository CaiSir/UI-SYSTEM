# NHAI Free Design

基于 NHAI 框架的可视化组件组合和设计工具。

## 项目概述

NHAI Free Design 是一个完全基于 NHAI 框架构建的可视化组件组合器，支持拖拽式组件设计、属性编辑、模板保存等功能。该项目展示了 NHAI 框架在专业级 UI 工具开发中的应用。

## 项目结构

```
nhai-freeDesign/
├── src/
│   ├── main.ts          # 主入口文件
│   ├── style.css        # 样式文件
│   └── components/      # 组件目录
├── demo.html            # 组件组合器演示页面
├── absolute-panel-demo.html  # AbsolutePanel 命令式 API 演示页面
├── index.html           # 主页面
├── package.json         # 项目配置
├── vite.config.ts       # Vite 配置
└── tsconfig.json        # TypeScript 配置
```

## 核心功能

### 1. 组件组合器 (NHAIComponentComposer)

- **拖拽式设计**: 从组件面板拖拽组件到画布
- **属性编辑**: 实时编辑组件属性
- **模板管理**: 保存和加载设计模板
- **多选支持**: 支持多组件选择和批量操作
- **网格对齐**: 自动网格对齐功能

### 2. 预定义组件

- **按钮组件**: 支持多种类型和尺寸
- **输入框组件**: 文本输入框
- **布局组件**: 垂直和水平布局容器
- **容器组件**: 通用容器组件

### 3. 专业功能

- **组件注册表**: 管理所有可用组件
- **属性管理器**: 处理组件属性编辑
- **模板管理器**: 模板的保存和加载
- **事件系统**: 完整的事件监听和触发机制

## 技术特点

### 1. 纯 TypeScript 实现

- 不依赖任何前端框架（Vue、React、Svelte）
- 直接使用 NHAI 框架的 Vanilla 适配器
- 完整的类型安全支持

### 2. 模块化架构

- 组件注册表 (ComponentRegistry)
- 属性管理器 (PropertyManager)
- 模板管理器 (TemplateManager)
- 清晰的职责分离

### 3. 可扩展设计

- 易于添加新组件类型
- 支持自定义属性编辑器
- 灵活的模板系统

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建项目

```bash
npm run build
```

### 4. 预览构建结果

```bash
npm run preview
```

### 5. 查看演示页面

项目包含以下演示页面：

- **index.html** - 主应用（菜单栏 + 目录侧边栏 + 3D 画布）
- **demo.html** - 组件组合器演示
- **absolute-panel-demo.html** - AbsolutePanel 命令式 API 演示（支持在线编辑代码和实时预览）

## API 使用示例

### AbsolutePanel 命令式 API 演示

打开 `absolute-panel-demo.html` 查看完整的在线代码编辑演示，支持：
- 📝 在线代码编辑器
- 🎨 实时预览效果
- 💡 代码示例和使用说明

```typescript
import { AbsolutePanelCommand, VueButtonCommand, VueInputCommand } from 'nhai-ui-vue'

// 创建绝对定位面板
const panel = new AbsolutePanelCommand('100%', '600px')
panel.setBackgroundColor('#f0f0f0')

// 添加按钮到指定位置
const button = new VueButtonCommand('点击我')
button.setType('primary')
panel.addWidgetAt('btn1', button, { x: 50, y: 50 }, { width: 100, height: 40 })

// 添加输入框
const input = new VueInputCommand()
input.setPlaceholder('请输入...')
panel.addWidgetAt('input1', input, { x: 50, y: 120 }, { width: 250, height: 40 })

// 渲染面板
const element = panel.render()
document.body.appendChild(element)
```

### AbsolutePanelCommand 主要方法

- `constructor(width?, height?)` - 创建面板，设置宽高
- `setWidth(width)` - 设置面板宽度
- `setHeight(height)` - 设置面板高度
- `setBackgroundColor(color)` - 设置背景颜色
- `addWidgetAt(id, widget, position, size?)` - 在指定位置添加组件
- `setPosition(id, x, y)` - 更新组件位置
- `getPosition(id)` - 获取组件位置
- `setSize(id, width, height)` - 更新组件大小
- `getSize(id)` - 获取组件大小
- `render()` - 渲染面板为 DOM 元素
- `unmount()` - 卸载面板

### 创建组件组合器

```typescript
import { NHAIComponentComposer } from 'nhai-framework'

const composer = new NHAIComponentComposer({
  rootPath: '/components',
  allowedTypes: ['button', 'input', 'container', 'layout'],
  enableDragDrop: true,
  enablePropertyEdit: true,
  enableTemplateSave: true,
  enableMultiSelect: true,
  showToolbar: true,
  showComponentPalette: true,
  showPropertyPanel: true,
  canvasWidth: 800,
  canvasHeight: 600,
  gridSize: 20,
  snapToGrid: true
})

// 渲染到页面
const element = composer.render()
document.body.appendChild(element)
```

### 监听事件

```typescript
// 监听组件添加事件
composer.addEventListener('componentAdded', (data) => {
  console.log('组件已添加:', data.detail.component)
})

// 监听模板保存事件
composer.addEventListener('templateSaved', (data) => {
  console.log('模板已保存:', data.detail.template)
})
```

### 手动操作组件

```typescript
// 添加组件
const component = composer.addComponent('button', { x: 100, y: 100 })

// 更新组件属性
composer.updateComponentProps(component.id, { text: '新文本' })

// 保存模板
const template = composer.saveTemplate('我的模板', '模板描述')
```

## 配置选项

### ComposerConfig

```typescript
interface ComposerConfig {
  // 基础配置
  rootPath: string
  allowedTypes: string[]
  
  // 功能配置
  enableDragDrop: boolean
  enablePropertyEdit: boolean
  enableTemplateSave: boolean
  enableMultiSelect: boolean
  
  // 显示配置
  showToolbar: boolean
  showComponentPalette: boolean
  showPropertyPanel: boolean
  
  // 画布配置
  canvasWidth: number
  canvasHeight: number
  gridSize: number
  snapToGrid: boolean
}
```

## 扩展开发

### 添加新组件

1. 在 `ComponentRegistry` 中注册组件定义
2. 实现组件的渲染逻辑
3. 定义组件的属性模式

### 自定义属性编辑器

1. 扩展 `PropSchema` 类型
2. 在 `createPropertyEditor` 中添加新的编辑器类型
3. 实现相应的值解析逻辑

## 与 nhai-design 集成

NHAI Free Design 的组件组合器已集成到 `nhai-design` 项目中，可以在"专业控件" -> "组件组合器"中找到演示案例。

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 相关项目

- [nhai-framework](../nhai-framework/) - NHAI 核心框架
- [nhai-design](../nhai-design/) - NHAI 组件展示和在线编辑器
