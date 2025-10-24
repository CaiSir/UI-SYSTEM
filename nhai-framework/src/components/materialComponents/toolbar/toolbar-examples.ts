/**
 * Material 工具栏使用示例
 * 展示如何使用工具栏组件进行可视化设计
 */

import { MaterialToolbar, ToolbarComponentType, ToolbarConfig, ToolbarEvents } from './MaterialToolbar'
import { NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * 基础工具栏示例
 */
export function createBasicToolbarExample() {
  console.log('=== 基础工具栏示例 ===')

  // 创建工具栏
  const toolbar = new MaterialToolbar()

  // 配置工具栏
  const config: ToolbarConfig = {
    showCategories: true,
    showSearch: true,
    showPreview: true,
    allowDragDrop: true,
    allowResize: true,
    allowDelete: true,
    theme: 'light'
  }
  toolbar.setConfig(config)

  // 设置事件
  const events: ToolbarEvents = {
    onComponentAdd: (component, position) => {
      console.log('添加组件:', component.constructor.name, '位置:', position)
    },
    onComponentSelect: (component) => {
      console.log('选择组件:', component.id())
    },
    onComponentUpdate: (component, props) => {
      console.log('更新组件:', component.id(), '属性:', props)
    },
    onComponentDelete: (component) => {
      console.log('删除组件:', component.id())
    },
    onToolbarResize: (size) => {
      console.log('工具栏大小变化:', size)
    }
  }
  toolbar.setEvents(events)

  return toolbar
}

/**
 * 高级工具栏示例
 */
export function createAdvancedToolbarExample() {
  console.log('=== 高级工具栏示例 ===')

  const toolbar = new MaterialToolbar()

  // 高级配置
  const config: ToolbarConfig = {
    showCategories: true,
    showSearch: true,
    showPreview: true,
    allowDragDrop: true,
    allowResize: true,
    allowDelete: true,
    theme: 'dark'
  }
  toolbar.setConfig(config)

  // 添加自定义组件
  toolbar.addComponent({
    type: ToolbarComponentType.BUTTON,
    name: '自定义按钮',
    icon: 'add_circle',
    category: 'basic',
    description: '带有自定义属性的按钮',
    defaultProps: {
      text: '自定义按钮',
      color: 'green',
      size: 'large'
    }
  })

  // 高级事件处理
  const events: ToolbarEvents = {
    onComponentAdd: (component, position) => {
      console.log('添加组件:', component.constructor.name)
      
      // 自动设置一些属性
      if (component.constructor.name === 'MaterialButton') {
        component.setText('新按钮')
        component.setColor('blue')
      } else if (component.constructor.name === 'MaterialInput') {
        component.setLabel('输入框')
        component.setPlaceholder('请输入内容')
      }
    },
    onComponentSelect: (component) => {
      console.log('选择组件:', component.id())
      
      // 显示组件属性面板
      showComponentProperties(component)
    },
    onComponentUpdate: (component, props) => {
      console.log('更新组件属性:', props)
      
      // 保存到本地存储
      saveComponentToStorage(component)
    },
    onComponentDelete: (component) => {
      console.log('删除组件:', component.id())
      
      // 从本地存储中删除
      removeComponentFromStorage(component.id())
    }
  }
  toolbar.setEvents(events)

  return toolbar
}

/**
 * 表单设计器示例
 */
export function createFormDesignerExample() {
  console.log('=== 表单设计器示例 ===')

  const toolbar = new MaterialToolbar()

  // 表单设计器配置
  const config: ToolbarConfig = {
    showCategories: true,
    showSearch: true,
    showPreview: true,
    allowDragDrop: true,
    allowResize: false,
    allowDelete: true,
    theme: 'light'
  }
  toolbar.setConfig(config)

  // 表单专用事件
  const events: ToolbarEvents = {
    onComponentAdd: (component, position) => {
      console.log('添加表单组件:', component.constructor.name)
      
      // 为表单组件设置默认属性
      setupFormComponentDefaults(component)
    },
    onComponentSelect: (component) => {
      console.log('选择表单组件:', component.id())
      
      // 显示表单字段配置
      showFormFieldConfig(component)
    },
    onComponentUpdate: (component, props) => {
      console.log('更新表单字段:', props)
      
      // 验证表单字段
      validateFormField(component)
    },
    onComponentDelete: (component) => {
      console.log('删除表单字段:', component.id())
    }
  }
  toolbar.setEvents(events)

  return toolbar
}

/**
 * 仪表板设计器示例
 */
export function createDashboardDesignerExample() {
  console.log('=== 仪表板设计器示例 ===')

  const toolbar = new MaterialToolbar()

  // 仪表板配置
  const config: ToolbarConfig = {
    showCategories: true,
    showSearch: true,
    showPreview: true,
    allowDragDrop: true,
    allowResize: true,
    allowDelete: true,
    theme: 'dark'
  }
  toolbar.setConfig(config)

  // 仪表板事件
  const events: ToolbarEvents = {
    onComponentAdd: (component, position) => {
      console.log('添加仪表板组件:', component.constructor.name)
      
      // 设置仪表板组件样式
      setupDashboardComponentStyle(component)
    },
    onComponentSelect: (component) => {
      console.log('选择仪表板组件:', component.id())
      
      // 显示仪表板组件配置
      showDashboardComponentConfig(component)
    },
    onComponentUpdate: (component, props) => {
      console.log('更新仪表板组件:', props)
      
      // 更新仪表板布局
      updateDashboardLayout(component)
    },
    onComponentDelete: (component) => {
      console.log('删除仪表板组件:', component.id())
    },
    onToolbarResize: (size) => {
      console.log('仪表板大小变化:', size)
      
      // 响应式调整
      adjustDashboardLayout(size)
    }
  }
  toolbar.setEvents(events)

  return toolbar
}

/**
 * 工具栏集成示例
 */
export function createToolbarIntegrationExample() {
  console.log('=== 工具栏集成示例 ===')

  // 创建多个工具栏实例
  const formToolbar = createFormDesignerExample()
  const dashboardToolbar = createDashboardDesignerExample()

  // 工具栏管理器
  const toolbarManager = {
    toolbars: [formToolbar, dashboardToolbar],
    
    // 切换工具栏
    switchToolbar(index: number) {
      if (index >= 0 && index < this.toolbars.length) {
        const toolbar = this.toolbars[index]
        console.log('切换到工具栏:', index)
        return toolbar
      }
      return null
    },
    
    // 获取所有工具栏
    getAllToolbars() {
      return this.toolbars
    },
    
    // 添加工具栏
    addToolbar(toolbar: MaterialToolbar) {
      this.toolbars.push(toolbar)
    },
    
    // 移除工具栏
    removeToolbar(index: number) {
      if (index >= 0 && index < this.toolbars.length) {
        this.toolbars.splice(index, 1)
      }
    }
  }

  return toolbarManager
}

// ========== 辅助函数 ==========

/**
 * 显示组件属性面板
 */
function showComponentProperties(component: any) {
  console.log('显示组件属性面板:', component.constructor.name)
  
  // 这里可以实现属性面板的显示逻辑
  // 例如：创建属性表单、绑定事件等
}

/**
 * 设置表单组件默认属性
 */
function setupFormComponentDefaults(component: any) {
  const componentName = component.constructor.name
  
  switch (componentName) {
    case 'MaterialInput':
      component.setLabel('字段名称')
      component.setRequired(true)
      break
    case 'MaterialSelect':
      component.setLabel('选择字段')
      component.setOptions([
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' }
      ])
      break
    case 'MaterialCheckbox':
      component.setLabel('复选框')
      break
    case 'MaterialButton':
      component.setText('提交')
      component.setColor('blue')
      break
  }
}

/**
 * 显示表单字段配置
 */
function showFormFieldConfig(component: any) {
  console.log('显示表单字段配置:', component.id())
  
  // 实现表单字段配置面板
}

/**
 * 验证表单字段
 */
function validateFormField(component: any) {
  console.log('验证表单字段:', component.id())
  
  // 实现表单字段验证逻辑
}

/**
 * 设置仪表板组件样式
 */
function setupDashboardComponentStyle(component: any) {
  console.log('设置仪表板组件样式:', component.constructor.name)
  
  // 为仪表板组件设置默认样式
}

/**
 * 显示仪表板组件配置
 */
function showDashboardComponentConfig(component: any) {
  console.log('显示仪表板组件配置:', component.id())
  
  // 实现仪表板组件配置面板
}

/**
 * 更新仪表板布局
 */
function updateDashboardLayout(component: any) {
  console.log('更新仪表板布局:', component.id())
  
  // 实现仪表板布局更新逻辑
}

/**
 * 调整仪表板布局
 */
function adjustDashboardLayout(size: { width: number; height: number }) {
  console.log('调整仪表板布局:', size)
  
  // 实现响应式布局调整
}

/**
 * 保存组件到本地存储
 */
function saveComponentToStorage(component: any) {
  const componentData = {
    id: component.id(),
    type: component.constructor.name,
    props: getComponentProps(component),
    timestamp: Date.now()
  }
  
  localStorage.setItem(`component_${component.id()}`, JSON.stringify(componentData))
  console.log('保存组件到本地存储:', componentData)
}

/**
 * 从本地存储中删除组件
 */
function removeComponentFromStorage(componentId: string) {
  localStorage.removeItem(`component_${componentId}`)
  console.log('从本地存储中删除组件:', componentId)
}

/**
 * 获取组件属性
 */
function getComponentProps(component: any): Record<string, any> {
  const props: Record<string, any> = {}
  
  // 获取所有可用的属性
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(component))
  
  methods.forEach(method => {
    if (method.startsWith('get') && method !== 'getParent') {
      const propName = method.slice(3).toLowerCase()
      try {
        props[propName] = component[method]()
      } catch (error) {
        // 忽略错误
      }
    }
  })
  
  return props
}

/**
 * 演示工具栏使用
 */
export function demonstrateToolbarUsage() {
  console.log('=== 工具栏使用演示 ===')

  // 创建基础工具栏
  const basicToolbar = createBasicToolbarExample()
  console.log('基础工具栏创建完成')

  // 创建高级工具栏
  const advancedToolbar = createAdvancedToolbarExample()
  console.log('高级工具栏创建完成')

  // 创建表单设计器
  const formDesigner = createFormDesignerExample()
  console.log('表单设计器创建完成')

  // 创建仪表板设计器
  const dashboardDesigner = createDashboardDesignerExample()
  console.log('仪表板设计器创建完成')

  // 创建工具栏管理器
  const toolbarManager = createToolbarIntegrationExample()
  console.log('工具栏管理器创建完成')

  return {
    basicToolbar,
    advancedToolbar,
    formDesigner,
    dashboardDesigner,
    toolbarManager
  }
}
