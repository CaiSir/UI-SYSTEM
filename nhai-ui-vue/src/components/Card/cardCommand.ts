import { createApp, h, defineComponent } from 'vue'
import Card from './Card.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface CardOptions extends IBaseCommandProps {
  header?: string
  shadow?: 'always' | 'hover' | 'never'
  bodyStyle?: Record<string, any>
  content?: string
  cardClass?: string
}

export interface CardEvents extends IBaseCommandEvents {}

export class NhaiCardCommand extends BaseCommand<CardOptions, CardEvents> {
  private header?: string
  private shadow: 'always' | 'hover' | 'never' = 'always'
  private bodyStyle?: Record<string, any>
  private content?: string
  private cardClass?: string

  constructor(headerOrOptions?: string | CardOptions, content?: string) {
    const options: CardOptions = typeof headerOrOptions === 'string' || !headerOrOptions
      ? { header: headerOrOptions, content }
      : headerOrOptions
    super(options)
    
    this.header = options.header
    this.shadow = options.shadow ?? 'always'
    this.bodyStyle = options.bodyStyle
    this.content = options.content
    this.cardClass = options.cardClass
    
    Object.assign(this._props, {
      header: this.header,
      shadow: this.shadow,
      bodyStyle: this.bodyStyle,
      content: this.content,
      cardClass: this.cardClass,
      ...options
    })
  }

  setHeader(header: string): this {
    this.header = header
    this.setProperty('header', header)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setShadow(shadow: 'always' | 'hover' | 'never'): this {
    this.shadow = shadow
    this.setProperty('shadow', shadow)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setBodyStyle(style: Record<string, any>): this {
    this.bodyStyle = style
    this.setProperty('bodyStyle', style)
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

  setClass(className: string): this {
    this.cardClass = className
    this.setProperty('cardClass', className)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  protected doRender(): HTMLElement {
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

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiCardCommand

