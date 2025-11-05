import { createApp, h, defineComponent, ref } from 'vue'
import Row from './Row.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand'

// 类型定义
export interface RowOptions extends IBaseCommandProps {
  gutter?: number | [number, number]  // 栅格间距
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
  wrap?: boolean
  class?: string
}

export interface RowEvents extends IBaseCommandEvents {}

/**
 * NHAI Row 的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 基于 24 列栅格系统的行容器
 */
export class NhaiRowCommand extends BaseCommand<RowOptions, RowEvents> {
  private gutter: number | [number, number] = 0
  private justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly' = 'start'
  private align: 'top' | 'middle' | 'bottom' | 'stretch' = 'top'
  private wrap: boolean = true
  private class?: string

  constructor(options?: RowOptions) {
    super(options || {})
    
    const opts = options || {}
    this.gutter = opts.gutter ?? 0
    this.justify = opts.justify ?? 'start'
    this.align = opts.align ?? 'top'
    this.wrap = opts.wrap ?? true
    this.class = opts.class
    
    Object.assign(this._props, {
      gutter: this.gutter,
      justify: this.justify,
      align: this.align,
      wrap: this.wrap,
      class: this.class,
      ...opts
    })
  }

  setGutter(gutter: number | [number, number]): this {
    this.gutter = gutter
    this.setProperty('gutter', gutter)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setJustify(justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'): this {
    this.justify = justify
    this.setProperty('justify', justify)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAlign(align: 'top' | 'middle' | 'bottom' | 'stretch'): this {
    this.align = align
    this.setProperty('align', align)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setWrap(wrap: boolean): this {
    this.wrap = wrap
    this.setProperty('wrap', wrap)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const gutterRef = ref(self.gutter)
    const justifyRef = ref(self.justify)
    const alignRef = ref(self.align)
    const wrapRef = ref(self.wrap)
    const classRef = ref(self.class)

    const RowWrapper = defineComponent({
      setup() {
        return () => h(Row, {
          gutter: gutterRef.value,
          justify: justifyRef.value,
          align: alignRef.value,
          wrap: wrapRef.value,
          class: classRef.value
        })
      }
    })

    const app = createApp(RowWrapper)
    app.mount(container)
    
    // 保存响应式引用
    ;(this as any)._gutterRef = gutterRef
    ;(this as any)._justifyRef = justifyRef
    ;(this as any)._alignRef = alignRef
    ;(this as any)._wrapRef = wrapRef
    ;(this as any)._classRef = classRef
    
    // 查找实际的内容容器
    setTimeout(() => {
      const rowElement = container.querySelector('.nhai-row') as HTMLElement
      if (rowElement) {
        this.contentContainer = rowElement
        // 渲染所有子组件
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
    
    if (isRef((this as any)._gutterRef)) {
      ;(this as any)._gutterRef.value = this.gutter
    }
    if (isRef((this as any)._justifyRef)) {
      ;(this as any)._justifyRef.value = this.justify
    }
    if (isRef((this as any)._alignRef)) {
      ;(this as any)._alignRef.value = this.align
    }
    if (isRef((this as any)._wrapRef)) {
      ;(this as any)._wrapRef.value = this.wrap
    }
    if (isRef((this as any)._classRef)) {
      ;(this as any)._classRef.value = this.class
    }
    
    if (this._mounted && this.contentContainer) {
      setTimeout(() => {
        this.renderAllChildren()
      }, 0)
    }
    
    super.update()
  }

  override unmount(): void {
    delete (this as any)._gutterRef
    delete (this as any)._justifyRef
    delete (this as any)._alignRef
    delete (this as any)._wrapRef
    delete (this as any)._classRef
    super.unmount()
  }
}

export default NhaiRowCommand

