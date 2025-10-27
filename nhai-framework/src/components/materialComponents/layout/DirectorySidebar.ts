import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface DirectoryItem {
  id: string | number
  label: string
  icon?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

/**
 * Material UI DirectorySidebar 组件
 * 左侧一级目录列表 + 右侧内容区域的布局组件
 */
export class MaterialDirectorySidebar extends NHAIWidget {
  private _items: DirectoryItem[] = []
  private _activeKey?: string | number
  private _collapsed: boolean = false
  private _sidebarWidth: number = 180
  private _contentWidth: number = 600
  private _position: 'left' | 'right' = 'left'
  private _onItemClick?: (item: DirectoryItem, index: number) => void
  private _renderContent?: (activeItem?: DirectoryItem) => any
  private _contentWidget?: NHAIWidget

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置目录项
  setItems(items: DirectoryItem[]): void {
    this._items = items
  }

  items(): DirectoryItem[] {
    return this._items
  }

  // 设置活动项
  setActiveKey(key?: string | number): void {
    this._activeKey = key
    // 更新所有项的active状态
    this._items.forEach(item => {
      item.active = item.id === key
    })
  }

  activeKey(): string | number | undefined {
    return this._activeKey
  }

  // 设置是否收起
  setCollapsed(collapsed: boolean): void {
    this._collapsed = collapsed
  }

  collapsed(): boolean {
    return this._collapsed
  }

  // 切换收起/展开
  toggleCollapse(): void {
    this._collapsed = !this._collapsed
  }

  // 设置侧边栏宽度
  setSidebarWidth(width: number): void {
    this._sidebarWidth = width
  }

  sidebarWidth(): number {
    return this._sidebarWidth
  }

  // 设置内容区域宽度
  setContentWidth(width: number): void {
    this._contentWidth = width
  }

  contentWidth(): number {
    return this._contentWidth
  }

  // 设置位置
  setPosition(position: 'left' | 'right'): void {
    this._position = position
  }

  position(): string {
    return this._position
  }

  // 设置事件处理器
  setOnItemClick(handler: (item: DirectoryItem, index: number) => void): void {
    this._onItemClick = handler
  }

  // 设置内容渲染函数
  setContentRenderer(renderer: (activeItem?: DirectoryItem) => any): void {
    this._renderContent = renderer
  }

  // 设置内容区域显示NHAIWidget
  setContentWidget(widget: NHAIWidget): void {
    this._contentWidget = widget
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    // 注入样式（如果还没有注入）
    this.injectStyles()

    const containerProps: any = {
      className: 'mui-directory-sidebar',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        position: 'relative',
        height: '100%',
        overflow: 'visible' // 允许内容区域溢出
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    // 添加右键菜单处理器
    const contextMenuHandler = this.getContextMenuHandler()
    if (contextMenuHandler) {
      containerProps.onContextMenu = contextMenuHandler
    }

    const children: any[] = []

    // 主容器（根据收起状态动态调整宽度）
    const mainContainerProps: any = {
      className: 'mui-directory-sidebar__main',
      style: {
        position: 'relative',
        display: 'flex',
        height: '100%',
        width: this._collapsed ? '64px' : `${this._sidebarWidth}px`, // 只包含sidebar宽度
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
        borderRadius: '12px',
        overflow: 'visible', // 允许内容区域溢出
        border: '1px solid rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
    

    const mainChildren: any[] = []

    // 侧边栏
    const sidebarProps: any = {
      className: 'mui-directory-sidebar__sidebar',
      style: {
        position: 'relative',
        width: this._collapsed ? '64px' : `${this._sidebarWidth}px`,
        backgroundColor: '#fafafa',
        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: this._collapsed ? 'none' : 'inset -1px 0 0 0 rgba(0, 0, 0, 0.05)'
      }
    }

    const sidebarChildren: any[] = []
    
    // 标题栏（可选，收起状态下隐藏）
    const headerProps: any = {
      style: {
        height: this._collapsed ? '0' : '56px',
        display: this._collapsed ? 'none' : 'flex',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.87)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }
    }
    sidebarChildren.push(adapter.createElement('div', headerProps, ['目录']))

    // 目录项容器
    const itemsContainerProps: any = {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: this._collapsed ? '12px 0' : '8px 0'
      }
    }

    // 目录项列表
    const itemsList: any[] = []
    this._items.forEach((item, index) => {
      const itemProps: any = {
        className: `mui-directory-sidebar__item ${item.active ? 'active' : ''} ${item.disabled ? 'disabled' : ''} ${this._collapsed ? 'collapsed' : ''}`,
        'data-item-id': String(item.id),
        style: {
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: this._collapsed ? '0 12px' : '0 16px 0 16px',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          backgroundColor: item.active ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          margin: '4px 8px',
          borderRadius: '12px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          justifyContent: this._collapsed ? 'center' : 'flex-start',
          boxShadow: item.active ? '0 2px 8px rgba(25, 118, 210, 0.15)' : 'none'
        },
        onClick: (e: Event) => {
          e.stopPropagation() // 阻止事件冒泡
          if (!item.disabled) {
            // 如果内容窗口被收起了，点击时自动展开
            if (this._collapsed) {
              this.toggleCollapse()
            }
            this.setActiveKey(item.id)
            if (item.onClick) {
              item.onClick()
            }
            if (this._onItemClick) {
              this._onItemClick(item, index)
            }
            // 触发重新渲染
            if ((window as any).rerenderDirectorySidebar) {
              ;(window as any).rerenderDirectorySidebar()
            }
          }
        },
        onMouseEnter: () => {
          if (!item.active && !item.disabled) {
            itemProps.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
            itemProps.style.transform = 'translateX(2px)'
          }
        },
        onMouseLeave: () => {
          if (!item.active && !item.disabled) {
            itemProps.style.backgroundColor = 'transparent'
            itemProps.style.transform = 'translateX(0)'
          }
        },
        title: item.label
      }

      const itemChildren: any[] = []

      // 图标
      if (item.icon) {
        const iconProps: any = {
          className: 'mui-directory-sidebar__icon',
          style: {
            fontSize: '22px',
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24px',
            width: '24px',
            height: '24px',
            flexShrink: 0,
            color: item.active ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
            transition: 'color 0.25s ease'
          }
        }
        itemChildren.push(adapter.createElement('span', iconProps, [item.icon]))
      } else {
        // 默认图标占位
        const defaultIconProps: any = {
          className: 'mui-directory-sidebar__icon',
          style: {
            width: '24px',
            height: '24px',
            borderRadius: '8px',
            backgroundColor: item.active ? 'rgba(25, 118, 210, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            marginRight: '12px',
            flexShrink: 0,
            transition: 'background-color 0.25s ease'
          }
        }
        itemChildren.push(adapter.createElement('span', defaultIconProps))
      }

      // 文本标签
      const labelProps: any = {
        className: 'mui-directory-sidebar__label',
        style: {
          flex: 1,
          fontSize: '14px',
          fontWeight: item.active ? '600' : '500',
          color: item.disabled ? 'rgba(0, 0, 0, 0.38)' : (item.active ? '#1976d2' : 'rgba(0, 0, 0, 0.75)'),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          opacity: this._collapsed ? '0' : '1',
          maxWidth: this._collapsed ? '0' : 'none',
          transition: 'opacity 0.3s ease, max-width 0.3s ease, color 0.25s ease'
        }
      }
      itemChildren.push(adapter.createElement('span', labelProps, [item.label]))

      itemsList.push(adapter.createElement('div', itemProps, itemChildren))
    })

    // 目录项容器
    sidebarChildren.push(adapter.createElement('div', itemsContainerProps, itemsList))
    
    // 如果收起，在sidebar右侧添加展开按钮
    if (this._collapsed) {
      const expandBtnStyle: any = {
        position: 'absolute',
        right: '-14px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '28px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid rgba(224, 224, 224, 0.3)',
        borderRadius: '0 16px 16px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        userSelect: 'none',
        zIndex: 10,
        transition: 'all 0.3s ease',
        fontSize: '14px',
        color: 'rgba(25, 118, 210, 0.8)',
        fontWeight: '500',
        opacity: 0,
        visibility: 'hidden'
      }
      
      const expandBtnProps: any = {
        className: 'mui-directory-sidebar__trigger',
        style: expandBtnStyle,
        onClick: () => {
          this.toggleCollapse()
          if ((window as any).rerenderDirectorySidebar) {
            ;(window as any).rerenderDirectorySidebar()
          }
        }
      }
      
      const expandIcon = this._position === 'left' ? '▶' : '◀'
      sidebarChildren.push(adapter.createElement('div', expandBtnProps, [expandIcon]))
    }
    
    // 侧边栏
    mainChildren.push(adapter.createElement('div', sidebarProps, sidebarChildren))

    // 如果未收起，显示内容区域
    if (!this._collapsed) {
      // 内容区域 - 绝对定位，覆盖在右侧
      const activeItem = this._items.find(item => item.id === this._activeKey)
      const contentWrapperProps: any = {
        className: 'mui-directory-sidebar__content-wrapper',
        style: {
          position: 'absolute',
          left: this._position === 'left' ? `${this._sidebarWidth}px` : 'auto',
          right: this._position === 'right' ? `${this._sidebarWidth}px` : 'auto',
          top: '0',
          width: `${this._contentWidth}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e0e0e0',
          zIndex: 10,
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
        }
      }
      
      // 收起按钮样式（默认半透明隐藏，通过CSS控制显示）
      const toggleBtnStyle: any = {
        position: 'absolute',
        right: '-14px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '28px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid rgba(224, 224, 224, 0.3)',
        borderRadius: '0 16px 16px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        userSelect: 'none',
        zIndex: 10,
        transition: 'all 0.3s ease',
        fontSize: '14px',
        color: 'rgba(25, 118, 210, 0.8)',
        fontWeight: '500',
        opacity: 0,
        visibility: 'hidden'
      }
      
      // 收起按钮（在最外层右侧中间，半透明，默认隐藏）
      const toggleBtnProps: any = {
        className: 'mui-directory-sidebar__toggle',
        style: toggleBtnStyle,
        onClick: (e: Event) => {
          e.stopPropagation()
          console.log('收起按钮被点击')
          this.toggleCollapse()
          if ((window as any).rerenderDirectorySidebar) {
            ;(window as any).rerenderDirectorySidebar()
          }
        }
      }

      const contentProps: any = {
        className: 'mui-directory-sidebar__content',
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '24px',
          height: '100%'
        }
      }

      let contentChildren: any[] = []
      if (this._contentWidget) {
        // 优先渲染NHAIWidget
        const widgetElement = this._contentWidget.render(_context)
        contentChildren = Array.isArray(widgetElement) ? widgetElement : [widgetElement]
      } else if (this._renderContent) {
        // 使用自定义渲染函数
        const customContent = this._renderContent(activeItem)
        if (customContent) {
          contentChildren = Array.isArray(customContent) ? customContent : [customContent]
        }
      } else {
        // 默认内容
        const defaultContentProps: any = {
          style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0, 0, 0, 0.38)',
            fontSize: '16px',
            textAlign: 'center'
          }
        }
        contentChildren = [
          adapter.createElement('div', defaultContentProps, [
            this._activeKey ? `这是「${activeItem?.label}」的内容区域` : '请选择一个目录项查看内容'
          ])
        ]
      }

      // 将内容添加到contentProps
      const contentElement = adapter.createElement('div', contentProps, contentChildren)
      
      // 收起按钮图标
      const toggleIcon = this._position === 'left' ? '◀' : '▶'
      
      // 添加内容和收起按钮到内容包装器
      contentWrapperProps.children = [
        contentElement,
        adapter.createElement('div', toggleBtnProps, [toggleIcon])
      ]

      mainChildren.push(adapter.createElement('div', contentWrapperProps, contentWrapperProps.children))
    }

    // 主容器（目录+内容）
    children.push(adapter.createElement('div', mainContainerProps, mainChildren))

    return adapter.createElement('div', containerProps, children)
  }

  // 注入组件样式
  private injectStyles(): void {
    const styleId = 'mui-directory-sidebar-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        /* 默认隐藏展开/收起按钮 */
        .mui-directory-sidebar__toggle,
        .mui-directory-sidebar__trigger {
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease, background-color 0.3s ease !important;
        }
        
        /* 主容器悬停时显示收起按钮 */
        .mui-directory-sidebar__main:hover .mui-directory-sidebar__toggle {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* 主容器悬停时显示展开/收起按钮 */
        .mui-directory-sidebar__main:hover .mui-directory-sidebar__trigger {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* 按钮悬停效果 */
        .mui-directory-sidebar__toggle:hover,
        .mui-directory-sidebar__trigger:hover {
          background-color: rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-50%) scale(1.05) !important;
          color: #1976d2 !important;
        }
        
        /* 目录项激活状态 */
        .mui-directory-sidebar__item.active {
          background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%) !important;
          border-left: 3px solid #1976d2 !important;
        }
        
        .mui-directory-sidebar__item.active .mui-directory-sidebar__icon {
          color: #1976d2 !important;
          transform: scale(1.05);
        }
        
        .mui-directory-sidebar__item.active .mui-directory-sidebar__label {
          color: #1976d2 !important;
          font-weight: 600 !important;
        }
        
        /* 收起状态下目录项的悬停效果 */
        .mui-directory-sidebar__item.collapsed:hover {
          background-color: rgba(227, 242, 253, 0.5) !important;
        }
        
        .mui-directory-sidebar__item.collapsed:hover .mui-directory-sidebar__label {
          opacity: 1 !important;
          max-width: 200px !important;
          margin-left: 8px !important;
        }
        
        /* 收起状态下的文字样式 */
        .mui-directory-sidebar__item.collapsed .mui-directory-sidebar__label {
          position: absolute !important;
          left: 100% !important;
          background: #fff !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          white-space: nowrap !important;
          z-index: 1000 !important;
          margin-left: 8px !important;
        }
      `
      document.head.appendChild(style)
    }
  }
}

