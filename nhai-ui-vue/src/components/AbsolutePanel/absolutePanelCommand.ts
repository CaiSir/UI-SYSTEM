import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

export interface LayoutItem {
  id: string
  element: HTMLElement
  data?: any
}

export interface AbsoluteItem extends LayoutItem {
  position: { x: number, y: number }
  size?: { width: number, height: number }
}

// 类型定义
export interface AbsolutePanelOptions extends IBaseCommandProps {
  width?: string
  height?: string
  backgroundColor?: string
}

export interface AbsolutePanelEvents extends IBaseCommandEvents {}

/**
 * 绝对定位面板命令式组件
 * 支持自由定位子元素
 */
export class AbsolutePanelCommand extends BaseCommand<AbsolutePanelOptions, AbsolutePanelEvents> {
  private width?: string
  private height?: string
  private backgroundColor?: string
  private items: AbsoluteItem[] = []

  constructor(widthOrOptions?: string | AbsolutePanelOptions, height?: string) {
    const options: AbsolutePanelOptions = typeof widthOrOptions === 'string' || !widthOrOptions
      ? { width: widthOrOptions, height }
      : widthOrOptions
    super(options)
    
    this.width = options.width
    this.height = options.height
    this.backgroundColor = options.backgroundColor
    
    Object.assign(this._props, {
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      ...options
    })
  }

  setWidth(width: string): this {
    this.width = width
    this.setProperty('width', width)
    if (this._element) {
      this._element.style.width = width
    }
    return this
  }

  setHeight(height: string): this {
    this.height = height
    this.setProperty('height', height)
    if (this._element) {
      this._element.style.height = height
    }
    return this
  }

  setBackgroundColor(color: string): this {
    this.backgroundColor = color
    this.setProperty('backgroundColor', color)
    if (this._element) {
      this._element.style.backgroundColor = color
    }
    return this
  }

  /**
   * 添加组件到绝对位置
   */
  addWidgetAt(id: string, widget: BaseCommand<any, any>, position: { x: number, y: number }, size?: { width: number, height: number }): this {
    if (!this._mounted) {
      // 如果面板还没渲染，先渲染
      const container = this.render()
      // 确保元素已挂载
      if (!this._element) {
        this._element = container
        this._mounted = true
      }
    }
    // 如果组件未渲染，调用其 render 方法
    if (!widget.isMounted()) {
      widget.render()
    }
    const element = widget.getElement()
    if (!element) {
      return this
    }
    element.style.position = 'absolute'
    element.style.left = `${position.x}px`
    element.style.top = `${position.y}px`
    
    if (size) {
      element.style.width = `${size.width}px`
      element.style.height = `${size.height}px`
    }
    
    this.items.push({ id, element, position, size })
    
    // 添加到面板容器
    if (this._element) {
      this._element.appendChild(element)
    }
    
    return this
  }

  /**
   * 更新组件位置
   */
  setPosition(id: string, x: number, y: number): this {
    const item = this.items.find(i => i.id === id)
    if (item) {
      item.position = { x, y }
      item.element.style.left = `${x}px`
      item.element.style.top = `${y}px`
    }
    return this
  }

  /**
   * 获取组件位置
   */
  getPosition(id: string): { x: number, y: number } | undefined {
    return this.items.find(i => i.id === id)?.position
  }

  /**
   * 更新组件大小
   */
  setSize(id: string, width: number, height: number): this {
    const item = this.items.find(i => i.id === id)
    if (item) {
      item.size = { width, height }
      item.element.style.width = `${width}px`
      item.element.style.height = `${height}px`
    }
    return this
  }

  /**
   * 获取组件大小
   */
  getSize(id: string): { width: number, height: number } | undefined {
    return this.items.find(i => i.id === id)?.size
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    this._element = container
    this._mounted = true
    
    container.style.position = 'relative'
    container.style.boxSizing = 'border-box'
    
    if (this.width) {
      container.style.width = this.width
    }
    
    if (this.height) {
      container.style.height = this.height
    }
    
    if (this.backgroundColor) {
      container.style.backgroundColor = this.backgroundColor
    }
    
    // 添加所有子元素
    this.items.forEach(item => {
      container.appendChild(item.element)
    })
    
    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

