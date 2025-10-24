import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material Checkbox 组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialCheckbox extends NHAIWidget {
  private _checked: boolean = false                    // 是否选中
  private _indeterminate: boolean = false              // 是否处于不确定状态
  private _disabled: boolean = false                   // 是否禁用
  private _required: boolean = false                   // 是否必填
  private _size: 'small' | 'medium' = 'medium'         // 大小：小、中
  private _color: 'primary' | 'secondary' | 'default' = 'primary'  // 颜色：主要、次要、默认
  private _label: string = ''                          // 标签文本
  private _labelPlacement: 'end' | 'start' | 'top' | 'bottom' = 'end'  // 标签位置：结束、开始、顶部、底部
  private _onChange?: (checked: boolean) => void       // 变化回调函数

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

  // 设置不确定状态
  setIndeterminate(indeterminate: boolean): void {
    this._indeterminate = indeterminate
  }

  indeterminate(): boolean {
    return this._indeterminate
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

  // 设置变化事件
  setOnChange(handler: (checked: boolean) => void): void {
    this._onChange = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-checkbox-container mui-checkbox-container--${this._labelPlacement}`,
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

    // 复选框
    const checkboxProps: any = {
      className: `mui-checkbox mui-checkbox--${this._size} mui-checkbox--${this._color}`,
      style: {
        width: this._size === 'small' ? '16px' : '20px',
        height: this._size === 'small' ? '16px' : '20px',
        border: this.getBorderStyle(),
        borderRadius: '2px',
        backgroundColor: this.getBackgroundColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        position: 'relative'
      },
      type: 'checkbox',
      checked: this._checked,
      disabled: this._disabled,
      required: this._required
    }

    if (this._onChange) {
      checkboxProps.onChange = (e: any) => this._onChange!(e.target.checked)
    }

    // 复选框图标
    const iconStyle = {
      width: this._size === 'small' ? '12px' : '16px',
      height: this._size === 'small' ? '12px' : '16px',
      color: '#ffffff',
      display: this._checked || this._indeterminate ? 'block' : 'none'
    }

    const checkboxIcon = this._indeterminate 
      ? adapter.createElement('div', { 
          style: { 
            ...iconStyle, 
            backgroundColor: this.getColorValue(),
            borderRadius: '1px'
          } 
        }, [])
      : adapter.createElement('svg', { 
          style: iconStyle, 
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }, [
          adapter.createElement('polyline', { points: '20,6 9,17 4,12' }, [])
        ])

    checkboxProps.children = [checkboxIcon]
    children.push(adapter.createElement('input', checkboxProps))

    // 标签
    if (this._label) {
      const labelProps: any = {
        className: 'mui-checkbox-label',
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
    if (this._checked || this._indeterminate) {
      return 'none'
    }
    return '2px solid rgba(0, 0, 0, 0.54)'
  }

  private getBackgroundColor(): string {
    if (this._checked || this._indeterminate) {
      return this.getColorValue()
    }
    return 'transparent'
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
