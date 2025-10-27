/**
 * 所有命令式组件的基类
 * 提供统一的接口和生命周期管理
 */
export abstract class BaseCommand {
  protected _mounted: boolean = false
  protected _element?: HTMLElement
  protected _appInstance?: any

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
    if (this._appInstance && typeof this._appInstance.unmount === 'function') {
      this._appInstance.unmount()
      this._appInstance = null
    }
    this._mounted = false
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
   * 设置组件ID
   */
  setId(id: string): void {
    if (this._element) {
      this._element.id = id
    }
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
  }
}

