import { createApp, h, defineComponent, nextTick } from 'vue'
import Container from './Container.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand'

// 类型定义
export interface ContainerOptions extends IBaseCommandProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fixed?: boolean
  disableGutters?: boolean
  content?: string
  layoutLeftMargin?: number | string  // 左边距
  topMargin?: number | string         // 上边距
  rightMargin?: number | string       // 右边距
  bottomMargin?: number | string      // 下边距
  layoutSpacing?: number              // 布局间距（用于 Flex 布局的 gap）
  layoutStretch?: boolean             // 布局拉伸（是否拉伸到容器宽度）
}

export interface ContainerEvents extends IBaseCommandEvents {}

export class NhaiContainerCommand extends BaseCommand<ContainerOptions, ContainerEvents> {
  private maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false = 'lg'
  private fixed: boolean = false
  private disableGutters: boolean = false
  private content?: string
  private layoutLeftMargin?: number | string = 0
  private topMargin?: number | string = 0
  private rightMargin?: number | string = 0
  private bottomMargin?: number | string = 0
  private layoutSpacing?: number
  private layoutStretch: boolean = false

  constructor(contentOrOptions?: string | ContainerOptions) {
    const options: ContainerOptions = typeof contentOrOptions === 'string' || !contentOrOptions
      ? { content: contentOrOptions }
      : contentOrOptions
    super(options)
    
    this.maxWidth = options.maxWidth ?? 'lg'
    this.fixed = options.fixed ?? false
    this.disableGutters = options.disableGutters ?? false
    this.content = options.content
    this.layoutLeftMargin = options.layoutLeftMargin ?? 0
    this.topMargin = options.topMargin ?? 0
    this.rightMargin = options.rightMargin ?? 0
    this.bottomMargin = options.bottomMargin ?? 0
    this.layoutSpacing = options.layoutSpacing
    this.layoutStretch = options.layoutStretch ?? false
    
    Object.assign(this._props, {
      maxWidth: this.maxWidth,
      fixed: this.fixed,
      disableGutters: this.disableGutters,
      content: this.content,
      layoutLeftMargin: this.layoutLeftMargin,
      topMargin: this.topMargin,
      rightMargin: this.rightMargin,
      bottomMargin: this.bottomMargin,
      layoutSpacing: this.layoutSpacing,
      layoutStretch: this.layoutStretch,
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

  setLayoutLeftMargin(margin: number | string): this {
    this.layoutLeftMargin = margin
    this.setProperty('layoutLeftMargin', margin)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setTopMargin(margin: number | string): this {
    this.topMargin = margin
    this.setProperty('topMargin', margin)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setRightMargin(margin: number | string): this {
    this.rightMargin = margin
    this.setProperty('rightMargin', margin)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setBottomMargin(margin: number | string): this {
    this.bottomMargin = margin
    this.setProperty('bottomMargin', margin)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setLayoutSpacing(spacing: number): this {
    this.layoutSpacing = spacing
    this.setProperty('layoutSpacing', spacing)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setLayoutStretch(stretch: boolean): this {
    this.layoutStretch = stretch
    this.setProperty('layoutStretch', stretch)
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
      
      // 检查是否有 Flex 布局样式
      const style = (this as any).getProperty?.('style') || (this as any)?._props?.style || {}
      const targetContainer = (style && style.display === 'flex') 
        ? (this._element || this.contentContainer)  // Flex 布局时使用外层容器
        : this.contentContainer  // 普通布局时使用内容容器
      
      // 如果是 Flex 布局，清除子组件的所有 margin 和 padding，确保间距只由 gap 控制
      if (style && style.display === 'flex' && childElement instanceof HTMLElement) {
        // 清除子组件自身的 margin 和 padding
        childElement.style.margin = '0'
        childElement.style.marginLeft = '0'
        childElement.style.marginRight = '0'
        childElement.style.marginTop = '0'
        childElement.style.marginBottom = '0'
        childElement.style.padding = '0'
        childElement.style.paddingLeft = '0'
        childElement.style.paddingRight = '0'
        childElement.style.paddingTop = '0'
        childElement.style.paddingBottom = '0'
        // 使用 setProperty 强制设置，确保优先级
        childElement.style.setProperty('margin', '0', 'important')
        childElement.style.setProperty('margin-left', '0', 'important')
        childElement.style.setProperty('margin-right', '0', 'important')
        childElement.style.setProperty('padding', '0', 'important')
        childElement.style.setProperty('padding-left', '0', 'important')
        childElement.style.setProperty('padding-right', '0', 'important')
        
        // 防止 Flex 子项收缩或扩展
        childElement.style.flexShrink = '0'
        childElement.style.flexGrow = '0'
      }
      
      // 挂载到目标容器
      targetContainer.appendChild(childElement)
      
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
    
    // 检查是否有 Flex 布局样式
    const style = (this as any).getProperty?.('style') || (this as any)?._props?.style || {}
    const isFlexLayout = style && style.display === 'flex'
    
    // 如果是 Flex 布局，确保 contentContainer 指向外层容器
    if (isFlexLayout) {
      this.contentContainer = this._element || this.contentContainer
    }
    
    this._children.forEach(child => {
      this.renderChild(child)
    })
    
    // 如果是 Flex 布局，使用 nextTick 确保子组件样式已应用后再检查
    if (isFlexLayout) {
      nextTick(() => {
        // 再次检查所有子元素，确保它们的 margin/padding 都被清除
        const allChildren = Array.from(this.contentContainer?.children || []) as HTMLElement[]
        allChildren.forEach(childEl => {
          if (childEl instanceof HTMLElement) {
            childEl.style.margin = '0'
            childEl.style.marginLeft = '0'
            childEl.style.marginRight = '0'
            childEl.style.marginTop = '0'
            childEl.style.marginBottom = '0'
            childEl.style.padding = '0'
            childEl.style.paddingLeft = '0'
            childEl.style.paddingRight = '0'
            childEl.style.setProperty('margin', '0', 'important')
            childEl.style.setProperty('margin-left', '0', 'important')
            childEl.style.setProperty('padding-left', '0', 'important')
          }
        })
      })
    }
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    // 应用通过 setStyle 设置的样式（如 Flex 布局样式）到外层容器
    const style = (this as any).getProperty?.('style') || (this as any)?._props?.style || {}
    if (style) {
      Object.assign(container.style, style)
      // 如果设置了 Flex 布局，确保容器紧贴内容
      if (style.display === 'flex') {
        container.style.width = 'fit-content'
        container.style.height = 'fit-content'
        container.style.minWidth = 'fit-content'
        container.style.maxWidth = 'fit-content'
        // 确保 justifyContent 默认为 flex-start（如果未设置）
        if (!container.style.justifyContent) {
          container.style.justifyContent = 'flex-start'
        }
      }
    }

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
      
      // 如果外层容器有 Flex 样式，需要特殊处理
      if (style && style.display === 'flex') {
        // Flex 布局时，子组件应该直接添加到外层容器，而不是内部的 .vue-container
        // 因为 .vue-container 有自己的样式（如 maxWidth、padding），会干扰 Flex 布局
        const vueContainer = container.querySelector('.vue-container') as HTMLElement
        if (vueContainer) {
          // 将 Flex 样式应用到外层容器，并清除 .vue-container 可能干扰的样式
          // .vue-container 保持原样，但子组件直接添加到外层容器
          this.contentContainer = container  // 直接使用外层容器作为子组件的容器
          
          // 清除 .vue-container 可能干扰 Flex 布局的样式
          // 完全移除 padding、margin 和 width 限制
          vueContainer.style.display = 'contents'  // 使用 contents 让 .vue-container 不参与布局
          // 或者完全清除样式
          vueContainer.style.maxWidth = 'none'
          vueContainer.style.width = 'auto'
          vueContainer.style.minWidth = 'auto'
          vueContainer.style.padding = '0'
          vueContainer.style.paddingLeft = '0'
          vueContainer.style.paddingRight = '0'
          vueContainer.style.paddingTop = '0'
          vueContainer.style.paddingBottom = '0'
          vueContainer.style.margin = '0'
          vueContainer.style.marginLeft = '0'
          vueContainer.style.marginRight = '0'
          vueContainer.style.marginTop = '0'
          vueContainer.style.marginBottom = '0'
          // 使用 CSS 优先级更高的方式清除（通过 setProperty）
          vueContainer.style.setProperty('padding', '0', 'important')
          vueContainer.style.setProperty('padding-left', '0', 'important')
          vueContainer.style.setProperty('padding-right', '0', 'important')
          vueContainer.style.setProperty('margin', '0', 'important')
          vueContainer.style.setProperty('margin-left', '0', 'important')
          vueContainer.style.setProperty('margin-right', '0', 'important')
          vueContainer.style.setProperty('width', 'auto', 'important')
          vueContainer.style.setProperty('min-width', 'auto', 'important')
        }
        
        // 应用布局边距（如果设置了）- 作为 padding，这样子控件相对于 Container 有边距
        const formatMargin = (value: number | string | undefined): string => {
          if (value === undefined || value === null || value === 0) return '0'
          if (typeof value === 'number') {
            return `${value}px`
          }
          return value as string
        }
        
        // 将边距应用到容器的 padding（子控件相对于 Container 的边距）
        container.style.paddingLeft = formatMargin(this.layoutLeftMargin)
        container.style.paddingTop = formatMargin(this.topMargin)
        container.style.paddingRight = formatMargin(this.rightMargin)
        container.style.paddingBottom = formatMargin(this.bottomMargin)
        
        // 应用布局间距（用于 Flex 的 gap）
        if (this.layoutSpacing !== undefined && this.layoutSpacing !== null) {
          const gapValue = this.layoutSpacing * 8
          container.style.gap = `${gapValue}px`
        }
        
        // 应用布局拉伸
        if (this.layoutStretch) {
          container.style.width = '100%'
        } else {
          container.style.width = 'fit-content'
          container.style.height = 'fit-content'
          container.style.minWidth = 'fit-content'
          container.style.maxWidth = 'fit-content'
        }
        
        // 确保没有 padding（边距由 margin 控制）
        container.style.padding = '0'
        container.style.paddingLeft = '0'
        container.style.paddingRight = '0'
        container.style.paddingTop = '0'
        container.style.paddingBottom = '0'
        
        // 使用 setTimeout 和多个 nextTick 确保清除（防止 Vue 组件重新应用样式）
        setTimeout(() => {
          const vueContainerRetry = container.querySelector('.vue-container') as HTMLElement
          if (vueContainerRetry) {
            // 使用 display: contents 让容器不参与布局，或者完全清除样式
            vueContainerRetry.style.display = 'contents'
            vueContainerRetry.style.padding = '0'
            vueContainerRetry.style.paddingLeft = '0'
            vueContainerRetry.style.paddingRight = '0'
            vueContainerRetry.style.paddingTop = '0'
            vueContainerRetry.style.paddingBottom = '0'
            vueContainerRetry.style.margin = '0'
            vueContainerRetry.style.marginLeft = '0'
            vueContainerRetry.style.marginRight = '0'
            vueContainerRetry.style.marginTop = '0'
            vueContainerRetry.style.marginBottom = '0'
            vueContainerRetry.style.width = 'auto'
            vueContainerRetry.style.minWidth = 'auto'
            vueContainerRetry.style.maxWidth = 'none'
            // 使用 setProperty 强制设置
            vueContainerRetry.style.setProperty('padding', '0', 'important')
            vueContainerRetry.style.setProperty('padding-left', '0', 'important')
            vueContainerRetry.style.setProperty('padding-right', '0', 'important')
            vueContainerRetry.style.setProperty('margin', '0', 'important')
            vueContainerRetry.style.setProperty('margin-left', '0', 'important')
            vueContainerRetry.style.setProperty('margin-right', '0', 'important')
            vueContainerRetry.style.setProperty('width', 'auto', 'important')
          }
          container.style.padding = '0'
          container.style.margin = '0'
          container.style.paddingLeft = '0'
          container.style.paddingRight = '0'
          container.style.paddingTop = '0'
          container.style.paddingBottom = '0'
          container.style.marginLeft = '0'
          container.style.marginRight = '0'
          container.style.marginTop = '0'
          container.style.marginBottom = '0'
        }, 100)
        
        // 再延迟一次，确保 Vue 的响应式更新不会覆盖我们的样式
        setTimeout(() => {
          const vueContainerFinal = container.querySelector('.vue-container') as HTMLElement
          if (vueContainerFinal) {
            vueContainerFinal.style.display = 'contents'
            vueContainerFinal.style.setProperty('padding', '0', 'important')
            vueContainerFinal.style.setProperty('padding-left', '0', 'important')
            vueContainerFinal.style.setProperty('margin-left', '0', 'important')
          }
        }, 200)
      }
      
      // 渲染所有子组件
      if (this.contentContainer) {
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
  
  /**
   * 重写 update 方法，确保样式变化时正确应用
   */
  protected override update(): void {
    // 如果组件已挂载且有样式，更新外层容器的样式
    if (this._mounted && this._element) {
      const style = (this as any).getProperty?.('style') || (this as any)?._props?.style || {}
      if (style) {
        // 直接应用到外层容器元素
        Object.assign(this._element.style, style)
        
        // 如果是 Flex 布局，确保子组件也在正确的容器中，并确保容器紧贴内容
        if (style.display === 'flex') {
          // 确保容器紧贴内容
          this._element.style.width = 'fit-content'
          this._element.style.height = 'fit-content'
          this._element.style.minWidth = 'fit-content'
          this._element.style.maxWidth = 'fit-content'
          // 确保 justifyContent 默认为 flex-start（如果未设置）
          if (!this._element.style.justifyContent) {
            this._element.style.justifyContent = 'flex-start'
          }
          
          // 确保 contentContainer 指向外层容器（Flex 布局时）
          const vueContainer = this._element.querySelector('.vue-container') as HTMLElement
          if (vueContainer) {
            // 使用 display: contents 让 .vue-container 不参与布局，完全绕过它的样式影响
            vueContainer.style.display = 'contents'
            // 同时也清除所有可能干扰的样式
            vueContainer.style.maxWidth = 'none'
            vueContainer.style.width = 'auto'
            vueContainer.style.minWidth = 'auto'
            vueContainer.style.padding = '0'
            vueContainer.style.paddingLeft = '0'
            vueContainer.style.paddingRight = '0'
            vueContainer.style.paddingTop = '0'
            vueContainer.style.paddingBottom = '0'
            vueContainer.style.margin = '0'
            vueContainer.style.marginLeft = '0'
            vueContainer.style.marginRight = '0'
            vueContainer.style.marginTop = '0'
            vueContainer.style.marginBottom = '0'
            // 使用 setProperty 强制设置
            vueContainer.style.setProperty('display', 'contents', 'important')
            vueContainer.style.setProperty('padding', '0', 'important')
            vueContainer.style.setProperty('padding-left', '0', 'important')
            vueContainer.style.setProperty('margin-left', '0', 'important')
            vueContainer.style.setProperty('width', 'auto', 'important')
          }
          // 应用布局边距（作为 padding，这样子控件相对于 Container 有边距）
          const formatMargin = (value: number | string | undefined): string => {
            if (value === undefined || value === null || value === 0) return '0'
            if (typeof value === 'number') {
              return `${value}px`
            }
            return value as string
          }
          
          // 将边距应用到容器的 padding（子控件相对于 Container 的边距）
          this._element.style.paddingLeft = formatMargin(this.layoutLeftMargin)
          this._element.style.paddingTop = formatMargin(this.topMargin)
          this._element.style.paddingRight = formatMargin(this.rightMargin)
          this._element.style.paddingBottom = formatMargin(this.bottomMargin)
          
          // 确保没有 margin
          this._element.style.margin = '0'
          this._element.style.marginLeft = '0'
          this._element.style.marginRight = '0'
          this._element.style.marginTop = '0'
          this._element.style.marginBottom = '0'
          
          // 使用 nextTick 再次确保清除内部容器样式，并保持外层容器的 padding（边距）
          nextTick(() => {
            const vueContainerInTick = this._element?.querySelector('.vue-container') as HTMLElement
            if (vueContainerInTick) {
              vueContainerInTick.style.padding = '0'
              vueContainerInTick.style.paddingLeft = '0'
              vueContainerInTick.style.paddingRight = '0'
              vueContainerInTick.style.paddingTop = '0'
              vueContainerInTick.style.paddingBottom = '0'
              vueContainerInTick.style.margin = '0'
              vueContainerInTick.style.marginLeft = '0'
              vueContainerInTick.style.marginRight = '0'
              vueContainerInTick.style.marginTop = '0'
              vueContainerInTick.style.marginBottom = '0'
            }
            // 确保外层容器保持 padding（边距），但清除 margin
            if (this._element) {
              const formatMargin = (value: number | string | undefined): string => {
                if (value === undefined || value === null || value === 0) return '0'
                if (typeof value === 'number') {
                  return `${value}px`
                }
                return value as string
              }
              // 保持 padding（子控件相对于 Container 的边距）
              this._element.style.paddingLeft = formatMargin(this.layoutLeftMargin)
              this._element.style.paddingTop = formatMargin(this.topMargin)
              this._element.style.paddingRight = formatMargin(this.rightMargin)
              this._element.style.paddingBottom = formatMargin(this.bottomMargin)
              // 清除 margin
              this._element.style.margin = '0'
              this._element.style.marginLeft = '0'
              this._element.style.marginRight = '0'
              this._element.style.marginTop = '0'
              this._element.style.marginBottom = '0'
            }
          })
          // 更新 contentContainer 指向外层容器
          this.contentContainer = this._element
        } else {
          // 非 Flex 布局时也应用边距（作为 padding）
          const formatMargin = (value: number | string | undefined): string => {
            if (value === undefined || value === null || value === 0) return '0'
            if (typeof value === 'number') {
              return `${value}px`
            }
            return value as string
          }
          
          // 将边距应用到容器的 padding（子控件相对于 Container 的边距）
          this._element.style.paddingLeft = formatMargin(this.layoutLeftMargin)
          this._element.style.paddingTop = formatMargin(this.topMargin)
          this._element.style.paddingRight = formatMargin(this.rightMargin)
          this._element.style.paddingBottom = formatMargin(this.bottomMargin)
          
          // 应用布局拉伸
          if (this.layoutStretch) {
            this._element.style.width = '100%'
          }
          
          // 确保没有 margin
          this._element.style.margin = '0'
          this._element.style.marginLeft = '0'
          this._element.style.marginRight = '0'
          this._element.style.marginTop = '0'
          this._element.style.marginBottom = '0'
        }
      }
    }
    
    super.update()
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiContainerCommand

