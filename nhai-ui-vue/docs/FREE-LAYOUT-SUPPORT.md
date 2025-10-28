# 自由布局支持说明

## 📊 当前布局能力

### ✅ 已支持的布局方式

#### 1. **Flex 布局**（标准布局）
```typescript
// 垂直布局
const vbox = new VBox()
vbox.setSpacing(10)
vbox.addChild(btn1)
vbox.addChild(btn2)

// 水平布局
const hbox = new HBox()
hbox.setDirection('row')
hbox.setGap('12px')
```

#### 2. **Grid 布局**（网格布局）
```typescript
const grid = new Grid()
grid.setContainer(true)
grid.setSpacing(3)
grid.addWidget('card1', card1)
grid.addWidget('card2', card2)
```

#### 3. **分割面板**（可调整）
```typescript
const split = new SplitPanel()
split.setOrientation('horizontal')
split.setSplitPosition(30)  // 30%
```

#### 4. **组合布局**（嵌套）
```typescript
const outer = new VBox()
const inner = new HBox()
inner.addChild(btn1)
inner.addChild(btn2)
outer.addChild(inner)
```

### ✅ 动态布局构建器
```typescript
const layout = new LayoutBuilder()
layout.setLayoutType('vbox')
layout.addWidget('btn1', button1)
layout.addWidget('btn2', button2)
```

## ✅ 新增：绝对定位布局

### 1. **绝对定位布局**（现已支持！）
```typescript
import { AbsolutePanelCommand, ButtonCommand } from 'nhai-ui-vue'

const panel = new AbsolutePanelCommand('100%', '500px')
panel.setBackgroundColor('#f5f5f5')

const btn = new ButtonCommand('按钮')
btn.setType('primary')
panel.addWidgetAt('btn1', btn, { x: 100, y: 200 })

// 动态更新位置
panel.setPosition('btn1', 150, 250)

// 设置大小
panel.setSize('btn1', 100, 40)

// 获取位置和大小
const pos = panel.getPosition('btn1')
const size = panel.getSize('btn1')
```

### 2. **拖拽布局**（目前不支持）
```typescript
// ❌ 暂不支持自由拖拽
const draggable = new DraggablePanel()
draggable.setPosition({ x: 100, y: 100 })
```

### 3. **自由画布**（目前不支持）
```typescript
// ❌ 暂不支持自由画布
const canvas = new FreeCanvas()
const widget = new Widget({ x: 100, y: 200 })
canvas.addWidget(widget)
```

## 🎯 当前的自由度

### ✅ 支持：通过布局组件组合实现
```typescript
// 复杂的嵌套布局
const app = new VBox()

// 顶部工具栏
const toolbar = new HBox()
toolbar.addChild(new Button('保存'))
toolbar.addChild(new Button('取消'))
app.addWidget('toolbar', toolbar)

// 中间内容区 - 水平分割
const content = new SplitPanel()
content.setOrientation('horizontal')
content.setSplitPosition(20)
app.addWidget('content', content)

// 渲染
document.body.appendChild(app.render())
```

### ✅ 支持：动态添加/移除组件
```typescript
const layout = new LayoutBuilder()
layout.addWidget('btn1', btn1)

// 动态添加
const btn2 = new Button('新按钮')
layout.addWidget('btn2', btn2)

// 动态移除
layout.removeChild('btn1')
```

### ✅ 支持：自定义样式
```typescript
const layout = new VBox()
layout.setStyle({
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  marginTop: '10px'
})
```

## 🚀 建议的扩展方向

### 1. 绝对定位布局组件
```typescript
export class AbsolutePanel extends BaseCommand {
  addWidgetAt(id: string, widget: BaseCommand, position: { x: number, y: number }): void {
    // 绝对定位
  }
}
```

### 2. 拖拽布局支持
```typescript
export class DraggablePanel extends BaseCommand {
  private draggable: boolean = true
  
  setPosition(id: string, x: number, y: number): void {
    // 设置位置
  }
  
  getPosition(id: string): { x: number, y: number } {
    // 获取位置
  }
}
```

### 3. 画布布局（自由排布）
```typescript
export class FreeCanvas extends BaseCommand {
  addWidget(widget: BaseCommand, x: number, y: number, width: number, height: number): void {
    // 自由画布布局
  }
}
```

## 💡 当前实践建议

### 方案1：使用现有布局组件组合
```typescript
// 创建复杂的应用布局
const app = new VBox()
app.setPadding('20px')

// 头部
const header = new HBox()
header.addChild(new Button('Logo'))
header.addChild(new MenuBar([...]))
app.addWidget('header', header)

// 主体 - 左侧栏 + 主内容
const body = new HBox()
const sidebar = new VBox()
sidebar.addChild(new Button('菜单1'))
sidebar.addChild(new Button('菜单2'))
body.addWidget('sidebar', sidebar)

const main = new VBox()
main.addChild(new Card('主内容'))
body.addWidget('main', main)

app.addWidget('body', body)

// 渲染
document.body.appendChild(app.render())
```

### 方案2：结合 CSS 自定义
```typescript
// 创建自定义布局容器
const customLayout = new LayoutBuilder('vbox')
customLayout.setStyle({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr 1fr',
  gridTemplateRows: 'auto 1fr auto',
  gap: '20px'
})

customLayout.addWidget('header', header)
customLayout.addWidget('sidebar', sidebar)
customLayout.addWidget('main', main)
customLayout.addWidget('footer', footer)
```

### 方案3：使用绝对定位（手动实现）
```typescript
// 手动创建绝对定位容器
const container = document.createElement('div')
container.style.position = 'relative'

const btn1 = new Button('按钮1')
const btn1El = btn1.render()
btn1El.style.position = 'absolute'
btn1El.style.left = '100px'
btn1El.style.top = '100px'
container.appendChild(btn1El)

const btn2 = new Button('按钮2')
const btn2El = btn2.render()
btn2El.style.position = 'absolute'
btn2El.style.left = '200px'
btn2El.style.top = '200px'
container.appendChild(btn2El)

document.body.appendChild(container)
```

## 📋 总结

### ✅ 支持的布局
- Flex 布局（VBox, HBox）
- Grid 布局
- 分割面板
- 绝对定位布局（AbsolutePanel）⭐ 新增
- 嵌套组合
- 动态添加/移除

### ⏳ 需要扩展的布局
- 拖拽布局（DraggablePanel - 规划中）
- 自由画布（FreeCanvas - 规划中）

### 🎯 当前自由度
**中等** - 可以通过组合现有布局组件实现大部分需求，
但对于完全自由的拖拽、绝对定位等高级需求，需要添加新的布局组件。

## 🚀 下一步

如果需要更高的自由度，可以添加：
1. `AbsolutePanel` - 绝对定位布局
2. `DraggablePanel` - 可拖拽面板
3. `FreeCanvas` - 自由画布
4. `StackLayout` - 堆叠布局

这些都可以基于现有的 `BaseCommand` 和组合能力来实现。

