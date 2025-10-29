/**
 * 所有命令式组件的基类
 * 提供统一的接口和生命周期管理
 */

// 基础属性接口
export interface IBaseCommandProps {
  id?: string
  className?: string
  style?: Partial<CSSStyleDeclaration>
}

// 基础事件接口
export interface IBaseCommandEvents extends Record<string, (...args: any[]) => void> {
  mounted: () => void
  unmounted: () => void
  updated: () => void
}

export abstract class BaseCommand<
  TProps extends IBaseCommandProps = IBaseCommandProps,
  TEvents extends Record<string, (...args: any[]) => void> = IBaseCommandEvents
> {
  // 生命周期状态
  protected _mounted: boolean = false
  protected _element?: HTMLElement
  protected _appInstance?: any
  
  // 父子关系
  protected _children: BaseCommand<TProps, TEvents>[] = []
  protected _parent?: BaseCommand<TProps, TEvents>
  
  // 属性系统
  protected _props: TProps
  
  // 事件系统 - 简化存储，但保持类型安全
  private _events: Map<keyof TEvents, Function[]> = new Map()
  
  // 资源清理
  private _cleanupCallbacks: (() => void)[] = []
  private _updateScheduled = false

  constructor(props: TProps = {} as TProps) {
    this._props = { ...props } as TProps
  }

  // ==================== 修复的事件系统 ====================

  on<K extends keyof TEvents>(event: K, handler: TEvents[K]): this {
    if (!this._events.has(event)) {
      this._events.set(event, [])
    }
    this._events.get(event)!.push(handler)
    return this
  }

  off<K extends keyof TEvents>(event: K, handler?: TEvents[K]): this {
    if (!handler) {
      this._events.delete(event)
    } else {
      const handlers = this._events.get(event)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
    return this
  }

  // 函数重载：支持有参数和无参数事件
  emit<K extends keyof TEvents>(event: K): void
  emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): void
  emit<K extends keyof TEvents>(event: K, ...args: any[]): void {
    const handlers = this._events.get(event)
    if (handlers) {
      // 复制数组避免在回调中修改影响遍历
      [...handlers].forEach(handler => {
        try {
          handler(...args)
        } catch (error) {
          console.error(`Error in event handler for ${String(event)}:`, error)
        }
      })
    }
  }

  // ==================== 修复的更新方法 ====================

  protected scheduleUpdate(): void {
    if (!this._updateScheduled && this._mounted) {
      this._updateScheduled = true
      Promise.resolve().then(() => {
        this._updateScheduled = false
        this.update()
      })
    }
  }

  /**
   * 更新组件（子类可以重写）
   */
  protected update(): void {
    this.emit('updated')
  }

  // ==================== 生命周期 ====================

  /**
   * 渲染组件为 DOM 元素
   */
  render(): HTMLElement {
    this.willMount()
    const element = this.doRender()
    this._element = element
    this._mounted = true
    this.didMount()
    this.emit('mounted')
    return element
  }

  /**
   * 具体的渲染实现（子类实现）
   */
  protected abstract doRender(): HTMLElement

  /**
   * 挂载前钩子
   */
  protected willMount(): void {
    // 子类可以重写
  }

  /**
   * 挂载后钩子
   */
  protected didMount(): void {
    // 子类可以重写
  }

  /**
   * 卸载组件
   */
  unmount(): void {
    this.willUnmount()
    
    // 清理资源
    this._cleanupCallbacks.forEach(callback => callback())
    this._cleanupCallbacks = []
    
    // 卸载子组件
    this._children.forEach(child => child.unmount())
    
    // 卸载 Vue 实例
    if (this._appInstance?.unmount) {
      this._appInstance.unmount()
      this._appInstance = null
    }
    
    // 清理事件
    this._events.clear()
    
    this._mounted = false
    this._element = undefined
    this.emit('unmounted')
  }

  /**
   * 卸载前钩子
   */
  protected willUnmount(): void {
    // 子类可以重写
  }

  /**
   * 注册清理回调
   */
  protected addCleanup(callback: () => void): void {
    this._cleanupCallbacks.push(callback)
  }

  // ==================== 属性系统 ====================

  /**
   * 设置属性
   */
  setProperty<K extends keyof TProps>(key: K, value: TProps[K]): this {
    this._props[key] = value
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 获取属性
   */
  getProperty<K extends keyof TProps>(key: K): TProps[K] {
    return this._props[key]
  }

  /**
   * 获取所有属性
   */
  getProperties(): TProps {
    return { ...this._props }
  }

  /**
   * 批量更新属性
   */
  setProperties(props: Partial<TProps>): this {
    Object.assign(this._props, props)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== 父子关系 ====================

  addChild<C extends BaseCommand<TProps, TEvents>>(child: C): this {
    if (child._parent === this) {
      return this
    }
    
    if (child._parent) {
      (child._parent as BaseCommand<TProps, TEvents>).removeChild(child)
    }
    
    this._children.push(child)
    child._parent = this as any
    return this
  }

  removeChild<C extends BaseCommand<TProps, TEvents>>(child: C): this {
    const index = this._children.indexOf(child as any)
    if (index > -1) {
      this._children.splice(index, 1)
      child._parent = undefined
    }
    return this
  }

  getChildren(): BaseCommand<TProps, TEvents>[] {
    return [...this._children]
  }

  getParent(): BaseCommand<TProps, TEvents> | undefined {
    return this._parent
  }

  clearChildren(): this {
    this._children.forEach(child => {
      child._parent = undefined
      child.unmount()
    })
    this._children = []
    return this
  }

  // ==================== 工具方法 ====================

  isMounted(): boolean {
    return this._mounted
  }

  getElement(): HTMLElement | undefined {
    return this._element
  }

  setId(id: string): this {
    this.setProperty('id' as any, id)
    if (this._element) {
      this._element.id = id
    }
    return this
  }

  getId(): string | undefined {
    return this.getProperty('id' as any)
  }

  setStyle(style: Partial<CSSStyleDeclaration>): this {
    this.setProperty('style' as any, style)
    if (this._element) {
      Object.assign(this._element.style, style)
    }
    return this
  }

  setClassName(className: string): this {
    this.setProperty('className' as any, className)
    if (this._element) {
      this._element.className = className
    }
    return this
  }

  findChild(predicate: (child: BaseCommand<TProps, TEvents>) => boolean): BaseCommand<TProps, TEvents> | undefined {
    return this._children.find(predicate)
  }

  findChildren(predicate: (child: BaseCommand<TProps, TEvents>) => boolean): BaseCommand<TProps, TEvents>[] {
    return this._children.filter(predicate)
  }

  /**
   * 递归查找子组件
   */
  findChildRecursive(predicate: (child: BaseCommand<TProps, TEvents>) => boolean): BaseCommand<TProps, TEvents> | undefined {
    for (const child of this._children) {
      if (predicate(child)) {
        return child
      }
      const found = child.findChildRecursive(predicate)
      if (found) {
        return found
      }
    }
    return undefined
  }
}