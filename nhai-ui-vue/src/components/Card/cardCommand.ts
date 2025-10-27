import { createApp, h, defineComponent } from 'vue'
import Card from './Card.vue'

export class VueCardCommand {
  private header?: string
  private shadow: 'always' | 'hover' | 'never' = 'always'
  private bodyStyle?: Record<string, any>
  private content?: string
  private cardClass?: string
  private _appInstance: any = null

  constructor(header?: string, content?: string) {
    this.header = header
    this.content = content
  }

  setHeader(header: string): void {
    this.header = header
  }

  setShadow(shadow: 'always' | 'hover' | 'never'): void {
    this.shadow = shadow
  }

  setBodyStyle(style: Record<string, any>): void {
    this.bodyStyle = style
  }

  setContent(content: string): void {
    this.content = content
  }

  setClass(className: string): void {
    this.cardClass = className
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const CardWrapper = defineComponent({
      setup() {
        return () => h(Card, {
          header: self.header,
          shadow: self.shadow,
          bodyStyle: self.bodyStyle,
          content: self.content,
          cardClass: self.cardClass
        })
      }
    })

    const app = createApp(CardWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  unmount(): void {
    if (this._appInstance) {
      this._appInstance.unmount()
      this._appInstance = null
    }
  }
}

export default VueCardCommand

