import { createApp, h, defineComponent, nextTick } from 'vue'
import Grid from './Grid.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface GridOptions extends IBaseCommandProps {
  container?: boolean
  // Grid 容器属性
  columns?: number | string
  rows?: number | string
  templateAreas?: string
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
  justifyItems?: 'start' | 'end' | 'center' | 'stretch'
  alignItems?: 'start' | 'end' | 'center' | 'stretch'
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  // 通用属性
  spacing?: number | string
  gap?: string
  // Grid 项目属性
  column?: string
  row?: string
  area?: string
  justifySelf?: 'start' | 'end' | 'center' | 'stretch'
  alignSelf?: 'start' | 'end' | 'center' | 'stretch'
}

export interface GridEvents extends IBaseCommandEvents {}

export class NhaiGridCommand extends BaseCommand<GridOptions, GridEvents> {
  private _updating = false // 防止重复更新标志
  private container: boolean = true
  private columns: number | string = 12
  private rows?: number | string
  private templateAreas?: string
  private autoFlow: 'row' | 'column' | 'row dense' | 'column dense' = 'row'
  private justifyItems: 'start' | 'end' | 'center' | 'stretch' = 'stretch'
  private alignItems: 'start' | 'end' | 'center' | 'stretch' = 'stretch'
  private justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  private alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  private spacing: number | string = 2
  private gap?: string
  private column?: string
  private row?: string
  private area?: string
  private justifySelf?: 'start' | 'end' | 'center' | 'stretch'
  private alignSelf?: 'start' | 'end' | 'center' | 'stretch'

  constructor(options: GridOptions = {}) {
    super(options)
    
    this.container = options.container ?? true
    this.columns = options.columns ?? 12
    this.rows = options.rows
    this.templateAreas = options.templateAreas
    this.autoFlow = options.autoFlow ?? 'row'
    this.justifyItems = options.justifyItems ?? 'stretch'
    this.alignItems = options.alignItems ?? 'stretch'
    this.justifyContent = options.justifyContent
    this.alignContent = options.alignContent
    this.spacing = options.spacing ?? 2
    this.gap = options.gap
    this.column = options.column
    this.row = options.row
    this.area = options.area
    this.justifySelf = options.justifySelf
    this.alignSelf = options.alignSelf
    
    Object.assign(this._props, {
      container: this.container,
      columns: this.columns,
      rows: this.rows,
      templateAreas: this.templateAreas,
      autoFlow: this.autoFlow,
      justifyItems: this.justifyItems,
      alignItems: this.alignItems,
      justifyContent: this.justifyContent,
      alignContent: this.alignContent,
      spacing: this.spacing,
      gap: this.gap,
      column: this.column,
      row: this.row,
      area: this.area,
      justifySelf: this.justifySelf,
      alignSelf: this.alignSelf,
      ...options
    })
    
    // 不再需要同步股 reactiveProps
  }

  // ==================== Grid 容器方法 ====================
  setContainer(container: boolean): this {
    this.container = container
    this.setProperty('container', container)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setColumns(columns: number | string): this {
    this.columns = columns
    this.setProperty('columns', columns)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setRows(rows: number | string): this {
    this.rows = rows
    this.setProperty('rows', rows)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setTemplateAreas(areas: string): this {
    this.templateAreas = areas
    this.setProperty('templateAreas', areas)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAutoFlow(autoFlow: 'row' | 'column' | 'row dense' | 'column dense'): this {
    console.log('[Grid.setAutoFlow] ========== 开始设置 autoFlow ==========')
    console.log('[Grid.setAutoFlow] 新值:', autoFlow, '当前值:', this.autoFlow)
    console.log('[Grid.setAutoFlow] columns:', this.columns, 'rows:', this.rows)
    this.autoFlow = autoFlow
    this.setProperty('autoFlow', autoFlow)
    console.log('[Grid.setAutoFlow] 设置完成，_mounted:', this._mounted, 'autoFlow:', this.autoFlow)
    
    // 如果已经挂载，立即触发更新以确保样式正确应用
    if (this._mounted) {
      console.log('[Grid.setAutoFlow] 触发 update 以确保样式正确应用')
      this.scheduleUpdate()
      
      // 在下一个 tick 检查样式
      nextTick(() => {
        if (this.contentContainer) {
          const gridElement = (this.contentContainer.classList?.contains('vue-grid') 
            ? this.contentContainer 
            : this.contentContainer.querySelector('.vue-grid')) as HTMLElement
          if (gridElement) {
            const computedStyle = window.getComputedStyle(gridElement)
            console.log('[Grid.setAutoFlow] 检查应用后的样式:', {
              gridAutoFlow: {
                inline: gridElement.style.gridAutoFlow,
                computed: computedStyle.gridAutoFlow,
                expected: this.autoFlow
              },
              gridTemplateColumns: {
                inline: gridElement.style.gridTemplateColumns,
                computed: computedStyle.gridTemplateColumns,
                expected: typeof this.columns === 'number' ? `repeat(${this.columns}, 1fr)` : this.columns
              },
              gridTemplateRows: {
                inline: gridElement.style.gridTemplateRows,
                computed: computedStyle.gridTemplateRows
              },
              gridAutoRows: {
                inline: gridElement.style.gridAutoRows,
                computed: computedStyle.gridAutoRows
              },
              display: {
                inline: gridElement.style.display,
                computed: computedStyle.display
              },
              allStyleText: gridElement.style.cssText
            })
          }
        }
      })
    }
    console.log('[Grid.setAutoFlow] ========== 设置结束 ==========')
    return this
  }

  setJustifyItems(justifyItems: 'start' | 'end' | 'center' | 'stretch'): this {
    this.justifyItems = justifyItems
    this.setProperty('justifyItems', justifyItems)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAlignItems(alignItems: 'start' | 'end' | 'center' | 'stretch'): this {
    this.alignItems = alignItems
    this.setProperty('alignItems', alignItems)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setJustifyContent(justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'): this {
    this.justifyContent = justifyContent
    this.setProperty('justifyContent', justifyContent)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAlignContent(alignContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'): this {
    this.alignContent = alignContent
    this.setProperty('alignContent', alignContent)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== 间距方法 ====================
  setSpacing(spacing: number | string): this {
    this.spacing = spacing
    this.setProperty('spacing', spacing)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setGap(gap: string): this {
    this.gap = gap
    this.setProperty('gap', gap)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== Grid 项目方法 ====================
  setGridColumn(column: string): this {
    this.column = column
    this.setProperty('column', column)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setGridRow(row: string): this {
    this.row = row
    this.setProperty('row', row)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setGridArea(area: string): this {
    this.area = area
    this.setProperty('area', area)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setJustifySelf(justifySelf: 'start' | 'end' | 'center' | 'stretch'): this {
    this.justifySelf = justifySelf
    this.setProperty('justifySelf', justifySelf)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAlignSelf(alignSelf: 'start' | 'end' | 'center' | 'stretch'): this {
    this.alignSelf = alignSelf
    this.setProperty('alignSelf', alignSelf)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== 快捷方法 ====================
  setColSpan(span: number): this {
    return this.setGridColumn(`span ${span}`)
  }

  setRowSpan(span: number): this {
    return this.setGridRow(`span ${span}`)
  }

  setPosition(column: string, row: string): this {
    return this.setGridColumn(column).setGridRow(row)
  }

  // ==================== 子组件管理 ====================
  protected childElements: Map<BaseCommand<any, any>, HTMLElement> = new Map()
  protected contentContainer?: HTMLElement

  override addChild<C extends BaseCommand<any, any>>(child: C): this {
    if (this.childElements.has(child)) {
      if (!this._children.includes(child)) {
        this._children.push(child)
        ;(child as any)._parent = this
      }
      return this
    }
    
    super.addChild(child)
    
    if (this._mounted && this.contentContainer) {
      const hasManualChildren = Array.from(this.contentContainer.children).some(
        c => c.classList && 
        (c.classList.contains('grid-child-component') || 
         c.classList.contains('layout-child-component'))
      )
      
      if (this.childElements.has(child)) {
        return this
      }
      
      if (!hasManualChildren) {
        this.renderChild(child)
      }
    }
    return this
  }

  override removeChild<C extends BaseCommand<any, any>>(child: C): this {
    super.removeChild(child)
    const childElement = this.childElements.get(child)
    if (childElement && childElement.parentNode) {
      childElement.parentNode.removeChild(childElement)
    }
    this.childElements.delete(child)
    return this
  }

  private renderChild(child: BaseCommand<any, any>): void {
    if (!this.contentContainer) return
    
    try {
      if (this.childElements.has(child)) {
        const existingElement = this.childElements.get(child)
        if (existingElement) {
          if (existingElement.classList && 
              (existingElement.classList.contains('grid-child-component') || 
               existingElement.classList.contains('layout-child-component'))) {
            return
          }
          if (existingElement.parentNode && !this.contentContainer.contains(existingElement)) {
            return
          }
          if (existingElement.parentNode && this.contentContainer.contains(existingElement)) {
            existingElement.parentNode.removeChild(existingElement)
          }
        } else {
          return
        }
      }
      
      const childElementFromInstance = child.getElement()
      if (childElementFromInstance && childElementFromInstance.parentNode) {
        let parent: ParentNode | null = childElementFromInstance.parentNode
        while (parent) {
          if (parent === this.contentContainer || 
              (parent instanceof HTMLElement && parent.classList.contains('vue-grid'))) {
            let wrapperParent: ParentNode | null = childElementFromInstance.parentNode
            while (wrapperParent && wrapperParent !== parent) {
              if (wrapperParent instanceof HTMLElement && 
                  (wrapperParent.classList.contains('grid-child-component') || 
                   wrapperParent.classList.contains('layout-child-component'))) {
                this.childElements.set(child, wrapperParent)
                return
              }
              wrapperParent = wrapperParent.parentNode
            }
            this.childElements.set(child, childElementFromInstance)
            return
          }
          if (parent instanceof HTMLElement && 
              (parent.classList.contains('grid-child-component') || 
               parent.classList.contains('layout-child-component'))) {
            this.childElements.set(child, parent)
            return
          }
          parent = parent.parentNode
        }
        this.childElements.set(child, childElementFromInstance)
        return
      }
      
      const childElement = child.render()
      if (childElement) {
        // 当 autoFlow 是 column 时，确保子元素不干扰 Grid 布局
        if (this.autoFlow === 'column' || this.autoFlow === 'column dense') {
          if (childElement instanceof HTMLElement) {
            // 关键：在添加到 Grid 之前，先强制设置宽度，防止 Grid 根据子元素宽度自动创建列
            // 必须在 appendChild 之前设置，否则 Grid 会根据初始宽度计算列宽
            if (typeof this.columns === 'number' && this.columns === 1) {
              // 先设置宽度为 0 或 auto，确保 Grid 不会根据这个宽度创建列
              childElement.style.setProperty('width', '0', 'important')
              childElement.style.setProperty('min-width', '0', 'important')
              childElement.style.setProperty('max-width', '100%', 'important')
              childElement.style.setProperty('box-sizing', 'border-box', 'important')
              
              // 清理子元素内部所有可能的固定宽度（在添加前先清理）
              const cleanWidthRecursively = (el: HTMLElement) => {
                el.querySelectorAll('*').forEach((descendant) => {
                  if (descendant instanceof HTMLElement) {
                    const descComputed = window.getComputedStyle(descendant)
                    // 如果是固定宽度（非百分比、非auto），先设置为 0
                    if (descComputed.width && descComputed.width !== 'auto' && !descComputed.width.includes('%')) {
                      descendant.style.setProperty('width', '0', 'important')
                      descendant.style.setProperty('min-width', '0', 'important')
                      descendant.style.setProperty('max-width', '100%', 'important')
                    }
                    cleanWidthRecursively(descendant)
                  }
                })
              }
              cleanWidthRecursively(childElement)
            }
            
            // 移除可能干扰 Grid 布局的样式
            const computedStyle = window.getComputedStyle(childElement)
            if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') {
              childElement.style.position = ''
            }
            // 移除可能干扰的 display 属性（让 Grid 控制布局）
            if (computedStyle.display === 'inline-block' || computedStyle.display === 'inline-flex') {
              childElement.style.display = ''
            }
          }
        }
        
        // 先添加到 Grid（此时子元素宽度已设置为 0，不会影响 Grid 列宽计算）
        if (childElement.parentNode === null) {
          this.contentContainer.appendChild(childElement)
          this.childElements.set(child, childElement)
        } else {
          this.childElements.set(child, childElement)
        }
        
        // 添加到 Grid 之后，再设置宽度为 100%，让 Grid 控制
        if (this.autoFlow === 'column' || this.autoFlow === 'column dense') {
          if (childElement instanceof HTMLElement && typeof this.columns === 'number' && this.columns === 1) {
            // 使用 requestAnimationFrame 确保在 Grid 布局计算完成后再设置宽度
            requestAnimationFrame(() => {
              childElement.style.setProperty('width', '100%', 'important')
              
              // 递归设置所有内部元素宽度为 100%
              const setWidthRecursively = (el: HTMLElement) => {
                el.querySelectorAll('*').forEach((descendant) => {
                  if (descendant instanceof HTMLElement) {
                    const descComputed = window.getComputedStyle(descendant)
                    // 如果是固定宽度（非百分比、非auto），改为 100%
                    if (descComputed.width && descComputed.width !== 'auto' && !descComputed.width.includes('%')) {
                      descendant.style.setProperty('width', '100%', 'important')
                      descendant.style.setProperty('max-width', '100%', 'important')
                    }
                    setWidthRecursively(descendant)
                  }
                })
              }
              setWidthRecursively(childElement)
            })
          }
        }
      }
    } catch (error) {
      console.error('Error rendering child component:', error)
    }
  }

  private renderAllChildren(): void {
    if (!this.contentContainer) return
    this._children.forEach(child => {
      this.renderChild(child)
    })
  }

// 在 NhaiGridCommand 中，简化 doRender 方法
protected doRender(): HTMLElement {
  console.log('[Grid.doRender] 开始渲染，属性:', { 
    autoFlow: this.autoFlow, 
    columns: this.columns, 
    spacing: this.spacing 
  })
  
    const container = document.createElement('div')
    const self = this

    const GridWrapper = defineComponent({
      setup() {
      return () => {
        // 直接传递当前实例的属性值
        const props = {
          container: self.container,
          columns: self.columns,
          rows: self.rows,
          templateAreas: self.templateAreas,
          autoFlow: self.autoFlow,
          justifyItems: self.justifyItems,
          alignItems: self.alignItems,
          justifyContent: self.justifyContent,
          alignContent: self.alignContent,
          spacing: self.spacing, // 直接传递 spacing 值
          gap: self.gap,
          column: self.column,
          row: self.row,
          area: self.area,
          justifySelf: self.justifySelf,
          alignSelf: self.alignSelf
        }
        console.log('[Grid.doRender] 传递给 Vue 组件的 props:', props)
        return h(Grid, props)
      }
    }
  })

  const app = createApp(GridWrapper)
  app.mount(container)
  
  nextTick(() => {
    this.contentContainer = container.querySelector('.vue-grid') || container
    
    // 关键：在渲染子元素之前，先强制设置 Grid 的样式，防止 Grid 根据子元素宽度自动创建列
    if (this.contentContainer && (this.autoFlow === 'column' || this.autoFlow === 'column dense')) {
      const isColumnFlow = this.autoFlow === 'column' || this.autoFlow === 'column dense'
      if (isColumnFlow) {
        const columnsValue = typeof this.columns === 'number' 
          ? `repeat(${this.columns}, 1fr)` 
          : String(this.columns || '12')
        
        // 先清空所有子元素（如果 Vue 已经自动渲染了一些）
        // 注意：不要清空，因为可能已经有子元素了，我们只需要在添加前设置样式
        
        // 立即设置 grid-template-columns，确保在添加子元素之前就设置好
        // 关键：必须先设置这些样式，Grid 才会使用我们指定的列数，而不是根据子元素自动创建
        // 使用 CSS 变量来确保优先级
        this.contentContainer.style.setProperty('--grid-template-columns', columnsValue, 'important')
        this.contentContainer.style.setProperty('display', 'grid', 'important')
        this.contentContainer.style.setProperty('grid-auto-flow', this.autoFlow, 'important')
        this.contentContainer.style.setProperty('grid-template-columns', columnsValue, 'important')
        this.contentContainer.style.removeProperty('grid-template-rows')
        this.contentContainer.style.setProperty('grid-template-rows', 'none', 'important')
        this.contentContainer.style.setProperty('grid-auto-rows', 'auto', 'important')
        
        // 关键：设置 grid-auto-columns 为 0，防止 Grid 根据内容自动创建额外的列
        this.contentContainer.style.setProperty('grid-auto-columns', '0', 'important')
        
        // 强制所有子元素使用 Grid 控制宽度
        this.contentContainer.style.setProperty('--force-child-width', '100%', 'important')
        
        // 强制触发布局计算，确保样式生效
        void this.contentContainer.offsetHeight
        
        console.log('[Grid.doRender] nextTick - 在渲染子元素前强制设置 Grid 样式:', {
          gridTemplateColumns: columnsValue,
          gridAutoFlow: this.autoFlow,
          gridAutoColumns: '1fr'
        })
      }
    }
    
    this.renderAllChildren()
    
    // 检查渲染结果
    if (this.contentContainer) {
      const gridElement = this.contentContainer.classList.contains('vue-grid') 
        ? this.contentContainer 
        : this.contentContainer.querySelector('.vue-grid')
      
      if (gridElement) {
        const computedStyle = window.getComputedStyle(gridElement)
        console.log('[Grid.doRender] 渲染后的样式检查:', {
          element: gridElement,
          display: computedStyle.display,
          gridAutoFlow: computedStyle.gridAutoFlow,
          gridTemplateColumns: computedStyle.gridTemplateColumns,
          gridTemplateRows: computedStyle.gridTemplateRows,
          gridAutoRows: computedStyle.gridAutoRows,
          inlineStyle: gridElement.getAttribute('style'),
          childrenCount: gridElement.children.length,
          children: Array.from(gridElement.children).map((child, idx) => {
            const childStyle = window.getComputedStyle(child as HTMLElement)
            return {
              index: idx,
              tagName: child.tagName,
              className: child.className,
              display: childStyle.display,
              position: childStyle.position,
              width: childStyle.width,
              height: childStyle.height,
              gridColumn: childStyle.gridColumn,
              gridRow: childStyle.gridRow
            }
          })
        })
      }
    }
    setTimeout(() => {
      const gridEl = container.querySelector('.vue-grid') as HTMLElement
      if (gridEl) {
        const isColumnFlow = this.autoFlow === 'column' || this.autoFlow === 'column dense'
        
        // 关键：先清理所有子元素的固定宽度，防止 Grid 根据子元素宽度自动生成列
        if (isColumnFlow && typeof this.columns === 'number' && this.columns === 1) {
          Array.from(gridEl.children).forEach((child) => {
            if (child instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(child)
              const computedWidth = computedStyle.width
              
              // 强制移除子元素及其所有子元素的固定宽度
              // 必须彻底清理，否则 Grid 会根据内容宽度自动创建列
              child.style.setProperty('width', '', 'important')
              child.style.setProperty('max-width', '100%', 'important')
              child.style.setProperty('min-width', '0', 'important')
              child.style.setProperty('flex-basis', '', 'important')
              child.style.setProperty('box-sizing', 'border-box', 'important')
              
              // 清理子元素内部所有可能的固定宽度元素
              const allDescendants = child.querySelectorAll('*')
              allDescendants.forEach((descendant) => {
                if (descendant instanceof HTMLElement) {
                  const descStyle = window.getComputedStyle(descendant)
                  // 如果内部元素有固定宽度，移除它
                  if (descStyle.width && descStyle.width !== 'auto' && !descStyle.width.includes('%')) {
                    descendant.style.setProperty('width', '', 'important')
                    descendant.style.setProperty('max-width', '100%', 'important')
                  }
                }
              })
              
              console.log('[Grid.doRender] 清理子元素宽度:', {
                element: child,
                computedWidth: computedWidth,
                inlineWidth: child.style.width,
                descCount: allDescendants.length
              })
            }
          })
        }
        
        // 关键：强制设置正确的 grid-template-columns，忽略子元素的宽度
        // 必须在清理子元素宽度之后设置，否则 Grid 会根据子元素尺寸自动生成列
        const columnsValue = typeof this.columns === 'number' 
          ? `repeat(${this.columns}, 1fr)` 
          : String(this.columns || '12')
        
        // 使用 CSS 变量确保优先级
        gridEl.style.setProperty('--grid-template-columns', columnsValue, 'important')
        
        // 先移除可能存在的自动生成的列（可能来自 Vue 样式绑定或 Grid 自动计算）
        gridEl.style.removeProperty('grid-template-columns')
        // 使用 CSS 变量 + 直接值，双重保障
        gridEl.style.setProperty('grid-template-columns', `var(--grid-template-columns, ${columnsValue})`, 'important')
        
        // 强制应用所有样式，使用 !important 确保覆盖 Vue 的样式绑定
        gridEl.style.setProperty('display', 'grid', 'important')
        gridEl.style.setProperty('grid-auto-flow', this.autoFlow, 'important')
        
        // 关键：防止 Grid 自动创建列 - 必须在设置 grid-template-columns 之后
        gridEl.style.setProperty('grid-auto-columns', '0', 'important')
        
        console.log('[Grid.doRender] 强制设置 grid-template-columns:', columnsValue, 'autoFlow:', this.autoFlow)
        
        // 立即触发一次重排，确保样式生效
        void gridEl.offsetHeight
        
        // 关键：当 autoFlow 是 column 时，必须移除 grid-template-rows
        if (isColumnFlow) {
          // 使用 removeProperty 移除可能来自 Vue 样式绑定的 grid-template-rows
          gridEl.style.removeProperty('grid-template-rows')
          // 同时通过设置空值来确保移除
          gridEl.style.setProperty('grid-template-rows', '', 'important')
          gridEl.style.setProperty('grid-auto-rows', 'auto', 'important')
          console.log('[Grid.doRender] COLUMN FLOW - 已移除 grid-template-rows，设置 grid-auto-rows: auto')
        }
        
        gridEl.style.setProperty('gap', typeof this.spacing === 'number' 
          ? `${this.spacing}px` 
          : String(this.spacing || '2'), 'important')
        
        // 强制触发一次重排，确保样式生效
        void gridEl.offsetHeight
        
        const childrenInfo = Array.from(gridEl.children).map((child, idx) => {
          const childEl = child as HTMLElement
          const childStyle = window.getComputedStyle(childEl)
          
          // 如果是 column flow，清理子元素可能干扰的样式
          if (isColumnFlow) {
            // 移除 absolute/fixed 定位
            if (childStyle.position === 'absolute' || childStyle.position === 'fixed') {
              childEl.style.position = ''
            }
            // 如果只有 1 列，确保子元素宽度不超出
            if (typeof this.columns === 'number' && this.columns === 1) {
              childEl.style.width = ''
              childEl.style.maxWidth = '100%'
            }
            // 移除可能干扰的 display
            if (childStyle.display === 'inline-block' || childStyle.display === 'inline-flex') {
              childEl.style.display = ''
            }
            // 确保子元素使用 Grid 的自动布局
            childEl.style.gridColumn = ''
            childEl.style.gridRow = ''
          }
          
          return {
            index: idx,
            tagName: child.tagName,
            className: child.className,
            computedStyle: {
              gridColumn: childStyle.gridColumn,
              gridRow: childStyle.gridRow,
              width: childStyle.width,
              height: childStyle.height,
              position: childStyle.position,
              display: childStyle.display
            },
            inlineStyle: childEl.style.cssText
          }
        })
        
        // 使用标志防止循环更新
        let hasFixedOnce = false
        
        // 在 requestAnimationFrame 中再次检查并最终修复（只修复一次，避免循环）
        requestAnimationFrame(() => {
          if (hasFixedOnce) return // 只修复一次
          
          const recomputedStyle = window.getComputedStyle(gridEl)
          const actualColumns = recomputedStyle.gridTemplateColumns
          const actualRows = recomputedStyle.gridTemplateRows
          const expectedColumns = typeof this.columns === 'number' 
            ? `repeat(${this.columns}, 1fr)` 
            : String(this.columns || '12')
          
          // 如果样式被覆盖了，再次强制应用（只修复一次，避免循环）
          if (isColumnFlow) {
            let needsFix = false
            
            if (actualRows && actualRows !== 'none' && actualRows !== '') {
              console.warn('[Grid.doRender] requestAnimationFrame 检测到 grid-template-rows 仍然存在:', actualRows, '最终移除')
              gridEl.style.removeProperty('grid-template-rows')
              gridEl.style.setProperty('grid-template-rows', '', 'important')
              needsFix = true
            }
            
            if (actualColumns !== expectedColumns && !actualColumns.includes('repeat')) {
              console.warn('[Grid.doRender] requestAnimationFrame 检测到 grid-template-columns 不正确:', actualColumns, '期望:', expectedColumns, '最终设置')
              
              // 先清理所有子元素的宽度，防止 Grid 根据子元素宽度自动创建列
              Array.from(gridEl.children).forEach((child) => {
                if (child instanceof HTMLElement) {
                  // 强制设置宽度为 100%，让 Grid 控制
                  child.style.setProperty('width', '100%', 'important')
                  child.style.setProperty('max-width', '100%', 'important')
                  child.style.setProperty('min-width', '0', 'important')
                  child.style.setProperty('box-sizing', 'border-box', 'important')
                  
                  // 递归清理所有内部元素的固定宽度
                  const cleanWidthRecursively = (el: HTMLElement) => {
                    el.querySelectorAll('*').forEach((descendant) => {
                      if (descendant instanceof HTMLElement) {
                        const descComputed = window.getComputedStyle(descendant)
                        // 如果是固定宽度（非百分比、非auto），强制改为 100%
                        if (descComputed.width && descComputed.width !== 'auto' && !descComputed.width.includes('%')) {
                          descendant.style.setProperty('width', '100%', 'important')
                          descendant.style.setProperty('max-width', '100%', 'important')
                          descendant.style.setProperty('box-sizing', 'border-box', 'important')
                        }
                        cleanWidthRecursively(descendant)
                      }
                    })
                  }
                  cleanWidthRecursively(child)
                }
              })
              
              // 使用 CSS 变量 + 直接值
              gridEl.style.setProperty('--grid-template-columns', expectedColumns, 'important')
              gridEl.style.removeProperty('grid-template-columns')
              gridEl.style.setProperty('grid-template-columns', `var(--grid-template-columns, ${expectedColumns})`, 'important')
              
              // 再次确保 grid-auto-columns 为 0
              gridEl.style.setProperty('grid-auto-columns', '0', 'important')
              
              needsFix = true
            }
            
            if (needsFix) {
              hasFixedOnce = true
              
              void gridEl.offsetHeight // 触发布局重排
              
              // 在下一个 frame 再次确保样式正确（防止 Vue 再次覆盖）
              requestAnimationFrame(() => {
                if (!hasFixedOnce) return
                const finalCheck = window.getComputedStyle(gridEl)
                const finalColumns = finalCheck.gridTemplateColumns
                const finalRows = finalCheck.gridTemplateRows
                
                if (isColumnFlow) {
                  // 最后一次强制设置
                  if (finalRows && finalRows !== 'none' && finalRows !== '') {
                    gridEl.style.setProperty('grid-template-rows', 'none', 'important')
                  }
                  if (finalColumns !== expectedColumns && !finalColumns.includes('repeat')) {
                    gridEl.style.setProperty('--grid-template-columns', expectedColumns, 'important')
                    gridEl.style.setProperty('grid-template-columns', `var(--grid-template-columns, ${expectedColumns})`, 'important')
                    gridEl.style.setProperty('grid-auto-columns', '0', 'important')
                  }
                  
                  console.log('[Grid.doRender] 最终修复完成:', {
                    gridTemplateColumns: window.getComputedStyle(gridEl).gridTemplateColumns,
                    gridTemplateRows: window.getComputedStyle(gridEl).gridTemplateRows,
                    gridAutoFlow: window.getComputedStyle(gridEl).gridAutoFlow
                  })
                }
              })
            }
          }
          
          const finalStyle = window.getComputedStyle(gridEl)
          console.log('[Grid.doRender] 最终样式检查:', {
            display: finalStyle.display,
            gridAutoFlow: finalStyle.gridAutoFlow,
            gridTemplateColumns: {
              expected: expectedColumns,
              actual: finalStyle.gridTemplateColumns,
              match: finalStyle.gridTemplateColumns === expectedColumns || 
                     (typeof this.columns === 'number' && finalStyle.gridTemplateColumns.includes('repeat'))
            },
            gridTemplateRows: {
              actual: finalStyle.gridTemplateRows,
              shouldBeEmpty: isColumnFlow ? '应该是空或none' : '可以有值'
            },
            gridAutoRows: finalStyle.gridAutoRows,
            childrenCount: gridEl.children.length,
            childrenInfo: childrenInfo
          })
        })
      }
    }, 100)
  })
  
  this._appInstance = app
  return container
}
  protected override update(): void {
    // 防止重复更新
    if (this._updating) {
      console.log('[Grid.update] 正在更新中，跳过重复调用')
      return
    }
    this._updating = true
    
    console.log('[Grid.update] 开始更新，_mounted:', this._mounted, 'autoFlow:', this.autoFlow, 'columns:', this.columns)
    // Grid 使用 Vue 组件，需要重新挂载 Vue 应用以反映属性变化
    // 但需要保留可视化编辑器中手动添加的 wrapper 元素
    // 如果没有 contentContainer，说明还没有完全初始化，先尝试获取
    if (!this.contentContainer && this._element) {
      this.contentContainer = this._element.querySelector('.vue-grid') || undefined
      console.log('[Grid.update] 延迟获取 contentContainer:', !!this.contentContainer)
    }
    
    if (this._mounted && this._appInstance && this._element && this.contentContainer) {
      console.log('[Grid.update] 开始重新挂载 Vue 应用，当前属性:', {
        autoFlow: this.autoFlow,
        columns: this.columns,
        rows: this.rows,
        justifyItems: this.justifyItems,
        alignItems: this.alignItems
      })
      // 保存所有 wrapper 元素（它们是 .vue-grid 的直接子元素，用于可视化编辑器）
      const wrapperElements: Array<{ child: BaseCommand<any, any>, wrapper: HTMLElement }> = []
      this.childElements.forEach((wrapper, child) => {
        // 检查是否是可视化编辑器中的 wrapper（有特定的 class）
        if (wrapper && wrapper.classList && 
            (wrapper.classList.contains('grid-child-component') || 
             wrapper.classList.contains('layout-child-component'))) {
          // 从 DOM 中移除 wrapper（但不删除 wrapper 本身）
          if (wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper)
          }
          wrapperElements.push({ child, wrapper })
        }
      })
      
      // 卸载旧的 Vue 应用
      try {
        (this._appInstance as any).unmount()
      } catch (e) {
        // 忽略卸载错误
      }
      
      // 保存子组件引用
      const children = [...this._children]
      const oldContentContainer = this.contentContainer
      
      // 清空容器
      if (this._element) {
        this._element.innerHTML = ''
      }
      
      // 重新创建并挂载 Vue 应用
      const container = this._element
      const self = this
      
      // 直接使用当前属性值创建组件
      // 注意：props 必须在 render 函数内部创建，这样每次渲染时都会读取最新的类属性值
      const GridWrapper = defineComponent({
        setup() {
          // 返回渲染函数，每次渲染时读取最新的属性值
          return () => {
            const props = {
              container: self.container,
              columns: self.columns,
              rows: self.rows,
              templateAreas: self.templateAreas,
              autoFlow: self.autoFlow,
              justifyItems: self.justifyItems,
              alignItems: self.alignItems,
              justifyContent: self.justifyContent,
              alignContent: self.alignContent,
              spacing: self.spacing,
              gap: self.gap,
              column: self.column,
              row: self.row,
              area: self.area,
              justifySelf: self.justifySelf,
              alignSelf: self.alignSelf
            }
            console.log('[Grid.update] GridWrapper render，传递的 props:', { 
              container: props.container, 
              autoFlow: props.autoFlow, 
              columns: props.columns, 
              rows: props.rows 
            })
            return h(Grid, props)
          }
      }
    })

    const app = createApp(GridWrapper)
      console.log('[Grid.update] 挂载 Vue 应用')
    app.mount(container)
      
      nextTick(() => {
        this.contentContainer = container.querySelector('.vue-grid') || container
        console.log('[Grid.update] nextTick 后，contentContainer:', !!this.contentContainer, 'wrapperElements:', wrapperElements.length)
        
        // 恢复可视化编辑器中的 wrapper 元素
        if (this.contentContainer && wrapperElements.length > 0) {
          wrapperElements.forEach(({ child, wrapper }) => {
            // 将 wrapper 重新添加到新的 contentContainer
            this.contentContainer!.appendChild(wrapper)
            // 更新映射关系
            this.childElements.set(child, wrapper)
          })
        } else if (this.contentContainer && oldContentContainer !== this.contentContainer) {
          // 如果没有 wrapper 元素，但有子组件，可能需要重新渲染
          // 但这种情况通常发生在非可视化编辑器模式
          const childElements = new Map(this.childElements)
          children.forEach(child => {
            const oldElement = childElements.get(child)
            // 如果旧元素不在 DOM 中，重新渲染
            if (!oldElement || !oldElement.parentNode) {
              this.renderChild(child)
            }
          })
        }
        
        // 检查 Vue 组件是否正确应用了样式
        if (this.contentContainer) {
          const gridElement = (this.contentContainer.classList?.contains('vue-grid') 
            ? this.contentContainer 
            : this.contentContainer.querySelector('.vue-grid')) as HTMLElement
          if (gridElement) {
            // 等待 Vue 下一次渲染周期
            nextTick(() => {
              // 检查计算样式
              const computedStyle = window.getComputedStyle(gridElement)
              const actualAutoFlow = computedStyle.gridAutoFlow || ''
              const inlineStyle = gridElement.style.getPropertyValue('grid-auto-flow')
              const allInlineStyles = Array.from(gridElement.style).map((key: string) => ({
                key,
                value: gridElement.style.getPropertyValue(key)
              })).filter((s: { key: string; value: string }) => s.key.includes('grid'))
              
              console.log('[Grid.update] nextTick 后样式检查:', {
                expectedAutoFlow: this.autoFlow,
                computedGridAutoFlow: actualAutoFlow || '(空)',
                inlineGridAutoFlow: inlineStyle || '(空)',
                gridTemplateColumns: computedStyle.gridTemplateColumns || '(空)',
                allInlineGridStyles: allInlineStyles
              })
              
              // 如果计算样式仍然是空的，但内联样式已设置，可能是浏览器还没重排
              if (!actualAutoFlow && inlineStyle) {
                // 强制触发布局重排
                void gridElement.offsetHeight
                const recomputed = window.getComputedStyle(gridElement)
                console.log('[Grid.update] 强制重排后的计算样式:', {
                  gridAutoFlow: recomputed.gridAutoFlow || '(空)',
                  gridTemplateColumns: recomputed.gridTemplateColumns || '(空)'
                })
              }
            })
          }
        }
      })
      
    this._appInstance = app
      
      // 等待 Vue 渲染完成后检查样式并解锁
      requestAnimationFrame(() => {
        nextTick(() => {
          if (this.contentContainer) {
            const gridElement = (this.contentContainer.classList?.contains('vue-grid') 
              ? this.contentContainer 
              : this.contentContainer.querySelector('.vue-grid')) as HTMLElement
            if (gridElement) {
              // 强制触发布局重排
              void gridElement.offsetHeight
              
              const computedStyle = window.getComputedStyle(gridElement)
              const inlineStyles = Array.from(gridElement.style).filter((k: string) => k.includes('grid')).map((k: string) => ({
                key: k,
                value: gridElement.style.getPropertyValue(k),
                priority: gridElement.style.getPropertyPriority(k)
              }))
              
              // 检查 display 是否是 grid（这很关键）
              const isDisplayGrid = computedStyle.display === 'grid'
              
              console.log('[Grid.update] requestAnimationFrame + nextTick 后样式检查:', {
                expectedAutoFlow: this.autoFlow,
                isDisplayGrid: isDisplayGrid,
                computedDisplay: computedStyle.display || '(空)',
                computedGridAutoFlow: computedStyle.gridAutoFlow || '(空)',
                computedGridTemplateColumns: computedStyle.gridTemplateColumns || '(空)',
                inlineStyles: inlineStyles,
                styleAttribute: gridElement.getAttribute('style') || '(空)',
                styleCssText: gridElement.style.cssText || '(空)',
                elementHTML: gridElement.outerHTML.substring(0, 300)
              })
              
              // 无条件强制应用所有 Grid 样式，确保 Vue 的 :style 绑定失效时也能正常工作
              // 因为日志显示 Vue 可能没有正确应用 display: grid
              console.log('[Grid.update] 强制应用所有 Grid 样式以确保正确显示')
              if (true) { // 无条件执行
                gridElement.style.setProperty('display', 'grid', 'important')
                
                // 确保所有 Grid 样式都正确应用（使用 !important 防止被覆盖）
                const isColumnFlow = this.autoFlow === 'column' || this.autoFlow === 'column dense'
                gridElement.style.setProperty('grid-auto-flow', this.autoFlow, 'important')
                
                // 根据 autoFlow 方向决定如何应用 columns 和 rows
                console.log('[Grid.update] 强制应用样式，isColumnFlow:', isColumnFlow, 'autoFlow:', this.autoFlow)
                if (isColumnFlow) {
                  console.log('[Grid.update] ====== 应用 COLUMN FLOW 样式 ======')
                  // 当 autoFlow 是 column 时，columns 控制列数
                  if (typeof this.columns === 'number') {
                    const columnsValue = `repeat(${this.columns}, 1fr)`
                    console.log('[Grid.update] 设置 grid-template-columns:', columnsValue)
                    gridElement.style.setProperty('grid-template-columns', columnsValue, 'important')
                  } else if (this.columns) {
                    console.log('[Grid.update] 设置 grid-template-columns:', String(this.columns))
                    gridElement.style.setProperty('grid-template-columns', String(this.columns), 'important')
                  }
                  // 关键：当 autoFlow 是 column 时，不应该设置固定的 grid-template-rows
                  // 因为这会导致行数受限，影响列流动行为
                  // 必须移除可能存在的 grid-template-rows（如果之前设置过）
                  const beforeRemove = gridElement.style.gridTemplateRows
                  gridElement.style.removeProperty('grid-template-rows')
                  console.log('[Grid.update] 移除 grid-template-rows (之前:', beforeRemove, ')')
                  // 使用 grid-auto-rows 让行根据内容自动创建，这样项目才能正确地按列方向排列
                  gridElement.style.setProperty('grid-auto-rows', 'auto', 'important')
                  console.log('[Grid.update] 设置 grid-auto-rows: auto')
                  
                  // 立即检查应用后的样式
                  const computedAfter = window.getComputedStyle(gridElement)
                  console.log('[Grid.update] 应用 COLUMN FLOW 后的检查:', {
                    display: computedAfter.display,
                    gridAutoFlow: computedAfter.gridAutoFlow,
                    gridTemplateColumns: computedAfter.gridTemplateColumns,
                    gridTemplateRows: computedAfter.gridTemplateRows,
                    gridAutoRows: computedAfter.gridAutoRows,
                    childrenCount: gridElement.children.length
                  })
                  console.log('[Grid.update] ====== COLUMN FLOW 样式应用完成 ======')
                } else {
                  // 当 autoFlow 是 row（默认）时，正常处理
                  if (typeof this.columns === 'number') {
                    gridElement.style.setProperty('grid-template-columns', `repeat(${this.columns}, 1fr)`, 'important')
                  } else if (this.columns) {
                    gridElement.style.setProperty('grid-template-columns', String(this.columns), 'important')
                  }
                  if (this.rows) {
                    if (typeof this.rows === 'number') {
                      gridElement.style.setProperty('grid-template-rows', `repeat(${this.rows}, 1fr)`, 'important')
                    } else {
                      gridElement.style.setProperty('grid-template-rows', String(this.rows), 'important')
                    }
                  }
                }
                gridElement.style.setProperty('justify-items', this.justifyItems, 'important')
                gridElement.style.setProperty('align-items', this.alignItems, 'important')
                if (this.justifyContent) {
                  gridElement.style.setProperty('justify-content', this.justifyContent, 'important')
                }
                if (this.alignContent) {
                  gridElement.style.setProperty('align-content', this.alignContent, 'important')
                }
                if (this.gap) {
                  gridElement.style.setProperty('gap', this.gap, 'important')
                } else if (this.spacing) {
                  const gapValue = typeof this.spacing === 'number' ? `${this.spacing * 8}px` : String(this.spacing)
                  gridElement.style.setProperty('gap', gapValue, 'important')
                }
                
                // 强制触发布局重排
                void gridElement.offsetHeight
                
                // 再次检查
                const recomputedStyle = window.getComputedStyle(gridElement)
                console.log('[Grid.update] 强制设置样式后的检查:', {
                  display: recomputedStyle.display,
                  gridAutoFlow: recomputedStyle.gridAutoFlow || '(空)',
                  gridTemplateColumns: recomputedStyle.gridTemplateColumns || '(空)',
                  gridTemplateRows: recomputedStyle.gridTemplateRows || '(空)'
                })
              }
              
              // 如果内联样式已设置但计算样式仍然是空的，可能是 CSS 没有正确解析
              // 这种情况下，布局应该已经改变了（即使计算样式为空）
              // 检查是否有子元素，如果有，它们的布局应该已经改变
              const childCount = gridElement.children.length
              console.log('[Grid.update] Grid 子元素数量:', childCount)
            }
          }
          this._updating = false
        })
      })
    } else {
      console.log('[Grid.update] 跳过更新，条件不满足:', {
        _mounted: this._mounted,
        _appInstance: !!this._appInstance,
        _element: !!this._element,
        contentContainer: !!this.contentContainer
      })
      // 解除更新锁
      this._updating = false
    }
    
    console.log('[Grid.update] 更新完成，发射 updated 事件')
    this.emit('updated')
  }

  // 统一的样式应用方法
  private applyGridStyles(gridElement: HTMLElement): void {
    // 统一应用所有 Grid 样式属性
    const isColumnFlow = this.autoFlow === 'column' || this.autoFlow === 'column dense'
    gridElement.style.setProperty('grid-auto-flow', this.autoFlow, 'important')
    gridElement.style.setProperty('justify-items', this.justifyItems, 'important')
    gridElement.style.setProperty('align-items', this.alignItems, 'important')
    
    // 根据 autoFlow 方向决定如何应用 columns 和 rows
    if (isColumnFlow) {
      // 当 autoFlow 是 column 时，columns 控制列数
      if (typeof this.columns === 'number') {
        gridElement.style.setProperty('grid-template-columns', `repeat(${this.columns}, 1fr)`, 'important')
      } else if (this.columns) {
        gridElement.style.setProperty('grid-template-columns', String(this.columns), 'important')
      }
      // 关键：当 autoFlow 是 column 时，不应该设置固定的 grid-template-rows
      // 因为这会导致行数受限，影响列流动行为
      // 必须移除可能存在的 grid-template-rows（如果之前设置过）
      gridElement.style.removeProperty('grid-template-rows')
      // 使用 grid-auto-rows 让行根据内容自动创建，这样项目才能正确地按列方向排列
      gridElement.style.setProperty('grid-auto-rows', 'auto', 'important')
    } else {
      // 当 autoFlow 是 row（默认）时，正常处理
      if (typeof this.columns === 'number') {
        gridElement.style.setProperty('grid-template-columns', `repeat(${this.columns}, 1fr)`, 'important')
      } else if (this.columns) {
        gridElement.style.setProperty('grid-template-columns', String(this.columns), 'important')
      }
      if (this.rows) {
        if (typeof this.rows === 'number') {
          gridElement.style.setProperty('grid-template-rows', `repeat(${this.rows}, 1fr)`, 'important')
        } else {
          gridElement.style.setProperty('grid-template-rows', String(this.rows), 'important')
        }
      }
    }
    
    // 网格区域
    if (this.templateAreas) {
      gridElement.style.setProperty('grid-template-areas', this.templateAreas, 'important')
    }
    
    // 对齐属性
    if (this.justifyContent) {
      gridElement.style.setProperty('justify-content', this.justifyContent, 'important')
    }
    if (this.alignContent) {
      gridElement.style.setProperty('align-content', this.alignContent, 'important')
    }
    
    // 间距
    if (this.gap) {
      gridElement.style.setProperty('gap', this.gap, 'important')
    } else if (this.spacing) {
      const gapValue = typeof this.spacing === 'number' ? `${this.spacing * 8}px` : String(this.spacing)
      gridElement.style.setProperty('gap', gapValue, 'important')
    }
    
    // 强制触发布局重排
    void gridElement.offsetHeight
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiGridCommand