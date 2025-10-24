import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'
import { MenuBarStyles } from './styles/MenuBarStyles'

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
  theme: 'light' | 'dark'
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  shadow?: boolean
  showIcons?: boolean
  showShortcuts?: boolean
  animation?: boolean
  responsive?: boolean
}

/**
 * Material Design 菜单栏组件
 */
export class MaterialMenuBar extends NHAIWidget {
  private _config: MenuBarConfig
  private _items: Map<string, MenuItem> = new Map()
  private _container: HTMLElement | null = null
  private _isRendered: boolean = false
  private _activeSubmenu: string | null = null
  private _documentClickListener: ((e: Event) => void) | null = null

  constructor(parent?: NHAIObject) {
    super(parent)
    this._config = {
      layout: MenuBarLayoutType.HORIZONTAL,
      theme: 'light',
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      shadow: true,
      showIcons: true,
      showShortcuts: true,
      animation: true,
      responsive: true
    }
  }

  // ========== 配置方法 ==========

  /**
   * 设置布局类型
   */
  setLayout(layout: MenuBarLayoutType): MaterialMenuBar {
    this._config.layout = layout
    this.update()
    return this
  }

  /**
   * 设置主题
   */
  setTheme(theme: 'light' | 'dark'): MaterialMenuBar {
    this._config.theme = theme
    this.update()
    return this
  }

  /**
   * 设置背景色
   */
  setBackgroundColor(color: string): MaterialMenuBar {
    this._config.backgroundColor = color
    this.update()
    return this
  }

  /**
   * 设置文字颜色
   */
  setTextColor(color: string): MaterialMenuBar {
    this._config.textColor = color
    this.update()
    return this
  }

  /**
   * 设置边框颜色
   */
  setBorderColor(color: string): MaterialMenuBar {
    this._config.borderColor = color
    this.update()
    return this
  }

  /**
   * 设置阴影
   */
  setShadow(enabled: boolean): MaterialMenuBar {
    this._config.shadow = enabled
    this.update()
    return this
  }

  /**
   * 设置图标显示
   */
  setShowIcons(enabled: boolean): MaterialMenuBar {
    this._config.showIcons = enabled
    this.update()
    return this
  }

  /**
   * 设置快捷键显示
   */
  setShowShortcuts(enabled: boolean): MaterialMenuBar {
    this._config.showShortcuts = enabled
    this.update()
    return this
  }

  /**
   * 设置动画
   */
  setAnimation(enabled: boolean): MaterialMenuBar {
    this._config.animation = enabled
    this.update()
    return this
  }

  /**
   * 设置响应式
   */
  setResponsive(enabled: boolean): MaterialMenuBar {
    this._config.responsive = enabled
    this.update()
    return this
  }

  /**
   * 设置高度
   */
  setHeight(height: number): MaterialMenuBar {
    if (this._container) {
      this._container.style.height = `${height}px`
    }
    return this
  }

  // ========== 布局方法 ==========

  /**
   * 设置为水平布局
   */
  horizontal(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.HORIZONTAL)
  }

  /**
   * 设置为垂直布局
   */
  vertical(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.VERTICAL)
  }

  /**
   * 设置为下拉布局
   */
  dropdown(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.DROPDOWN)
  }

  /**
   * 设置为上下文布局
   */
  context(): MaterialMenuBar {
    return this.setLayout(MenuBarLayoutType.CONTEXT)
  }

  // ========== 渲染方法 ==========

  /**
   * 加载CSS样式
   */
  private loadStyles(): void {
    // 使用MenuBarStyles类加载样式
    const menuBarStyles = MenuBarStyles.getInstance()
    menuBarStyles.loadStyles()
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    // 加载CSS样式文件
    this.loadStyles()

    const container = adapter.createElement('div', {
      className: this.buildMenuBarClasses()
    })

    this._container = container

    // 渲染菜单项
    this.renderItems(adapter, container)

    // 添加文档点击事件监听器，用于点击外部关闭子菜单
    this.addDocumentClickListener()

    this._isRendered = true
    return container
  }

  /**
   * 更新组件
   */
  update(): void {
    if (this._isRendered && this._container) {
      // 清空容器
      this._container.innerHTML = ''
      
      // 更新样式
      // CSS样式已通过CSS文件管理，无需内联样式
      this._container.className = this.buildMenuBarClasses()
      
      // 重新渲染项目
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (adapter) {
        this.renderItems(adapter, this._container)
      }
    }
  }

  // ========== 菜单项管理 ==========

  /**
   * 添加菜单项
   */
  addItem(item: MenuItem): MaterialMenuBar {
    this._items.set(item.id, item)
    this.update()
    return this
  }

  /**
   * 添加子菜单
   */
  addSubmenu(id: string, label: string, children: MenuItem[]): MaterialMenuBar {
    this._items.set(id, {
      id,
      type: MenuItemType.SUBMENU,
      label,
      children
    })
    this.update()
    return this
  }

  /**
   * 添加分隔符
   */
  addSeparator(id: string): MaterialMenuBar {
    this._items.set(id, {
      id,
      type: MenuItemType.SEPARATOR
    })
    this.update()
    return this
  }

  /**
   * 添加复选框菜单项
   */
  addCheckbox(id: string, label: string, checked: boolean = false, onToggle?: (checked: boolean) => void): MaterialMenuBar {
    this._items.set(id, {
      id,
      type: MenuItemType.CHECKBOX,
      label,
      checked,
      onToggle
    })
    this.update()
    return this
  }

  /**
   * 添加单选菜单项
   */
  addRadio(id: string, label: string, group: string, checked: boolean = false, onToggle?: (checked: boolean) => void): MaterialMenuBar {
    this._items.set(id, {
      id,
      type: MenuItemType.RADIO,
      label,
      group,
      checked,
      onToggle
    })
    this.update()
    return this
  }

  /**
   * 移除菜单项
   */
  removeItem(id: string): MaterialMenuBar {
    this._items.delete(id)
    this.update()
    return this
  }

  /**
   * 清空菜单项
   */
  clearItems(): MaterialMenuBar {
    this._items.clear()
    this.update()
    return this
  }

  /**
   * 设置菜单项选中状态
   */
  setItemChecked(id: string, checked: boolean): MaterialMenuBar {
    const item = this._items.get(id)
    if (item) {
      item.checked = checked
      this.update()
    }
    return this
  }

  /**
   * 设置菜单项启用状态
   */
  setItemEnabled(id: string, enabled: boolean): MaterialMenuBar {
    const item = this._items.get(id)
    if (item) {
      item.enabled = enabled
      this.update()
    }
    return this
  }

  /**
   * 设置菜单项可见状态
   */
  setItemVisible(id: string, visible: boolean): MaterialMenuBar {
    const item = this._items.get(id)
    if (item) {
      item.visible = visible
      this.update()
    }
    return this
  }

  // ========== 渲染辅助方法 ==========

  /**
   * 渲染所有菜单项
   */
  private renderItems(adapter: any, container: HTMLElement): void {
    this._items.forEach((item, id) => {
      if (item.visible !== false) {
        const element = this.renderItem(adapter, item)
        if (element) {
          container.appendChild(element)
        }
      }
    })
  }

  /**
   * 渲染单个菜单项
   */
  private renderItem(adapter: any, item: MenuItem): HTMLElement | null {
    switch (item.type) {
      case MenuItemType.ITEM:
        return this.renderMenuItem(adapter, item)
      case MenuItemType.SUBMENU:
        return this.renderSubmenu(adapter, item)
      case MenuItemType.SEPARATOR:
        return this.renderSeparator(adapter, item)
      case MenuItemType.CHECKBOX:
        return this.renderCheckboxItem(adapter, item)
      case MenuItemType.RADIO:
        return this.renderRadioItem(adapter, item)
      default:
        return null
    }
  }

  /**
   * 渲染普通菜单项
   */
  private renderMenuItem(adapter: any, item: MenuItem): HTMLElement | null {
    const itemElement = adapter.createElement('div', {
      className: this.buildMenuItemClasses(item),
      onClick: item.enabled !== false ? item.onClick : undefined
    })

    // 图标
    if (item.icon && this._config.showIcons) {
      const iconElement = adapter.createElement('i', {
        className: 'material-icons nhai-menu-item-icon',
        textContent: item.icon
      })
      itemElement.appendChild(iconElement)
    }

    // 标签
    if (item.label) {
      console.log('🔧 渲染菜单项标签:', item.label)
      const labelElement = adapter.createElement('span', {
        className: 'nhai-menu-item-label'
      })
      labelElement.innerHTML = item.label
      itemElement.appendChild(labelElement)
      console.log('🔧 标签元素已添加:', labelElement)
    }

    // 快捷键
    if (item.shortcut && this._config.showShortcuts) {
      console.log('🔧 渲染快捷键:', item.shortcut)
      const shortcutElement = adapter.createElement('span', {
        className: 'nhai-menu-item-shortcut'
      })
      shortcutElement.innerHTML = item.shortcut
      itemElement.appendChild(shortcutElement)
      console.log('🔧 快捷键元素已添加:', shortcutElement)
    }

    return itemElement
  }

  /**
   * 渲染子菜单
   */
  private renderSubmenu(adapter: any, item: MenuItem): HTMLElement | null {
    if (!item.children || item.children.length === 0) {
      return null
    }

    const submenuElement = adapter.createElement('div', {
      className: 'nhai-submenu',
      'data-submenu': item.id
    })

    // 主菜单项
    console.log('🔧 渲染子菜单主项:', item.label)
    const mainItem = this.renderMenuItem(adapter, { ...item, type: MenuItemType.ITEM })
    if (mainItem) {
      console.log('🔧 子菜单主项已创建:', mainItem)
      // 添加下拉箭头（只在有子菜单时显示）
      if (item.children && item.children.length > 0) {
        const arrowElement = adapter.createElement('span', {
          className: 'menu-submenu-arrow',
          style: { marginLeft: '8px', fontSize: '16px' }
        }, ['▶'])
        mainItem.appendChild(arrowElement)
      }

      // 点击事件
      mainItem.addEventListener('click', (e: Event) => {
        e.stopPropagation()
        const submenuContainer = submenuElement.querySelector('.nhai-submenu-container') as HTMLElement
        if (submenuContainer) {
          if (submenuContainer.classList.contains('nhai-submenu-visible')) {
            this.hideSubmenu(item.id)
          } else {
            this.showSubmenu(item.id)
          }
        }
      })

      submenuElement.appendChild(mainItem)
    }

    // 子菜单容器
    const submenuContainer = adapter.createElement('div', {
      className: 'nhai-submenu-container'
    })

    // 渲染子菜单项
    item.children.forEach(childItem => {
      if (childItem.visible !== false) {
        const childElement = this.renderMenuItem(adapter, childItem)
        if (childElement) {
          childElement.classList.add('nhai-submenu-item')
          submenuContainer.appendChild(childElement)
        }
      }
    })

    submenuElement.appendChild(submenuContainer)

    return submenuElement
  }

  /**
   * 渲染分隔符
   */
  private renderSeparator(adapter: any, item: MenuItem): HTMLElement | null {
    return adapter.createElement('div', {
      className: 'nhai-menu-separator'
    })
  }

  /**
   * 渲染复选框菜单项
   */
  private renderCheckboxItem(adapter: any, item: MenuItem): HTMLElement | null {
    const itemElement = adapter.createElement('div', {
      className: this.buildMenuItemClasses(item),
      onClick: item.enabled !== false ? () => {
        const newChecked = !item.checked
        this.setItemChecked(item.id, newChecked)
        item.onToggle?.(newChecked)
      } : undefined
    })

    // 复选框图标
    const checkboxIcon = item.checked ? 'check_box' : 'check_box_outline_blank'
    const iconElement = adapter.createElement('i', {
      className: 'material-icons nhai-menu-item-icon',
      textContent: checkboxIcon
    })
    itemElement.appendChild(iconElement)

    // 标签
    if (item.label) {
      const labelElement = adapter.createElement('span', {
        className: 'nhai-menu-item-label',
        textContent: item.label
      })
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

    // 单选按钮图标
    const radioIcon = item.checked ? 'radio_button_checked' : 'radio_button_unchecked'
    const iconElement = adapter.createElement('i', {
      className: 'material-icons nhai-menu-item-icon',
      textContent: radioIcon
    })
    itemElement.appendChild(iconElement)

    // 标签
    if (item.label) {
      const labelElement = adapter.createElement('span', {
        className: 'nhai-menu-item-label',
        textContent: item.label
      })
      itemElement.appendChild(labelElement)
    }

    return itemElement
  }

  // ========== 子菜单控制 ==========

  /**
   * 显示子菜单
   */
  private showSubmenu(itemId: string): void {
    if (this._activeSubmenu) {
      this.hideSubmenu(this._activeSubmenu)
    }
    this._activeSubmenu = itemId
    const submenuElement = this._container?.querySelector(`[data-submenu="${itemId}"]`) as HTMLElement
    const submenuContainer = submenuElement?.querySelector('.nhai-submenu-container') as HTMLElement
    
    if (submenuElement && submenuContainer) {
      submenuContainer.classList.add('nhai-submenu-visible')
      submenuElement.classList.add('nhai-submenu-visible')
    }
  }

  /**
   * 隐藏子菜单
   */
  private hideSubmenu(itemId: string): void {
    const submenuElement = this._container?.querySelector(`[data-submenu="${itemId}"]`) as HTMLElement
    const submenuContainer = submenuElement?.querySelector('.nhai-submenu-container') as HTMLElement
    
    if (submenuElement && submenuContainer) {
      submenuContainer.classList.remove('nhai-submenu-visible')
      submenuElement.classList.remove('nhai-submenu-visible')
    }
    
    if (this._activeSubmenu === itemId) {
      this._activeSubmenu = null
    }
  }

  /**
   * 隐藏所有子菜单
   */
  private hideAllSubmenus(): void {
    const allSubmenuElements = this._container?.querySelectorAll('[data-submenu]') as NodeListOf<HTMLElement>
    if (allSubmenuElements) {
      allSubmenuElements.forEach(submenuElement => {
        const submenuContainer = submenuElement.querySelector('.nhai-submenu-container') as HTMLElement
        if (submenuContainer) {
          submenuContainer.classList.remove('nhai-submenu-visible')
        }
        submenuElement.classList.remove('nhai-submenu-visible')
      })
    }
    this._activeSubmenu = null
  }

  /**
   * 添加文档点击事件监听器
   */
  private addDocumentClickListener(): void {
    // 移除之前的事件监听器（如果存在）
    this.removeDocumentClickListener()
    
    // 添加新的事件监听器
    this._documentClickListener = (e: Event) => {
      const target = e.target as HTMLElement
      
      // 检查点击的目标是否在菜单栏内部
      if (this._container && this._container.contains(target)) {
        return // 点击在菜单栏内部，不关闭子菜单
      }
      
      // 点击在菜单栏外部，关闭所有子菜单
      this.hideAllSubmenus()
    }
    
    document.addEventListener('click', this._documentClickListener)
  }

  /**
   * 移除文档点击事件监听器
   */
  private removeDocumentClickListener(): void {
    if (this._documentClickListener) {
      document.removeEventListener('click', this._documentClickListener)
      this._documentClickListener = null
    }
  }

  /**
   * 销毁组件，清理资源
   */
  destroy(): void {
    this.removeDocumentClickListener()
    this._container = null
    this._items.clear()
    this._isRendered = false
    this._activeSubmenu = null
  }

  // ========== 样式构建方法 ==========

  /**
   * 构建菜单栏类名
   */
  private buildMenuBarClasses(): string {
    const classes = ['nhai-menu-bar']
    
    // 布局类
    classes.push(`menu-bar-${this._config.layout}`)
    
    // 主题类
    classes.push(`menu-bar-${this._config.theme}`)
    
    // 功能类
    if (this._config.shadow) {
      classes.push('menu-bar-shadow')
    }
    
    if (this._config.responsive) {
      classes.push('menu-bar-responsive')
    }
    
    if (this._config.animation) {
      classes.push('menu-bar-animated')
    }
    
    return classes.join(' ')
  }

  /**
   * 构建菜单项类名
   */
  private buildMenuItemClasses(item: MenuItem): string {
    let classes = ['nhai-menu-item']
    
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
}
