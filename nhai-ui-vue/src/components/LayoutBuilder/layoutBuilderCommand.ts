import { BaseCommand } from '../../lib/BaseCommand'

/**
 * 布局项接口
 */
export interface LayoutItem {
  id: string
  element: HTMLElement
  data?: any
}

/**
 * Vue 布局构建器（命令式 API，完全解耦）
 * 参考 nhai-framework 的设计，不依赖 Vue 的具体实现
 */
export class VueLayoutBuilderCommand extends BaseCommand {
  private layoutType: 'vbox' | 'hbox' | 'grid' | 'container' = 'vbox'
  private direction: 'row' | 'column' = 'column'
  private spacing: number = 0
  private padding: string = '0'
  private gap: string = '8px'
  private width?: string
  private height?: string
  private backgroundColor?: string
  private items: LayoutItem[] = []
  private onItemClick?: (item: LayoutItem) => void
  private customStyle: Record<string, string> = {}  // 自定义样式

  constructor(layoutType: 'vbox' | 'hbox' | 'grid' | 'container' = 'vbox') {
    this.layoutType = layoutType
    if (layoutType === 'hbox') {
      this.direction = 'row'
    }
  }

  setLayoutType(type: 'vbox' | 'hbox' | 'grid' | 'container'): void {
    this.layoutType = type
    if (type === 'hbox') {
      this.direction = 'row'
    } else if (type === 'vbox') {
      this.direction = 'column'
    }
  }

  setDirection(direction: 'row' | 'column'): void {
    this.direction = direction
  }

  setSpacing(spacing: number): void {
    this.spacing = spacing
    this.gap = `${spacing * 8}px`
  }

  setPadding(padding: string): void {
    this.padding = padding
  }

  setGap(gap: string): void {
    this.gap = gap
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
   * 设置自定义样式（覆盖默认样式）
   */
  setStyle(style: Record<string, string>): void {
    this.customStyle = { ...this.customStyle, ...style }
  }

  /**
   * 添加自定义样式类名
   */
  setClassName(className: string): void {
    this.customStyle.className = className
  }

  /**
   * 添加元素到布局
   * @param id - 元素唯一标识
   * @param element - DOM 元素
   * @param data - 附加数据
   */
  addChild(id: string, element: HTMLElement, data?: any): void {
    this.items.push({ id, element, data })
  }

  /**
   * 添加组件（自动调用 render 方法）
   */
  addWidget(id: string, widget: any, data?: any): void {
    if (widget && typeof widget.render === 'function') {
      const element = widget.render()
      this.items.push({ id, element, data })
    }
  }

  /**
   * 移除组件
   */
  removeComponent(id: string): void {
    this.items = this.items.filter(item => item.id !== id)
  }

  /**
   * 获取所有组件
   */
  getItems(): LayoutItem[] {
    return this.items
  }

  /**
   * 清空所有组件
   */
  clear(): void {
    this.items = []
  }

  /**
   * 查找组件
   */
  findItem(id: string): LayoutItem | undefined {
    return this.items.find(item => item.id === id)
  }

  /**
   * 更新项数据
   */
  updateItem(id: string, data: any): void {
    const item = this.findItem(id)
    if (item) {
      item.data = { ...item.data, ...data }
    }
  }

  /**
   * 更新元素的 innerHTML
   */
  setItemContent(id: string, content: string): void {
    const item = this.findItem(id)
    if (item) {
      item.element.innerHTML = content
    }
  }

  setOnItemClick(callback: (item: LayoutItem) => void): void {
    this.onItemClick = callback
  }

  override unmount(): void {
    super.unmount()
    // LayoutBuilder 不需要特殊的卸载逻辑
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    this._element = container
    this._mounted = true
    
    // 应用默认样式
    container.style.display = 'flex'
    container.style.flexDirection = this.direction
    container.style.padding = this.padding
    container.style.gap = this.gap
    container.style.boxSizing = 'border-box'  // 默认盒模型
    
    if (this.width) {
      container.style.width = this.width
    }
    
    if (this.height) {
      container.style.height = this.height
    }
    
    if (this.backgroundColor) {
      container.style.backgroundColor = this.backgroundColor
    }
    
    // Grid 布局的特殊处理
    if (this.layoutType === 'grid') {
      container.style.display = 'grid'
      container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))'
    }
    
    // Container 布局的特殊处理
    if (this.layoutType === 'container') {
      container.style.maxWidth = '1200px'
      container.style.marginLeft = 'auto'
      container.style.marginRight = 'auto'
    }
    
    // 应用自定义样式（会覆盖默认样式）
    if (this.customStyle.className) {
      container.className = this.customStyle.className
    }
    
    Object.keys(this.customStyle).forEach(key => {
      if (key !== 'className') {
        container.style.setProperty(key, this.customStyle[key])
      }
    })
    
    // 添加所有子元素
    this.items.forEach(item => {
      const child = item.element.cloneNode(true) as HTMLElement
      
      // 绑定点击事件
      if (this.onItemClick) {
        child.addEventListener('click', () => this.onItemClick!(item))
      }
      
      container.appendChild(child)
    })
    
    return container
  }
}

export default VueLayoutBuilderCommand

