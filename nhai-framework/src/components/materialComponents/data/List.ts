import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface ListItem {
  id: string | number
  title: string
  description?: string
  avatar?: string
  icon?: string
  actions?: Array<{
    label: string
    onClick: () => void
  }>
  [key: string]: any
}

/**
 * Material UI List 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialList extends NHAIWidget {
  private _items: ListItem[] = []
  private _loading: boolean = false
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _dense: boolean = false
  private _bordered: boolean = false
  private _selectable: boolean = false
  private _selectedItems: (string | number)[] = []
  private _onItemClick?: (item: ListItem, index: number) => void
  private _onItemSelect?: (selectedItems: (string | number)[]) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置列表项
  setItems(items: ListItem[]): void {
    this._items = items
  }

  items(): ListItem[] {
    return this._items
  }

  // 添加列表项
  addItem(item: ListItem): void {
    this._items.push(item)
  }

  // 移除列表项
  removeItem(id: string | number): void {
    this._items = this._items.filter(item => item.id !== id)
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

  // 设置密集模式
  setDense(dense: boolean): void {
    this._dense = dense
  }

  dense(): boolean {
    return this._dense
  }

  // 设置边框
  setBordered(bordered: boolean): void {
    this._bordered = bordered
  }

  bordered(): boolean {
    return this._bordered
  }

  // 设置可选择
  setSelectable(selectable: boolean): void {
    this._selectable = selectable
  }

  selectable(): boolean {
    return this._selectable
  }

  // 设置选中项
  setSelectedItems(selectedItems: (string | number)[]): void {
    this._selectedItems = selectedItems
  }

  selectedItems(): (string | number)[] {
    return this._selectedItems
  }

  // 设置事件处理器
  setOnItemClick(handler: (item: ListItem, index: number) => void): void {
    this._onItemClick = handler
  }

  setOnItemSelect(handler: (selectedItems: (string | number)[]) => void): void {
    this._onItemSelect = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-list-container mui-list-container--${this._size} ${this._dense ? 'mui-list-container--dense' : ''}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: this._bordered ? '4px' : '0',
        border: this._bordered ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        overflow: 'hidden'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = []

    // 列表项
    this._items.forEach((item, index) => {
      const itemProps: any = {
        className: `mui-list-item ${this._selectedItems.includes(item.id) ? 'mui-list-item--selected' : ''}`,
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: this.getItemPadding(),
          borderBottom: index < this._items.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
          cursor: this._onItemClick ? 'pointer' : 'default',
          backgroundColor: this._selectedItems.includes(item.id) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          transition: 'background-color 0.2s ease-in-out'
        }
      }

      if (this._onItemClick) {
        itemProps.onClick = () => this._onItemClick!(item, index)
      }

      if (this._selectable) {
        itemProps.onClick = () => this.handleItemSelect(item.id)
      }

      const itemChildren = []

      // 选择框
      if (this._selectable) {
        const checkboxProps: any = {
          className: 'mui-list-checkbox',
          style: {
            marginRight: '12px',
            width: '16px',
            height: '16px',
            cursor: 'pointer'
          },
          type: 'checkbox',
          checked: this._selectedItems.includes(item.id)
        }

        checkboxProps.onChange = (e: any) => {
          e.stopPropagation()
          this.handleItemSelect(item.id)
        }

        itemChildren.push(adapter.createElement('input', checkboxProps))
      }

      // 头像/图标
      if (item.avatar || item.icon) {
        const avatarProps: any = {
          className: 'mui-list-avatar',
          style: {
            width: this.getAvatarSize(),
            height: this.getAvatarSize(),
            borderRadius: '50%',
            marginRight: '12px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: this.getAvatarSize() === '32px' ? '16px' : '20px',
            color: 'rgba(0, 0, 0, 0.6)'
          }
        }

        if (item.avatar) {
          avatarProps.style.backgroundImage = `url(${item.avatar})`
          avatarProps.style.backgroundSize = 'cover'
          avatarProps.style.backgroundPosition = 'center'
        } else {
          avatarProps.children = [item.icon]
        }

        itemChildren.push(adapter.createElement('div', avatarProps))
      }

      // 内容区域
      const contentProps: any = {
        className: 'mui-list-content',
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }
      }

      const contentChildren = []

      // 标题
      const titleProps: any = {
        className: 'mui-list-title',
        style: {
          fontSize: this.getFontSize().title,
          fontWeight: '500',
          color: 'rgba(0, 0, 0, 0.87)',
          lineHeight: '1.2'
        }
      }
      contentChildren.push(adapter.createElement('div', titleProps, [item.title]))

      // 描述
      if (item.description) {
        const descProps: any = {
          className: 'mui-list-description',
          style: {
            fontSize: this.getFontSize().description,
            color: 'rgba(0, 0, 0, 0.6)',
            lineHeight: '1.4'
          }
        }
        contentChildren.push(adapter.createElement('div', descProps, [item.description]))
      }

      contentProps.children = contentChildren
      itemChildren.push(adapter.createElement('div', contentProps))

      // 操作按钮
      if (item.actions && item.actions.length > 0) {
        const actionsProps: any = {
          className: 'mui-list-actions',
          style: {
            display: 'flex',
            gap: '8px',
            marginLeft: '12px'
          }
        }

        const actionButtons = item.actions.map(action => {
          const buttonProps: any = {
            className: 'mui-list-action-button',
            style: {
              padding: '4px 8px',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.87)',
              cursor: 'pointer',
              fontSize: '0.875rem',
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
        itemChildren.push(adapter.createElement('div', actionsProps))
      }

      itemProps.children = itemChildren
      children.push(adapter.createElement('div', itemProps))
    })

    return adapter.createElement('div', containerProps, children)
  }

  private getItemPadding(): string {
    if (this._dense) {
      return this._size === 'small' ? '8px 12px' : '12px 16px'
    }
    return this._size === 'small' ? '12px 16px' : this._size === 'medium' ? '16px 20px' : '20px 24px'
  }

  private getAvatarSize(): string {
    if (this._dense) {
      return this._size === 'small' ? '24px' : '32px'
    }
    return this._size === 'small' ? '32px' : this._size === 'medium' ? '40px' : '48px'
  }

  private getFontSize(): Record<string, string> {
    const sizeMap: Record<string, Record<string, string>> = {
      small: {
        title: '0.875rem',
        description: '0.75rem'
      },
      medium: {
        title: '1rem',
        description: '0.875rem'
      },
      large: {
        title: '1.125rem',
        description: '1rem'
      }
    }
    
    return sizeMap[this._size] || sizeMap.medium
  }

  private handleItemSelect(itemId: string | number): void {
    if (!this._selectable) return

    const index = this._selectedItems.indexOf(itemId)
    if (index > -1) {
      this._selectedItems.splice(index, 1)
    } else {
      this._selectedItems.push(itemId)
    }

    if (this._onItemSelect) {
      this._onItemSelect([...this._selectedItems])
    }
  }
}
