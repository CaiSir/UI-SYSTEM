import { NHAIFrameworkRegistry, VanillaAdapter, NHAIComponentComposer } from 'nhai-framework'
import './style.css'

// 初始化应用
class FreeDesignApp {
  private composer: NHAIComponentComposer | null = null

  constructor() {
    this.init()
  }

  private init(): void {
    console.log('NHAI Free Design 正在初始化...')
    
    // 注册并设置 Vanilla 适配器
    const adapter = new VanillaAdapter()
    NHAIFrameworkRegistry.register(adapter)
    console.log('✓ Vanilla 适配器已注册')
    
    const currentAdapter = NHAIFrameworkRegistry.use('vanilla')
    console.log('✓ 当前适配器已设置:', currentAdapter.name)
    
    // 验证适配器是否正确设置
    const verifyAdapter = NHAIFrameworkRegistry.getCurrent()
    console.log('✓ 验证当前适配器:', verifyAdapter ? verifyAdapter.name : 'null')
    
    // 创建组件组合器
    this.composer = new NHAIComponentComposer({
      rootPath: '/components',
      allowedTypes: ['button', 'input', 'container', 'layout'],
      enableDragDrop: true,
      enablePropertyEdit: true,
      enableTemplateSave: true,
      enableMultiSelect: true,
      showToolbar: true,
      showComponentPalette: true,
      showPropertyPanel: true,
      canvasWidth: 800,
      canvasHeight: 600,
      gridSize: 20,
      snapToGrid: true
    })

    // 渲染到页面
    this.render()
    
    // 设置事件监听
    this.setupEventListeners()
    
    console.log('NHAI Free Design 初始化完成')
  }

  private render(): void {
    const appContainer = document.getElementById('app')
    if (!appContainer || !this.composer) return

    // 清空容器
    appContainer.innerHTML = ''
    
    // 渲染组件组合器
    const element = this.composer.render()
    appContainer.appendChild(element)
  }

  private updateCanvas(): void {
    if (!this.composer) return
    
    // 查找画布元素
    const canvas = document.querySelector('.nhai-composer-canvas')
    if (!canvas) {
      console.warn('画布元素未找到')
      return
    }

    // 清空画布
    canvas.innerHTML = ''
    
    // 渲染所有组件实例
    const components = this.composer.getAllComponents()
    console.log('正在渲染', components.length, '个组件到画布')
    
    components.forEach(component => {
      this.renderComponentToCanvas(component, canvas)
    })
  }

  private renderComponentToCanvas(component: any, canvas: HTMLElement): void {
    // 直接使用 document.createElement 创建元素
    const element = document.createElement('div')
    
    // 设置样式和属性
    element.className = 'nhai-component-instance'
    element.style.position = 'absolute'
    element.style.left = `${component.position.x}px`
    element.style.top = `${component.position.y}px`
    element.style.width = `${component.size.width}px`
    element.style.height = `${component.size.height}px`
    element.style.border = '1px solid #1890ff'
    element.style.borderRadius = '4px'
    element.style.background = '#f0f8ff'
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.style.cursor = 'pointer'
    element.style.fontSize = '12px'
    element.style.color = '#1890ff'
    
    // 设置文本内容
    element.textContent = `${component.definition.name} (${component.id.slice(-6)})`
    
    // 添加点击事件
    element.addEventListener('click', () => {
      console.log('点击了组件:', component.id)
      // 这里可以添加选择组件的逻辑
    })

    canvas.appendChild(element)
  }

  private setupEventListeners(): void {
    if (!this.composer) return

    // 监听组件添加事件
    this.composer.addEventListener('componentAdded', (data) => {
      console.log('组件已添加:', data.component)
    })

    // 监听属性更新事件
    this.composer.addEventListener('componentPropsUpdated', (data) => {
      console.log('组件属性已更新:', data.component, data.props)
    })

    // 监听模板保存事件
    this.composer.addEventListener('templateSaved', (data) => {
      console.log('模板已保存:', data.template)
      alert(`模板 "${data.template.name}" 已保存成功！`)
    })

    // 监听模板加载事件
    this.composer.addEventListener('templateLoaded', (data) => {
      console.log('模板已加载:', data.template, data.components)
      alert(`模板 "${data.template.name}" 已加载成功！`)
    })

    // 监听渲染更新事件
    this.composer.addEventListener('renderUpdate', (data) => {
      console.log('需要重新渲染:', data.components.length, '个组件')
      this.updateCanvas()
    })
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new FreeDesignApp()
})