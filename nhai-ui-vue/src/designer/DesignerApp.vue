<template>
  <div class="designer-app">
    <!-- 顶部工具栏 -->
    <header class="designer-header">
      <div class="header-left">
        <h1>🎨 可视化布局设计器</h1>
        <span class="tagline">拖拽控件，实时预览，自动生成代码</span>
      </div>
      <div class="header-right">
        <button class="btn-code" @click="toggleCodePanel">
          {{ showCodePanel ? '隐藏代码' : '查看代码' }}
        </button>
        <button class="btn-clear" @click="clearCanvas">清空画布</button>
        <button class="btn-save" @click="saveDesign">保存设计</button>
      </div>
    </header>

    <!-- 主要内容 -->
    <div class="designer-main">
      <!-- 左侧组件库（可收起） -->
      <div class="panel-container left">
        <aside class="left-panel" :class="{ collapsed: leftPanelCollapsed }">
          <div class="panel-section">
          <h3 class="section-title">📦 组件库</h3>
          <div v-for="category in componentCategories" :key="category" class="component-category">
            <h4 class="category-title">{{ category }}</h4>
            <div class="component-list">
              <div 
                v-for="comp in getComponentsByCategory(category)" 
                :key="comp.type"
                class="component-item"
                draggable="true"
                @dragstart="handleDragStart(comp, $event)"
              >
                <i>{{ comp.icon }}</i>
                <span>{{ comp.name }}</span>
              </div>
            </div>
          </div>
          </div>
        </aside>
        <button class="panel-toggle" @click="leftPanelCollapsed = !leftPanelCollapsed" title="收起/展开组件库">
          <svg v-if="leftPanelCollapsed" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 中间画布区域 -->
      <section class="canvas-area">
        <div class="canvas-header">
          <h3>设计画布（800×600）</h3>
          <div class="canvas-tools">
            <span class="tool-hint">🖱️ 拖拽组件到画布，选中后可移动位置</span>
          </div>
        </div>
        <div 
          class="canvas-content"
          @drop="handleDrop"
          @dragover.prevent
          @click="handleCanvasClick"
          ref="canvasContentRef"
        >
          <div class="canvas-content-wrapper">
            <div 
              v-for="(comp, index) in canvasComponents"
              :key="comp.id"
              class="canvas-component"
              :class="{ selected: selectedComponent?.id === comp.id }"
              :style="comp.style"
              @click.stop="selectComponent(comp)"
              @mousedown.stop="startDrag(comp, $event)"
            >
              <div v-html="comp.element.outerHTML"></div>
              <button class="remove-btn" @click.stop="removeComponent(index)">×</button>
            </div>
          </div>

          <div v-if="canvasComponents.length === 0" class="empty-canvas">
            <p>📦 从左侧拖拽组件到此处开始设计</p>
            <p style="font-size: 12px; color: #999; margin-top: 8px;">
              添加后可以拖拽组件改变位置，点击可编辑属性
            </p>
          </div>
        </div>
      </section>

      <!-- 右侧属性面板（可收起） -->
      <div class="panel-container right">
        <aside class="right-panel" :class="{ collapsed: rightPanelCollapsed }">
          <div class="panel-section">
          <h3 class="section-title">⚙️ 属性设置</h3>
          <div v-if="selectedComponent" class="property-content">
            <!-- 组件类型 -->
            <div class="property-group">
              <label>组件类型</label>
              <input type="text" :value="getComponentName(selectedComponent.type)" disabled class="disabled" />
            </div>
            
            <!-- 动态属性 -->
            <div v-for="prop in getPropertyList(selectedComponent.type)" :key="prop.key" class="property-group">
              <label>{{ prop.label }}</label>
              
              <!-- 文本输入 -->
              <input 
                v-if="prop.type === 'text'"
                :value="getPropValue(selectedComponent, prop.key)" 
                @input="updateDynamicProp(prop.key, ($event.target as HTMLInputElement).value)"
                :placeholder="prop.placeholder || ''"
              />
              
              <!-- 数字输入 -->
              <input 
                v-if="prop.type === 'number'"
                type="number"
                :value="getPropValue(selectedComponent, prop.key)" 
                @input="updateDynamicProp(prop.key, Number(($event.target as HTMLInputElement).value))"
              />
              
              <!-- 选择器 -->
              <select 
                v-if="prop.type === 'select'"
                :value="getPropValue(selectedComponent, prop.key)" 
                @change="updateDynamicProp(prop.key, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="opt in prop.options" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              
              <!-- 布尔值 -->
              <label v-if="prop.type === 'boolean'" class="checkbox-label">
                <input 
                  type="checkbox"
                  :checked="getPropValue(selectedComponent, prop.key)" 
                  @change="updateDynamicProp(prop.key, ($event.target as HTMLInputElement).checked)"
                />
                <span>{{ getPropValue(selectedComponent, prop.key) ? '是' : '否' }}</span>
              </label>
            </div>
            
            <!-- 位置属性 -->
            <div class="property-divider">位置</div>
            <div class="property-group">
              <label>X 坐标</label>
              <input 
                type="number"
                :value="parseInt(selectedComponent.style.left || '0')" 
                @input="updateStyle('left', ($event.target as HTMLInputElement).value + 'px')"
              />
            </div>
            <div class="property-group">
              <label>Y 坐标</label>
              <input 
                type="number"
                :value="parseInt(selectedComponent.style.top || '0')" 
                @input="updateStyle('top', ($event.target as HTMLInputElement).value + 'px')"
              />
            </div>
          </div>
          <div v-else class="property-empty">
            <p>选中组件以编辑属性</p>
          </div>
          </div>
        </aside>
        <button class="panel-toggle right" @click="rightPanelCollapsed = !rightPanelCollapsed" title="收起/展开属性面板">
          <svg v-if="rightPanelCollapsed" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 右侧代码预览 -->
      <aside class="code-panel" v-show="showCodePanel">
        <div class="code-header">
          <h3>📝 生成的代码</h3>
          <button class="btn-copy" @click="copyCode">复制</button>
        </div>
        <pre class="code-content" ref="codeRef">{{ generatedCode }}</pre>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { nextTick } from 'vue'
import {
  NhaiButtonCommand,
  NhaiInputCommand,
  NhaiSelectCommand,
  NhaiSwitchCommand,
  NhaiCheckboxCommand,
  NhaiCardCommand,
  NhaiGridCommand,
  NhaiContainerCommand,
  NhaiSplitPanelCommand,
} from '../components'

interface CanvasComponent {
  id: string
  type: string
  instance: any
  element: HTMLElement
  props: any
  style: any
}

// 组件库定义
const components = [
  { name: '按钮', type: 'button', icon: '🔘', category: '表单' },
  { name: '输入框', type: 'input', icon: '📝', category: '表单' },
  { name: '选择器', type: 'select', icon: '🔽', category: '表单' },
  { name: '开关', type: 'switch', icon: '🔀', category: '表单' },
  { name: '复选框', type: 'checkbox', icon: '☑️', category: '表单' },
  { name: '卡片', type: 'card', icon: '🃏', category: '布局' },
  { name: '网格', type: 'grid', icon: '⊞', category: '布局' },
  { name: '容器', type: 'container', icon: '📦', category: '布局' },
  { name: '分割面板', type: 'splitpanel', icon: '⚡', category: '布局' },
]

// 画布组件列表
const canvasComponents = ref<CanvasComponent[]>([])
const selectedComponent = ref<CanvasComponent | null>(null)
const showCodePanel = ref(false)
const codeRef = ref<HTMLElement>()
const canvasContentRef = ref<HTMLElement>()

// 面板收起状态
const leftPanelCollapsed = ref(false)
const rightPanelCollapsed = ref(false)

// 拖拽的组件
let draggedComponent: any = null

// 处理拖拽开始
const handleDragStart = (comp: any, event: DragEvent) => {
  draggedComponent = comp
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

// 处理放置
const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (!draggedComponent) return

  // 计算相对于画布区域的位置
  const canvasWrapper = document.querySelector('.canvas-content-wrapper')
  if (!canvasWrapper) return
  
  const rect = (canvasWrapper as HTMLElement).getBoundingClientRect()
  let x = event.clientX - rect.left - 40
  let y = event.clientY - rect.top - 20
  
  // 限制在画布范围内
  const maxX = 800 - 40
  const maxY = 600 - 40
  x = Math.max(0, Math.min(x, maxX))
  y = Math.max(0, Math.min(y, maxY))

  // 创建组件
  const comp = await createComponent(draggedComponent, x, y)
  
  // 添加到画布
  canvasComponents.value.push(comp)
  
  // 选中新组件
  await nextTick()
  selectComponent(comp)
  
  draggedComponent = null
  updateCode()
}

// 按类别获取组件
const componentCategories = ref(['表单', '布局'])
const getComponentsByCategory = (category: string) => {
  return components.filter(c => c.category === category)
}

// 创建组件实例
const createComponent = async (compDef: any, x: number, y: number): Promise<CanvasComponent> => {
  const id = `${compDef.type}-${Date.now()}`
  let instance: any
  let element: HTMLElement
  
  switch (compDef.type) {
    case 'button':
      instance = new NhaiButtonCommand(`按钮${canvasComponents.value.length + 1}`)
      instance.setType('primary')
      element = instance.render()
      break
    case 'input':
      instance = new NhaiInputCommand()
      instance.setPlaceholder('请输入')
      element = instance.render()
      break
    case 'select':
      instance = new NhaiSelectCommand()
      instance.setOptions([
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ])
      element = instance.render()
      break
    case 'switch':
      instance = new NhaiSwitchCommand(false)
      instance.setActiveText('开')
      instance.setInactiveText('关')
      element = instance.render()
      break
    case 'checkbox':
      instance = new NhaiCheckboxCommand('复选框')
      element = instance.render()
      break
    case 'card':
      instance = new NhaiCardCommand('卡片标题', '卡片内容')
      element = instance.render()
      break
    case 'grid':
      instance = new NhaiGridCommand()
      instance.setContainer(true)
      instance.setSpacing(16)
      element = instance.render()
      break
    case 'container':
      instance = new NhaiContainerCommand()
      instance.setMaxWidth('lg')
      element = instance.render()
      break
    case 'splitpanel':
      instance = new NhaiSplitPanelCommand()
      element = instance.render()
      break
    default:
      element = document.createElement('div')
  }
  
  // 从实例获取属性值
  const props: any = { type: 'primary' }
  if (instance) {
    // Button
    if (compDef.type === 'button' && instance.text !== undefined) props.text = instance.text
    if (compDef.type === 'button' && instance.type !== undefined) props.type = instance.type
    if (compDef.type === 'button' && instance.size !== undefined) props.size = instance.size
    if (compDef.type === 'button' && instance.disabled !== undefined) props.disabled = instance.disabled
    if (compDef.type === 'button' && instance.loading !== undefined) props.loading = instance.loading
    if (compDef.type === 'button' && instance.plain !== undefined) props.plain = instance.plain
    if (compDef.type === 'button' && instance.round !== undefined) props.round = instance.round
    
    // Input
    if (compDef.type === 'input' && instance.placeholder !== undefined) props.placeholder = instance.placeholder
    if (compDef.type === 'input' && instance.disabled !== undefined) props.disabled = instance.disabled
    if (compDef.type === 'input' && instance.clearable !== undefined) props.clearable = instance.clearable
    
    // Select
    if (compDef.type === 'select' && instance.placeholder !== undefined) props.placeholder = instance.placeholder
    if (compDef.type === 'select' && instance.disabled !== undefined) props.disabled = instance.disabled
    if (compDef.type === 'select' && instance.clearable !== undefined) props.clearable = instance.clearable
    
    // Switch
    if (compDef.type === 'switch' && instance.value !== undefined) props.value = instance.value
    if (compDef.type === 'switch' && instance.activeText !== undefined) props.activeText = instance.activeText
    if (compDef.type === 'switch' && instance.inactiveText !== undefined) props.inactiveText = instance.inactiveText
    
    // Checkbox
    if (compDef.type === 'checkbox' && instance.text !== undefined) props.text = instance.text
    if (compDef.type === 'checkbox' && instance.value !== undefined) props.value = instance.value
    
    // Card
    if (compDef.type === 'card' && instance.header !== undefined) props.header = instance.header
    if (compDef.type === 'card' && instance.content !== undefined) props.content = instance.content
  }
  
  const comp: CanvasComponent = {
    id,
    type: compDef.type,
    instance,
    element,
    props,
    style: {
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
    }
  }
  
  return comp
}

// 选中组件
const selectComponent = (comp: CanvasComponent) => {
  selectedComponent.value = comp
}

// 画布点击
const handleCanvasClick = () => {
  selectedComponent.value = null
}

// 拖拽移动相关
const draggedElement = ref<CanvasComponent | null>(null)
let dragOffset = { x: 0, y: 0 }

const startDrag = (comp: CanvasComponent, event: MouseEvent) => {
  draggedElement.value = comp
  selectComponent(comp)
  
  // 计算拖拽偏移量
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  dragOffset.x = event.clientX - rect.left
  dragOffset.y = event.clientY - rect.top
  
  // 添加全局鼠标移动和抬起事件
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  event.preventDefault()
}

let rafId: number | null = null

const handleMouseMove = (event: MouseEvent) => {
  if (!draggedElement.value) return
  
  const canvasWrapper = document.querySelector('.canvas-content-wrapper') as HTMLElement
  if (!canvasWrapper) return
  
  const rect = canvasWrapper.getBoundingClientRect()
  
  // 计算相对于画布区域的位置
  let x = event.clientX - rect.left - dragOffset.x
  let y = event.clientY - rect.top - dragOffset.y
  
  // 画布区域边界（800x600）
  const canvasWidth = 800
  const canvasHeight = 600
  
  // 限制在画布范围内
  const maxX = canvasWidth - 40
  const maxY = canvasHeight - 40
  x = Math.max(0, Math.min(x, maxX))
  y = Math.max(0, Math.min(y, maxY))
  
  // 取消之前的 RAF
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  
  // 使用 RAF 优化性能
  rafId = requestAnimationFrame(() => {
    if (!draggedElement.value) return
    
    // 更新组件位置
    draggedElement.value.style.left = x + 'px'
    draggedElement.value.style.top = y + 'px'
    
    // 更新对应的组件
    const index = canvasComponents.value.findIndex(c => c.id === draggedElement.value!.id)
    if (index >= 0) {
      canvasComponents.value[index].style.left = x + 'px'
      canvasComponents.value[index].style.top = y + 'px'
    }
  })
}

const handleMouseUp = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  
  // 拖拽结束后更新代码
  updateCode()
  
  draggedElement.value = null
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// 更新样式
const updateStyle = (key: string, value: string) => {
  if (!selectedComponent.value) return
  selectedComponent.value.style[key] = value
}

// 属性配置
const propertyConfig: Record<string, any[]> = {
  button: [
    { key: 'text', label: '文本内容', type: 'text', placeholder: '按钮文本' },
    { key: 'type', label: '按钮类型', type: 'select', options: [
      { value: 'primary', label: 'Primary' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'danger', label: 'Danger' }
    ]},
    { key: 'size', label: '尺寸', type: 'select', options: [
      { value: 'large', label: 'Large' },
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small' }
    ]},
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'loading', label: '加载中', type: 'boolean' },
    { key: 'plain', label: '朴素按钮', type: 'boolean' },
    { key: 'round', label: '圆角', type: 'boolean' }
  ],
  input: [
    { key: 'placeholder', label: '占位符', type: 'text', placeholder: '请输入' },
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'clearable', label: '可清除', type: 'boolean' }
  ],
  select: [
    { key: 'placeholder', label: '占位符', type: 'text', placeholder: '请选择' },
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'clearable', label: '可清除', type: 'boolean' }
  ],
  switch: [
    { key: 'value', label: '开关状态', type: 'boolean' },
    { key: 'activeText', label: '开启文字', type: 'text' },
    { key: 'inactiveText', label: '关闭文字', type: 'text' }
  ],
  checkbox: [
    { key: 'text', label: '文本', type: 'text' },
    { key: 'value', label: '选中状态', type: 'boolean' }
  ],
  card: [
    { key: 'header', label: '标题', type: 'text' },
    { key: 'content', label: '内容', type: 'text' }
  ]
}

// 获取组件名称
const getComponentName = (type: string) => {
  const comp = components.find(c => c.type === type)
  return comp?.name || type
}

// 获取属性列表
const getPropertyList = (type: string) => {
  return propertyConfig[type] || []
}

// 获取属性值
const getPropValue = (comp: CanvasComponent, key: string) => {
  // 从 instance 获取实际值
  if (comp.instance && typeof comp.instance[key] !== 'undefined') {
    return comp.instance[key]
  }
  // 从 props 获取
  return comp.props[key]
}

// 更新动态属性
const updateDynamicProp = (key: string, value: any) => {
  if (!selectedComponent.value) return
  
  const comp = selectedComponent.value
  
  // 更新 instance
  if (comp.instance && typeof comp.instance[key] !== 'undefined') {
    comp.instance[key] = value
  } else if (comp.instance) {
    // 尝试调用对应的 setter 方法
    const setterMethod = 'set' + key.charAt(0).toUpperCase() + key.slice(1)
    if (typeof comp.instance[setterMethod] === 'function') {
      comp.instance[setterMethod](value)
    }
  }
  
  // 更新 props
  comp.props[key] = value
  
  // 重新渲染
  if (comp.instance && comp.instance.render) {
    const newElement = comp.instance.render()
    comp.element = newElement
  }
  
  // 更新整个画布以刷新视图
  canvasComponents.value = [...canvasComponents.value]
  updateCode()
}

// 移除组件
const removeComponent = (index: number) => {
  canvasComponents.value.splice(index, 1)
  if (selectedComponent.value?.id === canvasComponents.value[index]?.id) {
    selectedComponent.value = null
  }
  updateCode()
}

// 生成代码
const generatedCode = ref('')

const updateCode = () => {
  if (canvasComponents.value.length === 0) {
    generatedCode.value = '// 暂无组件，请从左侧拖拽组件到画布'
    return
  }
  
  // 收集所有需要的类
  const usedTypes = new Set(canvasComponents.value.map(c => c.type))
  const imports = []
  if (usedTypes.has('button')) imports.push('NhaiButtonCommand')
  if (usedTypes.has('input')) imports.push('NhaiInputCommand')
  if (usedTypes.has('select')) imports.push('NhaiSelectCommand')
  if (usedTypes.has('switch')) imports.push('NhaiSwitchCommand')
  if (usedTypes.has('checkbox')) imports.push('NhaiCheckboxCommand')
  if (usedTypes.has('card')) imports.push('NhaiCardCommand')
  
  let code = '// 复制以下代码到 showcase 的运行框中\n\n'
  code += `const { ${imports.join(', ')} } = window\n\n`
  code += 'const container = document.createElement(\'div\')\n'
  code += 'container.style.padding = \'20px\'\n'
  code += 'container.style.position = \'relative\'\n'
  code += 'container.style.width = \'800px\'\n'
  code += 'container.style.height = \'600px\'\n'
  code += 'container.style.border = \'1px solid #ddd\'\n\n'
  
  canvasComponents.value.forEach((comp, index) => {
    switch (comp.type) {
      case 'button':
        code += `const ${comp.type}${index} = new NhaiButtonCommand('${comp.props.text}')\n`
        code += `${comp.type}${index}.setType('${comp.props.type}')\n`
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      case 'input':
        code += `const ${comp.type}${index} = new NhaiInputCommand()\n`
        code += `${comp.type}${index}.setPlaceholder('请输入')\n`
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      case 'select':
        code += `const ${comp.type}${index} = new NhaiSelectCommand()\n`
        code += `${comp.type}${index}.setOptions([{label: '选项1', value: '1'}])\n`
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      case 'switch':
        code += `const ${comp.type}${index} = new NhaiSwitchCommand(false)\n`
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      case 'checkbox':
        code += `const ${comp.type}${index} = new NhaiCheckboxCommand('复选框')\n`
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      case 'card':
        code += `const ${comp.type}${index} = new NhaiCardCommand('标题', '内容')\n`
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      default:
        return
    }
    
    code += `element${index}.style.position = 'absolute'\n`
    code += `element${index}.style.left = '${comp.style.left}'\n`
    code += `element${index}.style.top = '${comp.style.top}'\n`
    code += `container.appendChild(element${index})\n\n`
  })
  
  code += 'return container\n'
  generatedCode.value = code
}

// 切换代码面板
const toggleCodePanel = () => {
  showCodePanel.value = !showCodePanel.value
}

// 复制代码
const copyCode = async () => {
  if (codeRef.value) {
    const text = codeRef.value.textContent || ''
    await navigator.clipboard.writeText(text)
    alert('✅ 代码已复制到剪贴板！')
  }
}

// 清空画布
const clearCanvas = () => {
  if (canvasComponents.value.length > 0 && confirm('确定要清空画布吗？')) {
    canvasComponents.value = []
    selectedComponent.value = null
    updateCode()
  }
}

// 保存设计
const saveDesign = () => {
  const data = {
    components: canvasComponents.value.map(c => ({
      type: c.type,
      props: c.props,
      style: c.style
    })),
    timestamp: Date.now()
  }
  
  localStorage.setItem('nhai-design', JSON.stringify(data))
  alert('✅ 设计已保存到本地存储')
}

// 节流函数
const throttle = (func: Function, delay: number) => {
  let lastExecTime = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastExecTime >= delay) {
      func(...args)
      lastExecTime = now
    }
  }
}

// 节流的更新代码函数
const throttledUpdateCode = throttle(() => {
  updateCode()
}, 300)

// 监听选中组件变化，更新代码（节流）
watch([canvasComponents, selectedComponent], () => {
  // 拖拽时不更新代码
  if (!draggedElement.value) {
    throttledUpdateCode()
  }
}, { deep: true })

// 暴露组件类到 window
onMounted(() => {
  ;(window as any).NhaiButtonCommand = NhaiButtonCommand
  ;(window as any).NhaiInputCommand = NhaiInputCommand
  ;(window as any).NhaiSelectCommand = NhaiSelectCommand
  ;(window as any).NhaiSwitchCommand = NhaiSwitchCommand
  ;(window as any).NhaiCheckboxCommand = NhaiCheckboxCommand
  ;(window as any).NhaiCardCommand = NhaiCardCommand
  ;(window as any).NhaiGridCommand = NhaiGridCommand
  ;(window as any).NhaiContainerCommand = NhaiContainerCommand
  ;(window as any).NhaiSplitPanelCommand = NhaiSplitPanelCommand
  console.log('✓ 所有组件类已暴露到全局作用域')
  
  updateCode()
})
</script>

<style scoped>
.designer-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.designer-header {
  background: white;
  padding: 12px 24px;
  padding-right: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #1890ff;
}

.tagline {
  color: #8c8c8c;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 8px;
}

.header-right button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-code {
  background: #1890ff;
  color: white;
}

.btn-code:hover {
  background: #40a9ff;
}

.btn-clear {
  background: #ff4d4f;
  color: white;
}

.btn-clear:hover {
  background: #ff7875;
}

.btn-save {
  background: #52c41a;
  color: white;
}

.btn-save:hover {
  background: #73d13d;
}

.designer-main {
  flex: 1;
  display: flex;
  gap: 1px;
  background: #e8e8e8;
  overflow: hidden;
}

.panel-container {
  position: relative;
}

.left-panel {
  width: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #e8e8e8;
  transition: width 0.3s ease;
  height: 100%;
}

.left-panel.collapsed {
  width: 0;
  overflow: hidden;
}

.panel-toggle {
  position: absolute;
  top: 50%;
  right: -1px;
  transform: translateY(-50%) translateX(50%);
  width: 20px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid white;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 8px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 100;
}

.panel-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.panel-toggle:hover::before {
  opacity: 1;
}

.panel-toggle:hover {
  transform: translateY(-50%) translateX(calc(50% + 2px));
  box-shadow: 4px 4px 12px rgba(102, 126, 234, 0.5);
}

.panel-toggle:active {
  transform: translateY(-50%) translateX(calc(50% + 1px));
}

.panel-toggle svg {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.panel-toggle:hover svg {
  transform: scale(1.2);
}

.panel-toggle.right {
  left: -1px;
  right: auto;
  transform: translateY(-50%) translateX(-50%);
  border-radius: 10px 0 0 10px;
  box-shadow: -2px 2px 8px rgba(102, 126, 234, 0.4);
}

.panel-toggle.right:hover {
  transform: translateY(-50%) translateX(calc(-50% - 2px));
  box-shadow: -4px 4px 12px rgba(102, 126, 234, 0.5);
}

.right-panel {
  width: 300px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid #e8e8e8;
  transition: width 0.3s ease;
  height: 100%;
}

.right-panel.collapsed {
  width: 0;
  overflow: hidden;
}

.panel-section {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.property-section {
  min-height: 300px;
  overflow-y: auto;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.component-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: move;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  transition: all 0.2s;
}

.component-item:hover {
  background: #f5f5f5;
  border-color: #1890ff;
  transform: translateX(2px);
}

.component-item i {
  font-size: 18px;
}

.property-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.component-category {
  margin-bottom: 20px;
}

.category-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.property-group {
  margin-bottom: 16px;
}

.property-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.property-group input,
.property-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
}

.property-group input:focus,
.property-group select:focus {
  outline: none;
  border-color: #1890ff;
}

.property-group input.disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.property-divider {
  margin: 16px 0 8px 0;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.checkbox-label span {
  color: #666;
  font-size: 14px;
}

.canvas-area {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.canvas-header {
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.canvas-header h3 {
  margin: 0;
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.canvas-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-hint {
  font-size: 12px;
  color: #666;
}

.canvas-content {
  flex: 1;
  position: relative;
  background: 
    linear-gradient(0deg, #f0f0f0 1px, transparent 1px),
    linear-gradient(90deg, #f0f0f0 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 0 0;
  overflow: auto;
}

.canvas-content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  border: 2px dashed #1890ff;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.canvas-component {
  position: absolute;
  cursor: move;
  padding: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.2s;
}

.canvas-component:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.canvas-component.selected {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.canvas-component.selected::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff4d4f;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.remove-btn:hover {
  background: #ff7875;
}

.empty-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.empty-canvas p {
  margin: 4px 0;
}

.code-panel {
  width: 400px;
  background: #1e1e1e;
  color: #d4d4d4;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #333;
}

.code-header {
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #252526;
}

.code-header h3 {
  margin: 0;
  font-size: 14px;
  color: #d4d4d4;
}

.btn-copy {
  background: #1890ff;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-copy:hover {
  background: #40a9ff;
}

.code-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
  background: #252526;
  color: #d4d4d4;
}
</style>
