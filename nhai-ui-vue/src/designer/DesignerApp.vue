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
          <h3>设计画布</h3>
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
          @dragover.dialog-content-area="handleDialogDragOver"
        >
          <div class="canvas-content-wrapper" @drop="handleDrop" @dragover.prevent="handleDialogDragOver">
            <div 
              v-for="(comp, index) in canvasComponents"
              :key="`${comp.id}-${comp._renderKey || 0}`"
              class="canvas-component"
              :data-component-id="comp.id"
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
          <div v-if="selectedComponent || selectedDialogChild || selectedLayoutChild" class="property-content">
            <!-- 组件类型 -->
            <div class="property-group">
              <label>组件类型</label>
              <input type="text" :value="getSelectedComponentName()" disabled class="disabled" />
            </div>
            
            <!-- 动态属性 -->
            <div v-for="prop in getSelectedPropertyList()" :key="prop.key" class="property-group">
              <label>{{ prop.label }}</label>
              
              <!-- 文本输入 -->
              <input 
                v-if="prop.type === 'text'"
                :value="getSelectedPropValue(prop.key)" 
                @input="updateSelectedDynamicProp(prop.key, ($event.target as HTMLInputElement).value)"
                :placeholder="prop.placeholder || ''"
              />
              
              <!-- 数字输入 -->
              <input 
                v-if="prop.type === 'number'"
                type="number"
                :value="getSelectedPropValue(prop.key)" 
                @input="updateSelectedDynamicProp(prop.key, Number(($event.target as HTMLInputElement).value))"
              />
              
              <!-- 选择器 -->
              <select 
                v-if="prop.type === 'select'"
                :value="getSelectedPropValue(prop.key)" 
                @change="updateSelectedDynamicProp(prop.key, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="opt in prop.options" :key="String(opt.value)" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              
              <!-- 布尔值 -->
              <label v-if="prop.type === 'boolean'" class="checkbox-label">
                <input 
                  type="checkbox"
                  :checked="getSelectedPropValue(prop.key)" 
                  @change="updateSelectedDynamicProp(prop.key, ($event.target as HTMLInputElement).checked)"
                />
                <span>{{ getSelectedPropValue(prop.key) ? '是' : '否' }}</span>
              </label>
            </div>
            
            <!-- 位置属性 -->
            <div class="property-divider">位置</div>
            <div class="property-group">
              <label>X 坐标</label>
              <input 
                type="number"
                :value="getSelectedPositionX()" 
                @input="updateSelectedPosition('left', ($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="property-group">
              <label>Y 坐标</label>
              <input 
                type="number"
                :value="getSelectedPositionY()" 
                @input="updateSelectedPosition('top', ($event.target as HTMLInputElement).value)"
              />
            </div>
            
            <!-- 删除按钮（对话框内控件和布局内控件显示） -->
            <div v-if="selectedDialogChild || selectedLayoutChild" class="property-divider">操作</div>
            <div v-if="selectedDialogChild" class="property-group">
              <button class="btn-delete" @click="removeDialogChild">🗑️ 删除控件</button>
            </div>
            <div v-if="selectedLayoutChild" class="property-group">
              <button class="btn-delete" @click="removeLayoutChild">🗑️ 删除控件</button>
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
import { ref, markRaw } from 'vue'
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
  NhaiDialogCommand,
  NhaiWidgetCommand,
} from '../components'
import { usePropertyEditor } from './composables/usePropertyEditor'
import { usePropertyPanel } from './composables/usePropertyPanel'
import { useCodeGenerator } from './composables/useCodeGenerator'

interface CanvasComponent {
  id: string
  type: string
  instance: any
  element: HTMLElement
  props: any
  style: any
  isInDialog?: boolean
  parentDialogId?: string
  dialogWrapper?: HTMLElement
  dialogInstance?: any  // 对话框命令实例（仅 dialog 类型），使用 any 避免 markRaw 导致的类型问题
  gridInstance?: any    // 网格命令实例（仅 grid 类型）
  containerInstance?: any  // 容器命令实例（仅 container 类型）
  widgetInstance?: any  // Widget 窗口命令实例（仅 widget 类型）
  _renderKey?: number   // 用于强制 Vue 重新渲染的键
}

// 组件库定义
const components = [
  { name: '按钮', type: 'button', icon: '🔘', category: '表单' },
  { name: '输入框', type: 'input', icon: '📝', category: '表单' },
  { name: '选择器', type: 'select', icon: '🔽', category: '表单' },
  { name: '开关', type: 'switch', icon: '🔀', category: '表单' },
  { name: '复选框', type: 'checkbox', icon: '☑️', category: '表单' },
  { name: '对话框', type: 'dialog', icon: '💬', category: '反馈' },
  { name: '窗口', type: 'widget', icon: '🪟', category: '反馈' },
  { name: '卡片', type: 'card', icon: '🃏', category: '布局' },
  { name: '网格', type: 'grid', icon: '⊞', category: '布局' },
  { name: '容器', type: 'container', icon: '📦', category: '布局' },
  { name: '分割面板', type: 'splitpanel', icon: '⚡', category: '布局' },
]

// 画布组件列表
const canvasComponents = ref<CanvasComponent[]>([])
const selectedComponent = ref<CanvasComponent | null>(null)

// 对话框内控件的映射（实例 -> 包装器和相关信息）
interface DialogChildInfo {
  instance: any
  wrapper: HTMLElement
  dialogId: string
  position: { x: number; y: number }
}
const dialogChildren = ref<Map<any, DialogChildInfo>>(new Map())

// 布局组件（Grid、Container）内控件的映射
interface LayoutChildInfo {
  instance: any
  element: HTMLElement
  layoutId: string
  layoutType: 'grid' | 'container'
}
const layoutChildren = ref<Map<any, LayoutChildInfo>>(new Map())

// 当前选中的对话框内控件（非画布组件）
const selectedDialogChild = ref<any | null>(null)

// 当前选中的布局内控件（Grid/Container 的子控件）
const selectedLayoutChild = ref<any | null>(null)
const showCodePanel = ref(false)
const codeRef = ref<HTMLElement>()
const canvasContentRef = ref<HTMLElement>()

// 面板收起状态
const leftPanelCollapsed = ref(false)
const rightPanelCollapsed = ref(false)

// 初始化 Composables
const propertyPanel = usePropertyPanel()
const getPropertyListFromPanel = propertyPanel.getPropertyList

const codeGenerator = useCodeGenerator({
  canvasComponents,
  dialogChildren,
  layoutChildren
})
const generatedCode = ref('')
const updateCode = () => {
  generatedCode.value = codeGenerator.generateCode()
}

const propertyEditor = usePropertyEditor({
  canvasComponents,
  dialogChildren,
  layoutChildren,
  selectedComponent,
  selectedDialogChild,
  selectedLayoutChild,
  getPropertyList: getPropertyListFromPanel,
  updateCode
})

// 从 composables 导出的方法
const {
  getSelectedPropValue,
  updateSelectedDynamicProp,
  getSelectedPositionX,
  getSelectedPositionY,
  updateSelectedPosition
} = propertyEditor

// 获取组件名称
const getComponentName = (type: string) => {
  const comp = components.find(c => c.type === type)
  return comp?.name || type
}

// 获取选中组件的名称（支持对话框内控件）
const getSelectedComponentName = () => {
  if (selectedComponent.value) {
    return getComponentName(selectedComponent.value.type)
  }
  if (selectedDialogChild.value) {
    const instance = selectedDialogChild.value
    if (instance instanceof NhaiButtonCommand) return getComponentName('button')
    if (instance instanceof NhaiInputCommand) return getComponentName('input')
    if (instance instanceof NhaiSelectCommand) return getComponentName('select')
    if (instance instanceof NhaiSwitchCommand) return getComponentName('switch')
    if (instance instanceof NhaiCheckboxCommand) return getComponentName('checkbox')
    if (instance instanceof NhaiCardCommand) return getComponentName('card')
    if (instance instanceof NhaiGridCommand) return getComponentName('grid')
    return '未知组件'
  }
  if (selectedLayoutChild.value) {
    const instance = selectedLayoutChild.value
    if (instance instanceof NhaiButtonCommand) return getComponentName('button')
    if (instance instanceof NhaiInputCommand) return getComponentName('input')
    if (instance instanceof NhaiSelectCommand) return getComponentName('select')
    if (instance instanceof NhaiSwitchCommand) return getComponentName('switch')
    if (instance instanceof NhaiCheckboxCommand) return getComponentName('checkbox')
    if (instance instanceof NhaiCardCommand) return getComponentName('card')
    return '未知组件'
  }
  return ''
}

// 获取选中组件的类型（支持对话框内控件）
const getSelectedComponentType = (): string | null => {
  if (selectedComponent.value) {
    return selectedComponent.value.type
  }
  if (selectedDialogChild.value) {
    const instance = selectedDialogChild.value
    if (instance instanceof NhaiButtonCommand) return 'button'
    if (instance instanceof NhaiInputCommand) return 'input'
    if (instance instanceof NhaiSelectCommand) return 'select'
    if (instance instanceof NhaiSwitchCommand) return 'switch'
    if (instance instanceof NhaiCheckboxCommand) return 'checkbox'
    if (instance instanceof NhaiCardCommand) return 'card'
    if (instance instanceof NhaiGridCommand) return 'grid'
  }
  if (selectedLayoutChild.value) {
    const instance = selectedLayoutChild.value
    if (instance instanceof NhaiButtonCommand) return 'button'
    if (instance instanceof NhaiInputCommand) return 'input'
    if (instance instanceof NhaiSelectCommand) return 'select'
    if (instance instanceof NhaiSwitchCommand) return 'switch'
    if (instance instanceof NhaiCheckboxCommand) return 'checkbox'
    if (instance instanceof NhaiCardCommand) return 'card'
  }
  return null
}

// 获取选中组件的属性列表（支持对话框内控件）
const getSelectedPropertyList = () => {
  const type = getSelectedComponentType()
  return type ? getPropertyListFromPanel(type) : []
}

// 工具函数
const toggleCodePanel = () => {
  showCodePanel.value = !showCodePanel.value
}

const clearCanvas = () => {
  if (confirm('确定要清空画布吗？此操作不可恢复。')) {
    canvasComponents.value = []
    dialogChildren.value.clear()
    layoutChildren.value.clear()
    selectedComponent.value = null
    selectedDialogChild.value = null
    selectedLayoutChild.value = null
    updateCode()
  }
}

const saveDesign = () => {
  const design = {
    components: canvasComponents.value.map(c => ({
      id: c.id,
      type: c.type,
      props: c.props,
      style: c.style
    })),
    timestamp: new Date().toISOString()
  }
  localStorage.setItem('designer-snapshot', JSON.stringify(design))
  alert('设计已保存到本地存储')
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    alert('代码已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动选择代码复制')
  }
}

// 移除对话框内的控件（包装函数）
const removeDialogChild = () => {
  if (!selectedDialogChild.value) return
  
  if (!confirm('确定要删除这个控件吗？')) {
    return
  }
  
  const instance = selectedDialogChild.value
  const childInfo = dialogChildren.value.get(instance)
  
  if (!childInfo) return
  
  // 找到对话框组件
  const dialogComp = canvasComponents.value.find(c => c.id === childInfo.dialogId && c.type === 'dialog')
  
  //ift 从对话框实例中移除子组件
  if (dialogComp?.dialogInstance) {
    dialogComp.dialogInstance.removeChild(instance)
  }
  
  // 卸载子组件实例（清理资源）
  if (instance && typeof instance.unmount === 'function') {
    instance.unmount()
  }
  
  // 从 DOM 中移除包装器
  if (childInfo.wrapper && childInfo.wrapper.parentNode) {
    childInfo.wrapper.parentNode.removeChild(childInfo.wrapper)
  }
  
  // 从映射中移除
  dialogChildren.value.delete(instance)
  
  // 如果对话框内没有控件了，显示占位符
  if (dialogComp?.dialogInstance) {
    const remainingChildren = dialogComp.dialogInstance.getChildren()
    if (remainingChildren.length === 0) {
      const dialogElement = document.querySelector(`.dialog-window[data-id="${childInfo.dialogId}"]`)
      if (dialogElement) {
        const bodyDiv = dialogElement.querySelector('.dialog-content-area')
        if (bodyDiv && !bodyDiv.querySelector('.dialog-placeholder')) {
          const placeholder = document.createElement('div')
          placeholder.className = 'dialog-placeholder'
          placeholder.textContent = '从左侧拖拽组件到这里'
          placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #c0c4cc;
            font-size: 14px;
            pointer-events: none;
          `
          bodyDiv.appendChild(placeholder)
        }
      }
    }
  }
  
  // 清除选中状态
  selectedDialogChild.value = null
  
  // 更新代码
  updateCode()
}

// 删除布局内的控件（Grid/Container 子控件）
const removeLayoutChild = () => {
  if (!selectedLayoutChild.value) return
  
  if (!confirm('确定要删除这个控件吗？')) {
    return
  }
  
  const instance = selectedLayoutChild.value
  const childInfo = layoutChildren.value.get(instance)
  
  if (!childInfo) return
  
  // 找到布局组件
  const layoutComp = canvasComponents.value.find(c => c.id === childInfo.layoutId && (c.type === 'grid' || c.type === 'container'))
  
  // 从布局实例中移除子组件
  if (layoutComp) {
    if (layoutComp.type === 'grid' && layoutComp.gridInstance) {
      layoutComp.gridInstance.removeChild(instance)
    } else if (layoutComp.type === 'container' && layoutComp.containerInstance) {
      layoutComp.containerInstance.removeChild(instance)
    }
  }
  
  // 卸载子组件实例（清理资源）
  if (instance && typeof instance.unmount === 'function') {
    instance.unmount()
  }
  
  // 从 DOM 中移除包装器
  if (childInfo.element && childInfo.element.parentNode) {
    childInfo.element.parentNode.removeChild(childInfo.element)
  }
  
  // 从映射中移除
  layoutChildren.value.delete(instance)
  
  // 清除选中状态
  selectedLayoutChild.value = null
  
  // 更新代码
  updateCode()
}

// 拖拽的组件
let draggedComponent: any = null

// 处理拖拽开始
const handleDragStart = (comp: any, event: DragEvent) => {
  draggedComponent = comp
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

// 处理对话框区域的拖拽悬停
const handleDialogDragOver = (event: DragEvent) => {
  const dialogBody = (event.target as Element).closest('.dialog-content-area')
  if (dialogBody) {
    dialogBody.classList.add('drag-over')
  } else {
    document.querySelectorAll('.dialog-content-area').forEach(el => {
      el.classList.remove('drag-over')
    })
  }
  
  // 拖拽结束时清除样式
  setTimeout(() => {
    if (event.type === 'dragend' || event.type === 'drop') {
      document.querySelectorAll('.dialog-content-area').forEach(el => {
        el.classList.remove('drag-over')
      })
    }
  }, 100)
}

// 处理放置
const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation() // 防止事件冒泡导致重复触发
  if (!draggedComponent) return

  // 检查是否放置到布局组件（Grid、Container）内
  // 方法1：检查是否直接点击到了 Container/Grid 元素（通过 data-id）
  let layoutElementWithId: Element | null = (event.target as Element).closest('[data-id]') as Element
  if (layoutElementWithId) {
    const layoutId = layoutElementWithId.getAttribute('data-id')
    if (layoutId) {
      const layoutComp = canvasComponents.value.find(c => c.id === layoutId && (c.type === 'grid' || c.type === 'container'))
      if (layoutComp) {
        // 查找实际的布局容器元素（.vue-grid 或 .vue-container）
        let layoutContainer: HTMLElement | null = null
        if (layoutComp.type === 'grid') {
          layoutContainer = layoutElementWithId.querySelector('.vue-grid') as HTMLElement
        } else if (layoutComp.type === 'container') {
          layoutContainer = layoutElementWithId.querySelector('.vue-container') as HTMLElement
        }
        
        // 如果找不到内部容器，使用元素本身（可能在 nextTick 中还没渲染好）
        if (!layoutContainer) {
          layoutContainer = layoutElementWithId as HTMLElement
        }
        
        if (layoutContainer && (layoutComp.gridInstance || layoutComp.containerInstance)) {
          // 创建子组件实例
          const childInstance = await createChildComponentInstance(draggedComponent)
          if (!childInstance) return
          
          // 确保 layoutContainer 是实际的容器元素（.vue-grid 或 .vue-container）
          const actualContainer = layoutContainer.classList.contains('vue-grid') || 
                                  layoutContainer.classList.contains('vue-container')
            ? layoutContainer
            : (layoutContainer.querySelector('.vue-grid, .vue-container') as HTMLElement) || layoutContainer
          
          // 创建包装器用于定位和交互（类似 Widget/Dialog）
          const wrapper = document.createElement('div')
          wrapper.className = layoutComp.type === 'grid' 
            ? 'grid-child-component layout-child-component' 
            : 'container-child-component layout-child-component'
          
          // Grid 使用 CSS Grid 布局，子控件作为 grid item 参与布局
          if (layoutComp.type === 'grid') {
            // Grid item：作为 CSS Grid 的子项，不需要 flex 属性
            wrapper.style.cssText = `
              cursor: move;
              user-select: none;
              border: 2px solid transparent;
              border-radius: 4px;
              transition: border-color 0.2s;
              min-width: 0;
              min-height: 0;
            `
          } else {
            // Container 使用相对定位
            wrapper.style.cssText = `
              position: relative;
              display: inline-block;
              cursor: move;
              user-select: none;
              border: 2px solid transparent;
              border-radius: 4px;
              transition: border-color 0.2s;
            `
          }
          
          wrapper.setAttribute(`data-${layoutComp.type}-child`, 'true')
          
          // 关键：在调用 addChild 之前，先设置映射指向 wrapper（空的）
          // 这样 addChild -> renderChild 会检测到 wrapper 并跳过
          const layoutInstance = layoutComp.gridInstance || layoutComp.containerInstance
          if (layoutInstance.childElements) {
            layoutInstance.childElements.set(childInstance.instance, wrapper)
          }
          
          // 现在可以安全地调用 addChild，renderChild 会检测到 wrapper 并跳过渲染
          layoutInstance.addChild(childInstance.instance)
          
          // 获取子组件元素
          let childElement = childInstance.instance.getElement()
          
          // 如果 addChild 的 renderChild 渲染了元素到 contentContainer，我们需要把它取出来
          if (childElement && childElement.parentNode) {
            const contentContainer = layoutInstance.contentContainer
            if (contentContainer && contentContainer.contains(childElement)) {
              // 从 contentContainer 中移除
              contentContainer.removeChild(childElement)
            } else if (childElement.parentNode) {
              // 如果不在 contentContainer 中，也在其他地方，也要移除
              childElement.parentNode.removeChild(childElement)
            }
          } else if (!childElement) {
            // 如果没有元素（renderChild 跳过了），才渲染（避免重复渲染）
            childElement = childInstance.instance.render()
          }
          
          if (!childElement) {
            console.warn('子组件元素未找到')
            return
          }
          
          // 将元素添加到 wrapper
          wrapper.appendChild(childElement)
          
          // Grid 子控件的特殊处理：确保子控件能正确参与 CSS Grid 布局
          if (layoutComp.type === 'grid' && childElement instanceof HTMLElement) {
            // 移除可能干扰 Grid 布局的定位样式
            if (childElement.style.position === 'absolute') {
              childElement.style.position = ''
              childElement.style.left = ''
              childElement.style.top = ''
            }
            // CSS Grid 会自动排列子控件，子控件默认填充所在的 grid cell
          }
          
          // 添加选中和拖拽功能
          wrapper.addEventListener('click', (e) => {
            e.stopPropagation()
            selectLayoutChild(childInstance.instance, layoutId)
          })
          
          wrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation()
            startDragLayoutChild(childInstance.instance, wrapper, e, layoutComp.type as 'grid' | 'container')
          })
          
          // 添加到布局容器中
          actualContainer.appendChild(wrapper)
          
          // 存储映射关系
          layoutChildren.value.set(childInstance.instance, {
            instance: childInstance.instance,
            element: wrapper, // 存储 wrapper 而不是直接的 element
            layoutId: layoutId,
            layoutType: layoutComp.type as 'grid' | 'container'
          })
          
          // 更新代码
          updateCode()
          draggedComponent = null
          return
        }
      }
    }
  }
  
  // 方法2：检查是否放置到了 .vue-grid 或 .vue-container 内部
  const layoutContainer = (event.target as Element).closest('.vue-grid, .vue-container') as HTMLElement
  if (layoutContainer) {
    // 向上查找带有 data-id 的父元素
    let parentWithId: Element | null = layoutContainer.parentElement
    while (parentWithId && !parentWithId.getAttribute('data-id')) {
      parentWithId = parentWithId.parentElement
    }
    
    if (parentWithId) {
      const layoutId = parentWithId.getAttribute('data-id')
      if (layoutId) {
        const layoutComp = canvasComponents.value.find(c => c.id === layoutId && (c.type === 'grid' || c.type === 'container'))
        if (layoutComp && (layoutComp.gridInstance || layoutComp.containerInstance)) {
          // 创建子组件实例
          const childInstance = await createChildComponentInstance(draggedComponent)
          if (!childInstance) return
          
          // 创建包装器用于定位和交互（类似 Widget/Dialog）
          const wrapper = document.createElement('div')
          wrapper.className = layoutComp.type === 'grid' 
            ? 'grid-child-component layout-child-component' 
            : 'container-child-component layout-child-component'
          
          // Grid 使用 CSS Grid 布局，子控件作为 grid item 参与布局
          if (layoutComp.type === 'grid') {
            // Grid item：作为 CSS Grid 的子项，不需要 flex 属性
            wrapper.style.cssText = `
              cursor: move;
              user-select: none;
              border: 2px solid transparent;
              border-radius: 4px;
              transition: border-color 0.2s;
              min-width: 0;
              min-height: 0;
            `
          } else {
            // Container 使用相对定位
            wrapper.style.cssText = `
              position: relative;
              display: inline-block;
              cursor: move;
              user-select: none;
              border: 2px solid transparent;
              border-radius: 4px;
              transition: border-color 0.2s;
            `
          }
          
          wrapper.setAttribute(`data-${layoutComp.type}-child`, 'true')
          
          // 关键：在调用 addChild 之前，先设置映射指向 wrapper（空的）
          // 这样 addChild -> renderChild 会检测到 wrapper 并跳过
          const layoutInstance = layoutComp.gridInstance || layoutComp.containerInstance
          if (layoutInstance.childElements) {
            layoutInstance.childElements.set(childInstance.instance, wrapper)
          }
          
          // 现在可以安全地调用 addChild，renderChild 会检测到 wrapper 并跳过渲染
          layoutInstance.addChild(childInstance.instance)
          
          // 获取子组件元素
          let childElement = childInstance.instance.getElement()
          
          // 如果 addChild 的 renderChild 渲染了元素到 contentContainer，我们需要把它取出来
          if (childElement && childElement.parentNode) {
            const contentContainer = layoutInstance.contentContainer
            if (contentContainer && contentContainer.contains(childElement)) {
              // 从 contentContainer 中移除
              contentContainer.removeChild(childElement)
            } else if (childElement.parentNode) {
              // 如果不在 contentContainer 中，也在其他地方，也要移除
              childElement.parentNode.removeChild(childElement)
            }
          } else if (!childElement) {
            // 如果没有元素（renderChild 跳过了），才渲染（避免重复渲染）
            childElement = childInstance.instance.render()
          }
          
          if (!childElement) {
            console.warn('子组件元素未找到')
            return
          }
          
          // 将元素添加到 wrapper
          wrapper.appendChild(childElement)
          
          // Grid 子控件的特殊处理：确保子控件能正确参与 CSS Grid 布局
          if (layoutComp.type === 'grid' && childElement instanceof HTMLElement) {
            // 移除可能干扰 Grid 布局的定位样式
            if (childElement.style.position === 'absolute') {
              childElement.style.position = ''
              childElement.style.left = ''
              childElement.style.top = ''
            }
            // CSS Grid 会自动排列子控件，子控件默认填充所在的 grid cell
          }
          
          // 添加选中和拖拽功能
          wrapper.addEventListener('click', (e) => {
            e.stopPropagation()
            selectLayoutChild(childInstance.instance, layoutId)
          })
          
          wrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation()
            startDragLayoutChild(childInstance.instance, wrapper, e, layoutComp.type as 'grid' | 'container')
          })
          
          // 添加到布局容器中
          layoutContainer.appendChild(wrapper)
          
          // 存储映射关系
          layoutChildren.value.set(childInstance.instance, {
            instance: childInstance.instance,
            element: wrapper, // 存储 wrapper 而不是直接的 element
            layoutId: layoutId,
            layoutType: layoutComp.type as 'grid' | 'container'
          })
          
          // 更新代码
          updateCode()
          draggedComponent = null
          return
        }
      }
    }
  }
  
  // 检查是否放置到 Widget 内容区域
  let widgetBody = (event.target as Element).closest('.widget-content') as HTMLElement
  if (widgetBody) {
    // 向上查找带有 data-id 的父元素
    let parentWithId: Element | null = widgetBody.parentElement
    while (parentWithId && !parentWithId.getAttribute('data-id')) {
      parentWithId = parentWithId.parentElement
    }
    
    if (parentWithId) {
      const widgetId = parentWithId.getAttribute('data-id')
      if (widgetId) {
        const widgetComp = canvasComponents.value.find(c => c.id === widgetId && c.type === 'widget')
        if (widgetComp && widgetComp.widgetInstance) {
          // 创建子组件实例
          const childInstance = await createChildComponentInstance(draggedComponent)
          if (!childInstance) return
          
          // 检查是否是 Grid，如果是则填充整个 Widget 内容区域
          const isGrid = draggedComponent.type === 'grid'
          
          // 计算放置位置（相对于 Widget 内容区域）
          const rect = widgetBody.getBoundingClientRect()
          const x = event.clientX - rect.left - 20
          const y = event.clientY - rect.top - 20
          
          // 关键：先创建 wrapper（但不添加内容），并立即更新 childElements 映射
          // 这样后续调用 addChild 时，renderChild 会检测到 wrapper 并跳过渲染
          const wrapper = document.createElement('div')
          wrapper.className = 'widget-child-component dialog-child-component'
          
          if (isGrid) {
            // Grid 自适应填充 Widget 内容区域
            wrapper.style.cssText = `
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              cursor: move;
              user-select: none;
              border: 2px solid transparent;
              border-radius: 4px;
              transition: border-color 0.2s;
              z-index: 10;
            `
          } else {
            wrapper.style.cssText = `
              position: absolute;
              left: ${x}px;
              top: ${y}px;
              cursor: move;
              user-select: none;
              border: 2px solid transparent;
              border-radius: 4px;
              transition: border-color 0.2s;
              z-index: 10;
            `
          }
          
          wrapper.setAttribute('data-widget-child', 'true')
          
          // 关键：在调用 addChild 之前，先设置映射指向 wrapper（空的）
          // 这样 addChild -> renderChild 会检测到 wrapper 并跳过
          if (widgetComp.widgetInstance.childElements) {
            widgetComp.widgetInstance.childElements.set(childInstance.instance, wrapper)
          }
          
          // 现在可以安全地调用 addChild，renderChild 会检测到 wrapper 并跳过渲染
          widgetComp.widgetInstance.addChild(childInstance.instance)
          
          // 获取子组件元素
          let childElement = childInstance.instance.getElement()
          
          // 如果 addChild 的 renderChild 渲染了元素到 contentContainer，我们需要把它取出来
          if (childElement && childElement.parentNode) {
            const contentContainer = widgetComp.widgetInstance.contentContainer
            if (contentContainer && contentContainer.contains(childElement)) {
              // 从 contentContainer 中移除
              contentContainer.removeChild(childElement)
            } else if (childElement.parentNode) {
              // 如果不在 contentContainer 中，也在其他地方，也要移除
              childElement.parentNode.removeChild(childElement)
            }
          } else if (!childElement) {
            // 如果没有元素（renderChild 跳过了），才渲染（避免重复渲染）
            childElement = childInstance.instance.render()
          }
          
          if (!childElement) {
            console.warn('子组件元素未找到')
            return
          }
          
          // 将元素添加到 wrapper
          wrapper.appendChild(childElement)
          
          // 如果是 Grid，设置 Grid 元素填充 wrapper
          if (isGrid && childElement instanceof HTMLElement) {
            // 移除 Grid 实例可能设置的 auto 样式，确保能填充 wrapper
            if (childElement.style.width === 'auto') {
              childElement.style.width = ''
            }
            if (childElement.style.height === 'auto') {
              childElement.style.height = ''
            }
            // 设置 Grid 外层容器填充 wrapper
            childElement.style.width = '100%'
            childElement.style.height = '100%'
            // 查找 Grid 的根元素（.vue-grid）并填充
            const gridRoot = childElement.querySelector('.vue-grid') as HTMLElement
            if (gridRoot) {
              gridRoot.style.width = '100%'
              gridRoot.style.height = '100%'
            }
            // 使用 nextTick 确保 Vue 组件已经渲染后再设置
            nextTick(() => {
              const gridRootAsync = childElement.querySelector('.vue-grid') as HTMLElement
              if (gridRootAsync) {
                gridRootAsync.style.width = '100%'
                gridRootAsync.style.height = '100%'
              }
            })
          }
          
          // 添加选中和拖拽功能
          wrapper.addEventListener('click', (e) => {
            e.stopPropagation()
            selectDialogChild(childInstance.instance, widgetId) // 复用 Dialog 的选中逻辑
          })
          
          wrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation()
            startDragDialogChild(childInstance.instance, wrapper, e)
          })
          
          widgetBody.appendChild(wrapper)
          
          // 存储映射关系（复用 dialogChildren）
          dialogChildren.value.set(childInstance.instance, {
            instance: childInstance.instance,
            wrapper: wrapper,
            dialogId: widgetId,
            position: isGrid ? { x: 0, y: 0 } : { x, y }
          })
          
          // 更新代码
          updateCode()
          // 重要：处理完成后，清除 draggedComponent 防止重复处理
          draggedComponent = null
          return
        }
      }
    }
  }
  
  // 检查是否放置到对话框内容区域
  // 优先检查 currentTarget（绑定了事件监听器的元素）
  let dialogBody = (event.currentTarget as Element).classList.contains('dialog-content-area') 
    ? (event.currentTarget as Element)
    : null
  
  // 如果没有，再检查 target 的最近父元素
  if (!dialogBody) {
    dialogBody = (event.target as Element).closest('.dialog-content-area')
  }
  if (dialogBody) {
    // 放置到对话框内部
    // 找到父对话框
    const dialogElement = dialogBody.closest('.dialog-window')
    const dialogId = dialogElement?.getAttribute('data-id')
    
    if (!dialogId) return
    
    // 找到对话框对应的 CanvasComponent
    const dialogComp = canvasComponents.value.find(c => c.id === dialogId && c.type === 'dialog')
    if (!dialogComp || !dialogComp.dialogInstance) {
      console.warn('未找到对话框实例:', dialogId)
      return
    }
    
    // 创建子组件实例
    const childInstance = await createChildComponentInstance(draggedComponent)
    if (!childInstance) return
    
    // 使用对话框实例的 addChild 方法添加子组件（建立父子关系）
    dialogComp.dialogInstance.addChild(childInstance.instance)
    
    // 获取子组件渲染后的元素
    const childElement = childInstance.instance.getElement()
    if (!childElement) {
      console.warn('子组件元素未找到')
      return
    }
    
    // 检查是否是 Grid，如果是则填充整个 Dialog 内容区域
    const isGrid = draggedComponent.type === 'grid'
    
    // 计算放置位置
    const rect = (dialogBody as HTMLElement).getBoundingClientRect()
    const x = event.clientX - rect.left - 20
    const y = event.clientY - rect.top - 20
    
    // 在可视化编辑器中，直接将子组件元素追加到对话框内容区域以便显示
    // 创建一个包装器以保持位置样式，并添加可选中、可拖拽的功能
    const wrapper = document.createElement('div')
    wrapper.className = 'dialog-child-component'
    
    if (isGrid) {
      // Grid 自适应填充 Dialog 内容区域
      wrapper.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        cursor: move;
        user-select: none;
        border: 2px solid transparent;
        border-radius: 4px;
        transition: border-color 0.2s;
      `
    } else {
      wrapper.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        cursor: move;
        user-select: none;
        border: 2px solid transparent;
        border-radius: 4px;
        transition: border-color 0.2s;
      `
    }
    
    wrapper.setAttribute('data-dialog-child', 'true')
    wrapper.appendChild(childElement)
    
    // 如果是 Grid，设置 Grid 元素填充 wrapper
    if (isGrid && childElement instanceof HTMLElement) {
      // 查找 Grid 的根元素（.vue-grid）
      const gridRoot = childElement.querySelector('.vue-grid') || childElement
      if (gridRoot instanceof HTMLElement) {
        gridRoot.style.width = '100%'
        gridRoot.style.height = '100%'
      }
      // 确保 wrapper 内的元素填充
      childElement.style.width = '100%'
      childElement.style.height = '100%'
    }
    
    // 添加选中状态的样式类（通过点击事件处理）
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation()
      selectDialogChild(childInstance.instance, dialogId)
    })
    
    // 添加拖拽功能
    wrapper.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      startDragDialogChild(childInstance.instance, wrapper, e)
    })
    
    ;(dialogBody as HTMLElement).appendChild(wrapper)
    
    // 存储映射关系
    dialogChildren.value.set(childInstance.instance, {
      instance: childInstance.instance,
      wrapper: wrapper,
      dialogId: dialogId,
      position: isGrid ? { x: 0, y: 0 } : { x, y }
    })
    
        // 移除占位符（如果存在）
        const placeholder = (dialogBody as HTMLElement).querySelector('.dialog-placeholder')
        if (placeholder) {
          placeholder.remove()
        }
        // 清除 draggedComponent 防止重复处理
        draggedComponent = null
      } else {
        // 放置到画布上
    const canvasWrapper = document.querySelector('.canvas-content-wrapper')
    if (!canvasWrapper) return
    
    const rect = (canvasWrapper as HTMLElement).getBoundingClientRect()
    let x = event.clientX - rect.left - 40
    let y = event.clientY - rect.top - 20
    
  // 限制在画布范围内（全屏画布）
  const maxX = 9999
  const maxY = 9999
  x = Math.max(0, Math.min(x, maxX))
  y = Math.max(0, Math.min(y, maxY))

    // 创建组件
    const comp = await createComponent(draggedComponent, x, y)
    
    // 添加到画布
    canvasComponents.value.push(comp)
    
    // 选中新组件
    await nextTick()
    selectComponent(comp)
  }
  
  draggedComponent = null
  updateCode()
}

// 按类别获取组件
const componentCategories = ref(['表单', '反馈', '布局'])
const getComponentsByCategory = (category: string) => {
  return components.filter(c => c.category === category)
}

// 创建子组件实例（用于添加到对话框等容器中）
const createChildComponentInstance = async (compDef: any): Promise<{ instance: any } | null> => {
  let instance: any
  
  switch (compDef.type) {
    case 'button':
      instance = new NhaiButtonCommand(`按钮`)
      instance.setType('primary')
      break
    case 'input':
      instance = new NhaiInputCommand()
      instance.setPlaceholder('请输入')
      break
    case 'select':
      instance = new NhaiSelectCommand()
      instance.setOptions([
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ])
      break
    case 'switch':
      instance = new NhaiSwitchCommand(false)
      instance.setActiveText('开')
      instance.setInactiveText('关')
      break
    case 'checkbox':
      instance = new NhaiCheckboxCommand('复选框')
      break
    case 'card':
      instance = new NhaiCardCommand('卡片标题', '卡片内容')
      break
    case 'grid':
      // 作为子控件时，不设置固定样式，让它能自适应父容器
      instance = new NhaiGridCommand({ container: true, columns: 12, spacing: 2 })
      break
    case 'container':
      instance = new NhaiContainerCommand()
      instance.setMaxWidth('lg')
      break
    case 'splitpanel':
      instance = new NhaiSplitPanelCommand()
      break
    case 'widget':
      instance = new NhaiWidgetCommand('窗口标题')
      instance.setWidth('800px')
      instance.setHeight('600px')
      instance.setPosition(100, 100)
      break
    default:
      return null
  }
  
  // 渲染组件（Widget 在 createComponent 中单独处理）
  if (compDef.type !== 'widget') {
    instance.render()
  }
  
  return { instance }
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
      instance = new NhaiGridCommand({ container: true, columns: 12, spacing: 2 })
      // Grid 不需要设置固定默认大小，让它根据内容和布局自适应
      // 但在可视化编辑器中，设置最小尺寸以方便查看和编辑
      instance.setStyle({ 
        minWidth: '200px', 
        minHeight: '100px',
        width: 'auto',
        height: 'auto'
      } as Partial<CSSStyleDeclaration>)
      element = instance.render()
      element.setAttribute('data-id', id)
      // 设置最小尺寸以确保在画布中可见
      if (element && element.style) {
        element.style.minWidth = '200px'
        element.style.minHeight = '100px'
        // 不设置固定宽高，让 Grid 自适应
      }
      break
    case 'container':
      instance = new NhaiContainerCommand()
      instance.setMaxWidth('lg')
      // 设置默认尺寸 800*600
      instance.setStyle({ width: '800px', height: '600px' } as Partial<CSSStyleDeclaration>)
      element = instance.render()
      element.setAttribute('data-id', id)
      // 同时设置到元素上，确保样式生效
      if (element && element.style) {
        element.style.width = '800px'
        element.style.height = '600px'
      }
      break
    case 'splitpanel':
      instance = new NhaiSplitPanelCommand()
      element = instance.render()
      break
    case 'widget':
      instance = new NhaiWidgetCommand('窗口标题')
      instance.setWidth('800px')
      instance.setHeight('600px')
      instance.setPosition(100, 100)
      element = instance.render()
      element.setAttribute('data-id', id)
      // Widget 在画布中需要调整为相对定位，而不是 fixed
      // 这样可以在画布中正常显示
      nextTick(() => {
        if (element) {
          // 查找 Widget 根元素（.nhai-widget）
          const widgetRoot = element.querySelector('.nhai-widget') as HTMLElement
          if (widgetRoot) {
            // 将 fixed 定位改为 relative，以便在画布中显示
            widgetRoot.style.position = 'relative'
            // 移除 top 和 left，因为它们已经在 canvas-component 上设置了
            widgetRoot.style.top = 'auto'
            widgetRoot.style.left = 'auto'
          }
        }
      })
      break
    case 'dialog':
      // Dialog 在画布上显示为可编辑的窗口
      instance = new NhaiDialogCommand('对话框标题', '')
      
      // 创建对话框窗口元素
      element = document.createElement('div')
      element.className = 'dialog-window'
      element.setAttribute('data-id', id)  // 设置对话框 ID，用于拖放时查找
      element.style.cssText = `
        width: 500px;
        min-height: 300px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `
      
      // 对话框头部
      const header = document.createElement('div')
      header.className = 'dialog-window-header'
      header.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid #e4e7ed;
        background: #fafafa;
        font-weight: 600;
        font-size: 16px;
        color: #303133;
        cursor: grab;
        user-select: none;
        position: relative;
      `
      header.textContent = '对话框标题'
      
      // 关闭按钮
      const closeBtn = document.createElement('span')
      closeBtn.className = 'dialog-window-close'
      closeBtn.innerHTML = '×'
      closeBtn.style.cssText = `
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ff4d4f;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
      `
      header.appendChild(closeBtn)
      element.appendChild(header)
      
      // 对话框内容区域（可拖放组件）
      const bodyDiv = document.createElement('div')
      bodyDiv.className = 'dialog-content-area'
      bodyDiv.style.cssText = `
        flex: 1;
        padding: 20px;
        min-height: 200px;
        position: relative;
        background: #ffffff;
      `
      bodyDiv.setAttribute('data-droppable', 'true')
      
      // 添加拖放事件监听 - 为对话框创建专用的处理函数
      const dropHandler = async (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedComponent) return
        
        // 检查是否是 Grid，如果是则填充整个 Dialog 内容区域
        const isGrid = draggedComponent.type === 'grid'
        
        // 找到父对话框
        const dialogElement = bodyDiv.closest('.dialog-window')
        const dialogId = dialogElement?.getAttribute('data-id')
        
        if (!dialogId) return
        
        // 找到对话框对应的 CanvasComponent
        const dialogComp = canvasComponents.value.find(c => c.id === dialogId && c.type === 'dialog')
        if (!dialogComp || !dialogComp.dialogInstance) {
          console.warn('未找到对话框实例:', dialogId)
          return
        }
        
        // 创建子组件实例（不创建 CanvasComponent，因为它是对话框的子组件）
        const childInstance = await createChildComponentInstance(draggedComponent)
        if (!childInstance) return
        
        // 使用对话框实例的 addChild 方法添加子组件（建立父子关系）
        dialogComp.dialogInstance.addChild(childInstance.instance)
        
        // 获取子组件渲染后的元素
        const childElement = childInstance.instance.getElement()
        if (!childElement) {
          console.warn('子组件元素未找到')
          return
        }
        
        // 计算放置位置
        const rect = bodyDiv.getBoundingClientRect()
        const x = e.clientX - rect.left - 20
        const y = e.clientY - rect.top - 20
        
        // 在可视化编辑器中，直接将子组件元素追加到对话框内容区域以便显示
        // 创建一个包装器以保持位置样式，并添加可选中、可拖拽的功能
        const wrapper = document.createElement('div')
        wrapper.className = 'dialog-child-component'
        
        if (isGrid) {
          // Grid 自适应填充 Dialog 内容区域
          wrapper.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            cursor: move;
            user-select: none;
            border: 2px solid transparent;
            border-radius: 4px;
            transition: border-color 0.2s;
          `
        } else {
          wrapper.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            cursor: move;
            user-select: none;
            border: 2px solid transparent;
            border-radius: 4px;
            transition: border-color 0.2s;
          `
        }
        
        wrapper.setAttribute('data-dialog-child', 'true')
        wrapper.appendChild(childElement)
        
        // 如果是 Grid，设置 Grid 元素填充 wrapper
        if (isGrid && childElement instanceof HTMLElement) {
          // 查找 Grid 的根元素（.vue-grid）
          const gridRoot = childElement.querySelector('.vue-grid') || childElement
          if (gridRoot instanceof HTMLElement) {
            gridRoot.style.width = '100%'
            gridRoot.style.height = '100%'
          }
          // 确保 wrapper 内的元素填充
          childElement.style.width = '100%'
          childElement.style.height = '100%'
        }
        
        // 添加选中状态的样式类（通过点击事件处理）
        wrapper.addEventListener('click', (e) => {
          e.stopPropagation()
          selectDialogChild(childInstance.instance, dialogId)
        })
        
        // 添加拖拽功能
        wrapper.addEventListener('mousedown', (e) => {
          e.stopPropagation()
          startDragDialogChild(childInstance.instance, wrapper, e)
        })
        
        bodyDiv.appendChild(wrapper)
        
        // 存储映射关系
        dialogChildren.value.set(childInstance.instance, {
          instance: childInstance.instance,
          wrapper: wrapper,
          dialogId: dialogId,
          position: isGrid ? { x: 0, y: 0 } : { x, y }
        })
        
        // 移除占位符（如果存在）
        const placeholder = bodyDiv.querySelector('.dialog-placeholder')
        if (placeholder) {
          placeholder.remove()
        }
        
        // 更新代码
        updateCode()
      }
      
      const dragoverHandler = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleDialogDragOver(e)
      }
      
      bodyDiv.addEventListener('drop', dropHandler)
      bodyDiv.addEventListener('dragover', dragoverHandler)
      
      // 存储事件监听器引用以便清理
      ;(bodyDiv as any).__dropHandler = dropHandler
      ;(bodyDiv as any).__dragoverHandler = dragoverHandler
      
      // 占位符
      const placeholder = document.createElement('div')
      placeholder.className = 'dialog-placeholder'
      placeholder.textContent = '从左侧拖拽组件到这里'
      placeholder.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #c0c4cc;
        font-size: 14px;
        pointer-events: none;
      `
      bodyDiv.appendChild(placeholder)
      element.appendChild(bodyDiv)
      
      // 对话框底部
      const footer = document.createElement('div')
      footer.className = 'dialog-window-footer'
      footer.style.cssText = `
        padding: 12px 20px;
        border-top: 1px solid #ebeef5;
        background: #fafafa;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      `
      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = '取消'
      cancelBtn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #dcdfe6;
        background: white;
        border-radius: 4px;
        cursor: pointer;
      `
      const confirmBtn = document.createElement('button')
      confirmBtn.textContent = '确定'
      confirmBtn.style.cssText = `
        padding: 8px 16px;
        border: none;
        background: #409eff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      `
      footer.appendChild(cancelBtn)
      footer.appendChild(confirmBtn)
      element.appendChild(footer)
      
      // 为对话框类型存储实例引用
      // 注意：dialogInstance 会在返回的 CanvasComponent 中设置
      
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
    if (compDef.type === 'button' && (instance as any).circle !== undefined) props.circle = (instance as any).circle
    if (compDef.type === 'button' && (instance as any).icon !== undefined) props.icon = (instance as any).icon
    if (compDef.type === 'button' && instance.disabled !== undefined) props.disabled = instance.disabled
    if (compDef.type === 'button' && instance.loading !== undefined) props.loading = instance.loading
    if (compDef.type === 'button' && instance.plain !== undefined) props.plain = instance.plain
    if (compDef.type === 'button' && instance.round !== undefined) props.round = instance.round
    
    // Input
    if (compDef.type === 'input') {
      const inputInstance = instance as any
      if (inputInstance._options) {
        props.value = inputInstance._options.value
        props.type = inputInstance._options.type
        props.placeholder = inputInstance._options.placeholder
        props.disabled = inputInstance._options.disabled
        props.clearable = inputInstance._options.clearable
        props.showPassword = inputInstance._options.showPassword
        props.prefixIcon = inputInstance._options.prefixIcon
        props.suffixIcon = inputInstance._options.suffixIcon
        props.maxlength = inputInstance._options.maxlength
        props.minlength = inputInstance._options.minlength
        props.size = inputInstance._options.size
      }
    }
    
    // Select
    if (compDef.type === 'select') {
      const selectInstance = instance as any
      if (selectInstance.placeholder !== undefined) props.placeholder = selectInstance.placeholder
      if (selectInstance.disabled !== undefined) props.disabled = selectInstance.disabled
      if (selectInstance.clearable !== undefined) props.clearable = selectInstance.clearable
      if (selectInstance.multiple !== undefined) props.multiple = selectInstance.multiple
      if (selectInstance.size !== undefined) props.size = selectInstance.size
    }
    
    // Switch
    if (compDef.type === 'switch') {
      const switchInstance = instance as any
      if (switchInstance.value !== undefined) props.value = switchInstance.value
      if (switchInstance.activeText !== undefined) props.activeText = switchInstance.activeText
      if (switchInstance.inactiveText !== undefined) props.inactiveText = switchInstance.inactiveText
      if (switchInstance.activeColor !== undefined) props.activeColor = switchInstance.activeColor
      if (switchInstance.inactiveColor !== undefined) props.inactiveColor = switchInstance.inactiveColor
      if (switchInstance.size !== undefined) props.size = switchInstance.size
      if (switchInstance.disabled !== undefined) props.disabled = switchInstance.disabled
    }
    
    // Checkbox
    if (compDef.type === 'checkbox') {
      const checkboxInstance = instance as any
      if (checkboxInstance.text !== undefined) props.text = checkboxInstance.text
      if (checkboxInstance.value !== undefined) props.value = checkboxInstance.value
      if (checkboxInstance.size !== undefined) props.size = checkboxInstance.size
      if (checkboxInstance.disabled !== undefined) props.disabled = checkboxInstance.disabled
      if (checkboxInstance.indeterminate !== undefined) props.indeterminate = checkboxInstance.indeterminate
    }
    
    // Card
    if (compDef.type === 'card') {
      const cardInstance = instance as any
      if (cardInstance.header !== undefined) props.header = cardInstance.header
      if (cardInstance.content !== undefined) props.content = cardInstance.content
      if (cardInstance.shadow !== undefined) props.shadow = cardInstance.shadow
    }
    
    // Dialog
    if (compDef.type === 'dialog') {
      const dialogInstance = instance as any
      props.title = dialogInstance.getTitle?.() || dialogInstance.title || '对话框标题'
      props.content = dialogInstance.getContent?.() || dialogInstance.content || ''
      props.width = dialogInstance.getWidth?.() || dialogInstance.width || '500px'
      props.fullscreen = dialogInstance.fullscreen ?? false
      props.modal = dialogInstance.modal ?? true
      props.showFooter = dialogInstance.showFooter ?? false
      props.confirmText = dialogInstance.confirmText || '确定'
      props.cancelText = dialogInstance.cancelText || '取消'
      props.draggable = dialogInstance.draggable ?? false
      props.center = dialogInstance.center ?? false
      props.closeOnClickModal = dialogInstance.closeOnClickModal ?? false
      props.closeOnPressEscape = dialogInstance.closeOnPressEscape ?? true
      props.showClose = dialogInstance.showClose ?? true
    }
    
    // Grid
    if (compDef.type === 'grid') {
      const gridInstance = instance as any
      // 只使用 gridCommand 中实际存在的属性
      props.container = gridInstance.container ?? true
      props.columns = gridInstance.columns ?? 12
      props.rows = gridInstance.rows
      props.templateAreas = gridInstance.templateAreas
      props.autoFlow = gridInstance.autoFlow ?? 'row'
      props.justifyItems = gridInstance.justifyItems ?? 'stretch'
      props.alignItems = gridInstance.alignItems ?? 'stretch'
      props.justifyContent = gridInstance.justifyContent
      props.alignContent = gridInstance.alignContent
      props.spacing = gridInstance.spacing ?? 2
      props.gap = gridInstance.gap
      // 设置默认宽度和高度
      if (!props.style) {
        props.style = {}
      }
      props.style.width = '800px'
      props.style.height = '600px'
    }
    
    // Container
    if (compDef.type === 'container') {
      const containerInstance = instance as any
      props.maxWidth = containerInstance.maxWidth ?? 'lg'
      props.fixed = containerInstance.fixed ?? false
      props.disableGutters = containerInstance.disableGutters ?? false
      // 设置默认宽度和高度
      if (!props.style) {
        props.style = {}
      }
      props.style.width = '800px'
      props.style.height = '600px'
    }
    
    // SplitPanel
    if (compDef.type === 'splitpanel') {
      const splitInstance = instance as any
      props.orientation = splitInstance.orientation || 'horizontal'
      props.splitPosition = splitInstance.splitPosition ?? 50
      props.minSize = splitInstance.minSize ?? 20
      props.maxSize = splitInstance.maxSize ?? 80
      props.resizable = splitInstance.resizable ?? true
      props.disabled = splitInstance.disabled ?? false
      props.leftContent = splitInstance.leftContent
      props.rightContent = splitInstance.rightContent
    }
    
    // Widget
    if (compDef.type === 'widget') {
      const widgetInstance = instance as any
      props.title = widgetInstance.title || '窗口标题'
      props.width = widgetInstance.width || '800px'
      props.height = widgetInstance.height || '600px'
      props.fullscreen = widgetInstance.fullscreen ?? false
      props.menuBarVisible = widgetInstance.menuBarVisible ?? true
      props.canMinimize = widgetInstance.canMinimize ?? true
      props.canMaximize = widgetInstance.canMaximize ?? true
      props.canClose = widgetInstance.canClose ?? true
      props.position = widgetInstance.position || { x: 100, y: 100 }
    }
  }
  
  // Container 默认尺寸 800*600
  // Widget 使用固定定位
  let initialStyle: any = {
    position: 'absolute',
    left: x + 'px',
    top: y + 'px',
  }
  
  if (compDef.type === 'container') {
    initialStyle.width = '800px'
    initialStyle.height = '600px'
  }
  
  // Widget 在画布上显示实际控件
  if (compDef.type === 'widget') {
    // Widget 使用绝对定位在画布中显示
    initialStyle = {
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
    }
  }
  
  const comp: CanvasComponent = {
    id,
    type: compDef.type,
    instance: markRaw(instance),
    element: markRaw(element),
    props,
    style: initialStyle
  }
  
  // 如果是对话框类型，存储对话框实例
  if (compDef.type === 'dialog' && instance instanceof NhaiDialogCommand) {
    comp.dialogInstance = instance as any
  }
  
  // 如果是网格类型，存储网格实例
  if (compDef.type === 'grid' && instance instanceof NhaiGridCommand) {
    comp.gridInstance = instance as any
  }
  
  // 如果是容器类型，存储容器实例
  if (compDef.type === 'container' && instance instanceof NhaiContainerCommand) {
    comp.containerInstance = instance as any
  }
  
  // 如果是 Widget 类型，存储 Widget 实例
  if (compDef.type === 'widget' && instance instanceof NhaiWidgetCommand) {
    comp.widgetInstance = instance as any
  }
  
  return comp
}

// 选中组件
const selectComponent = (comp: CanvasComponent) => {
  selectedComponent.value = comp
  selectedDialogChild.value = null  // 清除对话框内控件选中
  selectedLayoutChild.value = null  // 清除布局子控件选中
  clearDialogChildSelection()  // 清除所有对话框内控件的选中样式
  clearLayoutChildSelection()  // 清除所有布局子控件的选中样式
}

// 选中对话框内的控件
const selectDialogChild = (instance: any, _dialogId: string) => {
  selectedDialogChild.value = instance
  selectedComponent.value = null  // 清除画布组件选中
  selectedLayoutChild.value = null  // 清除布局子控件选中
  clearDialogChildSelection()  // 清除所有对话框内控件选中样式
  clearLayoutChildSelection()  // 清除所有布局子控件选中样式
  
  // 添加选中样式
  const childInfo = dialogChildren.value.get(instance)
  if (childInfo) {
    childInfo.wrapper.classList.add('selected')
  }
}

// 选中布局内的控件（Grid/Container 子控件）
const selectLayoutChild = (instance: any, _layoutId: string) => {
  selectedLayoutChild.value = instance
  selectedComponent.value = null  // 清除画布组件选中
  selectedDialogChild.value = null  // 清除对话框内控件选中
  clearLayoutChildSelection()  // 清除所有布局子控件选中样式
  clearDialogChildSelection()  // 清除所有对话框内控件选中样式
  
  // 添加选中样式
  const childInfo = layoutChildren.value.get(instance)
  if (childInfo) {
    childInfo.element.classList.add('selected')
  }
}

// 清除所有布局内控件的选中样式
const clearLayoutChildSelection = () => {
  layoutChildren.value.forEach((info) => {
    info.element.classList.remove('selected')
  })
}

// 清除所有对话框内控件的选中样式
const clearDialogChildSelection = () => {
  dialogChildren.value.forEach((info) => {
    info.wrapper.classList.remove('selected')
  })
}

// 画布点击
const handleCanvasClick = () => {
  selectedComponent.value = null
  selectedDialogChild.value = null
  selectedLayoutChild.value = null
  clearDialogChildSelection()
  clearLayoutChildSelection()
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
  
  // 全屏画布，不限制边界
  x = Math.max(0, x)
  y = Math.max(0, y)
  
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
  draggedDialogChild.value = null
  draggedLayoutChild.value = null
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mousemove', handleDialogChildMouseMove)
  document.removeEventListener('mousemove', handleLayoutChildMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mouseup', handleDialogChildMouseUp)
  document.removeEventListener('mouseup', handleLayoutChildMouseUp)
}

// 对话框内控件的拖拽移动相关
const draggedDialogChild = ref<{ instance: any; wrapper: HTMLElement; dialogId: string } | null>(null)
let dialogChildDragOffset = { x: 0, y: 0 }

const startDragDialogChild = (instance: any, wrapper: HTMLElement, event: MouseEvent) => {
  const childInfo = dialogChildren.value.get(instance)
  if (!childInfo) return
  
  selectedDialogChild.value = instance
  clearDialogChildSelection()
  wrapper.classList.add('selected')
  
  draggedDialogChild.value = {
    instance: instance,
    wrapper: wrapper,
    dialogId: childInfo.dialogId
  }
  
  // 计算拖拽偏移量（相对于包装器）
  const rect = wrapper.getBoundingClientRect()
  dialogChildDragOffset.x = event.clientX - rect.left
  dialogChildDragOffset.y = event.clientY - rect.top
  
  // 添加全局鼠标移动和抬起事件
  document.addEventListener('mousemove', handleDialogChildMouseMove)
  document.addEventListener('mouseup', handleDialogChildMouseUp)
  event.preventDefault()
  event.stopPropagation()
}

const handleDialogChildMouseMove = (event: MouseEvent) => {
  if (!draggedDialogChild.value) return
  
  const childInfo = dialogChildren.value.get(draggedDialogChild.value.instance)
  if (!childInfo) return
  
  // 检查是 Dialog 还是 Widget
  const dialogElement = document.querySelector(`.dialog-window[data-id="${draggedDialogChild.value.dialogId}"]`)
  
  let bodyDiv: HTMLElement | null = null
  
  if (dialogElement) {
    // Dialog 内容区域
    bodyDiv = dialogElement.querySelector('.dialog-content-area') as HTMLElement
  } else {
    // Widget 内容区域 - 需要查找 Widget 容器内的 .widget-content
    // Widget 的结构可能是：container > .nhai-widget > .widget-content
    const widgetContainer = document.querySelector(`[data-id="${draggedDialogChild.value.dialogId}"]`)
    if (widgetContainer) {
      // 在容器内查找 .widget-content
      bodyDiv = widgetContainer.querySelector('.widget-content') as HTMLElement
      // 如果没找到，可能在更深层的结构中
      if (!bodyDiv) {
        const widgetElement = widgetContainer.querySelector('.nhai-widget')
        if (widgetElement) {
          bodyDiv = widgetElement.querySelector('.widget-content') as HTMLElement
        }
      }
    }
  }
  
  if (!bodyDiv) return
  
  const rect = bodyDiv.getBoundingClientRect()
  
  // 计算相对于内容区域的位置
  let x = event.clientX - rect.left - dialogChildDragOffset.x
  let y = event.clientY - rect.top - dialogChildDragOffset.y
  
  // 限制在内容区域内
  x = Math.max(0, Math.min(x, rect.width - 50))
  y = Math.max(0, Math.min(y, rect.height - 30))
  
  // 取消之前的 RAF
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  
  // 使用 RAF 优化性能
  rafId = requestAnimationFrame(() => {
    if (!draggedDialogChild.value) return
    
    const info = dialogChildren.value.get(draggedDialogChild.value.instance)
    if (!info) return
    
    // 更新包装器位置
    info.wrapper.style.left = x + 'px'
    info.wrapper.style.top = y + 'px'
    
    // 更新存储的位置信息
    info.position = { x, y }
  })
}

const handleDialogChildMouseUp = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  
  // 拖拽结束后更新代码
  updateCode()
  
  draggedDialogChild.value = null
  document.removeEventListener('mousemove', handleDialogChildMouseMove)
  document.removeEventListener('mouseup', handleDialogChildMouseUp)
}

// 布局内控件的拖拽移动相关（Grid/Container 子控件）
const draggedLayoutChild = ref<{ instance: any; element: HTMLElement; layoutId: string; layoutType: 'grid' | 'container' } | null>(null)
let layoutChildDragOffset = { x: 0, y: 0 }

const startDragLayoutChild = (instance: any, element: HTMLElement, event: MouseEvent, layoutType: 'grid' | 'container') => {
  const childInfo = layoutChildren.value.get(instance)
  if (!childInfo) return
  
  selectedLayoutChild.value = instance
  clearLayoutChildSelection()
  childInfo.element.classList.add('selected')
  
  // 计算拖拽偏移量（相对于 wrapper 的偏移）
  const rect = element.getBoundingClientRect()
  layoutChildDragOffset.x = event.clientX - rect.left
  layoutChildDragOffset.y = event.clientY - rect.top
  
  draggedLayoutChild.value = {
    instance: instance,
    element: element,
    layoutId: childInfo.layoutId,
    layoutType: layoutType
  }
  
  document.addEventListener('mousemove', handleLayoutChildMouseMove)
  document.addEventListener('mouseup', handleLayoutChildMouseUp)
  event.preventDefault()
  event.stopPropagation()
}

const handleLayoutChildMouseMove = (event: MouseEvent) => {
  if (!draggedLayoutChild.value) return
  
  const childInfo = layoutChildren.value.get(draggedLayoutChild.value.instance)
  if (!childInfo) return
  
  // 查找布局容器
  const layoutElement = document.querySelector(`[data-id="${draggedLayoutChild.value.layoutId}"]`)
  if (!layoutElement) return
  
  let layoutContainer: HTMLElement | null = null
  if (draggedLayoutChild.value.layoutType === 'grid') {
    layoutContainer = layoutElement.querySelector('.vue-grid') as HTMLElement
  } else {
    layoutContainer = layoutElement.querySelector('.vue-container') as HTMLElement
  }
  
  if (!layoutContainer) return
  
  // Grid 使用 flex 布局，不支持通过拖拽改变位置（位置由 Grid 的布局属性控制）
  // Container 支持绝对定位拖拽
  if (draggedLayoutChild.value.layoutType === 'grid') {
    // Grid 的 flex 布局会自动排列子控件，不支持自由拖拽移动
    // 如果需要改变顺序，应该通过调整 Grid 的布局属性或 DOM 顺序来实现
    return
  }
  
  const rect = layoutContainer.getBoundingClientRect()
  
  // 计算新位置（相对于布局容器）
  let x = event.clientX - rect.left - layoutChildDragOffset.x
  let y = event.clientY - rect.top - layoutChildDragOffset.y
  
  // 限制在容器内
  x = Math.max(0, Math.min(x, rect.width - 50))
  y = Math.max(0, Math.min(y, rect.height - 30))
  
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  
  rafId = requestAnimationFrame(() => {
    if (!draggedLayoutChild.value) return
    
    const info = layoutChildren.value.get(draggedLayoutChild.value.instance)
    if (!info) return
    
    // Container 可以使用绝对定位移动
    info.element.style.position = 'relative'
    info.element.style.left = x + 'px'
    info.element.style.top = y + 'px'
  })
}

const handleLayoutChildMouseUp = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  
  // 拖拽结束后更新代码
  updateCode()
  
  draggedLayoutChild.value = null
  document.removeEventListener('mousemove', handleLayoutChildMouseMove)
  document.removeEventListener('mouseup', handleLayoutChildMouseUp)
}

// 属性配置已迁移到 usePropertyPanel composable
// 获取属性值已迁移到 usePropertyEditor composable

// 移除组件
const removeComponent = (index: number) => {
  canvasComponents.value.splice(index, 1)
  if (selectedComponent.value?.id === canvasComponents.value[index]?.id) {
    selectedComponent.value = null
  }
  updateCode()
}

</script>

<style scoped>
/* 设计器主容器 */
.designer-app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部工具栏 */
.designer-header {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.header-left h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.header-left .tagline {
  font-size: 12px;
  color: #6b7280;
  margin-left: 12px;
}

.header-right {
  display: flex;
  gap: 10px;
}

.btn-code,
.btn-clear,
.btn-save {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-code:hover,
.btn-clear:hover,
.btn-save:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-code:active,
.btn-clear:active,
.btn-save:active {
  background: #f3f4f6;
}

/* 主内容区域 */
.designer-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

/* 面板容器 */
.panel-container {
  position: relative;
  display: flex;
  background: white;
  border-right: 1px solid #e5e7eb;
}

.panel-container.left {
  width: 280px;
  transition: width 0.3s ease;
}

.panel-container.left:has(.left-panel.collapsed) {
  width: 0;
}

.panel-container.right {
  width: 320px;
  transition: width 0.3s ease;
}

.panel-container.right:has(.right-panel.collapsed) {
  width: 0;
}

/* 左侧面板 */
.left-panel {
  width: 100%;
  height: 100%;
  background: #f9fafb;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease;
}

.left-panel.collapsed {
  width: 0;
  overflow: hidden;
}

.panel-section {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.component-category {
  margin-bottom: 20px;
}

.category-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.component-item {
  padding: 10px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  user-select: none;
}

.component-item:hover {
  background: #f0f9ff;
  border-color: #3b82f6;
  transform: translateX(2px);
}

.component-item:active {
  cursor: grabbing;
  background: #dbeafe;
}

.component-item i {
  font-size: 18px;
}

.component-item span {
  font-size: 13px;
  color: #374151;
}

/* 面板收起按钮 */
.panel-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e5e7eb;
  border-left: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}

.panel-container.left .panel-toggle {
  right: -24px;
  border-radius: 0 6px 6px 0;
}

.panel-container.right .panel-toggle {
  left: -24px;
  border-radius: 6px 0 0 6px;
  border-left: 1px solid #e5e7eb;
  border-right: none;
}

.panel-toggle:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* 画布区域 */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.canvas-header {
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
}

.canvas-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.canvas-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-hint {
  font-size: 12px;
  color: #6b7280;
}

.canvas-content {
  flex: 1;
  position: relative;
  overflow: auto;
  background: #fafafa;
  background-image: 
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-content-wrapper {
  position: relative;
  min-height: 100%;
  min-width: 100%;
}

.canvas-component {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: move;
  transition: border-color 0.2s;
  z-index: 1;
}

.canvas-component:hover {
  border-color: #93c5fd;
}

.canvas-component.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.remove-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.canvas-component:hover .remove-btn,
.canvas-component.selected .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: #dc2626;
}

.empty-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #9ca3af;
}

.empty-canvas p {
  margin: 8px 0;
  font-size: 14px;
}

/* 右侧属性面板 */
.right-panel {
  width: 100%;
  height: 100%;
  background: white;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 1px solid #e5e7eb;
}

.right-panel.collapsed {
  width: 0;
  overflow: hidden;
}

.property-content {
  padding: 16px;
}

.property-empty {
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
}

.property-divider {
  margin: 20px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-group {
  margin-bottom: 16px;
}

.property-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.property-group input[type="text"],
.property-group input[type="number"],
.property-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.property-group input:focus,
.property-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.property-group input.disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn-delete {
  width: 100%;
  padding: 10px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #dc2626;
}

/* 代码面板 */
.code-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 500px;
  height: 100%;
  background: #1e293b;
  border-left: 1px solid #334155;
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.code-header {
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
}

.code-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.btn-copy {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #2563eb;
}

.code-content {
  flex: 1;
  padding: 20px;
  margin: 0;
  overflow: auto;
  background: #0f172a;
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 对话框子组件样式 */
.dialog-content-area {
  position: relative;
  min-height: 200px;
  background: white;
}

.dialog-content-area.drag-over {
  background: #eff6ff;
  border: 2px dashed #3b82f6;
}

.dialog-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #c0c4cc;
  font-size: 14px;
  pointer-events: none;
}

/* 对话框子组件包装器 */
.dialog-child-component {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: move;
  transition: border-color 0.2s;
}

.dialog-child-component:hover {
  border-color: #93c5fd;
}

.dialog-child-component.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 布局子组件样式 */
.grid-child-component,
.container-child-component {
  position: relative;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: move;
  transition: border-color 0.2s;
}

.grid-child-component:hover,
.container-child-component:hover {
  border-color: #93c5fd;
}

.grid-child-component.selected,
.container-child-component.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 滚动条样式 */
.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar,
.canvas-content::-webkit-scrollbar,
.code-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.left-panel::-webkit-scrollbar-track,
.right-panel::-webkit-scrollbar-track,
.canvas-content::-webkit-scrollbar-track,
.code-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb,
.canvas-content::-webkit-scrollbar-thumb,
.code-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.left-panel::-webkit-scrollbar-thumb:hover,
.right-panel::-webkit-scrollbar-thumb:hover,
.canvas-content::-webkit-scrollbar-thumb:hover,
.code-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

</style>
