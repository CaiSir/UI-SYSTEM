# NHAI UI Vue - 企业级 UI 组件库概览

## 🎯 项目定位

构建一个**企业级、可扩展、易使用**的 UI 组件库，采用**三层架构**设计：

1. **底层**：Vue 3 + Element Plus（成熟稳定）
2. **中层**：基于底层封装的对象式基础组件（类似 Qt）
3. **上层**：通过命令 API 组合生成业务组件

## 📊 架构图

```
┌─────────────────────────────────────────────────────┐
│           业务组件层 (Business Components)           │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  DataTable   │ │ FormBuilder  │ │ FileUpload  │ │
│  └──────────────┘ └──────────────┘ └─────────────┘ │
│          ↓               ↓               ↓          │
│   通过命令 API 组合基础组件                            │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│           基础组件层 (Base Components)                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │Button│Input│Select│VBox │HBox │     │          │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘          │
│         命令式 API + 组合能力                         │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│        底层框架 (Vue 3 + Element Plus)              │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────┐     │
│  │   Vue    │ │ Element Plus │ │   生态      │     │
│  └──────────┘ └──────────────┘ └─────────────┘     │
│           成熟稳定、生态丰富                          │
└─────────────────────────────────────────────────────┘
```

## 🎨 设计原则

### 1. 对象化设计（类似 Qt）

```typescript
// 每个组件都是一个对象
const button = new Button('提交')
button.setType('primary')
button.setOnClick(() => console.log('clicked'))
button.render()
```

### 2. 组合优先（Composition over Inheritance）

```typescript
// 通过组合构建复杂组件
const form = new VBox()
form.addWidget(new Input('用户名'))
form.addWidget(new Input('密码'))
form.addWidget(new Button('提交'))
```

### 3. 命令式 API（Imperative API）

```typescript
// 使用命令式 API，不依赖声明式语法
const layout = new VBox()
layout.setSpacing(10)
layout.setPadding(20)
layout.addWidget(button)
```

### 4. 类型安全（Type Safety）

```typescript
// 完整的 TypeScript 类型支持
interface ButtonProps {
  text: string
  type?: 'primary' | 'success'
}
```

## 📦 已实现组件

### 基础控件
- ✅ Button - 按钮
- ✅ Input - 输入框
- ✅ Select - 选择器
- ✅ Switch - 开关
- ✅ Checkbox - 复选框
- ✅ Card - 卡片

### 布局组件
- ✅ VBox - 垂直布局
- ✅ HBox - 水平布局
- ✅ Grid - 网格布局
- ✅ SplitPanel - 分割面板
- ✅ Container - 容器

### 导航组件
- ✅ Breadcrumb - 面包屑
- ✅ Tabs - 标签页
- ✅ MenuBar - 菜单栏

### 工具组件
- ✅ LayoutBuilder - 布局构建器

## 🚧 计划实现

### 核心控件（P0）
- [ ] TextArea - 多行输入
- [ ] Radio - 单选框
- [ ] Slider - 滑块
- [ ] ProgressBar - 进度条
- [ ] Spinner - 加载动画

### 容器组件（P0）
- [ ] Panel - 面板
- [ ] GroupBox - 分组框
- [ ] TabWidget - 标签容器
- [ ] ScrollArea - 滚动区域

### 数据展示（P0）
- [ ] Table - 表格（完整版）
- [ ] List - 列表
- [ ] Tree - 树形控件
- [ ] Chart - 图表

### 对话框（P1）
- [ ] Dialog - 对话框
- [ ] MessageBox - 消息框
- [ ] Popup - 弹出层

### 业务组件（P1）
- [ ] DataTable - 数据表格
- [ ] FormBuilder - 表单构建器
- [ ] FileUploader - 文件上传
- [ ] RichEditor - 富文本编辑

## 💻 使用示例

### 基础使用

```typescript
import { Button, VBox, Input } from 'nhai-ui-vue'

// 创建组件
const button = new Button('提交')
button.setType('primary')

const input = new Input('用户名')

// 组合布局
const layout = new VBox()
layout.setSpacing(10)
layout.addWidget(input)
layout.addWidget(button)

// 渲染
document.body.appendChild(layout.render())
```

### 复杂布局

```typescript
import { VBox, HBox, Button, Card } from 'nhai-ui-vue'

const page = new VBox()
page.setPadding(20)

// 顶部工具栏
const toolbar = new HBox()
toolbar.setSpacing(10)

toolbar.addWidget(new Button('新增'))
toolbar.addWidget(new Button('编辑'))
toolbar.addWidget(new Button('删除'))

// 内容卡片
const card = new Card('标题', '内容')

// 组合
page.addWidget(toolbar)
page.addWidget(card)

document.body.appendChild(page.render())
```

### 业务组件（规划中）

```typescript
import { DataTable } from 'nhai-ui-vue'

// 使用业务组件
const table = new DataTable({
  columns: [
    { field: 'name', label: '姓名' },
    { field: 'email', label: '邮箱' }
  ],
  pagination: true
})

table.loadData([
  { name: '张三', email: 'zhang@example.com' },
  { name: '李四', email: 'li@example.com' }
])

document.body.appendChild(table.render())
```

## 📈 技术栈

- **框架**：Vue 3
- **UI 库**：Element Plus
- **语言**：TypeScript
- **构建工具**：Vite
- **样式**：CSS / SCSS

## 🎯 核心优势

1. **成熟底层** - 基于 Vue 3 + Element Plus
2. **对象化设计** - 类似 Qt，易于理解
3. **可组合性** - 组件自由组合
4. **命令式 API** - 符合开发习惯
5. **类型安全** - 完整 TypeScript 支持
6. **业务导向** - 直接支持业务场景

## 📚 文档结构

- `ENTERPRISE-ARCHITECTURE.md` - 企业级架构设计
- `IMPLEMENTATION-ROADMAP.md` - 实现路线图
- `COMMAND-API-GUIDE.md` - 命令式 API 指南
- `LAYOUT-SYSTEM-GUIDE.md` - 布局系统指南
- `UIHELPERS-USAGE.md` - 工具函数使用

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发
npm run dev

# 构建
npm run build
```

## 📝 许可证

MIT

