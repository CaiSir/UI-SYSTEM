// 组件组合器核心实现
import { NHAIWidget, NHAIObject, NHAIFrameworkRegistry } from '../../../core/NHAICore'

// 类型定义
export interface ComposerConfig {
  // 基础配置
  rootPath: string
  allowedTypes: string[]
  
  // 功能配置
  enableDragDrop: boolean
  enablePropertyEdit: boolean
  enableTemplateSave: boolean
  enableMultiSelect: boolean
  
  // 显示配置
  showToolbar: boolean
  showComponentPalette: boolean
  showPropertyPanel: boolean
  
  // 画布配置
  canvasWidth: number
  canvasHeight: number
  gridSize: number
  snapToGrid: boolean
}

export interface ComponentDefinition {
  id: string
  name: string
  type: string
  category: string
  icon: string
  description: string
  defaultProps: Record<string, any>
  propSchema: PropSchema
  eventSchema: EventSchema
  styleSchema: StyleSchema
  children?: ComponentDefinition[]
}

export interface PropSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function'
    default: any
    required: boolean
    description: string
    options?: any[]
    validator?: (value: any) => boolean
  }
}

export interface EventSchema {
  [key: string]: {
    description: string
    parameters: Array<{
      name: string
      type: string
      description: string
    }>
  }
}

export interface StyleSchema {
  [key: string]: {
    type: 'string' | 'number' | 'color' | 'size' | 'position'
    default: any
    description: string
    options?: any[]
  }
}

export interface ComponentInstance {
  id: string
  definitionId: string
  definition: ComponentDefinition
  position: Position
  size: Size
  props: Record<string, any>
  styles: Record<string, any>
  children: ComponentInstance[]
  parent: ComponentInstance | null
}

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface ComponentTemplate {
  id: string
  name: string
  description: string
  components: SerializedComponent[]
  createdAt: Date
  updatedAt: Date
}

export interface SerializedComponent {
  id: string
  definitionId: string
  position: Position
  size: Size
  props: Record<string, any>
  styles: Record<string, any>
  children: SerializedComponent[]
}

export class NHAIComponentComposer extends NHAIWidget {
  private config: ComposerConfig
  private componentRegistry: ComponentRegistry
  private propertyManager: PropertyManager
  private templateManager: TemplateManager
  
  // 状态管理
  private selectedComponents: Set<string> = new Set()
  private components: Map<string, ComponentInstance> = new Map()
  
  // 拖拽状态
  private isDragging: boolean = false
  private dragComponentId: string | null = null
  private dragStartPosition: Position = { x: 0, y: 0 }
  private dragOffset: Position = { x: 0, y: 0 }
  
  // 调整大小状态
  private isResizing: boolean = false
  private resizeComponentId: string | null = null
  private resizeDirection: string | null = null
  private resizeStartPosition: Position = { x: 0, y: 0 }
  private resizeStartSize: Size = { width: 0, height: 0 }
  private resizeStartComponentPosition: Position = { x: 0, y: 0 }
  
  // 鼠标状态
  private mouseDownPosition: Position | null = null
  private mouseDownTime: number = 0
  
  constructor(config: ComposerConfig, parent?: NHAIObject) {
    super(parent)
    this.config = config
    
    // 初始化各个管理器
    this.componentRegistry = new ComponentRegistry()
    this.propertyManager = new PropertyManager(this)
    this.templateManager = new TemplateManager(this.componentRegistry)
    
    // 注册预定义组件
    this.registerPredefinedComponents()
    
    this.setupEventListeners()
  }
  
  // 注册预定义组件
  private registerPredefinedComponents(): void {
    // 按钮组件
    this.componentRegistry.registerComponent({
      id: 'button',
      name: '按钮',
      type: 'NHAIButton',
      category: '基础组件',
      icon: '🔘',
      description: '可点击的按钮组件',
      defaultProps: {
        text: '按钮',
        type: 'primary',
        size: 'medium',
        disabled: false
      },
      propSchema: {
        text: {
          type: 'string',
          default: '按钮',
          required: true,
          description: '按钮文本'
        },
        type: {
          type: 'string',
          default: 'primary',
          required: false,
          description: '按钮类型',
          options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info']
        },
        size: {
          type: 'string',
          default: 'medium',
          required: false,
          description: '按钮大小',
          options: ['small', 'medium', 'large']
        },
        disabled: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否禁用'
        }
      },
      eventSchema: {
        onClick: {
          description: '点击事件',
          parameters: [
            { name: 'event', type: 'Event', description: '点击事件对象' }
          ]
        }
      },
      styleSchema: {
        width: {
          type: 'size',
          default: 'auto',
          description: '宽度'
        },
        height: {
          type: 'size',
          default: 'auto',
          description: '高度'
        },
        backgroundColor: {
          type: 'color',
          default: '#1890ff',
          description: '背景颜色'
        },
        color: {
          type: 'color',
          default: '#fff',
          description: '文字颜色'
        }
      }
    })
    
    // 输入框组件
    this.componentRegistry.registerComponent({
      id: 'input',
      name: '输入框',
      type: 'NHAIInput',
      category: '表单组件',
      icon: '📝',
      description: '文本输入框组件',
      defaultProps: {
        placeholder: '请输入内容',
        value: '',
        disabled: false,
        readonly: false
      },
      propSchema: {
        placeholder: {
          type: 'string',
          default: '请输入内容',
          required: false,
          description: '占位符文本'
        },
        value: {
          type: 'string',
          default: '',
          required: false,
          description: '输入值'
        },
        disabled: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否禁用'
        },
        readonly: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否只读'
        }
      },
      eventSchema: {
        onChange: {
          description: '值改变事件',
          parameters: [
            { name: 'value', type: 'string', description: '新值' }
          ]
        },
        onFocus: {
          description: '获得焦点事件',
          parameters: []
        },
        onBlur: {
          description: '失去焦点事件',
          parameters: []
        }
      },
      styleSchema: {
        width: {
          type: 'size',
          default: '200px',
          description: '宽度'
        },
        height: {
          type: 'size',
          default: '32px',
          description: '高度'
        },
        borderColor: {
          type: 'color',
          default: '#d9d9d9',
          description: '边框颜色'
        },
        backgroundColor: {
          type: 'color',
          default: '#fff',
          description: '背景颜色'
        }
      }
    })
    
    // 垂直布局组件
    this.componentRegistry.registerComponent({
      id: 'vbox',
      name: '垂直布局',
      type: 'NHAIVBoxLayout',
      category: '布局组件',
      icon: '📦',
      description: '垂直排列的布局容器',
      defaultProps: {
        spacing: 8,
        alignment: 'start'
      },
      propSchema: {
        spacing: {
          type: 'number',
          default: 8,
          required: false,
          description: '子元素间距'
        },
        alignment: {
          type: 'string',
          default: 'start',
          required: false,
          description: '对齐方式',
          options: ['start', 'center', 'end', 'stretch']
        }
      },
      eventSchema: {},
      styleSchema: {
        width: {
          type: 'size',
          default: '100%',
          description: '宽度'
        },
        height: {
          type: 'size',
          default: 'auto',
          description: '高度'
        },
        backgroundColor: {
          type: 'color',
          default: 'transparent',
          description: '背景颜色'
        },
        padding: {
          type: 'size',
          default: '0px',
          description: '内边距'
        }
      },
      children: []
    })
    
    // 容器组件
    this.componentRegistry.registerComponent({
      id: 'container',
      name: '容器',
      type: 'NHAIContainer',
      category: '布局组件',
      icon: '📋',
      description: '通用容器组件',
      defaultProps: {
        title: '',
        collapsible: false,
        collapsed: false
      },
      propSchema: {
        title: {
          type: 'string',
          default: '',
          required: false,
          description: '容器标题'
        },
        collapsible: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否可折叠'
        },
        collapsed: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否折叠'
        }
      },
      eventSchema: {
        onCollapse: {
          description: '折叠状态改变事件',
          parameters: [
            { name: 'collapsed', type: 'boolean', description: '是否折叠' }
          ]
        }
      },
      styleSchema: {
        width: {
          type: 'size',
          default: '100%',
          description: '宽度'
        },
        height: {
          type: 'size',
          default: 'auto',
          description: '高度'
        },
        backgroundColor: {
          type: 'color',
          default: '#fff',
          description: '背景颜色'
        },
        borderColor: {
          type: 'color',
          default: '#d9d9d9',
          description: '边框颜色'
        }
      },
      children: []
    })

    // 文本按钮组件
    this.componentRegistry.registerComponent({
      id: 'text-button',
      name: '文本按钮',
      type: 'NHAITextButton',
      category: '基础组件',
      icon: '🔤',
      description: '文本样式的按钮',
      defaultProps: {
        text: '文本按钮',
        color: '#007bff',
        size: 'medium',
        disabled: false,
        underline: false
      },
      propSchema: {
        text: {
          type: 'string',
          default: '文本按钮',
          required: true,
          description: '按钮文本'
        },
        color: {
          type: 'string',
          default: '#007bff',
          required: false,
          description: '文字颜色'
        },
        size: {
          type: 'string',
          default: 'medium',
          required: false,
          description: '按钮大小',
          options: ['small', 'medium', 'large']
        },
        disabled: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否禁用'
        },
        underline: {
          type: 'boolean',
          default: false,
          required: false,
          description: '是否显示下划线'
        }
      },
      eventSchema: {
        onClick: {
          description: '点击事件',
          parameters: []
        }
      },
      styleSchema: {
        color: {
          type: 'color',
          default: '#007bff',
          description: '文字颜色'
        }
      },
      children: []
    })

    // 标签组件
    this.componentRegistry.registerComponent({
      id: 'label',
      name: '标签',
      type: 'NHAILabel',
      category: '基础组件',
      icon: '🏷️',
      description: '显示文本的标签组件',
      defaultProps: {
        text: '标签文本',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#333333',
        alignment: 'left'
      },
      propSchema: {
        text: {
          type: 'string',
          default: '标签文本',
          required: true,
          description: '标签文本'
        },
        fontSize: {
          type: 'number',
          default: 16,
          required: false,
          description: '字体大小'
        },
        fontWeight: {
          type: 'string',
          default: 'normal',
          required: false,
          description: '字体粗细',
          options: ['normal', 'bold', 'lighter', 'bolder']
        },
        color: {
          type: 'string',
          default: '#333333',
          required: false,
          description: '文字颜色'
        },
        alignment: {
          type: 'string',
          default: 'left',
          required: false,
          description: '对齐方式',
          options: ['left', 'center', 'right']
        }
      },
      eventSchema: {},
      styleSchema: {
        color: {
          type: 'color',
          default: '#333333',
          description: '文字颜色'
        }
      },
      children: []
    })

    // 卡片组件
    this.componentRegistry.registerComponent({
      id: 'card',
      name: '卡片',
      type: 'NHAICard',
      category: '容器组件',
      icon: '🃏',
      description: '内容容器卡片',
      defaultProps: {
        title: '卡片标题',
        subtitle: '卡片副标题',
        width: 300,
        height: 200,
        elevation: 2
      },
      propSchema: {
        title: {
          type: 'string',
          default: '卡片标题',
          required: false,
          description: '卡片标题'
        },
        subtitle: {
          type: 'string',
          default: '卡片副标题',
          required: false,
          description: '卡片副标题'
        },
        width: {
          type: 'number',
          default: 300,
          required: false,
          description: '卡片宽度'
        },
        height: {
          type: 'number',
          default: 200,
          required: false,
          description: '卡片高度'
        },
        elevation: {
          type: 'number',
          default: 2,
          required: false,
          description: '阴影级别'
        }
      },
      eventSchema: {},
      styleSchema: {
        backgroundColor: {
          type: 'color',
          default: '#ffffff',
          description: '背景颜色'
        }
      },
      children: []
    })

    // 窗口组件
    this.componentRegistry.registerComponent({
      id: 'window',
      name: '窗口',
      type: 'NHAIWindow',
      category: '容器组件',
      icon: '🪟',
      description: '窗口容器组件',
      defaultProps: {
        title: '窗口标题',
        width: 400,
        height: 300,
        resizable: true,
        draggable: true
      },
      propSchema: {
        title: {
          type: 'string',
          default: '窗口标题',
          required: false,
          description: '窗口标题'
        },
        width: {
          type: 'number',
          default: 400,
          required: false,
          description: '窗口宽度'
        },
        height: {
          type: 'number',
          default: 300,
          required: false,
          description: '窗口高度'
        },
        resizable: {
          type: 'boolean',
          default: true,
          required: false,
          description: '是否可调整大小'
        },
        draggable: {
          type: 'boolean',
          default: true,
          required: false,
          description: '是否可拖拽'
        }
      },
      eventSchema: {},
      styleSchema: {
        backgroundColor: {
          type: 'color',
          default: '#ffffff',
          description: '背景颜色'
        }
      },
      children: []
    })

    // 水平布局组件
    this.componentRegistry.registerComponent({
      id: 'hbox',
      name: '水平布局',
      type: 'NHAIHBoxLayout',
      category: '布局组件',
      icon: '↔️',
      description: '水平排列的布局容器',
      defaultProps: {
        spacing: 10,
        alignment: 'start',
        width: 300,
        height: 100
      },
      propSchema: {
        spacing: {
          type: 'number',
          default: 10,
          required: false,
          description: '子组件间距'
        },
        alignment: {
          type: 'string',
          default: 'start',
          required: false,
          description: '对齐方式',
          options: ['start', 'center', 'end', 'stretch']
        },
        width: {
          type: 'number',
          default: 300,
          required: false,
          description: '布局宽度'
        },
        height: {
          type: 'number',
          default: 100,
          required: false,
          description: '布局高度'
        }
      },
      eventSchema: {},
      styleSchema: {
        backgroundColor: {
          type: 'color',
          default: 'transparent',
          description: '背景颜色'
        }
      },
      children: []
    })

    // 网格布局组件
    this.componentRegistry.registerComponent({
      id: 'grid',
      name: '网格布局',
      type: 'NHAIGridLayout',
      category: '布局组件',
      icon: '⊞',
      description: '网格排列的布局容器',
      defaultProps: {
        columns: 2,
        rows: 2,
        spacing: 10,
        width: 300,
        height: 200
      },
      propSchema: {
        columns: {
          type: 'number',
          default: 2,
          required: false,
          description: '列数'
        },
        rows: {
          type: 'number',
          default: 2,
          required: false,
          description: '行数'
        },
        spacing: {
          type: 'number',
          default: 10,
          required: false,
          description: '网格间距'
        },
        width: {
          type: 'number',
          default: 300,
          required: false,
          description: '网格宽度'
        },
        height: {
          type: 'number',
          default: 200,
          required: false,
          description: '网格高度'
        }
      },
      eventSchema: {},
      styleSchema: {
        backgroundColor: {
          type: 'color',
          default: 'transparent',
          description: '背景颜色'
        }
      },
      children: []
    })
  }
  
  // 添加组件
  addComponent(definitionId: string, position: Position): ComponentInstance {
    console.log('尝试添加组件:', definitionId)
    console.log('可用组件:', this.componentRegistry.getComponentIds())
    
    const definition = this.componentRegistry.getComponent(definitionId)
    if (!definition) {
      console.error('组件定义未找到:', definitionId)
      console.log('所有注册的组件:', this.componentRegistry.getAllComponents().map(c => ({ id: c.id, name: c.name })))
      throw new Error(`Component definition ${definitionId} not found`)
    }
    
    const instance: ComponentInstance = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      definitionId,
      definition,
      position,
      size: { width: 100, height: 40 },
      props: { ...definition.defaultProps },
      styles: {},
      children: [],
      parent: null
    }
    
    this.components.set(instance.id, instance)
    
    // 触发组件添加事件
    this.emit('componentAdded', { component: instance })
    
    // 自动选中新添加的组件
    this.selectedComponents.clear()
    this.selectedComponents.add(instance.id)
    this.emit('selectionChanged', Array.from(this.selectedComponents))
    
    // 触发重新渲染事件
    this.emit('renderUpdate', { components: Array.from(this.components.values()) })
    
    return instance
  }
  
  // 移除组件
  removeComponent(componentId: string): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    this.components.delete(componentId)
    this.selectedComponents.delete(componentId)
    this.render()
    
    // 触发组件移除事件
    this.emit('componentRemoved', { component })
  }
  
  // 获取组件实例
  getComponent(componentId: string): ComponentInstance | undefined {
    return this.components.get(componentId)
  }
  
  // 获取所有组件实例
  getAllComponents(): ComponentInstance[] {
    return Array.from(this.components.values())
  }
  
  // 更新组件属性
  updateComponentProps(componentId: string, props: Record<string, any>): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    console.log('updateComponentProps - 更新前:', component.props)
    console.log('updateComponentProps - 新属性:', props)
    
    component.props = { ...component.props, ...props }
    
    // 同步更新组件尺寸
    if (props.width !== undefined) {
      component.size.width = props.width
      console.log('同步更新组件宽度:', props.width)
    }
    if (props.height !== undefined) {
      component.size.height = props.height
      console.log('同步更新组件高度:', props.height)
    }
    
    console.log('updateComponentProps - 更新后:', component.props)
    console.log('updateComponentProps - 组件尺寸:', component.size)
    
    this.render()
    
    // 触发属性更新事件
    this.emit('componentPropsUpdated', { component, props })
    
    // 触发重新渲染事件
    this.emit('renderUpdate', { components: Array.from(this.components.values()) })
  }
  
  // 更新组件样式
  updateComponentStyles(componentId: string, styles: Record<string, any>): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    component.styles = { ...component.styles, ...styles }
    this.render()
    
    // 触发样式更新事件
    this.emit('componentStylesUpdated', { component, styles })
    
    // 触发重新渲染事件
    this.emit('renderUpdate', { components: Array.from(this.components.values()) })
  }
  
  // 更新组件变换（缩放、旋转等）
  updateComponentTransform(componentId: string, transform: { scale?: number, rotate?: number }): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    // 更新组件的变换属性
    if (transform.scale !== undefined) {
      component.props.scale = transform.scale
    }
    if (transform.rotate !== undefined) {
      component.props.rotate = transform.rotate
    }
    
    this.render()
    
    // 触发变换更新事件
    this.emit('componentTransformUpdated', { component, transform })
    
    // 触发重新渲染事件
    this.emit('renderUpdate', { components: Array.from(this.components.values()) })
    
    console.log('组件变换已更新:', componentId, transform)
  }
  
  // 移动组件
  moveComponent(componentId: string, position: Position): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    component.position = position
    this.render()
    
    // 触发组件移动事件
    this.emit('componentMoved', { component, position })
  }
  
  // 开始拖拽移动
  private startDragMove(componentId: string, e: MouseEvent): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    // 记录初始状态
    this.mouseDownPosition = { x: e.clientX, y: e.clientY }
    this.mouseDownTime = Date.now()
    this.dragComponentId = componentId
    this.dragOffset = {
      x: e.clientX - component.position.x,
      y: e.clientY - component.position.y
    }
    
    // 添加全局事件监听器
    document.addEventListener('mousemove', this.handleDragMove)
    document.addEventListener('mouseup', this.handleDragEnd)
    
    // 选中组件
    this.selectComponent(componentId, false)
    
    console.log('准备拖拽组件:', componentId)
  }
  
  // 处理拖拽移动
  private handleDragMove = (e: MouseEvent): void => {
    if (!this.dragComponentId) return
    
    // 检查是否已经开始拖拽
    if (!this.isDragging) {
      if (!this.mouseDownPosition) return
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - this.mouseDownPosition.x, 2) + 
        Math.pow(e.clientY - this.mouseDownPosition.y, 2)
      )
      
      // 如果鼠标移动距离超过5px，开始拖拽
      if (distance > 5) {
        this.isDragging = true
        e.preventDefault()
        console.log('开始拖拽移动')
      } else {
        return // 距离不够，不开始拖拽
      }
    }
    
    const component = this.components.get(this.dragComponentId)
    if (!component) return
    
    // 计算新位置
    const newPosition = {
      x: e.clientX - this.dragOffset.x,
      y: e.clientY - this.dragOffset.y
    }
    
    // 网格对齐
    if (this.config.snapToGrid) {
      newPosition.x = Math.round(newPosition.x / this.config.gridSize) * this.config.gridSize
      newPosition.y = Math.round(newPosition.y / this.config.gridSize) * this.config.gridSize
    }
    
    // 取消边界检查 - 支持在整个画布上拖动
    // newPosition.x = Math.max(0, Math.min(newPosition.x, this.config.canvasWidth - component.size.width - 50))
    // newPosition.y = Math.max(0, Math.min(newPosition.y, this.config.canvasHeight - component.size.height))
    
    // 更新组件位置
    component.position = newPosition
    this.render()
    
    // 触发重新渲染事件，确保DOM更新
    this.emit('renderUpdate', { components: Array.from(this.components.values()) })
  }
  
  // 处理拖拽结束
  private handleDragEnd = (e: MouseEvent): void => {
    if (!this.dragComponentId) return
    
    const component = this.components.get(this.dragComponentId)
    if (component) {
      if (this.isDragging) {
        // 触发组件移动事件
        this.emit('componentMoved', { component, position: component.position })
        console.log('拖拽结束，组件位置:', component.position)
        
        // 重新触发选择改变事件，确保属性面板更新
        this.emit('selectionChanged', Array.from(this.selectedComponents))
        console.log('拖拽后重新触发选择事件:', Array.from(this.selectedComponents))
      } else {
        // 如果没有拖拽，这是一个点击事件
        console.log('组件点击事件')
      }
    }
    
    // 清理拖拽状态
    this.isDragging = false
    this.dragComponentId = null
    this.mouseDownPosition = null
    this.mouseDownTime = 0
    
    // 移除全局事件监听器
    document.removeEventListener('mousemove', this.handleDragMove)
    document.removeEventListener('mouseup', this.handleDragEnd)
  }
  
  // 调整组件大小
  resizeComponent(componentId: string, size: Size): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    component.size = size
    this.render()
    
    // 触发组件调整大小事件
    this.emit('componentResized', { component, size })
  }
  
  // 选择组件
  selectComponent(componentId: string, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.selectedComponents.clear()
    }
    
    if (this.selectedComponents.has(componentId)) {
      this.selectedComponents.delete(componentId)
    } else {
      this.selectedComponents.add(componentId)
    }
    
    this.render()
    
    // 触发选择改变事件
    this.emit('selectionChanged', Array.from(this.selectedComponents))
  }
  
  // 获取选中的组件ID列表
  getSelectedComponentIds(): string[] {
    return Array.from(this.selectedComponents)
  }
  
  // 开始调整大小
  private startResize(componentId: string, direction: string, e: MouseEvent): void {
    const component = this.components.get(componentId)
    if (!component) return
    
    this.isResizing = true
    this.resizeComponentId = componentId
    this.resizeDirection = direction
    this.resizeStartPosition = { x: e.clientX, y: e.clientY }
    this.resizeStartSize = { ...component.size }
    this.resizeStartComponentPosition = { ...component.position }
    
    // 添加全局事件监听器
    document.addEventListener('mousemove', this.handleResizeMove)
    document.addEventListener('mouseup', this.handleResizeEnd)
    
    console.log('开始调整大小:', componentId, direction)
  }
  
  // 处理调整大小移动
  private handleResizeMove = (e: MouseEvent): void => {
    if (!this.isResizing || !this.resizeComponentId || !this.resizeDirection) return
    
    const component = this.components.get(this.resizeComponentId)
    if (!component) return
    
    const deltaX = e.clientX - this.resizeStartPosition.x
    const deltaY = e.clientY - this.resizeStartPosition.y
    
    let newSize = { ...this.resizeStartSize }
    let newPosition = { ...component.position }
    
    // 根据调整方向计算新尺寸和位置
    switch (this.resizeDirection) {
      case 'nw': // 左上 - 以右下角为固定点缩放
        newSize.width = Math.max(20, this.resizeStartSize.width - deltaX)
        newSize.height = Math.max(20, this.resizeStartSize.height - deltaY)
        // 以右下角为固定点，计算新位置
        const nwRightX = this.resizeStartComponentPosition.x + this.resizeStartSize.width
        const nwBottomY = this.resizeStartComponentPosition.y + this.resizeStartSize.height
        newPosition.x = nwRightX - newSize.width
        newPosition.y = nwBottomY - newSize.height
        break
      case 'n': // 上 - 以下边为固定边
        newSize.height = Math.max(20, this.resizeStartSize.height - deltaY)
        // 保持下边位置不变
        newPosition.y = this.resizeStartComponentPosition.y + (this.resizeStartSize.height - newSize.height)
        break
      case 'ne': // 右上 - 以左下角为固定点缩放
        newSize.width = Math.max(20, this.resizeStartSize.width + deltaX)
        newSize.height = Math.max(20, this.resizeStartSize.height - deltaY)
        // 以左下角为固定点，计算新位置
        const neLeftX = this.resizeStartComponentPosition.x
        const neBottomY = this.resizeStartComponentPosition.y + this.resizeStartSize.height
        newPosition.x = neLeftX
        newPosition.y = neBottomY - newSize.height
        break
      case 'e': // 右 - 以左边为固定边
        newSize.width = Math.max(20, this.resizeStartSize.width + deltaX)
        // 位置不变
        break
      case 'se': // 右下 - 以左上角为固定点缩放
        newSize.width = Math.max(20, this.resizeStartSize.width + deltaX)
        newSize.height = Math.max(20, this.resizeStartSize.height + deltaY)
        // 以左上角为固定点，位置不变
        break
      case 's': // 下 - 以上边为固定边
        newSize.height = Math.max(20, this.resizeStartSize.height + deltaY)
        // 位置不变
        break
      case 'sw': // 左下 - 以右上角为固定点缩放
        newSize.width = Math.max(20, this.resizeStartSize.width - deltaX)
        newSize.height = Math.max(20, this.resizeStartSize.height + deltaY)
        // 以右上角为固定点，计算新位置
        const swRightX = this.resizeStartComponentPosition.x + this.resizeStartSize.width
        const swTopY = this.resizeStartComponentPosition.y
        newPosition.x = swRightX - newSize.width
        newPosition.y = swTopY
        break
      case 'w': // 左 - 以右边为固定边
        newSize.width = Math.max(20, this.resizeStartSize.width - deltaX)
        // 保持右边位置不变
        newPosition.x = this.resizeStartComponentPosition.x + (this.resizeStartSize.width - newSize.width)
        break
    }
    
    // 取消边界检查 - 支持在整个画布上调整大小
    // newPosition.x = Math.max(0, Math.min(newPosition.x, this.config.canvasWidth - newSize.width - 50))
    // newPosition.y = Math.max(0, Math.min(newPosition.y, this.config.canvasHeight - newSize.height))
    
    // 更新组件尺寸和位置
    component.size = newSize
    component.position = newPosition
    
    // 同步更新props中的尺寸
    component.props.width = newSize.width
    component.props.height = newSize.height
    
    this.render()
    
    // 触发重新渲染事件，确保DOM更新
    this.emit('renderUpdate', { components: Array.from(this.components.values()) })
  }
  
  // 处理调整大小结束
  private handleResizeEnd = (): void => {
    if (!this.isResizing || !this.resizeComponentId) return
    
    const component = this.components.get(this.resizeComponentId)
    if (component) {
      // 触发组件尺寸改变事件
      this.emit('componentResized', { component, size: component.size })
      console.log('调整大小结束，组件尺寸:', component.size)
      
      // 重新触发选择改变事件，确保属性面板更新
      this.emit('selectionChanged', Array.from(this.selectedComponents))
    }
    
    // 清理调整大小状态
    this.isResizing = false
    this.resizeComponentId = null
    this.resizeDirection = null
    this.resizeStartPosition = { x: 0, y: 0 }
    this.resizeStartSize = { width: 0, height: 0 }
    
    // 移除全局事件监听器
    document.removeEventListener('mousemove', this.handleResizeMove)
    document.removeEventListener('mouseup', this.handleResizeEnd)
  }
  
  // 保存模板
  saveTemplate(name: string, description: string = ''): ComponentTemplate {
    const components = Array.from(this.components.values())
    const template = this.templateManager.saveTemplate(name, description, components)
    
    // 触发模板保存事件
    this.emit('templateSaved', { template })
    
    return template
  }
  
  // 加载模板
  loadTemplate(templateId: string): void {
    const components = this.templateManager.loadTemplate(templateId)
    
    // 清空当前组件
    this.components.clear()
    this.selectedComponents.clear()
    
    // 加载新组件
    components.forEach(component => {
      this.components.set(component.id, component)
    })
    
    this.render()
    
    // 触发模板加载事件
    this.emit('templateLoaded', { template: this.templateManager.getCurrentTemplate(), components })
  }
  
  // 渲染组件
  render(): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }
    
    const props: any = {
      className: 'nhai-component-composer',
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        background: '#fff'
      }
    }
    
    if (this.id) props.id = this.id
    if (this.className) props.className += ` ${this.className}`
    
    const children: any[] = []
    
    // 工具栏
    if (this.config.showToolbar) {
      const toolbar = this.renderToolbar(adapter)
      children.push(toolbar)
    }
    
    // 主内容区域
    const mainArea = this.renderMainArea(adapter)
    children.push(mainArea)
    
    return adapter.createElement('div', props, children)
  }
  
  // 渲染工具栏
  private renderToolbar(adapter: any): any {
    const toolbarProps: any = {
      className: 'nhai-composer-toolbar',
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
      }
    }
    
    const children: any[] = []
    
    // 保存按钮
    const saveButton = adapter.createElement('button', {
      className: 'nhai-toolbar-button',
      style: {
        padding: '4px 8px',
        marginRight: '8px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        background: '#fff',
        cursor: 'pointer'
      },
      onClick: () => {
        const name = prompt('请输入模板名称:')
        if (name) {
          this.saveTemplate(name)
        }
      }
    }, ['💾 保存模板'])
    children.push(saveButton)
    
    // 加载按钮
    const loadButton = adapter.createElement('button', {
      className: 'nhai-toolbar-button',
      style: {
        padding: '4px 8px',
        marginRight: '8px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        background: '#fff',
        cursor: 'pointer'
      },
      onClick: () => {
        const templates = this.templateManager.getAllTemplates()
        if (templates.length === 0) {
          alert('没有可用的模板')
          return
        }
        
        const templateNames = templates.map(t => t.name)
        const selectedName = prompt(`请选择模板:\n${templateNames.join('\n')}`)
        if (selectedName && templateNames.includes(selectedName)) {
          const template = templates.find(t => t.name === selectedName)
          if (template) {
            this.loadTemplate(template.id)
          }
        }
      }
    }, ['📁 加载模板'])
    children.push(loadButton)
    
    // 清空按钮
    const clearButton = adapter.createElement('button', {
      className: 'nhai-toolbar-button',
      style: {
        padding: '4px 8px',
        marginRight: '8px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        background: '#fff',
        cursor: 'pointer'
      },
      onClick: () => {
        if (confirm('确定要清空所有组件吗？')) {
          this.components.clear()
          this.selectedComponents.clear()
          this.render()
        }
      }
    }, ['🗑️ 清空'])
    children.push(clearButton)
    
    return adapter.createElement('div', toolbarProps, children)
  }
  
  // 渲染主内容区域
  private renderMainArea(adapter: any): any {
    const mainAreaProps: any = {
      className: 'nhai-composer-main',
      style: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }
    }
    
    const children: any[] = []
    
    // 组件面板
    if (this.config.showComponentPalette) {
      const componentPalette = this.renderComponentPalette(adapter)
      children.push(componentPalette)
    }
    
    // 画布
    const canvas = this.renderCanvas(adapter)
    children.push(canvas)
    
    // 属性面板
    if (this.config.showPropertyPanel) {
      const propertyPanel = this.renderPropertyPanel(adapter)
      children.push(propertyPanel)
    }
    
    return adapter.createElement('div', mainAreaProps, children)
  }
  
  // 渲染组件面板
  private renderComponentPalette(adapter: any): any {
    const paletteProps: any = {
      className: 'nhai-component-palette',
      style: {
        width: '200px',
        borderRight: '1px solid #f0f0f0',
        background: '#fafafa',
        overflow: 'auto'
      }
    }
    
    const children: any[] = []
    
    // 获取所有分类
    const categories = this.componentRegistry.getCategories()
    
    categories.forEach(category => {
      const categoryComponents = this.componentRegistry.getComponentsByCategory(category)
      
      // 分类标题
      const categoryTitle = adapter.createElement('div', {
        style: {
          padding: '8px',
          fontWeight: 'bold',
          background: '#e6f7ff',
          borderBottom: '1px solid #d9d9d9'
        }
      }, [category])
      children.push(categoryTitle)
      
      // 分类下的组件
      categoryComponents.forEach(component => {
        const componentItem = adapter.createElement('div', {
          className: 'nhai-palette-item',
          style: {
            padding: '8px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center'
          },
          draggable: true,
          onDragStart: (e: DragEvent) => {
            console.log('开始拖拽组件:', component.id, component.name)
            e.dataTransfer!.setData('text/plain', component.id)
            e.dataTransfer!.effectAllowed = 'copy'
          }
        }, [
          adapter.createElement('span', {
            style: { marginRight: '8px', fontSize: '16px' }
          }, [component.icon]),
          adapter.createElement('span', {
            style: { fontSize: '12px' }
          }, [component.name])
        ])
        children.push(componentItem)
      })
    })
    
    return adapter.createElement('div', paletteProps, children)
  }
  
  // 渲染画布
  private renderCanvas(adapter: any): any {
    const canvasProps: any = {
      className: 'nhai-composer-canvas',
      style: {
        flex: 1,
        position: 'relative',
        background: '#fff',
        overflow: 'auto',
        backgroundImage: this.config.snapToGrid ? 
          `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)` : 
          'none',
        backgroundSize: `${this.config.gridSize}px ${this.config.gridSize}px`
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault()
        const componentId = e.dataTransfer!.getData('text/plain')
        console.log('拖拽结束，组件ID:', componentId)
        const rect = (e.target as HTMLElement).getBoundingClientRect()
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
        
        this.addComponent(componentId, position)
      },
      onDragOver: (e: DragEvent) => {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'copy'
      },
      onClick: (e: MouseEvent) => {
        // 点击空白区域取消选择
        if (e.target === e.currentTarget) {
          this.selectedComponents.clear()
          this.render()
        }
      }
    }
    
    const children: any[] = []
    
    // 渲染所有组件
    this.components.forEach(component => {
      const componentElement = this.renderComponent(adapter, component)
      children.push(componentElement)
    })
    
    return adapter.createElement('div', canvasProps, children)
  }
  
  // 创建调整大小句柄
  private createResizeHandles(adapter: any, component: ComponentInstance): any[] {
    const handles: any[] = []
    const handleSize = 8
    const halfHandle = handleSize / 2
    
    // 8个调整大小句柄的位置
    const handlePositions = [
      { position: 'nw', x: -halfHandle, y: -halfHandle, cursor: 'nw-resize' }, // 左上
      { position: 'n', x: component.size.width / 2 - halfHandle, y: -halfHandle, cursor: 'n-resize' }, // 上
      { position: 'ne', x: component.size.width - halfHandle, y: -halfHandle, cursor: 'ne-resize' }, // 右上
      { position: 'e', x: component.size.width - halfHandle, y: component.size.height / 2 - halfHandle, cursor: 'e-resize' }, // 右
      { position: 'se', x: component.size.width - halfHandle, y: component.size.height - halfHandle, cursor: 'se-resize' }, // 右下
      { position: 's', x: component.size.width / 2 - halfHandle, y: component.size.height - halfHandle, cursor: 's-resize' }, // 下
      { position: 'sw', x: -halfHandle, y: component.size.height - halfHandle, cursor: 'sw-resize' }, // 左下
      { position: 'w', x: -halfHandle, y: component.size.height / 2 - halfHandle, cursor: 'w-resize' } // 左
    ]
    
    handlePositions.forEach(({ position, x, y, cursor }) => {
      const handle = adapter.createElement('div', {
        className: `resize-handle resize-handle-${position}`,
        style: {
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: '#1890ff',
          border: '1px solid #fff',
          borderRadius: '50%',
          cursor: cursor,
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        },
        onMouseDown: (e: MouseEvent) => {
          e.stopPropagation()
          e.preventDefault()
          this.startResize(component.id, position, e)
        }
      })
      handles.push(handle)
    })
    
    return handles
  }

  // 渲染组件
  private renderComponent(adapter: any, component: ComponentInstance): any {
    const isSelected = this.selectedComponents.has(component.id)
    
    const componentProps: any = {
      className: `nhai-composer-component ${isSelected ? 'selected' : ''}`,
      style: {
        position: 'absolute',
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
        border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
        borderRadius: '4px',
        background: '#fff',
        cursor: 'move',
        // 添加变换支持
        transform: `scale(${component.props.scale || 1})`,
        transformOrigin: 'center center',
        ...component.styles
      },
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        this.selectComponent(component.id, e.ctrlKey || e.metaKey)
      },
      onDoubleClick: () => {
        // 双击编辑属性
        this.editComponentProperties(component)
      },
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        
        // 记录鼠标按下位置，用于区分拖拽和点击
        this.mouseDownPosition = { x: e.clientX, y: e.clientY }
        this.mouseDownTime = Date.now()
        this.dragComponentId = component.id
        this.dragOffset = {
          x: e.clientX - component.position.x,
          y: e.clientY - component.position.y
        }
        
        // 添加全局事件监听器
        document.addEventListener('mousemove', this.handleDragMove)
        document.addEventListener('mouseup', this.handleDragEnd)
        
        // 选中组件
        this.selectComponent(component.id, false)
        
        console.log('准备拖拽组件:', component.id)
      }
    }
    
    const children: any[] = []
    
    // 如果组件被选中，添加调整大小句柄
    if (isSelected) {
      const resizeHandles = this.createResizeHandles(adapter, component)
      children.push(...resizeHandles)
    }
    
    // 根据组件类型渲染内容
    switch (component.definition.type) {
      case 'NHAIButton':
        const button = adapter.createElement('button', {
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }
        }, [component.props.text || '按钮'])
        children.push(button)
        break
        
      case 'NHAITextButton':
        console.log('渲染NHAITextButton:', component.id, component.props)
        const textButton = adapter.createElement('button', {
          style: {
            width: component.props.width ? `${component.props.width}px` : '100%',
            height: component.props.height ? `${component.props.height}px` : '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: component.props.color || '#007bff',
            fontSize: component.props.size === 'small' ? '12px' : component.props.size === 'large' ? '18px' : '14px',
            fontWeight: 'normal',
            textDecoration: component.props.underline ? 'underline' : 'none',
            opacity: component.props.disabled ? 0.5 : 1
          }
        }, [component.props.text || '文本按钮'])
        children.push(textButton)
        break
        
      case 'NHAIInput':
        const input = adapter.createElement('input', {
          type: 'text',
          placeholder: component.props.placeholder || '请输入内容',
          value: component.props.value || '',
          style: {
            width: component.props.width ? `${component.props.width}px` : '100%',
            height: component.props.height ? `${component.props.height}px` : '100%',
            border: 'none',
            background: 'transparent',
            padding: '4px'
          }
        })
        children.push(input)
        break
        
      case 'NHAIVBoxLayout':
        const vbox = adapter.createElement('div', {
          style: {
            width: component.props.width ? `${component.props.width}px` : '100%',
            height: component.props.height ? `${component.props.height}px` : '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: `${component.props.spacing || 8}px`,
            padding: '8px'
          }
        }, [])
        children.push(vbox)
        break
        
      case 'NHAIHBoxLayout':
        const hbox = adapter.createElement('div', {
          style: {
            width: component.props.width ? `${component.props.width}px` : '100%',
            height: component.props.height ? `${component.props.height}px` : '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: `${component.props.spacing || 8}px`,
            padding: '8px'
          }
        }, [])
        children.push(hbox)
        break
        
      case 'NHAIContainer':
        const container = adapter.createElement('div', {
          style: {
            width: component.props.width ? `${component.props.width}px` : '100%',
            height: component.props.height ? `${component.props.height}px` : '100%',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '8px'
          }
        }, [
          component.props.title ? 
            adapter.createElement('div', {
              style: {
                fontWeight: 'bold',
                marginBottom: '8px',
                paddingBottom: '4px',
                borderBottom: '1px solid #f0f0f0'
              }
            }, [component.props.title]) : null,
          adapter.createElement('div', {
            style: {
              flex: 1
            }
          }, [])
        ])
        children.push(container)
        break
        
      case 'NHAILabel':
        const label = adapter.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            fontSize: `${component.props.fontSize || 16}px`,
            fontWeight: component.props.fontWeight || 'normal',
            color: component.props.color || '#333333',
            textAlign: component.props.alignment || 'left',
            padding: '4px'
          }
        }, [component.props.text || '标签文本'])
        children.push(label)
        break
        
      case 'NHAICard':
        const card = adapter.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px',
            background: '#fff',
            boxShadow: `0 ${component.props.elevation || 2}px 4px rgba(0,0,0,0.1)`
          }
        }, [
          component.props.title ? 
            adapter.createElement('div', {
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#333'
              }
            }, [component.props.title]) : null,
          component.props.subtitle ? 
            adapter.createElement('div', {
              style: {
                fontSize: '14px',
                color: '#666',
                marginBottom: '8px'
              }
            }, [component.props.subtitle]) : null,
          adapter.createElement('div', {
            style: {
              flex: 1,
              color: '#666'
            }
          }, ['卡片内容'])
        ])
        children.push(card)
        break
        
      case 'NHAIWindow':
        const window = adapter.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          adapter.createElement('div', {
            style: {
              padding: '8px',
              borderBottom: '1px solid #f0f0f0',
              background: '#fafafa',
              fontWeight: 'bold',
              fontSize: '14px'
            }
          }, [component.props.title || '窗口标题']),
          adapter.createElement('div', {
            style: {
              flex: 1,
              padding: '8px'
            }
          }, ['窗口内容'])
        ])
        children.push(window)
        break
        
      case 'NHAIGridLayout':
        const grid = adapter.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${component.props.columns || 2}, 1fr)`,
            gridTemplateRows: `repeat(${component.props.rows || 2}, 1fr)`,
            gap: `${component.props.spacing || 10}px`,
            padding: '8px'
          }
        }, [])
        children.push(grid)
        break
        
      default:
        const generic = adapter.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            color: '#666'
          }
        }, [component.definition.name])
        children.push(generic)
    }
    
    return adapter.createElement('div', componentProps, children)
  }
  
  // 渲染属性面板
  private renderPropertyPanel(adapter: any): any {
    const panelProps: any = {
      className: 'nhai-property-panel',
      style: {
        width: '250px',
        borderLeft: '1px solid #f0f0f0',
        background: '#fafafa',
        overflow: 'auto'
      }
    }
    
    const children: any[] = []
    
    // 面板标题
    const title = adapter.createElement('div', {
      style: {
        padding: '8px',
        fontWeight: 'bold',
        background: '#e6f7ff',
        borderBottom: '1px solid #d9d9d9'
      }
    }, ['属性面板'])
    children.push(title)
    
    // 属性内容
    if (this.selectedComponents.size === 1) {
      const componentId = Array.from(this.selectedComponents)[0]
      const component = this.components.get(componentId)
      
      if (component) {
        const properties = this.renderComponentProperties(adapter, component)
        children.push(properties)
      }
    } else if (this.selectedComponents.size > 1) {
      const multiSelect = adapter.createElement('div', {
        style: {
          padding: '8px',
          color: '#666',
          fontSize: '12px'
        }
      }, [`已选择 ${this.selectedComponents.size} 个组件`])
      children.push(multiSelect)
    } else {
      const empty = adapter.createElement('div', {
        style: {
          padding: '8px',
          color: '#666',
          fontSize: '12px'
        }
      }, ['请选择一个组件'])
      children.push(empty)
    }
    
    return adapter.createElement('div', panelProps, children)
  }
  
  // 渲染组件属性
  private renderComponentProperties(adapter: any, component: ComponentInstance): any {
    const propertiesProps: any = {
      className: 'nhai-component-properties',
      style: {
        padding: '8px'
      }
    }
    
    const children: any[] = []
    
    // 组件名称
    const name = adapter.createElement('div', {
      style: {
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#333'
      }
    }, [component.definition.name])
    children.push(name)
    
    // 属性编辑器
    Object.entries(component.definition.propSchema).forEach(([key, schema]) => {
      const editor = this.renderPropertyEditor(adapter, key, schema, component.props[key], component)
      children.push(editor)
    })
    
    return adapter.createElement('div', propertiesProps, children)
  }
  
  // 渲染属性编辑器
  private renderPropertyEditor(adapter: any, key: string, schema: any, value: any, component: ComponentInstance): any {
    const editorProps: any = {
      className: 'nhai-property-editor',
      style: {
        marginBottom: '8px'
      }
    }
    
    const children: any[] = []
    
    // 标签
    const label = adapter.createElement('label', {
      style: {
        display: 'block',
        fontSize: '12px',
        color: '#666',
        marginBottom: '4px'
      }
    }, [schema.description || key])
    children.push(label)
    
    // 编辑器
    const editor = this.createPropertyEditor(schema.type, value)
    editor.style.cssText = `
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 12px;
    `
    
    // 绑定事件
    editor.addEventListener('change', () => {
      const newValue = this.getValueFromEditor(editor, schema.type)
      this.updateComponentProps(component.id, { [key]: newValue })
    })
    
    children.push(editor)
    
    return adapter.createElement('div', editorProps, children)
  }
  
  // 创建属性编辑器
  private createPropertyEditor(type: string, value: any): HTMLElement {
    switch (type) {
      case 'string':
        const input = document.createElement('input')
        input.type = 'text'
        input.value = value || ''
        return input
        
      case 'number':
        const numberInput = document.createElement('input')
        numberInput.type = 'number'
        numberInput.value = value || 0
        return numberInput
        
      case 'boolean':
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = value || false
        return checkbox
        
      case 'object':
        const textarea = document.createElement('textarea')
        textarea.value = JSON.stringify(value || {}, null, 2)
        textarea.style.height = '60px'
        return textarea
        
      case 'array':
        const arrayTextarea = document.createElement('textarea')
        arrayTextarea.value = JSON.stringify(value || [], null, 2)
        arrayTextarea.style.height = '60px'
        return arrayTextarea
        
      default:
        const defaultInput = document.createElement('input')
        defaultInput.type = 'text'
        defaultInput.value = value || ''
        return defaultInput
    }
  }
  
  // 从编辑器获取值
  private getValueFromEditor(editor: HTMLElement, type: string): any {
    switch (type) {
      case 'string':
        return (editor as HTMLInputElement).value
      case 'number':
        return parseFloat((editor as HTMLInputElement).value) || 0
      case 'boolean':
        return (editor as HTMLInputElement).checked
      case 'object':
        try {
          return JSON.parse((editor as HTMLTextAreaElement).value)
        } catch {
          return {}
        }
      case 'array':
        try {
          return JSON.parse((editor as HTMLTextAreaElement).value)
        } catch {
          return []
        }
      default:
        return (editor as HTMLInputElement).value
    }
  }
  
  // 编辑组件属性
  private editComponentProperties(component: ComponentInstance): void {
    // 这里可以实现更复杂的属性编辑对话框
    const newText = prompt('请输入新的文本:', component.props.text || '')
    if (newText !== null) {
      this.updateComponentProps(component.id, { text: newText })
    }
  }
  
  // 设置事件监听器
  private setupEventListeners(): void {
    // 监听选择改变事件
    this.addEventListener('selectionChanged', (selectedComponents: string[]) => {
      this.propertyManager.setSelectedComponents(selectedComponents.map(id => this.components.get(id)!).filter(Boolean))
    })
  }
}

// 组件注册表
export class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map()
  private categories: Map<string, string[]> = new Map()
  
  registerComponent(definition: ComponentDefinition): void {
    this.components.set(definition.id, definition)
    
    if (!this.categories.has(definition.category)) {
      this.categories.set(definition.category, [])
    }
    this.categories.get(definition.category)!.push(definition.id)
  }
  
  getComponent(id: string): ComponentDefinition | undefined {
    return this.components.get(id)
  }
  
  getComponentsByCategory(category: string): ComponentDefinition[] {
    const componentIds = this.categories.get(category) || []
    return componentIds.map(id => this.components.get(id)!).filter(Boolean)
  }
  
  getCategories(): string[] {
    return Array.from(this.categories.keys())
  }
  
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }
  
  getComponentIds(): string[] {
    return Array.from(this.components.keys())
  }
}

// 属性管理器
export class PropertyManager {
  private composer: NHAIComponentComposer
  
  constructor(composer: NHAIComponentComposer) {
    this.composer = composer
  }
  
  setSelectedComponents(components: ComponentInstance[]): void {
    // 属性管理相关的方法
  }
}

// 模板管理器
export class TemplateManager {
  private templates: Map<string, ComponentTemplate> = new Map()
  private componentRegistry: ComponentRegistry
  private currentTemplate: ComponentTemplate | null = null
  
  constructor(componentRegistry: ComponentRegistry) {
    this.componentRegistry = componentRegistry
  }
  
  saveTemplate(name: string, description: string, components: ComponentInstance[]): ComponentTemplate {
    const template: ComponentTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      components: this.serializeComponents(components),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.templates.set(template.id, template)
    return template
  }
  
  loadTemplate(templateId: string): ComponentInstance[] {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }
    
    this.currentTemplate = template
    return this.deserializeComponents(template.components)
  }
  
  getAllTemplates(): ComponentTemplate[] {
    return Array.from(this.templates.values())
  }
  
  getCurrentTemplate(): ComponentTemplate | null {
    return this.currentTemplate
  }
  
  private serializeComponents(components: ComponentInstance[]): SerializedComponent[] {
    return components.map(component => ({
      id: component.id,
      definitionId: component.definitionId,
      position: component.position,
      size: component.size,
      props: component.props,
      styles: component.styles,
      children: this.serializeComponents(component.children)
    }))
  }
  
  private deserializeComponents(serialized: SerializedComponent[]): ComponentInstance[] {
    return serialized.map(serializedComponent => {
      const definition = this.componentRegistry.getComponent(serializedComponent.definitionId)
      if (!definition) {
        throw new Error(`Component definition ${serializedComponent.definitionId} not found`)
      }
      
      return {
        id: serializedComponent.id,
        definitionId: serializedComponent.definitionId,
        definition,
        position: serializedComponent.position,
        size: serializedComponent.size,
        props: serializedComponent.props,
        styles: serializedComponent.styles,
        children: this.deserializeComponents(serializedComponent.children),
        parent: null
      }
    })
  }
}

