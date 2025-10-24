# NHAI Material Components 类型定义

## 概述

本文件提供了 NHAI 框架中所有 Material Design 组件的完整类型定义，包括：

- **基础组件**: 按钮、输入框、选择框、复选框、单选框、开关、滑块、评分
- **数据展示组件**: 表格、列表、卡片、标签、徽章、头像
- **布局组件**: 容器、网格、分割面板、折叠面板
- **导航组件**: 菜单栏、菜单、标签页、面包屑
- **工具栏组件**: 工具栏
- **反馈组件**: 对话框、消息、加载
- **工具组件**: 提示框、颜色选择器

## 使用方法

### 1. 导入类型定义

```typescript
// 导入所有 Material 组件类型
import * as MaterialComponents from 'nhai-framework/types/material-components'

// 或者导入特定组件
import { MaterialButton, MaterialInput, MaterialMenuBar } from 'nhai-framework'

// 导入枚举类型
import { ButtonType, ButtonSize, MenuBarLayoutType } from 'nhai-framework'

// 导入接口类型
import type { MenuItem, ToolbarConfig, SelectOption } from 'nhai-framework'
```

### 2. 使用组件类型

```typescript
// 创建按钮实例
const button = new MaterialButton('点击我')
button.setType(ButtonType.BASIC)
button.setColor(ButtonColor.BLUE)
button.setSize(ButtonSize.MEDIUM)

// 创建菜单栏实例
const menuBar = new MaterialMenuBar()
menuBar.setLayout(MenuBarLayoutType.HORIZONTAL)
menuBar.addItem({
  id: 'file',
  type: MenuItemType.SUBMENU,
  label: '文件',
  children: [
    { id: 'new', type: MenuItemType.ITEM, label: '新建', shortcut: 'Ctrl+N' },
    { id: 'open', type: MenuItemType.ITEM, label: '打开', shortcut: 'Ctrl+O' }
  ]
})

// 创建工具栏实例
const toolbar = new MaterialToolbar()
toolbar.setLayout(ToolbarLayoutType.HORIZONTAL)
toolbar.addButton('save', '保存', () => console.log('保存'))
toolbar.addIconButton('undo', 'undo', () => console.log('撤销'))
```

### 3. 使用工厂类

```typescript
import { NHAIObjectFactory } from 'nhai-framework'

// 使用工厂类创建组件
const button = NHAIObjectFactory.createMaterialButton('点击我')
const input = NHAIObjectFactory.createMaterialInput()
const menuBar = NHAIObjectFactory.createMaterialMenuBar()
const toolbar = NHAIObjectFactory.createMaterialToolbar()
```

## 组件分类

### 基础组件 (Basic Components)

| 组件 | 类名 | 主要功能 |
|------|------|----------|
| 按钮 | `MaterialButton` | 支持多种类型、颜色、尺寸的按钮 |
| 输入框 | `MaterialInput` | 支持多种输入类型和状态管理 |
| 选择框 | `MaterialSelect` | 支持单选、多选、搜索、级联等模式 |
| 复选框 | `MaterialCheckbox` | 支持不确定状态和自定义样式 |
| 单选框 | `MaterialRadio` | 支持分组和自定义样式 |
| 开关 | `MaterialSwitch` | 支持多种颜色主题 |
| 滑块 | `MaterialSlider` | 支持单值和范围选择 |
| 评分 | `MaterialRate` | 支持半星评分和自定义字符 |

### 数据展示组件 (Data Display Components)

| 组件 | 类名 | 主要功能 |
|------|------|----------|
| 表格 | `MaterialTable` | 支持排序、分页、自定义渲染 |
| 列表 | `MaterialList` | 支持头像、图标、操作按钮 |
| 卡片 | `MaterialCard` | 支持标题、内容、操作按钮 |
| 标签 | `MaterialTag` | 支持多种颜色和变体 |
| 徽章 | `MaterialBadge` | 支持数字、点状、自定义位置 |
| 头像 | `MaterialAvatar` | 支持图片、文字、多种尺寸 |

### 导航组件 (Navigation Components)

| 组件 | 类名 | 主要功能 |
|------|------|----------|
| 菜单栏 | `MaterialMenuBar` | 支持多种布局和菜单项类型 |
| 菜单 | `MaterialMenu` | 支持水平、垂直、内联模式 |
| 标签页 | `MaterialTabs` | 支持标准、可滚动、全宽模式 |
| 面包屑 | `MaterialBreadcrumb` | 支持分隔符、最大项数限制 |

### 工具栏组件 (Toolbar Components)

| 组件 | 类名 | 主要功能 |
|------|------|----------|
| 工具栏 | `MaterialToolbar` | 支持动态添加控件和自定义布局 |

## 枚举类型

### 按钮相关枚举

```typescript
enum ButtonType {
  BASIC = "basic",           // 基础按钮
  ICON_ONLY = "icon-only",   // 仅图标按钮
  TEXT_ONLY = "text-only",   // 仅文字按钮
  ICON_TEXT = "icon-text",   // 图标+文字按钮
  FLOATING = "floating",     // 浮动按钮
  DROPDOWN = "dropdown",     // 下拉按钮
  TOGGLE = "toggle"          // 切换按钮
}

enum ButtonSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRA_LARGE = "extra-large"
}

enum ButtonColor {
  RED = "red",
  PINK = "pink",
  PURPLE = "purple",
  // ... 更多颜色
}
```

### 菜单栏相关枚举

```typescript
enum MenuBarLayoutType {
  HORIZONTAL = "horizontal",  // 水平菜单栏
  VERTICAL = "vertical",       // 垂直菜单栏
  DROPDOWN = "dropdown",       // 下拉菜单栏
  CONTEXT = "context"          // 上下文菜单栏
}

enum MenuItemType {
  ITEM = "item",               // 普通菜单项
  SUBMENU = "submenu",         // 子菜单
  SEPARATOR = "separator",     // 分隔符
  CHECKBOX = "checkbox",       // 复选框菜单项
  RADIO = "radio",             // 单选菜单项
  GROUP = "group"              // 菜单组
}
```

## 接口类型

### 菜单项接口

```typescript
interface MenuItem {
  id: string                    // 菜单项ID
  type: MenuItemType           // 菜单项类型
  label?: string               // 菜单项标签
  icon?: string                // 菜单项图标
  shortcut?: string            // 快捷键
  tooltip?: string            // 提示信息
  visible?: boolean            // 是否可见
  enabled?: boolean            // 是否启用
  checked?: boolean            // 是否选中
  children?: MenuItem[]        // 子菜单项
  onClick?: () => void         // 点击事件处理器
  onToggle?: (checked: boolean) => void  // 切换事件处理器
  style?: Record<string, any>  // 自定义样式
  className?: string           // 自定义类名
  group?: string               // 所属组
}
```

### 工具栏配置接口

```typescript
interface ToolbarConfig {
  layout: ToolbarLayoutType    // 布局类型
  alignment: ToolbarAlignment  // 对齐方式
  spacing: number              // 间距
  padding: number              // 内边距
  backgroundColor?: string      // 背景色
  borderColor?: string         // 边框颜色
  borderRadius?: number        // 圆角
  shadow?: boolean             // 是否显示阴影
  height?: number | string     // 高度
  width?: number | string      // 宽度
  responsive?: boolean         // 是否响应式
  theme?: 'light' | 'dark'    // 主题
  gridColumns?: number         // 网格列数
}
```

## 注意事项

1. **类型安全**: 所有组件都提供了完整的类型定义，确保编译时类型检查
2. **命令式API**: 组件使用命令式API设计，通过方法调用进行配置
3. **链式调用**: 大部分配置方法支持链式调用，提高代码可读性
4. **事件处理**: 组件支持丰富的事件处理器，便于交互逻辑处理
5. **样式定制**: 支持自定义样式和类名，满足个性化需求

## 示例项目

查看 `examples/` 目录下的示例项目，了解如何使用这些组件：

- `basic-example.html` - 基础组件使用示例
- `menu-example.html` - 菜单栏使用示例
- `toolbar-example.html` - 工具栏使用示例
- `form-example.html` - 表单组件使用示例

## 更新日志

### v1.0.0 (2024)
- 初始版本发布
- 支持所有基础 Material Design 组件
- 提供完整的类型定义和文档
- 支持 TypeScript 类型检查
