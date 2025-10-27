import { MaterialButton, MaterialDirectorySidebar, MaterialInput, MaterialMenuBar, MaterialSelect, MaterialSwitch, MenuItemType, NHAIFrameworkRegistry, VanillaAdapter } from 'nhai-framework'

// 初始化应用
class FreeDesignApp {
  constructor() {
    this.init()
  }

  private menuBar: MaterialMenuBar | null = null
  private directory: MaterialDirectorySidebar | null = null
  
  private init(): void {
    console.log('NHAI Free Design 正在初始化...')

    // 注册并设置 Vanilla 适配器
    const adapter = new VanillaAdapter()
    NHAIFrameworkRegistry.register(adapter)
    console.log('✓ Vanilla 适配器已注册')
    const currentAdapter = NHAIFrameworkRegistry.use('vanilla')
    console.log('✓ 当前适配器已设置:', currentAdapter.name)
    
    // 设置适配器后才创建组件
    this.directory = this.createDirectorySidebar()
    this.menuBar = this.createMaterialMenuBar()
    
    this.renderLayout()
    
    // 设置重新渲染回调
    ;(window as any).rerenderDirectorySidebar = () => {
      this.renderLayout()
    }

    console.log('NHAI Free Design 初始化完成')
  }
  
  private renderLayout(): void {
    const appContainer = document.getElementById('app')
    if (!appContainer || !this.menuBar || !this.directory) return

    // 清空容器
    appContainer.innerHTML = ''
    
    // 创建容器样式
    const container = document.createElement('div')
    container.style.cssText = 'display: flex; flex-direction: column; width: 100vw; height: 100vh;'
    
    // 渲染菜单栏
    const menuBarElement = this.menuBar.render()
    container.appendChild(menuBarElement)
    
    // 渲染目录栏
    const directoryElement = this.directory.render()
    container.appendChild(directoryElement)
    
    appContainer.appendChild(container)
    console.log('✓ 布局已渲染到页面')
  }

  private createMaterialMenuBar(): MaterialMenuBar {
    let menuBar: MaterialMenuBar | undefined
    menuBar = new MaterialMenuBar()
    const saveButton = new MaterialButton('保存');
    const searchInput = new MaterialInput();
    searchInput.setPlaceholder('搜索...');
    const enableSwitch = new MaterialSwitch();
    enableSwitch.setChecked(true);
    const colorSelect = new MaterialSelect();
    colorSelect.setOptions([
      { label: '红色', value: 'red' },
      { label: '蓝色', value: 'blue' }
    ]);
    colorSelect.setPlaceholder('选择颜色');

    // 添加控件到菜单栏
    menuBar
      .addItem({ id: 'file', type: MenuItemType.ITEM, label: '文件' })
      .addItem({ id: 'edit', type: MenuItemType.ITEM, label: '编辑' })
      .addWidget('save-btn', saveButton)
      .addWidget('search-input', searchInput)
      .addWidget('enable-switch', enableSwitch)
      .addWidget('color-select', colorSelect);

    return menuBar
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
    directorySidebar.setPosition('left') // 'left' 或 'right'
    directorySidebar.setCollapsed(false) // 默认展开
    
    // 设置点击事件监听，点击后重新渲染整个布局
    directorySidebar.setOnItemClick(() => {
      // 延迟重新渲染，避免重复触发
      if ((window as any).rerenderTimeout) {
        clearTimeout((window as any).rerenderTimeout)
      }
      ;(window as any).rerenderTimeout = setTimeout(() => {
        this.renderLayout()
      }, 50)
    })
    
    return directorySidebar
  }

  private renderDirectorySidebar(directorySidebar: MaterialDirectorySidebar): void {
    const appContainer = document.getElementById('app')
    if (!appContainer) return

    const element = directorySidebar.render()
    appContainer.appendChild(element)
    console.log('✓ 目录栏已渲染到页面')
  }

  private renderMenuBar(menuBar: MaterialMenuBar): void {
    const appContainer = document.getElementById('app')
    if (!appContainer) return

    // 清空容器
    appContainer.innerHTML = ''

    // 渲染菜单栏
    const element = menuBar.render()
    appContainer.appendChild(element)

    console.log('✓ 菜单栏已渲染到页面')
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new FreeDesignApp()
})