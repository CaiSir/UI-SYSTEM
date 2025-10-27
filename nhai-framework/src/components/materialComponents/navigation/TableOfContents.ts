import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface TOCItem {
  id: string | number
  label: string
  href?: string
  level: number // 层级：1, 2, 3...
  disabled?: boolean
  active?: boolean
  children?: TOCItem[]
  onClick?: () => void
}

/**
 * Material UI Table of Contents 组件（目录栏）
 * 基于 Material UI 的命令式 API 实现
 */
export class MaterialTableOfContents extends NHAIWidget {
  private _items: TOCItem[] = []
  private _variant: 'default' | 'bordered' | 'compact' = 'default'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _indentSize: number = 16 // 每级缩进大小
  private _collapsible: boolean = true // 是否可折叠
  private _defaultExpandAll: boolean = false // 是否默认展开所有项
  private _expandedKeys: Set<string | number> = new Set()
  private _activeKey?: string | number
  private _onItemClick?: (item: TOCItem, index: number) => void

  constructor(parent?: NHAIObject) {
    super(parent)
    this._expandedKeys = new Set()
  }

  // 设置目录项
  setItems(items: TOCItem[]): void {
    this._items = items
    if (this._defaultExpandAll) {
      this.expandAll()
    }
  }

  items(): TOCItem[] {
    return this._items
  }

  // 添加目录项
  addItem(item: TOCItem): void {
    this._items.push(item)
  }

  // 移除目录项
  removeItem(id: string | number): void {
    this._items = this.removeItemRecursive(this._items, id)
  }

  private removeItemRecursive(items: TOCItem[], id: string | number): TOCItem[] {
    return items.filter(item => {
      if (item.id === id) {
        return false
      }
      if (item.children) {
        item.children = this.removeItemRecursive(item.children, id)
      }
      return true
    })
  }

  // 设置变体
  setVariant(variant: 'default' | 'bordered' | 'compact'): void {
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

  // 设置缩进大小
  setIndentSize(size: number): void {
    this._indentSize = size
  }

  indentSize(): number {
    return this._indentSize
  }

  // 设置是否可折叠
  setCollapsible(collapsible: boolean): void {
    this._collapsible = collapsible
  }

  collapsible(): boolean {
    return this._collapsible
  }

  // 设置默认展开全部
  setDefaultExpandAll(expandAll: boolean): void {
    this._defaultExpandAll = expandAll
  }

  defaultExpandAll(): boolean {
    return this._defaultExpandAll
  }

  // 展开指定项
  expand(key: string | number): void {
    this._expandedKeys.add(key)
  }

  // 折叠指定项
  collapse(key: string | number): void {
    this._expandedKeys.delete(key)
  }

  // 切换展开/折叠
  toggleExpand(key: string | number): void {
    if (this._expandedKeys.has(key)) {
      this._expandedKeys.delete(key)
    } else {
      this._expandedKeys.add(key)
    }
  }

  // 展开全部
  expandAll(): void {
    const keys = this.getAllKeys(this._items)
    keys.forEach(key => this._expandedKeys.add(key))
  }

  // 折叠全部
  collapseAll(): void {
    this._expandedKeys.clear()
  }

  // 获取所有有子项的键
  private getAllKeys(items: TOCItem[]): (string | number)[] {
    const keys: (string | number)[] = []
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        keys.push(item.id)
        keys.push(...this.getAllKeys(item.children))
      }
    })
    return keys
  }

  // 设置当前活动项
  setActiveKey(key?: string | number): void {
    this._activeKey = key
    this.updateItemActiveState(key)
  }

  activeKey(): string | number | undefined {
    return this._activeKey
  }

  // 更新活动状态
  private updateItemActiveState(activeKey?: string | number): void {
    const updateItems = (items: TOCItem[]) => {
      items.forEach(item => {
        item.active = item.id === activeKey
        if (item.children) {
          updateItems(item.children)
        }
      })
    }
    updateItems(this._items)
  }

  // 设置事件处理器
  setOnItemClick(handler: (item: TOCItem, index: number) => void): void {
    this._onItemClick = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-toc mui-toc--${this._variant} mui-toc--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        padding: this._variant === 'compact' ? '4px 0' : '8px 0'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = this._items.map((item, index) => 
      this.renderItem(adapter, item, index, 0)
    )

    return adapter.createElement('nav', containerProps, children)
  }

  private renderItem(adapter: any, item: TOCItem, index: number, indentLevel: number): any {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = hasChildren && this._expandedKeys.has(item.id)
    const isActive = item.active
    const paddingLeft = indentLevel * this._indentSize

    // 目录项容器
    const itemProps: any = {
      className: `mui-toc-item ${isActive ? 'mui-toc-item--active' : ''} ${item.disabled ? 'mui-toc-item--disabled' : ''}`,
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        padding: this.getPaddingSize(),
        paddingLeft: `${paddingLeft}px`,
        color: item.disabled ? 'rgba(0, 0, 0, 0.38)' : (isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.87)'),
        backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        borderLeft: this._variant === 'bordered' && isActive ? '3px solid #1976d2' : 'none',
        fontSize: this.getFontSize(),
        transition: 'all 0.2s ease-in-out'
      }
    }

    if (!item.disabled) {
      itemProps.onClick = () => this.handleItemClick(item, index)
      itemProps.onMouseEnter = () => {
        if (!isActive && !item.disabled) {
          itemProps.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
        }
      }
      itemProps.onMouseLeave = () => {
        if (!isActive && !item.disabled) {
          itemProps.style.backgroundColor = 'transparent'
        }
      }
    }

    const children: any[] = []

    // 折叠/展开图标
    if (hasChildren && this._collapsible) {
      const iconProps: any = {
        className: `mui-toc-icon mui-toc-icon--${isExpanded ? 'expanded' : 'collapsed'}`,
        style: {
          marginRight: '8px',
          transition: 'transform 0.2s ease-in-out',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          fontSize: '12px'
        }
      }
      children.push(adapter.createElement('span', iconProps, ['▶']))
    }

    // 文本内容
    const textProps: any = {
      className: 'mui-toc-text',
      style: {
        flex: 1,
        lineHeight: this.getLineHeight()
      }
    }
    children.push(adapter.createElement('span', textProps, [item.label]))

    // 如果有链接
    if (item.href && !item.disabled) {
      textProps.style.textDecoration = 'underline'
    }

    const itemElement = adapter.createElement('div', itemProps, children)

    // 子项
    if (hasChildren && isExpanded) {
      const childrenElements: any[] = item.children.map((child, childIndex) =>
        this.renderItem(adapter, child, childIndex, indentLevel + 1)
      )
      return adapter.createElement('div', { className: 'mui-toc-item-wrapper' }, [
        itemElement,
        ...childrenElements
      ])
    }

    return itemElement
  }

  private getPaddingSize(): string {
    const paddingMap: Record<string, string> = {
      small: '4px 8px',
      medium: '6px 12px',
      large: '8px 16px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.875rem',
      medium: '0.9375rem',
      large: '1rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getLineHeight(): string {
    const lineHeightMap: Record<string, string> = {
      small: '1.4',
      medium: '1.5',
      large: '1.6'
    }
    return lineHeightMap[this._size] || lineHeightMap.medium
  }

  private handleItemClick(item: TOCItem, index: number): void {
    if (item.disabled) return

    // 如果有子项且可折叠，切换展开/折叠
    if (item.children && item.children.length > 0 && this._collapsible) {
      this.toggleExpand(item.id)
    } else {
      // 触发点击事件
      if (item.onClick) {
        item.onClick()
      }

      if (this._onItemClick) {
        this._onItemClick(item, index)
      }

      // 设置活动项
      if (!item.children || item.children.length === 0) {
        this.setActiveKey(item.id)
      }

      // 如果是链接，处理跳转
      if (item.href) {
        // 可以在这里处理路由跳转或锚点跳转
        window.location.href = item.href
      }
    }
  }
}

