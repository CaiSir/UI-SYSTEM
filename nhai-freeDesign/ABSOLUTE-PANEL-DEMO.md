# AbsolutePanel 命令式 API 演示

这是一个展示 `AbsolutePanel` 组件命令式 API 的交互式演示页面。

## 🌟 功能特性

- 📝 **在线代码编辑器** - 使用 CodeMirror 编辑器
- 🎨 **实时预览** - 修改代码后立即查看效果
- 💡 **示例代码** - 内置完整的代码示例
- 🎯 **错误处理** - 友好的错误提示信息
- 📱 **响应式设计** - 适配不同屏幕尺寸

## 🚀 使用方法

1. **打开演示页面**
   ```bash
   # 在浏览器中打开
   file:///path/to/absolute-panel-demo.html
   
   # 或者通过开发服务器
   npm run dev
   # 然后访问 http://localhost:5173/absolute-panel-demo.html
   ```

2. **编辑代码**
   - 在左侧代码编辑器中修改代码
   - 点击"运行代码"按钮查看效果
   - 或使用快捷键 `Ctrl+S` (Windows) 或 `Cmd+S` (Mac)

3. **查看预览**
   - 右侧显示实时的渲染效果
   - 如果代码有错误，会显示详细的错误信息

## 📚 示例代码

### 基础示例

```javascript
// 创建绝对定位面板
const panel = new AbsolutePanelCommand('100%', '600px')
panel.setBackgroundColor('#f0f0f0')

// 添加按钮
const button = new VueButtonCommand('点击我')
button.setType('primary')
panel.addWidgetAt('btn1', button, { x: 50, y: 50 }, { width: 100, height: 40 })

// 渲染
return panel.render()
```

### 高级示例 - 多个组件

```javascript
const panel = new AbsolutePanelCommand('100%', '800px')
panel.setBackgroundColor('#f5f5f5')

// 添加多个按钮
for (let i = 0; i < 5; i++) {
  const btn = new VueButtonCommand(`按钮 ${i + 1}`)
  btn.setType(i % 2 === 0 ? 'primary' : 'success')
  panel.addWidgetAt(`btn${i}`, btn, { x: 50 + i * 120, y: 50 }, { width: 100, height: 40 })
}

// 添加输入框
const input = new VueInputCommand()
input.setPlaceholder('请输入文本...')
panel.addWidgetAt('input1', input, { x: 50, y: 120 }, { width: 250, height: 40 })

// 添加选择框
const select = new VueSelectCommand()
select.setOptions([
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' }
])
select.setPlaceholder('请选择...')
panel.addWidgetAt('select1', select, { x: 50, y: 180 }, { width: 250, height: 40 })

return panel.render()
```

## 🎯 API 参考

### AbsolutePanelCommand

#### 构造函数
```javascript
new AbsolutePanelCommand(width?, height?)
```

参数：
- `width` (可选): 面板宽度，默认 `'100%'`
- `height` (可选): 面板高度，默认 `'100%'`

#### 方法

##### `setWidth(width: string): void`
设置面板宽度

##### `setHeight(height: string): void`
设置面板高度

##### `setBackgroundColor(color: string): void`
设置背景颜色

##### `addWidgetAt(id: string, widget: BaseCommand, position: {x: number, y: number}, size?: {width: number, height: number}): void`
在指定位置添加组件

参数：
- `id`: 组件唯一标识
- `widget`: 要添加的组件（继承自 BaseCommand）
- `position`: 位置坐标 `{x, y}`
- `size` (可选): 组件大小 `{width, height}`

##### `setPosition(id: string, x: number, y: number): void`
更新组件位置

##### `getPosition(id: string): {x: number, y: number} | undefined`
获取组件位置

##### `setSize(id: string, width: number, height: number): void`
更新组件大小

##### `getSize(id: string): {width: number, height: number} | undefined`
获取组件大小

##### `render(): HTMLElement`
渲染面板为 DOM 元素

##### `unmount(): void`
卸载面板

## 🎨 组件参考

演示中使用的组件：

### VueButtonCommand
```javascript
const button = new VueButtonCommand(text?)
button.setType(type)  // 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
button.setSize(size)   // 'large' | 'default' | 'small'
button.setOnClick(callback)
```

### VueInputCommand
```javascript
const input = new VueInputCommand()
input.setPlaceholder(placeholder)
input.setValue(value)
setOnChange(callback)
```

### VueSelectCommand
```javascript
const select = new VueSelectCommand()
select.setOptions(options)  // Array<{label: string, value: any}>
select.setPlaceholder(placeholder)
setOnChange(callback)
```

## 🐛 调试技巧

1. **查看控制台** - 打开浏览器开发者工具查看详细错误
2. **检查导入** - 确保正确导入了所需的类
3. **返回值** - 代码的最后一行应该返回 DOM 元素
4. **组件创建** - 确保组件已正确创建并配置

## 📖 相关资源

- [README.md](./README.md) - 项目说明
- [nhai-ui-vue](../nhai-ui-vue/) - UI 组件库源码
- [命令式 API 指南](../nhai-ui-vue/docs/COMMAND-API-GUIDE.md) - 详细文档

## 💡 提示

- 使用 `//` 添加注释说明代码逻辑
- 可以使用 JavaScript 的所有语法特性（循环、条件等）
- 尝试不同的组件组合和布局
- 探索组件的事件处理和交互

