# NHAI UI Enterprise - 企业级 UI 组件库架构

## 🎯 设计理念

构建一个**三层架构**的企业级 UI 组件库：

```
┌─────────────────────────────────────────┐
│  业务组件层 (Business Components)        │
│  - 组合基础组件形成业务场景              │
│  - 如：DataTable, FormBuilder, etc.     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  基础组件层 (Base Components)           │
│  - 类似 Qt 对象式组件                    │
│  - 命令式 API 调用                       │
│  - 可组合、可扩展                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  底层框架 (Vue + Element Plus)           │
│  - 成熟的 UI 框架                        │
│  - 稳定的底层能力                        │
└─────────────────────────────────────────┘
```

## 📦 三层架构详解

### 第一层：底层框架（Vue + Element Plus）

**职责**：
- 提供 UI 渲染能力
- 响应式系统
- 事件处理
- 样式系统

**特点**：
- ✅ 成熟稳定
- ✅ 社区支持好
- ✅ 生态丰富

### 第二层：基础组件层（类似 Qt 对象）

**职责**：
- 封装底层框架为可组合对象
- 提供命令式 API
- 支持组合和扩展
- 统一的生命周期管理

**设计原则**：
```typescript
// 类似 Qt 的 QWidget
export class BaseComponent extends BaseCommand {
  // 统一的属性系统
  private props: ComponentProps = {}
  
  // 统一的渲染接口
  abstract render(): HTMLElement
  
  // 统一的生命周期
  mount(container: HTMLElement): void
  unmount(): void
  update(props: Partial<ComponentProps>): void
}
```

**组件分类**：

1. **基础控件（Basic Controls）**
   - Button, Input, Select, Switch, Checkbox, Radio
   - 类似 Qt 的 QPushButton, QLineEdit, etc.

2. **布局组件（Layout Components）**
   - VBox, HBox, Grid, Stack, Border
   - 类似 Qt 的 QVBoxLayout, QHBoxLayout, etc.

3. **容器组件（Container Components）**
   - Panel, GroupBox, Card, TabWidget
   - 类似 Qt 的 QWidget, QGroupBox, etc.

4. **数据展示（Data Display）**
   - Table, List, Tree, Chart
   - 类似 Qt 的 QTableView, QTreeView, etc.

5. **对话框（Dialogs）**
   - MessageBox, Dialog, Popup
   - 类似 Qt 的 QMessageBox, QDialog, etc.

### 第三层：业务组件层（Business Components）

**职责**：
- 组合基础组件形成业务场景
- 提供业务逻辑
- 封装复杂交互

**示例**：
```typescript
// 业务组件：数据表格（组合多个基础组件）
export class DataTable extends BaseComponent {
  private header: VBox
  private toolbar: HBox
  private table: Table
  private pagination: HBox
  
  constructor(config: DataTableConfig) {
    super()
    this.buildUI(config)
  }
  
  private buildUI(config: DataTableConfig): void {
    // 组合基础组件
    this.header = new VBox()
    this.toolbar = new HBox()
    this.table = new Table(config.columns)
    this.pagination = new HBox()
    
    this.layout = new VBox()
    this.layout.addWidget(this.header)
    this.layout.addWidget(this.toolbar)
    this.layout.addWidget(this.table)
    this.layout.addWidget(this.pagination)
  }
  
  render(): HTMLElement {
    return this.layout.render()
  }
}

// 业务组件：表单构建器（动态生成表单）
export class FormBuilder extends BaseComponent {
  private fields: BaseComponent[] = []
  
  addField(config: FieldConfig): void {
    let field: BaseComponent
    
    switch(config.type) {
      case 'text':
        field = new Input(config.label)
        break
      case 'select':
        field = new Select(config.label, config.options)
        break
      // ...
    }
    
    this.fields.push(field)
  }
  
  render(): HTMLElement {
    const form = new VBox()
    this.fields.forEach(field => {
      form.addWidget(field)
    })
    return form.render()
  }
}
```

## 🏗️ 项目结构

```
nhai-ui-enterprise/
├── packages/
│   ├── core/                    # 核心基础设施
│   │   ├── BaseCommand.ts       # 基类
│   │   ├── ComponentRegistry.ts # 组件注册
│   │   ├── EventBus.ts         # 事件总线
│   │   └── types.ts            # 核心类型
│   │
│   ├── basic/                   # 基础组件层
│   │   ├── controls/           # 控件
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── ...
│   │   ├── layouts/            # 布局
│   │   │   ├── VBox/
│   │   │   ├── HBox/
│   │   │   └── Grid/
│   │   ├── containers/         # 容器
│   │   │   ├── Panel/
│   │   │   ├── Card/
│   │   │   └── TabWidget/
│   │   └── index.ts
│   │
│   ├── business/                # 业务组件层
│   │   ├── DataTable/
│   │   ├── FormBuilder/
│   │   ├── FileUploader/
│   │   ├── RichEditor/
│   │   └── index.ts
│   │
│   └── wrappers/               # 框架包装层
│       ├── vue/               # Vue 包装
│       └── svelte/            # Svelte 包装
│
├── examples/                    # 示例
├── docs/                        # 文档
└── README.md
```

## 💻 使用示例

### 基础组件使用

```typescript
import { Button, VBox, Input, Table } from 'nhai-ui-enterprise'

// 创建按钮（类似 Qt 的 QPushButton）
const btn = new Button('提交')
btn.setType('primary')
btn.setOnClick(() => console.log('点击了'))

// 创建布局（类似 Qt 的 QVBoxLayout）
const layout = new VBox()
layout.setSpacing(10)

// 创建输入框
const input = new Input('用户名')
layout.addWidget(input)

// 添加到布局
layout.addWidget(btn)

// 渲染
const element = layout.render()
document.body.appendChild(element)
```

### 组合复杂组件

```typescript
import { VBox, HBox, Button, Input, Table } from 'nhai-ui-enterprise'

// 创建页面布局
const page = new VBox()
page.setPadding(20)

// 顶部工具栏
const toolbar = new HBox()
toolbar.setSpacing(10)

const addBtn = new Button('新增')
const editBtn = new Button('编辑')
const deleteBtn = new Button('删除')

toolbar.addWidget(addBtn)
toolbar.addWidget(editBtn)
toolbar.addWidget(deleteBtn)

// 中间表格
const table = new Table({
  columns: [
    { field: 'name', label: '姓名' },
    { field: 'age', label: '年龄' }
  ],
  data: [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 }
  ]
})

// 底部分页
const pagination = new HBox()
// ...

// 组合布局
page.addWidget(toolbar)
page.addWidget(table)
page.addWidget(pagination)

// 渲染
document.body.appendChild(page.render())
```

### 业务组件使用

```typescript
import { DataTable } from 'nhai-ui-enterprise'

// 直接使用业务组件
const table = new DataTable({
  columns: ['name', 'email', 'status'],
  dataSource: async () => {
    const data = await fetch('/api/users')
    return data.json()
  },
  toolbar: {
    search: true,
    filter: true,
    export: true
  },
  pagination: {
    pageSize: 20
  }
})

// 监听事件
table.on('rowClick', (row) => {
  console.log('点击了行', row)
})

// 渲染
document.body.appendChild(table.render())
```

## 🎨 组件设计原则

### 1. 对象化设计

每个组件都是一个独立的对象，具有：
- 属性（Properties）
- 方法（Methods）
- 事件（Events）
- 生命周期

```typescript
class Button extends BaseComponent {
  private text: string
  private type: ButtonType
  private onClick?: () => void
  
  constructor(text: string) {
    super()
    this.text = text
  }
  
  setType(type: ButtonType): Button {
    this.type = type
    return this
  }
  
  setOnClick(handler: () => void): Button {
    this.onClick = handler
    return this
  }
  
  render(): HTMLElement {
    // 渲染逻辑
  }
}
```

### 2. 组合优于继承

```typescript
// 通过组合构建复杂组件
class Form extends BaseComponent {
  private vbox: VBox
  private submitBtn: Button
  private cancelBtn: Button
  
  constructor(fields: Field[]) {
    super()
    this.vbox = new VBox()
    
    fields.forEach(field => {
      this.vbox.addWidget(field.component)
    })
    
    // 底部按钮
    this.submitBtn = new Button('提交')
    this.cancelBtn = new Button('取消')
    
    this.vbox.addWidget(this.submitBtn)
    this.vbox.addWidget(this.cancelBtn)
  }
  
  render(): HTMLElement {
    return this.vbox.render()
  }
}
```

### 3. 命令式 API

```typescript
// 类似 Qt 的命令式使用
const layout = new VBox()
const btn1 = new Button('按钮1')
const btn2 = new Button('按钮2')

layout.addWidget(btn1)
layout.addWidget(btn2)
layout.setSpacing(10)

const element = layout.render()
```

### 4. 类型安全

```typescript
// 完整的 TypeScript 类型支持
interface ButtonProps {
  text: string
  type?: 'primary' | 'success' | 'warning' | 'danger'
  onClick?: () => void
}

class Button extends BaseComponent<ButtonProps> {
  // ...
}
```

## 🚀 实现计划

### 第一阶段：基础设施
- [x] 创建 BaseCommand 基类
- [x] 创建组件注册系统
- [x] 创建事件总线
- [ ] 创建组件生命周期管理

### 第二阶段：基础组件
- [ ] 实现基础控件（Button, Input, Select...）
- [ ] 实现布局组件（VBox, HBox, Grid...）
- [ ] 实现容器组件（Panel, Card, TabWidget...）

### 第三阶段：业务组件
- [ ] 实现 DataTable
- [ ] 实现 FormBuilder
- [ ] 实现其他业务组件

### 第四阶段：文档和示例
- [ ] 编写完整文档
- [ ] 创建示例项目
- [ ] 性能优化

## 📈 技术优势

1. **成熟底层** - Vue + Element Plus 稳定可靠
2. **对象化设计** - 类似 Qt，易于理解和使用
3. **可组合性** - 组件可自由组合
4. **类型安全** - 完整 TypeScript 支持
5. **命令式 API** - 符合开发习惯
6. **业务导向** - 直接支持业务场景

## 🎯 目标

打造一个**企业级、可扩展、易使用**的 UI 组件库，
类似 Qt 的组件化设计理念，基于 Vue 生态实现。

