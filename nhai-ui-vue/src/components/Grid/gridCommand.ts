import { createApp, h, defineComponent } from 'vue'
import Grid from './Grid.vue'
import { BaseCommand } from '../../lib/BaseCommand'

export class NhaiGridCommand extends BaseCommand {
  private container: boolean = false
  private spacing: number = 2
  private direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'row'
  private justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' = 'flex-start'
  private alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' = 'stretch'
  private wrap: 'nowrap' | 'wrap' | 'wrap-reverse' = 'wrap'

  constructor(container: boolean = false) {
    super()
    this.container = container
  }

  setContainer(container: boolean): void {
    this.container = container
  }

  setSpacing(spacing: number): void {
    this.spacing = spacing
  }

  setDirection(direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'): void {
    this.direction = direction
  }

  setJustify(justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'): void {
    this.justify = justify
  }

  setAlignItems(alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'): void {
    this.alignItems = alignItems
  }

  setWrap(wrap: 'nowrap' | 'wrap' | 'wrap-reverse'): void {
    this.wrap = wrap
  }

  render(): HTMLElement {
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
    this._appInstance = app
    
    this._element = container
    this._mounted = true

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiGridCommand

