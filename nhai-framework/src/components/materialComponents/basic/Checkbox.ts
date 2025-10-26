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
      className: `mdc-form-field mdc-form-field--align-${this._labelPlacement === 'end' ? 'end' : 'start'}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'inline-flex',
        alignItems: 'center',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        opacity: this._disabled ? 0.6 : 1
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 复选框外观框 - Material Design标准样式，添加动画
    const checkboxSize = this._size === 'small' ? '18px' : '20px'
    const checkboxBoxProps: any = {
      className: `mdc-checkbox mdc-checkbox mdc-checkbox--${this._color}`,
      style: {
        width: checkboxSize,
        height: checkboxSize,
        border: this.getBorderStyle(),
        borderRadius: '2px',
        backgroundColor: this.getBackgroundColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms, background-color 200ms',
        flexShrink: 0,
        position: 'relative',
        outline: 'none',
        // Material Design elevation
        boxShadow: this._checked || this._indeterminate 
          ? '0px 2px 4px rgba(0,0,0,0.2), 0px 1px 2px rgba(0,0,0,0.14)'
          : 'none',
        // 添加hover效果
        ':hover': {
          borderColor: this._checked || this._indeterminate ? this.getColorValue() : 'rgba(0, 0, 0, 0.87)'
        }
      }
    }

    // 复选框图标 - 添加缩放动画
    const iconSize = this._size === 'small' ? '14px' : '16px'
    const iconStyle = {
      width: iconSize,
      height: iconSize,
      color: '#ffffff',
      transition: 'opacity 150ms cubic-bezier(0.4, 0, 1, 1), transform 150ms cubic-bezier(0.4, 0, 1, 1)',
      opacity: this._checked || this._indeterminate ? 1 : 0,
      transform: this._checked || this._indeterminate ? 'scale(1)' : 'scale(0)',
      pointerEvents: 'none'
    }

    const checkboxIcon = this._indeterminate 
      ? adapter.createElement('div', { 
          className: 'mdc-checkbox__indeterminate',
          style: { 
            ...iconStyle, 
            backgroundColor: this.getColorValue(),
            borderRadius: '1px'
          } 
        }, [])
      : adapter.createElement('svg', { 
          className: 'mdc-checkbox__checkmark',
          style: iconStyle, 
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          xmlns: 'http://www.w3.org/2000/svg'
        }, [
          adapter.createElement('polyline', { points: '20,6 9,17 4,12' }, [])
        ])

    // 复选框按钮 (隐藏的input)
    const checkboxButtonProps: any = {
      type: 'checkbox',
      checked: this._checked,
      disabled: this._disabled,
      required: this._required,
      indeterminate: this._indeterminate,
      style: {
        position: 'absolute',
        opacity: 0,
        width: checkboxSize,
        height: checkboxSize,
        margin: 0,
        padding: 0,
        cursor: this._disabled ? 'not-allowed' : 'pointer'
      },
      onClick: (e: any) => {
        e.stopPropagation()
        if (!this._disabled) {
          this._checked = !this._checked
          if (this._onChange) {
            this._onChange(this._checked)
          }
        }
      }
    }

    if (this._onChange) {
      checkboxButtonProps.onChange = (e: any) => {
        if (!this._disabled && this._onChange) {
          this._checked = e.target.checked
          this._onChange(e.target.checked)
        }
      }
    }

    // 定义点击处理函数
    const handleClick = (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!this._disabled) {
        // 切换状态
        this._checked = !this._checked
        
        // 获取wrapper元素
        const wrapper = e.currentTarget || e.target.parentElement
        
        // 更新checkbox框的背景和图标
        const checkboxBox = wrapper?.querySelector('.mdc-checkbox')
        const checkboxIcon = wrapper?.querySelector('.mdc-checkbox__checkmark') || wrapper?.querySelector('.mdc-checkbox__indeterminate')
        
        if (checkboxBox && checkboxBox instanceof HTMLElement) {
          checkboxBox.style.backgroundColor = this._checked ? this.getBackgroundColor() : 'transparent'
          checkboxBox.style.border = this.getBorderStyle()
          checkboxBox.style.boxShadow = this._checked 
            ? '0px 2px 4px rgba(0,0,0,0.2), 0px 1px 2px rgba(0,0,0,0.14)' 
            : 'none'
        }
        
        if (checkboxIcon && checkboxIcon instanceof HTMLElement) {
          checkboxIcon.style.display = this._checked ? 'block' : 'none'
        }
        
        // 更新input状态
        const input = wrapper?.querySelector('input[type="checkbox"]')
        if (input) {
          (input as HTMLInputElement).checked = this._checked
        }
        
        // 触发回调
        if (this._onChange) {
          this._onChange(this._checked)
        }
      }
    }
    
    const handleMouseDown = (e: any) => {
      const target = e.currentTarget || e.target
      if (target && target.style) {
        target.style.transform = 'scale(0.95)'
        setTimeout(() => {
          if (target && target.style) {
            target.style.transform = 'scale(1)'
          }
        }, 150)
      }
    }
    
    const handleMouseUp = (e: any) => {
      const target = e.currentTarget || e.target
      if (target && target.style) {
        target.style.transform = 'scale(1)'
      }
    }
    
    // 创建复选框容器（包含input和视觉盒子）
    const checkboxWrapperProps: any = {
      className: 'mdc-checkbox-wrapper',
      style: {
        position: 'relative',
        display: 'inline-block',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        transition: 'transform 150ms cubic-bezier(0.4, 0, 1, 1)'
      }
    }
    
    // 添加事件处理
    if (!this._disabled) {
      checkboxWrapperProps.onClick = handleClick
      checkboxWrapperProps.onMouseDown = handleMouseDown
      checkboxWrapperProps.onMouseUp = handleMouseUp
      checkboxWrapperProps.onMouseLeave = handleMouseUp
    }
    
    const checkboxWrapper = adapter.createElement('div', checkboxWrapperProps, [
      adapter.createElement('input', checkboxButtonProps),
      adapter.createElement('div', checkboxBoxProps, [checkboxIcon])
    ])
    
    children.push(checkboxWrapper)

    // 标签 - 使用Material Design Components的label类
    if (this._label) {
      const labelProps: any = {
        className: 'mdc-checkbox__label',
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
    // Material Design checkbox: 未选中时显示边框
    if (this._checked || this._indeterminate) {
      return 'none'
    }
    return '2px solid rgba(0, 0, 0, 0.54)'
  }

  private getBackgroundColor(): string {
    // Material Design checkbox: 选中时显示彩色背景
    if (this._checked || this._indeterminate) {
      return this.getColorValue()
    }
    return 'transparent'
  }

  private getColorValue(): string {
    // Material Design颜色系统
    const colorMap: Record<string, string> = {
      primary: '#1976d2',      // Material Blue 700
      secondary: '#dc004e',    // Material Pink 500
      default: '#6200ea'        // Material Purple
    }
    return colorMap[this._color] || colorMap.primary
  }

  private getRippleColor(): string {
    // Material Design ripple效果颜色
    const colorMap: Record<string, string> = {
      primary: 'rgba(25, 118, 210, 0.26)',
      secondary: 'rgba(220, 0, 78, 0.26)',
      default: 'rgba(98, 0, 234, 0.26)'
    }
    return colorMap[this._color] || colorMap.primary
  }

  private getFocusColor(): string {
    // Material Design focus效果颜色
    const colorMap: Record<string, string> = {
      primary: 'rgba(25, 118, 210, 0.12)',
      secondary: 'rgba(220, 0, 78, 0.12)',
      default: 'rgba(98, 0, 234, 0.12)'
    }
    return colorMap[this._color] || colorMap.primary
  }
}
