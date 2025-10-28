# 自定义布局指南

## 🎯 核心功能

`VueLayoutBuilderCommand` 允许你通过命令式 API 动态组合已有组件创建自定义布局。

## 💻 基本使用

### 示例1: 创建简单的垂直布局

```typescript
import { 
  VueLayoutBuilderCommand,
  VueButtonCommand,
  VueInputCommand,
  VueSelectCommand
} from 'nhai-ui-vue'

// 创建布局
const layout = new VueLayoutBuilderCommand('vbox')
layout.setSpacing(2)
layout.setPadding('20px')
layout.setBackgroundColor('#ffffff')

// 创建并添加组件
const button1 = new VueButtonCommand('按钮1')
button1.setType('primary')
layout.addComponentInstance('btn1', button1)

const button2 = new VueButtonCommand('按钮2')
button2.setType('success')
layout.addComponentInstance('btn2', button2)

const input = new VueInputCommand('输入框')
layout.addComponentInstance('input', input)

// 渲染整个布局
const layoutElement = layout.render()
document.getElementById('app')?.appendChild(layoutElement)
```

### 示例2: 创建水平的工具栏布局

```typescript
const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setDirection('row')
toolbar.setGap('12px')
toolbar.setPadding('12px')
toolbar.setBackgroundColor('#f5f5f5')

// 添加按钮组
const saveBtn = new VueButtonCommand('保存')
saveBtn.setType('primary')
toolbar.addComponentInstance('save', saveBtn)

const cancelBtn = new VueButtonCommand('取消')
toolbar.addComponentInstance('cancel', cancelBtn)

const deleteBtn = new VueButtonCommand('删除')
deleteBtn.setType('danger')
toolbar.addComponentInstance('delete', deleteBtn)
```

### 示例3: 动态添加/移除组件

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 添加组件
const btn1 = new VueButtonCommand('按钮1')
layout.addComponentInstance('btn1', btn1)

// 稍后添加更多组件
const btn2 = new VueButtonCommand('按钮2')
layout.addComponentInstance('btn2', btn2)

// 移除组件
layout.removeComponent('btn1')

// 更新组件属性
const btn3 = new VueButtonCommand('按钮3')
btn3.setType('primary')
layout.addComponentInstance('btn3', btn3)

// 查找组件
const item = layout.findItem('btn3')

// 清空所有组件
layout.clear()
```

## 🔧 API 详解

### 布局配置方法

```typescript
// 设置布局类型
layout.setLayoutType('vbox')  // 'vbox' | 'hbox' | 'grid' | 'container'
layout.setLayoutType('hbox')
layout.setLayoutType('grid')

// 设置方向
layout.setDirection('row')    // 'row' | 'column'
layout.setDirection('column')

// 设置间距（会转换为像素）
layout.setSpacing(2)  // 2 * 8px = 16px

// 设置内边距
layout.setPadding('20px')
layout.setPadding('20px 40px')

// 设置网格间距
layout.setGap('16px')

// 设置尺寸
layout.setWidth('100%')
layout.setHeight('500px')

// 设置背景色
layout.setBackgroundColor('#f8f9fa')
```

### 组件管理方法

```typescript
// 方式1: 添加组件实例（推荐）
const btn = new VueButtonCommand('提交')
btn.setType('primary')
layout.addComponentInstance('submit', btn)

// 方式2: 添加已渲染的元素
const element = btn.render()
layout.addElement('submit', element)

// 方式3: 添加组件和属性（高级）
layout.addComponent('btn1', btn.render(), btn, { type: 'primary' })

// 移除组件
layout.removeComponent('submit')

// 更新组件属性
layout.updateItem('submit', { type: 'success' })

// 查找组件
const item = layout.findItem('submit')

// 获取所有组件
const allItems = layout.getItems()

// 清空所有组件
layout.clear()
```

## 🎨 实际应用场景

### 场景1: 动态表单

```typescript
const formLayout = new VueLayoutBuilderCommand('vbox')
formLayout.setSpacing(3)
formLayout.setPadding('24px')

// 表单字段
const nameInput = new VueInputCommand('姓名')
nameInput.setPlaceholder('请输入姓名')
formLayout.addComponentInstance('name', nameInput)

const emailInput = new VueInputCommand('邮箱')
emailInput.setPlaceholder('请输入邮箱')
emailInput.setType('text')
formLayout.addComponentInstance('email', emailInput)

const passwordInput = new VueInputCommand('密码')
passwordInput.setType('password')
passwordInput.setShowPassword(true)
formLayout.addComponentInstance('password', passwordInput)

// 提交按钮
const submitBtn = new VueButtonCommand('提交')
submitBtn.setType('primary')
formLayout.addComponentInstance('submit', submitBtn)

// 渲染表单
const form = formLayout.render()
document.getElementById('form')?.appendChild(form)
```

### 场景2: 复杂的仪表板布局

```typescript
// 创建外层垂直布局
const dashboard = new VueLayoutBuilderCommand('vbox')
dashboard.setWidth('100%')
dashboard.setHeight('100vh')

// 顶部菜单栏
const menuBar = new VueMenuBarCommand([
  { id: '1', label: '首页' },
  { id: '2', label: '数据' },
  { id: '3', label: '设置' }
])
menuBar.setMode('horizontal')
dashboard.addComponentInstance('menu', menuBar)

// 中间水平布局
const contentLayout = new VueLayoutBuilderCommand('hbox')
contentLayout.setDirection('row')
contentLayout.setSpacing(1)

// 左侧面板
const leftPanel = new VueCardCommand('左侧面板', '这里是内容')
contentLayout.addComponentInstance('left', leftPanel)

// 右侧面板
const rightPanel = new VueCardCommand('右侧面板', '这里是内容')
contentLayout.addComponentInstance('right', rightPanel)

dashboard.addComponentInstance('content', contentLayout)

// 渲染整个仪表板
const app = dashboard.render()
document.body.appendChild(app)
```

### 场景3: 响应式卡片网格

```typescript
const cardGrid = new VueLayoutBuilderCommand('grid')
cardGrid.setSpacing(3)
cardGrid.setGap('16px')

// 添加多个卡片
for (let i = 1; i <= 6; i++) {
  const card = new VueCardCommand(`卡片 ${i}`, `这是卡片 ${i} 的内容`)
  cardGrid.addComponentInstance(`card${i}`, card)
}

const grid = cardGrid.render()
document.getElementById('cards')?.appendChild(grid)
```

## 📋 完整示例：创建一个完整的应用布局

```typescript
import {
  VueLayoutBuilderCommand,
  VueMenuBarCommand,
  VueButtonCommand,
  VueCardCommand
} from 'nhai-ui-vue'

// 创建应用主布局
const appLayout = new VueLayoutBuilderCommand('vbox')
appLayout.setWidth('100vw')
appLayout.setHeight('100vh')

// 1. 顶部菜单
const menuBar = new VueMenuBarCommand([
  { id: '1', label: '首页' },
  { id: '2', label: '产品' },
  { id: '3', label: '关于' }
])
appLayout.addComponentInstance('menu', menuBar)

// 2. 中间内容区域（水平布局）
const contentArea = new VueLayoutBuilderCommand('hbox')
contentArea.setDirection('row')
contentArea.setSpacing(2)

// 左侧工具栏
const leftToolbar = new VueLayoutBuilderCommand('vbox')
leftToolbar.setWidth('200px')
leftToolbar.setPadding('16px')
leftToolbar.setBackgroundColor('#f5f5f5')

const toolBtn1 = new VueButtonCommand('工具1')
leftToolbar.addComponentInstance('tool1', toolBtn1)

const toolBtn2 = new VueButtonCommand('工具2')
leftToolbar.addComponentInstance('tool2', toolBtn2)

contentArea.addComponentInstance('sidebar', leftToolbar)

// 右侧主内容区
const mainContent = new VueCardCommand('主内容', '这里放置主要内容')
contentArea.addComponentInstance('main', mainContent)

appLayout.addComponentInstance('content', contentArea)

// 3. 底部状态栏
const statusBar = new VueLayoutBuilderCommand('hbox')
statusBar.setDirection('row')
statusBar.setPadding('8px')
statusBar.setBackgroundColor('#e0e0e0')

const statusBtn = new VueButtonCommand('状态')
statusBar.addComponentInstance('status', statusBtn)

appLayout.addComponentInstance('statusbar', statusBar)

// 渲染整个应用
const app = appLayout.render()
document.body.appendChild(app)
```

## 🎯 最佳实践

1. **分层构建**: 先创建外层布局，再添加内部组件
2. **动态管理**: 使用 ID 管理组件，便于查找和更新
3. **组合使用**: 可以嵌套多个 LayoutBuilder
4. **属性管理**: 使用 `updateItem` 动态更新组件属性

## 📝 注意事项

- 每个组件调用 `render()` 后返回的是 DOM 元素
- `addComponentInstance` 会调用组件的 `render()` 方法
- 可以使用 `cloneNode(true)` 复制已渲染的元素
- 布局支持嵌套，可以创建复杂的多层级布局

