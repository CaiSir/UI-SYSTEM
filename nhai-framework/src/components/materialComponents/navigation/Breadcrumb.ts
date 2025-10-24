import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface BreadcrumbItem {
  id: string | number
  label: string
  href?: string
  disabled?: boolean
  onClick?: () => void
}

/**
 * Material UI Breadcrumb 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialBreadcrumb extends NHAIWidget {
  private _items: BreadcrumbItem[] = []
  private _separator: string = '/'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _maxItems: number = 8
  private _showFirstLast: boolean = true
  private _onItemClick?: (item: BreadcrumbItem, index: number) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置面包屑项
  setItems(items: BreadcrumbItem[]): void {
    this._items = items
  }

  items(): BreadcrumbItem[] {
    return this._items
  }

  // 添加面包屑项
  addItem(item: BreadcrumbItem): void {
    this._items.push(item)
  }

  // 移除面包屑项
  removeItem(id: string | number): void {
    this._items = this._items.filter(item => item.id !== id)
  }

  // 设置分隔符
  setSeparator(separator: string): void {
    this._separator = separator
  }

  separator(): string {
    return this._separator
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置最大项数
  setMaxItems(maxItems: number): void {
    this._maxItems = maxItems
  }

  maxItems(): number {
    return this._maxItems
  }

  // 设置显示首尾项
  setShowFirstLast(showFirstLast: boolean): void {
    this._showFirstLast = showFirstLast
  }

  showFirstLast(): boolean {
    return this._showFirstLast
  }

  // 设置事件处理器
  setOnItemClick(handler: (item: BreadcrumbItem, index: number) => void): void {
    this._onItemClick = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-breadcrumb mui-breadcrumb--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: this.getFontSize(),
        color: 'rgba(0, 0, 0, 0.6)'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = []
    const displayItems = this.getDisplayItems()

    displayItems.forEach((item, index) => {
      // 面包屑项
      const itemProps: any = {
        className: `mui-breadcrumb-item ${item.disabled ? 'mui-breadcrumb-item--disabled' : ''}`,
        style: {
          display: 'flex',
          alignItems: 'center',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          color: item.disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.87)',
          textDecoration: 'none',
          transition: 'color 0.2s ease-in-out',
          opacity: item.disabled ? 0.6 : 1
        }
      }

      if (!item.disabled) {
        itemProps.onClick = () => this.handleItemClick(item, index)
        itemProps.onMouseEnter = () => {
          itemProps.style.color = '#1976d2'
        }
        itemProps.onMouseLeave = () => {
          itemProps.style.color = 'rgba(0, 0, 0, 0.87)'
        }
      }

      if (item.href && !item.disabled) {
        itemProps.href = item.href
        itemProps.style.textDecoration = 'underline'
      }

      itemProps.children = [item.label]
      children.push(adapter.createElement('a', itemProps))

      // 分隔符
      if (index < displayItems.length - 1) {
        const separatorProps: any = {
          className: 'mui-breadcrumb-separator',
          style: {
            margin: '0 8px',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: this.getFontSize()
          }
        }
        children.push(adapter.createElement('span', separatorProps, [this._separator]))
      }
    })

    return adapter.createElement('nav', containerProps, children)
  }

  private getDisplayItems(): BreadcrumbItem[] {
    if (this._items.length <= this._maxItems) {
      return this._items
    }

    if (this._showFirstLast) {
      // 显示第一项、省略号、最后几项
      const firstItem = this._items[0]
      const lastItems = this._items.slice(-(this._maxItems - 2))
      
      return [
        firstItem,
        { id: 'ellipsis', label: '...', disabled: true },
        ...lastItems
      ]
    } else {
      // 只显示最后几项
      return this._items.slice(-this._maxItems)
    }
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private handleItemClick(item: BreadcrumbItem, index: number): void {
    if (item.disabled) return

    if (item.onClick) {
      item.onClick()
    }

    if (this._onItemClick) {
      this._onItemClick(item, index)
    }
  }
}
