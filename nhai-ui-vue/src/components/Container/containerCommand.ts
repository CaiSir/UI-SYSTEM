import { createApp, h, defineComponent, nextTick } from 'vue'
import Container from './Container.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface ContainerOptions extends IBaseCommandProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fixed?: boolean
  disableGutters?: boolean
  content?: string
}

export interface ContainerEvents extends IBaseCommandEvents {}

export class NhaiContainerCommand extends BaseCommand<ContainerOptions, ContainerEvents> {
  private maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false = 'lg'
  private fixed: boolean = false
  private disableGutters: boolean = false
  private content?: string

  constructor(contentOrOptions?: string | ContainerOptions) {
    const options: ContainerOptions = typeof contentOrOptions === 'string' || !contentOrOptions
      ? { content: contentOrOptions }
      : contentOrOptions
    super(options)
    
    this.maxWidth = options.maxWidth ?? 'lg'
    this.fixed = options.fixed ?? false
    this.disableGutters = options.disableGutters ?? false
    this.content = options.content
    
    Object.assign(this._props, {
      maxWidth: this.maxWidth,
      fixed: this.fixed,
      disableGutters: this.disableGutters,
      content: this.content,
      ...options
    })
  }

  setMaxWidth(maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false): this {
    this.maxWidth = maxWidth
    this.setProperty('maxWidth', maxWidth)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setFixed(fixed: boolean): this {
    this.fixed = fixed
    this.setProperty('fixed', fixed)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setDisableGutters(disableGutters: boolean): this {
    this.disableGutters = disableGutters
    this.setProperty('disableGutters', disableGutters)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setContent(content: string): this {
    this.content = content
    this.setProperty('content', content)
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

    const ContainerWrapper = defineComponent({
      setup() {
        return () => h(Container, {
          maxWidth: self.maxWidth,
          fixed: self.fixed,
          disableGutters: self.disableGutters,
          content: self.content
        })
      }
    })

    const app = createApp(ContainerWrapper)
    app.mount(container)
    
    // 查找实际的 Container 内容容器（.vue-container 元素）
    nextTick(() => {
      this.contentContainer = container.querySelector('.vue-container') || container
      // 如果找到了 .vue-container，确保它能够接收拖放
      if (this.contentContainer) {
        // 渲染所有子组件
        this.renderAllChildren()
      }
    })
    
    // 同步方式也尝试查找（如果 Vue 组件已经渲染）
    setTimeout(() => {
      if (!this.contentContainer) {
        this.contentContainer = container.querySelector('.vue-container') || container
        this.renderAllChildren()
      }
    }, 100)
    
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiContainerCommand

