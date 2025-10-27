# UIHelpers 使用指南

## 🎯 设计理念

`UIHelpers` 封装了常用的 DOM 操作，让调用者**不需要关心 `document`** 和**HTML 标签**这些底层细节。

## ❌ 以前的写法

```typescript
// 需要手动操作 DOM
const separator = document.createElement('div')
separator.style.width = '1px'
separator.style.background = '#ddd'
separator.style.margin = '0 8px'

const layoutContainer = document.createElement('div')
layoutContainer.style.marginTop = '20px'
layoutContainer.style.padding = '20px'
layoutContainer.style.backgroundColor = '#f8f9fa'

const br = document.createElement('br')
```

## ✅ 现在的写法

```typescript
import { createSeparator, createElement, createBlankLine } from 'nhai-ui-vue'

// 一行代码搞定
const separator = createSeparator('vertical')

// 一行代码搞定样式
const layoutContainer = createElement('div', undefined, {
  style: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  }
})

// 一行代码搞定换行
const br = createBlankLine()
```

## 📚 API 列表

### 文本元素

```typescript
import { createText, createStyledText } from 'nhai-ui-vue'

// 创建纯文本
const text = createText('Hello World')

// 创建带样式的文本
const styledText = createStyledText('重要通知', {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '16px'
})
```

### 分隔符

```typescript
import { createSeparator } from 'nhai-ui-vue'

// 垂直分隔符
const verticalSep = createSeparator('vertical')  // 默认

// 水平分隔符
const horizontalSep = createSeparator('horizontal')
```

### 标题

```typescript
import { createHeading } from 'nhai-ui-vue'

// 创建 h1 到 h6
const h1 = createHeading('大标题', 1)
const h3 = createHeading('小标题', 3)
```

### 段落

```typescript
import { createParagraph } from 'nhai-ui-vue'

const paragraph = createParagraph('这是一段文字')
```

### 换行

```typescript
import { createBlankLine } from 'nhai-ui-vue'

const br = createBlankLine()
```

### 占位符

```typescript
import { createSpacer } from 'nhai-ui-vue'

// 创建空白占位符
const spacer = createSpacer('20px')
```

### 通用元素

```typescript
import { createElement } from 'nhai-ui-vue'

// 创建带内容的元素
const div = createElement('div', '内容', {
  className: 'my-class',
  id: 'my-id',
  style: {
    padding: '10px',
    backgroundColor: '#f0f0f0'
  }
})

// 创建带属性的元素
const link = createElement('a', '链接', {
  href: 'https://example.com',
  target: '_blank'
})
```

## 🎨 实际应用

### 创建工具栏

```typescript
import { 
  VueLayoutBuilderCommand, 
  VueButtonCommand,
  createSeparator,
  createBlankLine
} from 'nhai-ui-vue'

const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setDirection('row')
toolbar.setGap('12px')

const saveBtn = new VueButtonCommand('保存')
toolbar.addWidget('save', saveBtn)

// 使用 UIHelpers 创建分隔符
const separator = createSeparator('vertical')
toolbar.addChild('sep', separator)

const cancelBtn = new VueButtonCommand('取消')
toolbar.addWidget('cancel', cancelBtn)

const element = toolbar.render()
```

### 创建布局容器

```typescript
import { createElement } from 'nhai-ui-vue'

// 一行代码创建带样式的容器
const container = createElement('div', undefined, {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
})
```

### 创建表单布局

```typescript
import {
  VueLayoutBuilderCommand,
  VueButtonCommand,
  VueInputCommand,
  createHeading,
  createParagraph
} from 'nhai-ui-vue'

const form = new VueLayoutBuilderCommand('vbox')
form.setSpacing(3)

// 使用 UIHelpers 创建标题
const title = createHeading('用户信息', 2)
form.addChild('title', title)

// 添加输入框
const nameInput = new VueInputCommand('姓名')
form.addWidget('name', nameInput)

// 添加提交按钮
const submitBtn = new VueButtonCommand('提交')
submitBtn.setType('primary')
form.addWidget('submit', submitBtn)

const element = form.render()
```

### 创建状态栏

```typescript
import { createElement, createText } from 'nhai-ui-vue'

// 使用 createElement 创建状态栏容器
const statusBar = createElement('div', undefined, {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#e0e0e0',
    fontSize: '14px'
  }
})

// 添加状态文本
const status = createText('就绪')
statusBar.appendChild(status)

document.body.appendChild(statusBar)
```

## 📊 对比表

| 需求 | 原生写法 | UIHelpers 写法 |
|------|---------|---------------|
| 分隔符 | `const div = document.createElement('div'); div.style.width = '1px'...` | `createSeparator()` |
| 换行 | `document.createElement('br')` | `createBlankLine()` |
| 标题 | `const h = document.createElement('h3'); h.textContent = 'Title'` | `createHeading('Title', 3)` |
| 文本 | `const div = document.createElement('div'); div.textContent = 'text'` | `createText('text')` |
| 容器 | `const div = document.createElement('div'); div.style.padding = '10px'...` | `createElement('div', undefined, { style: {...} })` |

## ✅ 优势

1. **简洁** - 一行代码替代多行 DOM 操作
2. **语义化** - `createSeparator()` 比手动设置样式更清晰
3. **类型安全** - TypeScript 支持，有智能提示
4. **解耦** - 不依赖 `document` 和 HTML 标签
5. **统一** - 所有基础元素都使用一致的 API

## 🚀 快速开始

```typescript
import { 
  createSeparator, 
  createBlankLine, 
  createText,
  createElement 
} from 'nhai-ui-vue'

// 简单使用
const separator = createSeparator()
const br = createBlankLine()
const text = createText('Hello')
const container = createElement('div', 'Content', { 
  style: { padding: '10px' } 
})
```

