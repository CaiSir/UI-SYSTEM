import { createApp, h, defineComponent } from 'vue'
import Breadcrumb from './Breadcrumb.vue'
import type { BreadcrumbItem } from './types'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand'

// 类型定义
export interface BreadcrumbOptions extends IBaseCommandProps {
  items?: BreadcrumbItem[]
  separator?: string
  onItemClick?: (item: BreadcrumbItem, index: number) => void
}

export interface BreadcrumbEvents extends IBaseCommandEvents {
  itemClick: (item: BreadcrumbItem, index: number) => void
}

/**
 * 面包屑组件命令式 API
 * 用于显示当前页面路径，提供导航功能
 */
export class NhaiBreadcrumbCommand extends BaseCommand<BreadcrumbOptions, BreadcrumbEvents> {
  private items: BreadcrumbItem[] = []
  private separator: string = '/'
  private onItemClick?: (item: BreadcrumbItem, index: number) => void

  /**
   * 创建面包屑组件
   * @param itemsOrOptions - 面包屑项数组或选项对象
   */
  constructor(itemsOrOptions: BreadcrumbItem[] | BreadcrumbOptions = []) {
    const options: BreadcrumbOptions = Array.isArray(itemsOrOptions)
      ? { items: itemsOrOptions }
      : itemsOrOptions
    super(options)
    
    this.items = options.items ?? []
    this.separator = options.separator ?? '/'
    this.onItemClick = options.onItemClick
    
    Object.assign(this._props, {
      items: this.items,
      separator: this.separator,
      ...options
    })
  }

  /**
   * 设置面包屑项
   * @param items - 面包屑项数组
   */
  setItems(items: BreadcrumbItem[]): this {
    this.items = items
    this.setProperty('items', items)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 获取面包屑项
   * @returns 当前面包屑项数组
   */
  getItems(): BreadcrumbItem[] {
    return this.getProperty('items') ?? this.items
  }

  /**
   * 添加面包屑项
   * @param item - 要添加的面包屑项
   */
  addItem(item: BreadcrumbItem): this {
    this.items.push(item)
    this.setProperty('items', [...this.items])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 移除面包屑项
   * @param index - 要移除的项索引
   */
  removeItem(index: number): this {
    this.items.splice(index, 1)
    this.setProperty('items', [...this.items])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置分隔符
   * @param separator - 分隔符字符串，默认为 '/'
   */
  setSeparator(separator: string): this {
    this.separator = separator
    this.setProperty('separator', separator)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置面包屑项点击事件
   * @param callback - 点击时的回调函数，参数为点击的项和索引
   */
  setOnItemClick(callback: (item: BreadcrumbItem, index: number) => void): this {
    this.onItemClick = callback
    this.setProperty('onItemClick', callback)
    return this
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const BreadcrumbWrapper = defineComponent({
      setup() {
        return () => h(Breadcrumb, {
          items: self.items,
          separator: self.separator,
          onItemClick: (item: BreadcrumbItem, index: number) => {
            if (self.onItemClick) {
              self.onItemClick(item, index)
            }
            self.emit('itemClick', item, index)
          }
        })
      }
    })

    const app = createApp(BreadcrumbWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiBreadcrumbCommand
export type { BreadcrumbItem }

