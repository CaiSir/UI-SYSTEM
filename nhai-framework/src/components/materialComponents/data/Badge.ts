import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Badge 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialBadge extends NHAIWidget {
  private _content: string | number = ''
  private _max: number = 99
  private _showZero: boolean = false
  private _color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' = 'default'
  private _variant: 'standard' | 'dot' = 'standard'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _anchorOrigin: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right'
  } = { vertical: 'top', horizontal: 'right' }
  private _overlap: 'rectangular' | 'circular' = 'rectangular'
  private _badgeChildren: NHAIObject[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置内容
  setContent(content: string | number): void {
    this._content = content
  }

  content(): string | number {
    return this._content
  }

  // 设置最大值
  setMax(max: number): void {
    this._max = max
  }

  max(): number {
    return this._max
  }

  // 设置显示零值
  setShowZero(showZero: boolean): void {
    this._showZero = showZero
  }

  showZero(): boolean {
    return this._showZero
  }

  // 设置颜色
  setColor(color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置变体
  setVariant(variant: 'standard' | 'dot'): void {
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

  // 设置锚点位置
  setAnchorOrigin(origin: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right'
  }): void {
    this._anchorOrigin = origin
  }

  anchorOrigin(): {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right'
  } {
    return this._anchorOrigin
  }

  // 设置重叠方式
  setOverlap(overlap: 'rectangular' | 'circular'): void {
    this._overlap = overlap
  }

  overlap(): string {
    return this._overlap
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._badgeChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-badge-container`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 子组件
    this._badgeChildren.forEach(child => {
      const childElement = child.render(_context)
      children.push(childElement)
    })

    // 如果没有子组件，创建一个默认的占位元素
    if (this._badgeChildren.length === 0) {
      const placeholderProps: any = {
        className: 'mui-badge-placeholder',
        style: {
          width: '40px',
          height: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.6)'
        }
      }
      children.push(adapter.createElement('div', placeholderProps, ['']))
    }

    // 徽章
    if (this.shouldShowBadge()) {
      const badgeProps: any = {
        className: `mui-badge mui-badge--${this._variant} mui-badge--${this._color} mui-badge--${this._size}`,
        style: {
          position: 'absolute',
          ...this.getBadgePosition(),
          backgroundColor: this.getBadgeColor(),
          color: this.getBadgeTextColor(),
          borderRadius: this.getBadgeBorderRadius(),
          fontSize: this.getBadgeFontSize(),
          fontWeight: '500',
          minWidth: this.getBadgeMinWidth(),
          height: this.getBadgeHeight(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: this.getBadgePadding(),
          zIndex: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          ...this.getBadgeStyles()
        }
      }

      const badgeContent = this._variant === 'dot' ? '' : this.getDisplayContent()
      badgeProps.children = [badgeContent]
      children.push(adapter.createElement('span', badgeProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private shouldShowBadge(): boolean {
    if (this._variant === 'dot') {
      return true
    }

    const numValue = typeof this._content === 'number' ? this._content : parseInt(this._content.toString())
    return !isNaN(numValue) && (numValue > 0 || this._showZero)
  }

  private getDisplayContent(): string {
    if (this._variant === 'dot') {
      return ''
    }

    const numValue = typeof this._content === 'number' ? this._content : parseInt(this._content.toString())
    if (isNaN(numValue)) {
      return this._content.toString()
    }

    return numValue > this._max ? `${this._max}+` : numValue.toString()
  }

  private getBadgePosition(): Record<string, any> {
    const { vertical, horizontal } = this._anchorOrigin
    
    const position: Record<string, any> = {}
    
    if (vertical === 'top') {
      position.top = '-8px'
    } else {
      position.bottom = '-8px'
    }
    
    if (horizontal === 'left') {
      position.left = '-8px'
    } else {
      position.right = '-8px'
    }
    
    return position
  }

  private getBadgeColor(): string {
    const colorMap: Record<string, string> = {
      default: '#f44336',
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#4caf50',
      error: '#f44336',
      info: '#2196f3',
      warning: '#ff9800'
    }
    return colorMap[this._color] || colorMap.default
  }

  private getBadgeTextColor(): string {
    return '#ffffff'
  }

  private getBadgeBorderRadius(): string {
    if (this._variant === 'dot') {
      return '50%'
    }
    return '10px'
  }

  private getBadgeFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.75rem',
      medium: '0.875rem',
      large: '1rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getBadgeMinWidth(): string {
    if (this._variant === 'dot') {
      return this.getBadgeHeight()
    }
    
    const minWidthMap: Record<string, string> = {
      small: '16px',
      medium: '20px',
      large: '24px'
    }
    return minWidthMap[this._size] || minWidthMap.medium
  }

  private getBadgeHeight(): string {
    const heightMap: Record<string, string> = {
      small: '16px',
      medium: '20px',
      large: '24px'
    }
    return heightMap[this._size] || heightMap.medium
  }

  private getBadgePadding(): string {
    if (this._variant === 'dot') {
      return '0'
    }
    
    const paddingMap: Record<string, string> = {
      small: '0 4px',
      medium: '0 6px',
      large: '0 8px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getBadgeStyles(): Record<string, any> {
    if (this._variant === 'dot') {
      return {
        width: this.getBadgeHeight(),
        height: this.getBadgeHeight(),
        padding: '0'
      }
    }
    return {}
  }
}
