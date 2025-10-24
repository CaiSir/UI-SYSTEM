/**
 * NHAI 动态组件系统
 * 解决 API 涉及动态组件的核心问题
 */

import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../core/NHAICore"

// 1. 动态组件注册表
export class NHAIDynamicComponentRegistry {
  private static components: Map<string, any> = new Map()
  private static factories: Map<string, () => any> = new Map()
  
  // 注册组件类
  static registerComponent(name: string, componentClass: any): void {
    this.components.set(name, componentClass)
  }
  
  // 注册组件工厂
  static registerFactory(name: string, factory: () => any): void {
    this.factories.set(name, factory)
  }
  
  // 获取组件
  static getComponent(name: string): any {
    return this.components.get(name)
  }
  
  // 创建组件实例
  static createComponent(name: string, props?: any, parent?: NHAIObject): any {
    const componentClass = this.components.get(name)
    if (componentClass) {
      return new componentClass(props, parent)
    }
    
    const factory = this.factories.get(name)
    if (factory) {
      return factory()
    }
    
    throw new Error(`Component "${name}" not found in registry`)
  }
  
  // 检查组件是否存在
  static hasComponent(name: string): boolean {
    return this.components.has(name) || this.factories.has(name)
  }
  
  // 获取所有注册的组件名称
  static getRegisteredComponents(): string[] {
    return Array.from(this.components.keys()).concat(Array.from(this.factories.keys()))
  }
}

// 2. 动态组件渲染器
export class NHAIDynamicRenderer {
  constructor() {
    // 使用静态方法，不需要实例变量
  }
  
  // 渲染动态组件
  renderDynamicComponent(
    componentName: string, 
    props: any = {}, 
    context?: NHAIRenderContext,
    parent?: NHAIObject
  ): any {
    try {
      const component = NHAIDynamicComponentRegistry.createComponent(componentName, props, parent)
      
      if (component && typeof component.render === 'function') {
        return component.render(context)
      }
      
      throw new Error(`Component "${componentName}" does not have a render method`)
    } catch (error) {
      console.error(`Failed to render dynamic component "${componentName}":`, error)
      return this.renderErrorComponent(componentName, error)
    }
  }
  
  // 渲染错误组件
  private renderErrorComponent(componentName: string, error: any): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      return {
        tag: 'div',
        props: {
          style: {
            padding: '10px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px',
            color: '#c62828',
            fontSize: '14px'
          }
        },
        children: [`Error rendering component "${componentName}": ${error.message}`]
      }
    }
    
    return adapter.createElement('div', {
      style: {
        padding: '10px',
        backgroundColor: '#ffebee',
        border: '1px solid #f44336',
        borderRadius: '4px',
        color: '#c62828',
        fontSize: '14px'
      }
    }, [`Error rendering component "${componentName}": ${error.message}`])
  }
  
  // 批量渲染动态组件
  renderDynamicComponents(
    components: Array<{
      name: string
      props?: any
      key?: string
    }>,
    context?: NHAIRenderContext,
    parent?: NHAIObject
  ): any[] {
    return components.map((comp, index) => {
      const key = comp.key || `${comp.name}-${index}`
      return {
        key,
        element: this.renderDynamicComponent(comp.name, comp.props, context, parent)
      }
    })
  }
}

// 3. 动态组件容器
export class NHAIDynamicContainer extends NHAIWidget {
  private _components: Array<{
    name: string
    props?: any
    key?: string
  }> = []
  private _renderer: NHAIDynamicRenderer
  
  constructor(parent?: NHAIObject) {
    super(parent)
    this._renderer = new NHAIDynamicRenderer()
  }
  
  // 添加动态组件
  addDynamicComponent(name: string, props?: any, key?: string): void {
    this._components.push({ name, props, key })
  }
  
  // 移除动态组件
  removeDynamicComponent(key: string): void {
    this._components = this._components.filter(comp => comp.key !== key)
  }
  
  // 更新动态组件
  updateDynamicComponent(key: string, props: any): void {
    const component = this._components.find(comp => comp.key === key)
    if (component) {
      component.props = { ...component.props, ...props }
    }
  }
  
  // 清空所有动态组件
  clearDynamicComponents(): void {
    this._components = []
  }
  
  // 设置动态组件列表
  setDynamicComponents(components: Array<{
    name: string
    props?: any
    key?: string
  }>): void {
    this._components = [...components]
  }
  
  // 获取动态组件列表
  getDynamicComponents(): Array<{
    name: string
    props?: any
    key?: string
  }> {
    return [...this._components]
  }
  
  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }
    
    const props: any = {
      className: 'nhai-dynamic-container',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle()
      }
    }
    
    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`
    
    // 渲染所有动态组件
    const children = this._renderer.renderDynamicComponents(
      this._components,
      _context,
      this
    ).map(item => item.element)
    
    return adapter.createElement('div', props, children)
  }
}

// 4. API 驱动的动态组件系统
export class NHAIAPIDrivenComponents {
  constructor() {
    // 使用静态方法，不需要实例变量
  }
  
  // 从 API 配置创建组件
  createFromAPIConfig(config: {
    type: string
    props?: any
    children?: any[]
    key?: string
  }): any {
    const { type, props = {}, children = [] } = config
    
    // 检查是否是已知组件
    if (NHAIDynamicComponentRegistry.hasComponent(type)) {
      const component = NHAIDynamicComponentRegistry.createComponent(type, props)
      
      // 如果有子组件，递归创建
      if (children && children.length > 0) {
        children.forEach(childConfig => {
          if (typeof childConfig === 'object' && childConfig.type) {
            const childComponent = this.createFromAPIConfig(childConfig)
            component.addChild(childComponent)
          }
        })
      }
      
      return component
    }
    
    // 如果是原生 HTML 元素
    if (this.isHTMLElement(type)) {
      return this.createHTMLElement(type, props, children)
    }
    
    throw new Error(`Unknown component type: ${type}`)
  }
  
  // 检查是否是 HTML 元素
  private isHTMLElement(type: string): boolean {
    const htmlElements = [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'button', 'input', 'textarea', 'select', 'option',
      'ul', 'ol', 'li', 'a', 'img', 'table', 'tr', 'td', 'th',
      'form', 'label', 'fieldset', 'legend'
    ]
    return htmlElements.includes(type.toLowerCase())
  }
  
  // 创建 HTML 元素
  private createHTMLElement(tag: string, props: any, children: any[]): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }
    
    return adapter.createElement(tag, props, children)
  }
  
  // 从 JSON 配置批量创建组件
  createFromJSONConfig(config: any): any {
    if (Array.isArray(config)) {
      return config.map(item => this.createFromAPIConfig(item))
    }
    
    return this.createFromAPIConfig(config)
  }
  
  // 动态更新组件
  updateComponent(component: any, newProps: any): void {
    if (component && typeof component.updateProps === 'function') {
      component.updateProps(newProps)
    } else if (component && typeof component.setProps === 'function') {
      component.setProps(newProps)
    }
  }
}

// 5. 组件模板系统
export class NHAIComponentTemplate {
  private templates: Map<string, any> = new Map()
  
  // 注册模板
  registerTemplate(name: string, template: any): void {
    this.templates.set(name, template)
  }
  
  // 获取模板
  getTemplate(name: string): any {
    return this.templates.get(name)
  }
  
  // 从模板创建组件
  createFromTemplate(templateName: string, data: any = {}): any {
    const template = this.getTemplate(templateName)
    if (!template) {
      throw new Error(`Template "${templateName}" not found`)
    }
    
    // 模板渲染逻辑
    return this.renderTemplate(template, data)
  }
  
  // 渲染模板
  private renderTemplate(template: any, data: any): any {
    // 简单的模板渲染实现
    if (typeof template === 'string') {
      return this.renderStringTemplate(template, data)
    }
    
    if (typeof template === 'object') {
      return this.renderObjectTemplate(template)
    }
    
    return template
  }
  
  // 渲染字符串模板
  private renderStringTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }
  
  // 渲染对象模板
  private renderObjectTemplate(template: any): any {
    const apiDriven = new NHAIAPIDrivenComponents()
    return apiDriven.createFromJSONConfig(template)
  }
}

// 6. 使用示例
export class DynamicComponentExamples {
  
  // 示例 1: 基础动态组件
  static basicExample(): void {
    // 注册组件
    NHAIDynamicComponentRegistry.registerComponent('MyButton', class MyButtonComponent {
      private props: any
      
      constructor(props: any) {
        this.props = props
      }
      
      render() {
        const adapter = NHAIFrameworkRegistry.getCurrent()
        if (!adapter) {
          throw new Error('No framework adapter registered')
        }
        return adapter.createElement('button', {
          onClick: this.props.onClick,
          style: this.props.style
        }, [this.props.children])
      }
    })
    
    // 创建动态容器
    const container = new NHAIDynamicContainer()
    
    // 添加动态组件
    container.addDynamicComponent('MyButton', {
      children: '点击我',
      onClick: () => alert('动态按钮被点击')
    }, 'btn-1')
    
    container.addDynamicComponent('MyButton', {
      children: '另一个按钮',
      onClick: () => console.log('另一个按钮')
    }, 'btn-2')
  }
  
  // 示例 2: API 驱动的组件
  static apiDrivenExample(): void {
    const apiDriven = new NHAIAPIDrivenComponents()
    
    // API 返回的配置
    const apiConfig = {
      type: 'div',
      props: { className: 'api-container' },
      children: [
        {
          type: 'h2',
          props: { style: { color: 'blue' } },
          children: ['API 驱动的标题']
        },
        {
          type: 'p',
          props: { style: { margin: '10px 0' } },
          children: ['这是从 API 配置创建的组件']
        },
        {
          type: 'button',
          props: { 
            onClick: () => alert('API 按钮'),
            style: { padding: '8px 16px' }
          },
          children: ['API 按钮']
        }
      ]
    }
    
    // 从 API 配置创建组件
    apiDriven.createFromAPIConfig(apiConfig)
  }
  
  // 示例 3: 模板系统
  static templateExample(): void {
    const template = new NHAIComponentTemplate()
    
    // 注册模板
    template.registerTemplate('userCard', {
      type: 'div',
      props: { className: 'user-card' },
      children: [
        {
          type: 'h3',
          children: ['{{name}}']
        },
        {
          type: 'p',
          children: ['{{email}}']
        },
        {
          type: 'button',
          props: { onClick: '{{onClick}}' },
          children: ['联系用户']
        }
      ]
    })
    
    // 使用模板创建组件
    const userData = {
      name: '张三',
      email: 'zhangsan@example.com',
      onClick: () => alert('联系张三')
    }
    
    // 使用模板创建组件
    template.createFromTemplate('userCard', userData)
  }
  
  // 示例 4: 动态更新
  static dynamicUpdateExample(): void {
    const container = new NHAIDynamicContainer()
    
    // 添加初始组件
    container.addDynamicComponent('MyButton', {
      children: '初始文本',
      count: 0
    }, 'dynamic-btn')
    
    // 模拟动态更新
    setInterval(() => {
      const currentComponents = container.getDynamicComponents()
      const btnComponent = currentComponents.find(comp => comp.key === 'dynamic-btn')
      
      if (btnComponent) {
        const newCount = (btnComponent.props.count || 0) + 1
        container.updateDynamicComponent('dynamic-btn', {
          children: `更新次数: ${newCount}`,
          count: newCount
        })
      }
    }, 1000)
  }
}

// 7. 高级动态组件功能
export class NHAIAdvancedDynamicComponents {
  
  // 条件渲染
  static conditionalRender(condition: boolean, trueComponent: any, falseComponent?: any): any {
    return condition ? trueComponent : (falseComponent || null)
  }
  
  // 列表渲染
  static listRender(items: any[], renderItem: (item: any, index: number) => any): any[] {
    return items.map((item, index) => renderItem(item, index))
  }
  
  // 异步组件加载
  static async loadComponent(componentName: string): Promise<any> {
    try {
      // 简化的组件加载实现，避免动态导入问题
      console.log(`Loading component: ${componentName}`)
      
      // 返回一个模拟的组件对象
      return {
        name: componentName,
        render: () => {
          const div = document.createElement('div')
          div.textContent = `Component: ${componentName}`
          div.style.cssText = 'padding: 10px; border: 1px solid #ccc; margin: 5px;'
          return div
        }
      }
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error)
      return null
    }
  }
  
  // 组件懒加载
  static createLazyComponent(loader: () => Promise<any>): any {
    let component: any = null
    let loading = false
    
    return {
      async render() {
        if (!component && !loading) {
          loading = true
          component = await loader()
          loading = false
        }
        
        if (loading) {
          return this.renderLoading()
        }
        
        if (component) {
          return component.render()
        }
        
        return this.renderError()
      },
      
      renderLoading() {
        const adapter = NHAIFrameworkRegistry.getCurrent()
        return adapter?.createElement('div', {
          style: { textAlign: 'center', padding: '20px' }
        }, ['加载中...'])
      },
      
      renderError() {
        const adapter = NHAIFrameworkRegistry.getCurrent()
        return adapter?.createElement('div', {
          style: { color: 'red', padding: '20px' }
        }, ['加载失败'])
      }
    }
  }
}

// 8. 导出主要 API
export const NHAIDynamicComponents = {
  Registry: NHAIDynamicComponentRegistry,
  Renderer: NHAIDynamicRenderer,
  Container: NHAIDynamicContainer,
  APIDriven: NHAIAPIDrivenComponents,
  Template: NHAIComponentTemplate,
  Advanced: NHAIAdvancedDynamicComponents,
  Examples: DynamicComponentExamples
}
