import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface GridItem {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  component: NHAIObject
}

/**
 * Material UI Grid 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialGrid extends NHAIWidget {
  private _container: boolean = false
  private _spacing: number = 2
  private _direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'row'
  private _justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' = 'flex-start'
  private _alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' = 'stretch'
  private _wrap: 'nowrap' | 'wrap' | 'wrap-reverse' = 'wrap'
  private _items: GridItem[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置容器模式
  setContainer(container: boolean): void {
    this._container = container
  }

  container(): boolean {
    return this._container
  }

  // 设置间距
  setSpacing(spacing: number): void {
    this._spacing = spacing
  }

  spacing(): number {
    return this._spacing
  }

  // 设置方向
  setDirection(direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'): void {
    this._direction = direction
  }

  direction(): string {
    return this._direction
  }

  // 设置主轴对齐
  setJustify(justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'): void {
    this._justify = justify
  }

  justify(): string {
    return this._justify
  }

  // 设置交叉轴对齐
  setAlignItems(alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'): void {
    this._alignItems = alignItems
  }

  alignItems(): string {
    return this._alignItems
  }

  // 设置换行
  setWrap(wrap: 'nowrap' | 'wrap' | 'wrap-reverse'): void {
    this._wrap = wrap
  }

  wrap(): string {
    return this._wrap
  }

  // 设置网格项
  setItems(items: GridItem[]): void {
    this._items = items
  }

  items(): GridItem[] {
    return this._items
  }

  // 添加网格项
  addItem(item: GridItem): void {
    this._items.push(item)
    if (item.component) {
      super.addChild(item.component)
    }
  }

  // 移除网格项
  removeItem(index: number): void {
    if (index >= 0 && index < this._items.length) {
      const item = this._items[index]
      if (item.component) {
        super.removeChild(item.component)
      }
      this._items.splice(index, 1)
    }
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const gridProps: any = {
      className: `mui-grid ${this._container ? 'mui-grid--container' : ''}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        flexDirection: this._direction,
        justifyContent: this._justify,
        alignItems: this._alignItems,
        flexWrap: this._wrap,
        gap: `${this._spacing * 8}px`,
        width: '100%'
      }
    }

    if (this._id) gridProps.id = this._id
    if (this._className) gridProps.className += ` ${this._className}`

    const children: any[] = []

    // 渲染网格项
    this._items.forEach((item) => {
      const itemProps: any = {
        className: 'mui-grid-item',
        style: {
          ...this.getItemStyles(item),
          flex: this.getItemFlex(item)
        }
      }

      const itemElement = item.component.render(_context)
      itemProps.children = [itemElement]
      children.push(adapter.createElement('div', itemProps))
    })

    return adapter.createElement('div', gridProps, children)
  }

  private getItemStyles(item: GridItem): Record<string, any> {
    const styles: Record<string, any> = {}

    // 响应式宽度
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']
    const breakpointWidths = [12, 12, 12, 12, 12] // 默认全宽

    breakpoints.forEach((breakpoint, index) => {
      const value = item[breakpoint as keyof GridItem] as number | undefined
      if (value !== undefined) {
        breakpointWidths[index] = value
      }
    })

    // 使用最小的断点作为默认宽度
    const defaultWidth = Math.min(...breakpointWidths)
    const percentage = (defaultWidth / 12) * 100

    styles.width = `${percentage}%`
    styles.flexBasis = `${percentage}%`

    return styles
  }

  private getItemFlex(item: GridItem): string {
    // 如果所有断点都设置了相同的值，使用 flex
    const values = [item.xs, item.sm, item.md, item.lg, item.xl].filter(v => v !== undefined)
    if (values.length > 0 && values.every(v => v === values[0])) {
      return `0 0 ${(values[0]! / 12) * 100}%`
    }

    return '1 1 auto'
  }
}
