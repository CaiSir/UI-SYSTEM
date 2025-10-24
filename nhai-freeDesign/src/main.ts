import { MaterialMenuBar, MenuItemType, NHAIFrameworkRegistry, NHAIObjectFactory, VanillaAdapter } from 'nhai-framework'

// 初始化应用
class FreeDesignApp {
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
    
    // 尝试直接创建 MaterialMenuBar 实例
    let menuBar: MaterialMenuBar | undefined
    try {
      console.log('正在创建 MaterialMenuBar...')
      console.log('MaterialMenuBar 构造函数:', MaterialMenuBar)
      console.log('MaterialMenuBar 类型:', typeof MaterialMenuBar)
      
      // 检查 MaterialMenuBar 是否为函数
      if (typeof MaterialMenuBar !== 'function') {
        console.error('❌ MaterialMenuBar 不是一个函数:', typeof MaterialMenuBar)
        return
      }
      
      menuBar = new MaterialMenuBar()
      console.log('✓ Material 菜单栏已创建:', menuBar)
      console.log('✓ MaterialMenuBar 类型:', typeof menuBar)
      console.log('✓ MaterialMenuBar 构造函数:', menuBar.constructor.name)
      
      // 检查 menuBar 是否为 undefined
      if (!menuBar) {
        console.error('❌ MaterialMenuBar 创建失败，返回了 undefined')
        return
      }
      
      // 测试基本方法
      console.log('测试 horizontal 方法...')
      const result = menuBar.horizontal()
      console.log('horizontal 方法返回:', result)
      console.log('horizontal 方法返回类型:', typeof result)
      
    } catch (error) {
      console.error('❌ MaterialMenuBar 创建失败:', error)
      return
    }
    
    // 确保 menuBar 已定义
    if (!menuBar) {
      console.error('❌ menuBar 未定义')
      return
    }
    
    // 测试菜单栏功能
    if (menuBar && typeof (menuBar as any).addMenuItem === 'function') {
      console.log('开始配置菜单栏...')
      const menuBar = NHAIObjectFactory.createMaterialMenuBar();

      menuBar.horizontal();
      menuBar.setWidth('100%');
      menuBar.setBackgroundColor('#ffffff');
      menuBar.setShadow(true);
      menuBar.setHeight(60);
      
      // 添加下拉菜单
      menuBar.addSubmenu('file', '文件', [
        { id: 'new', type: MenuItemType.ITEM, label: '新建', shortcut: 'Ctrl+N', onClick: () => console.log('新建文件') },
        { id: 'open', type: MenuItemType.ITEM, label: '打开', shortcut: 'Ctrl+O', onClick: () => console.log('打开文件') },
        { id: 'save', type: MenuItemType.ITEM, label: '保存', shortcut: 'Ctrl+S', onClick: () => console.log('保存文件') },
        // { id: 'sep1', type: MenuItemType.SEPARATOR },
        { id: 'exit', type: MenuItemType.ITEM, label: '退出', onClick: () => console.log('退出应用') }
      ]);
      
      menuBar.addSubmenu('edit', '编辑', [
        { id: 'undo', type: MenuItemType.ITEM, label: '撤销', shortcut: 'Ctrl+Z', onClick: () => console.log('撤销操作') },
        { id: 'redo', type: MenuItemType.ITEM, label: '重做', shortcut: 'Ctrl+Y', onClick: () => console.log('重做操作') },
        // { id: 'sep2', type: MenuItemType.SEPARATOR },
        { id: 'cut', type: MenuItemType.ITEM, label: '剪切', shortcut: 'Ctrl+X', onClick: () => console.log('剪切内容') },
        { id: 'copy', type: MenuItemType.ITEM, label: '复制', shortcut: 'Ctrl+C', onClick: () => console.log('复制内容') },
        { id: 'paste', type: MenuItemType.ITEM, label: '粘贴', shortcut: 'Ctrl+V', onClick: () => console.log('粘贴内容') }
      ]);
      
      menuBar.addMenuItem('view', '视图', () => console.log('视图菜单'));
      // menuBar.addSeparator('sep1');
      menuBar.addMenuItem('help', '帮助', () => console.log('帮助菜单'));

      console.log('菜单栏:', menuBar) 

      console.log('✓ 菜单栏配置完成')
      
      // 渲染菜单栏到页面
      this.renderMenuBar(menuBar)
    } else {
      console.error('❌ menuBar 对象无效或 addMenuItem 方法不存在')
      console.log('menuBar:', menuBar)
      console.log('addMenuItem 方法:', typeof (menuBar as any)?.addMenuItem)
      console.log('menuBar 类型:', typeof menuBar)
      if (menuBar) {
        console.log('menuBar 的方法:', Object.getOwnPropertyNames(Object.getPrototypeOf(menuBar)))
      }
    }
    
    console.log('NHAI Free Design 初始化完成')
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