# 命令式 API 设计指南

## 🎯 核心原则

**所有命令式 API 都不需要提供 DOM 创建方法（如 createElement），由组件内部处理。**

## ✅ 正确做法

### 创建布局

```typescript
import { VueLayoutBuilderCommand, VueButtonCommand } from 'nhai-ui-vue'

// ✅ 组件内部自动处理 DOM
const layout = new VueLayoutBuilderCommand('vbox')
layout.setSpacing(2)
layout.setPadding('20px')

const btn = new VueButtonCommand('提交')
layout.addWidget('btn', btn)

// 渲染时组件内部自动创建 DOM
const element = layout.render()
```

### 添加自定义内容

```typescript
// ✅ 使用 UIHelpers 创建内容
import { createSeparator, createText } from 'nhai-ui-vue'

const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setGap('12px')

const btn1 = new VueButtonCommand('保存')
toolbar.addWidget('save', btn1)

// 使用辅助函数，不需要 createElement
const separator = createSeparator('vertical')
toolbar.addChild('sep', separator)

const btn2 = new VueButtonCommand('取消')
toolbar.addWidget('cancel', btn2)
```

## ❌ 错误做法

### 不要手动创建 DOM

```typescript
// ❌ 不要在外部创建 DOM
const div = document.createElement('div')
div.style.margin = '20px'
layout.addChild('custom', div)

// ❌ 不要暴露 createElement
const element = createElement('div', undefined, { style: {...} })
```

### 不要直接操作样式

```typescript
// ❌ 不需要手动设置样式
const container = document.createElement('div')
container.style.display = 'flex'
container.style.flexDirection = 'column'
container.style.padding = '20px'

// ✅ 组件内部自动管理样式
const layout = new VueLayoutBuilderCommand('vbox')
layout.setPadding('20px')
```

## 📋 API 层级

### 一级 API - 组件创建

```typescript
import { 
  VueButtonCommand,
  VueLayoutBuilderCommand,
  VueInputCommand
} from 'nhai-ui-vue'

// 创建组件实例
const btn = new VueButtonCommand('提交')
const layout = new VueLayoutBuilderCommand('vbox')
```

### 二级 API - 配置和内容

```typescript
// 配置组件
btn.setType('primary')
layout.setSpacing(2)

// 添加内容
layout.addWidget('btn', btn)
```

### 三级 API - 渲染

```typescript
// 渲染为 DOM（组件内部处理 DOM 创建）
const element = layout.render()
document.body.appendChild(element)
```

## 🎨 组件内部自动管理

### 1. DOM 创建

```typescript
// 外部
const layout = new VueLayoutBuilderCommand('vbox')
layout.render()  // 内部自动创建 div

// 组件内部
render() {
  const container = document.createElement('div')  // 自动创建
  // ...
  return container
}
```

### 2. 样式管理

```typescript
// 外部
const layout = new VueLayoutBuilderCommand('vbox')
layout.setPadding('20px')  // 只需要配置

// 组件内部自动应用样式
render() {
  container.style.padding = this.padding  // 自动应用
  container.style.boxSizing = 'border-box'  // 默认样式
  // ...
}
```

### 3. 布局结构

```typescript
// 外部
const layout = new VueLayoutBuilderCommand('vbox')
layout.addWidget('btn', button)

// 组件内部自动处理布局
render() {
  this.items.forEach(item => {
    const child = item.element.cloneNode(true)
    container.appendChild(child)  // 自动添加到布局
  })
}
```

## 💻 完整示例

### 创建工具栏

```typescript
import { 
  VueLayoutBuilderCommand, 
  VueButtonCommand,
  createSeparator
} from 'nhai-ui-vue'

// 创建布局（内部处理 DOM）
const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setGap('12px')
toolbar.setPadding('12px')
toolbar.setBackgroundColor('#f5f5f5')

// 添加按钮（组件内部处理）
const saveBtn = new VueButtonCommand('保存')
saveBtn.setType('primary')
toolbar.addWidget('save', saveBtn)

// 添加分隔符（辅助函数，不需要 createElement）
const separator = createSeparator('vertical')
toolbar.addChild('sep', separator)

// 渲染（所有 DOM 创建都在内部完成）
const element = toolbar.render()
document.body.appendChild(element)
```

### 创建表单

```typescript
import { 
  VueLayoutBuilderCommand,
  VueInputCommand,
  VueButtonCommand
} from 'nhai-ui-vue'

const form = new VueLayoutBuilderCommand('vbox')
form.setSpacing(3)
form.setPadding('24px')

// 输入框（组件内部处理）
const nameInput = new VueInputCommand('姓名')
form.addWidget('name', nameInput)

const emailInput = new VueInputCommand('邮箱')
form.addWidget('email', emailInput)

// 按钮（组件内部处理）
const submitBtn = new VueButtonCommand('提交')
submitBtn.setType('primary')
form.addWidget('submit', submitBtn)

// 渲染
const element = form.render()
document.getElementById('form')?.appendChild(element)
```

### 创建复杂布局

```typescript
import { 
  VueLayoutBuilderCommand,
  VueMenuBarCommand,
  VueButtonCommand,
  VueCardCommand
} from 'nhai-ui-vue'

// 外层布局（内部自动处理 DOM 和样式）
const app = new VueLayoutBuilderCommand('vbox')
app.setWidth('100vw')
app.setHeight('100vh')

// 菜单栏（组件内部处理）
const menu = new VueMenuBarCommand([...])
menu.setMode('horizontal')
app.addWidget('menu', menu)

// 中间布局（组件内部处理）
const content = new VueLayoutBuilderCommand('hbox')
content.setDirection('row')
content.setSpacing(1)

const leftPanel = new VueCardCommand('左侧')
content.addWidget('left', leftPanel)

const rightPanel = new VueCardCommand('右侧')
content.addWidget('right', rightPanel)

app.addWidget('content', content)

// 渲染（所有 DOM 在内部创建）
const element = app.render()
document.body.appendChild(element)
```

## 🚫 禁止直接使用

以下方法不应该对外暴露：

- ❌ `document.createElement()`
- ❌ `createElement(tag, content, props)` - 不应该直接导出
- ❌ DOM 样式操作（由组件内部处理）

## ✅ 允许使用

- ✅ 组件创建（`new VueXXXCommand()`）
- ✅ 组件配置（`setXxx()` 方法）
- ✅ 组件渲染（`render()` 方法）
- ✅ UIHelpers 辅助函数（`createSeparator`, `createText` 等）

## 📝 组件开发规范

### 组件内部应该

1. **自动创建 DOM** - 不需要外部传入
2. **自动应用样式** - 默认样式 + 配置样式
3. **自动处理布局** - addWidget 时自动添加子元素
4. **封装细节** - 不暴露 DOM 操作

### 对外提供

1. **简洁的命令方法** - `setXxx()`, `addXxx()`
2. **统一的渲染接口** - `render()` 返回 HTMLElement
3. **类型安全** - 完整的 TypeScript 类型定义

## 🎯 对比

### 以前（暴露 DOM 操作）

```typescript
// 需要手动创建 DOM
const div = document.createElement('div')
div.style.padding = '20px'
div.style.backgroundColor = '#f5f5f5'
layout.addChild('container', div)
```

### 现在（封装 DOM 操作）

```typescript
// 组件内部自动处理
const layout = new VueLayoutBuilderCommand('vbox')
layout.setPadding('20px')
layout.setBackgroundColor('#f5f5f5')
layout.addWidget('btn', button)
const element = layout.render()  // 自动创建所有 DOM
```

## ✅ 优势

1. **更简洁** - 不需要手动创建 DOM
2. **更安全** - 避免 DOM 操作错误
3. **更统一** - 所有组件使用相同的模式
4. **更易维护** - DOM 创建集中在组件内部

