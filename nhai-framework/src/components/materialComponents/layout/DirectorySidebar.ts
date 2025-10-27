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
  private _sidebarWidth: number = 240
  private _contentWidth: number = 600
  private _position: 'left' | 'right' = 'left'
  private _onItemClick?: (item: DirectoryItem, index: number) => void
  private _renderContent?: (activeItem?: DirectoryItem) => any

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
        overflow: 'hidden'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = []

    // 主容器（根据收起状态动态调整宽度）
    const mainContainerProps: any = {
      className: 'mui-directory-sidebar__main',
      style: {
        position: 'relative',
        display: 'flex',
        height: '100%',
        width: this._collapsed ? `${this._sidebarWidth}px` : `${this._sidebarWidth + this._contentWidth}px`,
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s ease'
      }
    }
    

    const mainChildren: any[] = []

    // 侧边栏
    const sidebarProps: any = {
      className: 'mui-directory-sidebar__sidebar',
      style: {
        position: 'relative',
        width: `${this._sidebarWidth}px`,
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }
    }

    const sidebarChildren: any[] = []
    
    // 标题栏（可选）
    const headerProps: any = {
      style: {
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.87)'
      }
    }
    sidebarChildren.push(adapter.createElement('div', headerProps, ['目录']))

    // 目录项容器
    const itemsContainerProps: any = {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '8px 0'
      }
    }

    // 目录项列表
    const itemsList: any[] = []
    this._items.forEach((item, index) => {
      const itemProps: any = {
        className: `mui-directory-sidebar__item ${item.active ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`,
        style: {
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px 0 20px',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          backgroundColor: item.active ? '#e3f2fd' : 'transparent',
          margin: '2px 8px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          position: 'relative'
        },
        onClick: () => {
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
            itemProps.style.backgroundColor = '#f5f5f5'
          }
        },
        onMouseLeave: () => {
          if (!item.active && !item.disabled) {
            itemProps.style.backgroundColor = 'transparent'
          }
        },
        title: item.label
      }

      const itemChildren: any[] = []

      // 图标
      if (item.icon) {
        const iconProps: any = {
          style: {
            fontSize: '20px',
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24px',
            width: '24px',
            height: '24px'
          }
        }
        itemChildren.push(adapter.createElement('span', iconProps, [item.icon]))
      } else {
        // 默认图标占位
        const defaultIconProps: any = {
          style: {
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: item.active ? '#1976d2' : '#dee2e6',
            marginRight: '12px',
            flexShrink: 0
          }
        }
        itemChildren.push(adapter.createElement('span', defaultIconProps))
      }

      // 文本标签
      const labelProps: any = {
        style: {
          flex: 1,
          fontSize: '14px',
          fontWeight: item.active ? '500' : '400',
          color: item.disabled ? 'rgba(0, 0, 0, 0.38)' : (item.active ? '#1976d2' : 'rgba(0, 0, 0, 0.87)'),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
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
      // 内容区域
      const activeItem = this._items.find(item => item.id === this._activeKey)
      const contentWrapperProps: any = {
        className: 'mui-directory-sidebar__content-wrapper',
        style: {
          position: 'relative',
          width: `${this._contentWidth}px`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e0e0e0'
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
        onClick: () => {
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
      if (this._renderContent) {
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
          background-color: #e3f2fd !important;
        }
        
        .mui-directory-sidebar__item.active span {
          color: #1976d2 !important;
          font-weight: 500 !important;
        }
      `
      document.head.appendChild(style)
    }
  }
}

