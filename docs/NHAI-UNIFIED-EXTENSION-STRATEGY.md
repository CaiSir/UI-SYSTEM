# NHAI 组件库扩展策略 - 统一方案

## 🤔 策略冲突分析

### 之前的矛盾建议
1. **推荐成熟库封装** → 快速上线，减少开发成本
2. **推荐自研组件** → 可控性强，定制化程度高

这确实是矛盾的！让我提供一个**统一、分阶段**的策略。

## 🎯 统一的扩展策略

### **核心原则：渐进式 + 混合式**

```typescript
// 统一的组件库架构
export class NHAIComponentLibrary {
  // 第1层：基础组件（现有）
  static Basic = {
    Button: NHAIButton,
    Input: NHAIInput,
    Label: NHAILabel,
    Card: NHAICard,
    Container: NHAIContainer,
    Window: NHAIWindow
  }
  
  // 第2层：封装组件（基于成熟库）
  static Wrapped = {
    NumberInput: NHAINumberInput,      // 基于 Ant Design
    ColorPicker: NHAIColorPicker,      // 基于 Ant Design
    Slider: NHAISlider,                // 基于 Ant Design
    Select: NHAISelect,                // 基于 Ant Design
    Tabs: NHAITabs                     // 基于 Ant Design
  }
  
  // 第3层：自研组件（核心业务）
  static Professional = {
    PropertiesPanel: NHAIPropertiesPanel,  // 完全自研
    Toolbar: NHAIToolbar,                   // 完全自研
    LayerPanel: NHAILayerPanel,            // 完全自研
    MaterialPanel: NHAIMaterialPanel       // 完全自研
  }
}
```

## 📋 分阶段实施计划

### **Phase 1: 快速封装（2-3周）**
**目标**: 快速获得基础专业组件
**策略**: 基于 Ant Design 封装

```typescript
// 封装策略示例
export class NHAIAntDesignWrapper {
  // 数值输入器 - 基于 antd.InputNumber
  static createNumberInput(props: NumberInputProps): NHAINumberInput {
    return new NHAINumberInput(props)
  }
  
  // 颜色选择器 - 基于 antd.ColorPicker
  static createColorPicker(props: ColorPickerProps): NHAIColorPicker {
    return new NHAIColorPicker(props)
  }
  
  // 滑块 - 基于 antd.Slider
  static createSlider(props: SliderProps): NHAISlider {
    return new NHAISlider(props)
  }
}

// 具体实现
class NHAINumberInput extends NHAIWidget {
  private antdComponent: any
  
  constructor(props: NumberInputProps, parent?: NHAIObject) {
    super(parent)
    // 创建 Ant Design 组件
    this.antdComponent = antd.InputNumber({
      value: props.value,
      min: props.min,
      max: props.max,
      step: props.step,
      onChange: (value: number) => {
        props.onChange?.(value)
        this.trigger('change', value)
      }
    })
  }
  
  render(): any {
    // 返回 Ant Design 组件
    return this.antdComponent
  }
  
  // NHAI 标准接口
  setValue(value: number): void {
    this.antdComponent.setValue(value)
  }
  
  getValue(): number {
    return this.antdComponent.getValue()
  }
}
```

**优势**:
- ✅ 快速上线（2-3周）
- ✅ 功能完整（Ant Design 已成熟）
- ✅ 样式统一（Ant Design 设计规范）
- ✅ 维护成本低（跟随 Ant Design 更新）

**劣势**:
- ❌ 依赖外部库
- ❌ 定制化程度有限
- ❌ 包体积增加

### **Phase 2: 核心自研（4-6周）**
**目标**: 自研设计工具核心组件
**策略**: 完全自研，深度定制

```typescript
// 自研策略示例
export class NHAIPropertiesPanel extends NHAIWidget {
  private groups: PropertyGroup[] = []
  private searchText: string = ''
  private collapsedGroups: Set<string> = new Set()
  
  constructor(parent?: NHAIObject) {
    super(parent)
  }
  
  // 完全自研的属性面板逻辑
  addGroup(group: PropertyGroup): void {
    this.groups.push(group)
  }
  
  render(): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }
    
    // 完全自定义的渲染逻辑
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
    
    // 属性组
    this.groups.forEach(group => {
      const groupElement = this.renderGroup(group, adapter)
      children.push(groupElement)
    })
    
    return adapter.createElement('div', props, children)
  }
  
  // 自定义的属性组渲染
  private renderGroup(group: PropertyGroup, adapter: any): any {
    // 完全自定义的实现
    // ...
  }
}
```

**优势**:
- ✅ 完全可控
- ✅ 深度定制
- ✅ 无外部依赖
- ✅ 性能最优

**劣势**:
- ❌ 开发周期长
- ❌ 维护成本高
- ❌ 需要大量测试

### **Phase 3: 混合优化（2-3周）**
**目标**: 优化整体架构，提供统一接口
**策略**: 混合使用，统一管理

```typescript
// 统一接口设计
export class NHAIComponentFactory {
  // 统一的创建接口
  static createNumberInput(props: NumberInputProps): NHAINumberInput {
    // 根据配置选择实现方式
    if (props.useAntd !== false) {
      return NHAIAntDesignWrapper.createNumberInput(props)
    } else {
      return NHAISelfDeveloped.createNumberInput(props)
    }
  }
  
  static createColorPicker(props: ColorPickerProps): NHAIColorPicker {
    if (props.useAntd !== false) {
      return NHAIAntDesignWrapper.createColorPicker(props)
    } else {
      return NHAISelfDeveloped.createColorPicker(props)
    }
  }
  
  // 设计工具专用组件（强制自研）
  static createPropertiesPanel(props: PropertiesPanelProps): NHAIPropertiesPanel {
    return new NHAIPropertiesPanel(props)
  }
  
  static createToolbar(props: ToolbarProps): NHAIToolbar {
    return new NHAIToolbar(props)
  }
}
```

## 🎯 具体实施建议

### **推荐方案：混合策略**

```typescript
// 1. 基础组件 - 封装成熟库
const BasicComponents = [
  'NumberInput',    // 基于 Ant Design
  'ColorPicker',    // 基于 Ant Design  
  'Slider',         // 基于 Ant Design
  'Select',         // 基于 Ant Design
  'Tabs'            // 基于 Ant Design
]

// 2. 专业组件 - 完全自研
const ProfessionalComponents = [
  'PropertiesPanel',  // 设计工具核心
  'Toolbar',          // 设计工具核心
  'LayerPanel',       // 设计工具核心
  'MaterialPanel',    // 设计工具核心
  'SplitPanel'        // 设计工具核心
]

// 3. 高级组件 - 根据需要选择
const AdvancedComponents = [
  'VectorInput',      // 建模工具专用
  'Timeline',         // 建模工具专用
  'Preview'           // 建模工具专用
]
```

### **技术实现**

```typescript
// 统一的组件接口
interface NHAIComponentProps {
  // 通用属性
  id?: string
  className?: string
  style?: Record<string, any>
  disabled?: boolean
  
  // 实现方式选择
  useAntd?: boolean  // 是否使用 Ant Design
  
  // 事件
  onChange?: (value: any) => void
  onFocus?: () => void
  onBlur?: () => void
}

// 统一的组件基类
abstract class NHAIComponent<T extends NHAIComponentProps> extends NHAIWidget {
  protected props: T
  
  constructor(props: T, parent?: NHAIObject) {
    super(parent)
    this.props = props
  }
  
  // 抽象方法
  abstract render(): any
  abstract setValue(value: any): void
  abstract getValue(): any
  
  // 通用方法
  setDisabled(disabled: boolean): void {
    this.props.disabled = disabled
  }
  
  getDisabled(): boolean {
    return this.props.disabled || false
  }
}
```

## 📊 成本效益分析

| 方案 | 开发时间 | 维护成本 | 定制性 | 稳定性 | 推荐度 |
|------|----------|----------|--------|--------|--------|
| 纯封装 | 2-3周 | 低 | 低 | 高 | ⭐⭐⭐ |
| 纯自研 | 8-12周 | 高 | 高 | 中 | ⭐⭐ |
| **混合策略** | **4-6周** | **中** | **高** | **高** | **⭐⭐⭐⭐⭐** |

## 🚀 最终推荐

### **采用混合策略**

1. **Phase 1 (2-3周)**: 封装 Ant Design 基础组件
   - NumberInput, ColorPicker, Slider, Select, Tabs

2. **Phase 2 (4-6周)**: 自研设计工具核心组件
   - PropertiesPanel, Toolbar, LayerPanel, MaterialPanel

3. **Phase 3 (2-3周)**: 统一接口，优化架构
   - 提供统一的创建接口
   - 支持实现方式切换

### **核心优势**

- ✅ **快速上线**: Phase 1 就能获得基础功能
- ✅ **深度定制**: Phase 2 的核心组件完全可控
- ✅ **灵活切换**: 可以根据需要选择实现方式
- ✅ **统一接口**: 用户无需关心底层实现
- ✅ **渐进升级**: 可以逐步替换封装组件为自研组件

这样既解决了快速上线的需求，又保证了长期的可控性和定制性！
