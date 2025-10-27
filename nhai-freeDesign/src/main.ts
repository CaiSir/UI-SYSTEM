import { CanvasMode, MaterialButton, MaterialCanvas, MaterialDirectorySidebar, MaterialInput, MaterialMenuBar, MaterialSelect, MaterialSwitch, MenuItemType, NHAIFrameworkRegistry, NHAIObject, NHAIObjectFactory, VanillaAdapter } from 'nhai-framework'

// 初始化应用
class FreeDesignApp {
  constructor() {
    this.init()
  }

  private menuBar: MaterialMenuBar | null = null
  private directory: MaterialDirectorySidebar | null = null
  private vbox: NHAIObject | null = null
  private canvas3D: MaterialCanvas | null = null
  
  private init(): void {
    // 注册并设置 Vanilla 适配器
    const adapter = new VanillaAdapter()
    NHAIFrameworkRegistry.register(adapter)
    NHAIFrameworkRegistry.use('vanilla')
    
    // 创建组件
    this.directory = this.createDirectorySidebar()
    this.menuBar = this.createMaterialMenuBar()
    this.canvas3D = this.create3DCanvas()
    this.vbox = this.createVBoxLayout()
    this.renderLayout()
    
    // 设置重新渲染回调
    ;(window as any).rerenderDirectorySidebar = () => {
      this.vbox = this.createVBoxLayout()
      this.renderLayout()
    }
  }
  
  private createVBoxLayout(): NHAIObject {
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(0)
    vbox.addWidget(this.menuBar!)
    vbox.addWidget(this.createHBoxLayout())
    return vbox
  }

  private createHBoxLayout(): NHAIObject {
    const hbox = NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(0)
    hbox.addWidget(this.directory!)
    hbox.addWidget(this.canvas3D!)
    return hbox
  }
  private renderLayout(): void {
    const appContainer = document.getElementById('app')
    if (!appContainer || !this.vbox) return

    appContainer.innerHTML = ''
    const element = this.vbox.render()
    appContainer.appendChild(element)
  }

  private createMaterialMenuBar(): MaterialMenuBar {
    const menuBar = new MaterialMenuBar()
    const saveButton = new MaterialButton('保存')
    const searchInput = new MaterialInput()
    searchInput.setPlaceholder('搜索...')
    const enableSwitch = new MaterialSwitch()
    enableSwitch.setChecked(true)
    const colorSelect = new MaterialSelect()
    colorSelect.setOptions([
      { label: '红色', value: 'red' },
      { label: '蓝色', value: 'blue' }
    ])
    colorSelect.setPlaceholder('选择颜色')

    menuBar
      .addItem({ id: 'home', type: MenuItemType.ITEM, label: '首页' })
      .addItem({ id: 'file', type: MenuItemType.SUBMENU, label: '文件', children: [
        { id: 'new', type: MenuItemType.ITEM, label: '新建' },
        { id: 'open', type: MenuItemType.ITEM, label: '打开' },
        { id: 'save', type: MenuItemType.ITEM, label: '保存' }
      ] })
      .addItem({ id: 'edit', type: MenuItemType.SUBMENU, label: '编辑', children: [
        { id: 'undo', type: MenuItemType.ITEM, label: '撤销' },
        { id: 'redo', type: MenuItemType.ITEM, label: '重做' }
      ] })
      .addItem({ id: 'view', type: MenuItemType.SUBMENU, label: '视图', children: [
        { id: 'grid', type: MenuItemType.ITEM, label: '网格' },
        { id: 'list', type: MenuItemType.ITEM, label: '列表' }
      ] })
      .addItem({ id: 'help', type: MenuItemType.SUBMENU, label: '帮助', children: [
        { id: 'about', type: MenuItemType.ITEM, label: '关于' },
        { id: 'contact', type: MenuItemType.ITEM, label: '联系我们' }
      ] })
      .addWidget('save-btn', saveButton)
      .addWidget('search-input', searchInput)
      .addWidget('enable-switch', enableSwitch)
      .addWidget('color-select', colorSelect)

    return menuBar
  }

  private create3DCanvas(): MaterialCanvas {
    const canvas3D = new MaterialCanvas()
    canvas3D.setMode(CanvasMode['3D'])
    canvas3D.setCanvasSize(1200, 800)
    canvas3D.setBackground('#f5f5f5')
    canvas3D.setShowGrid(true)
    canvas3D.setGridSize(20)
    canvas3D.setGridColor('#e0e0e0')
    return canvas3D
  }

  private createDirectorySidebar(): MaterialDirectorySidebar {
    const directorySidebar = new MaterialDirectorySidebar()
    const directoryItems = [
      { id: 'library', label: '素材库', icon: '📚', active: true },
      { id: 'product', label: '产品库', icon: '📦' },
      { id: 'component', label: '组件库', icon: '🧩' },
      { id: 'assembly', label: '装配库', icon: '🔧' },
      { id: 'mixed', label: '混合库', icon: '🎯' }
    ]
    directorySidebar.setItems(directoryItems)
    directorySidebar.setActiveKey('library')
    directorySidebar.setSidebarWidth(180)
    directorySidebar.setContentWidth(600)
    directorySidebar.setPosition('left')
    directorySidebar.setCollapsed(false)
    
    directorySidebar.setOnItemClick(() => {
      if ((window as any).rerenderTimeout) {
        clearTimeout((window as any).rerenderTimeout)
      }
      ;(window as any).rerenderTimeout = setTimeout(() => {
        this.renderLayout()
      }, 50)
    })
    
    return directorySidebar
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new FreeDesignApp()
})