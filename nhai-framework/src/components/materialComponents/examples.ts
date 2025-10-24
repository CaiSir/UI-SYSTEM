/**
 * Material Components 使用示例
 * 展示如何使用基于 Materialize CSS 框架的命令式 API 组件
 */

import { NHAIObjectFactory, ButtonColor, ButtonSize } from '../../factory/NHAIFactory'

// 示例：创建基础交互组件
export function createBasicComponentsExample() {
  // 创建按钮
  const button = NHAIObjectFactory.createMaterialButton('点击我')
  button.setVariant('raised')
  button.setColor(ButtonColor.BLUE)
  button.setSize(ButtonSize.MEDIUM)
  button.setOnClick(() => {
    console.log('按钮被点击了')
  })

  // 创建输入框
  const input = NHAIObjectFactory.createMaterialInput()
  input.setLabel('用户名')
  input.setPlaceholder('请输入用户名')
  input.setRequired(true)
  input.setOnChange((value) => {
    console.log('输入值:', value)
  })

  return { button, input }
}

// 示例：创建数据展示组件
export function createDataComponentsExample() {
  // 创建卡片
  const card = NHAIObjectFactory.createMaterialCard()
  card.setTitle('用户信息')
  card.setSubtitle('基本信息')
  card.setContent('这是一个用户信息卡片')
  card.setElevation(2)
  card.setSize('medium')

  // 添加操作按钮
  card.addAction({
    label: '编辑',
    onClick: () => console.log('编辑用户'),
    variant: 'outlined',
    color: 'primary'
  })

  card.addAction({
    label: '删除',
    onClick: () => console.log('删除用户'),
    variant: 'contained',
    color: 'error'
  })

  // 创建表格
  const table = NHAIObjectFactory.createMaterialTable()
  table.setColumns([
    { key: 'name', title: '姓名', dataIndex: 'name' },
    { key: 'age', title: '年龄', dataIndex: 'age' },
    { key: 'email', title: '邮箱', dataIndex: 'email' }
  ])

  table.setDataSource([
    { name: '张三', age: 25, email: 'zhangsan@example.com' },
    { name: '李四', age: 30, email: 'lisi@example.com' },
    { name: '王五', age: 28, email: 'wangwu@example.com' }
  ])

  table.setPagination(true)
  table.setPageSize(10)
  table.setOnRowClick((record, index) => {
    console.log('点击行:', record, index)
  })

  return { card, table }
}

// 示例：创建布局组件
export function createLayoutComponentsExample() {
  // 创建容器
  const container = NHAIObjectFactory.createMaterialContainer()
  container.setMaxWidth('md')
  container.setFixed(false)

  // 创建网格
  const grid = NHAIObjectFactory.createMaterialGrid()
  grid.setContainer(true)
  grid.setSpacing(2)
  grid.setDirection('row')

  // 添加网格项
  grid.addItem({
    xs: 12,
    sm: 6,
    md: 4,
    component: NHAIObjectFactory.createMaterialButton('按钮1')
  })

  grid.addItem({
    xs: 12,
    sm: 6,
    md: 4,
    component: NHAIObjectFactory.createMaterialButton('按钮2')
  })

  grid.addItem({
    xs: 12,
    sm: 6,
    md: 4,
    component: NHAIObjectFactory.createMaterialButton('按钮3')
  })

  return { container, grid }
}

// 示例：创建导航组件
export function createNavigationComponentsExample() {
  // 创建菜单
  const menu = NHAIObjectFactory.createMaterialMenu()
  menu.setMode('horizontal')
  menu.setTheme('light')
  menu.setItems([
    {
      id: 'home',
      label: '首页',
      onClick: () => console.log('导航到首页')
    },
    {
      id: 'about',
      label: '关于',
      onClick: () => console.log('导航到关于页')
    },
    {
      id: 'contact',
      label: '联系',
      children: [
        {
          id: 'email',
          label: '邮箱',
          onClick: () => console.log('联系邮箱')
        },
        {
          id: 'phone',
          label: '电话',
          onClick: () => console.log('联系电话')
        }
      ]
    }
  ])

  // 创建标签页
  const tabs = NHAIObjectFactory.createMaterialTabs()
  tabs.setVariant('standard')
  tabs.setColor('primary')
  tabs.setCentered(true)

  tabs.addItem({
    id: 'tab1',
    label: '标签页1',
    content: '这是第一个标签页的内容'
  })

  tabs.addItem({
    id: 'tab2',
    label: '标签页2',
    content: '这是第二个标签页的内容'
  })

  tabs.addItem({
    id: 'tab3',
    label: '标签页3',
    content: '这是第三个标签页的内容',
    closable: true
  })

  return { menu, tabs }
}

// 示例：创建反馈组件
export function createFeedbackComponentsExample() {
  // 创建消息组件
  const message = NHAIObjectFactory.createMaterialMessage()
  message.setPosition('top')
  message.setMaxCount(3)
  message.setDuration(3000)

  // 显示不同类型的消息
  message.success('操作成功！')
  message.error('操作失败！')
  message.warning('请注意！')
  message.info('提示信息')

  // 创建对话框
  const dialog = NHAIObjectFactory.createMaterialDialog()
  dialog.setTitle('确认删除')
  dialog.setContent('确定要删除这个项目吗？此操作不可撤销。')
  dialog.setSize('sm')
  dialog.setClosable(true)
  dialog.setMaskClosable(true)

  dialog.addAction({
    label: '取消',
    onClick: () => console.log('取消删除'),
    variant: 'text',
    color: 'primary'
  })

  dialog.addAction({
    label: '删除',
    onClick: () => console.log('确认删除'),
    variant: 'contained',
    color: 'error'
  })

  // 创建加载组件
  const loading = NHAIObjectFactory.createMaterialLoading()
  loading.setLoading(true)
  loading.setVariant('circular')
  loading.setSize('medium')
  loading.setColor('primary')
  loading.setText('加载中...')
  loading.setOverlay(true)

  return { message, dialog, loading }
}

// 示例：创建工具组件
export function createUtilityComponentsExample() {
  // 创建工具提示
  const tooltip = NHAIObjectFactory.createMaterialTooltip()
  tooltip.setTitle('这是一个工具提示')
  tooltip.setPlacement('top')
  tooltip.setArrow(true)
  tooltip.setSize('medium')
  tooltip.setColor('default')

  // 添加触发器
  const button = NHAIObjectFactory.createMaterialButton('悬停查看提示')
  tooltip.addChild(button)

  // 创建颜色选择器
  const colorPicker = NHAIObjectFactory.createMaterialColorPicker()
  colorPicker.setValue('#1976d2')
  colorPicker.setSize('medium')
  colorPicker.setVariant('outlined')
  colorPicker.setFormat('hex')
  colorPicker.setShowAlpha(false)

  colorPicker.setOnChange((value) => {
    console.log('选择的颜色:', value)
  })

  return { tooltip, colorPicker }
}

// 完整示例：创建一个完整的应用界面
export function createCompleteAppExample() {
  // 创建主容器
  const app = NHAIObjectFactory.createMaterialContainer()
  app.setMaxWidth('lg')

  // 创建头部
  const header = NHAIObjectFactory.createMaterialCard()
  header.setTitle('Material UI 组件示例')
  header.setSubtitle('基于 Svelte + Material UI 的命令式 API')
  header.setElevation(1)

  // 创建内容区域
  const content = NHAIObjectFactory.createMaterialGrid()
  content.setContainer(true)
  content.setSpacing(3)

  // 添加各种组件示例
  const { button, input } = createBasicComponentsExample()
  const { card, table } = createDataComponentsExample()
  const { menu, tabs } = createNavigationComponentsExample()

  content.addItem({
    xs: 12,
    sm: 6,
    md: 4,
    component: button
  })

  content.addItem({
    xs: 12,
    sm: 6,
    md: 4,
    component: input
  })

  content.addItem({
    xs: 12,
    sm: 6,
    md: 4,
    component: card
  })

  content.addItem({
    xs: 12,
    component: table
  })

  content.addItem({
    xs: 12,
    component: menu
  })

  content.addItem({
    xs: 12,
    component: tabs
  })

  // 组装应用
  app.addChild(header)
  app.addChild(content)

  return app
}

// 导出所有示例
export const MaterialComponentsExamples = {
  createBasicComponentsExample,
  createDataComponentsExample,
  createLayoutComponentsExample,
  createNavigationComponentsExample,
  createFeedbackComponentsExample,
  createUtilityComponentsExample,
  createCompleteAppExample
}
