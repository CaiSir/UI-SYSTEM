import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * 按钮类型枚举
 */
export enum ButtonType {
  BASIC = 'basic',           // 基础按钮
  ICON_ONLY = 'icon-only',   // 仅图标按钮
  TEXT_ONLY = 'text-only',   // 仅文字按钮
  ICON_TEXT = 'icon-text',   // 图标+文字按钮
  FLOATING = 'floating',     // 浮动按钮
  DROPDOWN = 'dropdown',     // 下拉按钮
  TOGGLE = 'toggle'          // 切换按钮
}

/**
 * 按钮尺寸枚举
 */
export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra-large'
}

/**
 * 按钮颜色枚举
 */
export enum ButtonColor {
  RED = 'red',
  PINK = 'pink',
  PURPLE = 'purple',
  DEEP_PURPLE = 'deep-purple',
  INDIGO = 'indigo',
  BLUE = 'blue',
  LIGHT_BLUE = 'light-blue',
  CYAN = 'cyan',
  TEAL = 'teal',
  GREEN = 'green',
  LIGHT_GREEN = 'light-green',
  LIME = 'lime',
  YELLOW = 'yellow',
  AMBER = 'amber',
  ORANGE = 'orange',
  DEEP_ORANGE = 'deep-orange',
  BROWN = 'brown',
  GREY = 'grey',
  BLUE_GREY = 'blue-grey'
}

/**
 * 基础按钮组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialButton extends NHAIWidget {
  private _text: string = ''                                                                                    // 按钮文本
  private _type: ButtonType = ButtonType.BASIC                                                                   // 按钮类型
  private _variant: 'flat' | 'raised' | 'floating' = 'raised'                                                   // 按钮变体：扁平、凸起、浮动
  private _color: ButtonColor = ButtonColor.BLUE                                                                // 按钮颜色
  private _size: ButtonSize = ButtonSize.MEDIUM                                                                   // 按钮大小
  private _disabled: boolean = false                                                                             // 是否禁用
  private _loading: boolean = false                                                                              // 是否加载中
  private _onClick?: () => void                                                                                  // 点击回调函数
  private _icon?: string                                                                                         // 图标名称
  private _iconPosition: 'left' | 'right' = 'left'                                                              // 图标位置：左、右
  private _dropdownItems?: Array<{ text: string; value: any; onClick?: () => void }>                          // 下拉菜单项
  private _toggleState: boolean = false                                                                          // 切换状态
  private _onToggle?: (state: boolean) => void                                                                   // 切换回调函数

  constructor(text: string = '', parent?: NHAIObject) {
    super(parent)
    this._text = text
  }

  // ========== 基础属性设置 ==========
  
  // 设置文本
  setText(text: string): void {
    this._text = text
  }

  text(): string {
    return this._text
  }

  // 设置按钮类型
  setType(type: ButtonType): void {
    this._type = type
    // 根据类型自动调整相关属性
    this.adjustPropertiesByType(type)
  }

  type(): ButtonType {
    return this._type
  }

  // 设置变体
  setVariant(variant: 'flat' | 'raised' | 'floating'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置颜色
  setColor(color: ButtonColor): void {
    this._color = color
  }

  color(): ButtonColor {
    return this._color
  }

  // 设置大小
  setSize(size: ButtonSize): void {
    this._size = size
  }

  size(): ButtonSize {
    return this._size
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置加载状态
  setLoading(loading: boolean): void {
    this._loading = loading
  }

  loading(): boolean {
    return this._loading
  }

  // ========== 图标相关 ==========

  // 设置图标
  setIcon(icon: string): void {
    this._icon = icon
  }

  icon(): string | undefined {
    return this._icon
  }

  // 设置图标位置
  setIconPosition(position: 'left' | 'right'): void {
    this._iconPosition = position
  }

  iconPosition(): string {
    return this._iconPosition
  }

  // ========== 下拉菜单相关 ==========

  // 设置下拉菜单项
  setDropdownItems(items: Array<{ text: string; value: any; onClick?: () => void }>): void {
    this._dropdownItems = items
    if (items.length > 0) {
      this._type = ButtonType.DROPDOWN
    }
  }

  dropdownItems(): Array<{ text: string; value: any; onClick?: () => void }> | undefined {
    return this._dropdownItems
  }

  // ========== 切换按钮相关 ==========

  // 设置切换状态
  setToggleState(state: boolean): void {
    this._toggleState = state
  }

  toggleState(): boolean {
    return this._toggleState
  }

  // 切换状态
  toggle(): void {
    this._toggleState = !this._toggleState
    this._onToggle?.(this._toggleState)
  }

  // ========== 事件回调 ==========

  // 设置点击事件
  setOnClick(handler: () => void): void {
    this._onClick = handler
  }

  // 设置切换事件
  setOnToggle(handler: (state: boolean) => void): void {
    this._onToggle = handler
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    // 根据按钮类型选择渲染方法
    switch (this._type) {
      case ButtonType.ICON_ONLY:
        return this.renderIconOnlyButton(adapter)
      case ButtonType.TEXT_ONLY:
        return this.renderTextOnlyButton(adapter)
      case ButtonType.FLOATING:
        return this.renderFloatingButton(adapter)
      case ButtonType.DROPDOWN:
        return this.renderDropdownButton(adapter)
      case ButtonType.TOGGLE:
        return this.renderToggleButton(adapter)
      case ButtonType.ICON_TEXT:
      case ButtonType.BASIC:
      default:
        return this.renderBasicButton(adapter)
    }
  }

  // ========== 私有方法 ==========

  private adjustPropertiesByType(type: ButtonType): void {
    switch (type) {
      case ButtonType.ICON_ONLY:
        this._text = ''
        this._variant = 'flat'
        break
      case ButtonType.TEXT_ONLY:
        this._icon = undefined
        break
      case ButtonType.FLOATING:
        this._variant = 'floating'
        this._size = ButtonSize.LARGE
        break
      case ButtonType.DROPDOWN:
        this._icon = 'arrow_drop_down'
        this._iconPosition = 'right'
        break
      case ButtonType.TOGGLE:
        this._variant = 'flat'
        break
    }
  }

  private buildMaterializeClasses(): string {
    let classes = ['btn']
    
    // 添加变体类
    if (this._variant === 'flat') {
      classes.push('btn-flat')
    } else if (this._variant === 'floating') {
      classes.push('btn-floating')
    }
    
    // 添加颜色类
    classes.push(this._color)
    
    // 添加大小类
    switch (this._size) {
      case ButtonSize.SMALL:
        classes.push('btn-small')
        break
      case ButtonSize.LARGE:
        classes.push('btn-large')
        break
      case ButtonSize.EXTRA_LARGE:
        classes.push('btn-large')
        classes.push('btn-extra-large')
        break
    }
    
    // 添加状态类
    if (this._disabled) {
      classes.push('disabled')
    }
    if (this._loading) {
      classes.push('loading')
    }
    if (this._type === ButtonType.TOGGLE && this._toggleState) {
      classes.push('active')
    }
    
    return classes.join(' ')
  }

  private buildChildren(adapter: any): any[] {
    const children: any[] = []
    
    // 加载状态
    if (this._loading) {
      const spinner = adapter.createElement('div', {
        className: 'spinner'
      })
      children.push(spinner)
      return children
    }
    
    // 图标和文字
    if (this._icon && this._text) {
      // 图标+文字
      const iconElement = adapter.createElement('i', {
        className: `material-icons ${this._iconPosition === 'left' ? 'left' : 'right'}`
      }, [this._icon])
      
      if (this._iconPosition === 'left') {
        children.push(iconElement)
        children.push(this._text)
      } else {
        children.push(this._text)
        children.push(iconElement)
      }
    } else if (this._icon) {
      // 仅图标
      const iconElement = adapter.createElement('i', {
        className: 'material-icons'
      }, [this._icon])
      children.push(iconElement)
    } else if (this._text) {
      // 仅文字
      children.push(this._text)
    }
    
    return children
  }

  private renderBasicButton(adapter: any): any {
    const props: any = {
      className: this.buildMaterializeClasses(),
      disabled: this._disabled || this._loading
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onClick && !this._disabled && !this._loading) {
      props.onClick = this._onClick
    }

    const children = this.buildChildren(adapter)
    return adapter.createElement('button', props, children)
  }

  private renderIconOnlyButton(adapter: any): any {
    const props: any = {
      className: this.buildMaterializeClasses() + ' btn-icon-only',
      disabled: this._disabled || this._loading
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onClick && !this._disabled && !this._loading) {
      props.onClick = this._onClick
    }

    const children = this.buildChildren(adapter)
    return adapter.createElement('button', props, children)
  }

  private renderTextOnlyButton(adapter: any): any {
    const props: any = {
      className: this.buildMaterializeClasses() + ' btn-text-only',
      disabled: this._disabled || this._loading
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onClick && !this._disabled && !this._loading) {
      props.onClick = this._onClick
    }

    const children = this.buildChildren(adapter)
    return adapter.createElement('button', props, children)
  }

  private renderFloatingButton(adapter: any): any {
    const props: any = {
      className: this.buildMaterializeClasses(),
      disabled: this._disabled || this._loading
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onClick && !this._disabled && !this._loading) {
      props.onClick = this._onClick
    }

    const children = this.buildChildren(adapter)
    return adapter.createElement('button', props, children)
  }

  private renderDropdownButton(adapter: any): any {
    const props: any = {
      className: this.buildMaterializeClasses() + ' dropdown-trigger',
      'data-target': `dropdown-${this._id || 'default'}`,
      disabled: this._disabled || this._loading
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onClick && !this._disabled && !this._loading) {
      props.onClick = this._onClick
    }

    const children = this.buildChildren(adapter)
    const button = adapter.createElement('button', props, children)
    
    // 创建下拉菜单
    if (this._dropdownItems && this._dropdownItems.length > 0) {
      const dropdown = this.createDropdownMenu(adapter)
      return adapter.createElement('div', { className: 'dropdown-container' }, [button, dropdown])
    }
    
    return button
  }

  private renderToggleButton(adapter: any): any {
    const props: any = {
      className: this.buildMaterializeClasses() + ' btn-toggle',
      disabled: this._disabled || this._loading
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    if (this._onClick && !this._disabled && !this._loading) {
      props.onClick = () => {
        this.toggle()
        this._onClick?.()
      }
    }

    const children = this.buildChildren(adapter)
    return adapter.createElement('button', props, children)
  }

  private createDropdownMenu(adapter: any): any {
    const dropdownId = `dropdown-${this._id || 'default'}`
    const items = this._dropdownItems!.map(item => {
      const itemProps: any = {
        className: 'dropdown-item'
      }
      if (item.onClick) {
        itemProps.onClick = item.onClick
      }
      return adapter.createElement('a', itemProps, [item.text])
    })

    return adapter.createElement('ul', {
      id: dropdownId,
      className: 'dropdown-content'
    }, items)
  }
}