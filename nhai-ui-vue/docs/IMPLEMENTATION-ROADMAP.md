# 企业级 UI 组件库实现路线图

## 📊 当前状态

### ✅ 已完成
- [x] BaseCommand 基类
- [x] 基础工具函数（UIHelpers）
- [x] 部分基础组件（Button, Input, Select, Switch...）
- [x] LayoutBuilder（布局构建器）

### 🔄 进行中
- [ ] 完善 BaseCommand 生命周期
- [ ] 所有组件继承 BaseCommand
- [ ] 组件注册系统

### ⏳ 待开始
- [ ] 完整的基础组件库
- [ ] 业务组件层
- [ ] 文档系统

## 🎯 第一阶段：完善基础设施

### 1.1 增强 BaseCommand

```typescript
// src/lib/BaseCommand.ts
export abstract class BaseCommand {
  protected _mounted: boolean = false
  protected _element?: HTMLElement
  protected _appInstance?: any
  protected _children: BaseCommand[] = []
  protected _parent?: BaseCommand
  
  // 属性系统
  private props: Record<string, any> = {}
  
  // 事件系统
  private events: Map<string, Function[]> = new Map()
  
  /**
   * 设置属性（类似 Qt 的 setProperty）
   */
  setProperty(key: string, value: any): void {
    this.props[key] = value
    this.update()
  }
  
  /**
   * 获取属性（类似 Qt 的 property）
   */
  getProperty(key: string): any {
    return this.props[key]
  }
  
  /**
   * 监听事件（类似 Qt 的 connect）
   */
  on(event: string, handler: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(handler)
  }
  
  /**
   * 触发事件（类似 Qt 的 emit）
   */
  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }
  
  /**
   * 添加子组件
   */
  addChild(child: BaseCommand): void {
    this._children.push(child)
    child._parent = this
  }
  
  /**
   * 移除子组件
   */
  removeChild(child: BaseCommand): void {
    const index = this._children.indexOf(child)
    if (index > -1) {
      this._children.splice(index, 1)
      child._parent = undefined
    }
  }
  
  // ... 其他方法
}
```

### 1.2 组件注册系统

```typescript
// src/lib/ComponentRegistry.ts
export class ComponentRegistry {
  private static registry = new Map<string, new (...args: any[]) => BaseCommand>()
  
  /**
   * 注册组件
   */
  static register(name: string, component: new (...args: any[]) => BaseCommand): void {
    this.registry.set(name, component)
  }
  
  /**
   * 创建组件实例
   */
  static create<T extends BaseCommand>(name: string, ...args: any[]): T {
    const Component = this.registry.get(name)
    if (!Component) {
      throw new Error(`Component ${name} not found`)
    }
    return new Component(...args) as T
  }
  
  /**
   * 列出所有组件
   */
  static list(): string[] {
    return Array.from(this.registry.keys())
  }
}

// 使用
ComponentRegistry.register('Button', VueButtonCommand)
ComponentRegistry.register('Input', VueInputCommand)

const btn = ComponentRegistry.create<VueButtonCommand>('Button', '点击')
```

## 🎯 第二阶段：实现基础组件层

### 2.1 基础控件（类似 Qt 控件）

| 组件 | Qt 对应 | 状态 | 优先级 |
|------|---------|------|--------|
| Button | QPushButton | ✅ | P0 |
| Input | QLineEdit | ✅ | P0 |
| TextArea | QTextEdit | ⏳ | P0 |
| Select | QComboBox | ✅ | P0 |
| Checkbox | QCheckBox | ✅ | P1 |
| Radio | QRadioButton | ⏳ | P1 |
| Switch | QCheckBox | ✅ | P1 |
| Slider | QSlider | ⏳ | P2 |
| ProgressBar | QProgressBar | ⏳ | P2 |
| Spinner | - | ⏳ | P2 |

### 2.2 布局组件（类似 Qt 布局）

| 组件 | Qt 对应 | 状态 | 优先级 |
|------|---------|------|--------|
| VBox | QVBoxLayout | ✅ | P0 |
| HBox | QHBoxLayout | ✅ | P0 |
| Grid | QGridLayout | ✅ | P0 |
| Stack | QStackedWidget | ⏳ | P1 |
| Border | BorderLayout | ⏳ | P1 |
| Splitter | QSplitter | ✅ | P1 |

### 2.3 容器组件（类似 Qt 容器）

| 组件 | Qt 对应 | 状态 | 优先级 |
|------|---------|------|--------|
| Panel | QWidget | ⏳ | P0 |
| GroupBox | QGroupBox | ⏳ | P1 |
| Card | - | ✅ | P1 |
| TabWidget | QTabWidget | ✅ | P1 |
| ScrollArea | QScrollArea | ⏳ | P2 |
| Collapse | QCollapsibleSection | ✅ | P2 |

### 2.4 数据展示组件

| 组件 | Qt 对应 | 状态 | 优先级 |
|------|---------|------|--------|
| Table | QTableView | ⏳ | P0 |
| List | QListView | ⏳ | P1 |
| Tree | QTreeView | ✅ | P1 |
| TreeTable | QTreeWidget | ⏳ | P2 |
| Chart | QChart | ⏳ | P2 |

## 🎯 第三阶段：实现业务组件层

### 3.1 表单相关

```typescript
// FormBuilder - 动态表单构建器
export class FormBuilder extends BaseComponent {
  private fields: Field[] = []
  
  addField(field: FieldConfig): FormBuilder {
    // 动态创建字段组件
    return this
  }
  
  getValue(): FormData {
    // 收集表单值
  }
  
  validate(): boolean {
    // 验证表单
  }
}

// DataForm - 数据表格表单
export class DataForm extends BaseComponent {
  constructor(columns: Column[]) {
    // 根据 columns 自动生成表单
  }
}
```

### 3.2 表格相关

```typescript
// DataTable - 完整的数据表格
export class DataTable extends BaseComponent {
  private table: Table
  private pagination: Pagination
  private toolbar: Toolbar
  
  constructor(config: DataTableConfig) {
    // 组合多个基础组件
  }
  
  loadData(data: any[]): void {
    // 加载数据
  }
  
  on(event: 'rowClick' | 'cellClick', handler: Function): void {
    // 事件处理
  }
}

// FilterTable - 可筛选表格
export class FilterTable extends DataTable {
  // 增加筛选功能
}

// EditableTable - 可编辑表格
export class EditableTable extends DataTable {
  // 增加编辑功能
}
```

### 3.3 其他业务组件

```typescript
// FileUploader - 文件上传
export class FileUploader extends BaseComponent {
  // ...
}

// RichEditor - 富文本编辑器
export class RichEditor extends BaseComponent {
  // ...
}

// ImageViewer - 图片查看器
export class ImageViewer extends BaseComponent {
  // ...
}

// Chart - 图表组件
export class Chart extends BaseComponent {
  constructor(type: 'line' | 'bar' | 'pie', data: ChartData) {
    // ...
  }
}
```

## 📁 推荐的目录结构

```
nhai-ui-vue/
├── src/
│   ├── lib/                      # 核心基础设施
│   │   ├── BaseCommand.ts        # 基类
│   │   ├── ComponentRegistry.ts  # 组件注册
│   │   ├── EventBus.ts          # 事件总线
│   │   ├── UIHelpers.ts         # 工具函数
│   │   ├── types.ts             # 类型定义
│   │   └── index.ts
│   │
│   ├── components/               # Vue 组件（SFC）
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── commands/                 # 命令式组件
│   │   ├── basic/                # 基础组件
│   │   │   ├── ButtonCommand.ts
│   │   │   ├── InputCommand.ts
│   │   │   └── ...
│   │   ├── layout/               # 布局组件
│   │   │   ├── VBoxCommand.ts
│   │   │   ├── HBoxCommand.ts
│   │   │   └── ...
│   │   ├── container/           # 容器组件
│   │   │   ├── PanelCommand.ts
│   │   │   └── ...
│   │   └── business/            # 业务组件
│   │       ├── DataTableCommand.ts
│   │       ├── FormBuilderCommand.ts
│   │       └── ...
│   │
│   └── index.ts                  # 主入口
│
├── examples/                     # 示例
├── docs/                         # 文档
└── tests/                        # 测试
```

## 🎯 实施优先级

### P0 - 核心基础设施（1-2 周）
1. 完善 BaseCommand
2. 实现组件注册系统
3. 完善工具函数
4. 基础布局组件（VBox, HBox, Grid）

### P0 - 核心控件（2-3 周）
1. Button, Input, Select
2. Checkbox, Radio, Switch
3. Panel, Card
4. Table（基础版）

### P1 - 扩展组件（3-4 周）
1. 容器组件（TabWidget, GroupBox）
2. 数据展示（List, Tree, Chart）
3. 对话框（Dialog, MessageBox）

### P1 - 业务组件（4-6 周）
1. DataTable（完整版）
2. FormBuilder
3. FileUploader
4. 其他业务组件

### P2 - 完善（持续）
1. 文档系统
2. 示例项目
3. 性能优化
4. 测试覆盖

## 💡 下一步行动

1. **立即开始**：完成 BaseCommand 的生命周期管理
2. **本周内**：所有现有组件继承 BaseCommand
3. **两周内**：实现组件注册系统
4. **一个月内**：完成核心基础组件
5. **两个月内**：完成业务组件层

