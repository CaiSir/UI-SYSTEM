# NHAI UI 组件库扩展方案

## 📊 当前组件库现状分析

### ✅ 已有基础组件
| 组件类型 | 组件名称 | 功能状态 | 适用场景 |
|---------|---------|---------|---------|
| 按钮 | NHAIButton, NHAITextButton, ModernNHAIButton | ✅ 完整 | 通用交互 |
| 布局 | NHAIVBoxLayout, NHAIHBoxLayout, NHAIGridLayout | ✅ 完整 | 页面布局 |
| 容器 | NHAIContainer, NHAICard, NHAIWindow | ✅ 基础 | 内容包装 |
| 输入 | NHAIInput, NHAILabel | ✅ 基础 | 表单输入 |
| 动态组件 | NHAIDynamicComponents | ✅ 完整 | 动态渲染 |

### ❌ 缺失的专业组件

## 🎯 设计工具/建模编辑器必需组件

### 1. **专业输入组件** 📝
```typescript
// 优先级: 🔥🔥🔥🔥🔥 (最高)
interface ProfessionalInputComponents {
  // 数值输入器
  NumberInput: {
    min: number
    max: number
    step: number
    precision: number
    unit: string
    slider: boolean
    spinButtons: boolean
  }
  
  // 颜色选择器
  ColorPicker: {
    format: 'hex' | 'rgb' | 'hsl'
    alpha: boolean
    presets: Color[]
    customColors: Color[]
  }
  
  // 滑块组件
  Slider: {
    min: number
    max: number
    step: number
    range: boolean
    vertical: boolean
    marks: Record<number, string>
  }
  
  // 角度选择器
  AnglePicker: {
    unit: 'degrees' | 'radians'
    snap: number
    showCircle: boolean
  }
  
  // 向量输入器
  VectorInput: {
    dimensions: 2 | 3 | 4
    labels: string[]
    linked: boolean
  }
}
```

### 2. **专业面板组件** 📋
```typescript
// 优先级: 🔥🔥🔥🔥🔥 (最高)
interface ProfessionalPanelComponents {
  // 属性面板
  PropertiesPanel: {
    groups: PropertyGroup[]
    collapsible: boolean
    searchable: boolean
    sortable: boolean
  }
  
  // 工具栏
  Toolbar: {
    groups: ToolGroup[]
    orientation: 'horizontal' | 'vertical'
    collapsible: boolean
    customizable: boolean
  }
  
  // 图层面板
  LayerPanel: {
    layers: Layer[]
    dragReorder: boolean
    visibility: boolean
    locking: boolean
    grouping: boolean
  }
  
  // 材质面板
  MaterialPanel: {
    materials: Material[]
    preview: boolean
    categories: boolean
    search: boolean
  }
  
  // 时间轴
  Timeline: {
    frames: number
    currentFrame: number
    keyframes: Keyframe[]
    playback: boolean
    scrubbing: boolean
  }
}
```

### 3. **专业选择组件** 🎯
```typescript
// 优先级: 🔥🔥🔥🔥 (高)
interface ProfessionalSelectionComponents {
  // 下拉选择器
  Select: {
    options: Option[]
    multiple: boolean
    searchable: boolean
    creatable: boolean
    groupable: boolean
  }
  
  // 树形选择器
  TreeSelect: {
    treeData: TreeNode[]
    multiple: boolean
    checkable: boolean
    searchable: boolean
    expandable: boolean
  }
  
  // 标签选择器
  TagSelect: {
    tags: Tag[]
    creatable: boolean
    closable: boolean
    colorable: boolean
  }
  
  // 级联选择器
  Cascader: {
    options: CascaderOption[]
    multiple: boolean
    searchable: boolean
    changeOnSelect: boolean
  }
}
```

### 4. **专业显示组件** 📊
```typescript
// 优先级: 🔥🔥🔥 (中)
interface ProfessionalDisplayComponents {
  // 预览组件
  Preview: {
    type: 'image' | '3d' | 'video'
    zoomable: boolean
    pannable: boolean
    rotatable: boolean
    fullscreen: boolean
  }
  
  // 缩略图网格
  ThumbnailGrid: {
    items: ThumbnailItem[]
    size: number
    spacing: number
    selectable: boolean
    draggable: boolean
  }
  
  // 进度条
  Progress: {
    percent: number
    status: 'normal' | 'success' | 'exception'
    showInfo: boolean
    strokeWidth: number
  }
  
  // 状态指示器
  StatusIndicator: {
    status: 'success' | 'warning' | 'error' | 'info'
    text: string
    icon: boolean
  }
}
```

### 5. **专业交互组件** 🖱️
```typescript
// 优先级: 🔥🔥🔥🔥 (高)
interface ProfessionalInteractionComponents {
  // 拖拽列表
  DragList: {
    items: DragItem[]
    groupable: boolean
    sortable: boolean
    droppable: boolean
  }
  
  // 分割面板
  SplitPanel: {
    orientation: 'horizontal' | 'vertical'
    resizable: boolean
    minSize: number
    maxSize: number
  }
  
  // 标签页
  Tabs: {
    tabs: Tab[]
    closable: boolean
    draggable: boolean
    addable: boolean
  }
  
  // 折叠面板
  Collapse: {
    panels: CollapsePanel[]
    accordion: boolean
    ghost: boolean
  }
  
  // 抽屉
  Drawer: {
    title: string
    placement: 'top' | 'right' | 'bottom' | 'left'
    closable: boolean
    mask: boolean
  }
}
```

## 🚀 更稳妥的实现方式

### 1. **渐进式扩展策略** 📈

#### Phase 1: 基础组件完善 (2-3 周)
```typescript
// 优先补充最常用的组件
const Phase1Components = [
  'NumberInput',      // 数值输入
  'Slider',          // 滑块
  'Select',          // 下拉选择
  'Tabs',            // 标签页
  'Collapse',        // 折叠面板
  'Progress'         // 进度条
]
```

#### Phase 2: 专业组件开发 (4-6 周)
```typescript
// 设计工具专用组件
const Phase2Components = [
  'ColorPicker',     // 颜色选择器
  'PropertiesPanel', // 属性面板
  'Toolbar',         // 工具栏
  'LayerPanel',      // 图层面板
  'SplitPanel'       // 分割面板
]
```

#### Phase 3: 高级组件集成 (6-8 周)
```typescript
// 建模编辑器专用组件
const Phase3Components = [
  'VectorInput',     // 向量输入
  'AnglePicker',     // 角度选择
  'Timeline',        // 时间轴
  'MaterialPanel',   // 材质面板
  'Preview'          // 3D预览
]
```

### 2. **基于现有成熟库的封装** 🔧

#### 方案 A: Ant Design 封装 (推荐)
```typescript
// 基于 Ant Design 的专业组件封装
export class NHAIAntDesignWrapper {
  // 数值输入器
  static createNumberInput(props: NumberInputProps): NHAINumberInput {
    return new NHAINumberInput(props)
  }
  
  // 颜色选择器
  static createColorPicker(props: ColorPickerProps): NHAIColorPicker {
    return new NHAIColorPicker(props)
  }
  
  // 滑块组件
  static createSlider(props: SliderProps): NHAISlider {
    return new NHAISlider(props)
  }
}

// 具体实现
class NHAINumberInput extends NHAIWidget {
  private antdComponent: any
  
  constructor(props: NumberInputProps, parent?: NHAIObject) {
    super(parent)
    this.antdComponent = antd.InputNumber(props)
  }
  
  render(): any {
    return this.antdComponent
  }
}
```

#### 方案 B: Element Plus 封装
```typescript
// 基于 Element Plus 的专业组件封装
export class NHAIElementPlusWrapper {
  static createNumberInput(props: NumberInputProps): NHAINumberInput {
    return new NHAINumberInput(props)
  }
  
  static createColorPicker(props: ColorPickerProps): NHAIColorPicker {
    return new NHAIColorPicker(props)
  }
}
```

#### 方案 C: 自研组件 (最稳妥)
```typescript
// 完全自研的专业组件
export class NHAIProfessionalComponents {
  // 数值输入器
  static createNumberInput(props: NumberInputProps): NHAINumberInput {
    return new NHAINumberInput(props)
  }
  
  // 颜色选择器
  static createColorPicker(props: ColorPickerProps): NHAIColorPicker {
    return new NHAIColorPicker(props)
  }
}

// 自研数值输入器
class NHAINumberInput extends NHAIWidget {
  private value: number
  private min: number
  private max: number
  private step: number
  private precision: number
  private unit: string
  
  constructor(props: NumberInputProps, parent?: NHAIObject) {
    super(parent)
    this.value = props.value || 0
    this.min = props.min || -Infinity
    this.max = props.max || Infinity
    this.step = props.step || 1
    this.precision = props.precision || 0
    this.unit = props.unit || ''
  }
  
  render(): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }
    
    const props: any = {
      className: 'nhai-number-input',
      style: {
        ...this.getMergedStyle(),
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '4px 8px'
      }
    }
    
    const input = adapter.createElement('input', {
      type: 'number',
      value: this.value,
      min: this.min,
      max: this.max,
      step: this.step,
      style: {
        border: 'none',
        outline: 'none',
        flex: 1,
        background: 'transparent'
      },
      onInput: (e: Event) => {
        const target = e.target as HTMLInputElement
        this.setValue(parseFloat(target.value) || 0)
      }
    })
    
    const unitSpan = this.unit ? adapter.createElement('span', {
      style: { marginLeft: '4px', color: '#666' }
    }, [this.unit]) : null
    
    return adapter.createElement('div', props, [input, unitSpan])
  }
  
  setValue(value: number): void {
    this.value = Math.max(this.min, Math.min(this.max, value))
    this.trigger('change', this.value)
  }
  
  getValue(): number {
    return this.value
  }
}
```

### 3. **组件库架构设计** 🏗️

```typescript
// 组件库分层架构
export class NHAIComponentLibrary {
  // 基础层 - 现有组件
  static Basic = {
    Button: NHAIButton,
    TextButton: NHAITextButton,
    ModernButton: ModernNHAIButton,
    Input: NHAIInput,
    Label: NHAILabel,
    Card: NHAICard,
    Container: NHAIContainer,
    Window: NHAIWindow
  }
  
  // 布局层 - 现有布局
  static Layout = {
    VBox: NHAIVBoxLayout,
    HBox: NHAIHBoxLayout,
    Grid: NHAIGridLayout
  }
  
  // 专业层 - 新增组件
  static Professional = {
    NumberInput: NHAINumberInput,
    ColorPicker: NHAIColorPicker,
    Slider: NHAISlider,
    Select: NHAISelect,
    Tabs: NHAITabs,
    Collapse: NHAICollapse,
    Progress: NHAIProgress
  }
  
  // 设计工具层 - 专用组件
  static DesignTools = {
    PropertiesPanel: NHAIPropertiesPanel,
    Toolbar: NHAIToolbar,
    LayerPanel: NHAILayerPanel,
    MaterialPanel: NHAIMaterialPanel,
    SplitPanel: NHAISplitPanel
  }
  
  // 建模工具层 - 专用组件
  static ModelingTools = {
    VectorInput: NHAIVectorInput,
    AnglePicker: NHAIAnglePicker,
    Timeline: NHAITimeline,
    Preview: NHAIPreview,
    Viewport: NHAIViewport
  }
}
```

### 4. **具体实现示例** 💡

```typescript
// 专业属性面板组件
export class NHAIPropertiesPanel extends NHAIWidget {
  private groups: PropertyGroup[] = []
  private searchText: string = ''
  private collapsedGroups: Set<string> = new Set()
  
  constructor(parent?: NHAIObject) {
    super(parent)
  }
  
  addGroup(group: PropertyGroup): void {
    this.groups.push(group)
  }
  
  removeGroup(groupId: string): void {
    this.groups = this.groups.filter(g => g.id !== groupId)
  }
  
  setSearchText(text: string): void {
    this.searchText = text
  }
  
  toggleGroup(groupId: string): void {
    if (this.collapsedGroups.has(groupId)) {
      this.collapsedGroups.delete(groupId)
    } else {
      this.collapsedGroups.add(groupId)
    }
  }
  
  render(): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }
    
    const props: any = {
      className: 'nhai-properties-panel',
      style: {
        ...this.getMergedStyle(),
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        background: '#fff'
      }
    }
    
    const children: any[] = []
    
    // 搜索框
    if (this.searchText !== undefined) {
      const searchInput = adapter.createElement('input', {
        type: 'text',
        placeholder: '搜索属性...',
        value: this.searchText,
        style: {
          border: 'none',
          outline: 'none',
          padding: '8px',
          borderBottom: '1px solid #f0f0f0'
        },
        onInput: (e: Event) => {
          const target = e.target as HTMLInputElement
          this.setSearchText(target.value)
        }
      })
      children.push(searchInput)
    }
    
    // 属性组
    this.groups.forEach(group => {
      const groupElement = this.renderGroup(group, adapter)
      children.push(groupElement)
    })
    
    return adapter.createElement('div', props, children)
  }
  
  private renderGroup(group: PropertyGroup, adapter: any): any {
    const isCollapsed = this.collapsedGroups.has(group.id)
    
    const groupProps: any = {
      className: 'nhai-property-group',
      style: {
        borderBottom: '1px solid #f0f0f0'
      }
    }
    
    const headerProps: any = {
      className: 'nhai-property-group-header',
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        cursor: 'pointer',
        background: '#fafafa'
      },
      onClick: () => this.toggleGroup(group.id)
    }
    
    const headerChildren = [
      adapter.createElement('span', {
        style: { marginRight: '8px' }
      }, [isCollapsed ? '▶' : '▼']),
      adapter.createElement('span', {}, [group.title])
    ]
    
    const header = adapter.createElement('div', headerProps, headerChildren)
    
    const contentProps: any = {
      className: 'nhai-property-group-content',
      style: {
        display: isCollapsed ? 'none' : 'block',
        padding: '8px'
      }
    }
    
    const contentChildren = group.properties.map(prop => 
      this.renderProperty(prop, adapter)
    )
    
    const content = adapter.createElement('div', contentProps, contentChildren)
    
    return adapter.createElement('div', groupProps, [header, content])
  }
  
  private renderProperty(property: Property, adapter: any): any {
    const propProps: any = {
      className: 'nhai-property',
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '4px'
      }
    }
    
    const label = adapter.createElement('span', {
      style: { width: '100px', fontSize: '12px' }
    }, [property.label])
    
    let input: any
    switch (property.type) {
      case 'number':
        input = adapter.createElement('input', {
          type: 'number',
          value: property.value,
          style: { flex: 1, padding: '2px 4px' },
          onInput: (e: Event) => {
            const target = e.target as HTMLInputElement
            property.value = parseFloat(target.value) || 0
            property.onChange?.(property.value)
          }
        })
        break
      case 'color':
        input = adapter.createElement('input', {
          type: 'color',
          value: property.value,
          style: { flex: 1, height: '24px' },
          onChange: (e: Event) => {
            const target = e.target as HTMLInputElement
            property.value = target.value
            property.onChange?.(property.value)
          }
        })
        break
      case 'boolean':
        input = adapter.createElement('input', {
          type: 'checkbox',
          checked: property.value,
          onChange: (e: Event) => {
            const target = e.target as HTMLInputElement
            property.value = target.checked
            property.onChange?.(property.value)
          }
        })
        break
      default:
        input = adapter.createElement('input', {
          type: 'text',
          value: property.value,
          style: { flex: 1, padding: '2px 4px' },
          onInput: (e: Event) => {
            const target = e.target as HTMLInputElement
            property.value = target.value
            property.onChange?.(property.value)
          }
        })
    }
    
    return adapter.createElement('div', propProps, [label, input])
  }
}

// 属性组接口
interface PropertyGroup {
  id: string
  title: string
  properties: Property[]
}

// 属性接口
interface Property {
  id: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'select'
  value: any
  onChange?: (value: any) => void
}
```

## 📋 实施建议

### 1. **优先级排序**
1. **NumberInput** - 最常用，实现简单
2. **Slider** - 设计工具必需
3. **ColorPicker** - 设计工具必需
4. **Select** - 通用性强
5. **Tabs** - 界面组织必需
6. **PropertiesPanel** - 设计工具核心

### 2. **技术选型建议**
- **短期**: 基于 Ant Design 封装 (快速上线)
- **中期**: 自研核心组件 (可控性)
- **长期**: 混合方案 (最佳体验)

### 3. **开发策略**
- **MVP 优先**: 先实现最核心的 5-6 个组件
- **渐进增强**: 逐步添加高级功能
- **向后兼容**: 保持现有 API 稳定
- **文档完善**: 提供详细的使用示例

## 📝 总结

要支撑设计工具和建模编辑器，NHAI 组件库需要：

1. **补充 15-20 个专业组件**
2. **采用渐进式扩展策略**
3. **优先基于成熟库封装**
4. **逐步自研核心组件**

这样既能快速满足需求，又能保持长期的技术可控性。
