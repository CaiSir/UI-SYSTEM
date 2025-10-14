/**
 * NHAI框架无关的组件实现
 * 支持所有框架的通用组件
 */

import { NHAIWidget, NHAIObject, NHAIRenderContext } from '../core/NHAICore'
import { NHAIFrameworkRegistry } from '../core/NHAICore'

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

// 标签组件
export class NHAILabel extends NHAIWidget {
  private _text: string = ''
  private _fontSize: number | string = 14
  private _fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder' | number = 'normal'
  private _color: string = 'inherit'
  private _align: 'left' | 'center' | 'right' = 'left'

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

  setFontSize(size: number | string): void {
    this._fontSize = size
  }

  fontSize(): number | string {
    return this._fontSize
  }

  setFontWeight(weight: 'normal' | 'bold' | 'lighter' | 'bolder' | number): void {
    this._fontWeight = weight
  }

  fontWeight(): string | number {
    return this._fontWeight
  }

  setColor(color: string): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  setAlignment(align: 'left' | 'center' | 'right'): void {
    this._align = align
  }

  alignment(): string {
    return this._align
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-label',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        fontSize: typeof this._fontSize === 'number' ? `${this._fontSize}px` : this._fontSize,
        fontWeight: this._fontWeight,
        color: this._color,
        textAlign: this._align,
        display: 'block',
        marginBottom: 'var(--nhai-spacing-xs)'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    return adapter.createElement('div', props, [this._text])
  }
}

// 输入框组件
export class NHAIInput extends NHAIWidget {
  private _placeholder: string = ''
  private _value: string = ''
  private _type: 'text' | 'password' | 'email' | 'number' = 'text'
  private _onChange?: (value: string) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  setPlaceholder(placeholder: string): void {
    this._placeholder = placeholder
  }

  placeholder(): string {
    return this._placeholder
  }

  setValue(value: string): void {
    this._value = value
  }

  value(): string {
    return this._value
  }

  setType(type: 'text' | 'password' | 'email' | 'number'): void {
    this._type = type
  }

  type(): string {
    return this._type
  }

  setOnChange(handler: (value: string) => void): void {
    this._onChange = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-input',
      type: this._type,
      placeholder: this._placeholder,
      value: this._value,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'block',
        width: '100%',
        padding: 'var(--nhai-spacing-sm) var(--nhai-spacing-md)',
        border: '1px solid var(--nhai-border)',
        borderRadius: 'var(--nhai-border-radius-md)',
        fontSize: 'var(--nhai-font-size-sm)',
        lineHeight: 'var(--nhai-line-height-normal)',
        color: 'var(--nhai-text)',
        backgroundColor: 'var(--nhai-surface)',
        transition: 'var(--nhai-transition-normal)'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onChange) {
      props.onChange = (e: any) => {
        const value = e.target?.value || e
        this._value = value
        this._onChange?.(value)
      }
    }

    return adapter.createElement('input', props)
  }
}

// 卡片组件
export class NHAICard extends NHAIWidget {
  private _title: string = ''
  private _subtitle: string = ''
  private _elevation: number = 1
  private _layout?: NHAIObject

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  setTitle(title: string): void {
    this._title = title
  }

  title(): string {
    return this._title
  }

  setSubtitle(subtitle: string): void {
    this._subtitle = subtitle
  }

  subtitle(): string {
    return this._subtitle
  }

  setElevation(elevation: number): void {
    this._elevation = elevation
  }

  elevation(): number {
    return this._elevation
  }

  setLayout(layout: NHAIObject): void {
    this._layout = layout
  }

  layout(): NHAIObject | undefined {
    return this._layout
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-card',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        backgroundColor: 'var(--nhai-surface)',
        border: '1px solid var(--nhai-border)',
        borderRadius: 'var(--nhai-border-radius-lg)',
        boxShadow: `0 ${this._elevation}px ${this._elevation * 2}px rgba(0,0,0,0.1)`,
        padding: 'var(--nhai-spacing-lg)',
        transition: 'var(--nhai-transition-normal)'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children: any[] = []

    // 添加标题
    if (this._title) {
      const titleProps = {
        style: {
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'var(--nhai-text)'
        }
      }
      children.push(adapter.createElement('h3', titleProps, [this._title]))
    }

    // 添加副标题
    if (this._subtitle) {
      const subtitleProps = {
        style: {
          margin: '0 0 12px 0',
          color: '#666',
          fontSize: '14px'
        }
      }
      children.push(adapter.createElement('p', subtitleProps, [this._subtitle]))
    }

    // 添加布局或子控件
    if (this._layout) {
      children.push(this._layout.render(_context))
    } else {
      this.children().forEach(child => {
        children.push(child.render(_context))
      })
    }

    return adapter.createElement('div', props, children)
  }
}

// 容器组件
export class NHAIContainer extends NHAIWidget {
  private _layout?: NHAIObject

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  setLayout(layout: NHAIObject): void {
    this._layout = layout
  }

  layout(): NHAIObject | undefined {
    return this._layout
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-container',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        position: 'relative'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children: any[] = []

    if (this._layout) {
      children.push(this._layout.render(_context))
    } else {
      this.children().forEach(child => {
        children.push(child.render(_context))
      })
    }

    return adapter.createElement('div', props, children)
  }
}

// 窗口组件
export class NHAIWindow extends NHAIWidget {
  private _title: string = ''
  private _layout?: NHAIObject

  constructor(title: string = '', parent?: NHAIObject) {
    super(parent)
    this._title = title
  }

  setTitle(title: string): void {
    this._title = title
  }

  title(): string {
    return this._title
  }

  setLayout(layout: NHAIObject): void {
    this._layout = layout
  }

  layout(): NHAIObject | undefined {
    return this._layout
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-window',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        backgroundColor: 'var(--nhai-surface)',
        border: '1px solid var(--nhai-border)',
        borderRadius: 'var(--nhai-border-radius-lg)',
        boxShadow: 'var(--nhai-shadow-lg)',
        padding: 'var(--nhai-spacing-lg)'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children: any[] = []

    // 添加标题
    if (this._title) {
      const titleProps = {
        style: {
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'var(--nhai-text)',
          borderBottom: '1px solid var(--nhai-border)',
          paddingBottom: '8px'
        }
      }
      children.push(adapter.createElement('h2', titleProps, [this._title]))
    }

    // 添加布局或子控件
    if (this._layout) {
      children.push(this._layout.render(_context))
    } else {
      this.children().forEach(child => {
        children.push(child.render(_context))
      })
    }

    return adapter.createElement('div', props, children)
  }
}
