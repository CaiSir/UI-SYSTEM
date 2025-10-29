import { createApp, h, defineComponent, nextTick } from 'vue'
import Grid from './Grid.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface GridOptions extends IBaseCommandProps {
  container?: boolean
  spacing?: number
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

export interface GridEvents extends IBaseCommandEvents {}

export class NhaiGridCommand extends BaseCommand<GridOptions, GridEvents> {
  private container: boolean = false
  private spacing: number = 2
  private direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'row'
  private justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' = 'flex-start'
  private alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' = 'stretch'
  private wrap: 'nowrap' | 'wrap' | 'wrap-reverse' = 'wrap'

  constructor(containerOrOptions: boolean | GridOptions = false) {
    const options: GridOptions = typeof containerOrOptions === 'boolean'
      ? { container: containerOrOptions }
      : containerOrOptions
    super(options)
    
    this.container = options.container ?? false
    this.spacing = options.spacing ?? 2
    this.direction = options.direction ?? 'row'
    this.justify = options.justify ?? 'flex-start'
    this.alignItems = options.alignItems ?? 'stretch'
    this.wrap = options.wrap ?? 'wrap'
    
    Object.assign(this._props, {
      container: this.container,
      spacing: this.spacing,
      direction: this.direction,
      justify: this.justify,
      alignItems: this.alignItems,
      wrap: this.wrap,
      ...options
    })
  }

  setContainer(container: boolean): this {
    this.container = container
    this.setProperty('container', container)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setSpacing(spacing: number): this {
    this.spacing = spacing
    this.setProperty('spacing', spacing)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setDirection(direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'): this {
    this.direction = direction
    this.setProperty('direction', direction)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setJustify(justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'): this {
    this.justify = justify
    this.setProperty('justify', justify)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAlignItems(alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'): this {
    this.alignItems = alignItems
    this.setProperty('alignItems', alignItems)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setWrap(wrap: 'nowrap' | 'wrap' | 'wrap-reverse'): this {
    this.wrap = wrap
    this.setProperty('wrap', wrap)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== 子组件管理 ====================
  protected childElements: Map<BaseCommand<any, any>, HTMLElement> = new Map()
  protected contentContainer?: HTMLElement

  override addChild<C extends BaseCommand<any, any>>(child: C): this {
    super.addChild(child)
    if (this._mounted && this.contentContainer) {
      this.renderChild(child)
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

  /**
   * 渲染子组件到内容容器
   */
  private renderChild(child: BaseCommand<any, any>): void {
    if (!this.contentContainer) return
    
    try {
      // 如果子组件已经渲染过且有映射，先移除旧的
      const oldElement = this.childElements.get(child)
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.removeChild(oldElement)
      }
      
      // 渲染子组件
      const childElement = child.render()
      
      // 挂载到内容容器
      this.contentContainer.appendChild(childElement)
      
      // 保存映射关系
      this.childElements.set(child, childElement)
    } catch (error) {
      console.error('Error rendering child component:', error)
    }
  }

  /**
   * 渲染所有子组件
   */
  private renderAllChildren(): void {
    if (!this.contentContainer) return
    
    this._children.forEach(child => {
      this.renderChild(child)
    })
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const GridWrapper = defineComponent({
      setup() {
        return () => h(Grid, {
          container: self.container,
          spacing: self.spacing,
          direction: self.direction,
          justify: self.justify,
          alignItems: self.alignItems,
          wrap: self.wrap
        })
      }
    })

    const app = createApp(GridWrapper)
    app.mount(container)
    
    // 查找实际的 Grid 内容容器（.vue-grid 元素）
    nextTick(() => {
      this.contentContainer = container.querySelector('.vue-grid') || container
      // 渲染所有子组件
      this.renderAllChildren()
    })
    
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiGridCommand

