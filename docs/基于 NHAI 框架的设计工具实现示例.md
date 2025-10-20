# 基于 NHAI 框架的设计工具实现示例

## 🎯 设计工具核心架构

### 1. 渲染引擎集成

```typescript
// src/rendering/Canvas2DRenderer.ts
export class Canvas2DRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private scale: number = 1
  private offsetX: number = 0
  private offsetY: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.setupEventListeners()
  }

  // 绘制墙体
  drawWall(wall: Wall): void {
    const { startPoint, endPoint, thickness } = wall
    
    this.ctx.save()
    this.ctx.strokeStyle = '#333'
    this.ctx.lineWidth = thickness * this.scale
    this.ctx.lineCap = 'round'
    
    this.ctx.beginPath()
    this.ctx.moveTo(
      startPoint.x * this.scale + this.offsetX,
      startPoint.y * this.scale + this.offsetY
    )
    this.ctx.lineTo(
      endPoint.x * this.scale + this.offsetX,
      endPoint.y * this.scale + this.offsetY
    )
    this.ctx.stroke()
    this.ctx.restore()
  }

  // 绘制房间
  drawRoom(room: Room): void {
    const { points, fillColor, strokeColor } = room
    
    this.ctx.save()
    this.ctx.fillStyle = fillColor || '#f0f0f0'
    this.ctx.strokeStyle = strokeColor || '#333'
    this.ctx.lineWidth = 2
    
    this.ctx.beginPath()
    points.forEach((point, index) => {
      const x = point.x * this.scale + this.offsetX
      const y = point.y * this.scale + this.offsetY
      
      if (index === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    })
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }

  // 缩放和平移
  zoom(factor: number): void {
    this.scale *= factor
    this.redraw()
  }

  pan(deltaX: number, deltaY: number): void {
    this.offsetX += deltaX
    this.offsetY += deltaY
    this.redraw()
  }

  private setupEventListeners(): void {
    // 鼠标滚轮缩放
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      this.zoom(factor)
    })

    // 鼠标拖拽平移
    let isDragging = false
    let lastX = 0
    let lastY = 0

    this.canvas.addEventListener('mousedown', (e) => {
      isDragging = true
      lastX = e.clientX
      lastY = e.clientY
    })

    this.canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastX
        const deltaY = e.clientY - lastY
        this.pan(deltaX, deltaY)
        lastX = e.clientX
        lastY = e.clientY
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      isDragging = false
    })
  }

  private redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 重新绘制所有对象
    this.drawAll()
  }

  private drawAll(): void {
    // 实现绘制所有设计对象的逻辑
  }
}
```

### 2. 设计对象系统

```typescript
// src/objects/DesignObjects.ts
export interface Point2D {
  x: number
  y: number
}

export interface Point3D extends Point2D {
  z: number
}

export class Wall {
  public startPoint: Point2D
  public endPoint: Point2D
  public thickness: number
  public height: number
  public material: Material

  constructor(startPoint: Point2D, endPoint: Point2D, thickness: number = 10) {
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.thickness = thickness
    this.height = 2800 // 默认 2.8m
    this.material = new Material('wall_default')
  }

  getLength(): number {
    const dx = this.endPoint.x - this.startPoint.x
    const dy = this.endPoint.y - this.startPoint.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  getAngle(): number {
    const dx = this.endPoint.x - this.startPoint.x
    const dy = this.endPoint.y - this.startPoint.y
    return Math.atan2(dy, dx) * 180 / Math.PI
  }
}

export class Door {
  public position: Point2D
  public width: number
  public height: number
  public type: 'single' | 'double' | 'sliding'
  public swingDirection: 'left' | 'right'
  public wall: Wall | null = null

  constructor(position: Point2D, width: number = 800, height: number = 2100) {
    this.position = position
    this.width = width
    this.height = height
    this.type = 'single'
    this.swingDirection = 'left'
  }
}

export class Window {
  public position: Point2D
  public width: number
  public height: number
  public type: 'casement' | 'sliding' | 'fixed'
  public wall: Wall | null = null

  constructor(position: Point2D, width: number = 1200, height: number = 1500) {
    this.position = position
    this.width = width
    this.height = height
    this.type = 'casement'
  }
}

export class Room {
  public points: Point2D[]
  public fillColor: string
  public strokeColor: string
  public walls: Wall[] = []
  public doors: Door[] = []
  public windows: Window[] = []
  public furniture: Furniture[] = []

  constructor(points: Point2D[], fillColor: string = '#f0f0f0') {
    this.points = points
    this.fillColor = fillColor
    this.strokeColor = '#333'
  }

  calculateArea(): number {
    // 使用鞋带公式计算多边形面积
    let area = 0
    for (let i = 0; i < this.points.length; i++) {
      const j = (i + 1) % this.points.length
      area += this.points[i].x * this.points[j].y
      area -= this.points[j].x * this.points[i].y
    }
    return Math.abs(area) / 2
  }

  calculatePerimeter(): number {
    let perimeter = 0
    for (let i = 0; i < this.points.length; i++) {
      const j = (i + 1) % this.points.length
      const dx = this.points[j].x - this.points[i].x
      const dy = this.points[j].y - this.points[i].y
      perimeter += Math.sqrt(dx * dx + dy * dy)
    }
    return perimeter
  }
}

export class Furniture {
  public position: Point3D
  public rotation: number
  public scale: Point3D
  public model: Model3D
  public material: Material

  constructor(position: Point3D, model: Model3D) {
    this.position = position
    this.rotation = 0
    this.scale = { x: 1, y: 1, z: 1 }
    this.model = model
    this.material = new Material('furniture_default')
  }
}

export class Material {
  public id: string
  public name: string
  public texture: string
  public color: string
  public properties: Record<string, any>

  constructor(id: string, name: string = '', color: string = '#ffffff') {
    this.id = id
    this.name = name || id
    this.texture = ''
    this.color = color
    this.properties = {}
  }
}
```

### 3. 交互管理器

```typescript
// src/interaction/InteractionManager.ts
export class InteractionManager {
  private canvas: HTMLCanvasElement
  private renderer: Canvas2DRenderer
  private selectedObjects: Set<DesignObject> = new Set()
  private dragState: DragState | null = null

  constructor(canvas: HTMLCanvasElement, renderer: Canvas2DRenderer) {
    this.canvas = canvas
    this.renderer = renderer
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // 鼠标点击选择
    this.canvas.addEventListener('click', (e) => {
      const point = this.getCanvasPoint(e)
      const object = this.findObjectAtPoint(point)
      
      if (object) {
        if (e.ctrlKey) {
          this.toggleSelection(object)
        } else {
          this.selectObject(object)
        }
      } else {
        this.clearSelection()
      }
    })

    // 鼠标拖拽
    this.canvas.addEventListener('mousedown', (e) => {
      const point = this.getCanvasPoint(e)
      const object = this.findObjectAtPoint(point)
      
      if (object && this.selectedObjects.has(object)) {
        this.startDrag(object, point)
      }
    })

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.dragState) {
        const point = this.getCanvasPoint(e)
        this.updateDrag(point)
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      if (this.dragState) {
        this.endDrag()
      }
    })
  }

  private getCanvasPoint(e: MouseEvent): Point2D {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  private findObjectAtPoint(point: Point2D): DesignObject | null {
    // 实现点选逻辑
    // 返回在指定点下的设计对象
    return null
  }

  private selectObject(object: DesignObject): void {
    this.clearSelection()
    this.selectedObjects.add(object)
    this.renderer.highlightObject(object)
  }

  private toggleSelection(object: DesignObject): void {
    if (this.selectedObjects.has(object)) {
      this.selectedObjects.delete(object)
      this.renderer.unhighlightObject(object)
    } else {
      this.selectedObjects.add(object)
      this.renderer.highlightObject(object)
    }
  }

  private clearSelection(): void {
    this.selectedObjects.forEach(obj => {
      this.renderer.unhighlightObject(obj)
    })
    this.selectedObjects.clear()
  }

  private startDrag(object: DesignObject, point: Point2D): void {
    this.dragState = {
      object,
      startPoint: point,
      lastPoint: point
    }
  }

  private updateDrag(point: Point2D): void {
    if (!this.dragState) return

    const deltaX = point.x - this.dragState.lastPoint.x
    const deltaY = point.y - this.dragState.lastPoint.y

    this.dragState.object.move(deltaX, deltaY)
    this.dragState.lastPoint = point
    this.renderer.redraw()
  }

  private endDrag(): void {
    this.dragState = null
  }
}

interface DragState {
  object: DesignObject
  startPoint: Point2D
  lastPoint: Point2D
}

interface DesignObject {
  move(deltaX: number, deltaY: number): void
}
```

### 4. 工具栏组件

```typescript
// src/components/DesignToolbar.ts
export class DesignToolbar extends NHAIWidget {
  private tools: Map<string, DesignTool> = new Map()
  private activeTool: string | null = null

  constructor(parent?: NHAIObject) {
    super(parent)
    this.initializeTools()
    this.setupUI()
  }

  private initializeTools(): void {
    this.tools.set('select', new SelectTool())
    this.tools.set('wall', new WallTool())
    this.tools.set('door', new DoorTool())
    this.tools.set('window', new WindowTool())
    this.tools.set('furniture', new FurnitureTool())
    this.tools.set('room', new RoomTool())
  }

  private setupUI(): void {
    const toolbar = NHAIObjectFactory.createHBoxLayout(this)
    toolbar.setSpacing(8)

    // 选择工具
    const selectBtn = NHAIObjectFactory.createTextButton('选择', toolbar)
    selectBtn.onClick(() => this.activateTool('select'))

    // 墙体工具
    const wallBtn = NHAIObjectFactory.createTextButton('墙体', toolbar)
    wallBtn.onClick(() => this.activateTool('wall'))

    // 门工具
    const doorBtn = NHAIObjectFactory.createTextButton('门', toolbar)
    doorBtn.onClick(() => this.activateTool('door'))

    // 窗工具
    const windowBtn = NHAIObjectFactory.createTextButton('窗', toolbar)
    windowBtn.onClick(() => this.activateTool('window'))

    // 家具工具
    const furnitureBtn = NHAIObjectFactory.createTextButton('家具', toolbar)
    furnitureBtn.onClick(() => this.activateTool('furniture'))

    // 房间工具
    const roomBtn = NHAIObjectFactory.createTextButton('房间', toolbar)
    roomBtn.onClick(() => this.activateTool('room'))
  }

  private activateTool(toolName: string): void {
    if (this.activeTool) {
      this.tools.get(this.activeTool)?.deactivate()
    }

    this.activeTool = toolName
    this.tools.get(toolName)?.activate()
  }
}

// 工具基类
abstract class DesignTool {
  abstract activate(): void
  abstract deactivate(): void
  abstract onMouseDown(point: Point2D): void
  abstract onMouseMove(point: Point2D): void
  abstract onMouseUp(point: Point2D): void
}

// 墙体绘制工具
class WallTool extends DesignTool {
  private isDrawing: boolean = false
  private startPoint: Point2D | null = null
  private currentWall: Wall | null = null

  activate(): void {
    console.log('墙体工具已激活')
  }

  deactivate(): void {
    console.log('墙体工具已停用')
  }

  onMouseDown(point: Point2D): void {
    if (!this.isDrawing) {
      this.startPoint = point
      this.isDrawing = true
    }
  }

  onMouseMove(point: Point2D): void {
    if (this.isDrawing && this.startPoint) {
      // 创建临时墙体预览
      this.currentWall = new Wall(this.startPoint, point)
      // 更新渲染
    }
  }

  onMouseUp(point: Point2D): void {
    if (this.isDrawing && this.startPoint) {
      // 完成墙体绘制
      const wall = new Wall(this.startPoint, point)
      // 添加到设计场景
      this.addWallToScene(wall)
      
      this.isDrawing = false
      this.startPoint = null
      this.currentWall = null
    }
  }

  private addWallToScene(wall: Wall): void {
    // 实现添加墙体到场景的逻辑
  }
}
```

### 5. 主应用集成

```typescript
// src/DesignApp.ts
export class DesignApp {
  private canvas: HTMLCanvasElement
  private renderer: Canvas2DRenderer
  private interactionManager: InteractionManager
  private toolbar: DesignToolbar
  private scene: DesignScene

  constructor(container: HTMLElement) {
    this.setupCanvas(container)
    this.renderer = new Canvas2DRenderer(this.canvas)
    this.interactionManager = new InteractionManager(this.canvas, this.renderer)
    this.scene = new DesignScene()
    this.setupUI(container)
  }

  private setupCanvas(container: HTMLElement): void {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 800
    this.canvas.height = 600
    this.canvas.style.border = '1px solid #ccc'
    container.appendChild(this.canvas)
  }

  private setupUI(container: HTMLElement): void {
    // 创建主布局
    const mainLayout = NHAIObjectFactory.createVBoxLayout()
    
    // 添加工具栏
    this.toolbar = new DesignToolbar(mainLayout)
    
    // 添加画布容器
    const canvasContainer = NHAIObjectFactory.createContainer(mainLayout)
    canvasContainer.appendChild(this.canvas)
    
    // 渲染 UI
    const uiElement = mainLayout.render()
    container.appendChild(uiElement)
  }

  // 添加墙体
  addWall(startPoint: Point2D, endPoint: Point2D): void {
    const wall = new Wall(startPoint, endPoint)
    this.scene.addWall(wall)
    this.renderer.drawWall(wall)
  }

  // 添加房间
  addRoom(points: Point2D[]): void {
    const room = new Room(points)
    this.scene.addRoom(room)
    this.renderer.drawRoom(room)
  }

  // 保存项目
  saveProject(): void {
    const projectData = this.scene.export()
    localStorage.setItem('design_project', JSON.stringify(projectData))
  }

  // 加载项目
  loadProject(): void {
    const projectData = localStorage.getItem('design_project')
    if (projectData) {
      this.scene.import(JSON.parse(projectData))
      this.renderer.redraw()
    }
  }
}

// 设计场景管理
class DesignScene {
  private walls: Wall[] = []
  private rooms: Room[] = []
  private doors: Door[] = []
  private windows: Window[] = []
  private furniture: Furniture[] = []

  addWall(wall: Wall): void {
    this.walls.push(wall)
  }

  addRoom(room: Room): void {
    this.rooms.push(room)
  }

  export(): any {
    return {
      walls: this.walls,
      rooms: this.rooms,
      doors: this.doors,
      windows: this.windows,
      furniture: this.furniture
    }
  }

  import(data: any): void {
    this.walls = data.walls || []
    this.rooms = data.rooms || []
    this.doors = data.doors || []
    this.windows = data.windows || []
    this.furniture = data.furniture || []
  }
}
```

## 🚀 使用示例

```typescript
// main.ts
import { DesignApp } from './src/DesignApp'

// 初始化设计工具
const container = document.getElementById('app')!
const designApp = new DesignApp(container)

// 添加一些示例墙体
designApp.addWall({ x: 100, y: 100 }, { x: 300, y: 100 })
designApp.addWall({ x: 300, y: 100 }, { x: 300, y: 200 })
designApp.addWall({ x: 300, y: 200 }, { x: 100, y: 200 })
designApp.addWall({ x: 100, y: 200 }, { x: 100, y: 100 })

// 添加房间
designApp.addRoom([
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 300, y: 200 },
  { x: 100, y: 200 }
])

// 保存项目
designApp.saveProject()
```

## 📝 总结

这个实现示例展示了如何基于当前 NHAI 框架构建设计工具的核心功能：

1. **渲染引擎**: Canvas 2D 渲染器，支持缩放、平移
2. **设计对象**: 墙体、门窗、房间、家具等核心对象
3. **交互系统**: 选择、拖拽、工具切换
4. **工具栏**: 基于 NHAI 组件的工具界面
5. **场景管理**: 设计对象的存储和管理

这为构建完整的酷家乐式设计工具提供了坚实的基础架构。
