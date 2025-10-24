import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Tag 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialTag extends NHAIWidget {
  private _text: string = ''
  private _color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' = 'default'
  private _variant: 'filled' | 'outlined' = 'filled'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _closable: boolean = false
  private _disabled: boolean = false
  private _onClose?: () => void
  private _onClick?: () => void

  constructor(text: string = '', parent?: NHAIObject) {
    super(parent)
    this._text = text
  }

  // 设置文本
  setText(text: string): void {
    this._text = text
  }

  text(): string {
    return this._text
  }

  // 设置颜色
  setColor(color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置变体
  setVariant(variant: 'filled' | 'outlined'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置可关闭
  setClosable(closable: boolean): void {
    this._closable = closable
  }

  closable(): boolean {
    return this._closable
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置关闭事件
  setOnClose(handler: () => void): void {
    this._onClose = handler
  }

  // 设置点击事件
  setOnClick(handler: () => void): void {
    this._onClick = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const tagProps: any = {
      className: `mui-tag mui-tag--${this._variant} mui-tag--${this._color} mui-tag--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: this.getPadding(),
        borderRadius: '16px',
        fontSize: this.getFontSize(),
        fontWeight: '500',
        cursor: this._disabled ? 'not-allowed' : (this._onClick ? 'pointer' : 'default'),
        opacity: this._disabled ? 0.6 : 1,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: this.getBackgroundColor(),
        color: this.getTextColor(),
        border: this.getBorder(),
        ...this.getSizeStyles()
      }
    }

    if (this._id) tagProps.id = this._id
    if (this._className) tagProps.className += ` ${this._className}`
    if (this._onClick && !this._disabled) tagProps.onClick = this._onClick

    const children = []

    // 文本
    children.push(this._text)

    // 关闭按钮
    if (this._closable) {
      const closeProps: any = {
        className: 'mui-tag-close',
        style: {
          marginLeft: '4px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          color: this.getTextColor(),
          transition: 'background-color 0.2s ease-in-out'
        }
      }

      closeProps.onClick = (e: any) => {
        e.stopPropagation()
        if (this._onClose) {
          this._onClose()
        }
      }

      closeProps.children = ['×']
      children.push(adapter.createElement('span', closeProps))
    }

    return adapter.createElement('span', tagProps, children)
  }

  private getPadding(): string {
    const paddingMap: Record<string, string> = {
      small: '2px 8px',
      medium: '4px 12px',
      large: '6px 16px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.75rem',
      medium: '0.875rem',
      large: '1rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getSizeStyles(): Record<string, any> {
    const sizeMap: Record<string, Record<string, any>> = {
      small: {
        minHeight: '20px',
        maxHeight: '20px'
      },
      medium: {
        minHeight: '24px',
        maxHeight: '24px'
      },
      large: {
        minHeight: '28px',
        maxHeight: '28px'
      }
    }
    
    return sizeMap[this._size] || sizeMap.medium
  }

  private getBackgroundColor(): string {
    if (this._variant === 'outlined') {
      return 'transparent'
    }

    const colorMap: Record<string, string> = {
      default: '#f5f5f5',
      primary: '#e3f2fd',
      secondary: '#fce4ec',
      success: '#e8f5e8',
      error: '#ffebee',
      info: '#e0f2f1',
      warning: '#fff3e0'
    }
    return colorMap[this._color] || colorMap.default
  }

  private getTextColor(): string {
    if (this._variant === 'outlined') {
      const colorMap: Record<string, string> = {
        default: 'rgba(0, 0, 0, 0.87)',
        primary: '#1976d2',
        secondary: '#dc004e',
        success: '#2e7d32',
        error: '#d32f2f',
        info: '#0288d1',
        warning: '#ed6c02'
      }
      return colorMap[this._color] || colorMap.default
    }

    const colorMap: Record<string, string> = {
      default: 'rgba(0, 0, 0, 0.87)',
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      error: '#d32f2f',
      info: '#0288d1',
      warning: '#ed6c02'
    }
    return colorMap[this._color] || colorMap.default
  }

  private getBorder(): string {
    if (this._variant === 'outlined') {
      const colorMap: Record<string, string> = {
        default: '1px solid rgba(0, 0, 0, 0.23)',
        primary: '1px solid #1976d2',
        secondary: '1px solid #dc004e',
        success: '1px solid #2e7d32',
        error: '1px solid #d32f2f',
        info: '1px solid #0288d1',
        warning: '1px solid #ed6c02'
      }
      return colorMap[this._color] || colorMap.default
    }
    return 'none'
  }
}
