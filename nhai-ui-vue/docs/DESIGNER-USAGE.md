# 可视化布局设计器使用指南

## 功能概述

可视化布局设计器（DesignerApp）提供了一个拖拽式的界面设计环境，可以让您：

1. **拖拽组件**：从左侧组件库拖拽组件到画布
2. **编辑属性**：选中组件后，在左侧属性面板修改样式和属性
3. **实时预览**：在画布上实时查看组件效果
4. **生成代码**：自动生成可复制的业务组件代码

## 使用步骤

### 1. 切换到设计器模式

启动应用后，点击右上角的 **"🎨 可视化设计器"** 按钮切换到设计器模式。

### 2. 添加组件

从左侧组件库中拖拽组件到画布区域：

- **🔘 按钮**：拖拽按钮组件到画布
- **📝 输入框**：拖拽输入框组件到画布
- **🔽 选择器**：拖拽选择器组件到画布

### 3. 编辑属性

点击画布上的组件进行选中，然后在左侧属性面板中修改：

**按钮组件属性：**
- 文本内容：修改按钮显示的文本
- 按钮类型：选择按钮颜色（Primary / Success / Warning / Danger）
- X 坐标：修改按钮的水平位置
- Y 坐标：修改按钮的垂直位置

### 4. 生成代码

1. 点击右上角的 **"查看代码"** 按钮
2. 右侧会显示生成的代码
3. 点击 **"复制"** 按钮将代码复制到剪贴板
4. 在组件展示模式中粘贴并运行代码

### 5. 保存设计

点击 **"保存设计"** 按钮，设计会保存到浏览器的本地存储中。

### 6. 清空画布

点击 **"清空画布"** 按钮清除所有组件。

## 生成的代码示例

设计器生成的代码格式如下：

```javascript
// 复制以下代码到 showcase 的运行框中

const { VueButtonCommand } = window

const container = document.createElement('div')
container.style.padding = '20px'
container.style.position = 'relative'
container.style.width = '800px'
container.style.height = '600px'
container.style.border = '1px solid #ddd'

// 按钮 1
const btn0 = new VueButtonCommand('我的按钮')
btn0.setType('primary')
const element0 = btn0.render()
element0.style.position = 'absolute'
element0.style.left = '100px'
element0.style.top = '50px'
container.appendChild(element0)

return container
```

## 工作原理

1. **拖拽系统**：使用 HTML5 拖拽 API (`dragstart`, `drop`, `dragover`)
2. **组件实例化**：每个拖拽的组件都创建一个对应的 Command 实例
3. **属性绑定**：属性面板修改会实时更新组件实例
4. **代码生成**：根据画布上的组件自动生成可执行的 JavaScript 代码
5. **视图刷新**：属性修改后重新渲染组件元素

## 组件类型

目前支持以下组件：

- **VueButtonCommand**：按钮组件
- **VueInputCommand**：输入框组件
- **VueSelectCommand**：选择器组件

更多组件正在开发中...

## 技术特性

- ✅ 拖拽式界面设计
- ✅ 实时属性编辑
- ✅ 可视化预览
- ✅ 自动代码生成
- ✅ 本地存储
- ✅ 复制粘贴运行

## 未来计划

- [ ] 支持更多组件类型
- [ ] 支持组件分组和嵌套
- [ ] 支持导入/导出设计文件
- [ ] 支持撤销/重做操作
- [ ] 支持键盘快捷键
- [ ] 支持对齐和网格吸附
- [ ] 支持组件样式自定义面板

