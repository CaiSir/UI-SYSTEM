# NHAITextButton 链接功能使用指南

## 概述

NHAITextButton 现在支持链接和导航功能，可以渲染为 `<a>` 标签或 `<button>` 标签，支持外部链接、内部路由导航等多种使用场景。

## 新增功能

### 1. 链接属性
- `href`: 链接地址
- `target`: 链接打开方式（`_blank`, `_self`, `_parent`, `_top`）
- `router`: 自定义路由处理函数（用于单页应用）

### 2. 新增方法

#### 基础方法
```typescript
// 设置链接地址
setHref(href: string): void

// 设置链接打开方式
setTarget(target: '_blank' | '_self' | '_parent' | '_top'): void

// 设置路由处理函数
setRouter(router: (path: string) => void): void

// 获取链接地址
href(): string | undefined

// 获取链接打开方式
target(): string

// 获取路由处理函数
router(): ((path: string) => void) | undefined
```

#### 便利方法
```typescript
// 设置为外部链接（新标签页打开）
setExternalLink(url: string): void

// 设置为内部路由链接
setInternalLink(path: string, router?: (path: string) => void): void

// 清除链接设置
clearLink(): void

// 检查是否为链接按钮
isLink(): boolean
```

## 使用示例

### 1. 外部链接按钮

```typescript
import { NHAITextButton } from './components/NHAIButton/TextButtonCommon'

// 方法一：使用基础方法
const externalButton = new NHAITextButton('访问官网')
externalButton.setHref('https://www.example.com')
externalButton.setTarget('_blank')

// 方法二：使用便利方法
const externalButton2 = new NHAITextButton('访问 GitHub')
externalButton2.setExternalLink('https://www.github.com')
```

### 2. 内部路由按钮

```typescript
// 定义路由处理函数
const router = (path: string) => {
  console.log(`导航到: ${path}`)
  // 这里可以集成 Vue Router、React Router 等
  // router.push(path)
}

// 方法一：使用基础方法
const internalButton = new NHAITextButton('首页')
internalButton.setHref('/home')
internalButton.setTarget('_self')
internalButton.setRouter(router)

// 方法二：使用便利方法
const internalButton2 = new NHAITextButton('关于我们')
internalButton2.setInternalLink('/about', router)
```

### 3. 普通按钮（无链接）

```typescript
const normalButton = new NHAITextButton('点击我')
normalButton.setOnClick(() => {
  console.log('按钮被点击了')
})
// 不设置 href，将渲染为 <button> 标签
```

### 4. 带下划线的链接按钮

```typescript
const underlinedButton = new NHAITextButton('带下划线的链接')
underlinedButton.setHref('https://www.example.com')
underlinedButton.setTarget('_blank')
underlinedButton.setUnderline(true) // 启用下划线
```

### 5. 禁用的链接按钮

```typescript
const disabledButton = new NHAITextButton('禁用的链接')
disabledButton.setHref('https://www.example.com')
disabledButton.setDisabled(true) // 禁用后不会响应点击
```

## 渲染行为

### 有链接时
- 渲染为 `<a>` 标签
- 自动添加 `href` 和 `target` 属性
- 支持自定义路由处理（当 `target` 为 `_self` 且有 `router` 时）
- 添加 `nhai-text-button--link` CSS 类

### 无链接时
- 渲染为 `<button>` 标签
- 保持原有的点击处理逻辑

## CSS 类名

- `nhai-text-button`: 基础类名
- `nhai-text-button--small`: 小尺寸
- `nhai-text-button--medium`: 中等尺寸
- `nhai-text-button--large`: 大尺寸
- `nhai-text-button--link`: 链接按钮（仅在有链接时添加）

## 注意事项

1. **优先级**: 当同时设置了 `href` 和 `onClick` 时，两者都会执行
2. **路由处理**: 只有在 `target` 为 `_self` 且有 `router` 函数时，才会使用自定义路由处理
3. **禁用状态**: 禁用的按钮不会响应任何点击事件，包括链接导航
4. **样式一致性**: 链接按钮和普通按钮保持相同的视觉样式
5. **无障碍性**: 链接按钮会自动添加适当的 `href` 属性，支持键盘导航

## 集成示例

### Vue.js 集成
```typescript
const router = (path: string) => {
  // 使用 Vue Router
  this.$router.push(path)
}

const button = new NHAITextButton('Vue 路由')
button.setInternalLink('/vue-page', router)
```

### React 集成
```typescript
const router = (path: string) => {
  // 使用 React Router
  history.push(path)
}

const button = new NHAITextButton('React 路由')
button.setInternalLink('/react-page', router)
```

### 原生 JavaScript
```typescript
const router = (path: string) => {
  // 自定义路由处理
  window.location.hash = path
  // 或者使用其他路由库
}

const button = new NHAITextButton('原生路由')
button.setInternalLink('/native-page', router)
```
