import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI SplitPanel 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialSplitPanel extends NHAIWidget {
  private _orientation: 'horizontal' | 'vertical' = 'horizontal'
  private _splitPosition: number = 50 // 百分比
  private _minSize: number = 20 // 百分比
  private _maxSize: number = 80 // 百分比
  private _resizable: boolean = true
  private _disabled: boolean = false
  private _leftPanel?: NHAIObject
  private _rightPanel?: NHAIObject
  private _onResize?: (position: number) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置方向
  setOrientation(orientation: 'horizontal' | 'vertical'): void {
    this._orientation = orientation
  }

  orientation(): string {
    return this._orientation
  }

  // 设置分割位置
  setSplitPosition(position: number): void {
    this._splitPosition = Math.max(this._minSize, Math.min(this._maxSize, position))
  }

  splitPosition(): number {
    return this._splitPosition
  }

  // 设置最小大小
  setMinSize(minSize: number): void {
    this._minSize = minSize
  }

  minSize(): number {
    return this._minSize
  }

  // 设置最大大小
  setMaxSize(maxSize: number): void {
    this._maxSize = maxSize
  }

  maxSize(): number {
    return this._maxSize
  }

  // 设置可调整大小
  setResizable(resizable: boolean): void {
    this._resizable = resizable
  }

  resizable(): boolean {
    return this._resizable
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置左面板
  setLeftPanel(panel: NHAIObject): void {
    if (this._leftPanel) {
      super.removeChild(this._leftPanel)
    }
    this._leftPanel = panel
    super.addChild(panel)
  }

  leftPanel(): NHAIObject | undefined {
    return this._leftPanel
  }

  // 设置右面板
  setRightPanel(panel: NHAIObject): void {
    if (this._rightPanel) {
      super.removeChild(this._rightPanel)
    }
    this._rightPanel = panel
    super.addChild(panel)
  }

  rightPanel(): NHAIObject | undefined {
    return this._rightPanel
  }

  // 设置调整大小事件
  setOnResize(handler: (position: number) => void): void {
    this._onResize = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-split-panel mui-split-panel--${this._orientation}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        flexDirection: this._orientation === 'horizontal' ? 'row' : 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 左面板
    if (this._leftPanel) {
      const leftPanelProps: any = {
        className: 'mui-split-panel-left',
        style: {
          flex: `0 0 ${this._splitPosition}%`,
          overflow: 'auto',
          position: 'relative'
        }
      }

      const leftPanelElement = this._leftPanel.render(_context)
      leftPanelProps.children = [leftPanelElement]
      children.push(adapter.createElement('div', leftPanelProps))
    }

    // 分割线
    if (this._resizable && !this._disabled) {
      const splitterProps: any = {
        className: 'mui-split-panel-splitter',
        style: {
          width: this._orientation === 'horizontal' ? '4px' : '100%',
          height: this._orientation === 'horizontal' ? '100%' : '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          cursor: this._orientation === 'horizontal' ? 'col-resize' : 'row-resize',
          position: 'relative',
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease-in-out'
        }
      }

      // 悬停效果
      splitterProps.onMouseEnter = () => {
        splitterProps.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
      }

      splitterProps.onMouseLeave = () => {
        splitterProps.style.backgroundColor = 'rgba(0, 0, 0, 0.12)'
      }

      // 拖拽处理
      splitterProps.onMouseDown = (e: any) => {
        this.handleSplitterMouseDown(e)
      }

      // 分割线图标
      const iconProps: any = {
        style: {
          fontSize: '12px',
          color: 'rgba(0, 0, 0, 0.6)',
          pointerEvents: 'none'
        }
      }

      const icon = this._orientation === 'horizontal' ? '⋮' : '⋯'
      splitterProps.children = [adapter.createElement('span', iconProps, [icon])]

      children.push(adapter.createElement('div', splitterProps))
    }

    // 右面板
    if (this._rightPanel) {
      const rightPanelProps: any = {
        className: 'mui-split-panel-right',
        style: {
          flex: `0 0 ${100 - this._splitPosition}%`,
          overflow: 'auto',
          position: 'relative'
        }
      }

      const rightPanelElement = this._rightPanel.render(_context)
      rightPanelProps.children = [rightPanelElement]
      children.push(adapter.createElement('div', rightPanelProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private handleSplitterMouseDown(e: any): void {
    e.preventDefault()
    
    const startPosition = this._orientation === 'horizontal' ? e.clientX : e.clientY
    const containerRect = e.target.closest('.mui-split-panel').getBoundingClientRect()
    const containerSize = this._orientation === 'horizontal' ? containerRect.width : containerRect.height
    
    const handleMouseMove = (moveEvent: any) => {
      const currentPosition = this._orientation === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const delta = currentPosition - startPosition
      const percentage = (delta / containerSize) * 100
      
      const newPosition = this._splitPosition + percentage
      const clampedPosition = Math.max(this._minSize, Math.min(this._maxSize, newPosition))
      
      this._splitPosition = clampedPosition
      
      if (this._onResize) {
        this._onResize(clampedPosition)
      }
      
      // 重新渲染
      this.render()
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}
