import { createApp, h, defineComponent } from 'vue'
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
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiContainerCommand

