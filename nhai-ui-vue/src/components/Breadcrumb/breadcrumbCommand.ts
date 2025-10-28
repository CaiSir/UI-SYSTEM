import { createApp, h, defineComponent } from 'vue'
import Breadcrumb from './Breadcrumb.vue'
import type { BreadcrumbItem } from './types'
import { BaseCommand } from '../../lib/BaseCommand'

/**
 * 面包屑组件命令式 API
 * 用于显示当前页面路径，提供导航功能
 */
export class VueBreadcrumbCommand extends BaseCommand {
  private items: BreadcrumbItem[] = []
  private separator: string = '/'
  private onItemClick?: (item: BreadcrumbItem, index: number) => void

  /**
   * 创建面包屑组件
   * @param items - 面包屑项数组，包含 label（标签）、href（链接）、disabled（是否禁用）
   */
  constructor(items: BreadcrumbItem[] = []) {
    super()
    this.items = items
  }

  /**
   * 设置面包屑项
   * @param items - 面包屑项数组
   */
  setItems(items: BreadcrumbItem[]): void {
    this.items = items
  }

  /**
   * 获取面包屑项
   * @returns 当前面包屑项数组
   */
  getItems(): BreadcrumbItem[] {
    return this.items
  }

  /**
   * 添加面包屑项
   * @param item - 要添加的面包屑项
   */
  addItem(item: BreadcrumbItem): void {
    this.items.push(item)
  }

  /**
   * 移除面包屑项
   * @param index - 要移除的项索引
   */
  removeItem(index: number): void {
    this.items.splice(index, 1)
  }

  /**
   * 设置分隔符
   * @param separator - 分隔符字符串，默认为 '/'
   */
  setSeparator(separator: string): void {
    this.separator = separator
  }

  /**
   * 设置面包屑项点击事件
   * @param callback - 点击时的回调函数，参数为点击的项和索引
   */
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

