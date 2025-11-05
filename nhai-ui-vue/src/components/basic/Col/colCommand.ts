import { createApp, h, defineComponent, ref } from 'vue'
import Col from './Col.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand'

// 响应式属性接口
export interface ResponsiveProps {
  span?: number
  offset?: number
  push?: number
  pull?: number
  order?: number
}

// 类型定义
export interface ColOptions extends IBaseCommandProps {
  span?: number
  offset?: number
  push?: number
  pull?: number
  order?: number
  xs?: number | ResponsiveProps
  sm?: number | ResponsiveProps
  md?: number | ResponsiveProps
  lg?: number | ResponsiveProps
  xl?: number | ResponsiveProps
  xxl?: number | ResponsiveProps
  class?: string
  flex?: string | number
}

export interface ColEvents extends IBaseCommandEvents {}

/**
 * NHAI Col 的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 基于 24 列栅格系统的列容器
 */
export class NhaiColCommand extends BaseCommand<ColOptions, ColEvents> {
  private span?: number
  private offset: number = 0
  private push: number = 0
  private pull: number = 0
  private order?: number
  private xs?: number | ResponsiveProps
  private sm?: number | ResponsiveProps
  private md?: number | ResponsiveProps
  private lg?: number | ResponsiveProps
  private xl?: number | ResponsiveProps
  private xxl?: number | ResponsiveProps
  private class?: string
  private flex?: string | number

  constructor(options?: ColOptions) {
    super(options || {})
    
    const opts = options || {}
    this.span = opts.span
    this.offset = opts.offset ?? 0
    this.push = opts.push ?? 0
    this.pull = opts.pull ?? 0
    this.order = opts.order
    this.xs = opts.xs
    this.sm = opts.sm
    this.md = opts.md
    this.lg = opts.lg
    this.xl = opts.xl
    this.xxl = opts.xxl
    this.class = opts.class
    this.flex = opts.flex
    
    Object.assign(this._props, {
      span: this.span,
      offset: this.offset,
      push: this.push,
      pull: this.pull,
      order: this.order,
      xs: this.xs,
      sm: this.sm,
      md: this.md,
      lg: this.lg,
      xl: this.xl,
      xxl: this.xxl,
      class: this.class,
      flex: this.flex,
      ...opts
    })
  }

  setSpan(span?: number): this {
    this.span = span
    this.setProperty('span', span)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setOffset(offset: number): this {
    this.offset = offset
    this.setProperty('offset', offset)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setPush(push: number): this {
    this.push = push
    this.setProperty('push', push)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setPull(pull: number): this {
    this.pull = pull
    this.setProperty('pull', pull)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setOrder(order?: number): this {
    this.order = order
    this.setProperty('order', order)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setResponsive(breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', value: number | ResponsiveProps): this {
    (this as any)[breakpoint] = value
    this.setProperty(breakpoint, value)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setFlex(flex?: string | number): this {
    this.flex = flex
    this.setProperty('flex', flex)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const spanRef = ref(self.span)
    const offsetRef = ref(self.offset)
    const pushRef = ref(self.push)
    const pullRef = ref(self.pull)
    const orderRef = ref(self.order)
    const xsRef = ref(self.xs)
    const smRef = ref(self.sm)
    const mdRef = ref(self.md)
    const lgRef = ref(self.lg)
    const xlRef = ref(self.xl)
    const xxlRef = ref(self.xxl)
    const classRef = ref(self.class)
    const flexRef = ref(self.flex)

    const ColWrapper = defineComponent({
      setup() {
        return () => h(Col, {
          span: spanRef.value,
          offset: offsetRef.value,
          push: pushRef.value,
          pull: pullRef.value,
          order: orderRef.value,
          xs: xsRef.value,
          sm: smRef.value,
          md: mdRef.value,
          lg: lgRef.value,
          xl: xlRef.value,
          xxl: xxlRef.value,
          class: classRef.value,
          flex: flexRef.value
        })
      }
    })

    const app = createApp(ColWrapper)
    app.mount(container)
    
    // 保存响应式引用
    ;(this as any)._spanRef = spanRef
    ;(this as any)._offsetRef = offsetRef
    ;(this as any)._pushRef = pushRef
    ;(this as any)._pullRef = pullRef
    ;(this as any)._orderRef = orderRef
    ;(this as any)._xsRef = xsRef
    ;(this as any)._smRef = smRef
    ;(this as any)._mdRef = mdRef
    ;(this as any)._lgRef = lgRef
    ;(this as any)._xlRef = xlRef
    ;(this as any)._xxlRef = xxlRef
    ;(this as any)._classRef = classRef
    ;(this as any)._flexRef = flexRef
    
    // 查找实际的内容容器
    setTimeout(() => {
      const colElement = container.querySelector('.nhai-col') as HTMLElement
      if (colElement) {
        this.contentContainer = colElement
        this.renderAllChildren()
      }
    }, 0)
    
    this._appInstance = app
    return container
  }

  protected contentContainer?: HTMLElement
  protected childElements: Map<BaseCommand<any, any>, HTMLElement> = new Map()

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

  private renderChild(child: BaseCommand<any, any>): void {
    if (!this.contentContainer) return
    
    try {
      const oldElement = this.childElements.get(child)
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.removeChild(oldElement)
      }
      
      const childElement = child.render()
      this.contentContainer.appendChild(childElement)
      this.childElements.set(child, childElement)
    } catch (error) {
      console.error('Error rendering child component:', error)
    }
  }

  private renderAllChildren(): void {
    if (!this.contentContainer) return
    this._children.forEach(child => {
      this.renderChild(child)
    })
  }

  protected override update(): void {
    const isRef = (ref: any): ref is { value: any } => {
      return ref && typeof ref === 'object' && 'value' in ref
    }
    
    if (isRef((this as any)._spanRef)) {
      ;(this as any)._spanRef.value = this.span
    }
    if (isRef((this as any)._offsetRef)) {
      ;(this as any)._offsetRef.value = this.offset
    }
    if (isRef((this as any)._pushRef)) {
      ;(this as any)._pushRef.value = this.push
    }
    if (isRef((this as any)._pullRef)) {
      ;(this as any)._pullRef.value = this.pull
    }
    if (isRef((this as any)._orderRef)) {
      ;(this as any)._orderRef.value = this.order
    }
    if (isRef((this as any)._xsRef)) {
      ;(this as any)._xsRef.value = this.xs
    }
    if (isRef((this as any)._smRef)) {
      ;(this as any)._smRef.value = this.sm
    }
    if (isRef((this as any)._mdRef)) {
      ;(this as any)._mdRef.value = this.md
    }
    if (isRef((this as any)._lgRef)) {
      ;(this as any)._lgRef.value = this.lg
    }
    if (isRef((this as any)._xlRef)) {
      ;(this as any)._xlRef.value = this.xl
    }
    if (isRef((this as any)._xxlRef)) {
      ;(this as any)._xxlRef.value = this.xxl
    }
    if (isRef((this as any)._classRef)) {
      ;(this as any)._classRef.value = this.class
    }
    if (isRef((this as any)._flexRef)) {
      ;(this as any)._flexRef.value = this.flex
    }
    
    if (this._mounted && this.contentContainer) {
      setTimeout(() => {
        this.renderAllChildren()
      }, 0)
    }
    
    super.update()
  }

  override unmount(): void {
    delete (this as any)._spanRef
    delete (this as any)._offsetRef
    delete (this as any)._pushRef
    delete (this as any)._pullRef
    delete (this as any)._orderRef
    delete (this as any)._xsRef
    delete (this as any)._smRef
    delete (this as any)._mdRef
    delete (this as any)._lgRef
    delete (this as any)._xlRef
    delete (this as any)._xxlRef
    delete (this as any)._classRef
    delete (this as any)._flexRef
    super.unmount()
  }
}

export default NhaiColCommand

