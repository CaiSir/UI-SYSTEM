/**
 * NHAI框架无关的核心系统
 * 支持Vue、React、Svelte、原生JavaScript等
 */

// 基础接口定义
export interface NHAIEventCallback {
  (...args: any[]): void
}

export interface NHAIComponentProps {
  [key: string]: any
}

export interface NHAIRenderContext {
  framework: 'vue' | 'react' | 'svelte' | 'vanilla'
  container?: HTMLElement
  props?: NHAIComponentProps
  children?: any[]
}

// 框架适配器接口
export interface NHAIFrameworkAdapter {
  name: string
  createElement(tag: string, props?: any, children?: any[]): any
  mount(element: any, container: HTMLElement): void
  unmount(element: any): void
  updateProps(element: any, props: any): void
  addEventListener(element: any, event: string, handler: NHAIEventCallback): void
  removeEventListener(element: any, event: string, handler: NHAIEventCallback): void
}

// 框架注册器
export class NHAIFrameworkRegistry {
  private static adapters: Map<string, NHAIFrameworkAdapter> = new Map()
  private static currentAdapter: NHAIFrameworkAdapter | null = null

  static register(adapter: NHAIFrameworkAdapter): void {
    this.adapters.set(adapter.name, adapter)
  }

  static use(frameworkName: string): NHAIFrameworkAdapter {
    const adapter = this.adapters.get(frameworkName)
    if (!adapter) {
      throw new Error(`Framework adapter "${frameworkName}" not found`)
    }
    this.currentAdapter = adapter
    return adapter
  }

  static getCurrent(): NHAIFrameworkAdapter | null {
    return this.currentAdapter
  }

  static getAvailable(): string[] {
    return Array.from(this.adapters.keys())
  }
}

// 基础对象类（框架无关）
export abstract class NHAIObject {
  protected _parent: NHAIObject | null = null
  protected _children: NHAIObject[] = []
  protected _visible: boolean = true
  protected _enabled: boolean = true
  protected _id: string = ''
  protected _className: string = ''
  protected _style: Record<string, any> = {}
  protected _customStyle: Record<string, any> = {}
  protected _styleVariant: string = ''
  protected _props: NHAIComponentProps = {}
  protected _eventListeners: Map<string, NHAIEventCallback[]> = new Map()

  constructor(parent?: NHAIObject) {
    if (parent) {
      this.setParent(parent)
    }
  }

  // 基础属性方法
  setParent(parent: NHAIObject): void {
    if (this._parent) {
      this._parent.removeChild(this)
    }
    this._parent = parent
    if (parent) {
      parent.addChild(this)
    }
  }

  parent(): NHAIObject | null {
    return this._parent
  }

  addChild(child: NHAIObject): void {
    if (!this._children.includes(child)) {
      this._children.push(child)
    }
  }

  removeChild(child: NHAIObject): void {
    const index = this._children.indexOf(child)
    if (index > -1) {
      this._children.splice(index, 1)
    }
  }

  children(): NHAIObject[] {
    return [...this._children]
  }

  setVisible(visible: boolean): void {
    this._visible = visible
  }

  visible(): boolean {
    return this._visible
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled
  }

  enabled(): boolean {
    return this._enabled
  }

  setId(id: string): void {
    this._id = id
  }

  id(): string {
    return this._id
  }

  setClassName(className: string): void {
    this._className = className
  }

  className(): string {
    return this._className
  }

  setStyle(style: Record<string, any>): void {
    this._style = { ...this._style, ...style }
  }

  style(): Record<string, any> {
    return { ...this._style }
  }

  setCustomStyle(style: Record<string, any>): void {
    this._customStyle = { ...this._customStyle, ...style }
  }

  customStyle(): Record<string, any> {
    return { ...this._customStyle }
  }

  setStyleVariant(variant: string): void {
    this._styleVariant = variant
  }

  styleVariant(): string {
    return this._styleVariant
  }

  setProps(props: NHAIComponentProps): void {
    this._props = { ...this._props, ...props }
  }

  props(): NHAIComponentProps {
    return { ...this._props }
  }

  // 事件处理
  addEventListener(event: string, handler: NHAIEventCallback): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, [])
    }
    this._eventListeners.get(event)!.push(handler)
  }

  removeEventListener(event: string, handler: NHAIEventCallback): void {
    const handlers = this._eventListeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this._eventListeners.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }

  // 框架无关的渲染方法
  abstract render(context?: NHAIRenderContext): any

  // 样式合并
  getMergedStyle(): Record<string, any> {
    // 这里可以集成样式管理器
    let mergedStyle: Record<string, any> = {}
    
    // 合并实例样式
    mergedStyle = { ...mergedStyle, ...this._style }
    
    // 合并自定义样式（优先级最高）
    mergedStyle = { ...mergedStyle, ...this._customStyle }
    
    return mergedStyle
  }

  // 转换值为CSS值
  protected convertToCSSValue(property: string, value: any): string {
    if (typeof value === 'number') {
      if (property.includes('width') || property.includes('height') || 
          property.includes('margin') || property.includes('padding') ||
          property.includes('border') || property.includes('radius')) {
        return `${value}px`
      }
      if (property.includes('opacity') || property.includes('z-index')) {
        return value.toString()
      }
      return `${value}px`
    }
    return value.toString()
  }
}

// 基础控件类
export abstract class NHAIWidget extends NHAIObject {
  protected _width: number | string = 'auto'
  protected _height: number | string = 'auto'
  protected _minWidth: number | string = 'auto'
  protected _minHeight: number | string = 'auto'
  protected _maxWidth: number | string = 'none'
  protected _maxHeight: number | string = 'none'

  setWidth(width: number | string): void {
    this._width = width
  }

  width(): number | string {
    return this._width
  }

  setHeight(height: number | string): void {
    this._height = height
  }

  height(): number | string {
    return this._height
  }

  setMinimumWidth(width: number | string): void {
    this._minWidth = width
  }

  minimumWidth(): number | string {
    return this._minWidth
  }

  setMinimumHeight(height: number | string): void {
    this._minHeight = height
  }

  minimumHeight(): number | string {
    return this._minHeight
  }

  setMaximumWidth(width: number | string): void {
    this._maxWidth = width
  }

  maximumWidth(): number | string {
    return this._maxWidth
  }

  setMaximumHeight(height: number | string): void {
    this._maxHeight = height
  }

  maximumHeight(): number | string {
    return this._maxHeight
  }

  // 获取控件样式
  getWidgetStyle(): Record<string, any> {
    const style: Record<string, any> = {}
    
    if (this._width !== 'auto') {
      style.width = typeof this._width === 'number' ? `${this._width}px` : this._width
    }
    if (this._height !== 'auto') {
      style.height = typeof this._height === 'number' ? `${this._height}px` : this._height
    }
    if (this._minWidth !== 'auto') {
      style.minWidth = typeof this._minWidth === 'number' ? `${this._minWidth}px` : this._minWidth
    }
    if (this._minHeight !== 'auto') {
      style.minHeight = typeof this._minHeight === 'number' ? `${this._minHeight}px` : this._minHeight
    }
    if (this._maxWidth !== 'none') {
      style.maxWidth = typeof this._maxWidth === 'number' ? `${this._maxWidth}px` : this._maxWidth
    }
    if (this._maxHeight !== 'none') {
      style.maxHeight = typeof this._maxHeight === 'number' ? `${this._maxHeight}px` : this._maxHeight
    }

    return style
  }
}

// 对象工厂接口
export interface NHAIObjectFactory {
  createButton(text?: string, parent?: NHAIObject): any
  createLabel(text?: string, parent?: NHAIObject): any
  createInput(parent?: NHAIObject): any
  createCard(parent?: NHAIObject): any
  createContainer(parent?: NHAIObject): any
  createWindow(title?: string, parent?: NHAIObject): any
  createVBoxLayout(parent?: NHAIObject): any
  createHBoxLayout(parent?: NHAIObject): any
  createGridLayout(parent?: NHAIObject): any
}

// 框架检测工具
export class NHAIFrameworkDetector {
  static detect(): string {
    // 检测当前运行环境
    if (typeof window !== 'undefined') {
      // 浏览器环境
      if ((window as any).Vue || (window as any).vue) return 'vue'
      if ((window as any).React || (window as any).react) return 'react'
      if ((window as any).Svelte || (window as any).svelte) return 'svelte'
    }
    
    // 检查模块环境（仅在Node.js环境中）
    if (typeof (globalThis as any).require !== 'undefined') {
      try {
        (globalThis as any).require('vue')
        return 'vue'
      } catch {}
      
      try {
        (globalThis as any).require('react')
        return 'react'
      } catch {}
      
      try {
        (globalThis as any).require('svelte')
        return 'svelte'
      } catch {}
    }
    
    return 'vanilla'
  }

  static autoRegister(): void {
    const framework = this.detect()
    console.log(`NHAI: Auto-detected framework: ${framework}`)
    
    // 暂时只注册Vanilla适配器，其他适配器需要手动注册
    this.registerVanillaAdapter()
  }

  private static registerVanillaAdapter(): void {
    // 使用原生JavaScript适配器
    try {
      // 这里需要手动导入，避免动态导入问题
      console.log('NHAI: Registering Vanilla adapter')
      // 实际注册将在外部进行
    } catch (error) {
      console.error('NHAI: No adapters available', error)
    }
  }
}

// 初始化函数
export function initNHAI(framework?: string): void {
  if (framework) {
    // 手动指定框架
    NHAIFrameworkDetector.autoRegister()
  } else {
    // 自动检测框架
    NHAIFrameworkDetector.autoRegister()
  }
}

// 导出核心API
export const NHAI = {
  init: initNHAI,
  FrameworkRegistry: NHAIFrameworkRegistry,
  FrameworkDetector: NHAIFrameworkDetector,
  Object: NHAIObject,
  Widget: NHAIWidget
}
