export interface Category {
  name: string
  expanded: boolean
  children: Example[]
}

export interface Example {
  id: string
  title: string
  description: string
  code: string
}

export const showcaseData: Category[] = [
  {
    name: '表单组件',
    expanded: true,
    children: [
      {
        id: 'button-demo',
        title: 'Button - 按钮组件',
        description: '创建不同类型的按钮',
        code: `const { NhaiButtonCommand } = window

const container = document.createElement('div')
container.style.padding = '20px'
container.style.display = 'flex'
container.style.gap = '10px'
container.style.flexWrap = 'wrap'

const btn1 = new NhaiButtonCommand('主要按钮')
btn1.setType('primary')
btn1.setOnClick(() => alert('主要按钮被点击！'))

const btn2 = new NhaiButtonCommand('成功按钮')
btn2.setType('success')
btn2.setOnClick(() => alert('成功按钮被点击！'))

const btn3 = new NhaiButtonCommand('警告按钮')
btn3.setType('warning')

const btn4 = new NhaiButtonCommand('危险按钮')
btn4.setType('danger')

container.appendChild(btn1.render())
container.appendChild(btn2.render())
container.appendChild(btn3.render())
container.appendChild(btn4.render())

return container`
      },
      {
        id: 'input-demo',
        title: 'Input - 输入框组件',
        description: '创建不同类型的输入框',
        code: `const { NhaiInputCommand } = window

const container = document.createElement('div')
container.style.padding = '20px'
container.style.display = 'flex'
container.style.flexDirection = 'column'
container.style.gap = '15px'

const input1 = new NhaiInputCommand()
input1.setPlaceholder('请输入用户名')
input1.setSize('large')

const input2 = new NhaiInputCommand()
input2.setPlaceholder('请输入密码')
input2.setType('password')
input2.setShowPassword(true)

const input3 = new NhaiInputCommand()
input3.setPlaceholder('请输入邮箱')
input3.setClearable(true)

container.appendChild(input1.render())
container.appendChild(input2.render())
container.appendChild(input3.render())

return container`
      },
      {
        id: 'select-demo',
        title: 'Select - 选择框组件',
        description: '创建下拉选择框',
        code: `const { NhaiSelectCommand } = window

const container = document.createElement('div')
container.style.padding = '20px'
container.style.display = 'flex'
container.style.flexDirection = 'column'
container.style.gap = '15px'

const select1 = new NhaiSelectCommand()
select1.setOptions([
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' }
])
select1.setPlaceholder('请选择一个选项')

const select2 = new NhaiSelectCommand()
select2.setOptions([
  { label: '红色', value: 'red' },
  { label: '蓝色', value: 'blue' },
  { label: '绿色', value: 'green' }
])
select2.setPlaceholder('选择颜色')
select2.setValue('blue')

container.appendChild(select1.render())
container.appendChild(select2.render())

return container`
      },
      {
        id: 'switch-demo',
        title: 'Switch - 开关组件',
        description: '创建开关组件',
        code: `const { NhaiSwitchCommand } = window

const container = document.createElement('div')
container.style.padding = '20px'
container.style.display = 'flex'
container.style.flexDirection = 'column'
container.style.gap = '15px'

const switch1 = new NhaiSwitchCommand()
switch1.setActiveText('开启')
switch1.setInactiveText('关闭')

const switch2 = new NhaiSwitchCommand()
switch2.setValue(true)
switch2.setActiveColor('#67c23a')

const switch3 = new NhaiSwitchCommand()
switch3.setValue(true)
switch3.setActiveText('开')
switch3.setInactiveText('关')

container.appendChild(switch1.render())
container.appendChild(switch2.render())
container.appendChild(switch3.render())

return container`
      },
      {
        id: 'checkbox-demo',
        title: 'Checkbox - 复选框组件',
        description: '创建复选框组件',
        code: `const { NhaiCheckboxCommand } = window

const container = document.createElement('div')
container.style.padding = '20px'
container.style.display = 'flex'
container.style.flexDirection = 'column'
container.style.gap = '15px'

const checkbox1 = new NhaiCheckboxCommand('同意用户协议')
checkbox1.setValue(true)

const checkbox2 = new NhaiCheckboxCommand('记住我')
checkbox2.setText('记住我的登录状态')

const checkbox3 = new NhaiCheckboxCommand('接收通知')
checkbox3.setText('允许接收系统通知')

container.appendChild(checkbox1.render())
container.appendChild(checkbox2.render())
container.appendChild(checkbox3.render())

return container`
      }
    ]
  },
  {
    name: '布局组件',
    expanded: true,
    children: [
      {
        id: 'absolute-panel-basic',
        title: 'AbsolutePanel - 基础绝对定位',
        description: '创建绝对定位面板，自由放置组件',
        code: `const { AbsolutePanelCommand, NhaiButtonCommand } = window

const panel = new AbsolutePanelCommand('800px', '600px')
panel.setBackgroundColor('#f0f0f0')

const button1 = new NhaiButtonCommand('按钮 1')
button1.setType('primary')
panel.addWidgetAt('btn1', button1, { x: 50, y: 50 }, { width: 100, height: 40 })

const button2 = new NhaiButtonCommand('按钮 2')
button2.setType('success')
panel.addWidgetAt('btn2', button2, { x: 200, y: 50 }, { width: 100, height: 40 })

const button3 = new NhaiButtonCommand('按钮 3')
button3.setType('warning')
panel.addWidgetAt('btn3', button3, { x: 50, y: 120 }, { width: 100, height: 40 })

return panel.render()`
      },
      {
        id: 'absolute-panel-multi',
        title: 'AbsolutePanel - 多组件布局',
        description: '在一个面板中放置多个不同类型的组件',
        code: `const { AbsolutePanelCommand, NhaiButtonCommand, NhaiInputCommand, NhaiSelectCommand } = window

const panel = new AbsolutePanelCommand('100%', '600px')
panel.setBackgroundColor('#f5f5f5')

const button = new NhaiButtonCommand('主要按钮')
button.setType('primary')
panel.addWidgetAt('btn1', button, { x: 50, y: 50 }, { width: 120, height: 40 })

const input = new NhaiInputCommand()
input.setPlaceholder('请输入文本...')
panel.addWidgetAt('input1', input, { x: 50, y: 110 }, { width: 250, height: 40 })

const select = new NhaiSelectCommand()
select.setOptions([
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' }
])
select.setPlaceholder('请选择...')
panel.addWidgetAt('select1', select, { x: 50, y: 170 }, { width: 250, height: 40 })

return panel.render()`
      },
      {
        id: 'split-panel-demo',
        title: 'SplitPanel - 分割面板',
        description: '创建可调整大小的分割面板',
        code: `const { NhaiSplitPanelCommand } = window

const splitPanel = new NhaiSplitPanelCommand()
splitPanel.setOrientation('horizontal')
splitPanel.setSplitPosition(50)
splitPanel.setMinSize(100)
splitPanel.setMaxSize(80)
splitPanel.setResizable(true)
splitPanel.setLeftContent('左侧内容区域')
splitPanel.setRightContent('右侧内容区域')

return splitPanel.render()`
      },
      {
        id: 'grid-demo',
        title: 'Grid - 网格布局',
        description: '创建网格布局容器',
        code: `const { NhaiGridCommand } = window

const grid = new NhaiGridCommand()
grid.setContainer(true)
grid.setSpacing(16)
grid.setDirection('row')
grid.setJustify('flex-start')
grid.setAlignItems('flex-start')
grid.setWrap('wrap')

// 创建一些子元素
const container = document.createElement('div')
container.appendChild(grid.render())

for (let i = 0; i < 6; i++) {
  const card = document.createElement('div')
  card.style.width = '200px'
  card.style.height = '100px'
  card.style.backgroundColor = '#1890ff'
  card.style.display = 'flex'
  card.style.alignItems = 'center'
  card.style.justifyContent = 'center'
  card.style.color = 'white'
  card.style.borderRadius = '4px'
  card.textContent = \`Card \${i + 1}\`
  grid.addChild(card)
}

return container`
      },
      {
        id: 'container-demo',
        title: 'Container - 容器组件',
        description: '创建响应式容器',
        code: `const { NhaiContainerCommand } = window

const container = new NhaiContainerCommand()
container.setMaxWidth('lg')
container.setFixed(false)
container.setDisableGutters(false)
container.setContent('这是一个响应式容器，最大宽度为大尺寸')

return container.render()`
      }
    ]
  },
  {
    name: 'UI 组件',
    expanded: true,
    children: [
      {
        id: 'card-demo',
        title: 'Card - 卡片组件',
        description: '创建卡片组件',
        code: `const { NhaiCardCommand } = window

const card = new NhaiCardCommand()
card.setHeader('卡片标题')
card.setShadow('hover')
card.setContent('这是卡片的内容区域，可以放置任何内容。')
card.setBodyStyle({ padding: '20px' })

return card.render()`
      },
      {
        id: 'breadcrumb-demo',
        title: 'Breadcrumb - 面包屑',
        description: '创建面包屑导航',
        code: `const { NhaiBreadcrumbCommand } = window

const breadcrumb = new NhaiBreadcrumbCommand([
  { label: '首页', href: '/' },
  { label: '产品列表', href: '/products' },
  { label: '详情', disabled: true }
])

return breadcrumb.render()`
      },
      {
        id: 'tabs-demo',
        title: 'Tabs - 标签页',
        description: '创建标签页组件',
        code: `const { NhaiTabsCommand } = window

const tabs = new NhaiTabsCommand([
  { name: 'tab1', label: '标签 1', content: '这是第一个标签页的内容' },
  { name: 'tab2', label: '标签 2', content: '这是第二个标签页的内容' },
  { name: 'tab3', label: '标签 3', content: '这是第三个标签页的内容' }
])

tabs.setValue('tab1')
tabs.setType('card')
tabs.setTabPosition('top')

return tabs.render()`
      },
      {
        id: 'menubar-demo',
        title: 'MenuBar - 菜单栏',
        description: '创建菜单栏组件',
        code: `const { NhaiMenuBarCommand } = window

const menuBar = new NhaiMenuBarCommand([
  { id: '1', label: '首页', icon: 'el-icon-home' },
  { id: '2', label: '关于', icon: 'el-icon-info' },
  { id: '3', label: '帮助', icon: 'el-icon-question' }
])

menuBar.setMode('horizontal')
menuBar.setDefaultActive('1')

return menuBar.render()`
      }
    ]
  }
]