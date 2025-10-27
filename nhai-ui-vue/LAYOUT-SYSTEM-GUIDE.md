# 布局系统使用指南

## 🎯 核心功能

通过 `VueLayoutBuilderCommand` 可以实现：
- ✅ 动态组合组件
- ✅ 创建自定义布局
- ✅ 水平/垂直/网格布局
- ✅ 响应式布局
- ✅ 嵌套布局

## 📦 已实现的布局组件

| 组件 | 功能 | 文件 |
|------|------|------|
| ✅ Container | 容器（限制最大宽度） | `Container/` |
| ✅ Grid | 网格布局（Flex Grid） | `Grid/` |
| ✅ SplitPanel | 可调整的分割面板 | `SplitPanel/` |
| ✅ LayoutBuilder | 动态布局构建器 | `LayoutBuilder/` |

## 💻 使用示例

### 1. 创建垂直布局（VBox）

```typescript
import { VueLayoutBuilderCommand, VueButtonCommand, VueInputCommand } from 'nhai-ui-vue'

const vbox = new VueLayoutBuilderCommand('vbox')
vbox.setSpacing(2)  // 设置间距
vbox.setPadding('20px')

// 添加按钮
const btn1 = new VueButtonCommand('按钮1')
btn1.setType('primary')
vbox.addComponentInstance('btn1', btn1)

// 添加输入框
const input = new VueInputCommand('输入框')
vbox.addComponentInstance('input', input)

const element = vbox.render()
document.body.appendChild(element)
```

### 2. 创建水平布局（HBox）

```typescript
const hbox = new VueLayoutBuilderCommand('hbox')
hbox.setDirection('row')  // 水平方向
hbox.setGap('12px')

// 添加多个按钮
for (let i = 1; i <= 5; i++) {
  const btn = new VueButtonCommand(`按钮${i}`)
  hbox.addComponentInstance(`btn${i}`, btn)
}

const element = hbox.render()
```

### 3. 创建网格布局

```typescript
const grid = new VueLayoutBuilderCommand('grid')
grid.setSpacing(3)
grid.setGap('16px')

// 添加多个卡片
for (let i = 1; i <= 6; i++) {
  const card = new VueCardCommand(`卡片${i}`, `这是卡片${i}`)
  grid.addComponentInstance(`card${i}`, card)
}

const element = grid.render()
```

### 4. 创建可调整的分割面板

```typescript
const splitPanel = new VueSplitPanelCommand('左侧内容', '右侧内容', 'horizontal')
splitPanel.setSplitPosition(30)  // 30%
splitPanel.setResizable(true)

const element = splitPanel.render()
element.style.height = '500px'  // 设置高度
document.body.appendChild(element)
```

## 🏗️ 完整应用布局示例

### 示例：创建一个完整的设计工具界面

```typescript
import {
  VueLayoutBuilderCommand,
  VueMenuBarCommand,
  VueButtonCommand,
  VueCardCommand,
  VueSplitPanelCommand
} from 'nhai-ui-vue'

// ========== 创建应用主布局（垂直布局）==========
const appLayout = new VueLayoutBuilderCommand('vbox')
appLayout.setWidth('100vw')
appLayout.setHeight('100vh')
appLayout.setBackgroundColor('#ffffff')

// ========== 1. 顶部菜单栏 ==========
const menuBar = new VueMenuBarCommand([
  { id: 'file', label: '文件', children: [
    { id: 'new', label: '新建' },
    { id: 'open', label: '打开' },
    { id: 'save', label: '保存' }
  ]},
  { id: 'edit', label: '编辑' },
  { id: 'view', label: '视图' }
])
menuBar.setMode('horizontal')
appLayout.addComponentInstance('menubar', menuBar)

// ========== 2. 工具栏（水平布局）==========
const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setDirection('row')
toolbar.setGap('8px')
toolbar.setPadding('8px')
toolbar.setBackgroundColor('#f5f5f5')

const tools = ['选择', '矩形', '圆形', '文本', '笔刷']
tools.forEach((tool, index) => {
  const btn = new VueButtonCommand(tool)
  btn.setSize('small')
  toolbar.addComponentInstance(`tool${index}`, btn)
})

appLayout.addComponentInstance('toolbar', toolbar)

// ========== 3. 主内容区（水平分割）==========
const contentSplit = new VueSplitPanelCommand('左侧', '右侧', 'horizontal')
contentSplit.setSplitPosition(15)  // 左侧15%
contentSplit.setResizable(true)
appLayout.addComponentInstance('content', contentSplit)

// ========== 4. 底部状态栏 ==========
const statusBar = new VueLayoutBuilderCommand('hbox')
statusBar.setDirection('row')
statusBar.setPadding('8px')
statusBar.setBackgroundColor('#e0e0e0')

const statusText = document.createElement('div')
statusText.textContent = '就绪'
statusText.style.padding = '4px 12px'
statusBar.addElement('status', statusText)

appLayout.addComponentInstance('statusbar', statusBar)

// ========== 渲染整个应用 ==========
const app = appLayout.render()
document.body.style.margin = '0'
document.body.appendChild(app)
```

## 🎨 布局模式

### VBox（垂直布局）

```typescript
const vbox = new VueLayoutBuilderCommand('vbox')
vbox.setDirection('column')  // 向下排列
vbox.setSpacing(2)  // 间距
```

**适用场景**：
- 表单布局
- 垂直工具栏
- 卡片列表

### HBox（水平布局）

```typescript
const hbox = new VueLayoutBuilderCommand('hbox')
hbox.setDirection('row')  // 横向排列
hbox.setGap('12px')  // 直接设置间距
```

**适用场景**：
- 水平工具栏
- 按钮组
- 导航栏

### Grid（网格布局）

```typescript
const grid = new VueLayoutBuilderCommand('grid')
grid.setSpacing(3)  // 3 * 8px = 24px
grid.setGap('16px')  // 网格间距
```

**适用场景**：
- 卡片网格
- 图片墙
- 仪表板

### Container（容器布局）

```typescript
const container = new VueContainerCommand()
container.setMaxWidth('lg')  // 限制最大宽度
container.setFixed(false)  // 自适应
```

**适用场景**：
- 内容容器
- 响应式布局
- 居中显示

## 🔧 动态管理组件

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 添加组件
layout.addComponentInstance('btn1', button1)
layout.addComponentInstance('btn2', button2)

// 查找组件
const item = layout.findItem('btn1')

// 更新组件
layout.updateItem('btn1', { text: '新文本' })

// 移除组件
layout.removeComponent('btn2')

// 获取所有组件
const items = layout.getItems()

// 清空
layout.clear()
```

## 📊 布局组合示例

### 创建复杂的嵌套布局

```typescript
// 最外层：应用容器
const app = new VueContainerCommand()
app.setMaxWidth('xl')

// 内层：垂直布局
const mainLayout = new VueLayoutBuilderCommand('vbox')
mainLayout.setSpacing(4)

// 顶部：水平工具栏
const topBar = new VueLayoutBuilderCommand('hbox')
topBar.setDirection('row')
topBar.setGap('12px')

const menuBtn = new VueButtonCommand('菜单')
topBar.addComponentInstance('menu', menuBtn)

const saveBtn = new VueButtonCommand('保存')
saveBtn.setType('primary')
topBar.addComponentInstance('save', saveBtn)

mainLayout.addComponentInstance('topbar', topBar)

// 中间：分割面板
const contentSplit = new VueSplitPanelCommand('左侧', '右侧', 'horizontal')
mainLayout.addComponentInstance('content', contentSplit)

// 将内层布局添加到外层容器
app.setContent(mainLayout.render().innerHTML)

// 渲染
document.body.appendChild(app.render())
```

## 🎯 最佳实践

1. **层次分明**: 外层使用 Container，内层使用 LayoutBuilder
2. **动态配置**: 使用 setter 方法动态调整布局属性
3. **组件复用**: 创建的组件实例可以重复使用
4. **ID 管理**: 为每个组件设置唯一 ID，便于管理

## 📝 注意事项

- LayoutBuilder 支持嵌套，但要注意性能
- 每次修改布局后需要重新调用 `render()`
- Grid 布局会自动换行
- SplitPanel 需要设置明确的高度才能正常工作
- 所有布局组件都支持命令式 API

## 🚀 快速开始

```typescript
// 最简单的使用
const layout = new VueLayoutBuilderCommand('vbox')
const btn = new VueButtonCommand('点击')
layout.addComponentInstance('btn', btn)
document.body.appendChild(layout.render())
```

