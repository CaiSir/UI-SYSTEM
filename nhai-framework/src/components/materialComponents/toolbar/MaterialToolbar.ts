import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'
import { NHAIObjectFactory } from '../../../factory/NHAIFactory'

/**
 * 工具栏布局类型枚举
 */
export enum ToolbarLayoutType {
  HORIZONTAL = 'horizontal',     // 水平布局
  VERTICAL = 'vertical',         // 垂直布局
  GRID = 'grid',                // 网格布局
  FLEX = 'flex',                // 弹性布局
  CUSTOM = 'custom'             // 自定义布局
}

/**
 * 工具栏对齐方式枚举
 */
export enum ToolbarAlignment {
  START = 'start',              // 开始对齐
  CENTER = 'center',            // 居中对齐
  END = 'end',                  // 结束对齐
  SPACE_BETWEEN = 'space-between', // 两端对齐
  SPACE_AROUND = 'space-around',   // 环绕对齐
  SPACE_EVENLY = 'space-evenly'    // 均匀对齐
}

/**
 * 工具栏项接口
 */
export interface ToolbarItem {
  id: string
  component: any
  label?: string
  icon?: string
  tooltip?: string
  visible?: boolean
  enabled?: boolean
  order?: number
  group?: string
  style?: Record<string, any>
  className?: string
}

/**
 * 工具栏组接口
 */
export interface ToolbarGroup {
  id: string
  label?: string
  items: ToolbarItem[]
  visible?: boolean
  collapsible?: boolean
  collapsed?: boolean
  separator?: boolean
}

/**
 * 工具栏配置接口
 */
export interface ToolbarConfig {
  layout: ToolbarLayoutType
  alignment: ToolbarAlignment
  spacing: number
  padding: number
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  shadow?: boolean
  height?: number | string
  width?: number | string
  responsive?: boolean
  theme?: 'light' | 'dark'
  gridColumns?: number
}

/**
 * 工具栏命令接口
 */
export interface ToolbarCommand {
  type: 'add' | 'remove' | 'update' | 'show' | 'hide' | 'enable' | 'disable' | 'reorder' | 'group'
  target?: string
  data?: any
}

/**
 * Material 工具栏组件
 * 支持命令式API动态添加控件和自定义布局
 */
export class MaterialToolbar extends NHAIWidget {
  private _config: ToolbarConfig = {
    layout: ToolbarLayoutType.HORIZONTAL,
    alignment: ToolbarAlignment.START,
    spacing: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderRadius: 4,
    shadow: true,
    height: 'auto',
    width: '100%',
    responsive: true,
    theme: 'light'
  }
  
  private _items: Map<string, ToolbarItem> = new Map()
  private _groups: Map<string, ToolbarGroup> = new Map()
  private _order: string[] = []
  private _container: HTMLElement | null = null
  private _isRendered: boolean = false

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // ========== 配置方法 ==========

  /**
   * 设置工具栏配置
   */
  setConfig(config: Partial<ToolbarConfig>): MaterialToolbar {
    this._config = { ...this._config, ...config }
    this.refresh()
    return this
  }

  /**
   * 获取工具栏配置
   */
  getConfig(): ToolbarConfig {
    return { ...this._config }
  }

  /**
   * 设置布局类型
   */
  setLayout(layout: ToolbarLayoutType): MaterialToolbar {
    this._config.layout = layout
    this.refresh()
    return this
  }

  /**
   * 设置对齐方式
   */
  setAlignment(alignment: ToolbarAlignment): MaterialToolbar {
    this._config.alignment = alignment
    this.refresh()
    return this
  }

  /**
   * 设置间距
   */
  setSpacing(spacing: number): MaterialToolbar {
    this._config.spacing = spacing
    this.refresh()
    return this
  }

  /**
   * 设置内边距
   */
  setPadding(padding: number): MaterialToolbar {
    this._config.padding = padding
    return this
  }

  /**
   * 设置主题
   */
  setTheme(theme: 'light' | 'dark'): MaterialToolbar {
    this._config.theme = theme
    this.refresh()
    return this
  }

  // ========== 命令式API方法 ==========

  /**
   * 添加按钮
   */
  addButton(id: string, text: string, onClick?: () => void, options?: Partial<ToolbarItem>): MaterialToolbar {
    const button = NHAIObjectFactory.createMaterialButton(text)
    if (onClick) {
      button.setOnClick(onClick)
    }
    
    const item: ToolbarItem = {
      id,
      component: button,
      label: text,
      visible: true,
      enabled: true,
      order: this._order.length,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加图标按钮
   */
  addIconButton(id: string, icon: string, onClick?: () => void, options?: Partial<ToolbarItem>): MaterialToolbar {
    const button = NHAIObjectFactory.createMaterialIconButton(icon)
    if (onClick) {
      button.setOnClick(onClick)
    }
    
    const item: ToolbarItem = {
      id,
      component: button,
      icon,
      visible: true,
      enabled: true,
      order: this._order.length,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加输入框
   */
  addInput(id: string, placeholder?: string, onChange?: (value: string) => void, options?: Partial<ToolbarItem>): MaterialToolbar {
    const input = NHAIObjectFactory.createMaterialInput()
    if (placeholder) {
      input.setPlaceholder(placeholder)
    }
    if (onChange) {
      input.setOnChange(onChange)
    }
    
    const item: ToolbarItem = {
      id,
      component: input,
      visible: true,
      enabled: true,
      order: this._order.length,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加选择框
   */
  addSelect(id: string, options: Array<{ value: string | number; label: string }>, onChange?: (value: any) => void, selectOptions?: Partial<ToolbarItem>): MaterialToolbar {
    const select = NHAIObjectFactory.createMaterialSelect()
    select.setOptions(options)
    if (onChange) {
      select.setOnChange(onChange)
    }
    
    const item: ToolbarItem = {
      id,
      component: select,
      visible: true,
      enabled: true,
      order: this._order.length,
      ...selectOptions
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加分隔符
   */
  addSeparator(id: string, options?: Partial<ToolbarItem>): MaterialToolbar {
    const separator = this.createSeparator()
    
    const item: ToolbarItem = {
      id,
      component: separator,
      visible: true,
      enabled: true,
      order: this._order.length,
      className: 'toolbar-separator',
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加标签
   */
  addLabel(id: string, text: string, options?: Partial<ToolbarItem>): MaterialToolbar {
    const label = NHAIObjectFactory.createLabel(text)
    
    const item: ToolbarItem = {
      id,
      component: label,
      label: text,
      visible: true,
      enabled: true,
      order: this._order.length,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加自定义组件
   */
  addCustomComponent(id: string, component: any, options?: Partial<ToolbarItem>): MaterialToolbar {
    const item: ToolbarItem = {
      id,
      component,
      visible: true,
      enabled: true,
      order: this._order.length,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加组件组
   */
  addGroup(id: string, label?: string, options?: Partial<ToolbarGroup>): MaterialToolbar {
    const group: ToolbarGroup = {
      id,
      label,
      items: [],
      visible: true,
      collapsible: false,
      collapsed: false,
      separator: true,
      ...options
    }
    
    this._groups.set(id, group)
    this.refresh()
    return this
  }

  /**
   * 向组中添加项目
   */
  addToGroup(groupId: string, item: ToolbarItem): MaterialToolbar {
    const group = this._groups.get(groupId)
    if (group) {
      group.items.push(item)
      this._items.set(item.id, item)
      this._order.push(item.id)
      this.refresh()
    }
    return this
  }

  // ========== 项目管理方法 ==========

  /**
   * 添加项目
   */
  private addItem(item: ToolbarItem): void {
    this._items.set(item.id, item)
    this._order.push(item.id)
    this.refresh()
  }

  /**
   * 移除项目
   */
  removeItem(id: string): MaterialToolbar {
    this._items.delete(id)
    this._order = this._order.filter(itemId => itemId !== id)
    this.refresh()
    return this
  }

  /**
   * 更新项目
   */
  updateItem(id: string, updates: Partial<ToolbarItem>): MaterialToolbar {
    const item = this._items.get(id)
    if (item) {
      Object.assign(item, updates)
      this.refresh()
    }
    return this
  }

  /**
   * 显示项目
   */
  showItem(id: string): MaterialToolbar {
    return this.updateItem(id, { visible: true })
  }

  /**
   * 隐藏项目
   */
  hideItem(id: string): MaterialToolbar {
    return this.updateItem(id, { visible: false })
  }

  /**
   * 启用项目
   */
  enableItem(id: string): MaterialToolbar {
    return this.updateItem(id, { enabled: true })
  }

  /**
   * 禁用项目
   */
  disableItem(id: string): MaterialToolbar {
    return this.updateItem(id, { enabled: false })
  }

  /**
   * 重新排序项目
   */
  reorderItems(order: string[]): MaterialToolbar {
    this._order = order.filter(id => this._items.has(id))
    this.refresh()
    return this
  }

  /**
   * 清空所有项目
   */
  clear(): MaterialToolbar {
    this._items.clear()
    this._groups.clear()
    this._order = []
    this.refresh()
    return this
  }

  // ========== 查询方法 ==========

  /**
   * 获取项目
   */
  getItem(id: string): ToolbarItem | undefined {
    return this._items.get(id)
  }

  /**
   * 获取所有项目
   */
  getItems(): ToolbarItem[] {
    return Array.from(this._items.values())
  }

  /**
   * 获取可见项目
   */
  getVisibleItems(): ToolbarItem[] {
    return this.getItems().filter(item => item.visible !== false)
  }

  /**
   * 获取组
   */
  getGroup(id: string): ToolbarGroup | undefined {
    return this._groups.get(id)
  }

  /**
   * 获取所有组
   */
  getGroups(): ToolbarGroup[] {
    return Array.from(this._groups.values())
  }

  // ========== 布局方法 ==========

  /**
   * 设置水平布局
   */
  horizontal(): MaterialToolbar {
    return this.setLayout(ToolbarLayoutType.HORIZONTAL)
  }

  /**
   * 设置垂直布局
   */
  vertical(): MaterialToolbar {
    return this.setLayout(ToolbarLayoutType.VERTICAL)
  }

  /**
   * 设置网格布局
   */
  grid(columns?: number): MaterialToolbar {
    this.setLayout(ToolbarLayoutType.GRID)
    if (columns) {
      this._config.gridColumns = columns
    }
    return this
  }

  /**
   * 设置弹性布局
   */
  flex(): MaterialToolbar {
    return this.setLayout(ToolbarLayoutType.FLEX)
  }

  /**
   * 设置自定义布局
   */
  custom(layoutFunction: (items: ToolbarItem[]) => any): MaterialToolbar {
    this.setLayout(ToolbarLayoutType.CUSTOM)
    this._customLayoutFunction = layoutFunction
    return this
  }

  // ========== 样式方法 ==========

  /**
   * 设置背景色
   */
  setBackgroundColor(color: string): MaterialToolbar {
    this._config.backgroundColor = color
    this.refresh()
    return this
  }

  /**
   * 设置边框色
   */
  setBorderColor(color: string): MaterialToolbar {
    this._config.borderColor = color
    this.refresh()
    return this
  }

  /**
   * 设置圆角
   */
  setBorderRadius(radius: number): MaterialToolbar {
    this._config.borderRadius = radius
    this.refresh()
    return this
  }

  /**
   * 设置阴影
   */
  setShadow(enabled: boolean): MaterialToolbar {
    this._config.shadow = enabled
    this.refresh()
    return this
  }

  /**
   * 设置尺寸
   */
  setSize(width?: number | string, height?: number | string): MaterialToolbar {
    if (width !== undefined) this._config.width = width
    if (height !== undefined) this._config.height = height
    this.refresh()
    return this
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const container = adapter.createElement('div', {
      className: this.buildToolbarClasses(),
      style: this.buildToolbarStyles()
    })

    this._container = container

    // 渲染项目
    this.renderItems(adapter, container)

    this._isRendered = true
    return container
  }

  /**
   * 刷新工具栏
   */
  refresh(): void {
    if (this._isRendered && this._container) {
      // 清空容器
      this._container.innerHTML = ''
      
      // 更新样式
      Object.assign(this._container.style, this.buildToolbarStyles())
      this._container.className = this.buildToolbarClasses()
      
      // 重新渲染项目
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (adapter) {
        this.renderItems(adapter, this._container)
      }
    }
  }

  /**
   * 渲染项目
   */
  private renderItems(adapter: any, container: HTMLElement): void {
    const visibleItems = this.getVisibleItems()
    
    // 按顺序渲染项目
    this._order.forEach(itemId => {
      const item = this._items.get(itemId)
      if (item && item.visible !== false) {
        const itemElement = this.renderItem(adapter, item)
        if (itemElement) {
          container.appendChild(itemElement)
        }
      }
    })
  }

  /**
   * 渲染单个项目
   */
  private renderItem(adapter: any, item: ToolbarItem): HTMLElement | null {
    try {
      const itemElement = adapter.createElement('div', {
        className: this.buildItemClasses(item),
        style: this.buildItemStyles(item)
      })

      // 渲染组件
      const componentElement = item.component.render()
      if (componentElement) {
        itemElement.appendChild(componentElement)
      }

      // 添加工具提示
      if (item.tooltip) {
        itemElement.title = item.tooltip
      }

      return itemElement
    } catch (error) {
      console.error('渲染工具栏项目失败:', error)
      return null
    }
  }

  /**
   * 构建工具栏类名
   */
  private buildToolbarClasses(): string {
    let classes = ['material-toolbar']
    
    classes.push(`toolbar-${this._config.layout}`)
    classes.push(`toolbar-${this._config.alignment}`)
    
    if (this._config.theme) {
      classes.push(`toolbar-${this._config.theme}`)
    }
    
    if (this._config.shadow) {
      classes.push('toolbar-shadow')
    }
    
    if (this._config.responsive) {
      classes.push('toolbar-responsive')
    }
    
    if (this._className) {
      classes.push(this._className)
    }
    
    return classes.join(' ')
  }

  /**
   * 构建工具栏样式
   */
  private buildToolbarStyles(): Record<string, any> {
    const styles: Record<string, any> = {
      display: 'flex',
      alignItems: 'center',
      gap: `${this._config.spacing}px`,
      padding: `${this._config.padding}px`,
      backgroundColor: this._config.backgroundColor,
      border: `1px solid ${this._config.borderColor}`,
      borderRadius: `${this._config.borderRadius}px`,
      width: this._config.width,
      height: this._config.height,
      boxSizing: 'border-box'
    }

    // 布局特定样式
    switch (this._config.layout) {
      case ToolbarLayoutType.HORIZONTAL:
        styles.flexDirection = 'row'
        styles.justifyContent = this.getAlignmentValue()
        break
      case ToolbarLayoutType.VERTICAL:
        styles.flexDirection = 'column'
        styles.alignItems = this.getAlignmentValue()
        break
      case ToolbarLayoutType.GRID:
        styles.display = 'grid'
        styles.gridTemplateColumns = `repeat(${this._config.gridColumns || 'auto-fit'}, minmax(0, 1fr))`
        break
      case ToolbarLayoutType.FLEX:
        styles.flexWrap = 'wrap'
        break
    }

    // 阴影
    if (this._config.shadow) {
      styles.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
    }

    return styles
  }

  /**
   * 构建项目类名
   */
  private buildItemClasses(item: ToolbarItem): string {
    let classes = ['toolbar-item']
    
    if (item.className) {
      classes.push(item.className)
    }
    
    if (item.enabled === false) {
      classes.push('toolbar-item-disabled')
    }
    
    return classes.join(' ')
  }

  /**
   * 构建项目样式
   */
  private buildItemStyles(item: ToolbarItem): Record<string, any> {
    const styles: Record<string, any> = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }

    if (item.style) {
      Object.assign(styles, item.style)
    }

    if (item.enabled === false) {
      styles.opacity = '0.5'
      styles.pointerEvents = 'none'
    }

    return styles
  }

  /**
   * 获取对齐值
   */
  private getAlignmentValue(): string {
    switch (this._config.alignment) {
      case ToolbarAlignment.START:
        return 'flex-start'
      case ToolbarAlignment.CENTER:
        return 'center'
      case ToolbarAlignment.END:
        return 'flex-end'
      case ToolbarAlignment.SPACE_BETWEEN:
        return 'space-between'
      case ToolbarAlignment.SPACE_AROUND:
        return 'space-around'
      case ToolbarAlignment.SPACE_EVENLY:
        return 'space-evenly'
      default:
        return 'flex-start'
    }
  }

  /**
   * 创建分隔符
   */
  private createSeparator(): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      return null
    }

    return adapter.createElement('div', {
      className: 'toolbar-separator',
      style: {
        width: '1px',
        height: '20px',
        backgroundColor: '#e0e0e0',
        margin: '0 4px'
      }
    })
  }

  // ========== 私有属性 ==========
  
  private _customLayoutFunction?: (items: ToolbarItem[]) => any
  private _gridColumns?: number
}