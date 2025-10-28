import { createApp, h, defineComponent } from 'vue'
import Container from './Container.vue'
import { BaseCommand } from '../../lib/BaseCommand'

export class NhaiContainerCommand extends BaseCommand {
  private maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false = 'lg'
  private fixed: boolean = false
  private disableGutters: boolean = false
  private content?: string

  constructor(content?: string) {
    super()
    this.content = content
  }

  setMaxWidth(maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false): void {
    this.maxWidth = maxWidth
  }

  setFixed(fixed: boolean): void {
    this.fixed = fixed
  }

  setDisableGutters(disableGutters: boolean): void {
    this.disableGutters = disableGutters
  }

  setContent(content: string): void {
    this.content = content
  }

  render(): HTMLElement {
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
    
    this._element = container
    this._mounted = true

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiContainerCommand

