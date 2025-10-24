/**
 * Material 工具栏命令式API使用示例
 * 展示如何通过命令式API动态添加控件和自定义布局
 */

import { MaterialToolbar, ToolbarLayoutType, ToolbarAlignment } from './MaterialToolbar'
import { NHAIObjectFactory } from '../../../factory/NHAIFactory'

/**
 * 基础工具栏示例
 */
export function createBasicToolbarExample() {
  console.log('=== 基础工具栏示例 ===')

  // 创建工具栏
  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置工具栏
  toolbar
    .setLayout(ToolbarLayoutType.HORIZONTAL)
    .setAlignment(ToolbarAlignment.START)
    .setSpacing(12)
    .setPadding(16)
    .setTheme('light')

  // 添加按钮
  toolbar
    .addButton('save', '保存', () => console.log('保存'))
    .addButton('cancel', '取消', () => console.log('取消'))
    .addButton('delete', '删除', () => console.log('删除'))

  // 添加分隔符
  toolbar.addSeparator('sep1')

  // 添加图标按钮
  toolbar
    .addIconButton('add', 'add', () => console.log('添加'))
    .addIconButton('edit', 'edit', () => console.log('编辑'))
    .addIconButton('refresh', 'refresh', () => console.log('刷新'))

  return toolbar
}

/**
 * 表单工具栏示例
 */
export function createFormToolbarExample() {
  console.log('=== 表单工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置表单工具栏
  toolbar
    .horizontal()
    .setAlignment(ToolbarAlignment.SPACE_BETWEEN)
    .setBackgroundColor('#f8f9fa')
    .setBorderColor('#dee2e6')

  // 左侧操作按钮
  toolbar
    .addButton('new', '新建', () => console.log('新建表单'))
    .addButton('open', '打开', () => console.log('打开表单'))
    .addButton('save', '保存', () => console.log('保存表单'))
    .addSeparator('sep1')

  // 中间搜索框
  toolbar.addInput('search', '搜索表单...', (value) => {
    console.log('搜索:', value)
  })

  // 右侧工具按钮
  toolbar
    .addSeparator('sep2')
    .addIconButton('settings', 'settings', () => console.log('设置'))
    .addIconButton('help', 'help', () => console.log('帮助'))

  return toolbar
}

/**
 * 编辑器工具栏示例
 */
export function createEditorToolbarExample() {
  console.log('=== 编辑器工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置编辑器工具栏
  toolbar
    .horizontal()
    .setAlignment(ToolbarAlignment.START)
    .setBackgroundColor('#ffffff')
    .setShadow(true)

  // 文件操作组
  toolbar
    .addButton('new', '新建', () => console.log('新建文档'))
    .addButton('open', '打开', () => console.log('打开文档'))
    .addButton('save', '保存', () => console.log('保存文档'))
    .addSeparator('file-sep')

  // 编辑操作组
  toolbar
    .addIconButton('undo', 'undo', () => console.log('撤销'))
    .addIconButton('redo', 'redo', () => console.log('重做'))
    .addSeparator('edit-sep')

  // 格式化组
  toolbar
    .addIconButton('bold', 'format_bold', () => console.log('粗体'))
    .addIconButton('italic', 'format_italic', () => console.log('斜体'))
    .addIconButton('underline', 'format_underlined', () => console.log('下划线'))
    .addSeparator('format-sep')

  // 对齐组
  toolbar
    .addIconButton('align-left', 'format_align_left', () => console.log('左对齐'))
    .addIconButton('align-center', 'format_align_center', () => console.log('居中对齐'))
    .addIconButton('align-right', 'format_align_right', () => console.log('右对齐'))
    .addSeparator('align-sep')

  // 插入组
  toolbar
    .addIconButton('image', 'image', () => console.log('插入图片'))
    .addIconButton('link', 'link', () => console.log('插入链接'))
    .addIconButton('table', 'table_chart', () => console.log('插入表格'))

  return toolbar
}

/**
 * 数据表格工具栏示例
 */
export function createDataTableToolbarExample() {
  console.log('=== 数据表格工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置数据表格工具栏
  toolbar
    .horizontal()
    .setAlignment(ToolbarAlignment.SPACE_BETWEEN)
    .setBackgroundColor('#f5f5f5')

  // 左侧操作按钮
  toolbar
    .addButton('add', '添加记录', () => console.log('添加记录'))
    .addButton('edit', '编辑', () => console.log('编辑记录'))
    .addButton('delete', '删除', () => console.log('删除记录'))
    .addSeparator('action-sep')

  // 中间过滤和搜索
  toolbar
    .addSelect('filter', [
      { value: 'all', label: '全部' },
      { value: 'active', label: '活跃' },
      { value: 'inactive', label: '非活跃' }
    ], (value) => console.log('过滤:', value))
    .addInput('search', '搜索...', (value) => console.log('搜索:', value))

  // 右侧视图控制
  toolbar
    .addSeparator('view-sep')
    .addIconButton('refresh', 'refresh', () => console.log('刷新'))
    .addIconButton('export', 'download', () => console.log('导出'))
    .addIconButton('settings', 'settings', () => console.log('设置'))

  return toolbar
}

/**
 * 垂直工具栏示例
 */
export function createVerticalToolbarExample() {
  console.log('=== 垂直工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置垂直工具栏
  toolbar
    .vertical()
    .setAlignment(ToolbarAlignment.CENTER)
    .setWidth(60)
    .setBackgroundColor('#2c3e50')
    .setTheme('dark')

  // 添加垂直图标按钮
  toolbar
    .addIconButton('home', 'home', () => console.log('首页'))
    .addIconButton('dashboard', 'dashboard', () => console.log('仪表板'))
    .addIconButton('users', 'people', () => console.log('用户'))
    .addIconButton('products', 'inventory', () => console.log('产品'))
    .addIconButton('orders', 'shopping_cart', () => console.log('订单'))
    .addIconButton('reports', 'assessment', () => console.log('报告'))
    .addSeparator('main-sep')
    .addIconButton('settings', 'settings', () => console.log('设置'))
    .addIconButton('help', 'help', () => console.log('帮助'))

  return toolbar
}

/**
 * 网格布局工具栏示例
 */
export function createGridToolbarExample() {
  console.log('=== 网格布局工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置网格工具栏
  toolbar
    .grid(4) // 4列网格
    .setAlignment(ToolbarAlignment.CENTER)
    .setSpacing(16)
    .setBackgroundColor('#e8f4fd')

  // 添加网格项目
  toolbar
    .addButton('dashboard', '仪表板', () => console.log('仪表板'))
    .addButton('analytics', '分析', () => console.log('分析'))
    .addButton('reports', '报告', () => console.log('报告'))
    .addButton('settings', '设置', () => console.log('设置'))
    .addButton('users', '用户管理', () => console.log('用户管理'))
    .addButton('products', '产品管理', () => console.log('产品管理'))
    .addButton('orders', '订单管理', () => console.log('订单管理'))
    .addButton('inventory', '库存管理', () => console.log('库存管理'))

  return toolbar
}

/**
 * 动态工具栏示例
 */
export function createDynamicToolbarExample() {
  console.log('=== 动态工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 初始配置
  toolbar
    .horizontal()
    .setAlignment(ToolbarAlignment.START)
    .setBackgroundColor('#ffffff')

  // 添加初始按钮
  toolbar
    .addButton('start', '开始', () => console.log('开始'))
    .addButton('pause', '暂停', () => console.log('暂停'))
    .addButton('stop', '停止', () => console.log('停止'))

  // 模拟动态添加功能
  setTimeout(() => {
    console.log('动态添加按钮...')
    toolbar
      .addSeparator('dynamic-sep')
      .addButton('reset', '重置', () => console.log('重置'))
      .addButton('export', '导出', () => console.log('导出'))
  }, 2000)

  // 模拟动态隐藏/显示功能
  setTimeout(() => {
    console.log('隐藏暂停按钮...')
    toolbar.hideItem('pause')
  }, 4000)

  setTimeout(() => {
    console.log('显示暂停按钮...')
    toolbar.showItem('pause')
  }, 6000)

  // 模拟动态禁用/启用功能
  setTimeout(() => {
    console.log('禁用停止按钮...')
    toolbar.disableItem('stop')
  }, 8000)

  setTimeout(() => {
    console.log('启用停止按钮...')
    toolbar.enableItem('stop')
  }, 10000)

  return toolbar
}

/**
 * 分组工具栏示例
 */
export function createGroupedToolbarExample() {
  console.log('=== 分组工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置分组工具栏
  toolbar
    .horizontal()
    .setAlignment(ToolbarAlignment.START)
    .setBackgroundColor('#f8f9fa')

  // 文件操作组
  toolbar
    .addGroup('file-group', '文件操作')
    .addToGroup('file-group', {
      id: 'new-file',
      component: NHAIObjectFactory.createMaterialButton('新建'),
      label: '新建',
      tooltip: '创建新文件'
    })
    .addToGroup('file-group', {
      id: 'open-file',
      component: NHAIObjectFactory.createMaterialButton('打开'),
      label: '打开',
      tooltip: '打开文件'
    })
    .addToGroup('file-group', {
      id: 'save-file',
      component: NHAIObjectFactory.createMaterialButton('保存'),
      label: '保存',
      tooltip: '保存文件'
    })

  // 编辑操作组
  toolbar
    .addGroup('edit-group', '编辑操作')
    .addToGroup('edit-group', {
      id: 'undo',
      component: NHAIObjectFactory.createMaterialIconButton('undo'),
      label: '撤销',
      tooltip: '撤销操作'
    })
    .addToGroup('edit-group', {
      id: 'redo',
      component: NHAIObjectFactory.createMaterialIconButton('redo'),
      label: '重做',
      tooltip: '重做操作'
    })

  return toolbar
}

/**
 * 响应式工具栏示例
 */
export function createResponsiveToolbarExample() {
  console.log('=== 响应式工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置响应式工具栏
  toolbar
    .horizontal()
    .setAlignment(ToolbarAlignment.SPACE_BETWEEN)
    .setResponsive(true)
    .setBackgroundColor('#ffffff')

  // 添加响应式项目
  toolbar
    .addButton('home', '首页', () => console.log('首页'))
    .addButton('about', '关于', () => console.log('关于'))
    .addButton('services', '服务', () => console.log('服务'))
    .addButton('contact', '联系', () => console.log('联系'))
    .addSeparator('mobile-sep')
    .addIconButton('menu', 'menu', () => console.log('菜单'))

  // 模拟响应式行为
  const updateResponsiveLayout = () => {
    const width = window.innerWidth
    if (width < 768) {
      // 移动端：隐藏部分按钮，显示菜单
      toolbar.hideItem('about').hideItem('services').hideItem('contact')
      toolbar.showItem('menu')
    } else {
      // 桌面端：显示所有按钮，隐藏菜单
      toolbar.showItem('about').showItem('services').showItem('contact')
      toolbar.hideItem('menu')
    }
  }

  // 监听窗口大小变化
  window.addEventListener('resize', updateResponsiveLayout)
  updateResponsiveLayout()

  return toolbar
}

/**
 * 自定义布局工具栏示例
 */
export function createCustomLayoutToolbarExample() {
  console.log('=== 自定义布局工具栏示例 ===')

  const toolbar = NHAIObjectFactory.createMaterialToolbar()

  // 配置自定义布局工具栏
  toolbar
    .custom((items) => {
      // 自定义布局逻辑
      console.log('自定义布局:', items)
      return items
    })
    .setBackgroundColor('#f0f8ff')

  // 添加自定义项目
  toolbar
    .addButton('custom1', '自定义1', () => console.log('自定义1'))
    .addButton('custom2', '自定义2', () => console.log('自定义2'))
    .addButton('custom3', '自定义3', () => console.log('自定义3'))

  return toolbar
}

/**
 * 工具栏管理器示例
 */
export function createToolbarManagerExample() {
  console.log('=== 工具栏管理器示例 ===')

  // 创建多个工具栏
  const mainToolbar = createBasicToolbarExample()
  const formToolbar = createFormToolbarExample()
  const editorToolbar = createEditorToolbarExample()

  // 工具栏管理器
  const toolbarManager = {
    toolbars: [mainToolbar, formToolbar, editorToolbar],
    
    // 获取工具栏
    getToolbar(index: number) {
      return this.toolbars[index]
    },
    
    // 添加工具栏
    addToolbar(toolbar: MaterialToolbar) {
      this.toolbars.push(toolbar)
    },
    
    // 移除工具栏
    removeToolbar(index: number) {
      this.toolbars.splice(index, 1)
    },
    
    // 更新所有工具栏主题
    updateTheme(theme: 'light' | 'dark') {
      this.toolbars.forEach(toolbar => {
        toolbar.setTheme(theme)
      })
    },
    
    // 更新所有工具栏布局
    updateLayout(layout: ToolbarLayoutType) {
      this.toolbars.forEach(toolbar => {
        toolbar.setLayout(layout)
      })
    }
  }

  return toolbarManager
}

/**
 * 演示所有工具栏示例
 */
export function demonstrateAllToolbarExamples() {
  console.log('=== 所有工具栏示例演示 ===')

  const examples = {
    basic: createBasicToolbarExample(),
    form: createFormToolbarExample(),
    editor: createEditorToolbarExample(),
    dataTable: createDataTableToolbarExample(),
    vertical: createVerticalToolbarExample(),
    grid: createGridToolbarExample(),
    dynamic: createDynamicToolbarExample(),
    grouped: createGroupedToolbarExample(),
    responsive: createResponsiveToolbarExample(),
    custom: createCustomLayoutToolbarExample(),
    manager: createToolbarManagerExample()
  }

  console.log('工具栏示例创建完成:', Object.keys(examples))
  return examples
}

/**
 * 工具栏使用指南
 */
export function getToolbarUsageGuide() {
  return {
    title: 'Material 工具栏使用指南',
    sections: [
      {
        title: '基础使用',
        code: `
// 创建工具栏
const toolbar = NHAIObjectFactory.createMaterialToolbar()

// 配置工具栏
toolbar
  .horizontal()
  .setAlignment(ToolbarAlignment.START)
  .setSpacing(12)
  .setTheme('light')

// 添加按钮
toolbar
  .addButton('save', '保存', () => console.log('保存'))
  .addButton('cancel', '取消', () => console.log('取消'))
  .addSeparator('sep1')
  .addIconButton('add', 'add', () => console.log('添加'))
        `
      },
      {
        title: '布局类型',
        code: `
// 水平布局
toolbar.horizontal()

// 垂直布局
toolbar.vertical()

// 网格布局
toolbar.grid(4) // 4列

// 弹性布局
toolbar.flex()

// 自定义布局
toolbar.custom((items) => {
  // 自定义布局逻辑
  return items
})
        `
      },
      {
        title: '动态操作',
        code: `
// 添加项目
toolbar.addButton('new', '新建', onClick)

// 移除项目
toolbar.removeItem('new')

// 更新项目
toolbar.updateItem('new', { label: '新项目' })

// 显示/隐藏项目
toolbar.showItem('new')
toolbar.hideItem('new')

// 启用/禁用项目
toolbar.enableItem('new')
toolbar.disableItem('new')

// 重新排序
toolbar.reorderItems(['item1', 'item2', 'item3'])
        `
      },
      {
        title: '样式配置',
        code: `
// 设置样式
toolbar
  .setBackgroundColor('#ffffff')
  .setBorderColor('#e0e0e0')
  .setBorderRadius(8)
  .setShadow(true)
  .setSize('100%', 60)

// 设置主题
toolbar.setTheme('dark')
        `
      }
    ]
  }
}
