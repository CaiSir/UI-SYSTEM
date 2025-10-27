# NHAI UI Vue - 布局系统

## 🎯 设计理念

布局系统完全解耦，命令 API 不需要关心 Vue 的具体实现，遵循与 `nhai-framework` 相同的设计模式。

## 📦 核心 API

### LayoutBuilder - 布局构建器

```typescript
const layout = new VueLayoutBuilderCommand('vbox')
layout.setSpacing(2)
layout.setPadding('20px')
layout.addWidget('btn1', button1)
layout.addChild('custom', customElement)
const element = layout.render()
```

### 主要方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `addWidget(id, widget)` | 添加组件（自动调用 render） | `layout.addWidget('btn', button)` |
| `addChild(id, element)` | 添加 DOM 元素 | `layout.addChild('div', el)` |
| `removeChild(id)` | 移除子项 | `layout.removeChild('btn')` |
| `findItem(id)` | 查找项 | `const item = layout.findItem('btn')` |
| `getItems()` | 获取所有项 | `const items = layout.getItems()` |
| `clear()` | 清空所有项 | `layout.clear()` |
| `render()` | 渲染为 DOM | `const el = layout.render()` |

## 💻 使用示例

### 基础布局

```typescript
import { 
  VueLayoutBuilderCommand,
  VueButtonCommand,
  VueInputCommand
} from 'nhai-ui-vue'

// 创建垂直布局
const vbox = new VueLayoutBuilderCommand('vbox')
vbox.setSpacing(2)
vbox.setPadding('20px')

// 添加按钮
const btn = new VueButtonCommand('提交')
btn.setType('primary')
vbox.addWidget('submit', btn)

// 添加输入框
const input = new VueInputCommand('用户名')
vbox.addWidget('username', input)

// 渲染
const element = vbox.render()
document.body.appendChild(element)
```

### 水平工具栏

```typescript
const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setDirection('row')
toolbar.setGap('12px')

const btn1 = new VueButtonCommand('保存')
toolbar.addWidget('save', btn1)

const btn2 = new VueButtonCommand('取消')
toolbar.addWidget('cancel', btn2)

const element = toolbar.render()
```

### 嵌套布局

```typescript
// 外层
const outer = new VueLayoutBuilderCommand('vbox')
outer.setWidth('100%')
outer.setHeight('100vh')

// 内层水平布局
const inner = new VueLayoutBuilderCommand('hbox')
inner.setDirection('row')

const btn1 = new VueButtonCommand('按钮1')
inner.addWidget('btn1', btn1)

const btn2 = new VueButtonCommand('按钮2')
inner.addWidget('btn2', btn2)

// 添加到外层
outer.addWidget('inner', inner)

const element = outer.render()
```

### 动态管理

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 添加组件
const btn1 = new VueButtonCommand('按钮1')
layout.addWidget('btn1', btn1)

// 查找并更新
const item = layout.findItem('btn1')
if (item) {
  item.element.style.display = 'none'
}

// 移除组件
layout.removeChild('btn1')

// 清空所有
layout.clear()
```

## 🔧 布局配置

### 设置布局类型

```typescript
layout.setLayoutType('vbox')  // 垂直
layout.setLayoutType('hbox')  // 水平
layout.setLayoutType('grid')  // 网格
layout.setLayoutType('container')  // 容器
```

### 设置方向

```typescript
layout.setDirection('row')     // 水平
layout.setDirection('column')  // 垂直
```

### 设置间距

```typescript
layout.setSpacing(2)  // 16px (2 * 8px)
layout.setGap('12px') // 直接设置间距
layout.setPadding('20px')
```

### 设置尺寸

```typescript
layout.setWidth('100%')
layout.setHeight('500px')
layout.setBackgroundColor('#f5f5f5')
```

## 🎨 实际应用

### 创建工具栏

```typescript
const createToolbar = () => {
  const toolbar = new VueLayoutBuilderCommand('hbox')
  toolbar.setGap('12px')
  toolbar.setPadding('12px')
  toolbar.setBackgroundColor('#f5f5f5')
  
  const saveBtn = new VueButtonCommand('保存')
  saveBtn.setType('primary')
  toolbar.addWidget('save', saveBtn)
  
  const cancelBtn = new VueButtonCommand('取消')
  toolbar.addWidget('cancel', cancelBtn)
  
  return toolbar.render()
}
```

### 创建表单布局

```typescript
const createForm = () => {
  const form = new VueLayoutBuilderCommand('vbox')
  form.setSpacing(3)
  form.setPadding('24px')
  
  const nameInput = new VueInputCommand('姓名')
  form.addWidget('name', nameInput)
  
  const emailInput = new VueInputCommand('邮箱')
  form.addWidget('email', emailInput)
  
  const submitBtn = new VueButtonCommand('提交')
  submitBtn.setType('primary')
  form.addWidget('submit', submitBtn)
  
  return form.render()
}
```

### 创建应用布局

```typescript
const createAppLayout = () => {
  // 外层垂直布局
  const app = new VueLayoutBuilderCommand('vbox')
  app.setWidth('100vw')
  app.setHeight('100vh')
  
  // 顶部菜单
  const menu = new VueMenuBarCommand([...])
  app.addWidget('menu', menu)
  
  // 中间内容区
  const content = new VueLayoutBuilderCommand('hbox')
  const leftPanel = new VueCardCommand('左侧', '内容')
  const rightPanel = new VueCardCommand('右侧', '内容')
  content.addWidget('left', leftPanel)
  content.addWidget('right', rightPanel)
  app.addWidget('content', content)
  
  return app.render()
}
```

## 📝 与 nhai-framework 的对比

| 特性 | nhai-framework | nhai-ui-vue |
|------|---------------|-------------|
| 命令 API | ✅ 完全解耦 | ✅ 完全解耦 |
| 渲染方式 | NHAIWidget | Vue + Element Plus |
| 外观风格 | Material UI | Element Plus UI |
| 使用方式 | 相同 | 相同 |

## 🚀 快速开始

```typescript
import { VueLayoutBuilderCommand, VueButtonCommand } from 'nhai-ui-vue'

const layout = new VueLayoutBuilderCommand('vbox')
const btn = new VueButtonCommand('点击我')
layout.addWidget('btn', btn)

document.body.appendChild(layout.render())
```

## ✅ 设计特点

1. **完全解耦** - 命令 API 不依赖 Vue
2. **简单易用** - 与 nhai-framework API 保持一致
3. **灵活组合** - 支持任意嵌套
4. **动态管理** - 支持添加/移除/查找组件

