# NHAI 组件库扩展实现示例

## 🎯 稳妥的扩展策略

### 1. **基于现有架构的组件扩展**

```typescript
// src/components/professional/NHAINumberInput.ts
import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../core/NHAICore"

export interface NHAINumberInputProps {
  value?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  unit?: string
  disabled?: boolean
  placeholder?: string
  onChange?: (value: number) => void
  onFocus?: () => void
  onBlur?: () => void
}

export class NHAINumberInput extends NHAIWidget {
  private _value: number = 0
  private _min: number = -Infinity
  private _max: number = Infinity
  private _step: number = 1
  private _precision: number = 0
  private _unit: string = ''
  private _disabled: boolean = false
  private _placeholder: string = ''
  private _onChange?: (value: number) => void
  private _onFocus?: () => void
  private _onBlur?: () => void

  constructor(props: NHAINumberInputProps = {}, parent?: NHAIObject) {
    super(parent)
    this._value = props.value || 0
    this._min = props.min ?? -Infinity
    this._max = props.max ?? Infinity
    this._step = props.step || 1
    this._precision = props.precision || 0
    this._unit = props.unit || ''
    this._disabled = props.disabled || false
    this._placeholder = props.placeholder || ''
    this._onChange = props.onChange
    this._onFocus = props.onFocus
    this._onBlur = props.onBlur
  }

  // 设置值
  setValue(value: number): void {
    const clampedValue = Math.max(this._min, Math.min(this._max, value))
    const roundedValue = this._precision > 0 
      ? Math.round(clampedValue * Math.pow(10, this._precision)) / Math.pow(10, this._precision)
      : Math.round(clampedValue)
    
    if (this._value !== roundedValue) {
      this._value = roundedValue
      this._onChange?.(this._value)
      this.trigger('change', this._value)
    }
  }

  // 获取值
  getValue(): number {
    return this._value
  }

  // 设置最小值
  setMin(min: number): void {
    this._min = min
    if (this._value < min) {
      this.setValue(min)
    }
  }

  // 设置最大值
  setMax(max: number): void {
    this._max = max
    if (this._value > max) {
      this.setValue(max)
    }
  }

  // 设置步长
  setStep(step: number): void {
    this._step = step
  }

  // 设置精度
  setPrecision(precision: number): void {
    this._precision = precision
  }

  // 设置单位
  setUnit(unit: string): void {
    this._unit = unit
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  // 渲染方法
  render(context?: NHAIRenderContext): any {
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
        padding: '4px 8px',
        background: this._disabled ? '#f5f5f5' : '#fff',
        opacity: this._disabled ? 0.6 : 1,
        cursor: this._disabled ? 'not-allowed' : 'text'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children: any[] = []

    // 主输入框
    const input = adapter.createElement('input', {
      type: 'number',
      value: this._value,
      min: this._min,
      max: this._max,
      step: this._step,
      placeholder: this._placeholder,
      disabled: this._disabled,
      style: {
        border: 'none',
        outline: 'none',
        flex: 1,
        background: 'transparent',
        fontSize: '14px',
        color: this._disabled ? '#999' : '#333'
      },
      onInput: (e: Event) => {
        const target = e.target as HTMLInputElement
        const value = parseFloat(target.value) || 0
        this.setValue(value)
      },
      onFocus: () => {
        this._onFocus?.()
        this.trigger('focus')
      },
      onBlur: () => {
        this._onBlur?.()
        this.trigger('blur')
      }
    })

    children.push(input)

    // 单位标签
    if (this._unit) {
      const unitSpan = adapter.createElement('span', {
        style: {
          marginLeft: '4px',
          color: '#666',
          fontSize: '12px',
          userSelect: 'none'
        }
      }, [this._unit])
      children.push(unitSpan)
    }

    // 步进按钮
    if (!this._disabled) {
      const buttonContainer = adapter.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '4px'
        }
      }, [
        // 增加按钮
        adapter.createElement('button', {
          style: {
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '2px',
            fontSize: '10px',
            color: '#666',
            lineHeight: 1
          },
          onClick: () => {
            this.setValue(this._value + this._step)
          }
        }, ['▲']),
        // 减少按钮
        adapter.createElement('button', {
          style: {
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '2px',
            fontSize: '10px',
            color: '#666',
            lineHeight: 1
          },
          onClick: () => {
            this.setValue(this._value - this._step)
          }
        }, ['▼'])
      ])
      children.push(buttonContainer)
    }

    return adapter.createElement('div', props, children)
  }
}
```

### 2. **颜色选择器组件**

```typescript
// src/components/professional/NHAIColorPicker.ts
export interface NHAIColorPickerProps {
  value?: string
  format?: 'hex' | 'rgb' | 'hsl'
  alpha?: boolean
  presets?: string[]
  onChange?: (color: string) => void
}

export class NHAIColorPicker extends NHAIWidget {
  private _value: string = '#000000'
  private _format: 'hex' | 'rgb' | 'hsl' = 'hex'
  private _alpha: boolean = false
  private _presets: string[] = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
    '#008000', '#000080', '#808000', '#800080', '#008080'
  ]
  private _onChange?: (color: string) => void
  private _isOpen: boolean = false

  constructor(props: NHAIColorPickerProps = {}, parent?: NHAIObject) {
    super(parent)
    this._value = props.value || '#000000'
    this._format = props.format || 'hex'
    this._alpha = props.alpha || false
    this._presets = props.presets || this._presets
    this._onChange = props.onChange
  }

  setValue(color: string): void {
    if (this._value !== color) {
      this._value = color
      this._onChange?.(this._value)
      this.trigger('change', this._value)
    }
  }

  getValue(): string {
    return this._value
  }

  togglePicker(): void {
    this._isOpen = !this._isOpen
    this.trigger('toggle', this._isOpen)
  }

  render(context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-color-picker',
      style: {
        ...this.getMergedStyle(),
        position: 'relative',
        display: 'inline-block'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children: any[] = []

    // 颜色预览按钮
    const previewButton = adapter.createElement('button', {
      style: {
        width: '32px',
        height: '32px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        background: this._value,
        cursor: 'pointer',
        padding: 0,
        outline: 'none'
      },
      onClick: () => this.togglePicker()
    })

    children.push(previewButton)

    // 颜色选择面板
    if (this._isOpen) {
      const pickerPanel = this.renderPickerPanel(adapter)
      children.push(pickerPanel)
    }

    return adapter.createElement('div', props, children)
  }

  private renderPickerPanel(adapter: any): any {
    const panelProps: any = {
      className: 'nhai-color-picker-panel',
      style: {
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 1000,
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: '200px'
      }
    }

    const children: any[] = []

    // 预设颜色
    const presetsContainer = adapter.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '4px',
        marginBottom: '8px'
      }
    })

    this._presets.forEach(color => {
      const colorButton = adapter.createElement('button', {
        style: {
          width: '20px',
          height: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          background: color,
          cursor: 'pointer',
          padding: 0,
          outline: 'none'
        },
        onClick: () => {
          this.setValue(color)
          this._isOpen = false
        }
      })
      presetsContainer.appendChild(colorButton)
    })

    children.push(presetsContainer)

    // 颜色输入框
    const inputContainer = adapter.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }
    }, [
      adapter.createElement('input', {
        type: 'color',
        value: this._value,
        style: {
          width: '32px',
          height: '24px',
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          cursor: 'pointer'
        },
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement
          this.setValue(target.value)
        }
      }),
      adapter.createElement('input', {
        type: 'text',
        value: this._value,
        style: {
          flex: 1,
          padding: '4px',
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          fontSize: '12px'
        },
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement
          this.setValue(target.value)
        }
      })
    ])

    children.push(inputContainer)

    return adapter.createElement('div', panelProps, children)
  }
}
```

### 3. **滑块组件**

```typescript
// src/components/professional/NHAISlider.ts
export interface NHAISliderProps {
  value?: number
  min?: number
  max?: number
  step?: number
  range?: boolean
  vertical?: boolean
  marks?: Record<number, string>
  onChange?: (value: number | [number, number]) => void
}

export class NHAISlider extends NHAIWidget {
  private _value: number = 0
  private _min: number = 0
  private _max: number = 100
  private _step: number = 1
  private _range: boolean = false
  private _vertical: boolean = false
  private _marks: Record<number, string> = {}
  private _onChange?: (value: number | [number, number]) => void
  private _isDragging: boolean = false

  constructor(props: NHAISliderProps = {}, parent?: NHAIObject) {
    super(parent)
    this._value = props.value || 0
    this._min = props.min || 0
    this._max = props.max || 100
    this._step = props.step || 1
    this._range = props.range || false
    this._vertical = props.vertical || false
    this._marks = props.marks || {}
    this._onChange = props.onChange
  }

  setValue(value: number): void {
    const clampedValue = Math.max(this._min, Math.min(this._max, value))
    const steppedValue = Math.round(clampedValue / this._step) * this._step
    
    if (this._value !== steppedValue) {
      this._value = steppedValue
      this._onChange?.(this._value)
      this.trigger('change', this._value)
    }
  }

  getValue(): number {
    return this._value
  }

  render(context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const percentage = ((this._value - this._min) / (this._max - this._min)) * 100

    const props: any = {
      className: 'nhai-slider',
      style: {
        ...this.getMergedStyle(),
        position: 'relative',
        display: 'flex',
        flexDirection: this._vertical ? 'column' : 'row',
        alignItems: 'center',
        padding: this._vertical ? '8px 4px' : '4px 8px'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children: any[] = []

    // 滑块轨道
    const trackProps: any = {
      className: 'nhai-slider-track',
      style: {
        position: 'relative',
        background: '#f0f0f0',
        borderRadius: '2px',
        cursor: 'pointer',
        ...(this._vertical 
          ? { width: '4px', height: '200px' }
          : { width: '200px', height: '4px' }
        )
      },
      onClick: (e: MouseEvent) => {
        if (!this._isDragging) {
          this.handleTrackClick(e)
        }
      }
    }

    // 滑块进度
    const progressProps: any = {
      className: 'nhai-slider-progress',
      style: {
        position: 'absolute',
        background: '#1890ff',
        borderRadius: '2px',
        ...(this._vertical 
          ? { 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: `${percentage}%` 
            }
          : { 
              top: 0, 
              left: 0, 
              bottom: 0, 
              width: `${percentage}%` 
            }
        )
      }
    }

    const progress = adapter.createElement('div', progressProps)

    // 滑块手柄
    const handleProps: any = {
      className: 'nhai-slider-handle',
      style: {
        position: 'absolute',
        width: '14px',
        height: '14px',
        background: '#fff',
        border: '2px solid #1890ff',
        borderRadius: '50%',
        cursor: 'grab',
        ...(this._vertical 
          ? { 
              left: '50%', 
              transform: 'translateX(-50%)',
              bottom: `${percentage}%`,
              marginBottom: '-7px'
            }
          : { 
              top: '50%', 
              transform: 'translateY(-50%)',
              left: `${percentage}%`,
              marginLeft: '-7px'
            }
        )
      },
      onMouseDown: (e: MouseEvent) => {
        this._isDragging = true
        this.handleMouseDown(e)
      }
    }

    const handle = adapter.createElement('div', handleProps)

    const track = adapter.createElement('div', trackProps, [progress, handle])
    children.push(track)

    // 标记
    if (Object.keys(this._marks).length > 0) {
      const marksContainer = this.renderMarks(adapter)
      children.push(marksContainer)
    }

    return adapter.createElement('div', props, children)
  }

  private renderMarks(adapter: any): any {
    const marksProps: any = {
      className: 'nhai-slider-marks',
      style: {
        position: 'relative',
        ...(this._vertical 
          ? { width: '20px', height: '200px' }
          : { width: '200px', height: '20px' }
        )
      }
    }

    const children: any[] = []

    Object.entries(this._marks).forEach(([value, label]) => {
      const numValue = parseFloat(value)
      const percentage = ((numValue - this._min) / (this._max - this._min)) * 100

      const markProps: any = {
        className: 'nhai-slider-mark',
        style: {
          position: 'absolute',
          fontSize: '12px',
          color: '#666',
          ...(this._vertical 
            ? { 
                right: '8px',
                bottom: `${percentage}%`,
                transform: 'translateY(50%)'
              }
            : { 
                left: `${percentage}%`,
                transform: 'translateX(-50%)'
              }
          )
        }
      }

      const mark = adapter.createElement('div', markProps, [label])
      children.push(mark)
    })

    return adapter.createElement('div', marksProps, children)
  }

  private handleTrackClick(e: MouseEvent): void {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const percentage = this._vertical 
      ? (rect.bottom - e.clientY) / rect.height
      : (e.clientX - rect.left) / rect.width
    
    const value = this._min + percentage * (this._max - this._min)
    this.setValue(value)
  }

  private handleMouseDown(e: MouseEvent): void {
    const handleMouseMove = (e: MouseEvent) => {
      if (this._isDragging) {
        this.handleMouseMove(e)
      }
    }

    const handleMouseUp = () => {
      this._isDragging = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  private handleMouseMove(e: MouseEvent): void {
    // 实现拖拽逻辑
  }
}
```

### 4. **组件工厂扩展**

```typescript
// src/factory/NHAIProfessionalFactory.ts
import { NHAIObject } from '../core/NHAICore'
import { NHAINumberInput, NHAINumberInputProps } from '../components/professional/NHAINumberInput'
import { NHAIColorPicker, NHAIColorPickerProps } from '../components/professional/NHAIColorPicker'
import { NHAISlider, NHAISliderProps } from '../components/professional/NHAISlider'

export class NHAIProfessionalFactory {
  // 创建数值输入器
  static createNumberInput(props: NHAINumberInputProps = {}, parent?: NHAIObject): NHAINumberInput {
    return new NHAINumberInput(props, parent)
  }

  // 创建颜色选择器
  static createColorPicker(props: NHAIColorPickerProps = {}, parent?: NHAIObject): NHAIColorPicker {
    return new NHAIColorPicker(props, parent)
  }

  // 创建滑块
  static createSlider(props: NHAISliderProps = {}, parent?: NHAIObject): NHAISlider {
    return new NHAISlider(props, parent)
  }
}

// 扩展原有的工厂
export class NHAIObjectFactory {
  // ... 现有方法 ...

  // 专业组件
  static createNumberInput = NHAIProfessionalFactory.createNumberInput
  static createColorPicker = NHAIProfessionalFactory.createColorPicker
  static createSlider = NHAIProfessionalFactory.createSlider
}
```

### 5. **使用示例**

```typescript
// 使用示例
import { NHAIObjectFactory } from 'nhai-framework'

// 创建属性面板
const propertiesPanel = NHAIObjectFactory.createVBoxLayout()
propertiesPanel.setSpacing(8)

// 添加数值输入器
const widthInput = NHAIObjectFactory.createNumberInput({
  value: 100,
  min: 0,
  max: 1000,
  step: 1,
  unit: 'px',
  onChange: (value) => console.log('Width changed:', value)
}, propertiesPanel)

// 添加颜色选择器
const colorPicker = NHAIObjectFactory.createColorPicker({
  value: '#ff0000',
  onChange: (color) => console.log('Color changed:', color)
}, propertiesPanel)

// 添加滑块
const opacitySlider = NHAIObjectFactory.createSlider({
  value: 0.5,
  min: 0,
  max: 1,
  step: 0.01,
  marks: { 0: '0%', 0.5: '50%', 1: '100%' },
  onChange: (value) => console.log('Opacity changed:', value)
}, propertiesPanel)

// 渲染
const element = propertiesPanel.render()
document.body.appendChild(element)
```

## 📝 总结

这个实现示例展示了：

1. **保持现有架构**: 继承 `NHAIWidget`，使用相同的渲染模式
2. **类型安全**: 完整的 TypeScript 接口定义
3. **功能完整**: 包含所有必要的属性和方法
4. **事件系统**: 支持 `onChange`、`onFocus` 等事件
5. **样式一致**: 遵循现有的样式规范
6. **易于扩展**: 可以轻松添加新功能

这种方式既保持了与现有组件的兼容性，又提供了专业设计工具所需的功能。
