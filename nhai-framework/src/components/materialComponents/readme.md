# Material UI Components for NHAI Framework

基于 Svelte + Material UI 的命令式 API 组件库，完全集成到 NHAI 框架中。

## 概述

本组件库实现了 26 个 Material UI 组件，使用命令式 API 设计，支持框架无关的使用方式。所有组件都遵循 Material Design 设计规范，提供一致的用户体验。

## 组件分类

### 基础交互组件（8个）
- **Button** - 按钮组件，支持多种样式和状态
- **Input** - 文本输入控件，支持验证和格式化
- **Select** - 下拉选择控件，支持单选和多选
- **Checkbox** - 多选控件，支持不确定状态
- **Radio** - 单选控件，支持分组
- **Switch** - 开关控件，用于布尔值选择
- **Slider** - 数值选择控件，支持范围选择
- **Rate** - 评分控件，支持半星评分

### 数据展示组件（6个）
- **Table** - 数据表格，支持排序、筛选、分页
- **List** - 数据列表，支持虚拟滚动
- **Card** - 信息卡片，支持标题、内容、操作
- **Tag** - 标签组件，支持多种样式
- **Badge** - 徽章组件，用于显示数量或状态
- **Avatar** - 用户头像，支持图片和文字

### 布局容器组件（4个）
- **Container** - 布局容器，支持响应式
- **Grid** - 栅格布局系统
- **SplitPanel** - 可拖拽的分割面板
- **Collapse** - 可折叠的内容面板

### 导航组件（3个）
- **Menu** - 导航菜单，支持多级菜单
- **Tabs** - 标签页组件，支持动态添加
- **Breadcrumb** - 面包屑导航

### 反馈组件（3个）
- **Message** - 全局消息提示
- **Dialog** - 模态对话框
- **Loading** - 加载状态指示器

### 工具组件（2个）
- **Tooltip** - 悬停提示组件
- **ColorPicker** - 颜色选择控件

## 快速开始

### 1. 安装依赖

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 2. 导入组件

```typescript
import { NHAIObjectFactory } from './factory/NHAIFactory'
import { MaterialButton, MaterialInput, MaterialCard } from './components/materialComponents'
```

### 3. 创建组件

```typescript
// 使用工厂方法创建
const button = NHAIObjectFactory.createMaterialButton('点击我')
button.setVariant('contained')
button.setColor('primary')
button.setOnClick(() => console.log('按钮被点击'))

// 直接实例化
const input = new MaterialInput()
input.setLabel('用户名')
input.setPlaceholder('请输入用户名')
input.setVariant('outlined')
```

### 4. 渲染组件

```typescript
// 渲染到 DOM
const element = button.render()
document.body.appendChild(element)
```

## 使用示例

### 基础交互组件

```typescript
// 创建按钮
const button = NHAIObjectFactory.createMaterialButton('提交')
button.setVariant('contained')
button.setColor('primary')
button.setSize('large')
button.setOnClick(() => {
  console.log('表单提交')
})

// 创建输入框
const input = NHAIObjectFactory.createMaterialInput()
input.setLabel('邮箱')
input.setPlaceholder('请输入邮箱地址')
input.setType('email')
input.setRequired(true)
input.setOnChange((value) => {
  console.log('邮箱:', value)
})

// 创建选择框
const select = NHAIObjectFactory.createMaterialSelect()
select.setLabel('城市')
select.setOptions([
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' }
])
select.setVariant('outlined')
```

### 数据展示组件

```typescript
// 创建表格
const table = NHAIObjectFactory.createMaterialTable()
table.setColumns([
  { key: 'name', title: '姓名', dataIndex: 'name' },
  { key: 'age', title: '年龄', dataIndex: 'age' },
  { key: 'email', title: '邮箱', dataIndex: 'email' }
])
table.setDataSource([
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' }
])
table.setPagination(true)
table.setPageSize(10)

// 创建卡片
const card = NHAIObjectFactory.createMaterialCard()
card.setTitle('用户信息')
card.setSubtitle('基本信息')
card.setContent('这是一个用户信息卡片')
card.addAction({
  label: '编辑',
  onClick: () => console.log('编辑用户'),
  variant: 'outlined',
  color: 'primary'
})
```

### 布局容器组件

```typescript
// 创建容器
const container = NHAIObjectFactory.createMaterialContainer()
container.setMaxWidth('md')
container.setFixed(false)

// 创建网格
const grid = NHAIObjectFactory.createMaterialGrid()
grid.setContainer(true)
grid.setSpacing(2)
grid.setDirection('row')

// 添加网格项
grid.addItem({
  xs: 12,
  sm: 6,
  md: 4,
  component: button
})
```

### 导航组件

```typescript
// 创建菜单
const menu = NHAIObjectFactory.createMaterialMenu()
menu.setMode('horizontal')
menu.setItems([
  {
    id: 'home',
    label: '首页',
    onClick: () => console.log('导航到首页')
  },
  {
    id: 'about',
    label: '关于',
    children: [
      { id: 'team', label: '团队', onClick: () => console.log('团队') },
      { id: 'history', label: '历史', onClick: () => console.log('历史') }
    ]
  }
])

// 创建标签页
const tabs = NHAIObjectFactory.createMaterialTabs()
tabs.setVariant('standard')
tabs.setColor('primary')
tabs.addItem({
  id: 'tab1',
  label: '标签页1',
  content: '这是第一个标签页的内容'
})
```

### 反馈组件

```typescript
// 创建消息组件
const message = NHAIObjectFactory.createMaterialMessage()
message.setPosition('top')
message.success('操作成功！')
message.error('操作失败！')

// 创建对话框
const dialog = NHAIObjectFactory.createMaterialDialog()
dialog.setTitle('确认删除')
dialog.setContent('确定要删除这个项目吗？')
dialog.addAction({
  label: '取消',
  onClick: () => dialog.hide(),
  variant: 'text'
})
dialog.addAction({
  label: '删除',
  onClick: () => {
    console.log('确认删除')
    dialog.hide()
  },
  variant: 'contained',
  color: 'error'
})

// 创建加载组件
const loading = NHAIObjectFactory.createMaterialLoading()
loading.setLoading(true)
loading.setVariant('circular')
loading.setText('加载中...')
loading.setOverlay(true)
```

### 工具组件

```typescript
// 创建工具提示
const tooltip = NHAIObjectFactory.createMaterialTooltip()
tooltip.setTitle('这是一个工具提示')
tooltip.setPlacement('top')
tooltip.setArrow(true)
tooltip.addChild(button)

// 创建颜色选择器
const colorPicker = NHAIObjectFactory.createMaterialColorPicker()
colorPicker.setValue('#1976d2')
colorPicker.setFormat('hex')
colorPicker.setOnChange((value) => {
  console.log('选择的颜色:', value)
})
```

## 完整应用示例

```typescript
import { MaterialComponentsExamples } from './components/materialComponents/examples'

// 创建完整的应用界面
const app = MaterialComponentsExamples.createCompleteAppExample()

// 渲染应用
const appElement = app.render()
document.body.appendChild(appElement)
```

## API 设计原则

### 命令式 API
所有组件都使用命令式 API 设计，通过方法调用来设置属性和行为：

```typescript
const button = new MaterialButton('文本')
button.setVariant('contained')
button.setColor('primary')
button.setSize('large')
button.setOnClick(() => console.log('点击'))
```

### 链式调用
支持链式调用，提高代码可读性：

```typescript
const button = new MaterialButton('文本')
  .setVariant('contained')
  .setColor('primary')
  .setSize('large')
  .setOnClick(() => console.log('点击'))
```

### 类型安全
所有组件都提供完整的 TypeScript 类型定义，确保类型安全。

### 事件处理
统一的事件处理机制，支持各种用户交互：

```typescript
button.setOnClick(() => console.log('点击'))
input.setOnChange((value) => console.log('值变化:', value))
table.setOnRowClick((record, index) => console.log('行点击:', record))
```

## 样式定制

所有组件都支持样式定制，可以通过以下方式：

1. **主题颜色**：使用预定义的颜色主题
2. **尺寸变体**：支持 small、medium、large 三种尺寸
3. **样式变体**：支持不同的视觉样式
4. **自定义样式**：通过 setCustomStyle 方法设置自定义样式

## 响应式设计

布局组件支持响应式设计：

```typescript
const grid = new MaterialGrid()
grid.addItem({
  xs: 12,    // 超小屏幕全宽
  sm: 6,     // 小屏幕半宽
  md: 4,     // 中等屏幕 1/3 宽
  lg: 3,     // 大屏幕 1/4 宽
  component: button
})
```

## 性能优化

- 组件按需加载
- 虚拟滚动支持（List 组件）
- 分页支持（Table 组件）
- 延迟加载和懒加载

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件库。