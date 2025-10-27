# LayoutBuilder 布局构建器

LayoutBuilder 允许你通过命令式 API 动态组合已有组件创建自定义布局。

## 🎯 使用场景

当你需要：
- 动态添加/移除组件
- 创建可组合的布局
- 灵活配置布局属性
- 通过代码控制布局结构

## 💻 使用示例

### 1. 创建垂直布局

```typescript
import { VueLayoutBuilderCommand, VueButtonCommand, VueInputCommand } from 'nhai-ui-vue'

// 创建布局构建器
const layout = new VueLayoutBuilderCommand('vbox')
layout.setSpacing(2)
layout.setPadding('20px')
layout.setBackgroundColor('#f8f9fa')

// 添加组件
const btn1 = new VueButtonCommand('按钮1')
btn1.setType('primary')
layout.addComponent('btn1', btn1.render(), { text: '按钮1' })

const btn2 = new VueButtonCommand('按钮2')
btn2.setType('success')
layout.addComponent('btn2', btn2.render(), { text: '按钮2' })

const input = new VueInputCommand('输入框')
layout.addComponent('input1', input.render())

// 渲染
const element = layout.render()
document.body.appendChild(element)
```

### 2. 创建水平布局

```typescript
const layout = new VueLayoutBuilderCommand('hbox')
layout.setDirection('row')
layout.setGap('16px')
layout.setBackgroundColor('#fff')

// 添加多个组件
for (let i = 1; i <= 4; i++) {
  const btn = new VueButtonCommand(`按钮${i}`)
  layout.addComponent(`btn${i}`, btn.render())
}

const element = layout.render()
```

### 3. 动态管理组件

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 添加组件
layout.addComponent('btn1', button1.render())
layout.addComponent('btn2', button2.render())

// 更新组件
layout.updateItem('btn1', { text: '新文本' })

// 移除组件
layout.removeComponent('btn1')

// 查找组件
const item = layout.findItem('btn2')

// 清空所有组件
layout.clear()
```

### 4. 创建复杂的嵌套布局

```typescript
// 外层容器
const outerLayout = new VueLayoutBuilderCommand('vbox')
outerLayout.setWidth('100%')
outerLayout.setHeight('100vh')

// 顶部菜单
const menuBar = new VueMenuBarCommand([
  { id: '1', label: '首页' },
  { id: '2', label: '产品' }
])
outerLayout.addComponent('menu', menuBar.render())

// 中间分割面板
const splitPanel = new VueSplitPanelCommand('左侧', '右侧', 'horizontal')
splitPanel.setSplitPosition(30)
outerLayout.addComponent('split', splitPanel.render())

// 渲染整个布局
const app = outerLayout.render()
document.body.appendChild(app)
```

## 🔧 API 方法

### 布局配置
- `setLayoutType(type)` - 设置布局类型 (vbox, hbox, grid, container)
- `setDirection(direction)` - 设置方向 (row, column)
- `setSpacing(spacing)` - 设置间距（像素倍数）
- `setPadding(padding)` - 设置内边距
- `setGap(gap)` - 设置网格间距
- `setWidth(width)` - 设置宽度
- `setHeight(height)` - 设置高度
- `setBackgroundColor(color)` - 设置背景色

### 组件管理
- `addComponent(id, component, props)` - 添加组件
- `removeComponent(id)` - 移除组件
- `getItems()` - 获取所有组件
- `findItem(id)` - 查找组件
- `updateItem(id, props)` - 更新组件属性
- `clear()` - 清空所有组件

### 渲染
- `render()` - 渲染为 DOM 元素
- `unmount()` - 卸载布局

## 📊 布局类型

| 类型 | 说明 | 方向 |
|------|------|------|
| `vbox` | 垂直布局（默认） | column |
| `hbox` | 水平布局 | row |
| `grid` | 网格布局 | auto-fit |
| `container` | 容器布局 | column |

## 🎨 实际应用场景

### 场景1: 动态表单

```typescript
const formLayout = new VueLayoutBuilderCommand('vbox')
formLayout.setSpacing(3)

const nameInput = new VueInputCommand('姓名')
formLayout.addComponent('name', nameInput.render())

const emailInput = new VueInputCommand('邮箱')
formLayout.addComponent('email', emailInput.render())

const submitBtn = new VueButtonCommand('提交')
submitBtn.setType('primary')
formLayout.addComponent('submit', submitBtn.render())
```

### 场景2: 工具栏

```typescript
const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setGap('12px')

const saveBtn = new VueButtonCommand('保存')
saveBtn.setType('primary')
toolbar.addComponent('save', saveBtn.render())

const cancelBtn = new VueButtonCommand('取消')
toolbar.addComponent('cancel', cancelBtn.render())
```

## 📝 注意事项

1. 每个组件需要通过 `render()` 方法获取 DOM 元素
2. `addComponent` 时传入已渲染的 DOM 元素
3. 可以动态添加/移除组件，但需要重新调用 `render()`
4. 布局类型设置后会自动调整方向

