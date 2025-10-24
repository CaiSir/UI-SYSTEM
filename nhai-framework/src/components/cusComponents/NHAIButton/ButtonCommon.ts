import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../../core/NHAICore"

// 按钮组件
export class NHAIButton extends NHAIWidget {
    private _text: string = ''
    private _variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary'
    private _size: 'small' | 'medium' | 'large' = 'medium'
    private _onClick?: () => void
  
    constructor(text: string = '', parent?: NHAIObject) {
      super(parent)
      this._text = text
    }
  
    setText(text: string): void {
      this._text = text
    }
  
    text(): string {
      return this._text
    }
  
    setVariant(variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'): void {
      this._variant = variant
    }
  
    variant(): string {
      return this._variant
    }
  
    setSize(size: 'small' | 'medium' | 'large'): void {
      this._size = size
    }
  
    size(): string {
      return this._size
    }
  
    setOnClick(handler: () => void): void {
      this._onClick = handler
    }
  
    render(_context?: NHAIRenderContext): any {
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (!adapter) {
        throw new Error('No framework adapter registered')
      }
  
      const props: any = {
        className: `nhai-button nhai-button--${this._variant} nhai-button--${this._size}`,
        style: {
          ...this.getWidgetStyle(),
          ...this.getMergedStyle(),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: this.getSizeStyles().padding,
          border: '1px solid transparent',
          borderRadius: 'var(--nhai-border-radius-md)',
          fontSize: this.getSizeStyles().fontSize,
          fontWeight: 'var(--nhai-font-weight-medium)',
          cursor: 'pointer',
          transition: 'var(--nhai-transition-normal)',
          backgroundColor: this.getVariantColor(),
          color: this.getVariantTextColor()
        }
      }
  
      if (this._id) props.id = this._id
      if (this._className) props.className += ` ${this._className}`
      if (this._onClick) props.onClick = this._onClick
  
      return adapter.createElement('button', props, [this._text])
    }
  
    private getSizeStyles(): Record<string, any> {
      const sizeMap: Record<string, Record<string, any>> = {
        small: {
          padding: 'var(--nhai-spacing-xs) var(--nhai-spacing-sm)',
          fontSize: 'var(--nhai-font-size-xs)',
          minHeight: '28px'
        },
        medium: {
          padding: 'var(--nhai-spacing-sm) var(--nhai-spacing-md)',
          fontSize: 'var(--nhai-font-size-sm)',
          minHeight: '36px'
        },
        large: {
          padding: 'var(--nhai-spacing-md) var(--nhai-spacing-lg)',
          fontSize: 'var(--nhai-font-size-base)',
          minHeight: '44px'
        }
      }
      
      return sizeMap[this._size] || sizeMap.medium
    }
  
    private getVariantColor(): string {
      const colorMap: Record<string, string> = {
        primary: 'var(--nhai-primary)',
        secondary: 'var(--nhai-secondary)',
        success: 'var(--nhai-success)',
        danger: 'var(--nhai-danger)',
        warning: 'var(--nhai-warning)',
        info: 'var(--nhai-info)'
      }
      return colorMap[this._variant] || colorMap.primary
    }
  
    private getVariantTextColor(): string {
      return this._variant === 'warning' ? 'var(--nhai-dark)' : 'white'
    }
  }