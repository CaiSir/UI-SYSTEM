import { NHAIObjectFactory } from '../../../factory/NHAIFactory'
import { MenuItemType, MaterialMenuBar } from './MaterialMenuBar'

/**
 * Material 菜单栏命令式 API 使用示例
 * 展示如何通过代码动态添加菜单项和子菜单
 */

// 1. 基础水平菜单栏示例
export function createBasicMenuBarExample() {
  console.log('--- 基础水平菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .horizontal() // 设置为水平布局
    .setBackgroundColor('#f5f5f5')
    .setBorderColor('#e0e0e0')
    .setBorderRadius(8)
    .setShadow(true)
    .setHeight(50)
    .addMenuItem('file', '文件', () => console.log('文件菜单点击'))
    .addMenuItem('edit', '编辑', () => console.log('编辑菜单点击'))
    .addMenuItem('view', '视图', () => console.log('视图菜单点击'))
    .addMenuItem('help', '帮助', () => console.log('帮助菜单点击'))

  console.log('基础菜单栏:', menuBar)
  return menuBar
}

// 2. 带子菜单的菜单栏示例
export function createSubmenuMenuBarExample() {
  console.log('\n--- 带子菜单的菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .horizontal()
    .setBackgroundColor('#ffffff')
    .setShadow(true)
    .setHeight(50)
    .addSubmenu('file', '文件', [
      { id: 'new', type: MenuItemType.ITEM, label: '新建', shortcut: 'Ctrl+N', onClick: () => console.log('新建文件') },
      { id: 'open', type: MenuItemType.ITEM, label: '打开', shortcut: 'Ctrl+O', onClick: () => console.log('打开文件') },
      { id: 'save', type: MenuItemType.ITEM, label: '保存', shortcut: 'Ctrl+S', onClick: () => console.log('保存文件') },
      { id: 'sep1', type: MenuItemType.SEPARATOR },
      { id: 'exit', type: MenuItemType.ITEM, label: '退出', onClick: () => console.log('退出应用') }
    ])
    .addSubmenu('edit', '编辑', [
      { id: 'undo', type: MenuItemType.ITEM, label: '撤销', shortcut: 'Ctrl+Z', onClick: () => console.log('撤销操作') },
      { id: 'redo', type: MenuItemType.ITEM, label: '重做', shortcut: 'Ctrl+Y', onClick: () => console.log('重做操作') },
      { id: 'sep2', type: MenuItemType.SEPARATOR },
      { id: 'cut', type: MenuItemType.ITEM, label: '剪切', shortcut: 'Ctrl+X', onClick: () => console.log('剪切内容') },
      { id: 'copy', type: MenuItemType.ITEM, label: '复制', shortcut: 'Ctrl+C', onClick: () => console.log('复制内容') },
      { id: 'paste', type: MenuItemType.ITEM, label: '粘贴', shortcut: 'Ctrl+V', onClick: () => console.log('粘贴内容') }
    ])
    .addSubmenu('view', '视图', [
      { id: 'zoom-in', type: MenuItemType.ITEM, label: '放大', shortcut: 'Ctrl++', onClick: () => console.log('放大视图') },
      { id: 'zoom-out', type: MenuItemType.ITEM, label: '缩小', shortcut: 'Ctrl+-', onClick: () => console.log('缩小视图') },
      { id: 'sep3', type: MenuItemType.SEPARATOR },
      { id: 'fullscreen', type: MenuItemType.ITEM, label: '全屏', shortcut: 'F11', onClick: () => console.log('切换全屏') }
    ])

  console.log('子菜单菜单栏:', menuBar)
  return menuBar
}

// 3. 带复选框和单选的菜单栏示例
export function createCheckboxRadioMenuBarExample() {
  console.log('\n--- 带复选框和单选的菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .horizontal()
    .setBackgroundColor('#ffffff')
    .setShadow(true)
    .setHeight(50)
    .addSubmenu('options', '选项', [
      { id: 'show-grid', type: MenuItemType.CHECKBOX, label: '显示网格', checked: true, onToggle: (checked: boolean) => console.log('显示网格:', checked) },
      { id: 'show-ruler', type: MenuItemType.CHECKBOX, label: '显示标尺', checked: false, onToggle: (checked: boolean) => console.log('显示标尺:', checked) },
      { id: 'auto-save', type: MenuItemType.CHECKBOX, label: '自动保存', checked: true, onToggle: (checked: boolean) => console.log('自动保存:', checked) },
      { id: 'sep1', type: MenuItemType.SEPARATOR },
      { id: 'theme-light', type: MenuItemType.RADIO, label: '浅色主题', checked: true, group: 'theme', onToggle: (checked: boolean) => console.log('浅色主题:', checked) },
      { id: 'theme-dark', type: MenuItemType.RADIO, label: '深色主题', checked: false, group: 'theme', onToggle: (checked: boolean) => console.log('深色主题:', checked) },
      { id: 'theme-auto', type: MenuItemType.RADIO, label: '自动主题', checked: false, group: 'theme', onToggle: (checked: boolean) => console.log('自动主题:', checked) }
    ])

  console.log('复选框单选菜单栏:', menuBar)
  return menuBar
}

// 4. 垂直菜单栏示例
export function createVerticalMenuBarExample() {
  console.log('\n--- 垂直菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .vertical() // 设置为垂直布局
    .setWidth(200)
    .setBackgroundColor('#f8f9fa')
    .setBorderColor('#dee2e6')
    .setBorderRadius(8)
    .setShadow(true)
    .addIconMenuItem('dashboard', '仪表板', 'dashboard', () => console.log('仪表板'))
    .addIconMenuItem('users', '用户管理', 'people', () => console.log('用户管理'))
    .addIconMenuItem('products', '产品管理', 'inventory', () => console.log('产品管理'))
    .addIconMenuItem('orders', '订单管理', 'shopping_cart', () => console.log('订单管理'))
    .addSeparator('sep1')
    .addIconMenuItem('settings', '设置', 'settings', () => console.log('设置'))
    .addIconMenuItem('help', '帮助', 'help', () => console.log('帮助'))

  console.log('垂直菜单栏:', menuBar)
  return menuBar
}

// 5. 上下文菜单示例
export function createContextMenuExample() {
  console.log('\n--- 上下文菜单示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .context() // 设置为上下文菜单
    .setBackgroundColor('#ffffff')
    .setBorderColor('#e0e0e0')
    .setBorderRadius(6)
    .setShadow(true)
    .addMenuItem('copy', '复制', () => console.log('复制'))
    .addMenuItem('paste', '粘贴', () => console.log('粘贴'))
    .addMenuItem('cut', '剪切', () => console.log('剪切'))
    .addSeparator('sep1')
    .addMenuItem('select-all', '全选', () => console.log('全选'))
    .addMenuItem('deselect', '取消选择', () => console.log('取消选择'))
    .addSeparator('sep2')
    .addMenuItem('properties', '属性', () => console.log('属性'))

  console.log('上下文菜单:', menuBar)
  return menuBar
}

// 6. 动态菜单栏示例
export function createDynamicMenuBarExample() {
  console.log('\n--- 动态菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .horizontal()
    .setBackgroundColor('#ffffff')
    .setShadow(true)
    .setHeight(50)
    .addMenuItem('start', '开始', () => console.log('开始'))
    .addMenuItem('pause', '暂停', () => console.log('暂停'))
    .addMenuItem('stop', '停止', () => console.log('停止'))

  // 2秒后动态添加菜单项
  setTimeout(() => {
    console.log('动态添加 "重置" 和 "导出" 菜单项')
    menuBar
      .addSeparator('dynamic-sep')
      .addMenuItem('reset', '重置', () => console.log('重置'))
      .addMenuItem('export', '导出', () => console.log('导出'))
  }, 2000)

  // 4秒后动态隐藏 "暂停" 菜单项
  setTimeout(() => {
    console.log('动态隐藏 "暂停" 菜单项')
    menuBar.hideItem('pause')
  }, 4000)

  // 6秒后动态显示 "暂停" 菜单项
  setTimeout(() => {
    console.log('动态显示 "暂停" 菜单项')
    menuBar.showItem('pause')
  }, 6000)

  // 8秒后动态移除 "停止" 菜单项
  setTimeout(() => {
    console.log('动态移除 "停止" 菜单项')
    menuBar.removeItem('stop')
  }, 8000)

  // 10秒后动态更新 "开始" 菜单项
  setTimeout(() => {
    console.log('动态更新 "开始" 菜单项文本')
    menuBar.updateItem('start', { label: '重新开始' })
  }, 10000)

  console.log('动态菜单栏:', menuBar)
  return menuBar
}

// 7. 带菜单组的菜单栏示例
export function createGroupedMenuBarExample() {
  console.log('\n--- 带菜单组的菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .vertical()
    .setWidth(250)
    .setBackgroundColor('#ffffff')
    .setShadow(true)
    .addMenuGroup('file-group', '文件操作', [
      { id: 'new', type: MenuItemType.ITEM, label: '新建', icon: 'add', onClick: () => console.log('新建') },
      { id: 'open', type: MenuItemType.ITEM, label: '打开', icon: 'folder_open', onClick: () => console.log('打开') },
      { id: 'save', type: MenuItemType.ITEM, label: '保存', icon: 'save', onClick: () => console.log('保存') }
    ])
    .addMenuGroup('edit-group', '编辑操作', [
      { id: 'undo', type: MenuItemType.ITEM, label: '撤销', icon: 'undo', onClick: () => console.log('撤销') },
      { id: 'redo', type: MenuItemType.ITEM, label: '重做', icon: 'redo', onClick: () => console.log('重做') },
      { id: 'cut', type: MenuItemType.ITEM, label: '剪切', icon: 'content_cut', onClick: () => console.log('剪切') },
      { id: 'copy', type: MenuItemType.ITEM, label: '复制', icon: 'content_copy', onClick: () => console.log('复制') },
      { id: 'paste', type: MenuItemType.ITEM, label: '粘贴', icon: 'content_paste', onClick: () => console.log('粘贴') }
    ])
    .addMenuGroup('view-group', '视图选项', [
      { id: 'zoom-in', type: MenuItemType.ITEM, label: '放大', icon: 'zoom_in', onClick: () => console.log('放大') },
      { id: 'zoom-out', type: MenuItemType.ITEM, label: '缩小', icon: 'zoom_out', onClick: () => console.log('缩小') },
      { id: 'fullscreen', type: MenuItemType.ITEM, label: '全屏', icon: 'fullscreen', onClick: () => console.log('全屏') }
    ])

  console.log('分组菜单栏:', menuBar)
  return menuBar
}

// 8. 深色主题菜单栏示例
export function createDarkThemeMenuBarExample() {
  console.log('\n--- 深色主题菜单栏示例 ---')
  const menuBar: MaterialMenuBar = NHAIObjectFactory.createMaterialMenuBar()

  menuBar
    .horizontal()
    .setTheme('dark') // 设置为深色主题
    .setBackgroundColor('#2c3e50')
    .setBorderColor('#34495e')
    .setShadow(true)
    .setHeight(50)
    .addIconMenuItem('home', '首页', 'home', () => console.log('首页'))
    .addIconMenuItem('dashboard', '仪表板', 'dashboard', () => console.log('仪表板'))
    .addIconMenuItem('analytics', '分析', 'analytics', () => console.log('分析'))
    .addIconMenuItem('reports', '报告', 'assessment', () => console.log('报告'))
    .addSeparator('sep1')
    .addIconMenuItem('settings', '设置', 'settings', () => console.log('设置'))
    .addIconMenuItem('profile', '个人资料', 'person', () => console.log('个人资料'))

  console.log('深色主题菜单栏:', menuBar)
  return menuBar
}
