import { createApp, h, defineComponent } from 'vue'
import Tabs from './Tabs.vue'
import type { TabItem } from './types'
import { BaseCommand } from '../../lib/BaseCommand'

/**
 * 标签页组件命令式 API
 * 支持多种样式、可编辑、可添加/删除标签等功能
 */
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

  /**
   * 创建标签页组件
   * @param items - 标签项数组，包含 name（名称）、label（标签）、content（内容）
   */
  constructor(items: TabItem[] = []) {
    super()
    this.items = items
    if (items.length > 0) {
      this.value = items[0].name
    }
  }

  /**
   * 设置当前激活的标签页
   * @param value - 标签页的名称（name）
   */
  setValue(value: string): void {
    this.value = value
  }

  /**
   * 获取当前激活的标签页
   * @returns 当前标签页名称
   */
  getValue(): string {
    return this.value
  }

  /**
   * 设置标签页列表
   * @param items - 标签项数组
   */
  setItems(items: TabItem[]): void {
    this.items = items
    if (items.length > 0 && !this.value) {
      this.value = items[0].name
    }
  }

  /**
   * 获取标签页列表
   * @returns 当前标签项数组
   */
  getItems(): TabItem[] {
    return this.items
  }

  /**
   * 添加标签页
   * @param item - 要添加的标签项
   */
  addItem(item: TabItem): void {
    this.items.push(item)
  }

  /**
   * 移除标签页
   * @param name - 要移除的标签页名称
   */
  removeItem(name: string): void {
    this.items = this.items.filter(item => item.name !== name)
  }

  /**
   * 设置标签页类型
   * @param type - 类型：card（卡片）、border-card（带边框的卡片）、''（普通）
   */
  setType(type: 'card' | 'border-card' | ''): void {
    this.type = type
  }

  /**
   * 设置标签页位置
   * @param position - 位置：top（顶部）、right（右侧）、bottom（底部）、left（左侧）
   */
  setTabPosition(position: 'top' | 'right' | 'bottom' | 'left'): void {
    this.tabPosition = position
  }

  /**
   * 设置标签是否拉伸
   * @param stretch - true 为拉伸填充，false 为自适应宽度
   */
  setStretch(stretch: boolean): void {
    this.stretch = stretch
  }

  /**
   * 设置是否可添加标签
   * @param addable - true 显示添加按钮，false 隐藏
   */
  setAddable(addable: boolean): void {
    this.addable = addable
  }

  /**
   * 设置是否可编辑标签
   * @param editable - true 可编辑，false 不可编辑
   */
  setEditable(editable: boolean): void {
    this.editable = editable
  }

  /**
   * 设置标签点击事件
   * @param callback - 点击时的回调函数，参数为点击的标签项
   */
  setOnTabClick(callback: (tab: TabItem) => void): void {
    this.onTabClick = callback
  }

  /**
   * 设置标签移除事件
   * @param callback - 移除时的回调函数，参数为标签名称
   */
  setOnTabRemove(callback: (name: string) => void): void {
    this.onTabRemove = callback
  }

  /**
   * 设置标签添加事件
   * @param callback - 添加时的回调函数，参数为标签名称
   */
  setOnTabAdd(callback: (name: string) => void): void {
    this.onTabAdd = callback
  }

  /**
   * 设置编辑事件
   * @param callback - 编辑时的回调函数，参数为标签名称和操作类型（add/remove）
   */
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

