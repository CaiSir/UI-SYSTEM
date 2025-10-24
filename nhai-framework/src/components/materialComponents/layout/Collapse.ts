import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface CollapsePanel {
  id: string | number
  title: string
  content: string | NHAIObject
  disabled?: boolean
  expanded?: boolean
}

/**
 * Material UI Collapse 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialCollapse extends NHAIWidget {
  private _panels: CollapsePanel[] = []
  private _accordion: boolean = false
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _bordered: boolean = true
  private _ghost: boolean = false
  private _onChange?: (activeKeys: (string | number)[]) => void
  private _onExpand?: (key: string | number) => void
  private _onCollapse?: (key: string | number) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置面板
  setPanels(panels: CollapsePanel[]): void {
    this._panels = panels
  }

  panels(): CollapsePanel[] {
    return this._panels
  }

  // 添加面板
  addPanel(panel: CollapsePanel): void {
    this._panels.push(panel)
    if (typeof panel.content === 'object') {
      super.addChild(panel.content)
    }
  }

  // 移除面板
  removePanel(id: string | number): void {
    const index = this._panels.findIndex(panel => panel.id === id)
    if (index > -1) {
      const panel = this._panels[index]
      if (typeof panel.content === 'object') {
        super.removeChild(panel.content)
      }
      this._panels.splice(index, 1)
    }
  }

  // 设置手风琴模式
  setAccordion(accordion: boolean): void {
    this._accordion = accordion
  }

  accordion(): boolean {
    return this._accordion
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置边框
  setBordered(bordered: boolean): void {
    this._bordered = bordered
  }

  bordered(): boolean {
    return this._bordered
  }

  // 设置幽灵模式
  setGhost(ghost: boolean): void {
    this._ghost = ghost
  }

  ghost(): boolean {
    return this._ghost
  }

  // 设置事件处理器
  setOnChange(handler: (activeKeys: (string | number)[]) => void): void {
    this._onChange = handler
  }

  setOnExpand(handler: (key: string | number) => void): void {
    this._onExpand = handler
  }

  setOnCollapse(handler: (key: string | number) => void): void {
    this._onCollapse = handler
  }

  // 展开面板
  expandPanel(id: string | number): void {
    const panel = this._panels.find(p => p.id === id)
    if (panel && !panel.disabled) {
      panel.expanded = true
      
      if (this._onExpand) {
        this._onExpand(id)
      }
      
      if (this._onChange) {
        const activeKeys = this._panels.filter(p => p.expanded).map(p => p.id)
        this._onChange(activeKeys)
      }
    }
  }

  // 折叠面板
  collapsePanel(id: string | number): void {
    const panel = this._panels.find(p => p.id === id)
    if (panel && !panel.disabled) {
      panel.expanded = false
      
      if (this._onCollapse) {
        this._onCollapse(id)
      }
      
      if (this._onChange) {
        const activeKeys = this._panels.filter(p => p.expanded).map(p => p.id)
        this._onChange(activeKeys)
      }
    }
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-collapse mui-collapse--${this._size} ${this._bordered ? 'mui-collapse--bordered' : ''} ${this._ghost ? 'mui-collapse--ghost' : ''}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        width: '100%',
        backgroundColor: this._ghost ? 'transparent' : '#ffffff',
        borderRadius: this._bordered ? '4px' : '0',
        border: this._bordered ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        overflow: 'hidden'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = []

    this._panels.forEach((panel, index) => {
      const panelProps: any = {
        className: `mui-collapse-panel ${panel.expanded ? 'mui-collapse-panel--expanded' : ''} ${panel.disabled ? 'mui-collapse-panel--disabled' : ''}`,
        style: {
          borderBottom: index < this._panels.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none'
        }
      }

      const panelChildren = []

      // 面板头部
      const headerProps: any = {
        className: 'mui-collapse-panel-header',
        style: {
          padding: this.getPadding(),
          backgroundColor: 'transparent',
          border: 'none',
          width: '100%',
          textAlign: 'left',
          cursor: panel.disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: this.getFontSize(),
          fontWeight: '500',
          color: panel.disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.87)',
          transition: 'background-color 0.2s ease-in-out',
          opacity: panel.disabled ? 0.6 : 1
        }
      }

      if (!panel.disabled) {
        headerProps.onClick = () => this.handlePanelToggle(panel.id)
        headerProps.onMouseEnter = () => {
          headerProps.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
        }
        headerProps.onMouseLeave = () => {
          headerProps.style.backgroundColor = 'transparent'
        }
      }

      const headerChildren = []

      // 标题
      headerChildren.push(panel.title)

      // 展开/折叠图标
      const iconProps: any = {
        className: 'mui-collapse-panel-icon',
        style: {
          fontSize: '16px',
          color: 'rgba(0, 0, 0, 0.6)',
          transition: 'transform 0.2s ease-in-out',
          transform: panel.expanded ? 'rotate(90deg)' : 'rotate(0deg)'
        }
      }
      headerChildren.push(adapter.createElement('span', iconProps, ['▶']))

      headerProps.children = headerChildren
      panelChildren.push(adapter.createElement('button', headerProps))

      // 面板内容
      if (panel.expanded) {
        const contentProps: any = {
          className: 'mui-collapse-panel-content',
          style: {
            padding: this.getPadding(),
            paddingTop: '0',
            backgroundColor: this._ghost ? 'transparent' : '#fafafa',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            animation: 'mui-collapse-expand 0.2s ease-in-out'
          }
        }

        const contentChildren = []

        if (typeof panel.content === 'string') {
          contentChildren.push(panel.content)
        } else {
          const contentElement = panel.content.render(_context)
          contentChildren.push(contentElement)
        }

        contentProps.children = contentChildren
        panelChildren.push(adapter.createElement('div', contentProps))
      }

      panelProps.children = panelChildren
      children.push(adapter.createElement('div', panelProps))
    })

    return adapter.createElement('div', containerProps, children)
  }

  private getPadding(): string {
    const paddingMap: Record<string, string> = {
      small: '8px 12px',
      medium: '12px 16px',
      large: '16px 20px'
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

  private handlePanelToggle(id: string | number): void {
    const panel = this._panels.find(p => p.id === id)
    if (!panel || panel.disabled) return

    if (this._accordion) {
      // 手风琴模式：关闭其他面板
      this._panels.forEach(p => {
        if (p.id !== id) {
          p.expanded = false
        }
      })
    }

    // 切换当前面板
    panel.expanded = !panel.expanded

    if (panel.expanded && this._onExpand) {
      this._onExpand(id)
    } else if (!panel.expanded && this._onCollapse) {
      this._onCollapse(id)
    }

    if (this._onChange) {
      const activeKeys = this._panels.filter(p => p.expanded).map(p => p.id)
      this._onChange(activeKeys)
    }
  }
}
