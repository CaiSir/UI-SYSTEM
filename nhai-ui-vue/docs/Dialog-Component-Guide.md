# Dialog 组件使用指南

## 概述

Dialog 组件是一个基于 Element Plus 的对话框组件，提供了完整的对话框功能，支持打开/关闭、事件监听、自定义内容等功能。

## 基本用法

### 1. 基础对话框

```typescript
import { NhaiDialogCommand } from 'nhai-ui-vue'

// 创建对话框
const dialog = new NhaiDialogCommand('标题', '对话框内容')

// 打开对话框
dialog.setModelValue(true)

// 渲染并添加到页面
dialog.render()
document.body.appendChild(dialog.getElement())
```

### 2. 带确认和取消按钮的对话框

```typescript
const dialog = new NhaiDialogCommand('确认', '确定要执行此操作吗？')

// 显示底部按钮
dialog.setShowFooter(true)

// 设置按钮文本
dialog.setConfirmText('确定')
dialog.setCancelText('取消')

// 监听事件
dialog.on('confirm', () => {
  console.log('用户点击了确认')
})

dialog.on('cancel', () => {
  console.log('用户点击了取消')
})

dialog.setModelValue(true)
dialog.render()
document.body.appendChild(dialog.getElement())
```

## API 参考

### NhaiDialogCommand

#### 构造函数

```typescript
new NhaiDialogCommand(title?: string, content?: string)
```

- `title`: 对话框标题
- `content`: 对话框内容（支持 HTML）

#### 属性设置方法

| 方法 | 类型 | 说明 |
|------|------|------|
| `setModelValue(value: boolean)` | void | 设置对话框显示/隐藏 |
| `setTitle(title: string)` | void | 设置标题 |
| `setWidth(width: string \| number)` | void | 设置宽度（默认 '50%'） |
| `setContent(content: string)` | void | 设置内容（支持 HTML） |
| `setFullscreen(fullscreen: boolean)` | void | 设置是否全屏 |
| `setModal(modal: boolean)` | void | 设置是否显示遮罩层（默认 true） |
| `setAppendToBody(appendToBody: boolean)` | void | 设置是否挂载到 body |
| `setLockScroll(lockScroll: boolean)` | void | 设置是否锁定滚动（默认 true） |
| `setCloseOnClickModal(closeOnClickModal: boolean)` | void | 设置点击遮罩是否关闭（默认 false，模态框不关闭） |
| `setCloseOnPressEscape(closeOnPressEscape: boolean)` | void | 设置按 ESC 是否关闭 |
| `setShowClose(showClose: boolean)` | void | 设置是否显示关闭按钮 |
| `setDraggable(draggable: boolean)` | void | 设置是否可拖动 |
| `setCenter(center: boolean)` | void | 设置是否居中 |
| `setAlignCenter(alignCenter: boolean)` | void | 设置标题和内容是否居中 |
| `setZIndex(zIndex: number)` | void | 设置层级（默认 2000） |
| `setShowFooter(showFooter: boolean)` | void | 设置是否显示底部按钮 |
| `setConfirmText(text: string)` | void | 设置确认按钮文本（默认 '确定'） |
| `setCancelText(text: string)` | void | 设置取消按钮文本（默认 '取消'） |

#### 模态相关设置方法

| 方法 | 类型 | 说明 |
|------|------|------|
| `setModal(modal: boolean)` | void | 设置是否显示遮罩层 |
| `setModalClass(modalClass: string)` | void | 设置遮罩层的自定义样式类名 |
| `setModalStyle(modalStyle: object)` | void | 设置遮罩层的自定义样式 |
| `setModalBackdrop(modalBackdrop: boolean)` | void | 设置是否显示遮罩层背景 |
| `setModalFade(modalFade: boolean)` | void | 设置遮罩层淡入淡出动画 |

#### 控制方法

| 方法 | 说明 |
|------|------|
| `open()` | 打开对话框 |
| `close()` | 关闭对话框 |
| `toggle()` | 切换对话框显示状态 |
| `render()` | 渲染组件为 DOM 元素 |
| `unmount()` | 卸载组件 |

#### 事件

| 事件 | 说明 |
|------|------|
| `open` | 对话框打开时触发 |
| `opened` | 对话框完全打开后触发 |
| `close` | 对话框关闭时触发 |
| `closed` | 对话框完全关闭后触发 |
| `confirm` | 点击确认按钮时触发 |
| `cancel` | 点击取消按钮时触发 |

#### 获取方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getModelValue()` | boolean | 获取显示状态 |
| `getTitle()` | string \| undefined | 获取标题 |
| `getWidth()` | string \| number \| undefined | 获取宽度 |
| `getContent()` | string \| undefined | 获取内容 |

## 使用示例

### 示例 1: 基础使用

```typescript
const dialog = new NhaiDialogCommand('提示', '这是一个简单的对话框')
dialog.setModelValue(true)
dialog.setAppendToBody(true)
dialog.render()
```

### 示例 2: 确认删除对话框

```typescript
const dialog = new NhaiDialogCommand('确认删除', '确定要删除此项吗？此操作不可恢复。')
dialog.setShowFooter(true)
dialog.setConfirmText('删除')
dialog.setCancelText('取消')
dialog.setWidth('450px')

dialog.on('confirm', () => {
  // 执行删除操作
  console.log('已删除')
  dialog.unmount()
})

dialog.on('closed', () => {
  dialog.unmount()
})

dialog.setModelValue(true)
dialog.render()
```

### 示例 3: 可拖动的对话框

```typescript
const dialog = new NhaiDialogCommand('可拖动对话框', '这个对话框可以拖动')
dialog.setDraggable(true)
dialog.setModelValue(true)
dialog.render()
document.body.appendChild(dialog.getElement())
```

### 示例 4: 全屏对话框

```typescript
const dialog = new NhaiDialogCommand('全屏对话框', '这是一个全屏对话框')
dialog.setFullscreen(true)
dialog.setModelValue(true)
dialog.render()
document.body.appendChild(dialog.getElement())
```

### 示例 5: 可点击遮罩层关闭的对话框

```typescript
// 默认情况下，模态框点击遮罩层不会关闭
// 如果需要允许点击遮罩层关闭，需要显式设置

const dialog = new NhaiDialogCommand('可关闭', '点击遮罩层可以关闭此对话框')
dialog.setCloseOnClickModal(true) // 允许点击遮罩关闭
dialog.setModelValue(true)
dialog.render()
document.body.appendChild(dialog.getElement())
```

### 示例 6: HTML 内容

```typescript
const htmlContent = `
  <div style="color: red; font-weight: bold;">这是红色粗体文字</div>
  <br>
  这是普通文字
  <br><br>
  可以包含 <strong>粗体</strong> 和 <em>斜体</em> 文本
`

const dialog = new NhaiDialogCommand('HTML 内容', htmlContent)
dialog.setModelValue(true)
dialog.render()
document.body.appendChild(dialog.getElement())
```

### 示例 7: 事件监听

```typescript
const dialog = new NhaiDialogCommand('事件示例', '这个对话框会触发各种事件')

dialog.on('open', () => {
  console.log('对话框开始打开')
})

dialog.on('opened', () => {
  console.log('对话框完全打开')
})

dialog.on('close', () => {
  console.log('对话框开始关闭')
})

dialog.on('closed', () => {
  console.log('对话框完全关闭')
  dialog.unmount()
})

dialog.setModelValue(true)
dialog.render()
document.body.appendChild(dialog.getElement())
```

### 示例 8: 自定义模态样式

```typescript
// 深色遮罩层
const dialog = new NhaiDialogCommand('提示', '这是一个深色遮罩层的对话框')
dialog.setModalStyle({ backgroundColor: 'rgba(0, 0, 0, 0.8)' })
dialog.setModelValue(true)
dialog.render()

// 彩色遮罩层
const dialog2 = new NhaiDialogCommand('提示', '这是一个蓝色遮罩层的对话框')
dialog2.setModalStyle({ backgroundColor: 'rgba(64, 158, 255, 0.5)' })
dialog2.setModelValue(true)
dialog2.render()

// 无背景遮罩层
const dialog3 = new NhaiDialogCommand('提示', '这是一个透明遮罩层的对话框')
dialog3.setModalBackdrop(false)
dialog3.setModelValue(true)
dialog3.render()

// 禁用遮罩层淡入淡出动画
const dialog4 = new NhaiDialogCommand('提示', '这是一个无动画的对话框')
dialog4.setModalFade(false)
dialog4.setModelValue(true)
dialog4.render()
```

## 注意事项

1. **内存管理**: 使用完对话框后应调用 `unmount()` 方法清理资源
2. **挂载位置**: 建议使用 `setAppendToBody(true)` 将对话框挂载到 body，避免样式问题
3. **事件监听**: 所有事件都支持多次监听，可通过 `off()` 方法移除监听
4. **嵌套使用**: 对话框可以嵌套使用，但需要注意 z-index 层级问题
5. **模态框行为**: 默认情况下，点击遮罩层**不会**关闭对话框（`closeOnClickModal: false`），这是标准的模态框行为。如果需要允许点击遮罩层关闭，请调用 `setCloseOnClickModal(true)`
6. **关闭方式**: 模态框只能通过以下方式关闭：
   - 点击关闭按钮（右上角的 X）
   - 点击确认/取消按钮（如果开启了 `showFooter`）
   - 按 ESC 键（如果 `closeOnPressEscape` 为 true）
   - 调用 `close()` 方法

## 运行示例

运行以下命令启动开发服务器，然后访问示例页面：

```bash
cd nhai-ui-vue
npm run dev
```

然后访问 `http://localhost:5173/examples/dialog-demo.html` 查看完整的对话框示例。

