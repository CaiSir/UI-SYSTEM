import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Avatar 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialAvatar extends NHAIWidget {
  private _src?: string
  private _alt?: string
  private _text?: string
  private _size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
  private _variant: 'circular' | 'rounded' | 'square' = 'circular'
  private _color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' = 'default'
  private _onClick?: () => void
  private _avatarChildren: NHAIObject[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置图片源
  setSrc(src: string): void {
    this._src = src
  }

  src(): string | undefined {
    return this._src
  }

  // 设置替代文本
  setAlt(alt: string): void {
    this._alt = alt
  }

  alt(): string | undefined {
    return this._alt
  }

  // 设置文本
  setText(text: string): void {
    this._text = text
  }

  text(): string | undefined {
    return this._text
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large' | 'xlarge'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置变体
  setVariant(variant: 'circular' | 'rounded' | 'square'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置颜色
  setColor(color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置点击事件
  setOnClick(handler: () => void): void {
    this._onClick = handler
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._avatarChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const avatarProps: any = {
      className: `mui-avatar mui-avatar--${this._variant} mui-avatar--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        width: this.getAvatarSize(),
        height: this.getAvatarSize(),
        borderRadius: this.getBorderRadius(),
        backgroundColor: this.getBackgroundColor(),
        color: this.getTextColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: this.getFontSize(),
        fontWeight: '500',
        cursor: this._onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        ...this.getAvatarStyles()
      }
    }

    if (this._id) avatarProps.id = this._id
    if (this._className) avatarProps.className += ` ${this._className}`
    if (this._onClick) avatarProps.onClick = this._onClick

    const children = []

    // 图片头像
    if (this._src) {
      const imgProps: any = {
        className: 'mui-avatar-img',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit'
        },
        src: this._src,
        alt: this._alt || ''
      }
      children.push(adapter.createElement('img', imgProps))
    }
    // 文本头像
    else if (this._text) {
      const textProps: any = {
        className: 'mui-avatar-text',
        style: {
          fontSize: this.getFontSize(),
          fontWeight: '500',
          color: 'inherit',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }
      }
      children.push(adapter.createElement('span', textProps, [this.getDisplayText()]))
    }
    // 子组件
    else if (this._avatarChildren.length > 0) {
      this._avatarChildren.forEach(child => {
        const childElement = child.render(_context)
        children.push(childElement)
      })
    }
    // 默认占位符
    else {
      const placeholderProps: any = {
        className: 'mui-avatar-placeholder',
        style: {
          fontSize: this.getFontSize(),
          color: 'inherit'
        }
      }
      children.push(adapter.createElement('span', placeholderProps, ['?']))
    }

    return adapter.createElement('div', avatarProps, children)
  }

  private getAvatarSize(): string {
    const sizeMap: Record<string, string> = {
      small: '32px',
      medium: '40px',
      large: '56px',
      xlarge: '80px'
    }
    return sizeMap[this._size] || sizeMap.medium
  }

  private getBorderRadius(): string {
    const borderRadiusMap: Record<string, string> = {
      circular: '50%',
      rounded: '8px',
      square: '0'
    }
    return borderRadiusMap[this._variant] || borderRadiusMap.circular
  }

  private getBackgroundColor(): string {
    if (this._src) {
      return 'transparent'
    }

    const colorMap: Record<string, string> = {
      default: '#f5f5f5',
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#4caf50',
      error: '#f44336',
      info: '#2196f3',
      warning: '#ff9800'
    }
    return colorMap[this._color] || colorMap.default
  }

  private getTextColor(): string {
    if (this._src) {
      return 'transparent'
    }

    const colorMap: Record<string, string> = {
      default: 'rgba(0, 0, 0, 0.87)',
      primary: '#ffffff',
      secondary: '#ffffff',
      success: '#ffffff',
      error: '#ffffff',
      info: '#ffffff',
      warning: '#ffffff'
    }
    return colorMap[this._color] || colorMap.default
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getDisplayText(): string {
    if (!this._text) return ''
    
    // 如果文本长度超过2个字符，取前两个字符
    if (this._text.length > 2) {
      return this._text.substring(0, 2)
    }
    
    return this._text
  }

  private getAvatarStyles(): Record<string, any> {
    const styles: Record<string, any> = {}
    
    // 悬停效果
    if (this._onClick) {
      styles[':hover'] = {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }
    }
    
    return styles
  }
}
