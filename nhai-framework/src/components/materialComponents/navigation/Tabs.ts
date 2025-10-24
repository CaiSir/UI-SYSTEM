import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface TabItem {
  id: string | number
  label: string
  content: string | NHAIObject
  disabled?: boolean
  closable?: boolean
}

/**
 * Material UI Tabs 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialTabs extends NHAIWidget {
  private _items: TabItem[] = []
  private _activeKey: string | number = ''
  private _variant: 'standard' | 'scrollable' | 'fullWidth' = 'standard'
  private _orientation: 'horizontal' | 'vertical' = 'horizontal'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _color: 'primary' | 'secondary' | 'default' = 'primary'
  private _centered: boolean = false
  private _scrollButtons: 'auto' | 'desktop' | 'mobile' | false = 'auto'
  private _onChange?: (activeKey: string | number) => void
  private _onTabClick?: (key: string | number) => void
  private _onTabClose?: (key: string | number) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置标签页
  setItems(items: TabItem[]): void {
    this._items = items
    if (items.length > 0 && !this._activeKey) {
      this._activeKey = items[0].id
    }
  }

  items(): TabItem[] {
    return this._items
  }

  // 添加标签页
  addItem(item: TabItem): void {
    this._items.push(item)
    if (typeof item.content === 'object') {
      super.addChild(item.content)
    }
    if (!this._activeKey) {
      this._activeKey = item.id
    }
  }

  // 移除标签页
  removeItem(id: string | number): void {
    const index = this._items.findIndex(item => item.id === id)
    if (index > -1) {
      const item = this._items[index]
      if (typeof item.content === 'object') {
        super.removeChild(item.content)
      }
      this._items.splice(index, 1)

      // 如果删除的是当前活动标签页，切换到下一个
      if (this._activeKey === id && this._items.length > 0) {
        const nextIndex = index < this._items.length ? index : index - 1
        this._activeKey = this._items[nextIndex].id
      }
    }
  }

  // 设置活动键
  setActiveKey(key: string | number): void {
    this._activeKey = key
  }

  activeKey(): string | number {
    return this._activeKey
  }

  // 设置变体
  setVariant(variant: 'standard' | 'scrollable' | 'fullWidth'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置方向
  setOrientation(orientation: 'horizontal' | 'vertical'): void {
    this._orientation = orientation
  }

  orientation(): string {
    return this._orientation
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

  // 设置居中
  setCentered(centered: boolean): void {
    this._centered = centered
  }

  centered(): boolean {
    return this._centered
  }

  // 设置滚动按钮
  setScrollButtons(scrollButtons: 'auto' | 'desktop' | 'mobile' | false): void {
    this._scrollButtons = scrollButtons
  }

  scrollButtons(): string | false {
    return this._scrollButtons
  }

  // 设置事件处理器
  setOnChange(handler: (activeKey: string | number) => void): void {
    this._onChange = handler
  }

  setOnTabClick(handler: (key: string | number) => void): void {
    this._onTabClick = handler
  }

  setOnTabClose(handler: (key: string | number) => void): void {
    this._onTabClose = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-tabs-container mui-tabs-container--${this._orientation}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        width: '100%',
        display: 'flex',
        flexDirection: this._orientation === 'vertical' ? 'row' : 'column'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 标签页头部
    const headerProps: any = {
      className: `mui-tabs-header mui-tabs-header--${this._variant} mui-tabs-header--${this._orientation}`,
      style: {
        display: 'flex',
        flexDirection: this._orientation === 'vertical' ? 'column' : 'row',
        backgroundColor: '#ffffff',
        borderBottom: this._orientation === 'horizontal' ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        borderRight: this._orientation === 'vertical' ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        ...this.getHeaderStyles()
      }
    }

    const headerChildren: any[] = []

    // 标签页按钮
    this._items.forEach(item => {
      const tabProps: any = {
        className: `mui-tab mui-tab--${this._size} ${item.id === this._activeKey ? 'mui-tab--active' : ''} ${item.disabled ? 'mui-tab--disabled' : ''}`,
        style: {
          padding: this.getTabPadding(),
          border: 'none',
          backgroundColor: 'transparent',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          fontSize: this.getFontSize(),
          fontWeight: item.id === this._activeKey ? '500' : '400',
          color: item.disabled ? 'rgba(0, 0, 0, 0.38)' : (item.id === this._activeKey ? this.getActiveColor() : 'rgba(0, 0, 0, 0.6)'),
          opacity: item.disabled ? 0.6 : 1,
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: this._variant === 'fullWidth' ? '0' : 'auto',
          flex: this._variant === 'fullWidth' ? '1' : 'none',
          ...this.getTabStyles(item)
        }
      }

      if (!item.disabled) {
        tabProps.onClick = () => this.handleTabClick(item.id)
        tabProps.onMouseEnter = () => {
          if (item.id !== this._activeKey) {
            tabProps.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
          }
        }
        tabProps.onMouseLeave = () => {
          if (item.id !== this._activeKey) {
            tabProps.style.backgroundColor = 'transparent'
          }
        }
      }

      const tabChildren = []

      // 标签文本
      tabChildren.push(item.label)

      // 关闭按钮
      if (item.closable) {
        const closeProps: any = {
          className: 'mui-tab-close',
          style: {
            marginLeft: '8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.6)',
            transition: 'background-color 0.2s ease-in-out'
          }
        }

        closeProps.onClick = (e: any) => {
          e.stopPropagation()
          this.handleTabClose(item.id)
        }

        closeProps.children = ['×']
        tabChildren.push(adapter.createElement('span', closeProps))
      }

      tabProps.children = tabChildren
      headerChildren.push(adapter.createElement('button', tabProps))
    })

    headerProps.children = headerChildren
    children.push(adapter.createElement('div', headerProps))

    // 标签页内容
    const activeItem = this._items.find(item => item.id === this._activeKey)
    if (activeItem) {
      const contentProps: any = {
        className: 'mui-tabs-content',
        style: {
          flex: 1,
          padding: '16px',
          backgroundColor: '#ffffff',
          ...this.getContentStyles()
        }
      }

      const contentChildren = []

      if (typeof activeItem.content === 'string') {
        contentChildren.push(activeItem.content)
      } else {
        const contentElement = activeItem.content.render(_context)
        contentChildren.push(contentElement)
      }

      contentProps.children = contentChildren
      children.push(adapter.createElement('div', contentProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getTabPadding(): string {
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

  private getHeaderStyles(): Record<string, any> {
    if (this._orientation === 'vertical') {
      return {
        width: '200px',
        minWidth: '200px'
      }
    } else {
      return {
        width: '100%',
        justifyContent: this._centered ? 'center' : 'flex-start'
      }
    }
  }

  private getTabStyles(item: TabItem): Record<string, any> {
    const styles: Record<string, any> = {}

    if (this._orientation === 'horizontal') {
      if (item.id === this._activeKey) {
        styles.borderBottom = `2px solid ${this.getActiveColor()}`
      }
    } else {
      if (item.id === this._activeKey) {
        styles.borderRight = `2px solid ${this.getActiveColor()}`
      }
    }

    return styles
  }

  private getContentStyles(): Record<string, any> {
    if (this._orientation === 'vertical') {
      return {
        marginLeft: '0'
      }
    } else {
      return {
        marginTop: '0'
      }
    }
  }

  private getActiveColor(): string {
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      default: '#000000'
    }
    return colorMap[this._color] || colorMap.primary
  }

  private handleTabClick(key: string | number): void {
    this._activeKey = key

    if (this._onTabClick) {
      this._onTabClick(key)
    }

    if (this._onChange) {
      this._onChange(key)
    }
  }

  private handleTabClose(key: string | number): void {
    if (this._onTabClose) {
      this._onTabClose(key)
    }

    this.removeItem(key)
  }
}
