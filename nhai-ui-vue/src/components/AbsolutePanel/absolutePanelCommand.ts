import { BaseCommand } from '../../lib/BaseCommand'

export interface LayoutItem {
  id: string
  element: HTMLElement
  data?: any
}

export interface AbsoluteItem extends LayoutItem {
  position: { x: number, y: number }
  size?: { width: number, height: number }
}

/**
 * 绝对定位面板命令式组件
 * 支持自由定位子元素
 */
export class AbsolutePanelCommand extends BaseCommand {
  private width?: string
  private height?: string
  private backgroundColor?: string
  private items: AbsoluteItem[] = []

  constructor(width?: string, height?: string) {
    super()
    this.width = width
    this.height = height
  }

  setWidth(width: string): void {
    this.width = width
  }

  setHeight(height: string): void {
    this.height = height
  }

  setBackgroundColor(color: string): void {
    this.backgroundColor = color
  }

  /**
   * 添加组件到绝对位置
   */
  addWidgetAt(id: string, widget: BaseCommand, position: { x: number, y: number }, size?: { width: number, height: number }): void {
    const element = widget.render()
    element.style.position = 'absolute'
    element.style.left = `${position.x}px`
    element.style.top = `${position.y}px`
    
    if (size) {
      element.style.width = `${size.width}px`
      element.style.height = `${size.height}px`
    }
    
    this.items.push({ id, element, position, size })
  }

  /**
   * 更新组件位置
   */
  setPosition(id: string, x: number, y: number): void {
    const item = this.items.find(i => i.id === id)
    if (item) {
      item.position = { x, y }
      item.element.style.left = `${x}px`
      item.element.style.top = `${y}px`
    }
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
  setSize(id: string, width: number, height: number): void {
    const item = this.items.find(i => i.id === id)
    if (item) {
      item.size = { width, height }
      item.element.style.width = `${width}px`
      item.element.style.height = `${height}px`
    }
  }

  /**
   * 获取组件大小
   */
  getSize(id: string): { width: number, height: number } | undefined {
    return this.items.find(i => i.id === id)?.size
  }

  render(): HTMLElement {
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

