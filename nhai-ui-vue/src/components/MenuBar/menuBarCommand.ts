import { createApp, h, defineComponent } from 'vue'
import MenuBar from './MenuBar.vue'
import type { MenuItem } from './MenuBar.vue'

export class VueMenuBarCommand {
  private items: MenuItem[] = []
  private mode: 'horizontal' | 'vertical' = 'horizontal'
  private defaultActive?: string
  private collapse: boolean = false
  private uniqueOpened: boolean = false
  private router: boolean = false
  private collapseTransition: boolean = true
  private onSelect?: (index: string, indexPath: string[]) => void
  private _appInstance: any = null

  constructor(items: MenuItem[] = []) {
    this.items = items
  }

  setItems(items: MenuItem[]): void {
    this.items = items
  }

  getItems(): MenuItem[] {
    return this.items
  }

  addItem(item: MenuItem): void {
    this.items.push(item)
  }

  removeItem(id: string | number): void {
    this.items = this.items.filter(item => item.id !== id)
  }

  setMode(mode: 'horizontal' | 'vertical'): void {
    this.mode = mode
  }

  setDefaultActive(active: string): void {
    this.defaultActive = active
  }

  setCollapse(collapse: boolean): void {
    this.collapse = collapse
  }

  setUniqueOpened(unique: boolean): void {
    this.uniqueOpened = unique
  }

  setRouter(router: boolean): void {
    this.router = router
  }

  setCollapseTransition(transition: boolean): void {
    this.collapseTransition = transition
  }

  setOnSelect(callback: (index: string, indexPath: string[]) => void): void {
    this.onSelect = callback
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const MenuBarWrapper = defineComponent({
      setup() {
        return () => h(MenuBar, {
          items: self.items,
          mode: self.mode,
          defaultActive: self.defaultActive,
          collapse: self.collapse,
          uniqueOpened: self.uniqueOpened,
          router: self.router,
          collapseTransition: self.collapseTransition,
          onSelect: self.onSelect
        })
      }
    })

    const app = createApp(MenuBarWrapper)
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

export default VueMenuBarCommand
export type { MenuItem }

