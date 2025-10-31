/**
 * Widget 窗口控件命令式组件
 * 提供窗口管理功能（最大化、最小化、关闭）和子控件支持
 */

import { createApp, h, defineComponent, nextTick, ref } from 'vue'
import Widget from './Widget.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 菜单项类型
export interface MenuItem {
  label: string
  active?: boolean
  onClick?: () => void
}

// 类型定义
export interface WidgetOptions extends IBaseCommandProps {
  title?: string
  width?: string | number
  height?: string | number
  fullscreen?: boolean
  menuBarVisible?: boolean
  menuItems?: MenuItem[]
  canMinimize?: boolean
  canMaximize?: boolean
  canClose?: boolean
  minimized?: boolean
  maximized?: boolean
  position?: { x: number; y: number }
  zIndex?: number
}

export interface WidgetEvents extends IBaseCommandEvents {
  minimize: () => void
  maximize: () => void
  restore: () => void
  close: () => void
  menuClick: (item: MenuItem, index: number) => void
  focus: () => void
}

export class NhaiWidgetCommand extends BaseCommand<WidgetOptions, WidgetEvents> {
  private title: string = '窗口'
  private width: string | number = '800px'
  private height: string | number = '600px'
  private fullscreen: boolean = false
  private menuBarVisible: boolean = true
  private menuItems?: MenuItem[]
  private canMinimize: boolean = true
  private canMaximize: boolean = true
  private canClose: boolean = true
  private minimized: boolean = false
  private maximized: boolean = false
  private position?: { x: number; y: number }  // 默认不设置位置，居中显示
  private zIndex: number = 1000
  private previousState?: { width: string | number; height: string | number; position?: { x: number; y: number } }

  // 子组件管理
  protected childElements: Map<BaseCommand<any, any>, HTMLElement> = new Map()
  protected contentContainer?: HTMLElement

  constructor(titleOrOptions?: string | WidgetOptions) {
    const options: WidgetOptions = typeof titleOrOptions === 'string' || !titleOrOptions
      ? { title: titleOrOptions }
      : titleOrOptions
    super(options)

    this.title = options.title ?? '窗口'
    this.width = options.width ?? '800px'
    this.height = options.height ?? '600px'
    this.fullscreen = options.fullscreen ?? false
    this.menuBarVisible = options.menuBarVisible ?? true
    this.menuItems = options.menuItems
    this.canMinimize = options.canMinimize ?? true
    this.canMaximize = options.canMaximize ?? true
    this.canClose = options.canClose ?? true
    this.minimized = options.minimized ?? false
    this.maximized = options.maximized ?? false
    this.position = options.position  // 默认不设置位置，居中显示
    this.zIndex = options.zIndex ?? 1000

    Object.assign(this._props, {
      title: this.title,
      width: this.width,
      height: this.height,
      fullscreen: this.fullscreen,
      menuBarVisible: this.menuBarVisible,
      menuItems: this.menuItems,
      canMinimize: this.canMinimize,
      canMaximize: this.canMaximize,
      canClose: this.canClose,
      minimized: this.minimized,
      maximized: this.maximized,
      position: this.position,  // undefined 表示居中
      zIndex: this.zIndex,
      ...options
    })
  }

  // ==================== 属性设置方法 ====================

  setTitle(title: string): this {
    this.title = title
    this.setProperty('title', title)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getTitle(): string {
    return this.title
  }

  setWidth(width: string | number): this {
    this.width = width
    this.setProperty('width', width)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getWidth(): string | number {
    return this.width
  }

  setHeight(height: string | number): this {
    this.height = height
    this.setProperty('height', height)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getHeight(): string | number {
    return this.height
  }

  setFullscreen(fullscreen: boolean): this {
    this.fullscreen = fullscreen
    this.setProperty('fullscreen', fullscreen)
    if (fullscreen) {
      this.maximized = false
      this.setProperty('maximized', false)
    }
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setMenuBarVisible(visible: boolean): this {
    this.menuBarVisible = visible
    this.setProperty('menuBarVisible', visible)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setMenuItems(items: MenuItem[]): this {
    this.menuItems = items
    this.setProperty('menuItems', items)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setPosition(x: number, y: number): this {
    this.position = { x, y }  // 设置位置后，窗口从居中切换到固定位置
    this.setProperty('position', this.position)
    // 更新响应式引用
    if ((this as any)._positionRef) {
      ;(this as any)._positionRef.value = { x, y }
    }
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getPosition(): { x: number; y: number } | undefined {
    return this.position ? { ...this.position } : undefined
  }

  setZIndex(zIndex: number): this {
    this.zIndex = zIndex
    this.setProperty('zIndex', zIndex)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== 更新方法 ====================

  protected override update(): void {
    // 更新响应式引用，触发 Vue 组件重新渲染
    if ((this as any)._titleRef) {
      ;(this as any)._titleRef.value = this.title
    }
    if ((this as any)._widthRef) {
      ;(this as any)._widthRef.value = this.width
    }
    if ((this as any)._heightRef) {
      ;(this as any)._heightRef.value = this.height
    }
    if ((this as any)._fullscreenRef) {
      ;(this as any)._fullscreenRef.value = this.fullscreen
    }
    if ((this as any)._menuBarVisibleRef) {
      ;(this as any)._menuBarVisibleRef.value = this.menuBarVisible
    }
    if ((this as any)._menuItemsRef) {
      ;(this as any)._menuItemsRef.value = this.menuItems
    }
    if ((this as any)._canMinimizeRef) {
      ;(this as any)._canMinimizeRef.value = this.canMinimize
    }
    if ((this as any)._canMaximizeRef) {
      ;(this as any)._canMaximizeRef.value = this.canMaximize
    }
    if ((this as any)._canCloseRef) {
      ;(this as any)._canCloseRef.value = this.canClose
    }
    if ((this as any)._minimizedRef) {
      ;(this as any)._minimizedRef.value = this.minimized
    }
    if ((this as any)._maximizedRef) {
      ;(this as any)._maximizedRef.value = this.maximized
    }
    if ((this as any)._positionRef) {
      ;(this as any)._positionRef.value = this.position
    }
    if ((this as any)._zIndexRef) {
      ;(this as any)._zIndexRef.value = this.zIndex
    }
    super.update()
  }

  // ==================== 窗口操作方法 ====================

  minimize(): this {
    if (!this.canMinimize || this.minimized) return this
    
    // 保存当前状态
    if (!this.maximized && !this.fullscreen) {
      this.previousState = {
        width: this.width,
        height: this.height,
        position: this.position ? { ...this.position } : undefined
      }
    }
    
    this.minimized = true
    this.setProperty('minimized', true)
    this.emit('minimize')
    
    if (this._mounted) {
      this.scheduleUpdate()  // update() 方法会更新所有响应式引用
    }
    return this
  }

  maximize(): this {
    if (!this.canMaximize) return this
    
    if (this.maximized) {
      // 还原
      this.restore()
    } else {
      // 最大化
      if (!this.minimized && !this.fullscreen) {
        this.previousState = {
          width: this.width,
          height: this.height,
          position: this.position ? { ...this.position } : undefined
        }
      }
      this.maximized = true
      this.minimized = false
      this.setProperty('maximized', true)
      this.setProperty('minimized', false)
      this.emit('maximize')
      
      if (this._mounted) {
        this.scheduleUpdate()  // update() 方法会更新所有响应式引用
      }
    }
    return this
  }

  restore(): this {
    if (this.previousState) {
      this.width = this.previousState.width
      this.height = this.previousState.height
      this.position = this.previousState.position ? { ...this.previousState.position } : undefined
      this.setProperty('width', this.width)
      this.setProperty('height', this.height)
      this.setProperty('position', this.position)
      this.previousState = undefined
    }
    
    this.maximized = false
    this.minimized = false
    this.setProperty('maximized', false)
    this.setProperty('minimized', false)
    this.emit('restore')
    
    if (this._mounted) {
      this.scheduleUpdate()  // update() 方法会更新所有响应式引用
    }
    return this
  }

  close(): this {
    this.emit('close')
    
    // 卸载组件实例（包括从 DOM 中移除）
    if (this._mounted) {
      // 先从 DOM 中移除元素
      if (this._element && this._element.parentNode) {
        this._element.parentNode.removeChild(this._element)
      }
      
      // 卸载组件（清理 Vue 实例、子组件等）
      this.unmount()
    }
    
    return this
  }

  isMinimized(): boolean {
    return this.minimized
  }

  isMaximized(): boolean {
    return this.maximized
  }

  isFullscreen(): boolean {
    return this.fullscreen
  }

  // ==================== 子组件管理 ====================

  override addChild<C extends BaseCommand<any, any>>(child: C): this {
    // 关键：在调用 super.addChild 之前，先检查 childElements 映射
    // 如果已经在映射中，说明是手动添加的，不需要自动渲染
    if (this.childElements.has(child)) {
      // 已经在映射中，说明是手动添加的，只添加到 _children，不渲染
      if (!this._children.includes(child)) {
        this._children.push(child)
        // 设置父引用
        ;(child as any)._parent = this
      }
      return this
    }
    
    super.addChild(child)
    
    // 在可视化编辑器中，子组件是手动添加的，这里不自动渲染
    // 只有非可视化编辑器模式才自动渲染
    if (this._mounted && this.contentContainer) {
      // 再次检查是否有手动添加的子组件（通过检查是否有 wrapper）
      const hasManualChildren = Array.from(this.contentContainer.children).some(
        c => c.classList && 
        (c.classList.contains('widget-child-component') || 
         c.classList.contains('dialog-child-component'))
      )
      // 再次检查 childElements 映射
      if (this.childElements.has(child)) {
        // 在调用期间已被添加到映射中，跳过渲染
        return this
      }
      // 如果没有手动添加的子组件，才自动渲染
      if (!hasManualChildren) {
        this.renderChild(child)
      }
    }
    return this
  }

  override removeChild<C extends BaseCommand<any, any>>(child: C): this {
    super.removeChild(child)
    const childElement = this.childElements.get(child)
    if (childElement && childElement.parentNode) {
      childElement.parentNode.removeChild(childElement)
    }
    this.childElements.delete(child)
    return this
  }

  private renderChild(child: BaseCommand<any, any>): void {
    if (!this.contentContainer) return
    
    try {
      // 第一步：最优先检查 childElements 映射（这是最可靠的，因为我们在拖放时已经设置了）
      if (this.childElements.has(child)) {
        const existingElement = this.childElements.get(child)
        // 如果已经在映射中，检查是否是 wrapper
        if (existingElement) {
          // 如果是 wrapper 类型（可视化编辑器中的包装器），完全跳过
          if (existingElement.classList && 
              (existingElement.classList.contains('widget-child-component') || 
               existingElement.classList.contains('dialog-child-component'))) {
            // 这是可视化编辑器中的包装器，已经手动渲染过了，完全跳过
            return
          }
          // 如果元素在 DOM 中
          if (existingElement.parentNode) {
            // 如果不在 contentContainer 中，说明在 wrapper 中，跳过
            if (!this.contentContainer.contains(existingElement)) {
              return
            }
            // 如果元素在 contentContainer 中，先移除旧的（类似 Dialog 的处理）
            if (this.contentContainer.contains(existingElement)) {
              existingElement.parentNode.removeChild(existingElement)
            }
          } else {
            // 如果元素不在 DOM 中，但映射中有，也跳过（可能是空的 wrapper）
            return
          }
        } else {
          // 映射中有，但元素是 undefined/null，也跳过
          return
        }
      }
      
      // 第二步：检查子组件实例的元素是否已经在 DOM 中（包括在 wrapper 中）
      const childElementFromInstance = child.getElement()
      if (childElementFromInstance && childElementFromInstance.parentNode) {
        // 元素已经在 DOM 中，向上查找是否在 widget-content 或其 wrapper 中
        let parent: ParentNode | null = childElementFromInstance.parentNode
        
        while (parent) {
          // 如果父节点是 widget-content，说明已经在 Widget 中
          if (parent === this.contentContainer || 
              (parent instanceof HTMLElement && parent.classList.contains('widget-content'))) {
            // 已经在 Widget 内容区域中，不需要重复渲染
            // 查找是否在 wrapper 中
            let wrapperParent: ParentNode | null = childElementFromInstance.parentNode
            while (wrapperParent && wrapperParent !== parent) {
              if (wrapperParent instanceof HTMLElement && 
                  (wrapperParent.classList.contains('widget-child-component') || 
                   wrapperParent.classList.contains('dialog-child-component'))) {
                // 在 wrapper 中，更新映射指向 wrapper
                this.childElements.set(child, wrapperParent)
                return
              }
              wrapperParent = wrapperParent.parentNode
            }
            // 不在 wrapper 中，但已经在 contentContainer 中，更新映射
            this.childElements.set(child, childElementFromInstance)
            return
          }
          // 如果是 wrapper，说明是手动添加的
          if (parent instanceof HTMLElement && 
              (parent.classList.contains('widget-child-component') || 
               parent.classList.contains('dialog-child-component'))) {
            // 在 wrapper 中，是手动添加的，完全跳过，更新映射指向 wrapper
            this.childElements.set(child, parent)
            return
          }
          parent = parent.parentNode
        }
        
        // 元素在 DOM 中但不在 Widget 中，也不要重复渲染，更新映射
        this.childElements.set(child, childElementFromInstance)
        return
      }
      
      // 第三步：只有在映射中没有，且元素不在 DOM 中时，才渲染
      const childElement = child.render()
      if (childElement) {
        // 检查渲染后的元素是否已经在 DOM 中
        if (childElement.parentNode === null) {
          // 元素没有父节点，安全添加到 contentContainer
          this.contentContainer.appendChild(childElement)
          this.childElements.set(child, childElement)
        } else {
          // 如果元素已经有父节点，说明 render() 返回了已存在的元素
          // 或者元素已经在其他地方渲染了，更新映射
          this.childElements.set(child, childElement)
        }
      }
    } catch (error) {
      console.error('Error rendering child component:', error)
    }
  }

  // 渲染所有子组件（在非可视化编辑器模式下使用）
  // 在可视化编辑器模式中不会调用，因为子组件是手动管理的
  private renderAllChildren(): void {
    if (!this.contentContainer) return
    
    // 检查是否有手动添加的子组件（通过 childElements 映射判断）
    // 如果 childElements 中已经有元素，说明是手动添加的（在可视化编辑器中）
    // 或者在可视化编辑器模式（元素已经在 wrapper 中）时跳过自动渲染
    const hasManuallyAddedChildren = Array.from(this.contentContainer.children).some(
      child => child.classList && 
      (child.classList.contains('widget-child-component') || 
       child.classList.contains('dialog-child-component'))
    )
    
    // 如果 _children 的数量和 childElements 的数量不一致，说明有手动添加的组件
    // 或者直接检查是否有 wrapper 类型的子元素
    if (hasManuallyAddedChildren || (this._children.length > 0 && this.childElements.size > 0)) {
      // 有手动添加的子组件，完全跳过自动渲染
      return
    }
    
    this._children.forEach(child => {
      this.renderChild(child)
    })
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    // 使用响应式引用，确保属性变化时组件会更新
    const titleRef = ref(self.title)
    const widthRef = ref(self.width)
    const heightRef = ref(self.height)
    const fullscreenRef = ref(self.fullscreen)
    const menuBarVisibleRef = ref(self.menuBarVisible)
    const menuItemsRef = ref(self.menuItems)
    const canMinimizeRef = ref(self.canMinimize)
    const canMaximizeRef = ref(self.canMaximize)
    const canCloseRef = ref(self.canClose)
    const minimizedRef = ref(self.minimized)
    const maximizedRef = ref(self.maximized)
    const positionRef = ref(self.position)
    const zIndexRef = ref(self.zIndex)

    // 保存引用以便后续更新
    ;(this as any)._titleRef = titleRef
    ;(this as any)._widthRef = widthRef
    ;(this as any)._heightRef = heightRef
    ;(this as any)._fullscreenRef = fullscreenRef
    ;(this as any)._menuBarVisibleRef = menuBarVisibleRef
    ;(this as any)._menuItemsRef = menuItemsRef
    ;(this as any)._canMinimizeRef = canMinimizeRef
    ;(this as any)._canMaximizeRef = canMaximizeRef
    ;(this as any)._canCloseRef = canCloseRef
    ;(this as any)._minimizedRef = minimizedRef
    ;(this as any)._maximizedRef = maximizedRef
    ;(this as any)._positionRef = positionRef
    ;(this as any)._zIndexRef = zIndexRef

    const WidgetWrapper = defineComponent({
      setup() {
        return () => h(Widget, {
          key: `${minimizedRef.value}-${maximizedRef.value}-${fullscreenRef.value}`, // 添加 key 强制更新
          title: titleRef.value,
          width: widthRef.value,
          height: heightRef.value,
          fullscreen: fullscreenRef.value,
          menuBarVisible: menuBarVisibleRef.value,
          menuItems: menuItemsRef.value,
          canMinimize: canMinimizeRef.value,
          canMaximize: canMaximizeRef.value,
          canClose: canCloseRef.value,
          minimized: minimizedRef.value,
          maximized: maximizedRef.value,
          position: positionRef.value,
          zIndex: zIndexRef.value,
          onMinimize: () => {
            self.minimize()
          },
          onMaximize: () => {
            self.maximize()
          },
          onRestore: () => {
            self.restore()
          },
          onClose: () => {
            self.close()
          },
          onMenuClick: (item: MenuItem, index: number) => {
            self.emit('menuClick', item, index)
          },
          onFocus: () => {
            self.emit('focus')
          },
          onPositionChange: (pos: { x: number; y: number }) => {
            // 拖拽后设置位置，从居中切换到固定位置
            self.position = pos
            self.setProperty('position', pos)
            positionRef.value = pos
          }
        }, {
          default: () => {
            // 子组件通过内容容器渲染，这里返回空
            return null
          }
        })
      }
    })

    const app = createApp(WidgetWrapper)
    app.mount(container)
    
    // 查找内容容器（在可视化编辑器中，子组件是手动添加的，不需要自动渲染）
    // 只在内容容器找到且没有手动添加的子组件时才渲染
    nextTick(() => {
      this.contentContainer = container.querySelector('.widget-content') as HTMLElement || container
      // 不在这里调用 renderAllChildren，因为可视化编辑器会手动管理子组件
      // renderAllChildren 会在需要时被调用（比如非可视化编辑器模式）
    })
    
    this._appInstance = app

    return container
  }

  override unmount(): void {
    this.childElements.clear()
    this.contentContainer = undefined
    // 清理响应式引用
    ;(this as any)._titleRef = undefined
    ;(this as any)._widthRef = undefined
    ;(this as any)._heightRef = undefined
    ;(this as any)._fullscreenRef = undefined
    ;(this as any)._menuBarVisibleRef = undefined
    ;(this as any)._menuItemsRef = undefined
    ;(this as any)._canMinimizeRef = undefined
    ;(this as any)._canMaximizeRef = undefined
    ;(this as any)._canCloseRef = undefined
    ;(this as any)._minimizedRef = undefined
    ;(this as any)._maximizedRef = undefined
    ;(this as any)._positionRef = undefined
    ;(this as any)._zIndexRef = undefined
    super.unmount()
  }
}

export default NhaiWidgetCommand
