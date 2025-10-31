import { createApp, h, defineComponent, nextTick, ref } from 'vue'
import Grid from './Grid.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface GridOptions extends IBaseCommandProps {
  container?: boolean
  columns?: number | string  // 列数或列模板，如 12 或 "repeat(12, 1fr)"
  rows?: number | string     // 行数或行模板，可选
  templateAreas?: string     // 模板区域，如 "a a a" "b b c"
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
  justifyItems?: 'start' | 'end' | 'center' | 'stretch'
  alignItems?: 'start' | 'end' | 'center' | 'stretch'
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  spacing?: number           // 间距（Material UI 风格，实际间距 = spacing * 8px）
  gap?: string               // 自定义间距，如 "16px" 或 "1rem"
}

export interface GridEvents extends IBaseCommandEvents {}

/**
 * Grid 子项配置接口
 * 用于配置子组件在 Grid 中的位置和大小
 */
export interface GridItemConfig {
  gridColumnStart?: number | string  // 列起始位置
  gridColumnEnd?: number | string    // 列结束位置
  gridRowStart?: number | string     // 行起始位置
  gridRowEnd?: number | string       // 行结束位置
  gridArea?: string                  // 网格区域名称或简写，如 "a" 或 "1 / 1 / 3 / 3"
  span?: number                      // 简写：跨越多列（默认 1）
  rowSpan?: number                   // 简写：跨越多行（默认 1）
}

/**
 * NHAI Grid 的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 支持高效的 CSS Grid 布局系统
 * 继承 BaseCommand 获得统一的接口和生命周期
 */
export class NhaiGridCommand extends BaseCommand<GridOptions, GridEvents> {
  private container: boolean = true
  private columns: number | string = 12
  private rows?: number | string
  private templateAreas?: string
  private autoFlow: 'row' | 'column' | 'row dense' | 'column dense' = 'row'
  private justifyItems: 'start' | 'end' | 'center' | 'stretch' = 'stretch'
  private alignItems: 'start' | 'end' | 'center' | 'stretch' = 'stretch'
  private justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  private alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  private spacing: number = 2
  private gap?: string

  // 子组件的 Grid 配置映射
  private childGridConfigs: Map<BaseCommand<any, any>, GridItemConfig> = new Map()

  constructor(options?: GridOptions | boolean | number) {
    // 支持多种构造函数重载
    let opts: GridOptions = {}
    
    if (typeof options === 'boolean') {
      // NhaiGridCommand(true) -> { container: true }
      opts = { container: options }
    } else if (typeof options === 'number') {
      // NhaiGridCommand(12) -> { columns: 12 }
      opts = { columns: options }
    } else if (options) {
      opts = options
    }
    
    super(opts)
    
    // 初始化属性
    this.container = opts.container ?? true
    this.columns = opts.columns ?? 12
    this.rows = opts.rows
    this.templateAreas = opts.templateAreas
    this.autoFlow = opts.autoFlow ?? 'row'
    this.justifyItems = opts.justifyItems ?? 'start'  // 默认改为 start，避免子项过度拉伸
    this.alignItems = opts.alignItems ?? 'stretch'
    this.justifyContent = opts.justifyContent
    this.alignContent = opts.alignContent
    this.spacing = opts.spacing ?? 2
    this.gap = opts.gap
    
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
      ...opts
    })
  }

  // ==================== 属性设置方法 ====================

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

  setTemplateAreas(templateAreas: string): this {
    this.templateAreas = templateAreas
    this.setProperty('templateAreas', templateAreas)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAutoFlow(autoFlow: 'row' | 'column' | 'row dense' | 'column dense'): this {
    this.autoFlow = autoFlow
    this.setProperty('autoFlow', autoFlow)
    if (this._mounted) {
      this.scheduleUpdate()
    }
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

  setJustifyContent(justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'): this {
    this.justifyContent = justifyContent
    this.setProperty('justifyContent', justifyContent)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setAlignContent(alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'): this {
    this.alignContent = alignContent
    this.setProperty('alignContent', alignContent)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setSpacing(spacing: number): this {
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

  // ==================== 子组件 Grid 配置方法 ====================

  /**
   * 为子组件设置 Grid 布局配置
   * @param child 子组件实例
   * @param config Grid 布局配置
   */
  setChildGridConfig(child: BaseCommand<any, any>, config: GridItemConfig): this {
    // 确保子组件已经添加到 Grid
    if (!this._children.includes(child)) {
      this.addChild(child)
    }
    
    this.childGridConfigs.set(child, config)
    
    // 如果已经渲染，立即应用配置
    if (this._mounted && this.contentContainer) {
      const childElement = this.childElements.get(child)
      if (childElement) {
        this.applyGridConfigToElement(childElement, config)
      }
    }
    
    return this
  }

  /**
   * 获取子组件的 Grid 配置
   */
  getChildGridConfig(child: BaseCommand<any, any>): GridItemConfig | undefined {
    return this.childGridConfigs.get(child)
  }

  /**
   * 移除子组件的 Grid 配置
   */
  removeChildGridConfig(child: BaseCommand<any, any>): this {
    this.childGridConfigs.delete(child)
    
    // 如果已经渲染，移除配置
    if (this._mounted && this.contentContainer) {
      const childElement = this.childElements.get(child)
      if (childElement) {
        this.removeGridConfigFromElement(childElement)
      }
    }
    
    return this
  }

  /**
   * 将 Grid 配置应用到 DOM 元素
   */
  private applyGridConfigToElement(element: HTMLElement, config: GridItemConfig): void {
    // 如果指定了 gridArea，优先使用
    if (config.gridArea) {
      element.style.gridArea = config.gridArea
      return
    }
    
    // 否则使用详细的配置
    if (config.gridColumnStart !== undefined) {
      element.style.gridColumnStart = String(config.gridColumnStart)
    }
    if (config.gridColumnEnd !== undefined) {
      element.style.gridColumnEnd = String(config.gridColumnEnd)
    }
    if (config.gridRowStart !== undefined) {
      element.style.gridRowStart = String(config.gridRowStart)
    }
    if (config.gridRowEnd !== undefined) {
      element.style.gridRowEnd = String(config.gridRowEnd)
    }
    
    // 使用简写 span
    if (config.span !== undefined && config.gridColumnStart === undefined && config.gridColumnEnd === undefined) {
      const columnStart = this.getCurrentColumnForChild(element)
      if (columnStart > 0) {
        element.style.gridColumn = `${columnStart} / span ${config.span}`
      }
    }
    if (config.rowSpan !== undefined && config.gridRowStart === undefined && config.gridRowEnd === undefined) {
      const rowStart = this.getCurrentRowForChild(element)
      if (rowStart > 0) {
        element.style.gridRow = `${rowStart} / span ${config.rowSpan}`
      }
    }
  }

  /**
   * 从 DOM 元素移除 Grid 配置
   */
  private removeGridConfigFromElement(element: HTMLElement): void {
    element.style.gridArea = ''
    element.style.gridColumnStart = ''
    element.style.gridColumnEnd = ''
    element.style.gridRowStart = ''
    element.style.gridRowEnd = ''
    element.style.gridColumn = ''
    element.style.gridRow = ''
  }

  /**
   * 获取子组件当前所在的列（用于计算 span）
   * 这是一个简化的实现，实际可能需要更复杂的逻辑
   */
  private getCurrentColumnForChild(element: HTMLElement): number {
    // 尝试从现有样式读取
    const gridColumn = element.style.gridColumn
    if (gridColumn) {
      const match = gridColumn.match(/^(\d+)/)
      if (match) {
        return parseInt(match[1], 10)
      }
    }
    
    // 如果没有配置，返回 0 表示自动布局
    return 0
  }

  /**
   * 获取子组件当前所在的行（用于计算 rowSpan）
   */
  private getCurrentRowForChild(element: HTMLElement): number {
    const gridRow = element.style.gridRow
    if (gridRow) {
      const match = gridRow.match(/^(\d+)/)
      if (match) {
        return parseInt(match[1], 10)
      }
    }
    return 0
  }

  // ==================== 子组件管理 ====================
  protected childElements: Map<BaseCommand<any, any>, HTMLElement> = new Map()
  protected contentContainer?: HTMLElement

  override addChild<C extends BaseCommand<any, any>>(child: C): this {
    super.addChild(child)
    if (this._mounted && this.contentContainer) {
      this.renderChild(child)
    }
    return this
  }

  override removeChild<C extends BaseCommand<any, any>>(child: C): this {
    super.removeChild(child)
    
    // 移除 Grid 配置
    this.childGridConfigs.delete(child)
    
    const childElement = this.childElements.get(child)
    if (childElement && childElement.parentNode) {
      childElement.parentNode.removeChild(childElement)
    }
    this.childElements.delete(child)
    return this
  }

  /**
   * 渲染子组件到内容容器
   */
  private renderChild(child: BaseCommand<any, any>): void {
    if (!this.contentContainer) return
    
    try {
      // 如果子组件已经渲染过且有映射，先移除旧的
      const oldElement = this.childElements.get(child)
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.removeChild(oldElement)
      }
      
      // 渲染子组件
      const childElement = child.render()
      
      // 应用 Grid 配置（如果有）
      const config = this.childGridConfigs.get(child)
      if (config) {
        this.applyGridConfigToElement(childElement, config)
      }
      
      // 挂载到内容容器
      this.contentContainer.appendChild(childElement)
      
      // 保存映射关系
      this.childElements.set(child, childElement)
    } catch (error) {
      console.error('Error rendering child component:', error)
    }
  }

  /**
   * 渲染所有子组件
   */
  private renderAllChildren(): void {
    if (!this.contentContainer) return
    
    this._children.forEach(child => {
      this.renderChild(child)
    })
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    // Grid 应该环抱着控件，确保外层容器根据内容自适应
    container.style.width = 'fit-content'
    container.style.minWidth = 'fit-content'
    container.style.maxWidth = 'fit-content'
    container.style.height = 'fit-content'
    container.style.minHeight = 'fit-content'
    container.style.maxHeight = 'fit-content'
    container.style.display = 'inline-block'
    // 确保 Grid 紧贴内容，不留多余空白
    container.style.padding = '0'
    container.style.margin = '0'
    const self = this

    // 使用响应式引用，确保属性变化时组件会更新
    const containerRef = ref(self.container)
    const columnsRef = ref(self.columns)
    const rowsRef = ref(self.rows)
    const templateAreasRef = ref(self.templateAreas)
    const autoFlowRef = ref(self.autoFlow)
    const justifyItemsRef = ref(self.justifyItems)
    const alignItemsRef = ref(self.alignItems)
    const justifyContentRef = ref(self.justifyContent)
    const alignContentRef = ref(self.alignContent)
    const spacingRef = ref(self.spacing)
    const gapRef = ref(self.gap)

    const GridWrapper = defineComponent({
      setup() {
        // 响应式属性会自动更新组件
        return () => h(Grid, {
          key: `${containerRef.value}-${columnsRef.value}-${rowsRef.value}-${autoFlowRef.value}-${spacingRef.value}`, // 添加 key 强制更新
          container: containerRef.value,
          columns: columnsRef.value,
          rows: rowsRef.value,
          templateAreas: templateAreasRef.value,
          autoFlow: autoFlowRef.value,
          justifyItems: justifyItemsRef.value,
          alignItems: alignItemsRef.value,
          justifyContent: justifyContentRef.value,
          alignContent: alignContentRef.value,
          spacing: spacingRef.value,
          gap: gapRef.value
        })
      }
    })

    const app = createApp(GridWrapper)
    app.mount(container)
    
    // 保存响应式引用，以便后续更新
    ;(this as any)._containerRef = containerRef
    ;(this as any)._columnsRef = columnsRef
    ;(this as any)._rowsRef = rowsRef
    ;(this as any)._templateAreasRef = templateAreasRef
    ;(this as any)._autoFlowRef = autoFlowRef
    ;(this as any)._justifyItemsRef = justifyItemsRef
    ;(this as any)._alignItemsRef = alignItemsRef
    ;(this as any)._justifyContentRef = justifyContentRef
    ;(this as any)._alignContentRef = alignContentRef
    ;(this as any)._spacingRef = spacingRef
    ;(this as any)._gapRef = gapRef
    
    // 查找实际的 Grid 内容容器（.vue-grid 元素）
    nextTick(() => {
      this.contentContainer = container.querySelector('.vue-grid') || container
      // 如果找到了 .vue-grid，确保它能够接收子组件
      if (this.contentContainer) {
        // 渲染所有子组件
        this.renderAllChildren()
      }
    })
    
    // 同步方式也尝试查找（如果 Vue 组件已经渲染）
    setTimeout(() => {
      if (!this.contentContainer) {
        this.contentContainer = container.querySelector('.vue-grid') || container
        this.renderAllChildren()
      }
    }, 100)
    
    this._appInstance = app

    return container
  }

  /**
   * 重写 update 方法，确保属性变化时 Vue 组件能响应式更新
   */
  protected override update(): void {
    // 更新响应式引用，触发 Vue 组件重新渲染
    if ((this as any)._containerRef) {
      ;(this as any)._containerRef.value = this.container
    }
    if ((this as any)._columnsRef) {
      ;(this as any)._columnsRef.value = this.columns
    }
    if ((this as any)._rowsRef) {
      ;(this as any)._rowsRef.value = this.rows
    }
    if ((this as any)._templateAreasRef) {
      ;(this as any)._templateAreasRef.value = this.templateAreas
    }
    if ((this as any)._autoFlowRef) {
      ;(this as any)._autoFlowRef.value = this.autoFlow
    }
    if ((this as any)._justifyItemsRef) {
      ;(this as any)._justifyItemsRef.value = this.justifyItems
    }
    if ((this as any)._alignItemsRef) {
      ;(this as any)._alignItemsRef.value = this.alignItems
    }
    if ((this as any)._justifyContentRef) {
      ;(this as any)._justifyContentRef.value = this.justifyContent
    }
    if ((this as any)._alignContentRef) {
      ;(this as any)._alignContentRef.value = this.alignContent
    }
    if ((this as any)._spacingRef) {
      ;(this as any)._spacingRef.value = this.spacing
    }
    if ((this as any)._gapRef) {
      ;(this as any)._gapRef.value = this.gap
    }
    
    // 确保子组件也重新渲染
    if (this._mounted && this.contentContainer) {
      nextTick(() => {
        this.renderAllChildren()
      })
    }
    
    super.update()
  }

  override unmount(): void {
    // 清理响应式引用
    delete (this as any)._containerRef
    delete (this as any)._columnsRef
    delete (this as any)._rowsRef
    delete (this as any)._templateAreasRef
    delete (this as any)._autoFlowRef
    delete (this as any)._justifyItemsRef
    delete (this as any)._alignItemsRef
    delete (this as any)._justifyContentRef
    delete (this as any)._alignContentRef
    delete (this as any)._spacingRef
    delete (this as any)._gapRef
    
    // 清理 Grid 配置映射
    this.childGridConfigs.clear()
    super.unmount()
  }

  // ==================== 便捷方法 ====================

  /**
   * 根据组件的根式（grid-area 配置）生成高效的 Grid 布局
   * 这是一个便捷方法，用于快速配置子组件的 Grid 位置
   * 
   * @param child 子组件实例
   * @param areaName 网格区域名称（用于 grid-template-areas）
   * @param span 跨越多列（默认 1）
   * @param rowSpan 跨越多行（默认 1）
   */
  placeChild(child: BaseCommand<any, any>, areaName?: string, span: number = 1, rowSpan: number = 1): this {
    if (areaName) {
      // 如果指定了区域名称，使用 gridArea
      this.setChildGridConfig(child, { gridArea: areaName })
    } else {
      // 否则使用 span
      this.setChildGridConfig(child, { span, rowSpan })
    }
    return this
  }

  /**
   * 快速设置 Grid 布局（根据子组件自动生成）
   * 这是一个高效的方法，可以分析所有子组件的配置并自动生成最优的 Grid 布局
   * 
   * 根据子组件的根式（grid-area、grid-column、grid-row 配置）智能生成布局：
   * 1. 如果子组件使用了 gridArea，会自动生成 grid-template-areas
   * 2. 如果子组件使用了 span，会自动计算需要的列数和行数
   * 3. 如果子组件使用了明确的 gridColumn/gridRow，会自动计算网格大小
   */
  autoLayout(): this {
    // 分析所有子组件的配置
    const areas = new Set<string>()
    let maxColumn = 0
    let maxRow = 0
    
    this.childGridConfigs.forEach((config, child) => {
      // 如果使用 gridArea，收集区域名称
      if (config.gridArea && typeof config.gridArea === 'string') {
        // gridArea 可能是区域名称或坐标，如 "a" 或 "1 / 1 / 3 / 3"
        if (!config.gridArea.includes('/')) {
          // 区域名称
          areas.add(config.gridArea)
        } else {
          // 坐标格式：解析并计算最大行列
          const coords = config.gridArea.split('/').map(s => parseInt(s.trim(), 10))
          if (coords.length >= 4) {
            maxColumn = Math.max(maxColumn, coords[2]) // gridColumnEnd
            maxRow = Math.max(maxRow, coords[3]) // gridRowEnd
          }
        }
      }
      
      // 如果使用明确的 gridColumn/gridRow，计算最大行列
      if (config.gridColumnStart !== undefined || config.gridColumnEnd !== undefined) {
        const colStart = typeof config.gridColumnStart === 'number' ? config.gridColumnStart : 1
        const colEnd = typeof config.gridColumnEnd === 'number' ? config.gridColumnEnd : colStart + (config.span || 1)
        maxColumn = Math.max(maxColumn, colEnd)
      }
      
      if (config.gridRowStart !== undefined || config.gridRowEnd !== undefined) {
        const rowStart = typeof config.gridRowStart === 'number' ? config.gridRowStart : 1
        const rowEnd = typeof config.gridRowEnd === 'number' ? config.gridRowEnd : rowStart + (config.rowSpan || 1)
        maxRow = Math.max(maxRow, rowEnd)
      }
      
      // 如果使用 span，估算需要的列数
      if (config.span !== undefined) {
        // 假设子组件从某个位置开始，加上 span
        const estimatedColumn = (this._children.indexOf(child) + 1) + config.span
        maxColumn = Math.max(maxColumn, estimatedColumn)
      }
      
      if (config.rowSpan !== undefined) {
        const estimatedRow = Math.ceil((this._children.indexOf(child) + 1) / (typeof this.columns === 'number' ? this.columns : 12)) + config.rowSpan
        maxRow = Math.max(maxRow, estimatedRow)
      }
    })
    
    // 如果有区域配置，生成 templateAreas
    if (areas.size > 0) {
      // 根据区域数量智能生成布局
      // 简单的单行布局示例（可以扩展为更复杂的布局）
      const areasArray = Array.from(areas)
      
      // 如果只有一个区域，使用单行
      if (areasArray.length === 1) {
        this.setTemplateAreas(areasArray[0])
      } else {
        // 多个区域：生成多行布局
        // 这里可以根据实际需求生成更复杂的布局
        // 当前实现：每行放置所有区域（简化版）
        this.setTemplateAreas(areasArray.join(' '))
      }
    } else if (maxColumn > 0 || maxRow > 0) {
      // 如果没有区域配置但需要明确的行列，更新列数和行数
      if (maxColumn > 0 && typeof this.columns === 'number') {
        // 如果当前列数不足，自动扩展
        if (this.columns < maxColumn) {
          this.setColumns(maxColumn)
        }
      }
      
      if (maxRow > 0 && this.rows === undefined) {
        // 如果指定了最大行数，设置行数
        this.setRows(maxRow)
      }
    }
    
    return this
  }

  /**
   * 根据子组件的根式（配置）批量设置布局
   * 这是一个高效的方法，可以一次性配置多个子组件的 Grid 位置
   * 
   * @param configs 子组件配置映射，key 为子组件实例，value 为 Grid 配置
   */
  setChildrenLayout(configs: Map<BaseCommand<any, any>, GridItemConfig> | Record<string, GridItemConfig>): this {
    if (configs instanceof Map) {
      configs.forEach((config, child) => {
        this.setChildGridConfig(child, config)
      })
    } else {
      // 如果是普通对象，需要根据实例查找
      // 这里假设传入的是以某种方式标识的对象
      // 实际使用时可能需要适配
      Object.entries(configs).forEach(([key, config]) => {
        // 这里需要根据实际情况找到对应的子组件实例
        // 当前实现是一个占位符
        const child = this._children.find(c => String(c) === key)
        if (child) {
          this.setChildGridConfig(child, config)
        }
      })
    }
    
    // 自动生成布局
    this.autoLayout()
    
    return this
  }
}

export default NhaiGridCommand

