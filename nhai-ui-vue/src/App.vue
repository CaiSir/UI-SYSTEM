<template>
  <div class="app">
    <h1>NHAI UI Vue - 组件库演示</h1>
    
    <div class="demo-section">
      <h2>1. 按钮组件</h2>
      <div class="demo-area">
        <VueButton text="主要按钮" type="primary" @click="handleButtonClick" />
        <VueButton text="成功按钮" type="success" />
        <VueButton text="警告按钮" type="warning" />
        <VueButton text="危险按钮" type="danger" />
      </div>
    </div>

    <div class="demo-section">
      <h2>2. 输入框组件</h2>
      <div class="demo-area">
        <VueInput v-model="inputValue" placeholder="请输入内容" />
        <VueInput v-model="passwordValue" type="password" placeholder="请输入密码" show-password />
      </div>
      <p>输入值: {{ inputValue }}</p>
    </div>

    <div class="demo-section">
      <h2>3. 选择框组件</h2>
      <div class="demo-area">
        <VueSelect v-model="selectValue" :options="selectOptions" placeholder="请选择" />
      </div>
      <p>选择值: {{ selectValue }}</p>
    </div>

    <div class="demo-section">
      <h2>4. Switch 组件</h2>
      <div class="demo-area">
        <VueSwitch v-model="switchValue" />
        <VueSwitch v-model="switchValue2" active-text="开启" inactive-text="关闭" />
      </div>
      <p>Switch 值: {{ switchValue }}</p>
    </div>

    <div class="demo-section">
      <h2>5. Checkbox 组件</h2>
      <div class="demo-area">
        <VueCheckbox v-model="checkboxValue" text="选项1" />
        <VueCheckbox v-model="checkboxValue2" text="选项2" />
      </div>
      <p>Checkbox 值: {{ checkboxValue }}</p>
    </div>

    <div class="demo-section">
      <h2>6. Card 组件</h2>
      <div class="demo-area">
        <VueCard header="卡片标题" content="这是卡片内容" />
      </div>
    </div>

    <div class="demo-section">
      <h2>7. Breadcrumb 面包屑</h2>
      <VueBreadcrumb 
        :items="breadcrumbItems" 
        separator=">"
        @item-click="handleBreadcrumbClick"
      />
    </div>

    <div class="demo-section">
      <h2>8. Tabs 标签页</h2>
      <VueTabs 
        v-model="activeTab"
        :items="tabItems"
        type="border-card"
        @tab-click="handleTabClick"
      />
      <p>当前标签: {{ activeTab }}</p>
    </div>

    <div class="demo-section">
      <h2>9. MenuBar 菜单栏</h2>
      <VueMenuBar 
        :items="menuItems"
        mode="horizontal"
        @select="handleMenuSelect"
      />
    </div>

    <div class="demo-section">
      <h2>10. Container 容器</h2>
      <VueContainer content="这是一个容器，最大宽度 lg" max-width="lg" />
      <VueContainer content="这是一个 xs 容器" max-width="xs" />
    </div>

    <div class="demo-section">
      <h2>11. Grid 网格布局</h2>
      <VueGrid :container="true" :spacing="2" justify="space-around">
        <div style="background: #f0f0f0; padding: 20px; border-radius: 4px;">网格项 1</div>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 4px;">网格项 2</div>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 4px;">网格项 3</div>
      </VueGrid>
    </div>

    <div class="demo-section">
      <h2>12. SplitPanel 分割面板</h2>
      <div style="height: 300px; border: 1px solid #ddd; border-radius: 4px;">
        <VueSplitPanel 
          orientation="horizontal"
          :split-position="50"
          left-content="左侧面板"
          right-content="右侧面板"
        />
      </div>
    </div>

    <div class="demo-section">
      <h2>13. LayoutBuilder 动态布局（声明式）</h2>
      <VueLayoutBuilder layout-type="vbox" :gap="16" padding="20px" background-color="#f8f9fa">
        <VueButton text="按钮1" type="primary" />
        <VueButton text="按钮2" type="success" />
        <VueButton text="按钮3" type="warning" />
      </VueLayoutBuilder>
    </div>

    <div class="demo-section">
      <h2>14. 自定义工具栏布局</h2>
      <div ref="customToolbar" style="padding: 20px; background: #f5f5f5; border-radius: 4px;"></div>
    </div>

    <div class="demo-section">
      <h2>15. 完整的应用布局示例</h2>
      <div ref="fullAppLayout" style="height: 400px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;"></div>
    </div>

    <div class="demo-section">
      <h2>16. 命令式使用</h2>
      <div ref="commandDemo" class="demo-area"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  VueButton, 
  VueInput,
  VueSelect,
  VueSwitch,
  VueCheckbox,
  VueCard,
  VueBreadcrumb,
  VueTabs,
  VueMenuBar,
  VueContainer,
  VueGrid,
  VueSplitPanel,
  VueLayoutBuilder
} from './components'
import {
  VueButtonCommand, 
  VueInputCommand, 
  VueSelectCommand,
  VueSwitchCommand,
  VueCheckboxCommand,
  VueCardCommand,
  VueBreadcrumbCommand,
  VueTabsCommand,
  VueMenuBarCommand,
  VueContainerCommand,
  VueGridCommand,
  VueSplitPanelCommand,
  VueLayoutBuilderCommand
} from './components'
import {
  createSeparator,
  createBlankLine
} from './lib'

const inputValue = ref('')
const passwordValue = ref('')
const selectValue = ref('')
const selectOptions = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
])
const switchValue = ref(true)
const switchValue2 = ref(false)
const checkboxValue = ref(false)
const checkboxValue2 = ref(true)
const activeTab = ref('tab1')
const breadcrumbItems = ref([
  { label: '首页', href: '/' },
  { label: '分类', href: '/category' },
  { label: '详情' }
])
const tabItems = ref([
  { name: 'tab1', label: '标签1', content: '这是标签1的内容' },
  { name: 'tab2', label: '标签2', content: '这是标签2的内容' },
  { name: 'tab3', label: '标签3', content: '这是标签3的内容' }
])
const menuItems = ref([
  {
    id: '1',
    label: '首页',
    icon: 'HomeFilled'
  },
  {
    id: '2',
    label: '产品',
    icon: 'ShoppingBag'
  },
  {
    id: '3',
    label: '关于',
    icon: 'InfoFilled',
    children: [
      { id: '3-1', label: '公司简介' },
      { id: '3-2', label: '联系方式' }
    ]
  }
])

const commandDemo = ref<HTMLElement>()
const customToolbar = ref<HTMLElement>()
const fullAppLayout = ref<HTMLElement>()

const handleBreadcrumbClick = (item: any, index: number) => {
  console.log('Breadcrumb clicked:', item, index)
}

const handleTabClick = (tab: any) => {
  console.log('Tab clicked:', tab)
}

const handleMenuSelect = (index: string, indexPath: string[]) => {
  console.log('Menu selected:', index, indexPath)
}

const handleButtonClick = () => {
  console.log('声明式按钮点击')
}

onMounted(() => {
  // 14. 创建自定义工具栏布局
  if (customToolbar.value) {
    const toolbar = new VueLayoutBuilderCommand('hbox')
    toolbar.setDirection('row')
    toolbar.setGap('12px')
    toolbar.setPadding('12px')
    
    const saveBtn = new VueButtonCommand('保存')
    saveBtn.setType('primary')
    toolbar.addWidget('save', saveBtn)
    
    const cancelBtn = new VueButtonCommand('取消')
    toolbar.addWidget('cancel', cancelBtn)
    
    const deleteBtn = new VueButtonCommand('删除')
    deleteBtn.setType('danger')
    toolbar.addWidget('delete', deleteBtn)
    
    // 使用 UIHelpers 创建分隔符，无需关心 document.createElement
    const separator = createSeparator('vertical')
    toolbar.addElement('sep', separator)
    
    const editBtn = new VueButtonCommand('编辑')
    editBtn.setType('warning')
    toolbar.addWidget('edit', editBtn)
    
    customToolbar.value.appendChild(toolbar.render())
  }

  // 15. 创建完整的应用布局
  if (fullAppLayout.value) {
    // 外层容器
    const appLayout = new VueLayoutBuilderCommand('vbox')
    appLayout.setHeight('100%')
    
    // 顶部菜单栏
    const topMenu = new VueMenuBarCommand([
      { id: 'home', label: '首页' },
      { id: 'products', label: '产品' },
      { id: 'about', label: '关于' }
    ])
    topMenu.setMode('horizontal')
    appLayout.addWidget('menu', topMenu)
    
    // 中间内容区（水平布局）
    const contentLayout = new VueLayoutBuilderCommand('hbox')
    contentLayout.setDirection('row')
    contentLayout.setSpacing(1)
    
    // 左侧面板
    const leftPanel = new VueCardCommand('左侧面板', '这里可以放置工具列表')
    
    // 主内容区
    const mainContent = new VueCardCommand('主内容区', '这里放置主要内容')
    
    contentLayout.addWidget('left', leftPanel)
    contentLayout.addWidget('main', mainContent)
    
    // 将中间内容区添加到外层布局
    appLayout.addWidget('content', contentLayout)
    
    fullAppLayout.value.appendChild(appLayout.render())
  }

  // 16. 命令式创建各种组件
  const button = new VueButtonCommand('命令式按钮')
  button.setType('primary')
  button.setOnClick(() => console.log('命令式按钮点击'))
  
  const input = new VueInputCommand('命令式输入框')
  input.setValue('默认值')
  input.setOnChange((value) => console.log('输入值变化:', value))

  const select = new VueSelectCommand('命令式选择')
  select.setOptions([
    { label: '选项A', value: 'a' },
    { label: '选项B', value: 'b' }
  ])
  select.setOnChange((value) => console.log('选择值变化:', value))

  const switch_ = new VueSwitchCommand(true)
  switch_.setActiveText('开')
  switch_.setInactiveText('关')
  switch_.setOnChange((value) => console.log('Switch变化:', value))

  const checkbox = new VueCheckboxCommand('命令式Checkbox')
  checkbox.setValue(false)
  checkbox.setOnChange((value) => console.log('Checkbox变化:', value))

  const card = new VueCardCommand('卡片标题', '卡片内容')

  const breadcrumb = new VueBreadcrumbCommand([
    { label: '首页', href: '/' },
    { label: '产品', href: '/products' },
    { label: '详情' }
  ])
  breadcrumb.setSeparator('>')

  const tabs = new VueTabsCommand([
    { name: 'tab1', label: '命令式标签1', content: '内容1' },
    { name: 'tab2', label: '命令式标签2', content: '内容2' }
  ])
  tabs.setType('card')

  const menuBar = new VueMenuBarCommand([
    { id: '1', label: '命令式菜单1' },
    { id: '2', label: '命令式菜单2' }
  ])
  menuBar.setMode('vertical')

  const container = new VueContainerCommand('命令式容器内容')
  container.setMaxWidth('md')

  const grid = new VueGridCommand(true)
  grid.setSpacing(3)
  grid.setJustify('space-between')

  const splitPanel = new VueSplitPanelCommand('左侧内容', '右侧内容', 'horizontal')
  splitPanel.setSplitPosition(40)

  // 命令式布局构建器
  const layoutBuilder = new VueLayoutBuilderCommand('vbox')
  layoutBuilder.setSpacing(2)
  layoutBuilder.setPadding('20px')
  layoutBuilder.setBackgroundColor('#f8f9fa')
  
  // 添加组件（使用 addWidget，自动调用 render）
  const btn1 = new VueButtonCommand('布局按钮1')
  btn1.setType('primary')
  layoutBuilder.addWidget('btn1', btn1)

  const btn2 = new VueButtonCommand('布局按钮2')
  btn2.setType('success')
  layoutBuilder.addWidget('btn2', btn2)

  const input1 = new VueInputCommand('布局输入框')
  layoutBuilder.addWidget('input1', input1)
  
  if (commandDemo.value) {
    commandDemo.value.appendChild(button.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(input.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(select.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(switch_.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(checkbox.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(card.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(breadcrumb.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(tabs.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(menuBar.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(container.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(grid.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    commandDemo.value.appendChild(splitPanel.render())
    commandDemo.value.appendChild(createBlankLine())
    commandDemo.value.appendChild(createBlankLine())
    
    // 创建布局容器（使用 LayoutBuilder 代替 createElement）
    const layoutContainerWrapper = new VueLayoutBuilderCommand('vbox')
    layoutContainerWrapper.setPadding('20px')
    layoutContainerWrapper.setBackgroundColor('#f8f9fa')
    layoutContainerWrapper.setStyle({
      marginTop: '20px',
      borderRadius: '4px'
    })
    const layoutContainer = layoutContainerWrapper.render()
    
    // 添加布局构建器的子组件
    layoutBuilder.getItems().forEach(item => {
      if (item.element) {
        layoutContainer.appendChild(item.element.cloneNode(true) as HTMLElement)
        layoutContainer.appendChild(createBlankLine())
      }
    })
    
    commandDemo.value.appendChild(layoutContainer)
  }
})
</script>

<style scoped>
.app {
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-section {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
}

.demo-area {
  margin-top: 20px;
}

.demo-area :deep(.el-button),
.demo-area :deep(.el-input) {
  margin-right: 10px;
}

.demo-area :deep(select) {
  margin-right: 10px;
}
</style>

