import 'element-plus/dist/index.css'
import { NhaiMenuBarCommand } from 'nhai-ui-vue'

// 初始化应用
class FreeDesignApp {
  constructor() {
    this.init()
  }
  
  private init(): void {
    // 注册并设置 Vanilla 适配器
    // const adapter = new VanillaAdapter()
    // NHAIFrameworkRegistry.register(adapter)
    // NHAIFrameworkRegistry.use('vanilla')
    
    // // 创建组件
    // this.directory = this.createDirectorySidebar()
    // this.menuBar = this.createMaterialMenuBar()
    // this.canvas3D = this.create3DCanvas()
    // this.vbox = this.createVBoxLayout()
    // this.renderLayout()
    
    // // 设置重新渲染回调
    // ;(window as any).rerenderDirectorySidebar = () => {
    //   this.vbox = this.createVBoxLayout()
    //   this.renderLayout()
    // }
    this.CreateVueComponent()
  }

  // id: string | number;
  // label: string;
  // icon?: string;
  // disabled?: boolean;
  // children?: MenuItem[];
  private CreateVueComponent(): void {
    const menuBar = new NhaiMenuBarCommand()
    
    // 创建完整的菜单结构
    menuBar.setItems([
      { id: 'home', label: '首页', icon: '🏠' },
      { 
        id: 'file', 
        label: '文件', 
        icon: '📄',
        children: [
          { id: 'new', label: '新建', icon: '➕' },
          { id: 'open', label: '打开', icon: '📂' },
          { id: 'save', label: '保存', icon: '💾' },
          { id: 'save-as', label: '另存为', icon: '💾', disabled: true },
          { id: 'separator-1', label: 'separator' },
          { id: 'import', label: '导入', icon: '⬇️' },
          { id: 'export', label: '导出', icon: '⬆️' },
          { id: 'separator-2', label: 'separator' },
          { id: 'exit', label: '退出', icon: '🚪' }
        ] 
      },
      { 
        id: 'edit', 
        label: '编辑', 
        icon: '✏️',
        children: [
          { id: 'undo', label: '撤销', icon: '↶' },
          { id: 'redo', label: '重做', icon: '↷' },
          { id: 'separator-3', label: 'separator' },
          { id: 'cut', label: '剪切', icon: '✂️' },
          { id: 'copy', label: '复制', icon: '📋' },
          { id: 'paste', label: '粘贴', icon: '📄' },
          { id: 'separator-4', label: 'separator' },
          { id: 'delete', label: '删除', icon: '🗑️' },
          { id: 'duplicate', label: '复制', icon: '📑' }
        ] 
      },
      { 
        id: 'view', 
        label: '视图', 
        icon: '👁️',
        children: [
          { id: 'fullscreen', label: '全屏', icon: '⛶' },
          { id: 'zoom-in', label: '放大', icon: '🔍➕' },
          { id: 'zoom-out', label: '缩小', icon: '🔍➖' },
          { id: 'zoom-reset', label: '重置', icon: '🔍' },
          { id: 'separator-5', label: 'separator' },
          { id: 'grid', label: '显示网格', icon: '⊞' },
          { id: 'ruler', label: '显示标尺', icon: '📏' },
          { id: 'sidebar', label: '工具栏', icon: '⚙️' }
        ] 
      },
      { 
        id: 'insert', 
        label: '插入', 
        icon: '➕',
        children: [
          { id: 'shape', label: '形状', icon: '⬜' },
          { id: 'text', label: '文本', icon: '📝' },
          { id: 'image', label: '图片', icon: '🖼️' },
          { id: 'table', label: '表格', icon: '📊' },
          { id: 'chart', label: '图表', icon: '📈' },
          { id: 'separator-6', label: 'separator' },
          { id: 'component', label: '组件', icon: '🧩' },
          { id: 'template', label: '模板', icon: '📑' }
        ] 
      },
      { 
        id: 'format', 
        label: '格式', 
        icon: '🎨',
        children: [
          { id: 'font', label: '字体', icon: 'Aa' },
          { id: 'paragraph', label: '段落', icon: '¶' },
          { id: 'style', label: '样式', icon: '🎯' },
          { id: 'color', label: '颜色', icon: '🎨' },
          { id: 'separator-7', label: 'separator' },
          { id: 'align', label: '对齐', icon: '⊣' },
          { id: 'spacing', label: '间距', icon: '⚊' },
          { id: 'border', label: '边框', icon: '▦' }
        ] 
      },
      { 
        id: 'tools', 
        label: '工具', 
        icon: '🔧',
        children: [
          { id: 'preferences', label: '偏好设置', icon: '⚙️' },
          { id: 'shortcuts', label: '快捷键', icon: '⌨️' },
          { id: 'extensions', label: '扩展插件', icon: '🔌' },
          { id: 'separator-8', label: 'separator' },
          { id: 'developer', label: '开发者工具', icon: '👨‍💻' }
        ] 
      },
      { 
        id: 'help', 
        label: '帮助', 
        icon: '❓',
        children: [
          { id: 'guide', label: '使用指南', icon: '📖' },
          { id: 'shortcuts-help', label: '快捷键', icon: '⌨️' },
          { id: 'tutorial', label: '教程', icon: '🎓' },
          { id: 'separator-9', label: 'separator' },
          { id: 'update', label: '检查更新', icon: '🔄' },
          { id: 'feedback', label: '意见反馈', icon: '💬' },
          { id: 'separator-10', label: 'separator' },
          { id: 'about', label: '关于', icon: 'ℹ️' }
        ] 
      }
    ])
    
    // 配置菜单栏
    menuBar.setMode('horizontal')
    menuBar.setDefaultActive('home')
    menuBar.setCollapse(false)
    menuBar.setUniqueOpened(true)
    menuBar.setRouter(true)
    menuBar.setCollapseTransition(true)
    
    // 设置选中事件
    menuBar.setOnSelect((index: string, indexPath: string[]) => {
      console.log('菜单项被选中:', index, indexPath)
      
      // 根据不同的菜单项执行不同的操作
      this.handleMenuSelect(index, indexPath)
    })
    
    // 渲染菜单栏
    const element = menuBar.render()
    const appContainer = document.getElementById('app')
    if (!appContainer) return
    
    console.log('渲染菜单栏元素:', element)
    console.log('菜单项:', menuBar.getItems())
    
    // 添加样式
    appContainer.style.display = 'flex'
    appContainer.style.flexDirection = 'column'
    appContainer.style.height = '100vh'
    appContainer.appendChild(element)
  }
  
  private handleMenuSelect(index: string, _indexPath: string[]): void {
    console.log(`执行菜单操作: ${index}`)
    
    // 根据菜单项执行相应操作
    switch(index) {
      case 'new':
        this.handleNewFile()
        break
      case 'open':
        this.handleOpenFile()
        break
      case 'save':
        this.handleSaveFile()
        break
      case 'undo':
        this.handleUndo()
        break
      case 'redo':
        this.handleRedo()
        break
      case 'about':
        this.handleAbout()
        break
      default:
        console.log(`菜单项 "${index}" 的功能待实现`)
    }
  }
  
  private handleNewFile(): void {
    console.log('创建新文件')
    // 实现新建文件逻辑
  }
  
  private handleOpenFile(): void {
    console.log('打开文件')
    // 实现打开文件逻辑
  }
  
  private handleSaveFile(): void {
    console.log('保存文件')
    // 实现保存文件逻辑
  }
  
  private handleUndo(): void {
    console.log('撤销操作')
    // 实现撤销逻辑
  }
  
  private handleRedo(): void {
    console.log('重做操作')
    // 实现重做逻辑
  }
  
  private handleAbout(): void {
    console.log('关于对话框')
    // 实现关于对话框
  }
}

//   private createVBoxLayout(): NHAIObject {
//     const vbox = NHAIObjectFactory.createVBoxLayout()
//     vbox.setSpacing(0)
//     vbox.addWidget(this.menuBar!)
//     vbox.addWidget(this.createHBoxLayout())
//     return vbox
//   }

//   private createHBoxLayout(): NHAIObject {
//     const hbox = NHAIObjectFactory.createHBoxLayout()
//     hbox.setSpacing(0)
//     hbox.addWidget(this.directory!)
//     hbox.addWidget(this.canvas3D!)
//     return hbox
//   }
//   private renderLayout(): void {
//     const appContainer = document.getElementById('app')
//     if (!appContainer || !this.vbox) return

//     appContainer.innerHTML = ''
//     const element = this.vbox.render()
//     appContainer.appendChild(element)
//   }

//   private createMaterialMenuBar(): MaterialMenuBar {
//     const menuBar = new MaterialMenuBar()
//     const saveButton = new MaterialButton('保存')
//     const searchInput = new MaterialInput()
//     searchInput.setPlaceholder('搜索...')
//     const enableSwitch = new MaterialSwitch()
//     enableSwitch.setChecked(true)
//     const colorSelect = new MaterialSelect()
//     colorSelect.setOptions([
//       { label: '红色', value: 'red' },
//       { label: '蓝色', value: 'blue' }
//     ])
//     colorSelect.setPlaceholder('选择颜色')

//     menuBar
//       .addItem({ id: 'home', type: MenuItemType.ITEM, label: '首页' })
//       .addItem({ id: 'file', type: MenuItemType.SUBMENU, label: '文件', children: [
//         { id: 'new', type: MenuItemType.ITEM, label: '新建' },
//         { id: 'open', type: MenuItemType.ITEM, label: '打开' },
//         { id: 'save', type: MenuItemType.ITEM, label: '保存' }
//       ] })
//       .addItem({ id: 'edit', type: MenuItemType.SUBMENU, label: '编辑', children: [
//         { id: 'undo', type: MenuItemType.ITEM, label: '撤销' },
//         { id: 'redo', type: MenuItemType.ITEM, label: '重做' }
//       ] })
//       .addItem({ id: 'view', type: MenuItemType.SUBMENU, label: '视图', children: [
//         { id: 'grid', type: MenuItemType.ITEM, label: '网格' },
//         { id: 'list', type: MenuItemType.ITEM, label: '列表' }
//       ] })
//       .addItem({ id: 'help', type: MenuItemType.SUBMENU, label: '帮助', children: [
//         { id: 'about', type: MenuItemType.ITEM, label: '关于' },
//         { id: 'contact', type: MenuItemType.ITEM, label: '联系我们' }
//       ] })
//       .addWidget('save-btn', saveButton)
//       .addWidget('search-input', searchInput)
//       .addWidget('enable-switch', enableSwitch)
//       .addWidget('color-select', colorSelect)

//     return menuBar
//   }

//   private create3DCanvas(): MaterialCanvas {
//     const canvas3D = new MaterialCanvas()
//     canvas3D.setMode(CanvasMode['3D'])
//     canvas3D.setCanvasSize(1200, 800)
//     canvas3D.setBackground('#f5f5f5')
//     canvas3D.setShowGrid(true)
//     canvas3D.setGridSize(20)
//     canvas3D.setGridColor('#e0e0e0')
//     return canvas3D
//   }

//   private createDirectorySidebar(): MaterialDirectorySidebar {
//     const directorySidebar = new MaterialDirectorySidebar()
//     const directoryItems = [
//       { id: 'library', label: '素材库', icon: '📚', active: true },
//       { id: 'product', label: '产品库', icon: '📦' },
//       { id: 'component', label: '组件库', icon: '🧩' },
//       { id: 'assembly', label: '装配库', icon: '🔧' },
//       { id: 'mixed', label: '混合库', icon: '🎯' }
//     ]
//     directorySidebar.setItems(directoryItems)
//     directorySidebar.setActiveKey('library')
//     directorySidebar.setSidebarWidth(180)
//     directorySidebar.setContentWidth(600)
//     directorySidebar.setPosition('left')
//     directorySidebar.setCollapsed(false)
    
//     directorySidebar.setOnItemClick(() => {
//       if ((window as any).rerenderTimeout) {
//         clearTimeout((window as any).rerenderTimeout)
//       }
//       ;(window as any).rerenderTimeout = setTimeout(() => {
//         this.renderLayout()
//       }, 50)
//     })
    
//     return directorySidebar
//   }

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new FreeDesignApp()
})