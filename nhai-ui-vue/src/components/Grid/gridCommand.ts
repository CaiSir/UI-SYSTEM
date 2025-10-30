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
    console.log('[Grid.setAutoFlow] 开始设置 autoFlow:', autoFlow, '当前值:', this.autoFlow)
    this.autoFlow = autoFlow
    this.setProperty('autoFlow', autoFlow)
    console.log('[Grid.setAutoFlow] 设置完成，_mounted:', this._mounted, 'autoFlow:', this.autoFlow)
    // 不在这里调用 scheduleUpdate，让 DesignerApp 直接调用 update() 来避免重复
    // if (this._mounted) {
    //   console.log('[Grid.setAutoFlow] 调用 scheduleUpdate')
    //   this.scheduleUpdate()
    // }
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
        if (childElement.parentNode === null) {
          this.contentContainer.appendChild(childElement)
          this.childElements.set(child, childElement)
        } else {
          this.childElements.set(child, childElement)
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

  protected doRender(): HTMLElement {
    console.log('[Grid.doRender] 开始渲染，属性:', { autoFlow: this.autoFlow, columns: this.columns, rows: this.rows })
    const container = document.createElement('div')
    const self = this

    const GridWrapper = defineComponent({
      setup() {
        // 在 doRender() 时直接使用实例属性（此时是最新的）
        console.log('[Grid.doRender] GridWrapper setup，属性:', { autoFlow: self.autoFlow, columns: self.columns })
        return () => {
          console.log('[Grid.doRender] GridWrapper render，属性:', { autoFlow: self.autoFlow, columns: self.columns })
          return h(Grid, {
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
          })
        }
      }
    })

    const app = createApp(GridWrapper)
    app.mount(container)
    
    nextTick(() => {
      this.contentContainer = container.querySelector('.vue-grid') || container
      // 只有在可视化编辑器中（childElements 已存在）时，不自动渲染子组件
      // 因为子组件会由设计器手动管理
      if (!this.childElements || this.childElements.size === 0) {
        this.renderAllChildren()
      }
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
                gridElement.style.setProperty('grid-auto-flow', this.autoFlow, 'important')
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
                  gridTemplateColumns: recomputedStyle.gridTemplateColumns || '(空)'
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
    gridElement.style.setProperty('grid-auto-flow', this.autoFlow, 'important')
    gridElement.style.setProperty('justify-items', this.justifyItems, 'important')
    gridElement.style.setProperty('align-items', this.alignItems, 'important')
    
    // 列模板
    if (typeof this.columns === 'number') {
      gridElement.style.setProperty('grid-template-columns', `repeat(${this.columns}, 1fr)`, 'important')
    } else if (this.columns) {
      gridElement.style.setProperty('grid-template-columns', String(this.columns), 'important')
    }
    
    // 行模板
    if (this.rows) {
      if (typeof this.rows === 'number') {
        gridElement.style.setProperty('grid-template-rows', `repeat(${this.rows}, 1fr)`, 'important')
      } else {
        gridElement.style.setProperty('grid-template-rows', String(this.rows), 'important')
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