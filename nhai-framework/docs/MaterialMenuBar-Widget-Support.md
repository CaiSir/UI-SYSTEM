# MaterialMenuBar 控件支持

## 概述

`MaterialMenuBar` 现在完全支持将任意 NHAI Widget 控件嵌入到菜单栏中。这使得菜单栏不再局限于文本、图标和快捷方式，而是可以包含任何类型的交互式控件。

## 新增功能

### 1. 菜单项类型扩展

新增了 `WIDGET` 类型的菜单项，允许嵌入任意 NHAIWidget：

```typescript
export enum MenuItemType {
  ITEM = 'item',          // 普通菜单项
  SUBMENU = 'submenu',    // 子菜单
  SEPARATOR = 'separator', // 分隔符
  CHECKBOX = 'checkbox',  // 复选框菜单项
  RADIO = 'radio',        // 单选菜单项
  GROUP = 'group',        // 菜单组
  WIDGET = 'widget'       // 嵌入控件 (新增)
}
```

### 2. MenuItem 接口扩展

`MenuItem` 接口现在支持嵌入控件：

```typescript
export interface MenuItem {
  id: string
  type: MenuItemType
  label?: string
  icon?: string
  shortcut?: string
  tooltip?: string
  visible?: boolean
  enabled?: boolean
  checked?: boolean
  children?: MenuItem[]
  onClick?: () => void
  onToggle?: (checked: boolean) => void
  style?: Record<string, any>
  className?: string
  group?: string
  
  // 新增：支持嵌入任意 NHAIWidget 控件
  widget?: NHAIWidget
  // 控件配置 (用于动态创建控件)
  widgetType?: string
  widgetConfig?: Record<string, any>
}
```

## 使用方法

### 基本用法：添加控件到菜单栏

```typescript
import {
  MaterialMenuBar,
  MaterialButton,
  MaterialInput,
  MaterialSwitch,
  MaterialSelect,
  MaterialCheckbox,
  MaterialRadio,
  MaterialSlider,
  MaterialRate,
  NHAIFrameworkRegistry,
  VanillaAdapter
} from 'nhai-framework';

// 注册框架适配器
NHAIFrameworkRegistry.register(new VanillaAdapter());
NHAIFrameworkRegistry.use('vanilla');

// 创建菜单栏
const menuBar = new MaterialMenuBar();

// 创建控件
const saveButton = new MaterialButton('保存');
const searchInput = new MaterialInput('搜索...');
const enableSwitch = new MaterialSwitch('启用', true);
const colorSelect = new MaterialSelect('颜色', [
  { label: '红色', value: 'red' },
  { label: '蓝色', value: 'blue' }
]);

// 添加控件到菜单栏
menuBar
  .addItem({ id: 'file', type: MenuItemType.ITEM, label: '文件' })
  .addItem({ id: 'edit', type: MenuItemType.ITEM, label: '编辑' })
  .addWidget('save-btn', saveButton)
  .addWidget('search-input', searchInput)
  .addWidget('enable-switch', enableSwitch)
  .addWidget('color-select', colorSelect);

// 渲染菜单栏
const element = menuBar.render();
document.body.appendChild(element);
```

### 高级用法：使用 addWidget 方法

```typescript
// addWidget 方法签名
addWidget(
  id: string,               // 控件 ID
  widget: NHAIWidget,       // 要嵌入的控件实例
  config?: {                // 可选配置
    visible?: boolean,       // 是否可见
    enabled?: boolean,       // 是否启用
    style?: Record<string, any>,  // 自定义样式
    className?: string       // 自定义类名
  }
): MaterialMenuBar
```

```typescript
// 示例：添加按钮控件
const button = new MaterialButton('点击我');
menuBar.addWidget('my-button', button, {
  visible: true,
  enabled: true,
  style: { margin: '0 8px' },
  className: 'custom-widget-item'
});

// 示例：添加输入框控件
const input = new MaterialInput('输入文本');
menuBar.addWidget('search', input, {
  style: { width: '200px', margin: '0 8px' }
});

// 示例：添加开关控件
const switchCtrl = new MaterialSwitch('启用功能', true);
switchCtrl.setOnChange((checked) => {
  console.log('开关状态:', checked);
});
menuBar.addWidget('toggle', switchCtrl);
```

## 支持的控件类型

MaterialMenuBar 现在支持所有 NHAI Material 控件：

### 基础控件
- ✅ **MaterialButton** - 按钮
- ✅ **MaterialInput** - 输入框
- ✅ **MaterialSelect** - 选择框
- ✅ **MaterialCheckbox** - 复选框
- ✅ **MaterialRadio** - 单选框
- ✅ **MaterialSwitch** - 开关
- ✅ **MaterialSlider** - 滑块
- ✅ **MaterialRate** - 评分

### 数据展示控件
- ✅ **MaterialTable** - 表格
- ✅ **MaterialList** - 列表
- ✅ **MaterialCard** - 卡片
- ✅ **MaterialTag** - 标签
- ✅ **MaterialBadge** - 徽章
- ✅ **MaterialAvatar** - 头像

### 布局控件
- ✅ **MaterialContainer** - 容器
- ✅ **MaterialGrid** - 网格
- ✅ **MaterialSplitPanel** - 分割面板
- ✅ **MaterialCollapse** - 折叠面板

### 导航控件
- ✅ **MaterialMenu** - 菜单
- ✅ **MaterialTabs** - 标签页
- ✅ **MaterialBreadcrumb** - 面包屑

### 反馈控件
- ✅ **MaterialDialog** - 对话框
- ✅ **MaterialMessage** - 消息
- ✅ **MaterialLoading** - 加载

### 工具控件
- ✅ **MaterialTooltip** - 提示框
- ✅ **MaterialColorPicker** - 颜色选择器

## 完整示例

以下示例展示了如何在菜单栏中使用各种控件：

```typescript
import { MaterialMenuBar, MaterialButton, MaterialInput, MaterialSwitch } from 'nhai-framework';

const menuBar = new MaterialMenuBar();

// 创建各种控件
const saveButton = new MaterialButton('保存');
const searchInput = new MaterialInput('搜索');
const themeSwitch = new MaterialSwitch('深色主题', false);

// 添加普通菜单项和控件
menuBar
  .addItem({ 
    id: 'file', 
    type: MenuItemType.ITEM, 
    label: '文件',
    icon: 'folder'
  })
  .addItem({ 
    id: 'edit', 
    type: MenuItemType.ITEM, 
    label: '编辑',
    icon: 'edit'
  })
  .addSeparator('sep1')
  .addWidget('save', saveButton)
  .addWidget('search', searchInput)
  .addWidget('theme', themeSwitch)
  .addSeparator('sep2')
  .addItem({ 
    id: 'help', 
    type: MenuItemType.ITEM, 
    label: '帮助',
    icon: 'help'
  });

// 渲染
const menuElement = menuBar.render();
document.body.appendChild(menuElement);
```

## 技术实现

### 控件渲染机制

1. **控件创建**: 创建 NHAIWidget 实例
2. **添加控件**: 使用 `addWidget()` 方法将控件添加到菜单栏
3. **渲染机制**: 菜单栏调用控件的 `render()` 方法获取其 DOM 元素
4. **样式整合**: 控件元素被包装在菜单项容器中，应用统一的菜单样式

### 样式支持

控件菜单项支持以下样式配置：

```typescript
menuBar.addWidget('widget-id', myWidget, {
  style: {
    margin: '0 8px',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center'
  },
  className: 'custom-widget-item'
});
```

### 事件处理

嵌入的控件保持其原有的事件处理能力：

```typescript
const button = new MaterialButton('点击我');
button.setOnClick(() => {
  console.log('按钮被点击');
});

menuBar.addWidget('my-button', button);
```

## 注意事项

1. **性能考虑**: 在菜单栏中嵌入过多的复杂控件可能影响渲染性能
2. **响应式设计**: 控件的大小应该适配菜单栏的布局
3. **交互一致性**: 确保嵌入的控件与菜单栏的整体交互保持一致
4. **兼容性**: 所有控件的 `render()` 方法必须返回有效的 DOM 元素

## 测试

运行测试文件验证功能：

```bash
# 打开测试页面
open test-menubar-widgets.html
```

测试包括：
- ✅ 基础菜单项渲染
- ✅ 按钮控件嵌入
- ✅ 输入框控件嵌入
- ✅ 混合控件支持
- ✅ 所有控件类型支持

## 版本历史

### v1.1.0 (新增)
- 添加 `WIDGET` 菜单项类型
- 实现 `addWidget()` 方法
- 实现 `renderWidgetItem()` 渲染逻辑
- 扩展 `MenuItem` 接口支持控件嵌入
- 添加完整的测试套件

## 相关文档

- [MaterialMenuBar API 文档](./MaterialMenuBar-API.md)
- [Material Components 完整列表](./material-components.md)
- [NHAI Framework 使用指南](./nhai-guide.md)
