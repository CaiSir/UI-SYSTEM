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
      className: `mdc-switch-container mdc-switch-container--${this._labelPlacement}`,
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

    // Material Design Switch外观 - 改进版
    const switchWidth = this._size === 'small' ? '34px' : '40px'
    const switchHeight = this._size === 'small' ? '20px' : '24px'
    const switchThumbSize = this._size === 'small' ? '16px' : '20px'
    const switchThumbOffset = this._size === 'small' ? '2px' : '2px'
    
    // 定义click事件处理函数
    const handleClick = (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      if (!this._disabled) {
        const target = e.currentTarget
        const trackBg = target.querySelector('.mdc-switch__track-bg')
        const thumb = target.querySelector('.mdc-switch__thumb')
        
        // 切换状态
        this._checked = !this._checked
        
        // 更新轨道背景颜色
        if (trackBg && trackBg instanceof HTMLElement) {
          trackBg.style.backgroundColor = this.getTrackColor()
          trackBg.style.opacity = this._checked ? '1' : '0.5'
        }
        
        // 更新滑块位置
        if (thumb && thumb instanceof HTMLElement) {
          const newLeft = this._checked 
            ? (this._size === 'small' ? '18px' : '20px')
            : switchThumbOffset
          thumb.style.left = newLeft
        }
        
        // 触发回调
        if (this._onChange) {
          this._onChange(this._checked)
        }
      }
    }
    
    // 轨道容器 - 更紧凑的设计
    const trackContainerProps: any = {
      className: 'mdc-switch__track-container',
      style: {
        position: 'relative',
        display: 'inline-block',
        width: switchWidth,
        height: switchHeight,
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        outline: 'none'
      }
    }
    
    // 轨道背景 - 未选中时为半透明灰色，选中时为品牌色
    const trackBgProps: any = {
      className: 'mdc-switch__track-bg',
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: this._checked ? this.getTrackColor() : 'rgba(0, 0, 0, 0.38)',
        borderRadius: '12px',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: this._checked ? 1 : 0.5
      }
    }
    
    // 滑块 - 白色圆形，有阴影
    const thumbProps: any = {
      className: 'mdc-switch__thumb',
      style: {
        position: 'absolute',
        width: switchThumbSize,
        height: switchThumbSize,
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        left: this._checked ? (this._size === 'small' ? '18px' : '20px') : switchThumbOffset,
        top: switchThumbOffset,
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2), 0 2px 2px -1px rgba(0,0,0,0.14), 0 1px 1px 0 rgba(0,0,0,0.12)',
        zIndex: 2
      }
    }
    
    // 创建switch wrapper
    const switchWrapperProps: any = {
      className: 'mdc-switch mdc-switch--' + this._color,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        outline: 'none'
      },
      onClick: handleClick
    }
    
    const trackContainer = adapter.createElement('div', trackContainerProps, [
      adapter.createElement('div', trackBgProps),
      adapter.createElement('div', thumbProps)
    ])
    
    const switchWrapper = adapter.createElement('div', switchWrapperProps, [trackContainer])
    
    children.push(switchWrapper)

    // 标签 - 使用Material Design Components的label类
    if (this._label) {
      const labelProps: any = {
        className: 'mdc-switch__label',
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
    // Material Design开关颜色系统
    const colorMap: Record<string, string> = {
      primary: '#6200ea',      // Material Deep Purple 600
      secondary: '#00acc1',    // Material Cyan 600
      default: '#424242',     // Material Grey 800
      success: '#4caf50',     // Material Green 500
      error: '#f44336',       // Material Red 500
      info: '#2196f3',        // Material Blue 500
      warning: '#ff9800'      // Material Orange 500
    }
    return colorMap[this._color] || colorMap.primary
  }
}
