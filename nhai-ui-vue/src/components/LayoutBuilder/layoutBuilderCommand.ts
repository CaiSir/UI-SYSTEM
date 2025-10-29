import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

/**
 * 布局项接口
 */
export interface LayoutItem {
  id: string
  element: HTMLElement
  data?: any
}

// 类型定义
export interface LayoutBuilderOptions extends IBaseCommandProps {
  layoutType?: 'vbox' | 'hbox' | 'grid' | 'container'
  direction?: 'row' | 'column'
  spacing?: number
  padding?: string
  gap?: string
  width?: string
  height?: string
  backgroundColor?: string
  onItemClick?: (item: LayoutItem) => void
}

export interface LayoutBuilderEvents extends IBaseCommandEvents {
  itemClick: (item: LayoutItem) => void
}

/**
 * 布局构建器命令式 API
 * 提供灵活的布局管理，支持 vbox、hbox、grid、container 等布局方式
 * 允许通过命令式 API 动态构建和管理复杂布局
 */
export class NhaiLayoutBuilderCommand extends BaseCommand<LayoutBuilderOptions, LayoutBuilderEvents> {
  private layoutType: 'vbox' | 'hbox' | 'grid' | 'container' = 'vbox'
  private direction: 'row' | 'column' = 'column'
  private _spacing: number = 0
  private padding: string = '0'
  private gap: string = '8px'
  private width?: string
  private height?: string
  private backgroundColor?: string
  private items: LayoutItem[] = []
  private _onItemClick?: (item: LayoutItem) => void
  private customStyle: Record<string, string> = {}  // 自定义样式

  /**
   * 创建布局构建器
   * @param layoutTypeOrOptions - 布局类型或选项对象
   */
  constructor(layoutTypeOrOptions: 'vbox' | 'hbox' | 'grid' | 'container' | LayoutBuilderOptions = 'vbox') {
    const options: LayoutBuilderOptions = typeof layoutTypeOrOptions === 'string'
      ? { layoutType: layoutTypeOrOptions }
      : layoutTypeOrOptions
    super(options)
    
    this.layoutType = options.layoutType ?? 'vbox'
    this.direction = options.direction ?? (this.layoutType === 'hbox' ? 'row' : 'column')
    this._spacing = options.spacing ?? 0
    this.padding = options.padding ?? '0'
    this.gap = options.gap ?? '8px'
    this.width = options.width
    this.height = options.height
    this.backgroundColor = options.backgroundColor
    this._onItemClick = options.onItemClick
    
    Object.assign(this._props, {
      layoutType: this.layoutType,
      direction: this.direction,
      spacing: this._spacing,
      padding: this.padding,
      gap: this.gap,
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      ...options
    })
  }

  setLayoutType(type: 'vbox' | 'hbox' | 'grid' | 'container'): this {
    this.layoutType = type
    if (type === 'hbox') {
      this.direction = 'row'
    } else if (type === 'vbox') {
      this.direction = 'column'
    }
    this.setProperty('layoutType', type)
    this.setProperty('direction', this.direction)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setDirection(direction: 'row' | 'column'): this {
    this.direction = direction
    this.setProperty('direction', direction)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setSpacing(spacing: number): this {
    this._spacing = spacing
    this.gap = `${spacing * 8}px`
    this.setProperty('spacing', spacing)
    this.setProperty('gap', this.gap)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getSpacing(): number {
    return this.getProperty('spacing') ?? this._spacing
  }

  setPadding(padding: string): this {
    this.padding = padding
    this.setProperty('padding', padding)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setGap(gap: string): this {
    this.gap = gap
    this.setProperty('gap', gap)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
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
   * 设置自定义样式（覆盖默认样式）
   */
  setStyle(style: Record<string, string>): this {
    this.customStyle = { ...this.customStyle, ...style }
    if (this._element) {
      Object.keys(style).forEach(key => {
        if (key !== 'className') {
          this._element!.style.setProperty(key, style[key])
        }
      })
    }
    return this
  }

  /**
   * 添加自定义样式类名
   */
  setClassName(className: string): this {
    super.setClassName(className)
    if (this.customStyle) {
      this.customStyle.className = className
    }
    return this
  }

  /**
   * 添加元素到布局
   * @param id - 元素唯一标识
   * @param element - DOM 元素
   * @param data - 附加数据
   */
  addElement(id: string, element: HTMLElement, data?: any): void {
    this.items.push({ id, element, data })
  }

  /**
   * 添加组件（自动调用 render 方法）
   */
  addWidget(id: string, widget: any, data?: any): void {
    if (widget && typeof widget.render === 'function') {
      const element = widget.render()
      this.items.push({ id, element, data })
      
      // 同时添加为子组件（兼容 BaseCommand 的 addChild）
      super.addChild(widget as BaseCommand)
    }
  }

  /**
   * 重写 addChild 以兼容 BaseCommand
   */
  override addChild(child: BaseCommand<any, any>): this {
    // 添加为子组件
    super.addChild(child)
    
    // 如果已渲染，添加到 items
    if (child.isMounted() && child.getElement()) {
      this.items.push({ 
        id: `${Date.now()}-${Math.random()}`,
        element: child.getElement()!,
        data: child.getProperties()
      })
    }
    return this
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

  setOnItemClick(callback: (item: LayoutItem) => void): this {
    this._onItemClick = callback
    this.setProperty('onItemClick', callback)
    return this
  }

  override unmount(): void {
    super.unmount()
    // LayoutBuilder 不需要特殊的卸载逻辑
  }

  protected doRender(): HTMLElement {
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
      if (this._onItemClick) {
        child.addEventListener('click', () => {
          if (this._onItemClick) {
            this._onItemClick(item)
          }
          this.emit('itemClick', item)
        })
      }
      
      container.appendChild(child)
    })
    
    return container
  }
}

export default NhaiLayoutBuilderCommand

