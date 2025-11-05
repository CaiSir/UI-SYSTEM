import { createApp, h, defineComponent } from 'vue'
import Tabs from './Tabs.vue'
import type { TabItem } from './types'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand'

// 类型定义
export interface TabsOptions extends IBaseCommandProps {
  value?: string
  items?: TabItem[]
  type?: 'card' | 'border-card' | ''
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  stretch?: boolean
  addable?: boolean
  editable?: boolean
  onTabClick?: (tab: TabItem) => void
  onTabRemove?: (name: string) => void
  onTabAdd?: (name: string) => void
  onEdit?: (name: string, action: 'add' | 'remove') => void
}

export interface TabsEvents extends IBaseCommandEvents {
  tabClick: (tab: TabItem) => void
  tabRemove: (name: string) => void
  tabAdd: (name: string) => void
  edit: (name: string, action: 'add' | 'remove') => void
}

/**
 * 标签页组件命令式 API
 * 支持多种样式、可编辑、可添加/删除标签等功能
 */
export class NhaiTabsCommand extends BaseCommand<TabsOptions, TabsEvents> {
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

  /**
   * 创建标签页组件
   * @param itemsOrOptions - 标签项数组或选项对象
   */
  constructor(itemsOrOptions: TabItem[] | TabsOptions = []) {
    const options: TabsOptions = Array.isArray(itemsOrOptions)
      ? { items: itemsOrOptions }
      : itemsOrOptions
    super(options)
    
    this.items = options.items ?? []
    this.value = options.value ?? (this.items.length > 0 ? this.items[0].name : '')
    this.type = options.type ?? ''
    this.tabPosition = options.tabPosition ?? 'top'
    this.stretch = options.stretch ?? false
    this.addable = options.addable ?? false
    this.editable = options.editable ?? false
    this.onTabClick = options.onTabClick
    this.onTabRemove = options.onTabRemove
    this.onTabAdd = options.onTabAdd
    this.onEdit = options.onEdit
    
    Object.assign(this._props, {
      value: this.value,
      items: this.items,
      type: this.type,
      tabPosition: this.tabPosition,
      stretch: this.stretch,
      addable: this.addable,
      editable: this.editable,
      ...options
    })
  }

  /**
   * 设置当前激活的标签页
   * @param value - 标签页的名称（name）
   */
  setValue(value: string): this {
    this.value = value
    this.setProperty('value', value)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 获取当前激活的标签页
   * @returns 当前标签页名称
   */
  getValue(): string {
    return this.getProperty('value') ?? this.value
  }

  /**
   * 设置标签页列表
   * @param items - 标签项数组
   */
  setItems(items: TabItem[]): this {
    this.items = items
    if (items.length > 0 && !this.value) {
      this.value = items[0].name
    }
    this.setProperty('items', items)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 获取标签页列表
   * @returns 当前标签项数组
   */
  getItems(): TabItem[] {
    return this.getProperty('items') ?? this.items
  }

  /**
   * 添加标签页
   * @param item - 要添加的标签项
   */
  addItem(item: TabItem): this {
    this.items.push(item)
    this.setProperty('items', [...this.items])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 移除标签页
   * @param name - 要移除的标签页名称
   */
  removeItem(name: string): this {
    this.items = this.items.filter(item => item.name !== name)
    this.setProperty('items', [...this.items])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置标签页类型
   * @param type - 类型：card（卡片）、border-card（带边框的卡片）、''（普通）
   */
  setType(type: 'card' | 'border-card' | ''): this {
    this.type = type
    this.setProperty('type', type)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置标签页位置
   * @param position - 位置：top（顶部）、right（右侧）、bottom（底部）、left（左侧）
   */
  setTabPosition(position: 'top' | 'right' | 'bottom' | 'left'): this {
    this.tabPosition = position
    this.setProperty('tabPosition', position)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置标签是否拉伸
   * @param stretch - true 为拉伸填充，false 为自适应宽度
   */
  setStretch(stretch: boolean): this {
    this.stretch = stretch
    this.setProperty('stretch', stretch)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否可添加标签
   * @param addable - true 显示添加按钮，false 隐藏
   */
  setAddable(addable: boolean): this {
    this.addable = addable
    this.setProperty('addable', addable)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否可编辑标签
   * @param editable - true 可编辑，false 不可编辑
   */
  setEditable(editable: boolean): this {
    this.editable = editable
    this.setProperty('editable', editable)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置标签点击事件
   * @param callback - 点击时的回调函数，参数为点击的标签项
   */
  setOnTabClick(callback: (tab: TabItem) => void): this {
    this.onTabClick = callback
    this.setProperty('onTabClick', callback)
    return this
  }

  /**
   * 设置标签移除事件
   * @param callback - 移除时的回调函数，参数为标签名称
   */
  setOnTabRemove(callback: (name: string) => void): this {
    this.onTabRemove = callback
    this.setProperty('onTabRemove', callback)
    return this
  }

  /**
   * 设置标签添加事件
   * @param callback - 添加时的回调函数，参数为标签名称
   */
  setOnTabAdd(callback: (name: string) => void): this {
    this.onTabAdd = callback
    this.setProperty('onTabAdd', callback)
    return this
  }

  /**
   * 设置编辑事件
   * @param callback - 编辑时的回调函数，参数为标签名称和操作类型（add/remove）
   */
  setOnEdit(callback: (name: string, action: 'add' | 'remove') => void): this {
    this.onEdit = callback
    this.setProperty('onEdit', callback)
    return this
  }

  protected doRender(): HTMLElement {
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
          onTabClick: (tab: TabItem) => {
            if (self.onTabClick) {
              self.onTabClick(tab)
            }
            self.emit('tabClick', tab)
          },
          onTabRemove: (name: string) => {
            if (self.onTabRemove) {
              self.onTabRemove(name)
            }
            self.emit('tabRemove', name)
          },
          onTabAdd: (name: string) => {
            if (self.onTabAdd) {
              self.onTabAdd(name)
            }
            self.emit('tabAdd', name)
          },
          onEdit: (name: string, action: 'add' | 'remove') => {
            if (self.onEdit) {
              self.onEdit(name, action)
            }
            self.emit('edit', name, action)
          }
        })
      }
    })

    const app = createApp(TabsWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiTabsCommand
export type { TabItem }

