import { createApp, h, defineComponent } from 'vue'
import Tabs from './Tabs.vue'
import type { TabItem } from './Tabs.vue'
import { BaseCommand } from '../../lib/BaseCommand'

export class VueTabsCommand extends BaseCommand {
  private value: string = ''
  private items: TabItem[] = []
  private type: 'card' | 'border-card' | '' = ''
  private tabPosition: 'top' | 'right' | 'bottom' | 'left' = 'top'
  private stretch: boolean = false
  private addable: boolean = false
  private editable: boolean = false
  private onTabClick?: (tab: TabItem) => void
  private onTabRemove?: (name: string) => void
  private onTabAdd?: (name: string) => void
  private onEdit?: (name: string, action: 'add' | 'remove') => void

  constructor(items: TabItem[] = []) {
    super()
    this.items = items
    if (items.length > 0) {
      this.value = items[0].name
    }
  }

  setValue(value: string): void {
    this.value = value
  }

  getValue(): string {
    return this.value
  }

  setItems(items: TabItem[]): void {
    this.items = items
    if (items.length > 0 && !this.value) {
      this.value = items[0].name
    }
  }

  getItems(): TabItem[] {
    return this.items
  }

  addItem(item: TabItem): void {
    this.items.push(item)
  }

  removeItem(name: string): void {
    this.items = this.items.filter(item => item.name !== name)
  }

  setType(type: 'card' | 'border-card' | ''): void {
    this.type = type
  }

  setTabPosition(position: 'top' | 'right' | 'bottom' | 'left'): void {
    this.tabPosition = position
  }

  setStretch(stretch: boolean): void {
    this.stretch = stretch
  }

  setAddable(addable: boolean): void {
    this.addable = addable
  }

  setEditable(editable: boolean): void {
    this.editable = editable
  }

  setOnTabClick(callback: (tab: TabItem) => void): void {
    this.onTabClick = callback
  }

  setOnTabRemove(callback: (name: string) => void): void {
    this.onTabRemove = callback
  }

  setOnTabAdd(callback: (name: string) => void): void {
    this.onTabAdd = callback
  }

  setOnEdit(callback: (name: string, action: 'add' | 'remove') => void): void {
    this.onEdit = callback
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const TabsWrapper = defineComponent({
      setup() {
        return () => h(Tabs, {
          modelValue: self.value,
          items: self.items,
          type: self.type,
          tabPosition: self.tabPosition,
          stretch: self.stretch,
          addable: self.addable,
          editable: self.editable,
          onTabClick: self.onTabClick,
          onTabRemove: self.onTabRemove,
          onTabAdd: self.onTabAdd,
          onEdit: self.onEdit
        })
      }
    })

    const app = createApp(TabsWrapper)
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

export default VueTabsCommand
export type { TabItem }

