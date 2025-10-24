import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface MenuItem {
  id: string | number
  label: string
  icon?: string
  disabled?: boolean
  children?: MenuItem[]
  onClick?: () => void
}

/**
 * Material UI Menu 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialMenu extends NHAIWidget {
  private _items: MenuItem[] = []
  private _variant: 'horizontal' | 'vertical' = 'horizontal'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _color: 'primary' | 'secondary' | 'default' = 'primary'
  private _selectedKeys: (string | number)[] = []
  private _openKeys: (string | number)[] = []
  private _mode: 'horizontal' | 'vertical' | 'inline' = 'horizontal'
  private _theme: 'light' | 'dark' = 'light'
  private _onSelect?: (selectedKeys: (string | number)[]) => void
  private _onOpenChange?: (openKeys: (string | number)[]) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置菜单项
  setItems(items: MenuItem[]): void {
    this._items = items
  }

  items(): MenuItem[] {
    return this._items
  }

  // 添加菜单项
  addItem(item: MenuItem): void {
    this._items.push(item)
  }

  // 移除菜单项
  removeItem(id: string | number): void {
    this._items = this.removeItemRecursive(this._items, id)
  }

  private removeItemRecursive(items: MenuItem[], id: string | number): MenuItem[] {
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
  setVariant(variant: 'horizontal' | 'vertical'): void {
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

  // 设置颜色
  setColor(color: 'primary' | 'secondary' | 'default'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置选中键
  setSelectedKeys(keys: (string | number)[]): void {
    this._selectedKeys = keys
  }

  selectedKeys(): (string | number)[] {
    return this._selectedKeys
  }

  // 设置打开键
  setOpenKeys(keys: (string | number)[]): void {
    this._openKeys = keys
  }

  openKeys(): (string | number)[] {
    return this._openKeys
  }

  // 设置模式
  setMode(mode: 'horizontal' | 'vertical' | 'inline'): void {
    this._mode = mode
  }

  mode(): string {
    return this._mode
  }

  // 设置主题
  setTheme(theme: 'light' | 'dark'): void {
    this._theme = theme
  }

  theme(): string {
    return this._theme
  }

  // 设置事件处理器
  setOnSelect(handler: (selectedKeys: (string | number)[]) => void): void {
    this._onSelect = handler
  }

  setOnOpenChange(handler: (openKeys: (string | number)[]) => void): void {
    this._onOpenChange = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const menuProps: any = {
      className: `mui-menu mui-menu--${this._mode} mui-menu--${this._size} mui-menu--${this._theme}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        flexDirection: this._mode === 'vertical' ? 'column' : 'row',
        backgroundColor: this._theme === 'dark' ? '#1f1f1f' : '#ffffff',
        color: this._theme === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
        borderRadius: '4px',
        overflow: 'hidden',
        ...this.getMenuStyles()
      }
    }

    if (this._id) menuProps.id = this._id
    if (this._className) menuProps.className += ` ${this._className}`

    const children = this._items.map(item => this.renderMenuItem(item, adapter, _context))
    return adapter.createElement('div', menuProps, children)
  }

  private renderMenuItem(item: MenuItem, adapter: any, context?: NHAIRenderContext): any {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = this._openKeys.includes(item.id)
    const isSelected = this._selectedKeys.includes(item.id)

    const itemProps: any = {
      className: `mui-menu-item ${isSelected ? 'mui-menu-item--selected' : ''} ${item.disabled ? 'mui-menu-item--disabled' : ''}`,
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: this.getPadding(),
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isSelected ? this.getSelectedColor() : 'transparent',
        color: item.disabled ? 'rgba(0, 0, 0, 0.38)' : (isSelected ? this.getSelectedTextColor() : 'inherit'),
        transition: 'all 0.2s ease-in-out',
        opacity: item.disabled ? 0.6 : 1,
        fontSize: this.getFontSize(),
        fontWeight: isSelected ? '500' : '400',
        ...this.getItemStyles()
      }
    }

    if (!item.disabled) {
      itemProps.onClick = () => this.handleItemClick(item)
      itemProps.onMouseEnter = () => {
        if (!isSelected) {
          itemProps.style.backgroundColor = this.getHoverColor()
        }
      }
      itemProps.onMouseLeave = () => {
        if (!isSelected) {
          itemProps.style.backgroundColor = 'transparent'
        }
      }
    }

    const itemChildren = []

    // 图标
    if (item.icon) {
      const iconProps: any = {
        className: 'mui-menu-item-icon',
        style: {
          marginRight: '8px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center'
        }
      }
      itemChildren.push(adapter.createElement('span', iconProps, [item.icon]))
    }

    // 标签
    const labelProps: any = {
      className: 'mui-menu-item-label',
      style: {
        flex: 1
      }
    }
    itemChildren.push(adapter.createElement('span', labelProps, [item.label]))

    // 展开/折叠图标
    if (hasChildren) {
      const expandIconProps: any = {
        className: 'mui-menu-item-expand',
        style: {
          marginLeft: '8px',
          fontSize: '12px',
          transition: 'transform 0.2s ease-in-out',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }
      }
      itemChildren.push(adapter.createElement('span', expandIconProps, ['▶']))
    }

    itemProps.children = itemChildren

    // 子菜单
    if (hasChildren && isOpen) {
      const submenuProps: any = {
        className: 'mui-menu-submenu',
        style: {
          position: 'absolute',
          top: '100%',
          left: '0',
          minWidth: '200px',
          backgroundColor: this._theme === 'dark' ? '#2f2f2f' : '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          ...this.getSubmenuStyles()
        }
      }

      const submenuChildren = item.children!.map(child => this.renderMenuItem(child, adapter, context))
      submenuProps.children = submenuChildren

      return adapter.createElement('div', { className: 'mui-menu-item-container' }, [
        adapter.createElement('div', itemProps),
        adapter.createElement('div', submenuProps)
      ])
    }

    return adapter.createElement('div', itemProps)
  }

  private getPadding(): string {
    const paddingMap: Record<string, string> = {
      small: '6px 12px',
      medium: '8px 16px',
      large: '12px 20px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getMenuStyles(): Record<string, any> {
    if (this._mode === 'horizontal') {
      return {
        flexDirection: 'row',
        alignItems: 'center'
      }
    } else {
      return {
        flexDirection: 'column',
        alignItems: 'stretch'
      }
    }
  }

  private getItemStyles(): Record<string, any> {
    if (this._mode === 'horizontal') {
      return {
        borderBottom: '2px solid transparent',
        borderBottomColor: this._selectedKeys.length > 0 ? this.getSelectedColor() : 'transparent'
      }
    } else {
      return {
        borderLeft: '3px solid transparent',
        borderLeftColor: this._selectedKeys.length > 0 ? this.getSelectedColor() : 'transparent'
      }
    }
  }

  private getSubmenuStyles(): Record<string, any> {
    if (this._mode === 'horizontal') {
      return {
        top: '100%',
        left: '0'
      }
    } else {
      return {
        top: '0',
        left: '100%'
      }
    }
  }

  private getSelectedColor(): string {
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      default: '#f5f5f5'
    }
    return colorMap[this._color] || colorMap.primary
  }

  private getSelectedTextColor(): string {
    return this._color === 'default' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff'
  }

  private getHoverColor(): string {
    return this._theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
  }

  private handleItemClick(item: MenuItem): void {
    if (item.disabled) return

    // 处理子菜单展开/折叠
    if (item.children && item.children.length > 0) {
      const isOpen = this._openKeys.includes(item.id)
      if (isOpen) {
        this._openKeys = this._openKeys.filter(key => key !== item.id)
      } else {
        this._openKeys.push(item.id)
      }

      if (this._onOpenChange) {
        this._onOpenChange([...this._openKeys])
      }
    } else {
      // 处理选中
      this._selectedKeys = [item.id]

      if (this._onSelect) {
        this._onSelect([...this._selectedKeys])
      }
    }

    // 执行点击回调
    if (item.onClick) {
      item.onClick()
    }
  }
}
