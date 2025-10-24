import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Tooltip 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialTooltip extends NHAIWidget {
  private _title: string = ''
  private _placement: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end' = 'top'
  private _arrow: boolean = true
  private _open: boolean = false
  private _disabled: boolean = false
  private _delay: number = 0
  private _enterDelay: number = 0
  private _leaveDelay: number = 0
  private _tooltipMaxWidth: number | string = '200px'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' = 'default'
  private _onOpen?: () => void
  private _onClose?: () => void
  private _tooltipChildren: NHAIObject[] = []

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

  // 设置位置
  setPlacement(placement: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'): void {
    this._placement = placement
  }

  placement(): string {
    return this._placement
  }

  // 设置箭头
  setArrow(arrow: boolean): void {
    this._arrow = arrow
  }

  arrow(): boolean {
    return this._arrow
  }

  // 设置打开状态
  setOpen(open: boolean): void {
    this._open = open
    if (open && this._onOpen) {
      this._onOpen()
    } else if (!open && this._onClose) {
      this._onClose()
    }
  }

  open(): boolean {
    return this._open
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置延迟
  setDelay(delay: number): void {
    this._delay = delay
  }

  delay(): number {
    return this._delay
  }

  // 设置进入延迟
  setEnterDelay(delay: number): void {
    this._enterDelay = delay
  }

  enterDelay(): number {
    return this._enterDelay
  }

  // 设置离开延迟
  setLeaveDelay(delay: number): void {
    this._leaveDelay = delay
  }

  leaveDelay(): number {
    return this._leaveDelay
  }

  // 设置最大宽度
  setMaxWidth(maxWidth: number | string): void {
    this._tooltipMaxWidth = maxWidth
  }

  maxWidth(): number | string {
    return this._tooltipMaxWidth
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置颜色
  setColor(color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置事件处理器
  setOnOpen(handler: () => void): void {
    this._onOpen = handler
  }

  setOnClose(handler: () => void): void {
    this._onClose = handler
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._tooltipChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: 'mui-tooltip-container',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        position: 'relative',
        display: 'inline-block'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 子组件
    this._tooltipChildren.forEach(child => {
      const childElement = child.render(_context)
      children.push(childElement)
    })

    // 如果没有子组件，创建一个默认的触发器
    if (this._tooltipChildren.length === 0) {
      const triggerProps: any = {
        className: 'mui-tooltip-trigger',
        style: {
          display: 'inline-block',
          cursor: 'pointer'
        }
      }
      children.push(adapter.createElement('div', triggerProps, ['Hover me']))
    }

    // 工具提示
    if (this._open && !this._disabled && this._title) {
      const tooltipProps: any = {
        className: `mui-tooltip mui-tooltip--${this._placement} mui-tooltip--${this._size} mui-tooltip--${this._color}`,
        style: {
          position: 'absolute',
          zIndex: 9999,
          maxWidth: typeof this._tooltipMaxWidth === 'number' ? `${this._tooltipMaxWidth}px` : this._tooltipMaxWidth,
          padding: this.getPadding(),
          backgroundColor: this.getBackgroundColor(),
          color: this.getTextColor(),
          borderRadius: '4px',
          fontSize: this.getFontSize(),
          fontWeight: '400',
          lineHeight: '1.4',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          animation: 'mui-tooltip-fade-in 0.2s ease-out',
          ...this.getTooltipPosition()
        }
      }

      const tooltipChildren = []

      // 箭头
      if (this._arrow) {
        const arrowProps: any = {
          className: `mui-tooltip-arrow mui-tooltip-arrow--${this._placement}`,
          style: {
            position: 'absolute',
            width: '0',
            height: '0',
            ...this.getArrowStyles()
          }
        }
        tooltipChildren.push(adapter.createElement('div', arrowProps))
      }

      // 内容
      tooltipChildren.push(this._title)

      tooltipProps.children = tooltipChildren
      children.push(adapter.createElement('div', tooltipProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getPadding(): string {
    const paddingMap: Record<string, string> = {
      small: '4px 8px',
      medium: '6px 12px',
      large: '8px 16px'
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

  private getBackgroundColor(): string {
    const colorMap: Record<string, string> = {
      default: 'rgba(97, 97, 97, 0.9)',
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      error: '#d32f2f',
      info: '#0288d1',
      warning: '#ed6c02'
    }
    return colorMap[this._color] || colorMap.default
  }

  private getTextColor(): string {
    return this._color === 'default' ? '#ffffff' : '#ffffff'
  }

  private getTooltipPosition(): Record<string, any> {
    const positions: Record<string, Record<string, any>> = {
      'top': { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
      'top-start': { bottom: '100%', left: '0', marginBottom: '8px' },
      'top-end': { bottom: '100%', right: '0', marginBottom: '8px' },
      'bottom': { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
      'bottom-start': { top: '100%', left: '0', marginTop: '8px' },
      'bottom-end': { top: '100%', right: '0', marginTop: '8px' },
      'left': { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
      'left-start': { right: '100%', top: '0', marginRight: '8px' },
      'left-end': { right: '100%', bottom: '0', marginRight: '8px' },
      'right': { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
      'right-start': { left: '100%', top: '0', marginLeft: '8px' },
      'right-end': { left: '100%', bottom: '0', marginLeft: '8px' }
    }
    
    return positions[this._placement] || positions.top
  }

  private getArrowStyles(): Record<string, any> {
    const arrowStyles: Record<string, Record<string, any>> = {
      'top': {
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `5px solid ${this.getBackgroundColor()}`,
        bottom: '-5px',
        left: '50%',
        transform: 'translateX(-50%)'
      },
      'top-start': {
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `5px solid ${this.getBackgroundColor()}`,
        bottom: '-5px',
        left: '12px'
      },
      'top-end': {
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `5px solid ${this.getBackgroundColor()}`,
        bottom: '-5px',
        right: '12px'
      },
      'bottom': {
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: `5px solid ${this.getBackgroundColor()}`,
        top: '-5px',
        left: '50%',
        transform: 'translateX(-50%)'
      },
      'bottom-start': {
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: `5px solid ${this.getBackgroundColor()}`,
        top: '-5px',
        left: '12px'
      },
      'bottom-end': {
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: `5px solid ${this.getBackgroundColor()}`,
        top: '-5px',
        right: '12px'
      },
      'left': {
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: `5px solid ${this.getBackgroundColor()}`,
        right: '-5px',
        top: '50%',
        transform: 'translateY(-50%)'
      },
      'left-start': {
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: `5px solid ${this.getBackgroundColor()}`,
        right: '-5px',
        top: '12px'
      },
      'left-end': {
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: `5px solid ${this.getBackgroundColor()}`,
        right: '-5px',
        bottom: '12px'
      },
      'right': {
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderRight: `5px solid ${this.getBackgroundColor()}`,
        left: '-5px',
        top: '50%',
        transform: 'translateY(-50%)'
      },
      'right-start': {
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderRight: `5px solid ${this.getBackgroundColor()}`,
        left: '-5px',
        top: '12px'
      },
      'right-end': {
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderRight: `5px solid ${this.getBackgroundColor()}`,
        left: '-5px',
        bottom: '12px'
      }
    }
    
    return arrowStyles[this._placement] || arrowStyles.top
  }
}
