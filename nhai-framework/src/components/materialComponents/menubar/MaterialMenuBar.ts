import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * 菜单栏布局类型枚举
 */
export enum MenuBarLayoutType {
  HORIZONTAL = 'horizontal',     // 水平菜单栏
  VERTICAL = 'vertical',          // 垂直菜单栏
  DROPDOWN = 'dropdown',          // 下拉菜单栏
  CONTEXT = 'context'             // 上下文菜单栏
}

/**
 * 菜单项类型枚举
 */
export enum MenuItemType {
  ITEM = 'item',                  // 普通菜单项
  SUBMENU = 'submenu',            // 子菜单
  SEPARATOR = 'separator',        // 分隔符
  CHECKBOX = 'checkbox',          // 复选框菜单项
  RADIO = 'radio',                // 单选菜单项
  GROUP = 'group'                 // 菜单组
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  id: string
  type: MenuItemType
  label?: string
  icon?: string
  shortcut?: string
  tooltip?: string
  visible?: boolean
  enabled?: boolean
  checked?: boolean
  children?: MenuItem[]
  onClick?: () => void
  onToggle?: (checked: boolean) => void
  style?: Record<string, any>
  className?: string
  group?: string
}

/**
 * 菜单栏配置接口
 */
export interface MenuBarConfig {
  layout: MenuBarLayoutType
  theme?: 'light' | 'dark'
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  shadow?: boolean
  height?: number | string
  width?: number | string
  responsive?: boolean
  showShortcuts?: boolean
  showIcons?: boolean
  animation?: boolean
}

/**
 * Material 菜单栏组件
 * 支持动态添加菜单项和子菜单
 */
export class MaterialMenuBar extends NHAIWidget {
  private _config: MenuBarConfig = {
    layout: MenuBarLayoutType.HORIZONTAL,
    theme: 'light',
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderRadius: 4,
    shadow: true,
    height: 'auto',
    width: '100%',
    responsive: true,
    showShortcuts: true,
    showIcons: true,
    animation: true
  }
  
  private _items: Map<string, MenuItem> = new Map()
  private _order: string[] = []
  private _container: HTMLElement | null = null
  private _isRendered: boolean = false
  private _activeSubmenu: string | null = null

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // ========== 配置方法 ==========

  /**
   * 设置菜单栏配置
   */
  setConfig(config: Partial<MenuBarConfig>): MaterialMenuBar {
    this._config = { ...this._config, ...config }
    this.refresh()
    return this
  }

  /**
   * 获取菜单栏配置
   */
  getConfig(): MenuBarConfig {
    return { ...this._config }
  }

  /**
   * 设置布局类型
   */
  setLayout(layout: MenuBarLayoutType): MaterialMenuBar {
    this._config.layout = layout
    this.refresh()
    return this
  }

  /**
   * 设置主题
   */
  setTheme(theme: 'light' | 'dark'): MaterialMenuBar {
    this._config.theme = theme
    this.refresh()
    return this
  }

  /**
   * 设置背景色
   */
  setBackgroundColor(color: string): MaterialMenuBar {
    this._config.backgroundColor = color
    this.refresh()
    return this
  }

  /**
   * 设置边框色
   */
  setBorderColor(color: string): MaterialMenuBar {
    this._config.borderColor = color
    this.refresh()
    return this
  }

  /**
   * 设置圆角
   */
  setBorderRadius(radius: number): MaterialMenuBar {
    this._config.borderRadius = radius
    this.refresh()
    return this
  }

  /**
   * 设置阴影
   */
  setShadow(enabled: boolean): MaterialMenuBar {
    this._config.shadow = enabled
    this.refresh()
    return this
  }

  /**
   * 设置尺寸
   */
  setSize(width?: number | string, height?: number | string): MaterialMenuBar {
    if (width !== undefined) this._config.width = width
    if (height !== undefined) this._config.height = height
    this.refresh()
    return this
  }

  // ========== 命令式API方法 ==========

  /**
   * 添加菜单项
   */
  addMenuItem(id: string, label: string, onClick?: () => void, options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.ITEM,
      label,
      visible: true,
      enabled: true,
      onClick,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加带图标的菜单项
   */
  addIconMenuItem(id: string, label: string, icon: string, onClick?: () => void, options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.ITEM,
      label,
      icon,
      visible: true,
      enabled: true,
      onClick,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加带快捷键的菜单项
   */
  addShortcutMenuItem(id: string, label: string, shortcut: string, onClick?: () => void, options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.ITEM,
      label,
      shortcut,
      visible: true,
      enabled: true,
      onClick,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加子菜单
   */
  addSubmenu(id: string, label: string, children: MenuItem[], options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.SUBMENU,
      label,
      children,
      visible: true,
      enabled: true,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加分隔符
   */
  addSeparator(id: string, options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.SEPARATOR,
      visible: true,
      enabled: true,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加复选框菜单项
   */
  addCheckboxMenuItem(id: string, label: string, checked: boolean = false, onToggle?: (checked: boolean) => void, options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.CHECKBOX,
      label,
      checked,
      visible: true,
      enabled: true,
      onToggle,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加单选菜单项
   */
  addRadioMenuItem(id: string, label: string, checked: boolean = false, group: string = 'default', onToggle?: (checked: boolean) => void, options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.RADIO,
      label,
      checked,
      group,
      visible: true,
      enabled: true,
      onToggle,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  /**
   * 添加菜单组
   */
  addMenuGroup(id: string, label: string, children: MenuItem[], options?: Partial<MenuItem>): MaterialMenuBar {
    const item: MenuItem = {
      id,
      type: MenuItemType.GROUP,
      label,
      children,
      visible: true,
      enabled: true,
      ...options
    }
    
    this.addItem(item)
    return this
  }

  // ========== 项目管理方法 ==========

  /**
   * 添加项目
   */
  private addItem(item: MenuItem): void {
    this._items.set(item.id, item)
    this._order.push(item.id)
    this.refresh()
  }

  /**
   * 移除项目
   */
  removeItem(id: string): MaterialMenuBar {
    this._items.delete(id)
    this._order = this._order.filter(itemId => itemId !== id)
    this.refresh()
    return this
  }

  /**
   * 更新项目
   */
  updateItem(id: string, updates: Partial<MenuItem>): MaterialMenuBar {
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
  showItem(id: string): MaterialMenuBar {
    return this.updateItem(id, { visible: true })
  }

  /**
   * 隐藏项目
   */
  hideItem(id: string): MaterialMenuBar {
    return this.updateItem(id, { visible: false })
  }

  /**
   * 启用项目
   */
  enableItem(id: string): MaterialMenuBar {
    return this.updateItem(id, { enabled: true })
  }

  /**
   * 禁用项目
   */
  disableItem(id: string): MaterialMenuBar {
    return this.updateItem(id, { enabled: false })
  }

  /**
   * 设置项目选中状态
   */
  setItemChecked(id: string, checked: boolean): MaterialMenuBar {
    return this.updateItem(id, { checked })
  }

  /**
   * 重新排序项目
   */
  reorderItems(order: string[]): MaterialMenuBar {
    this._order = order.filter(id => this._items.has(id))
    this.refresh()
    return this
  }

  /**
   * 清空所有项目
   */
  clear(): MaterialMenuBar {
    this._items.clear()
    this._order = []
    this.refresh()
    return this
  }

  // ========== 查询方法 ==========

  /**
   * 获取项目
   */
  getItem(id: string): MenuItem | undefined {
    return this._items.get(id)
  }

  /**
   * 获取所有项目
   */
  getItems(): MenuItem[] {
    return Array.from(this._items.values())
  }

  /**
   * 获取可见项目
   */
  getVisibleItems(): MenuItem[] {
    return this.getItems().filter(item => item.visible !== false)
  }

  // ========== 布局方法 ==========

  /**
   * 设置水平菜单栏
   */
  horizontal(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.HORIZONTAL)
  }

  /**
   * 设置垂直菜单栏
   */
  vertical(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.VERTICAL)
  }

  /**
   * 设置下拉菜单栏
   */
  dropdown(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.DROPDOWN)
  }

  /**
   * 设置上下文菜单栏
   */
  context(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.CONTEXT)
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const container = adapter.createElement('div', {
      className: this.buildMenuBarClasses(),
      style: this.buildMenuBarStyles()
    })

    this._container = container

    // 渲染菜单项
    this.renderItems(adapter, container)

    this._isRendered = true
    return container
  }

  /**
   * 刷新菜单栏
   */
  refresh(): void {
    if (this._isRendered && this._container) {
      // 清空容器
      this._container.innerHTML = ''
      
      // 更新样式
      Object.assign(this._container.style, this.buildMenuBarStyles())
      this._container.className = this.buildMenuBarClasses()
      
      // 重新渲染项目
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (adapter) {
        this.renderItems(adapter, this._container)
      }
    }
  }

  /**
   * 渲染菜单项
   */
  private renderItems(adapter: any, container: HTMLElement): void {
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
   * 渲染单个菜单项
   */
  private renderItem(adapter: any, item: MenuItem): HTMLElement | null {
    try {
      switch (item.type) {
        case MenuItemType.SEPARATOR:
          return this.renderSeparator(adapter, item)
        case MenuItemType.SUBMENU:
          return this.renderSubmenu(adapter, item)
        case MenuItemType.CHECKBOX:
          return this.renderCheckboxItem(adapter, item)
        case MenuItemType.RADIO:
          return this.renderRadioItem(adapter, item)
        case MenuItemType.GROUP:
          return this.renderGroup(adapter, item)
        default:
          return this.renderMenuItem(adapter, item)
      }
    } catch (error) {
      console.error('渲染菜单项失败:', error)
      return null
    }
  }

  /**
   * 渲染普通菜单项
   */
  private renderMenuItem(adapter: any, item: MenuItem): HTMLElement | null {
    const itemElement = adapter.createElement('div', {
      className: this.buildMenuItemClasses(item),
      style: this.buildMenuItemStyles(item),
      onClick: item.enabled !== false ? item.onClick : undefined
    })

    // 图标
    if (item.icon && this._config.showIcons) {
      const iconElement = adapter.createElement('i', {
        className: 'material-icons menu-item-icon',
        style: { marginRight: '12px', fontSize: '20px', flexShrink: '0' }
      }, [item.icon])
      itemElement.appendChild(iconElement)
    }

    // 标签
    if (item.label) {
      const labelElement = adapter.createElement('span', {
        className: 'menu-item-label',
        style: {
          display: 'inline-block',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontWeight: '500',
          color: 'inherit',
          lineHeight: '1.4'
        }
      }, [item.label])
      itemElement.appendChild(labelElement)
    }

    // 快捷键
    if (item.shortcut && this._config.showShortcuts) {
      const shortcutElement = adapter.createElement('span', {
        className: 'menu-item-shortcut',
        style: { marginLeft: 'auto', fontSize: '12px', opacity: '0.7' }
      }, [item.shortcut])
      itemElement.appendChild(shortcutElement)
    }

    // 工具提示
    if (item.tooltip) {
      itemElement.title = item.tooltip
    }

    // 添加B站风格的悬停效果
    if (item.enabled !== false) {
      itemElement.addEventListener('mouseenter', () => {
        itemElement.style.backgroundColor = 'rgba(0, 161, 214, 0.08)'
        itemElement.style.color = '#00a1d6'
        itemElement.style.transform = 'translateY(-1px)'
        itemElement.style.boxShadow = '0 4px 12px rgba(0, 161, 214, 0.15)'
      })
      
      itemElement.addEventListener('mouseleave', () => {
        itemElement.style.backgroundColor = 'transparent'
        itemElement.style.color = '#1a1a1a'
        itemElement.style.transform = 'translateY(0)'
        itemElement.style.boxShadow = 'none'
      })
    }

    return itemElement
  }

  /**
   * 渲染分隔符
   */
  private renderSeparator(adapter: any, item: MenuItem): HTMLElement | null {
    return adapter.createElement('div', {
      className: 'menu-separator',
      style: {
        height: '1px',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        margin: '4px 12px',
        width: 'calc(100% - 24px)',
        borderRadius: '1px',
        flexShrink: '0',
        border: 'none',
        outline: 'none',
        padding: '0',
        minHeight: '1px',
        maxHeight: '1px',
        overflow: 'hidden',
        display: 'block'
      }
    })
  }

  /**
   * 渲染子菜单
   */
  private renderSubmenu(adapter: any, item: MenuItem): HTMLElement | null {
    const submenuElement = adapter.createElement('div', {
      className: 'menu-submenu',
      style: { position: 'relative' },
      'data-submenu': item.id
    })

    // 主菜单项
    const mainItem = this.renderMenuItem(adapter, { ...item, type: MenuItemType.ITEM })
    if (mainItem) {
      // 添加下拉箭头
      const arrowElement = adapter.createElement('i', {
        className: 'material-icons menu-submenu-arrow',
        style: { marginLeft: '8px', fontSize: '16px' }
      }, ['keyboard_arrow_right'])
      mainItem.appendChild(arrowElement)

      // 添加B站风格的悬停效果
      mainItem.addEventListener('mouseenter', () => {
        mainItem.style.backgroundColor = 'rgba(0, 161, 214, 0.08)'
        mainItem.style.color = '#00a1d6'
        mainItem.style.transform = 'translateY(-1px)'
        mainItem.style.boxShadow = '0 4px 12px rgba(0, 161, 214, 0.15)'
      })
      
      mainItem.addEventListener('mouseleave', () => {
        mainItem.style.backgroundColor = 'transparent'
        mainItem.style.color = '#1a1a1a'
        mainItem.style.transform = 'translateY(0)'
        mainItem.style.boxShadow = 'none'
      })

      // 添加点击事件来显示/隐藏子菜单
      mainItem.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // 切换子菜单显示状态
        const submenuContainer = submenuElement.querySelector('.menu-submenu-container') as HTMLElement
        if (submenuContainer) {
          const isVisible = submenuContainer.style.display !== 'none' && submenuContainer.style.opacity !== '0'
          
          if (isVisible) {
            this.hideSubmenu(item.id)
          } else {
            // 先隐藏其他子菜单
            this.hideAllSubmenus()
            this.showSubmenu(item.id)
          }
        }
      })
      
      // 主菜单项鼠标离开时不隐藏子菜单，让用户有时间移动到子菜单

      submenuElement.appendChild(mainItem)
    }

    // 子菜单容器
    if (item.children && item.children.length > 0) {
      const submenuContainer = adapter.createElement('div', {
        className: 'menu-submenu-container',
        style: {
          position: 'absolute',
          top: '100%',
          left: '0',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
          minWidth: '200px',
          width: 'auto',
          zIndex: '9999',
          display: 'block', // 改为block，让元素占据空间
          padding: '8px 0',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.98)',
          marginTop: '8px',
          visibility: 'hidden', // 使用visibility隐藏
          opacity: '0',
          transform: 'translateY(-10px)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      })

      // 点击子菜单外部区域时隐藏子菜单
      document.addEventListener('click', (e) => {
        if (!submenuElement.contains(e.target as Node)) {
          this.hideSubmenu(item.id)
        }
      })

      // 渲染子菜单项
      item.children.forEach(child => {
        const childElement = this.renderItem(adapter, child)
        if (childElement) {
             // 为子菜单项添加B站风格样式
             Object.assign(childElement.style, {
               borderRadius: '6px',
               margin: '1px 8px',
               padding: '8px 12px',
               borderBottom: 'none',
               fontSize: '13px',
               fontWeight: '400',
               minHeight: '32px',
               height: 'auto',
               transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
               color: '#1a1a1a',
               background: 'transparent'
             })
          
          // 添加子菜单项悬停效果
          childElement.addEventListener('mouseenter', () => {
            childElement.style.backgroundColor = 'rgba(0, 161, 214, 0.08)'
            childElement.style.color = '#00a1d6'
            childElement.style.transform = 'translateX(4px)'
          })
          
          childElement.addEventListener('mouseleave', () => {
            childElement.style.backgroundColor = 'transparent'
            childElement.style.color = '#1a1a1a'
            childElement.style.transform = 'translateX(0)'
          })
          
          submenuContainer.appendChild(childElement)
        }
      })

      submenuElement.appendChild(submenuContainer)
    }

    return submenuElement
  }

  /**
   * 渲染复选框菜单项
   */
  private renderCheckboxItem(adapter: any, item: MenuItem): HTMLElement | null {
    const itemElement = adapter.createElement('div', {
      className: this.buildMenuItemClasses(item),
      style: this.buildMenuItemStyles(item),
      onClick: item.enabled !== false ? () => {
        const newChecked = !item.checked
        this.setItemChecked(item.id, newChecked)
        item.onToggle?.(newChecked)
      } : undefined
    })

    // 复选框图标
    const checkboxIcon = item.checked ? 'check_box' : 'check_box_outline_blank'
    const checkboxElement = adapter.createElement('i', {
      className: 'material-icons menu-checkbox-icon',
      style: { marginRight: '8px', fontSize: '18px' }
    }, [checkboxIcon])
    itemElement.appendChild(checkboxElement)

    // 标签
    if (item.label) {
      const labelElement = adapter.createElement('span', {
        className: 'menu-item-label'
      }, [item.label])
      itemElement.appendChild(labelElement)
    }

    return itemElement
  }

  /**
   * 渲染单选菜单项
   */
  private renderRadioItem(adapter: any, item: MenuItem): HTMLElement | null {
    const itemElement = adapter.createElement('div', {
      className: this.buildMenuItemClasses(item),
      style: this.buildMenuItemStyles(item),
      onClick: item.enabled !== false ? () => {
        // 取消同组其他项的选中状态
        this._items.forEach((otherItem, otherId) => {
          if (otherItem.type === MenuItemType.RADIO && 
              otherItem.group === item.group && 
              otherId !== item.id) {
            this.setItemChecked(otherId, false)
          }
        })
        
        // 设置当前项为选中状态
        this.setItemChecked(item.id, true)
        item.onToggle?.(true)
      } : undefined
    })

    // 单选图标
    const radioIcon = item.checked ? 'radio_button_checked' : 'radio_button_unchecked'
    const radioElement = adapter.createElement('i', {
      className: 'material-icons menu-radio-icon',
      style: { marginRight: '8px', fontSize: '18px' }
    }, [radioIcon])
    itemElement.appendChild(radioElement)

    // 标签
    if (item.label) {
      const labelElement = adapter.createElement('span', {
        className: 'menu-item-label'
      }, [item.label])
      itemElement.appendChild(labelElement)
    }

    return itemElement
  }

  /**
   * 渲染菜单组
   */
  private renderGroup(adapter: any, item: MenuItem): HTMLElement | null {
    const groupElement = adapter.createElement('div', {
      className: 'menu-group',
      style: {
        border: `1px solid ${this._config.borderColor}`,
        borderRadius: `${this._config.borderRadius}px`,
        margin: '4px 0',
        padding: '8px'
      }
    })

    // 组标题
    if (item.label) {
      const titleElement = adapter.createElement('div', {
        className: 'menu-group-title',
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#666',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }
      }, [item.label])
      groupElement.appendChild(titleElement)
    }

    // 组内容
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        const childElement = this.renderItem(adapter, child)
        if (childElement) {
          groupElement.appendChild(childElement)
        }
      })
    }

    return groupElement
  }

  /**
   * 显示子菜单
   */
  private showSubmenu(itemId: string): void {
    if (this._activeSubmenu) {
      this.hideSubmenu(this._activeSubmenu)
    }
    
    this._activeSubmenu = itemId
    const submenuContainer = this._container?.querySelector(`[data-submenu="${itemId}"] .menu-submenu-container`)
    
    if (submenuContainer) {
      const element = submenuContainer as HTMLElement
      
      
      // 显示子菜单
      element.style.display = 'block'
      element.style.visibility = 'visible'
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    }
  }

  /**
   * 隐藏子菜单
   */
  private hideSubmenu(itemId: string): void {
    const submenuContainer = this._container?.querySelector(`[data-submenu="${itemId}"] .menu-submenu-container`)
    if (submenuContainer) {
      const element = submenuContainer as HTMLElement
      element.style.opacity = '0'
      element.style.transform = 'translateY(-10px)'
      
      // 延迟隐藏以完成动画
      setTimeout(() => {
        element.style.visibility = 'hidden'
        element.style.opacity = '0'
        element.style.transform = 'translateY(-10px)'
      }, 150)
    }
    
    if (this._activeSubmenu === itemId) {
      this._activeSubmenu = null
    }
  }

  /**
   * 隐藏所有子菜单
   */
  private hideAllSubmenus(): void {
    const allSubmenus = this._container?.querySelectorAll('.menu-submenu-container') as NodeListOf<HTMLElement>
    if (allSubmenus) {
      allSubmenus.forEach(submenu => {
        submenu.style.display = 'none'
        submenu.style.opacity = ''
        submenu.style.transform = ''
        submenu.style.transition = ''
      })
    }
    
    // 清除活动子菜单状态
    this._activeSubmenu = null
  }

  /**
   * 构建菜单栏类名
   */
  private buildMenuBarClasses(): string {
    let classes = ['material-menu-bar']
    
    classes.push(`menu-bar-${this._config.layout}`)
    
    if (this._config.theme) {
      classes.push(`menu-bar-${this._config.theme}`)
    }
    
    if (this._config.shadow) {
      classes.push('menu-bar-shadow')
    }
    
    if (this._config.responsive) {
      classes.push('menu-bar-responsive')
    }
    
    if (this._config.animation) {
      classes.push('menu-bar-animated')
    }
    
    if (this._className) {
      classes.push(this._className)
    }
    
    return classes.join(' ')
  }

  /**
   * 构建菜单栏样式
   */
  private buildMenuBarStyles(): Record<string, any> {
    const styles: Record<string, any> = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#ffffff',
      border: 'none',
      borderRadius: '0',
      width: '100%',
      height: '60px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '0 24px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
      minHeight: '60px',
      userSelect: 'none',
      position: 'relative',
      zIndex: '1000',
      overflow: 'visible',
      maxWidth: '100vw',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
    }

    // 布局特定样式
    switch (this._config.layout) {
      case MenuBarLayoutType.HORIZONTAL:
        styles.flexDirection = 'row'
        styles.justifyContent = 'flex-start'
        styles.padding = '0'
        styles.width = '100%'
        break
      case MenuBarLayoutType.VERTICAL:
        styles.flexDirection = 'column'
        styles.justifyContent = 'flex-start'
        styles.padding = '0'
        styles.width = '100%'
        break
      case MenuBarLayoutType.DROPDOWN:
        styles.flexDirection = 'row'
        styles.padding = '0 8px'
        break
      case MenuBarLayoutType.CONTEXT:
        styles.flexDirection = 'column'
        styles.padding = '4px 0'
        styles.minWidth = '150px'
        break
    }

    // 阴影
    if (this._config.shadow) {
      styles.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
    }

    return styles
  }

  /**
   * 构建菜单项类名
   */
  private buildMenuItemClasses(item: MenuItem): string {
    let classes = ['menu-item']
    
    classes.push(`menu-item-${item.type}`)
    
    if (item.className) {
      classes.push(item.className)
    }
    
    if (item.enabled === false) {
      classes.push('menu-item-disabled')
    }
    
    if (item.checked) {
      classes.push('menu-item-checked')
    }
    
    return classes.join(' ')
  }

  /**
   * 构建菜单项样式
   */
  private buildMenuItemStyles(item: MenuItem): Record<string, any> {
    const styles: Record<string, any> = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      cursor: item.enabled !== false ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      borderRadius: '8px',
      margin: '0 4px',
      position: 'relative',
      fontWeight: '500',
      fontSize: '15px',
      letterSpacing: '0.02em',
      background: 'transparent',
      border: 'none',
      whiteSpace: 'nowrap',
      minHeight: '40px',
      textAlign: 'center',
      color: '#1a1a1a',
      height: '40px',
      flex: '0 0 auto',
      minWidth: '80px',
      maxWidth: '160px',
      overflow: 'hidden'
    }

    if (item.style) {
      Object.assign(styles, item.style)
    }

    if (item.enabled === false) {
      styles.opacity = '0.5'
      styles.pointerEvents = 'none'
    }

    // B站风格的悬停效果
    if (item.enabled !== false) {
      styles[':hover'] = {
        backgroundColor: 'rgba(0, 161, 214, 0.08)',
        color: '#00a1d6',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 161, 214, 0.15)'
      }
    }

    return styles
  }
}
