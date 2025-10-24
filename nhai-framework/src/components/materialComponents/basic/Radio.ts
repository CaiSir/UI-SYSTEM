import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material Radio 组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialRadio extends NHAIWidget {
  private _checked: boolean = false                                                                               // 是否选中
  private _disabled: boolean = false                                                                              // 是否禁用
  private _required: boolean = false                                                                              // 是否必填
  private _size: 'small' | 'medium' = 'medium'                                                                    // 大小：小、中
  private _color: 'primary' | 'secondary' | 'default' = 'primary'                                                 // 颜色：主要、次要、默认
  private _label: string = ''                                                                                     // 标签文本
  private _labelPlacement: 'end' | 'start' | 'top' | 'bottom' = 'end'                                            // 标签位置：结束、开始、顶部、底部
  private _name: string = ''                                                                                     // 组名（用于分组）
  private _value: string | number = ''                                                                            // 单选框值
  private _onChange?: (checked: boolean, value: string | number) => void                                         // 变化回调函数

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置选中状态
  setChecked(checked: boolean): void {
    this._checked = checked
  }

  checked(): boolean {
    return this._checked
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置必填
  setRequired(required: boolean): void {
    this._required = required
  }

  required(): boolean {
    return this._required
  }

  // 设置大小
  setSize(size: 'small' | 'medium'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置颜色
  setColor(color: 'primary' | 'secondary' | 'default'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置标签
  setLabel(label: string): void {
    this._label = label
  }

  label(): string {
    return this._label
  }

  // 设置标签位置
  setLabelPlacement(placement: 'end' | 'start' | 'top' | 'bottom'): void {
    this._labelPlacement = placement
  }

  labelPlacement(): string {
    return this._labelPlacement
  }

  // 设置名称（用于分组）
  setName(name: string): void {
    this._name = name
  }

  name(): string {
    return this._name
  }

  // 设置值
  setValue(value: string | number): void {
    this._value = value
  }

  value(): string | number {
    return this._value
  }

  // 设置变化事件
  setOnChange(handler: (checked: boolean, value: string | number) => void): void {
    this._onChange = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-radio-container mui-radio-container--${this._labelPlacement}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        alignItems: 'center',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        opacity: this._disabled ? 0.6 : 1
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 单选框
    const radioProps: any = {
      className: `mui-radio mui-radio--${this._size} mui-radio--${this._color}`,
      style: {
        width: this._size === 'small' ? '16px' : '20px',
        height: this._size === 'small' ? '16px' : '20px',
        border: this.getBorderStyle(),
        borderRadius: '50%',
        backgroundColor: this.getBackgroundColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        position: 'relative'
      },
      type: 'radio',
      checked: this._checked,
      disabled: this._disabled,
      required: this._required,
      name: this._name,
      value: this._value
    }

    if (this._onChange) {
      radioProps.onChange = (e: any) => this._onChange!(e.target.checked, e.target.value)
    }

    // 单选框图标
    const iconSize = this._size === 'small' ? '8px' : '10px'
    const radioIcon = adapter.createElement('div', { 
      style: { 
        width: iconSize,
        height: iconSize,
        backgroundColor: this._checked ? '#ffffff' : 'transparent',
        borderRadius: '50%',
        display: this._checked ? 'block' : 'none'
      } 
    }, [])

    radioProps.children = [radioIcon]
    children.push(adapter.createElement('input', radioProps))

    // 标签
    if (this._label) {
      const labelProps: any = {
        className: 'mui-radio-label',
        style: {
          fontSize: this._size === 'small' ? '0.875rem' : '1rem',
          color: 'rgba(0, 0, 0, 0.87)',
          marginLeft: this._labelPlacement === 'end' ? '8px' : '0',
          marginRight: this._labelPlacement === 'start' ? '8px' : '0',
          marginTop: this._labelPlacement === 'bottom' ? '4px' : '0',
          marginBottom: this._labelPlacement === 'top' ? '4px' : '0',
          fontWeight: '400',
          cursor: this._disabled ? 'not-allowed' : 'pointer'
        }
      }
      children.push(adapter.createElement('label', labelProps, [this._label]))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getBorderStyle(): string {
    const color = this.getColorValue()
    return `2px solid ${this._checked ? color : 'rgba(0, 0, 0, 0.54)'}`
  }

  private getBackgroundColor(): string {
    return this._checked ? this.getColorValue() : 'transparent'
  }

  private getColorValue(): string {
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      default: '#000000'
    }
    return colorMap[this._color] || colorMap.primary
  }
}
