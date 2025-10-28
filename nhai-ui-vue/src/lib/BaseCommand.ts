/**
 * 所有命令式组件的基类
 * 提供统一的接口和生命周期管理
 * 类似 Qt 的 QObject 设计
 */
export abstract class BaseCommand {
  // 生命周期状态
  protected _mounted: boolean = false
  protected _element?: HTMLElement
  protected _appInstance?: any
  
  // 父子关系（类似 Qt 的 QObject parent/children）
  protected _children: BaseCommand[] = []
  protected _parent?: BaseCommand
  
  // 属性系统（类似 Qt 的 property system）
  private props: Record<string, any> = {}
  
  // 事件系统（类似 Qt 的 signal/slot）
  private events: Map<string, Function[]> = new Map()

  /**
   * 渲染组件为 DOM 元素
   * 子类必须实现此方法
   */
  abstract render(): HTMLElement

  /**
   * 卸载组件
   * 子类可以实现此方法来清理资源
   */
  unmount(): void {
    // 卸载所有子组件
    this._children.forEach(child => child.unmount())
    
    // 卸载 Vue 实例
    if (this._appInstance && typeof this._appInstance.unmount === 'function') {
      this._appInstance.unmount()
      this._appInstance = null
    }
    
    // 清理事件监听器
    this.events.clear()
    
    this._mounted = false
    this._element = undefined
  }

  /**
   * 检查组件是否已挂载
   */
  isMounted(): boolean {
    return this._mounted
  }

  /**
   * 获取渲染的元素
   */
  getElement(): HTMLElement | undefined {
    return this._element
  }

  /**
   * 设置组件ID（类似 Qt 的 setObjectName）
   */
  setId(id: string): void {
    if (this._element) {
      this._element.id = id
    }
    this.props.id = id
  }

  /**
   * 获取组件ID
   */
  getId(): string | undefined {
    return this.props.id
  }

  /**
   * 设置自定义样式
   */
  setStyle(style: Record<string, string>): void {
    if (this._element) {
      Object.assign(this._element.style, style)
    }
  }

  /**
   * 设置类名
   */
  setClassName(className: string): void {
    if (this._element) {
      this._element.className = className
    }
    this.props.className = className
  }

  // ==================== 属性系统（类似 Qt） ====================

  /**
   * 设置属性（类似 Qt 的 setProperty）
   */
  setProperty(key: string, value: any): void {
    this.props[key] = value
    // 如果已渲染，可以触发更新
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 获取属性（类似 Qt 的 property）
   */
  getProperty(key: string): any {
    return this.props[key]
  }

  /**
   * 获取所有属性
   */
  getProperties(): Record<string, any> {
    return { ...this.props }
  }

  // ==================== 事件系统（类似 Qt 的 signal/slot） ====================

  /**
   * 监听事件（类似 Qt 的 connect）
   */
  on(event: string, handler: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(handler)
  }

  /**
   * 移除事件监听
   */
  off(event: string, handler?: Function): void {
    if (!handler) {
      // 移除所有该事件的监听
      this.events.delete(event)
    } else {
      // 移除特定的监听
      const handlers = this.events.get(event)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  /**
   * 触发事件（类似 Qt 的 emit）
   */
  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }

  // ==================== 父子关系（类似 Qt 的 QObject） ====================

  /**
   * 添加子组件（类似 Qt 的 addChild）
   */
  addChild(child: BaseCommand): void {
    if (child._parent) {
      child._parent.removeChild(child)
    }
    this._children.push(child)
    child._parent = this
  }

  /**
   * 移除子组件
   */
  removeChild(child: BaseCommand): void {
    const index = this._children.indexOf(child)
    if (index > -1) {
      this._children.splice(index, 1)
      child._parent = undefined
    }
  }

  /**
   * 获取子组件列表
   */
  getChildren(): BaseCommand[] {
    return [...this._children]
  }

  /**
   * 获取父组件
   */
  getParent(): BaseCommand | undefined {
    return this._parent
  }

  /**
   * 清空所有子组件
   */
  clearChildren(): void {
    this._children.forEach(child => {
      child._parent = undefined
      child.unmount()
    })
    this._children = []
  }

  /**
   * 更新组件（子类可以重写）
   */
  protected update(): void {
    // 子类可以重写此方法实现增量更新
  }

  /**
   * 查找子组件（类似 Qt 的 findChild）
   */
  findChild(predicate: (child: BaseCommand) => boolean): BaseCommand | undefined {
    return this._children.find(predicate)
  }

  /**
   * 查找所有匹配的子组件
   */
  findChildren(predicate: (child: BaseCommand) => boolean): BaseCommand[] {
    return this._children.filter(predicate)
  }
}

