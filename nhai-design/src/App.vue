<template>
  <div id="app">
    <div class="app-header">
      <h1>NHAI - 框架无关UI组件系统</h1>
      <p>支持Vue、React、Svelte、原生JavaScript - 在线编辑预览</p>
    </div>
    
    <div class="main-container">
      <!-- 左侧树形目录 -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>示例目录</h3>
          <div class="framework-selector">
            <label>当前框架:</label>
            <select v-model="currentFramework" @change="switchFramework(currentFramework)">
              <option v-for="framework in frameworks" :key="framework.name" :value="framework.name">
                {{ framework.label }}
              </option>
            </select>
          </div>
          <div class="mode-selector">
            <label>显示模式:</label>
            <select v-model="currentMode" @change="switchMode(currentMode)">
              <option value="examples">示例浏览</option>
              <option value="editor">在线编辑</option>
            </select>
          </div>
        </div>
        
        <div class="tree-container">
          <div 
            v-for="category in treeData" 
            :key="category.name"
            class="tree-category"
          >
            <div 
              class="category-header"
              @click="toggleCategory(category)"
            >
              <span class="expand-icon" :class="{ expanded: category.expanded }">
                {{ category.expanded ? '▼' : '▶' }}
              </span>
              <span class="category-name">{{ category.name }}</span>
            </div>
            
            <div v-if="category.expanded" class="category-items">
              <div 
                v-for="componentType in category.children" 
                :key="componentType.name"
                class="component-type"
              >
                <div 
                  class="component-type-header"
                  @click="toggleComponentType(componentType)"
                >
                  <span class="expand-icon" :class="{ expanded: componentType.expanded }">
                    {{ componentType.expanded ? '▼' : '▶' }}
                  </span>
                  <span class="component-type-name">{{ componentType.name }}</span>
                  <span class="component-count">({{ componentType.children.length }})</span>
                </div>
                
                <div v-if="componentType.expanded" class="component-examples">
                  <div 
                    v-for="subType in componentType.children" 
                    :key="subType.id"
                class="tree-item"
                    :class="{ active: currentExampleId === subType.id }"
                    @click="selectExample(subType)"
                  >
                    <span class="item-title">{{ subType.title }}</span>
                    <span class="item-description">{{ subType.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧内容区 -->
      <main class="examples-content">
        <!-- 示例浏览模式 -->
        <div v-if="currentMode === 'examples'" class="example-mode">
          <div v-if="currentExampleData" class="example-container">
            <!-- 示例标题 -->
            <div class="example-header">
              <h2>{{ currentExampleData.title }}</h2>
              <p>{{ currentExampleData.description }}</p>
            <div class="framework-info">
              <span class="framework-badge">{{ currentFrameworkLabel }}</span>
              <span class="framework-status" :class="{ active: adapterRegistered }">
                {{ adapterRegistered ? '✓ 适配器已注册' : '⚠ 适配器未注册' }}
              </span>
            </div>
            </div>

            <!-- 示例演示区域 -->
            <div class="example-demo">
              <h3>演示效果</h3>
              <div ref="demoArea" class="demo-area"></div>
            </div>

            <!-- 代码示例 -->
            <div class="example-code">
              <div class="code-header">
                <h3>代码示例</h3>
                <button @click="copyCode" class="copy-button">复制代码</button>
                <button @click="loadToEditor" class="load-editor-button">在线编辑</button>
              </div>
              <pre><code>{{ currentExampleData.code }}</code></pre>
            </div>
          </div>
          
          <div v-else class="welcome-section">
            <h2>欢迎使用NHAI对象系统</h2>
            <p>请从左侧目录选择一个示例进行查看，或切换到在线编辑模式</p>
            <div class="features">
              <div class="feature-item">
                <h4>🎯 框架无关</h4>
                <p>支持Vue、React、Svelte、原生JavaScript</p>
              </div>
              <div class="feature-item">
                <h4>🎨 统一API</h4>
                <p>所有框架使用相同的组件API</p>
              </div>
              <div class="feature-item">
                <h4>⚡ 自动检测</h4>
                <p>自动检测运行环境并选择合适的适配器</p>
              </div>
              <div class="feature-item">
                <h4>💻 在线编辑</h4>
                <p>实时编辑和预览NHAI组件代码</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 在线编辑模式 -->
        <div v-else-if="currentMode === 'editor'" class="editor-mode">
          <OnlineEditor :initial-code="editorCode" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { 
  NHAIFrameworkRegistry, 
  VanillaAdapter, 
  VueAdapter, 
  ReactAdapter, 
  SvelteAdapter,
  nhaiFactory as NHAIObjectFactory
} from 'nhai-framework'
import OnlineEditor from './components/OnlineEditor.vue'

// 响应式变量
const currentFramework = ref('vanilla')
const currentMode = ref('examples')
const demoArea = ref<HTMLElement>()
const currentExampleId = ref<string | null>(null)
const currentExampleData = ref<any>(null)
const adapterRegistered = ref(false)

// 编辑器相关
const codeEditor = ref()
const editorCode = ref(`// NHAI 组件示例
const container = NHAIObjectFactory.createContainer()

// 创建按钮
const button = NHAIObjectFactory.createButton('点击我')
button.setVariant('primary')
button.setWidth(120)
button.setHeight(40)
button.setOnClick(() => alert('按钮被点击！'))

// 创建标签
const label = NHAIObjectFactory.createLabel('欢迎使用NHAI')
label.setFontSize(16)
label.setColor('#2c3e50')

// 添加到容器
container.addChild(label)
container.addChild(button)

// 渲染到预览区域
const element = container.render()
document.querySelector('.preview-area')?.appendChild(element)`)

// 执行状态（保留用于示例加载）
const isExecuting = ref(false)
const executionError = ref('')

// 支持的框架
const frameworks = [
  { name: 'vanilla', label: '原生JavaScript' },
  { name: 'vue', label: 'Vue (示例)' },
  { name: 'react', label: 'React' },
  { name: 'svelte', label: 'Svelte' }
]

// 计算属性
const currentFrameworkLabel = computed(() => {
  return frameworks.find(f => f.name === currentFramework.value)?.label || '未知'
})

// 示例创建函数
const createButtonDemo = () => {
  if (!demoArea.value) return

  try {
    console.log('开始创建按钮演示...')
    
    // 检查适配器
    const adapter = NHAIFrameworkRegistry.getCurrent()
    console.log('当前适配器:', adapter)
    
    if (!adapter) {
      throw new Error('没有注册的适配器')
    }
    
    const button = NHAIObjectFactory.createButton('点击我')
    console.log('按钮创建成功:', button)
    
    button.setVariant('primary')
    button.setWidth(120)
    button.setHeight(40)
    button.setOnClick(() => alert('按钮被点击！'))
    button.setStyle({
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 'bold'
    })

    console.log('按钮属性设置完成')
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(button)
    console.log('容器创建并添加按钮')

    demoArea.value.innerHTML = ''
    console.log('开始渲染...')
    
    const element = container.render()
    console.log('渲染结果:', element)
    
    demoArea.value.appendChild(element)
    console.log('按钮已添加到DOM')
    
  } catch (error) {
    console.error('创建按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error.message}<br>详细错误: ${error.stack}</div>`
  }
}

const createLabelDemo = () => {
  if (!demoArea.value) return

  try {
    const label = NHAIObjectFactory.createLabel('欢迎使用NHAI对象系统')
    label.setFontSize(18)
    label.setFontWeight('bold')
    label.setColor('#2c3e50')
    label.setAlignment('center')
    label.setStyle({
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    })

    const container = NHAIObjectFactory.createContainer()
    container.addChild(label)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建标签演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createInputDemo = () => {
  if (!demoArea.value) return

  try {
    const input = NHAIObjectFactory.createInput()
    input.setPlaceholder('请输入内容...')
    input.setWidth(300)
    input.setType('text')
    input.setOnChange((value) => console.log('输入值:', value))
    input.setStyle({
      borderRadius: '4px',
      border: '2px solid #e0e0e0',
      transition: 'border-color 0.3s ease'
    })

    const container = NHAIObjectFactory.createContainer()
    container.addChild(input)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建输入框演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createCardDemo = () => {
  if (!demoArea.value) return

  try {
    const card = NHAIObjectFactory.createCard()
    card.setTitle('示例卡片')
    card.setSubtitle('这是一个NHAI卡片组件')
    card.setElevation(2)
    
    const button = NHAIObjectFactory.createButton('卡片按钮')
    button.setVariant('success')
    button.setOnClick(() => alert('卡片中的按钮被点击！'))
    
    card.addChild(button)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(card)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建卡片演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createVBoxDemo = () => {
  if (!demoArea.value) return

  try {
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(10)
    
    const label1 = NHAIObjectFactory.createLabel('第一个标签')
    const label2 = NHAIObjectFactory.createLabel('第二个标签')
    const button = NHAIObjectFactory.createButton('垂直布局按钮')
    button.setVariant('info')
    
    vbox.addChild(label1)
    vbox.addChild(label2)
    vbox.addChild(button)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建垂直布局演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createHBoxDemo = () => {
  if (!demoArea.value) return

  try {
    const hbox = NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(15)
    
    const button1 = NHAIObjectFactory.createButton('按钮1')
    button1.setVariant('primary')
    
    const button2 = NHAIObjectFactory.createButton('按钮2')
    button2.setVariant('secondary')
    
    const button3 = NHAIObjectFactory.createButton('按钮3')
    button3.setVariant('success')
    
    hbox.addChild(button1)
    hbox.addChild(button2)
    hbox.addChild(button3)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(hbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建水平布局演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createComplexDemo = () => {
  if (!demoArea.value) return

  try {
    const window = NHAIObjectFactory.createWindow('复杂示例')
    
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const titleLabel = NHAIObjectFactory.createLabel('复杂布局示例')
    titleLabel.setFontSize(20)
    titleLabel.setFontWeight('bold')
    titleLabel.setAlignment('center')
    
    const hbox = NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(10)
    
    const input = NHAIObjectFactory.createInput()
    input.setPlaceholder('输入内容...')
    input.setWidth(200)
    
    const button = NHAIObjectFactory.createButton('提交')
    button.setVariant('primary')
    button.setOnClick(() => alert('提交按钮被点击！'))
    
    hbox.addChild(input)
    hbox.addChild(button)
    
    const card = NHAIObjectFactory.createCard()
    card.setTitle('信息卡片')
    card.setSubtitle('这是一个包含在复杂布局中的卡片')
    
    vbox.addChild(titleLabel)
    vbox.addChild(hbox)
    vbox.addChild(card)
    
    window.setLayout(vbox)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(window)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建复杂演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createMethodsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const button = NHAIObjectFactory.createButton('动态按钮')
    button.setVariant('warning')
    button.setWidth(150)
    button.setHeight(50)
    
    let clickCount = 0
    button.setOnClick(() => {
      clickCount++
      button.setText(`点击了 ${clickCount} 次`)
      button.setStyle({
        backgroundColor: clickCount % 2 === 0 ? '#ffc107' : '#fd7e14'
      })
      
      // 重新渲染
      demoArea.value.innerHTML = ''
      const element = container.render()
      demoArea.value.appendChild(element)
    })
    
    container.addChild(button)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建方法演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createStyleControlDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const button1 = NHAIObjectFactory.createButton('全局样式按钮')
    button1.setVariant('primary')
    button1.setStyle({
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    })
    
    const button2 = NHAIObjectFactory.createButton('自定义样式按钮')
    button2.setVariant('secondary')
    button2.setStyle({
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      border: 'none',
      borderRadius: '25px',
      color: 'white',
      fontSize: '14px',
      padding: '12px 24px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
      transform: 'scale(1.05)',
      transition: 'all 0.3s ease'
    })
    
    container.addChild(button1)
    container.addChild(button2)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建样式控制演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 新增的按钮变体演示函数
const createButtonVariantsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const primaryButton = NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(120)
    primaryButton.setHeight(40)
    
    const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(120)
    secondaryButton.setHeight(40)
    
    const successButton = NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(120)
    successButton.setHeight(40)
    
    const warningButton = NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(120)
    warningButton.setHeight(40)
    
    const dangerButton = NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(120)
    dangerButton.setHeight(40)
    
    container.addChild(primaryButton)
    container.addChild(secondaryButton)
    container.addChild(successButton)
    container.addChild(warningButton)
    container.addChild(dangerButton)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建按钮变体演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createButtonSizesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const smallButton = NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })
    
    const mediumButton = NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })
    
    const largeButton = NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })
    
    container.addChild(smallButton)
    container.addChild(mediumButton)
    container.addChild(largeButton)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建按钮尺寸演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createButtonStatesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const normalButton = NHAIObjectFactory.createButton('正常状态')
    normalButton.setVariant('primary')
    normalButton.setWidth(120)
    normalButton.setHeight(40)
    
    const disabledButton = NHAIObjectFactory.createButton('禁用状态')
    disabledButton.setVariant('primary')
    disabledButton.setWidth(120)
    disabledButton.setHeight(40)
    disabledButton.setDisabled(true)
    
    const loadingButton = NHAIObjectFactory.createButton('加载中...')
    loadingButton.setVariant('primary')
    loadingButton.setWidth(120)
    loadingButton.setHeight(40)
    loadingButton.setStyle({ opacity: 0.7 })
    
    container.addChild(normalButton)
    container.addChild(disabledButton)
    container.addChild(loadingButton)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建按钮状态演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 新增的标签变体演示函数
const createLabelVariantsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const titleLabel = NHAIObjectFactory.createLabel('标题标签')
    titleLabel.setFontSize(24)
    titleLabel.setFontWeight('bold')
    titleLabel.setColor('#2c3e50')
    
    const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
    subtitleLabel.setFontSize(18)
    subtitleLabel.setFontWeight('600')
    subtitleLabel.setColor('#34495e')
    
    const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
    bodyLabel.setFontSize(14)
    bodyLabel.setColor('#7f8c8d')
    
    const captionLabel = NHAIObjectFactory.createLabel('说明文字')
    captionLabel.setFontSize(12)
    captionLabel.setColor('#95a5a6')
    captionLabel.setStyle({ fontStyle: 'italic' })
    
    container.addChild(titleLabel)
    container.addChild(subtitleLabel)
    container.addChild(bodyLabel)
    container.addChild(captionLabel)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建标签变体演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createLabelAlignmentsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const leftLabel = NHAIObjectFactory.createLabel('左对齐标签')
    leftLabel.setAlignment('left')
    leftLabel.setWidth(200)
    leftLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const centerLabel = NHAIObjectFactory.createLabel('居中对齐标签')
    centerLabel.setAlignment('center')
    centerLabel.setWidth(200)
    centerLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const rightLabel = NHAIObjectFactory.createLabel('右对齐标签')
    rightLabel.setAlignment('right')
    rightLabel.setWidth(200)
    rightLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    container.addChild(leftLabel)
    container.addChild(centerLabel)
    container.addChild(rightLabel)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建标签对齐演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 新增的输入框变体演示函数
const createInputTypesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const textInput = NHAIObjectFactory.createInput()
    textInput.setPlaceholder('文本输入框')
    textInput.setType('text')
    textInput.setWidth(200)
    
    const emailInput = NHAIObjectFactory.createInput()
    emailInput.setPlaceholder('邮箱输入框')
    emailInput.setType('email')
    emailInput.setWidth(200)
    
    const passwordInput = NHAIObjectFactory.createInput()
    passwordInput.setPlaceholder('密码输入框')
    passwordInput.setType('password')
    passwordInput.setWidth(200)
    
    const numberInput = NHAIObjectFactory.createInput()
    numberInput.setPlaceholder('数字输入框')
    numberInput.setType('number')
    numberInput.setWidth(200)
    
    container.addChild(textInput)
    container.addChild(emailInput)
    container.addChild(passwordInput)
    container.addChild(numberInput)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建输入框类型演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createInputStatesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const normalInput = NHAIObjectFactory.createInput()
    normalInput.setPlaceholder('正常状态')
    normalInput.setWidth(200)
    
    const disabledInput = NHAIObjectFactory.createInput()
    disabledInput.setPlaceholder('禁用状态')
    disabledInput.setWidth(200)
    disabledInput.setDisabled(true)
    
    const readonlyInput = NHAIObjectFactory.createInput()
    readonlyInput.setPlaceholder('只读状态')
    readonlyInput.setWidth(200)
    readonlyInput.setValue('只读内容')
    readonlyInput.setReadonly(true)
    
    container.addChild(normalInput)
    container.addChild(disabledInput)
    container.addChild(readonlyInput)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建输入框状态演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 综合演示函数 - 将同一控件的所有变体合并
const createComprehensiveButtonDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 基础按钮
    const basicButton = NHAIObjectFactory.createButton('基础按钮')
    basicButton.setVariant('primary')
    basicButton.setWidth(120)
    basicButton.setHeight(40)
    basicButton.setOnClick(() => alert('基础按钮被点击！'))
    
    // 按钮变体
    const primaryButton = NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(100)
    primaryButton.setHeight(35)
    
    const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(100)
    secondaryButton.setHeight(35)
    
    const successButton = NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(100)
    successButton.setHeight(35)
    
    const warningButton = NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(100)
    warningButton.setHeight(35)
    
    const dangerButton = NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(100)
    dangerButton.setHeight(35)
    
    // 按钮尺寸
    const smallButton = NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })
    
    const mediumButton = NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })
    
    const largeButton = NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })
    
    // 按钮状态
    const normalButton = NHAIObjectFactory.createButton('正常状态')
    normalButton.setVariant('primary')
    normalButton.setWidth(100)
    normalButton.setHeight(35)
    
    const disabledButton = NHAIObjectFactory.createButton('禁用状态')
    disabledButton.setVariant('primary')
    disabledButton.setWidth(100)
    disabledButton.setHeight(35)
    disabledButton.setDisabled(true)
    
    const loadingButton = NHAIObjectFactory.createButton('加载中...')
    loadingButton.setVariant('primary')
    loadingButton.setWidth(100)
    loadingButton.setHeight(35)
    loadingButton.setStyle({ opacity: 0.7 })
    
    // 使用布局来组织按钮
    const vbox1 = NHAIObjectFactory.createVBoxLayout()
    vbox1.setSpacing(10)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(primaryButton)
    hbox1.addChild(secondaryButton)
    hbox1.addChild(successButton)
    hbox1.addChild(warningButton)
    hbox1.addChild(dangerButton)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallButton)
    hbox2.addChild(mediumButton)
    hbox2.addChild(largeButton)
    
    const hbox3 = NHAIObjectFactory.createHBoxLayout()
    hbox3.setSpacing(10)
    hbox3.addChild(normalButton)
    hbox3.addChild(disabledButton)
    hbox3.addChild(loadingButton)
    
    vbox1.addChild(basicButton)
    vbox1.addChild(hbox1)
    vbox1.addChild(hbox2)
    vbox1.addChild(hbox3)
    
    container.addChild(vbox1)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建综合按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createComprehensiveLabelDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 基础标签
    const basicLabel = NHAIObjectFactory.createLabel('基础标签')
    basicLabel.setFontSize(16)
    basicLabel.setColor('#2c3e50')
    
    // 标签变体
    const titleLabel = NHAIObjectFactory.createLabel('标题标签')
    titleLabel.setFontSize(24)
    titleLabel.setFontWeight('bold')
    titleLabel.setColor('#2c3e50')
    
    const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
    subtitleLabel.setFontSize(18)
    subtitleLabel.setFontWeight('600')
    subtitleLabel.setColor('#34495e')
    
    const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
    bodyLabel.setFontSize(14)
    bodyLabel.setColor('#7f8c8d')
    
    const captionLabel = NHAIObjectFactory.createLabel('说明文字')
    captionLabel.setFontSize(12)
    captionLabel.setColor('#95a5a6')
    captionLabel.setStyle({ fontStyle: 'italic' })
    
    // 标签对齐
    const leftLabel = NHAIObjectFactory.createLabel('左对齐标签')
    leftLabel.setAlignment('left')
    leftLabel.setWidth(200)
    leftLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const centerLabel = NHAIObjectFactory.createLabel('居中对齐标签')
    centerLabel.setAlignment('center')
    centerLabel.setWidth(200)
    centerLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const rightLabel = NHAIObjectFactory.createLabel('右对齐标签')
    rightLabel.setAlignment('right')
    rightLabel.setWidth(200)
    rightLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    // 使用布局来组织标签
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(15)
    hbox1.addChild(leftLabel)
    hbox1.addChild(centerLabel)
    hbox1.addChild(rightLabel)
    
    vbox.addChild(basicLabel)
    vbox.addChild(titleLabel)
    vbox.addChild(subtitleLabel)
    vbox.addChild(bodyLabel)
    vbox.addChild(captionLabel)
    vbox.addChild(hbox1)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建综合标签演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createComprehensiveInputDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 基础输入框
    const basicInput = NHAIObjectFactory.createInput()
    basicInput.setPlaceholder('基础输入框')
    basicInput.setWidth(200)
    basicInput.setType('text')
    basicInput.setOnChange((value) => console.log('输入值:', value))
    
    // 输入框类型
    const textInput = NHAIObjectFactory.createInput()
    textInput.setPlaceholder('文本输入框')
    textInput.setType('text')
    textInput.setWidth(150)
    
    const emailInput = NHAIObjectFactory.createInput()
    emailInput.setPlaceholder('邮箱输入框')
    emailInput.setType('email')
    emailInput.setWidth(150)
    
    const passwordInput = NHAIObjectFactory.createInput()
    passwordInput.setPlaceholder('密码输入框')
    passwordInput.setType('password')
    passwordInput.setWidth(150)
    
    const numberInput = NHAIObjectFactory.createInput()
    numberInput.setPlaceholder('数字输入框')
    numberInput.setType('number')
    numberInput.setWidth(150)
    
    // 输入框状态
    const normalInput = NHAIObjectFactory.createInput()
    normalInput.setPlaceholder('正常状态')
    normalInput.setWidth(150)
    
    const disabledInput = NHAIObjectFactory.createInput()
    disabledInput.setPlaceholder('禁用状态')
    disabledInput.setWidth(150)
    disabledInput.setDisabled(true)
    
    const readonlyInput = NHAIObjectFactory.createInput()
    readonlyInput.setPlaceholder('只读状态')
    readonlyInput.setWidth(150)
    readonlyInput.setValue('只读内容')
    readonlyInput.setReadonly(true)
    
    // 使用布局来组织输入框
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(textInput)
    hbox1.addChild(emailInput)
    hbox1.addChild(passwordInput)
    hbox1.addChild(numberInput)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(normalInput)
    hbox2.addChild(disabledInput)
    hbox2.addChild(readonlyInput)
    
    vbox.addChild(basicInput)
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建综合输入框演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 按钮子类型演示函数
const createGeneralButtonDemo = () => {
  console.log('createGeneralButtonDemo 开始执行')
  console.log('demoArea.value:', demoArea.value)
  
  if (!demoArea.value) {
    console.error('demoArea 未准备好')
    return
  }

  try {
    console.log('开始创建容器...')
    const container = NHAIObjectFactory.createContainer()
    
    // 通用按钮的各种变体
    const primaryButton = NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(120)
    primaryButton.setHeight(40)
    primaryButton.setOnClick(() => alert('主要按钮被点击！'))
    
    const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(120)
    secondaryButton.setHeight(40)
    
    const successButton = NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(120)
    successButton.setHeight(40)
    
    const warningButton = NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(120)
    warningButton.setHeight(40)
    
    const dangerButton = NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(120)
    dangerButton.setHeight(40)
    
    // 不同尺寸的通用按钮
    const smallButton = NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })
    
    const mediumButton = NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })
    
    const largeButton = NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })
    
    // 使用布局组织按钮
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(primaryButton)
    hbox1.addChild(secondaryButton)
    hbox1.addChild(successButton)
    hbox1.addChild(warningButton)
    hbox1.addChild(dangerButton)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallButton)
    hbox2.addChild(mediumButton)
    hbox2.addChild(largeButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    
    container.addChild(vbox)

    console.log('开始渲染到DOM...')
    demoArea.value.innerHTML = ''
    const element = container.render()
    console.log('渲染结果:', element)
    demoArea.value.appendChild(element)
    console.log('✓ 通用按钮演示创建完成')
  } catch (error) {
    console.error('创建通用按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createTextButtonDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 文本按钮 - 使用 createTextButton
    const textButton1 = NHAIObjectFactory.createTextButton('文本按钮')
    textButton1.setColor('#007bff')
    textButton1.setSize('medium')
    textButton1.setWidth(120)
    textButton1.setHeight(40)
    textButton1.setOnClick(() => alert('文本按钮被点击！'))
    
    const textButton2 = NHAIObjectFactory.createTextButton('链接样式')
    textButton2.setColor('#007bff')
    textButton2.setSize('medium')
    textButton2.setUnderline(true)
    textButton2.setWidth(120)
    textButton2.setHeight(40)
    
    const textButton3 = NHAIObjectFactory.createTextButton('图标按钮')
    textButton3.setColor('#28a745')
    textButton3.setSize('medium')
    textButton3.setWidth(120)
    textButton3.setHeight(40)
    textButton3.setStyle({
      border: '1px solid #28a745',
      borderRadius: '4px'
    })
    
    // 不同尺寸的文本按钮
    const smallTextButton = NHAIObjectFactory.createTextButton('小按钮')
    smallTextButton.setColor('#6c757d')
    smallTextButton.setSize('small')
    smallTextButton.setWidth(80)
    smallTextButton.setHeight(30)
    
    const mediumTextButton = NHAIObjectFactory.createTextButton('中等按钮')
    mediumTextButton.setColor('#007bff')
    mediumTextButton.setSize('medium')
    mediumTextButton.setWidth(120)
    mediumTextButton.setHeight(40)
    
    const largeTextButton = NHAIObjectFactory.createTextButton('大按钮')
    largeTextButton.setColor('#dc3545')
    largeTextButton.setSize('large')
    largeTextButton.setWidth(160)
    largeTextButton.setHeight(50)
    
    // 不同状态的文本按钮
    const normalTextButton = NHAIObjectFactory.createTextButton('正常状态')
    normalTextButton.setColor('#007bff')
    normalTextButton.setSize('medium')
    normalTextButton.setWidth(120)
    normalTextButton.setHeight(40)
    
    const disabledTextButton = NHAIObjectFactory.createTextButton('禁用状态')
    disabledTextButton.setColor('#6c757d')
    disabledTextButton.setSize('medium')
    disabledTextButton.setWidth(120)
    disabledTextButton.setHeight(40)
    disabledTextButton.setDisabled(true)
    
    const underlineTextButton = NHAIObjectFactory.createTextButton('下划线按钮')
    underlineTextButton.setColor('#007bff')
    underlineTextButton.setSize('medium')
    underlineTextButton.setUnderline(true)
    underlineTextButton.setWidth(120)
    underlineTextButton.setHeight(40)
    
    // 使用布局组织文本按钮
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(textButton1)
    hbox1.addChild(textButton2)
    hbox1.addChild(textButton3)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallTextButton)
    hbox2.addChild(mediumTextButton)
    hbox2.addChild(largeTextButton)
    
    const hbox3 = NHAIObjectFactory.createHBoxLayout()
    hbox3.setSpacing(10)
    hbox3.addChild(normalTextButton)
    hbox3.addChild(disabledTextButton)
    hbox3.addChild(underlineTextButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    vbox.addChild(hbox3)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建文本按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createLinkButtonDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 链接按钮 - 模拟链接样式的按钮
    const linkButton1 = NHAIObjectFactory.createButton('普通链接')
    linkButton1.setVariant('primary')
    linkButton1.setWidth(120)
    linkButton1.setHeight(40)
    linkButton1.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal'
    })
    
    const linkButton2 = NHAIObjectFactory.createButton('悬停链接')
    linkButton2.setVariant('primary')
    linkButton2.setWidth(120)
    linkButton2.setHeight(40)
    linkButton2.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#0056b3',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal',
      transition: 'color 0.3s ease'
    })
    
    const linkButton3 = NHAIObjectFactory.createButton('访问过的链接')
    linkButton3.setVariant('primary')
    linkButton3.setWidth(120)
    linkButton3.setHeight(40)
    linkButton3.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#6c757d',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal'
    })
    
    // 不同大小的链接按钮
    const smallLinkButton = NHAIObjectFactory.createButton('小链接')
    smallLinkButton.setVariant('primary')
    smallLinkButton.setWidth(80)
    smallLinkButton.setHeight(30)
    smallLinkButton.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '12px'
    })
    
    const largeLinkButton = NHAIObjectFactory.createButton('大链接')
    largeLinkButton.setVariant('primary')
    largeLinkButton.setWidth(160)
    largeLinkButton.setHeight(50)
    largeLinkButton.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '16px'
    })
    
    // 使用布局组织链接按钮
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(linkButton1)
    hbox1.addChild(linkButton2)
    hbox1.addChild(linkButton3)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallLinkButton)
    hbox2.addChild(largeLinkButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建链接按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 树形目录数据 - 三层结构，支持控件子类型
const treeData = ref([
  {
    name: '基础控件',
    expanded: false,
    children: [
      {
        name: '按钮控件',
        expanded: false,
        children: [
          {
            id: 'general-button',
            title: '通用按钮',
            description: '展示通用按钮的各种变体、尺寸和状态',
            code: `// 通用按钮示例
// 1. 按钮变体
const primaryButton = NHAIObjectFactory.createButton('主要按钮')
primaryButton.setVariant('primary')
primaryButton.setWidth(120)
primaryButton.setHeight(40)
primaryButton.setOnClick(() => alert('主要按钮被点击！'))

const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
secondaryButton.setVariant('secondary')
secondaryButton.setWidth(120)
secondaryButton.setHeight(40)

const successButton = NHAIObjectFactory.createButton('成功按钮')
successButton.setVariant('success')
successButton.setWidth(120)
successButton.setHeight(40)

const warningButton = NHAIObjectFactory.createButton('警告按钮')
warningButton.setVariant('warning')
warningButton.setWidth(120)
warningButton.setHeight(40)

const dangerButton = NHAIObjectFactory.createButton('危险按钮')
dangerButton.setVariant('danger')
dangerButton.setWidth(120)
dangerButton.setHeight(40)

// 2. 按钮尺寸
const smallButton = NHAIObjectFactory.createButton('小按钮')
smallButton.setVariant('primary')
smallButton.setWidth(80)
smallButton.setHeight(30)
smallButton.setStyle({ fontSize: '12px' })

const mediumButton = NHAIObjectFactory.createButton('中等按钮')
mediumButton.setVariant('primary')
mediumButton.setWidth(120)
mediumButton.setHeight(40)
mediumButton.setStyle({ fontSize: '14px' })

const largeButton = NHAIObjectFactory.createButton('大按钮')
largeButton.setVariant('primary')
largeButton.setWidth(160)
largeButton.setHeight(50)
largeButton.setStyle({ fontSize: '16px' })

// 使用布局组织按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(primaryButton)
hbox1.addChild(secondaryButton)
hbox1.addChild(successButton)
hbox1.addChild(warningButton)
hbox1.addChild(dangerButton)
hbox2.addChild(smallButton)
hbox2.addChild(mediumButton)
hbox2.addChild(largeButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
            createDemo: createGeneralButtonDemo
          },
          {
            id: 'text-button',
            title: '文本按钮',
            description: '展示文本按钮的样式和交互效果',
            code: `// 文本按钮示例
// 1. 基础文本按钮
const textButton1 = NHAIObjectFactory.createTextButton('文本按钮')
textButton1.setColor('#007bff')
textButton1.setSize('medium')
textButton1.setWidth(120)
textButton1.setHeight(40)
textButton1.setOnClick(() => alert('文本按钮被点击！'))

// 2. 链接样式文本按钮
const textButton2 = NHAIObjectFactory.createTextButton('链接样式')
textButton2.setColor('#007bff')
textButton2.setSize('medium')
textButton2.setUnderline(true)
textButton2.setWidth(120)
textButton2.setHeight(40)

// 3. 图标样式文本按钮
const textButton3 = NHAIObjectFactory.createTextButton('图标按钮')
textButton3.setColor('#28a745')
textButton3.setSize('medium')
textButton3.setWidth(120)
textButton3.setHeight(40)
textButton3.setStyle({
  border: '1px solid #28a745',
  borderRadius: '4px'
})

// 4. 不同尺寸的文本按钮
const smallTextButton = NHAIObjectFactory.createTextButton('小按钮')
smallTextButton.setColor('#6c757d')
smallTextButton.setSize('small')
smallTextButton.setWidth(80)
smallTextButton.setHeight(30)

const mediumTextButton = NHAIObjectFactory.createTextButton('中等按钮')
mediumTextButton.setColor('#007bff')
mediumTextButton.setSize('medium')
mediumTextButton.setWidth(120)
mediumTextButton.setHeight(40)

const largeTextButton = NHAIObjectFactory.createTextButton('大按钮')
largeTextButton.setColor('#dc3545')
largeTextButton.setSize('large')
largeTextButton.setWidth(160)
largeTextButton.setHeight(50)

// 5. 不同状态的文本按钮
const normalTextButton = NHAIObjectFactory.createTextButton('正常状态')
normalTextButton.setColor('#007bff')
normalTextButton.setSize('medium')
normalTextButton.setWidth(120)
normalTextButton.setHeight(40)

const disabledTextButton = NHAIObjectFactory.createTextButton('禁用状态')
disabledTextButton.setColor('#6c757d')
disabledTextButton.setSize('medium')
disabledTextButton.setWidth(120)
disabledTextButton.setHeight(40)
disabledTextButton.setDisabled(true)

const underlineTextButton = NHAIObjectFactory.createTextButton('下划线按钮')
underlineTextButton.setColor('#007bff')
underlineTextButton.setSize('medium')
underlineTextButton.setUnderline(true)
underlineTextButton.setWidth(120)
underlineTextButton.setHeight(40)

// 使用布局组织文本按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()
const hbox3 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(textButton1)
hbox1.addChild(textButton2)
hbox1.addChild(textButton3)
hbox2.addChild(smallTextButton)
hbox2.addChild(mediumTextButton)
hbox2.addChild(largeTextButton)
hbox3.addChild(normalTextButton)
hbox3.addChild(disabledTextButton)
hbox3.addChild(underlineTextButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)
vbox.addChild(hbox3)`,
            createDemo: createTextButtonDemo
          },
          {
            id: 'link-button',
            title: '链接按钮',
            description: '展示链接样式的按钮效果',
            code: `// 链接按钮示例
// 1. 普通链接按钮
const linkButton1 = NHAIObjectFactory.createButton('普通链接')
linkButton1.setVariant('primary')
linkButton1.setWidth(120)
linkButton1.setHeight(40)
linkButton1.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#007bff',
  textDecoration: 'underline',
  fontSize: '14px',
  fontWeight: 'normal'
})

// 2. 悬停链接按钮
const linkButton2 = NHAIObjectFactory.createButton('悬停链接')
linkButton2.setVariant('primary')
linkButton2.setWidth(120)
linkButton2.setHeight(40)
linkButton2.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#0056b3',
  textDecoration: 'underline',
  fontSize: '14px',
  fontWeight: 'normal',
  transition: 'color 0.3s ease'
})

// 3. 访问过的链接按钮
const linkButton3 = NHAIObjectFactory.createButton('访问过的链接')
linkButton3.setVariant('primary')
linkButton3.setWidth(120)
linkButton3.setHeight(40)
linkButton3.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#6c757d',
  textDecoration: 'underline',
  fontSize: '14px',
  fontWeight: 'normal'
})

// 4. 不同大小的链接按钮
const smallLinkButton = NHAIObjectFactory.createButton('小链接')
smallLinkButton.setVariant('primary')
smallLinkButton.setWidth(80)
smallLinkButton.setHeight(30)
smallLinkButton.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#007bff',
  textDecoration: 'underline',
  fontSize: '12px'
})

const largeLinkButton = NHAIObjectFactory.createButton('大链接')
largeLinkButton.setVariant('primary')
largeLinkButton.setWidth(160)
largeLinkButton.setHeight(50)
largeLinkButton.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#007bff',
  textDecoration: 'underline',
  fontSize: '16px'
})

// 使用布局组织链接按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(linkButton1)
hbox1.addChild(linkButton2)
hbox1.addChild(linkButton3)
hbox2.addChild(smallLinkButton)
hbox2.addChild(largeLinkButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
            createDemo: createLinkButtonDemo
          }
        ]
      },
      {
        name: '标签控件',
        expanded: false,
        children: [
          {
            id: 'label-comprehensive',
        title: '标签控件',
            description: '展示标签的所有变体：基础、类型、对齐方式',
            code: `// 标签控件综合示例
// 1. 基础标签
const basicLabel = NHAIObjectFactory.createLabel('基础标签')
basicLabel.setFontSize(16)
basicLabel.setColor('#2c3e50')

// 2. 标签变体
const titleLabel = NHAIObjectFactory.createLabel('标题标签')
titleLabel.setFontSize(24)
titleLabel.setFontWeight('bold')
titleLabel.setColor('#2c3e50')

const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
subtitleLabel.setFontSize(18)
subtitleLabel.setFontWeight('600')
subtitleLabel.setColor('#34495e')

const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
bodyLabel.setFontSize(14)
bodyLabel.setColor('#7f8c8d')

const captionLabel = NHAIObjectFactory.createLabel('说明文字')
captionLabel.setFontSize(12)
captionLabel.setColor('#95a5a6')
captionLabel.setStyle({ fontStyle: 'italic' })

// 3. 标签对齐
const leftLabel = NHAIObjectFactory.createLabel('左对齐标签')
leftLabel.setAlignment('left')
leftLabel.setWidth(200)
leftLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })

const centerLabel = NHAIObjectFactory.createLabel('居中对齐标签')
centerLabel.setAlignment('center')
centerLabel.setWidth(200)
centerLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })

const rightLabel = NHAIObjectFactory.createLabel('右对齐标签')
rightLabel.setAlignment('right')
rightLabel.setWidth(200)
rightLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })

// 使用布局组织标签
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox = NHAIObjectFactory.createHBoxLayout()

hbox.addChild(leftLabel, centerLabel, rightLabel)
vbox.addChild(basicLabel, titleLabel, subtitleLabel, bodyLabel, captionLabel, hbox)`,
            createDemo: createComprehensiveLabelDemo
          }
        ]
      },
      {
        name: '输入框控件',
        expanded: false,
        children: [
          {
            id: 'input-comprehensive',
        title: '输入框控件',
            description: '展示输入框的所有变体：基础、类型、状态',
            code: `// 输入框控件综合示例
// 1. 基础输入框
const basicInput = NHAIObjectFactory.createInput()
basicInput.setPlaceholder('基础输入框')
basicInput.setWidth(200)
basicInput.setType('text')
basicInput.setOnChange((value) => console.log('输入值:', value))

// 2. 输入框类型
const textInput = NHAIObjectFactory.createInput()
textInput.setPlaceholder('文本输入框')
textInput.setType('text')

const emailInput = NHAIObjectFactory.createInput()
emailInput.setPlaceholder('邮箱输入框')
emailInput.setType('email')

const passwordInput = NHAIObjectFactory.createInput()
passwordInput.setPlaceholder('密码输入框')
passwordInput.setType('password')

const numberInput = NHAIObjectFactory.createInput()
numberInput.setPlaceholder('数字输入框')
numberInput.setType('number')

// 3. 输入框状态
const normalInput = NHAIObjectFactory.createInput()
normalInput.setPlaceholder('正常状态')

const disabledInput = NHAIObjectFactory.createInput()
disabledInput.setPlaceholder('禁用状态')
disabledInput.setDisabled(true)

const readonlyInput = NHAIObjectFactory.createInput()
readonlyInput.setPlaceholder('只读状态')
readonlyInput.setValue('只读内容')
readonlyInput.setReadonly(true)

// 使用布局组织输入框
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(textInput)
hbox1.addChild(emailInput)
hbox1.addChild(passwordInput)
hbox1.addChild(numberInput)
hbox2.addChild(normalInput)
hbox2.addChild(disabledInput)
hbox2.addChild(readonlyInput)
vbox.addChild(basicInput)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
            createDemo: createComprehensiveInputDemo
          }
        ]
      }
    ]
  },
  {
    name: '容器组件',
    expanded: false,
    children: [
      {
        name: '卡片组件',
        expanded: false,
        children: [
          {
            id: 'card-basic',
        title: '卡片组件',
        description: '展示如何创建和配置卡片组件',
        code: `// 创建卡片组件
const card = NHAIObjectFactory.createCard()
card.setTitle('示例卡片')
card.setSubtitle('这是一个NHAI卡片组件')
card.setElevation(2)

// 添加子组件
const button = NHAIObjectFactory.createButton('卡片按钮')
button.setVariant('success')
card.addChild(button)`,
        createDemo: createCardDemo
          }
        ]
      },
      {
        name: '窗口组件',
        expanded: false,
        children: [
          {
            id: 'window-basic',
            title: '窗口组件',
            description: '展示如何创建和配置窗口组件',
            code: `// 创建窗口组件
const window = NHAIObjectFactory.createWindow('示例窗口')
window.setWidth(400)
window.setHeight(300)

// 添加内容
const label = NHAIObjectFactory.createLabel('窗口内容')
window.addChild(label)`,
            createDemo: createComplexDemo
          }
        ]
      }
    ]
  },
  {
    name: '布局管理',
    expanded: false,
    children: [
      {
        name: '垂直布局',
        expanded: false,
        children: [
          {
            id: 'vbox-basic',
        title: '垂直布局',
        description: '展示如何创建垂直布局',
        code: `// 创建垂直布局
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(10)

// 添加子组件
const label1 = NHAIObjectFactory.createLabel('第一个标签')
const label2 = NHAIObjectFactory.createLabel('第二个标签')
const button = NHAIObjectFactory.createButton('垂直布局按钮')

vbox.addChild(label1)
vbox.addChild(label2)
vbox.addChild(button)`,
        createDemo: createVBoxDemo
          }
        ]
      },
      {
        name: '水平布局',
        expanded: false,
        children: [
          {
            id: 'hbox-basic',
        title: '水平布局',
        description: '展示如何创建水平布局',
        code: `// 创建水平布局
const hbox = NHAIObjectFactory.createHBoxLayout()
hbox.setSpacing(15)

// 添加子组件
const button1 = NHAIObjectFactory.createButton('按钮1')
const button2 = NHAIObjectFactory.createButton('按钮2')
const button3 = NHAIObjectFactory.createButton('按钮3')

hbox.addChild(button1)
hbox.addChild(button2)
hbox.addChild(button3)`,
        createDemo: createHBoxDemo
          }
        ]
      }
    ]
  },
  {
    name: '高级示例',
    expanded: false,
    children: [
      {
        name: '复杂组合',
        expanded: false,
        children: [
          {
            id: 'complex-layout',
        title: '复杂布局组合',
        description: '展示复杂的布局组合和组件嵌套',
        code: `// 创建复杂布局
const window = NHAIObjectFactory.createWindow('复杂示例')
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox = NHAIObjectFactory.createHBoxLayout()

// 添加各种组件
const titleLabel = NHAIObjectFactory.createLabel('复杂布局示例')
const input = NHAIObjectFactory.createInput()
const button = NHAIObjectFactory.createButton('提交')
const card = NHAIObjectFactory.createCard()

// 组合布局
hbox.addChild(input)
hbox.addChild(button)
vbox.addChild(titleLabel)
vbox.addChild(hbox)
vbox.addChild(card)
window.setLayout(vbox)`,
        createDemo: createComplexDemo
          }
        ]
      },
      {
        name: '动态交互',
        expanded: false,
        children: [
          {
            id: 'dynamic-methods',
        title: '动态方法调用',
        description: '展示如何动态调用组件方法',
        code: `// 动态方法调用示例
const button = NHAIObjectFactory.createButton('动态按钮')
let clickCount = 0

button.setOnClick(() => {
  clickCount++
  button.setText(\`点击了 \${clickCount} 次\`)
  button.setStyle({
    backgroundColor: clickCount % 2 === 0 ? '#ffc107' : '#fd7e14'
  })
})`,
        createDemo: createMethodsDemo
      },
      {
        id: 'style-control',
        title: '样式控制',
        description: '展示全局样式和自定义样式的控制',
        code: `// 样式控制示例
const button1 = NHAIObjectFactory.createButton('全局样式按钮')
button1.setStyle({
  borderRadius: '20px',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
})

const button2 = NHAIObjectFactory.createButton('自定义样式按钮')
button2.setStyle({
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  border: 'none',
  borderRadius: '25px',
  color: 'white'
})`,
        createDemo: createStyleControlDemo
          }
        ]
      }
    ]
  }
])

// 方法
const switchFramework = async (framework: string) => {
  try {
    console.log(`切换到框架: ${framework}`)
    currentFramework.value = framework
    
    // 根据选择的框架注册对应的适配器
    switch (framework) {
      case 'vanilla':
        NHAIFrameworkRegistry.register(new VanillaAdapter())
        NHAIFrameworkRegistry.use('vanilla')
        adapterRegistered.value = true
        console.log('✓ 已切换到原生JavaScript适配器')
        break
        
      case 'vue':
        NHAIFrameworkRegistry.register(new VueAdapter())
        NHAIFrameworkRegistry.use('vue')
        adapterRegistered.value = true
        console.log('✓ 已切换到Vue适配器')
        break
        
      case 'react':
        NHAIFrameworkRegistry.register(new ReactAdapter())
        NHAIFrameworkRegistry.use('react')
        adapterRegistered.value = true
        console.log('✓ 已切换到React适配器')
        break
        
      case 'svelte':
        NHAIFrameworkRegistry.register(new SvelteAdapter())
        NHAIFrameworkRegistry.use('svelte')
        adapterRegistered.value = true
        console.log('✓ 已切换到Svelte适配器')
        break
        
      default:
        console.warn(`未知的框架: ${framework}`)
        return
    }
    
    // 重新渲染当前示例
    if (currentExampleData.value) {
      createDemo()
    }
    
  } catch (error) {
    console.error('切换框架失败:', error)
    adapterRegistered.value = false
    // 如果切换失败，回退到vanilla适配器
    try {
      NHAIFrameworkRegistry.register(new VanillaAdapter())
      NHAIFrameworkRegistry.use('vanilla')
      currentFramework.value = 'vanilla'
      adapterRegistered.value = true
      console.log('已回退到原生JavaScript适配器')
    } catch (fallbackError) {
      console.error('回退适配器也失败了:', fallbackError)
      adapterRegistered.value = false
    }
  }
}

const toggleCategory = (category: any) => {
  category.expanded = !category.expanded
}

const toggleComponentType = (componentType: any) => {
  componentType.expanded = !componentType.expanded
}

const selectExample = async (item: any) => {
  console.log('选择示例:', item)
  currentExampleId.value = item.id
  currentExampleData.value = item
  
  // 确保切换到示例预览模式
  currentMode.value = 'examples'
  
  // 等待DOM更新完成
  await nextTick()
  
  // 执行示例演示
  createDemo()
  
  console.log('示例选择完成，当前模式:', currentMode.value)
}

const createDemo = () => {
  console.log('开始创建演示...')
  
  // 检查适配器是否已注册
  if (!adapterRegistered.value) {
    console.log('适配器未注册，等待初始化...')
    // 等待适配器注册完成
    setTimeout(() => {
      if (adapterRegistered.value) {
        console.log('适配器已注册，重新执行演示')
        createDemo()
      } else {
        console.error('适配器注册超时')
        if (demoArea.value) {
          demoArea.value.innerHTML = '<div style="color: red; padding: 20px;">适配器未初始化，请刷新页面重试</div>'
        }
      }
    }, 100)
    return
  }
  
  // 检查DOM元素是否准备好
  if (!demoArea.value) {
    console.log('DOM元素未准备好，等待...')
    setTimeout(() => {
      if (demoArea.value) {
        console.log('DOM元素已准备好，重新执行演示')
        createDemo()
      } else {
        console.error('DOM元素准备超时')
      }
    }, 50)
    return
  }
  
  if (currentExampleData.value && currentExampleData.value.createDemo) {
    console.log('找到演示函数，开始执行')
    currentExampleData.value.createDemo()
    console.log('演示函数执行完成')
  } else {
    console.log('没有找到演示函数')
  }
}

const copyCode = () => {
  if (currentExampleData.value) {
    navigator.clipboard.writeText(currentExampleData.value.code).then(() => {
      alert('代码已复制到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }
}

// 模式切换
const switchMode = (mode: string) => {
  currentMode.value = mode
}

// 加载示例代码到在线编辑器
const loadToEditor = () => {
  if (currentExampleData.value) {
    // 复制示例代码到编辑器
    editorCode.value = currentExampleData.value.code
    // 切换到在线编辑模式
    currentMode.value = 'editor'
    
    console.log('示例代码已加载到在线编辑器')
  }
}

// 编辑器事件处理（保留用于示例加载）
const onCodeChange = (code: string) => {
  editorCode.value = code
}

const onCodeRun = async (code: string) => {
  // 新的在线编辑器会处理代码执行
  console.log('代码执行已移至新的在线编辑器组件')
}

const onPreviewClear = () => {
  executionError.value = ''
}

const onPreviewRefresh = () => {
  // 新的在线编辑器会处理刷新
  console.log('预览刷新已移至新的在线编辑器组件')
}

onMounted(async () => {
  console.log('App.vue mounted, 注册适配器...')
  try {
    // 使用 nextTick 确保 DOM 完全渲染
    await nextTick()
    
    NHAIFrameworkRegistry.register(new VanillaAdapter())
    NHAIFrameworkRegistry.use('vanilla')
    adapterRegistered.value = true
    console.log('✓ 适配器注册成功')
    
    // 将 NHAIObjectFactory 暴露到全局作用域
    ;(window as any).NHAIObjectFactory = NHAIObjectFactory
    console.log('✓ NHAIObjectFactory 已暴露到全局作用域')
    
    // 测试按钮创建
    console.log('测试按钮创建...')
    const testButton = NHAIObjectFactory.createButton('测试按钮')
    console.log('✓ 测试按钮创建成功:', testButton)
    
    // 测试按钮渲染
    console.log('测试按钮渲染...')
    const testElement = testButton.render()
    console.log('✓ 测试按钮渲染成功:', testElement)
    
    console.log('✓ 初始化完成，可以开始使用演示')
    
  } catch (error) {
    console.error('❌ 适配器注册失败:', error)
    adapterRegistered.value = false
  }
})
</script>

<style scoped>
.app-header {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.app-header p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.main-container {
  display: flex;
  min-height: calc(100vh - 120px);
}

.sidebar {
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-header h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.framework-selector {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.framework-selector label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.framework-selector select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.tree-container {
  padding: 10px 0;
}

.tree-category {
  margin-bottom: 5px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-header:hover {
  background: #e9ecef;
}

.expand-icon {
  margin-right: 8px;
  font-size: 12px;
  color: #666;
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(0deg);
}

.category-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.category-items {
  background: white;
}

.component-type {
  margin-bottom: 2px;
}

.component-type-header {
  display: flex;
  align-items: center;
  padding: 8px 20px 8px 40px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: #f8f9fa;
  border-left: 2px solid transparent;
}

.component-type-header:hover {
  background: #e9ecef;
  border-left-color: #667eea;
}

.component-type-name {
  font-weight: 500;
  color: #495057;
  font-size: 13px;
  margin-right: 8px;
}

.component-count {
  font-size: 11px;
  color: #6c757d;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 10px;
}

.component-examples {
  background: white;
}

.tree-item {
  padding: 10px 20px 10px 60px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.tree-item:hover {
  background: #f8f9fa;
  border-left-color: #667eea;
}

.tree-item.active {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.item-title {
  display: block;
  font-weight: 500;
  color: #2c3e50;
  font-size: 13px;
  margin-bottom: 3px;
}

.item-description {
  display: block;
  font-size: 11px;
  color: #666;
  line-height: 1.3;
}

.examples-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.example-container {
  max-width: 1000px;
  margin: 0 auto;
}

.example-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.example-header h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 2rem;
}

.example-header p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 1.1rem;
}

.framework-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.framework-badge {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.framework-status {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.framework-status.active {
  background: #28a745;
}

.example-demo {
  margin-bottom: 30px;
}

.example-demo h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.demo-area {
  min-height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.example-code {
  margin-bottom: 30px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.code-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.copy-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background: #218838;
}

.example-code pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.welcome-section {
  text-align: center;
  padding: 60px 20px;
}

.welcome-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 2.5rem;
}

.welcome-section p {
  margin: 0 0 40px 0;
  color: #666;
  font-size: 1.2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.feature-item {
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.feature-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

/* 编辑器模式样式 */
.editor-mode {
  height: 100%;
}

.editor-layout {
  display: flex;
  height: calc(100vh - 120px);
  gap: 1px;
  background: #e9ecef;
}

.editor-panel {
  flex: 1;
  min-width: 0;
}

.preview-panel {
  flex: 1;
  min-width: 0;
}

.mode-selector {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.mode-selector label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.mode-selector select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.load-editor-button {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  margin-left: 8px;
}

.load-editor-button:hover {
  background: #138496;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .editor-layout {
    flex-direction: column;
    height: auto;
  }
  
  .editor-panel,
  .preview-panel {
    height: 400px;
  }
}
</style>