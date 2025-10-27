import { CanvasMode, MaterialButton, MaterialCanvas, MaterialDirectorySidebar, MaterialInput, MaterialMenuBar, MaterialSelect, MaterialSwitch, MenuItemType, NHAIFrameworkRegistry, NHAIObject, NHAIObjectFactory, VanillaAdapter } from 'nhai-framework'

// 初始化应用
class FreeDesignApp {
  constructor() {
    this.init()
  }

  private menuBar: MaterialMenuBar | null = null
  private directory: MaterialDirectorySidebar | null = null
  private vbox: NHAIObject | null = null
  private canvas2D: MaterialCanvas | null = null
  private canvas3D: MaterialCanvas | null = null
  
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
    this.canvas3D = this.create3DCanvas()  // 先创建 canvas，再创建布局
    this.vbox = this.createVBoxLayout()
    this.renderLayout()
    
    // 设置重新渲染回调
    ;(window as any).rerenderDirectorySidebar = () => {
      // 重新创建vbox以反映最新状态（使用已有的canvas3D）
      this.vbox = this.createVBoxLayout()
      this.renderLayout()
    }

    console.log('NHAI Free Design 初始化完成')
  }
  
  private createVBoxLayout(): NHAIObject {
    const vbox = NHAIObjectFactory.createVBoxLayout()
    // 设置垂直布局间距（可选）
    vbox.setSpacing(0) // 菜单栏和目录之间间距
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

    // 清空容器
    appContainer.innerHTML = ''
    
    // 渲染垂直布局（样式由vbox内部管理）
    const element = this.vbox.render()
    appContainer.appendChild(element)
    
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

  private create2DCanvas(): MaterialCanvas {
 // 2D绘图
    const canvas2D = new MaterialCanvas()
    canvas2D.setMode(CanvasMode['2D'])
    canvas2D.setCanvasSize(800, 600)
    const ctx2D = canvas2D.getContext2D()
    if (ctx2D) {
      ctx2D.fillStyle = 'blue'
      ctx2D.fillRect(10, 10, 100, 100)
    }
    return canvas2D
  }

  private create3DCanvas(): MaterialCanvas {
    const canvas3D = new MaterialCanvas()
    canvas3D.setMode(CanvasMode['3D'])
    canvas3D.setCanvasSize(1200, 800)
    
    // 设置背景色为浅灰白（更柔和护眼）
    canvas3D.setBackground('#f5f5f5')
    
    // 启用网格显示
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
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new FreeDesignApp()
})