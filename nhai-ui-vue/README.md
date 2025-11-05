# NHAI UI Vue - 企业级 UI 组件库

基于 Vue 3 + Element Plus 的企业级 UI 组件库，采用三层架构设计。

## 🎯 设计理念

构建一个**企业级、可扩展、易使用**的 UI 组件库，采用**三层架构**：

```
┌─────────────────────────────────────────┐
│  业务组件层 (Business Components)        │
│  DataTable, FormBuilder, FileUpload...   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  基础组件层 (Base Components)           │
│  Button, Input, VBox, HBox, Grid...    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  底层框架 (Vue 3 + Element Plus)        │
│  成熟稳定、生态丰富                       │
└─────────────────────────────────────────┘
```

## ✨ 核心特性

### 1. 对象化设计（ ）
```typescript
import { Button, VBox, Input } from 'nhai-ui-vue'

// 每个组件都是独立的对象
const btn = new Button('提交')
const input = new Input('用户名')

// 组合使用
const layout = new VBox()
layout.addChild(btn)
layout.addChild(input)

// 渲染
document.body.appendChild(layout.render())
```

### 2. 命令式 API
```typescript
const button = new Button('保存')
button.setType('primary')
button.setOnClick(() => console.log('点击'))
const element = button.render()
```

### 3. 组件组合能力
```typescript
const form = new VBox()
form.addChild(new Input('姓名'))
form.addChild(new Button('提交'))
```

### 4. 完整的 TypeScript 支持
```typescript
interface ButtonProps {
  text: string
  type?: 'primary' | 'success'
  onClick?: () => void
}
```

## 📦 已实现的组件

### 基础控件 ✅
- Button, Input, Select, Switch, Checkbox

### 布局组件 ✅
- VBox, HBox, Grid, SplitPanel, Container, LayoutBuilder

### 导航组件 ✅
- Breadcrumb, Tabs, MenuBar

### 容器组件 ✅
- Card, Container

### 业务组件 ⏳
- DataTable（规划中）
- FormBuilder（规划中）
- FileUploader（规划中）

## 🚀 快速开始

### 方式 1: NPM 安装（推荐）

```bash
npm install nhai-ui-vue
```

```typescript
import { Button, VBox, Input } from 'nhai-ui-vue'

// 创建组件
const button = new Button('提交')
button.setType('primary')

const input = new Input('用户名')

// 组合布局
const layout = new VBox()
layout.setSpacing(10)
layout.addChild(input)
layout.addChild(button)

// 渲染
const element = layout.render()
document.body.appendChild(element)
```

### 方式 2: 不使用 NPM（外部使用）

如果不通过 npm 安装，有多种方式可以使用组件库：

#### ES Module 方式（推荐，不需要绑定到 window）

```html
<script type="module">
  import { NhaiButtonCommand, NhaiRowCommand, NhaiColCommand } from './dist/index.es.js'
  
  const button = new NhaiButtonCommand('按钮')
  button.setType('primary')
  document.body.appendChild(button.render())
</script>
```

#### UMD 方式（绑定到 window）

```html
<script src="./dist/index.umd.js"></script>
<script>
  const { NhaiButtonCommand } = window.NHAIUIVue
  const button = new NhaiButtonCommand('按钮')
  button.setType('primary')
  document.body.appendChild(button.render())
</script>
```

**📖 详细的外部使用指南请查看：** [外部使用指南](./docs/EXTERNAL-USAGE-GUIDE.md)

**🌐 分布式/微前端项目：** 如果您的项目是分布式架构，请查看 [分布式项目使用指南](./docs/DISTRIBUTED-USAGE-GUIDE.md)，了解如何避免多份加载的问题。

**示例文件：**
- [ES Module 使用示例](./examples/external-usage-esm.html)
- [UMD 使用示例](./examples/external-usage-umd.html)

## 💡 示例

### 创建表单
```typescript
import { VBox, Input, Button } from 'nhai-ui-vue'

const form = new VBox()
form.setSpacing(10)

const nameInput = new Input('姓名')
form.addChild(nameInput)

const submitBtn = new Button('提交')
submitBtn.setType('primary')
form.addChild(submitBtn)

document.body.appendChild(form.render())
```

### 创建工具栏
```typescript
import { HBox, Button } from 'nhai-ui-vue'

const toolbar = new HBox()
toolbar.setGap('12px')

const saveBtn = new Button('保存')
const cancelBtn = new Button('取消')

toolbar.addChild(saveBtn)
toolbar.addChild(cancelBtn)

document.body.appendChild(toolbar.render())
```

## 🎨 架构优势

### 1. 统一的组件接口
所有组件继承 `BaseCommand`，提供统一的 API。

### 2. 属性系统（ ）
```typescript
btn.setProperty('data-id', 'btn-1')
const id = btn.getProperty('data-id')
```

### 3. 事件系统（  的 signal/slot）
```typescript
btn.on('click', () => console.log('点击了'))
btn.emit('click')
```

### 4. 父子关系（ ）
```typescript
layout.addChild(btn)
layout.removeChild(btn)
const children = layout.getChildren()
```

## 📚 文档

- [企业级架构设计](./ENTERPRISE-ARCHITECTURE.md)
- [实现路线图](./IMPLEMENTATION-ROADMAP.md)
- [命令式 API 指南](./COMMAND-API-GUIDE.md)
- [布局系统指南](./LAYOUT-SYSTEM-GUIDE.md)
- [迁移完成总结](./MIGRATION-COMPLETE.md)
- [外部使用指南](./docs/EXTERNAL-USAGE-GUIDE.md) - 不使用 NPM 的多种集成方式
- [分布式项目使用指南](./docs/DISTRIBUTED-USAGE-GUIDE.md) - 微前端/分布式架构优化方案
- [命名空间使用指南](./docs/NAMESPACE-GUIDE.md) - 命名空间组织和分类使用

## 🔧 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 📝 许可证

MIT

## 🎯 设计目标

打造一个**企业级、可扩展、易使用**的 UI 组件库，
  的组件化设计理念，基于 Vue 生态实现。
