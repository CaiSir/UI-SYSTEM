import { createApp, h, defineComponent } from 'vue'
import ElementPlus from 'element-plus'
import MenuBar from './MenuBar.vue'
import type { MenuItem } from './types'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface MenuBarOptions extends IBaseCommandProps {
  items?: MenuItem[]
  mode?: 'horizontal' | 'vertical'
  defaultActive?: string
  collapse?: boolean
  uniqueOpened?: boolean
  router?: boolean
  collapseTransition?: boolean
  onSelect?: (index: string, indexPath: string[]) => void
}

export interface MenuBarEvents extends IBaseCommandEvents {
  select: (index: string, indexPath: string[]) => void
}

export class NhaiMenuBarCommand extends BaseCommand<MenuBarOptions, MenuBarEvents> {
  private items: MenuItem[] = []
  private mode: 'horizontal' | 'vertical' = 'horizontal'
  private defaultActive?: string
  private collapse: boolean = false
  private uniqueOpened: boolean = false
  private router: boolean = false
  private collapseTransition: boolean = true
  private onSelect?: (index: string, indexPath: string[]) => void

  constructor(itemsOrOptions: MenuItem[] | MenuBarOptions = []) {
    const options: MenuBarOptions = Array.isArray(itemsOrOptions)
      ? { items: itemsOrOptions }
      : itemsOrOptions
    super(options)
    
    this.items = options.items ?? []
    this.mode = options.mode ?? 'horizontal'
    this.defaultActive = options.defaultActive
    this.collapse = options.collapse ?? false
    this.uniqueOpened = options.uniqueOpened ?? false
    this.router = options.router ?? false
    this.collapseTransition = options.collapseTransition ?? true
    this.onSelect = options.onSelect
    
    Object.assign(this._props, {
      items: this.items,
      mode: this.mode,
      defaultActive: this.defaultActive,
      collapse: this.collapse,
      uniqueOpened: this.uniqueOpened,
      router: this.router,
      collapseTransition: this.collapseTransition,
      ...options
    })
  }

  setItems(items: MenuItem[]): this {
    this.items = items
    this.setProperty('items', items)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getItems(): MenuItem[] {
    return this.getProperty('items') ?? this.items
  }

  addItem(item: MenuItem): this {
    this.items.push(item)
    this.setProperty('items', [...this.items])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  removeItem(id: string | number): this {
    this.items = this.items.filter(item => item.id !== id)
    this.setProperty('items', [...this.items])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setMode(mode: 'horizontal' | 'vertical'): this {
    this.mode = mode
    this.setProperty('mode', mode)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setDefaultActive(active: string): this {
    this.defaultActive = active
    this.setProperty('defaultActive', active)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setCollapse(collapse: boolean): this {
    this.collapse = collapse
    this.setProperty('collapse', collapse)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setUniqueOpened(unique: boolean): this {
    this.uniqueOpened = unique
    this.setProperty('uniqueOpened', unique)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setRouter(router: boolean): this {
    this.router = router
    this.setProperty('router', router)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setCollapseTransition(transition: boolean): this {
    this.collapseTransition = transition
    this.setProperty('collapseTransition', transition)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setOnSelect(callback: (index: string, indexPath: string[]) => void): this {
    this.onSelect = callback
    this.setProperty('onSelect', callback)
    return this
  }

  protected doRender(): HTMLElement {
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
          onSelect: (index: string, indexPath: string[]) => {
            if (self.onSelect) {
              self.onSelect(index, indexPath)
            }
            self.emit('select', index, indexPath)
          }
        })
      }
    })

    const app = createApp(MenuBarWrapper)
    app.use(ElementPlus)
    app.mount(container)
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiMenuBarCommand
export type { MenuItem }

