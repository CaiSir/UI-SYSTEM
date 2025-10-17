import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../core/NHAICore"

// 文本按钮组件 - 无背景的文本样式按钮
export class NHAITextButton extends NHAIWidget {
    private _text: string = ''
    private _color: string = 'var(--nhai-primary)'
    private _size: 'small' | 'medium' | 'large' = 'medium'
    private _onClick?: () => void
    private _disabled: boolean = false
    private _underline: boolean = false
    private _href?: string
    private _target: '_blank' | '_self' | '_parent' | '_top' = '_self'
    private _router?: (path: string) => void
  
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
  
    setColor(color: string): void {
      this._color = color
    }
  
    color(): string {
      return this._color
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
  
    setDisabled(disabled: boolean): void {
      this._disabled = disabled
    }
  
    disabled(): boolean {
      return this._disabled
    }
  
    setUnderline(underline: boolean): void {
      this._underline = underline
    }
  
    underline(): boolean {
      return this._underline
    }

    setHref(href: string): void {
      this._href = href
    }

    href(): string | undefined {
      return this._href
    }

    setTarget(target: '_blank' | '_self' | '_parent' | '_top'): void {
      this._target = target
    }

    target(): string {
      return this._target
    }

    setRouter(router: (path: string) => void): void {
      this._router = router
    }

    router(): ((path: string) => void) | undefined {
      return this._router
    }

    // 便利方法：设置为外部链接
    setExternalLink(url: string): void {
      this._href = url
      this._target = '_blank'
    }

    // 便利方法：设置为内部路由链接
    setInternalLink(path: string, router?: (path: string) => void): void {
      this._href = path
      this._target = '_self'
      if (router) {
        this._router = router
      }
    }

    // 便利方法：清除链接
    clearLink(): void {
      this._href = undefined
      this._target = '_self'
      this._router = undefined
    }

    // 便利方法：检查是否为链接按钮
    isLink(): boolean {
      return !!this._href
    }
  
    render(_context?: NHAIRenderContext): any {
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (!adapter) {
        throw new Error('No framework adapter registered')
      }

      const baseStyle = {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: this.getSizeStyles().padding,
        fontSize: this.getSizeStyles().fontSize,
        fontWeight: 'var(--nhai-font-weight-medium)',
        color: this._disabled ? 'var(--nhai-text-disabled)' : this._color,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 'var(--nhai-border-radius-sm)',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--nhai-transition-normal)',
        textDecoration: this._underline ? 'underline' : 'none',
        opacity: this._disabled ? 0.6 : 1,
        outline: 'none'
      }

      // 如果有链接，渲染为 <a> 标签
      if (this._href && !this._disabled) {
        const linkProps: any = {
          className: `nhai-text-button nhai-text-button--${this._size} nhai-text-button--link`,
          style: baseStyle,
          href: this._href,
          target: this._target
        }

        if (this._id) linkProps.id = this._id
        if (this._className) linkProps.className += ` ${this._className}`

        // 添加点击处理
        linkProps.onClick = (event: Event) => {
          // 如果有自定义路由处理器，使用路由导航
          if (this._router && this._target === '_self') {
            event.preventDefault()
            this._router(this._href!)
          }
          // 如果有自定义点击处理器，也执行
          if (this._onClick) {
            this._onClick()
          }
        }

        // 添加悬停效果
        linkProps.onMouseEnter = () => {
          if (linkProps.style) {
            linkProps.style.filter = 'brightness(0.8)'
          }
        }
        linkProps.onMouseLeave = () => {
          if (linkProps.style) {
            linkProps.style.filter = 'brightness(1)'
          }
        }

        return adapter.createElement('a', linkProps, [this._text])
      }

      // 否则渲染为 <button> 标签
      const buttonProps: any = {
        className: `nhai-text-button nhai-text-button--${this._size}`,
        style: baseStyle
      }

      if (this._id) buttonProps.id = this._id
      if (this._className) buttonProps.className += ` ${this._className}`
      
      if (this._onClick && !this._disabled) {
        buttonProps.onClick = this._onClick
      }

      // 添加悬停效果
      if (!this._disabled) {
        buttonProps.onMouseEnter = () => {
          if (buttonProps.style) {
            buttonProps.style.filter = 'brightness(0.8)'
          }
        }
        buttonProps.onMouseLeave = () => {
          if (buttonProps.style) {
            buttonProps.style.filter = 'brightness(1)'
          }
        }
      }

      return adapter.createElement('button', buttonProps, [this._text])
    }
  
    private getSizeStyles(): Record<string, any> {
      const sizeMap: Record<string, Record<string, any>> = {
        small: {
          padding: 'var(--nhai-spacing-xs) var(--nhai-spacing-sm)',
          fontSize: 'var(--nhai-font-size-xs)',
          minHeight: '24px'
        },
        medium: {
          padding: 'var(--nhai-spacing-sm) var(--nhai-spacing-md)',
          fontSize: 'var(--nhai-font-size-sm)',
          minHeight: '32px'
        },
        large: {
          padding: 'var(--nhai-spacing-md) var(--nhai-spacing-lg)',
          fontSize: 'var(--nhai-font-size-base)',
          minHeight: '40px'
        }
      }
      
      return sizeMap[this._size] || sizeMap.medium
    }
  }
