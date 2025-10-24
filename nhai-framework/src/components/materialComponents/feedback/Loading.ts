import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Loading 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialLoading extends NHAIWidget {
  private _loading: boolean = false
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' = 'primary'
  private _variant: 'circular' | 'linear' | 'dots' = 'circular'
  private _text?: string
  private _overlay: boolean = false
  private _loadingChildren: NHAIObject[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置加载状态
  setLoading(loading: boolean): void {
    this._loading = loading
  }

  loading(): boolean {
    return this._loading
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置颜色
  setColor(color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置变体
  setVariant(variant: 'circular' | 'linear' | 'dots'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置文本
  setText(text: string): void {
    this._text = text
  }

  text(): string | undefined {
    return this._text
  }

  // 设置遮罩
  setOverlay(overlay: boolean): void {
    this._overlay = overlay
  }

  overlay(): boolean {
    return this._overlay
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._loadingChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-loading-container ${this._overlay ? 'mui-loading-container--overlay' : ''}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...this.getContainerStyles()
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 子组件
    this._loadingChildren.forEach(child => {
      const childElement = child.render(_context)
      children.push(childElement)
    })

    // 加载指示器
    if (this._loading) {
      const loadingProps: any = {
        className: `mui-loading mui-loading--${this._variant} mui-loading--${this._size}`,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          ...this.getLoadingStyles()
        }
      }

      const loadingChildren = []

      // 加载动画
      const spinnerElement = this.renderSpinner(adapter)
      loadingChildren.push(spinnerElement)

      // 加载文本
      if (this._text) {
        const textProps: any = {
          className: 'mui-loading-text',
          style: {
            fontSize: this.getFontSize(),
            color: 'rgba(0, 0, 0, 0.6)',
            fontWeight: '400'
          }
        }
        loadingChildren.push(adapter.createElement('div', textProps, [this._text]))
      }

      loadingProps.children = loadingChildren
      children.push(adapter.createElement('div', loadingProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private renderSpinner(adapter: any): any {
    const color = this.getColorValue()
    const size = this.getSpinnerSize()

    switch (this._variant) {
      case 'circular':
        return this.renderCircularSpinner(adapter, color, size)
      case 'linear':
        return this.renderLinearSpinner(adapter, color, size)
      case 'dots':
        return this.renderDotsSpinner(adapter, color, size)
      default:
        return this.renderCircularSpinner(adapter, color, size)
    }
  }

  private renderCircularSpinner(adapter: any, color: string, size: string): any {
    const spinnerProps: any = {
      className: 'mui-loading-circular',
      style: {
        width: size,
        height: size,
        border: `2px solid rgba(0, 0, 0, 0.1)`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'mui-loading-spin 1s linear infinite'
      }
    }

    return adapter.createElement('div', spinnerProps)
  }

  private renderLinearSpinner(adapter: any, color: string, _size: string): any {
    const containerProps: any = {
      className: 'mui-loading-linear',
      style: {
        width: '200px',
        height: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden'
      }
    }

    const barProps: any = {
      className: 'mui-loading-linear-bar',
      style: {
        height: '100%',
        backgroundColor: color,
        borderRadius: '2px',
        animation: 'mui-loading-linear 1.5s ease-in-out infinite'
      }
    }

    containerProps.children = [adapter.createElement('div', barProps)]
    return adapter.createElement('div', containerProps)
  }

  private renderDotsSpinner(adapter: any, color: string, _size: string): any {
    const containerProps: any = {
      className: 'mui-loading-dots',
      style: {
        display: 'flex',
        gap: '4px',
        alignItems: 'center'
      }
    }

    const dots = []
    for (let i = 0; i < 3; i++) {
      const dotProps: any = {
        className: 'mui-loading-dot',
        style: {
          width: '8px',
          height: '8px',
          backgroundColor: color,
          borderRadius: '50%',
          animation: `mui-loading-dot 1.4s ease-in-out infinite both`,
          animationDelay: `${i * 0.16}s`
        }
      }
      dots.push(adapter.createElement('div', dotProps))
    }

    containerProps.children = dots
    return adapter.createElement('div', containerProps)
  }

  private getContainerStyles(): Record<string, any> {
    if (this._overlay) {
      return {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000
      }
    }
    return {}
  }

  private getLoadingStyles(): Record<string, any> {
    if (this._overlay) {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001
      }
    }
    return {}
  }

  private getSpinnerSize(): string {
    const sizeMap: Record<string, string> = {
      small: '20px',
      medium: '32px',
      large: '48px'
    }
    return sizeMap[this._size] || sizeMap.medium
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.75rem',
      medium: '0.875rem',
      large: '1rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getColorValue(): string {
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      error: '#d32f2f',
      info: '#0288d1',
      warning: '#ed6c02'
    }
    return colorMap[this._color] || colorMap.primary
  }
}
