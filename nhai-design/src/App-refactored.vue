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
            <select v-model="currentFramework" @change="handleFrameworkChange">
              <option v-for="framework in frameworks" :key="framework.name" :value="framework.name">
                {{ framework.label }}
              </option>
            </select>
          </div>
          <div class="mode-selector">
            <label>显示模式:</label>
            <select v-model="currentMode" @change="handleModeChange">
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

            <!-- 代码展示区域 -->
            <div class="example-code">
              <div class="code-header">
                <h3>代码示例</h3>
                <div class="code-actions">
                  <button @click="copyCode" class="copy-btn">复制代码</button>
                  <button @click="loadToEditor" class="load-btn">加载到编辑器</button>
                </div>
              </div>
              <pre><code>{{ currentExampleData.code }}</code></pre>
            </div>
          </div>
          
          <div v-else class="welcome-message">
            <h2>欢迎使用 NHAI 组件系统</h2>
            <p>请从左侧目录中选择一个示例进行查看</p>
          </div>
        </div>

        <!-- 在线编辑模式 -->
        <div v-else class="editor-mode">
          <OnlineEditor 
            ref="codeEditor"
            :initial-code="editorCode"
            @code-change="onCodeChange"
            @code-run="onCodeRun"
            @preview-clear="onPreviewClear"
            @preview-refresh="onPreviewRefresh"
          />
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
  nhaiFactory as NHAIObjectFactory,
  ModernNHAIButton
} from 'nhai-framework'
import OnlineEditor from './components/ui/OnlineEditor.vue'

// 导入数据和工具函数
import { treeData } from './lib/data'
import { 
  frameworks, 
  switchFramework, 
  toggleCategory, 
  toggleComponentType, 
  selectExample, 
  copyCode, 
  switchMode, 
  loadToEditor 
} from './lib/utils'

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

// 执行状态
const isExecuting = ref(false)
const executionError = ref('')

// 计算属性
const currentFrameworkLabel = computed(() => {
  const framework = frameworks.find(f => f.name === currentFramework.value)
  return framework ? framework.label : '未知框架'
})

// 事件处理函数
const handleFrameworkChange = async () => {
  const success = await switchFramework(currentFramework.value)
  adapterRegistered.value = success
  
  // 重新渲染当前示例
  if (currentExampleData.value) {
    await nextTick()
    createDemo()
  }
}

const handleModeChange = () => {
  switchMode(currentMode.value, { value: currentMode })
}

const selectExampleHandler = async (item: any) => {
  await selectExample(item, currentExampleId, currentExampleData, currentMode, createDemo)
}

const copyCodeHandler = () => {
  copyCode(currentExampleData)
}

const loadToEditorHandler = () => {
  loadToEditor(currentExampleData, editorCode, currentMode)
}

// 创建演示函数
const createDemo = () => {
  console.log('开始创建演示...')
  
  // 检查适配器是否已注册
  if (!adapterRegistered.value) {
    console.log('适配器未注册，等待初始化...')
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

// 编辑器事件处理
const onCodeChange = (code: string) => {
  editorCode.value = code
}

const onCodeRun = async (code: string) => {
  console.log('代码执行已移至新的在线编辑器组件')
}

const onPreviewClear = () => {
  executionError.value = ''
}

const onPreviewRefresh = () => {
  console.log('预览刷新已移至新的在线编辑器组件')
}

// 组件挂载
onMounted(async () => {
  console.log('App.vue mounted, 注册适配器...')
  try {
    // 使用 nextTick 确保 DOM 完全渲染
    await nextTick()
    
    NHAIFrameworkRegistry.register(new VanillaAdapter())
    NHAIFrameworkRegistry.use('vanilla')
    adapterRegistered.value = true
    console.log('✓ 适配器注册成功')
    
    // 将 NHAIObjectFactory 和 ModernNHAIButton 暴露到全局作用域
    ;(window as any).NHAIObjectFactory = NHAIObjectFactory
    ;(window as any).ModernNHAIButton = ModernNHAIButton
    console.log('✓ NHAIObjectFactory 和 ModernNHAIButton 已暴露到全局作用域')
    
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

.framework-selector,
.mode-selector {
  margin-bottom: 15px;
}

.framework-selector label,
.mode-selector label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.framework-selector select,
.mode-selector select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  font-size: 0.9rem;
  color: #495057;
}

.tree-container {
  padding: 10px;
}

.tree-category {
  margin-bottom: 10px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-header:hover {
  background: #dee2e6;
}

.expand-icon {
  margin-right: 8px;
  font-size: 0.8rem;
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.category-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.category-items {
  margin-top: 5px;
  margin-left: 20px;
}

.component-type {
  margin-bottom: 8px;
}

.component-type-header {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background: #f8f9fa;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.component-type-header:hover {
  background: #e9ecef;
}

.component-type-name {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.component-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: #6c757d;
}

.component-examples {
  margin-top: 5px;
  margin-left: 20px;
}

.tree-item {
  padding: 8px 12px;
  margin-bottom: 2px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.tree-item:hover {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.tree-item.active {
  background: #bbdefb;
  border-left-color: #1976d2;
}

.item-title {
  display: block;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.item-description {
  display: block;
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.3;
}

.examples-content {
  flex: 1;
  background: white;
  overflow-y: auto;
}

.example-mode {
  padding: 20px;
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
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.5;
}

.framework-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.framework-badge {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.framework-status {
  font-size: 0.9rem;
  color: #dc3545;
  font-weight: 500;
}

.framework-status.active {
  color: #28a745;
}

.example-demo {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.example-demo h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.demo-area {
  min-height: 100px;
  padding: 20px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.example-code {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #e9ecef;
  border-bottom: 1px solid #dee2e6;
}

.code-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.code-actions {
  display: flex;
  gap: 10px;
}

.copy-btn,
.load-btn {
  padding: 6px 12px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.copy-btn:hover,
.load-btn:hover {
  background: #007bff;
  color: white;
}

.example-code pre {
  margin: 0;
  padding: 20px;
  background: #2d3748;
  color: #e2e8f0;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.welcome-message h2 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 2rem;
}

.welcome-message p {
  margin: 0;
  font-size: 1.1rem;
}

.editor-mode {
  height: 100%;
}
</style>
