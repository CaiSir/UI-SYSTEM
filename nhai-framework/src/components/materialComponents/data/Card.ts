import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Card 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialCard extends NHAIWidget {
  private _title: string = ''
  private _subtitle: string = ''
  private _content: string = ''
  private _actions: Array<{
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  }> = []
  private _elevation: number = 1
  private _variant: 'elevation' | 'outlined' = 'elevation'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _media?: {
    src: string
    alt?: string
    height?: number
  }
  private _onClick?: () => void
  private _cardChildren: NHAIObject[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置标题
  setTitle(title: string): void {
    this._title = title
  }

  title(): string {
    return this._title
  }

  // 设置副标题
  setSubtitle(subtitle: string): void {
    this._subtitle = subtitle
  }

  subtitle(): string {
    return this._subtitle
  }

  // 设置内容
  setContent(content: string): void {
    this._content = content
  }

  content(): string {
    return this._content
  }

  // 设置操作按钮
  setActions(actions: Array<{
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  }>): void {
    this._actions = actions
  }

  actions(): Array<{
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  }> {
    return this._actions
  }

  // 添加操作按钮
  addAction(action: {
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  }): void {
    this._actions.push(action)
  }

  // 设置阴影
  setElevation(elevation: number): void {
    this._elevation = elevation
  }

  elevation(): number {
    return this._elevation
  }

  // 设置变体
  setVariant(variant: 'elevation' | 'outlined'): void {
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

  // 设置媒体
  setMedia(media: {
    src: string
    alt?: string
    height?: number
  }): void {
    this._media = media
  }

  media(): {
    src: string
    alt?: string
    height?: number
  } | undefined {
    return this._media
  }

  // 设置点击事件
  setOnClick(handler: () => void): void {
    this._onClick = handler
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._cardChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const cardProps: any = {
      className: `mui-card mui-card--${this._variant} mui-card--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: this._onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s ease-in-out',
        ...this.getCardStyle()
      }
    }

    if (this._id) cardProps.id = this._id
    if (this._className) cardProps.className += ` ${this._className}`
    if (this._onClick) cardProps.onClick = this._onClick

    const children = []

    // 媒体
    if (this._media) {
      const mediaProps: any = {
        className: 'mui-card-media',
        style: {
          width: '100%',
          height: this._media.height || this.getMediaHeight(),
          backgroundImage: `url(${this._media.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f5f5f5'
        }
      }

      if (this._media.alt) {
        mediaProps.alt = this._media.alt
      }

      children.push(adapter.createElement('div', mediaProps))
    }

    // 内容区域
    const contentProps: any = {
      className: 'mui-card-content',
      style: {
        padding: this.getContentPadding()
      }
    }

    const contentChildren = []

    // 标题
    if (this._title) {
      const titleProps: any = {
        className: 'mui-card-title',
        style: {
          fontSize: this.getFontSize().title,
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.87)',
          marginBottom: this._subtitle ? '4px' : '8px',
          lineHeight: '1.2'
        }
      }
      contentChildren.push(adapter.createElement('h3', titleProps, [this._title]))
    }

    // 副标题
    if (this._subtitle) {
      const subtitleProps: any = {
        className: 'mui-card-subtitle',
        style: {
          fontSize: this.getFontSize().subtitle,
          color: 'rgba(0, 0, 0, 0.6)',
          marginBottom: '8px',
          lineHeight: '1.4'
        }
      }
      contentChildren.push(adapter.createElement('p', subtitleProps, [this._subtitle]))
    }

    // 内容
    if (this._content) {
      const contentTextProps: any = {
        className: 'mui-card-content-text',
        style: {
          fontSize: this.getFontSize().content,
          color: 'rgba(0, 0, 0, 0.87)',
          lineHeight: '1.5',
          marginBottom: this._actions.length > 0 ? '16px' : '0'
        }
      }
      contentChildren.push(adapter.createElement('div', contentTextProps, [this._content]))
    }

    // 子组件
    this._cardChildren.forEach(child => {
      const childElement = child.render(_context)
      contentChildren.push(childElement)
    })

    contentProps.children = contentChildren
    children.push(adapter.createElement('div', contentProps))

    // 操作按钮
    if (this._actions.length > 0) {
      const actionsProps: any = {
        className: 'mui-card-actions',
        style: {
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }

      const actionButtons = this._actions.map(action => {
        const buttonProps: any = {
          className: `mui-card-action-button mui-card-action-button--${action.variant || 'text'}`,
          style: {
            padding: '6px 12px',
            border: this.getButtonBorder(action.variant || 'text'),
            borderRadius: '4px',
            backgroundColor: this.getButtonBackground(action.variant || 'text', action.color || 'primary'),
            color: this.getButtonColor(action.variant || 'text', action.color || 'primary'),
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease-in-out'
          }
        }

        buttonProps.onClick = (e: any) => {
          e.stopPropagation()
          action.onClick()
        }

        return adapter.createElement('button', buttonProps, [action.label])
      })

      actionsProps.children = actionButtons
      children.push(adapter.createElement('div', actionsProps))
    }

    return adapter.createElement('div', cardProps, children)
  }

  private getCardStyle(): Record<string, any> {
    if (this._variant === 'outlined') {
      return {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: 'none'
      }
    } else {
      return {
        boxShadow: this.getElevationShadow()
      }
    }
  }

  private getElevationShadow(): string {
    const shadows: Record<number, string> = {
      0: 'none',
      1: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
      2: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      3: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
      4: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      5: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)'
    }
    return shadows[this._elevation] || shadows[1]
  }

  private getMediaHeight(): string {
    const heightMap: Record<string, string> = {
      small: '120px',
      medium: '160px',
      large: '200px'
    }
    return heightMap[this._size] || heightMap.medium
  }

  private getContentPadding(): string {
    const paddingMap: Record<string, string> = {
      small: '12px',
      medium: '16px',
      large: '20px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getFontSize(): Record<string, string> {
    const sizeMap: Record<string, Record<string, string>> = {
      small: {
        title: '1rem',
        subtitle: '0.875rem',
        content: '0.875rem'
      },
      medium: {
        title: '1.25rem',
        subtitle: '1rem',
        content: '1rem'
      },
      large: {
        title: '1.5rem',
        subtitle: '1.125rem',
        content: '1.125rem'
      }
    }
    
    return sizeMap[this._size] || sizeMap.medium
  }

  private getButtonBorder(variant: string): string {
    if (variant === 'outlined') {
      return '1px solid rgba(0, 0, 0, 0.23)'
    }
    return 'none'
  }

  private getButtonBackground(variant: string, color: string): string {
    if (variant === 'contained') {
      const colorMap: Record<string, string> = {
        primary: '#1976d2',
        secondary: '#dc004e',
        success: '#2e7d32',
        error: '#d32f2f',
        info: '#0288d1',
        warning: '#ed6c02'
      }
      return colorMap[color] || colorMap.primary
    }
    return 'transparent'
  }

  private getButtonColor(variant: string, color: string): string {
    if (variant === 'contained') {
      return '#ffffff'
    }
    
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      error: '#d32f2f',
      info: '#0288d1',
      warning: '#ed6c02'
    }
    return colorMap[color] || colorMap.primary
  }
}
