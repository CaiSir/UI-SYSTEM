import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Canvas渲染模式枚举
 */
export enum CanvasMode {
  '2D' = '2d',
  '3D' = 'webgl',
  'WEBGL2' = 'webgl2',
  'WEBGL_EXPERIMENTAL' = 'experimental-webgl'
}

/**
 * Canvas组件
 * 提供HTML5 Canvas元素，支持2D和3D绘图
 * 
 * @remarks
 * - 2D渲染：使用Canvas 2D API进行2D绘图
 * - 3D渲染：返回WebGL上下文，供Three.js等3D库使用
 * - 摄像机、场景、几何体等应由应用层的Three.js等库管理
 * 
 * @example
 * ```typescript
 * // 2D绘图
 * const canvas2D = new MaterialCanvas()
 * canvas2D.setMode(CanvasMode['2D'])
 * const ctx2D = canvas2D.getContext2D()
 * 
 * // 3D绘图 + Three.js集成
 * const canvas3D = new MaterialCanvas()
 * canvas3D.setMode(CanvasMode['3D'])
 * const canvasElement = canvas3D.getCanvasElement()
 * const renderer = new THREE.WebGLRenderer({ canvas: canvasElement })
 * const camera = new THREE.PerspectiveCamera(...) // Three.js管理摄像机
 * ```
 */
export class MaterialCanvas extends NHAIWidget {
  private _canvasWidth: number = 800
  private _canvasHeight: number = 600
  private _canvasElement?: HTMLCanvasElement
  private _context2D?: CanvasRenderingContext2D | null
  private _context3D?: WebGLRenderingContext | WebGL2RenderingContext | null
  private _mode: CanvasMode = CanvasMode['2D']
  private _showGrid: boolean = false
  private _gridSize: number = 20
  private _gridColor: string = '#3a3a3a'

  constructor(parent?: NHAIObject) {
    super(parent)
    // 初始化Widget的宽高
    this.setWidth('100%')
    this.setHeight('100%')
  }

  // ========== Canvas尺寸设置 ==========

  /**
   * 设置Canvas画布宽度
   */
  setCanvasWidth(width: number): void {
    this._canvasWidth = width
  }

  canvasWidth(): number {
    return this._canvasWidth
  }

  /**
   * 设置Canvas画布高度
   */
  setCanvasHeight(height: number): void {
    this._canvasHeight = height
  }

  canvasHeight(): number {
    return this._canvasHeight
  }

  /**
   * 设置Canvas尺寸
   */
  setCanvasSize(width: number, height: number): void {
    this._canvasWidth = width
    this._canvasHeight = height
  }

  // ========== Canvas渲染模式设置 ==========

  /**
   * 设置Canvas渲染模式
   */
  setMode(mode: CanvasMode): void {
    this._mode = mode
  }

  mode(): CanvasMode {
    return this._mode
  }

  /**
   * 设置是否显示网格
   */
  setShowGrid(show: boolean): void {
    this._showGrid = show
  }

  showGrid(): boolean {
    return this._showGrid
  }

  /**
   * 设置网格大小
   */
  setGridSize(size: number): void {
    this._gridSize = size
  }

  gridSize(): number {
    return this._gridSize
  }

  /**
   * 设置网格颜色
   */
  setGridColor(color: string): void {
    this._gridColor = color
  }

  gridColor(): string {
    return this._gridColor
  }

  // ========== Canvas上下文获取 ==========

  /**
   * 获取Canvas DOM元素
   */
  getCanvasElement(): HTMLCanvasElement | undefined {
    return this._canvasElement
  }

  /**
   * 获取2D绘图上下文
   */
  getContext2D(): CanvasRenderingContext2D | null | undefined {
    return this._context2D
  }

  /**
   * 获取3D绘图上下文（WebGL）
   */
  getContext3D(): WebGLRenderingContext | WebGL2RenderingContext | null | undefined {
    return this._context3D
  }

  /**
   * 清空Canvas
   */
  clear(): void {
    if (this._canvasElement) {
      if (this._context2D) {
        // 清空2D画布
        this._context2D.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height)
      } else if (this._context3D) {
        // 清空3D画布
        this._context3D.clear(this._context3D.COLOR_BUFFER_BIT | this._context3D.DEPTH_BUFFER_BIT)
      }
    }
  }

  /**
   * 设置Canvas背景色
   */
  setBackground(color: string): void {
    if (this._context2D && this._canvasElement) {
      this._context2D.fillStyle = color
      this._context2D.fillRect(0, 0, this._canvasElement.width, this._canvasElement.height)
    } else if (this._context3D && this._canvasElement) {
      // 对于WebGL，通过设置clearColor然后清空缓冲区来实现背景色
      const r = parseInt(color.slice(1, 3), 16) / 255
      const g = parseInt(color.slice(3, 5), 16) / 255
      const b = parseInt(color.slice(5, 7), 16) / 255
      this._context3D.clearColor(r, g, b, 1.0)
      this._context3D.clear(this._context3D.COLOR_BUFFER_BIT)
    }
  }

  /**
   * 在2D Canvas上绘制网格
   */
  draw2DGrid(
    gridSize: number = 20,
    color: string = '#e0e0e0',
    lineWidth: number = 1
  ): void {
    if (!this._context2D || !this._canvasElement) return

    const ctx = this._context2D
    const width = this._canvasElement.width
    const height = this._canvasElement.height

    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth

    // 绘制垂直线
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // 绘制水平线
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    ctx.restore()
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: 'mui-canvas-container',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'block',
        position: 'relative'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    // Canvas元素属性
    const canvasProps: any = {
      ref: (element: HTMLCanvasElement) => {
        if (element) {
          this._canvasElement = element
          // 根据模式获取对应的上下文
          if (this._mode === CanvasMode['2D']) {
            this._context2D = element.getContext('2d', { alpha: true })
            this._context3D = null
          } else {
            this._context3D = element.getContext(this._mode) as WebGLRenderingContext | WebGL2RenderingContext
            this._context2D = null
          }
        }
      },
      width: this._canvasWidth,
      height: this._canvasHeight,
      style: {
        backgroundColor: '#ffffff',
        display: 'block',
        width: '100%',
        height: '100%'
      }
    }

    // 添加右键菜单处理器
    const contextMenuHandler = this.getContextMenuHandler()
    if (contextMenuHandler) {
      canvasProps.onContextMenu = contextMenuHandler
    }

    const canvasElement = adapter.createElement('canvas', canvasProps, [])
    
    // 如果canvasElement是HTMLCanvasElement，立即保存引用
    if (canvasElement instanceof HTMLCanvasElement) {
      this._canvasElement = canvasElement
      // 根据模式获取对应的上下文
      if (this._mode === CanvasMode['2D']) {
        this._context2D = canvasElement.getContext('2d', { alpha: true })
        this._context3D = null
      } else {
        this._context3D = canvasElement.getContext(this._mode) as WebGLRenderingContext | WebGL2RenderingContext
        this._context2D = null
      }

      // 如果启用网格，添加网格背景
      if (this._showGrid) {
        this.addGridBackground(canvasElement)
      }
    }

    return adapter.createElement('div', containerProps, [canvasElement])
  }

  /**
   * 为Canvas添加网格背景
   */
  private addGridBackground(canvasElement: HTMLCanvasElement): void {
    if (!canvasElement) return

    // 创建一个小的2D canvas来绘制网格模式
    const gridCanvas = document.createElement('canvas')
    gridCanvas.width = this._gridSize * 10 // 10倍网格大小的背景
    gridCanvas.height = this._gridSize * 10
    const gridCtx = gridCanvas.getContext('2d')
    
    if (gridCtx) {
      // 绘制网格
      gridCtx.strokeStyle = this._gridColor
      gridCtx.lineWidth = 1
      
      // 垂直线
      for (let x = 0; x <= gridCanvas.width; x += this._gridSize) {
        gridCtx.beginPath()
        gridCtx.moveTo(x, 0)
        gridCtx.lineTo(x, gridCanvas.height)
        gridCtx.stroke()
      }
      
      // 水平线
      for (let y = 0; y <= gridCanvas.height; y += this._gridSize) {
        gridCtx.beginPath()
        gridCtx.moveTo(0, y)
        gridCtx.lineTo(gridCanvas.width, y)
        gridCtx.stroke()
      }
      
      // 将网格canvas的图像作为背景
      canvasElement.style.backgroundImage = `url(${gridCanvas.toDataURL()})`
      canvasElement.style.backgroundRepeat = 'repeat'
    }
  }
}

