import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material Switch 组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialSwitch extends NHAIWidget {
  private _checked: boolean = false                                                                               // 是否选中
  private _disabled: boolean = false                                                                              // 是否禁用
  private _required: boolean = false                                                                              // 是否必填
  private _size: 'small' | 'medium' = 'medium'                                                                    // 大小：小、中
  private _color: 'primary' | 'secondary' | 'default' | 'success' | 'error' | 'info' | 'warning' = 'primary'     // 颜色：主要、次要、默认、成功、错误、信息、警告
  private _label: string = ''                                                                                     // 标签文本
  private _labelPlacement: 'end' | 'start' | 'top' | 'bottom' = 'end'                                            // 标签位置：结束、开始、顶部、底部
  private _onChange?: (checked: boolean) => void                                                                  // 变化回调函数

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
  setColor(color: 'primary' | 'secondary' | 'default' | 'success' | 'error' | 'info' | 'warning'): void {
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
      className: `mui-switch-container mui-switch-container--${this._labelPlacement}`,
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

    // 开关容器
    const switchProps: any = {
      className: `mui-switch mui-switch--${this._size} mui-switch--${this._color}`,
      style: {
        width: this._size === 'small' ? '34px' : '42px',
        height: this._size === 'small' ? '20px' : '26px',
        backgroundColor: this.getTrackColor(),
        borderRadius: '13px',
        position: 'relative',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        padding: '2px'
      }
    }

    if (this._onChange) {
      switchProps.onClick = () => {
        if (!this._disabled) {
          this._checked = !this._checked
          this._onChange!(this._checked)
        }
      }
    }

    // 开关按钮
    const thumbSize = this._size === 'small' ? '16px' : '22px'
    const thumbProps: any = {
      className: 'mui-switch-thumb',
      style: {
        width: thumbSize,
        height: thumbSize,
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        position: 'absolute',
        left: this._checked ? (this._size === 'small' ? '18px' : '22px') : '2px',
        transition: 'left 0.2s ease-in-out',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }
    }

    switchProps.children = [adapter.createElement('div', thumbProps)]
    children.push(adapter.createElement('div', switchProps))

    // 标签
    if (this._label) {
      const labelProps: any = {
        className: 'mui-switch-label',
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

  private getTrackColor(): string {
    if (this._checked) {
      const colorMap: Record<string, string> = {
        primary: '#1976d2',
        secondary: '#dc004e',
        default: '#000000',
        success: '#2e7d32',
        error: '#d32f2f',
        info: '#0288d1',
        warning: '#ed6c02'
      }
      return colorMap[this._color] || colorMap.primary
    }
    return 'rgba(0, 0, 0, 0.26)'
  }
}
