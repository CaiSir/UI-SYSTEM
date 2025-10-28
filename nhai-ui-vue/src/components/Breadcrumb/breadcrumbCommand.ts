import { createApp, h, defineComponent } from 'vue'
import Breadcrumb from './Breadcrumb.vue'
import type { BreadcrumbItem } from './Breadcrumb.vue'
import { BaseCommand } from '../../lib/BaseCommand'

export class VueBreadcrumbCommand extends BaseCommand {
  private items: BreadcrumbItem[] = []
  private separator: string = '/'
  private onItemClick?: (item: BreadcrumbItem, index: number) => void

  constructor(items: BreadcrumbItem[] = []) {
    super()
    this.items = items
  }

  setItems(items: BreadcrumbItem[]): void {
    this.items = items
  }

  getItems(): BreadcrumbItem[] {
    return this.items
  }

  addItem(item: BreadcrumbItem): void {
    this.items.push(item)
  }

  removeItem(index: number): void {
    this.items.splice(index, 1)
  }

  setSeparator(separator: string): void {
    this.separator = separator
  }

  setOnItemClick(callback: (item: BreadcrumbItem, index: number) => void): void {
    this.onItemClick = callback
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const BreadcrumbWrapper = defineComponent({
      setup() {
        return () => h(Breadcrumb, {
          items: self.items,
          separator: self.separator,
          onItemClick: self.onItemClick
        })
      }
    })

    const app = createApp(BreadcrumbWrapper)
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

export default VueBreadcrumbCommand
export type { BreadcrumbItem }

