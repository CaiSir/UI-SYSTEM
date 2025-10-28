# 组件样式管理指南

## 🎯 设计理念

组件**内部默认管理样式**，同时提供自定义样式的接口，**外部不需要显式调用**样式方法。

## ✅ 默认样式管理

所有组件在创建时都有默认样式，无需手动设置：

```typescript
import { VueLayoutBuilderCommand } from 'nhai-ui-vue'

// 创建布局，自动应用默认样式
const layout = new VueLayoutBuilderCommand('vbox')
// 默认样式：
// - display: flex
// - flexDirection: column
// - boxSizing: border-box
// - gap: 8px
// - padding: 0

const element = layout.render()  // 自动应用所有样式
```

## 🎨 自定义样式（可选）

如果默认样式不满足需求，可以通过 `setStyle()` 方法自定义：

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 自定义样式（会覆盖默认样式）
layout.setStyle({
  marginTop: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
})

// 设置自定义类名
layout.setClassName('my-custom-layout')

const element = layout.render()
```

## 📋 各组件默认样式

### LayoutBuilder - 布局构建器

#### VBox（垂直布局）
```typescript
const vbox = new VueLayoutBuilderCommand('vbox')
// 默认样式：
// - display: flex
// - flexDirection: column
// - gap: 8px
// - padding: 0
// - boxSizing: border-box
```

#### HBox（水平布局）
```typescript
const hbox = new VueLayoutBuilderCommand('hbox')
// 默认样式：
// - display: flex
// - flexDirection: row
// - gap: 8px
// - padding: 0
// - boxSizing: border-box
```

#### Grid（网格布局）
```typescript
const grid = new VueLayoutBuilderCommand('grid')
// 默认样式：
// - display: grid
// - gridTemplateColumns: repeat(auto-fit, minmax(200px, 1fr))
// - gap: 8px
// - padding: 0
// - boxSizing: border-box
```

#### Container（容器布局）
```typescript
const container = new VueLayoutBuilderCommand('container')
// 默认样式：
// - display: flex
// - flexDirection: column
// - maxWidth: 1200px
// - marginLeft: auto
// - marginRight: auto
// - gap: 8px
// - padding: 0
// - boxSizing: border-box
```

### UIHelpers - 通用元素

#### createElement
```typescript
import { createElement } from 'nhai-ui-vue'

// 默认样式：boxSizing: border-box
const div = createElement('div', '内容', {
  style: {
    // 自定义样式会覆盖默认样式
    padding: '20px',
    backgroundColor: '#f5f5f5'
  }
})
```

## 💻 使用示例

### 示例1：创建工具栏（使用默认样式）

```typescript
const toolbar = new VueLayoutBuilderCommand('hbox')
toolbar.setDirection('row')
toolbar.setGap('12px')
toolbar.setPadding('12px')
toolbar.setBackgroundColor('#f5f5f5')

// 不需要手动设置 display、flexDirection 等，已经默认管理
const element = toolbar.render()
```

### 示例2：自定义样式覆盖默认值

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 如果需要在默认样式基础上添加更多样式
layout.setStyle({
  marginTop: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
})

// 这些自定义样式会添加到默认样式上
const element = layout.render()
```

### 示例3：完全自定义样式

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 完全覆盖默认样式
layout.setStyle({
  display: 'block',  // 覆盖默认的 flex
  padding: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
})

const element = layout.render()
```

## 🎨 样式优先级

1. **默认样式** - 组件自动管理
2. **配置方法** - `setSpacing()`, `setPadding()`, `setGap()` 等
3. **自定义样式** - `setStyle()` （可以覆盖上面两种）

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 1. 默认样式
// - display: flex
// - flexDirection: column

layout.setSpacing(2)  // 2. 配置方法（设置 gap: 16px）

layout.setStyle({
  display: 'block'  // 3. 自定义样式（覆盖默认的 flex）
})
```

## 🚫 不需要做的

以下代码**不需要**，因为组件内部已经管理样式：

```typescript
// ❌ 不需要手动设置这些
const container = document.createElement('div')
container.style.display = 'flex'
container.style.flexDirection = 'column'
container.style.boxSizing = 'border-box'
container.style.gap = '8px'

// ✅ 只需要这样
const layout = new VueLayoutBuilderCommand('vbox')
const element = layout.render()
```

## 📝 样式配置方法

所有组件都提供这些方法：

| 方法 | 说明 | 示例 |
|------|------|------|
| `setSpacing(size)` | 设置间距（转换为 gap） | `layout.setSpacing(2)` → gap: 16px |
| `setPadding(padding)` | 设置内边距 | `layout.setPadding('20px')` |
| `setGap(gap)` | 设置间距 | `layout.setGap('12px')` |
| `setWidth(width)` | 设置宽度 | `layout.setWidth('100%')` |
| `setHeight(height)` | 设置高度 | `layout.setHeight('500px')` |
| `setBackgroundColor(color)` | 设置背景色 | `layout.setBackgroundColor('#f5f5f5')` |
| `setStyle(style)` | 自定义样式 | `layout.setStyle({ margin: '10px' })` |
| `setClassName(className)` | 设置类名 | `layout.setClassName('my-class')` |

## ✅ 最佳实践

1. **优先使用默认样式** - 大多数情况下默认样式就够用
2. **按需自定义** - 只在需要时才调用 `setStyle()`
3. **使用配置方法** - `setSpacing()`, `setPadding()` 等比 `setStyle()` 更语义化
4. **组合使用** - 可以同时使用配置方法和自定义样式

```typescript
const layout = new VueLayoutBuilderCommand('vbox')

// 使用配置方法
layout.setSpacing(3)  // 语义化，推荐
layout.setPadding('24px')

// 只在需要时使用自定义样式
layout.setStyle({
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'  // 特殊效果
})

const element = layout.render()
```

