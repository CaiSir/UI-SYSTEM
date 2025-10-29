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
          <div v-if="selectedComponent || selectedDialogChild" class="property-content">
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
                <option v-for="opt in prop.options" :key="opt.value" :value="opt.value">
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
            
            <!-- 删除按钮（仅对话框内控件显示） -->
            <div v-if="selectedDialogChild" class="property-divider">操作</div>
            <div v-if="selectedDialogChild" class="property-group">
              <button class="btn-delete" @click="removeDialogChild">🗑️ 删除控件</button>
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
import { ref, watch, onMounted, markRaw } from 'vue'
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

// 当前选中的布局内控件（暂未使用，但保留以备将来扩展）
// const selectedLayoutChild = ref<any | null>(null)
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
          
          // 使用布局实例的 addChild 方法添加子组件
          const layoutInstance = layoutComp.gridInstance || layoutComp.containerInstance
          layoutInstance.addChild(childInstance.instance)
          
          // 获取子组件渲染后的元素
          const childElement = childInstance.instance.getElement()
          if (!childElement) {
            console.warn('子组件元素未找到')
            return
          }
          
          // 确保 layoutContainer 是实际的容器元素（.vue-grid 或 .vue-container）
          // 如果当前 layoutContainer 不是，重新查找
          const actualContainer = layoutContainer.classList.contains('vue-grid') || 
                                  layoutContainer.classList.contains('vue-container')
            ? layoutContainer
            : (layoutContainer.querySelector('.vue-grid, .vue-container') as HTMLElement) || layoutContainer
          
          // 直接添加到布局容器中（不需要绝对定位）
          actualContainer.appendChild(childElement)
          
          // 存储映射关系
          layoutChildren.value.set(childInstance.instance, {
            instance: childInstance.instance,
            element: childElement,
            layoutId: layoutId,
            layoutType: layoutComp.type as 'grid' | 'container'
          })
          
          // 更新代码
          updateCode()
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
          
          // 使用布局实例的 addChild 方法添加子组件
          const layoutInstance = layoutComp.gridInstance || layoutComp.containerInstance
          layoutInstance.addChild(childInstance.instance)
          
          // 获取子组件渲染后的元素
          const childElement = childInstance.instance.getElement()
          if (!childElement) {
            console.warn('子组件元素未找到')
            return
          }
          
          // 直接添加到布局容器中（不需要绝对定位）
          layoutContainer.appendChild(childElement)
          
          // 存储映射关系
          layoutChildren.value.set(childInstance.instance, {
            instance: childInstance.instance,
            element: childElement,
            layoutId: layoutId,
            layoutType: layoutComp.type as 'grid' | 'container'
          })
          
          // 更新代码
          updateCode()
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
          
          // 计算放置位置（相对于 Widget 内容区域）
          const rect = widgetBody.getBoundingClientRect()
          const x = event.clientX - rect.left - 20
          const y = event.clientY - rect.top - 20
          
          // 关键：先创建 wrapper（但不添加内容），并立即更新 childElements 映射
          // 这样后续调用 addChild 时，renderChild 会检测到 wrapper 并跳过渲染
          const wrapper = document.createElement('div')
          wrapper.className = 'widget-child-component dialog-child-component'
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
            position: { x, y }
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
    
    // 计算放置位置
    const rect = (dialogBody as HTMLElement).getBoundingClientRect()
    const x = event.clientX - rect.left - 20
    const y = event.clientY - rect.top - 20
    
    // 在可视化编辑器中，直接将子组件元素追加到对话框内容区域以便显示
    // 创建一个包装器以保持位置样式，并添加可选中、可拖拽的功能
    const wrapper = document.createElement('div')
    wrapper.className = 'dialog-child-component'
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
    wrapper.setAttribute('data-dialog-child', 'true')
    wrapper.appendChild(childElement)
    
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
      position: { x, y }
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
      instance = new NhaiGridCommand()
      instance.setContainer(true)
      instance.setSpacing(16)
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
      instance = new NhaiGridCommand()
      instance.setContainer(true)
      instance.setSpacing(16)
      element = instance.render()
      element.setAttribute('data-id', id)
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
        wrapper.setAttribute('data-dialog-child', 'true')
        wrapper.appendChild(childElement)
        
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
          position: { x, y }
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
      props.container = gridInstance.container ?? false
      props.spacing = gridInstance.spacing ?? 2
      props.direction = gridInstance.direction || 'row'
      props.justify = gridInstance.justify || 'flex-start'
      props.alignItems = gridInstance.alignItems || 'stretch'
      props.wrap = gridInstance.wrap || 'wrap'
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
  clearDialogChildSelection()  // 清除所有对话框内控件的选中样式
}

// 选中对话框内的控件
const selectDialogChild = (instance: any, _dialogId: string) => {
  selectedDialogChild.value = instance
  selectedComponent.value = null  // 清除画布组件选中
  clearDialogChildSelection()  // 清除所有选中样式
  
  // 添加选中样式
  const childInfo = dialogChildren.value.get(instance)
  if (childInfo) {
    childInfo.wrapper.classList.add('selected')
  }
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
  clearDialogChildSelection()
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
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mousemove', handleDialogChildMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mouseup', handleDialogChildMouseUp)
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
      { value: 'default', label: 'Default' },
      { value: 'primary', label: 'Primary' },
      { value: 'success', label: 'Success' },
      { value: 'info', label: 'Info' },
      { value: 'warning', label: 'Warning' },
      { value: 'danger', label: 'Danger' }
    ]},
    { key: 'size', label: '预设尺寸', type: 'select', options: [
      { value: 'large', label: 'Large' },
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small' }
    ]},
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：100px 或 50%' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：40px' },
    { key: 'icon', label: '图标', type: 'text', placeholder: '图标名称（如：el-icon-edit）' },
    { key: 'plain', label: '朴素按钮', type: 'boolean' },
    { key: 'round', label: '圆角', type: 'boolean' },
    { key: 'circle', label: '圆形按钮', type: 'boolean' },
    { key: 'loading', label: '加载中', type: 'boolean' },
    { key: 'disabled', label: '禁用', type: 'boolean' }
  ],
  input: [
    { key: 'value', label: '输入值', type: 'text', placeholder: '输入内容' },
    { key: 'type', label: '输入类型', type: 'select', options: [
      { value: 'text', label: '文本' },
      { value: 'textarea', label: '多行文本' },
      { value: 'password', label: '密码' }
    ]},
    { key: 'placeholder', label: '占位符', type: 'text', placeholder: '请输入' },
    { key: 'size', label: '尺寸', type: 'select', options: [
      { value: 'large', label: 'Large' },
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small' }
    ]},
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'clearable', label: '可清除', type: 'boolean' },
    { key: 'showPassword', label: '显示密码', type: 'boolean' },
    { key: 'prefixIcon', label: '前缀图标', type: 'text', placeholder: '图标名称' },
    { key: 'suffixIcon', label: '后缀图标', type: 'text', placeholder: '图标名称' },
    { key: 'maxlength', label: '最大长度', type: 'number', placeholder: '0 表示无限制' },
    { key: 'minlength', label: '最小长度', type: 'number', placeholder: '0' },
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：200px 或 50%' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：40px' }
  ],
  select: [
    { key: 'placeholder', label: '占位符', type: 'text', placeholder: '请选择' },
    { key: 'size', label: '尺寸', type: 'select', options: [
      { value: 'large', label: 'Large' },
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small' }
    ]},
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'clearable', label: '可清除', type: 'boolean' },
    { key: 'multiple', label: '多选', type: 'boolean' },
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：200px 或 50%' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：40px' }
  ],
  switch: [
    { key: 'value', label: '开关状态', type: 'boolean' },
    { key: 'size', label: '尺寸', type: 'select', options: [
      { value: 'large', label: 'Large' },
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small' }
    ]},
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'activeText', label: '开启文字', type: 'text', placeholder: '开' },
    { key: 'inactiveText', label: '关闭文字', type: 'text', placeholder: '关' },
    { key: 'activeColor', label: '开启颜色', type: 'text', placeholder: '#409EFF' },
    { key: 'inactiveColor', label: '关闭颜色', type: 'text', placeholder: '#C0CCDA' }
  ],
  checkbox: [
    { key: 'text', label: '文本', type: 'text', placeholder: '复选框文本' },
    { key: 'value', label: '选中状态', type: 'boolean' },
    { key: 'size', label: '尺寸', type: 'select', options: [
      { value: 'large', label: 'Large' },
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small' }
    ]},
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'indeterminate', label: '半选状态', type: 'boolean' }
  ],
  card: [
    { key: 'header', label: '标题', type: 'text', placeholder: '卡片标题' },
    { key: 'content', label: '内容', type: 'text', placeholder: '卡片内容' },
    { key: 'shadow', label: '阴影效果', type: 'select', options: [
      { value: 'always', label: 'Always' },
      { value: 'hover', label: 'Hover' },
      { value: 'never', label: 'Never' }
    ]},
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：300px 或 50%' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：200px' }
  ],
  dialog: [
    { key: 'title', label: '对话框标题', type: 'text', placeholder: '对话框标题' },
    { key: 'content', label: '对话框内容', type: 'text', placeholder: '对话框内容（支持HTML）' },
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：500px 或 50%' },
    { key: 'fullscreen', label: '全屏显示', type: 'boolean' },
    { key: 'modal', label: '显示遮罩层', type: 'boolean' },
    { key: 'showFooter', label: '显示底部按钮', type: 'boolean' },
    { key: 'confirmText', label: '确认按钮文本', type: 'text', placeholder: '确定' },
    { key: 'cancelText', label: '取消按钮文本', type: 'text', placeholder: '取消' },
    { key: 'draggable', label: '可拖动', type: 'boolean' },
    { key: 'center', label: '居中显示', type: 'boolean' },
    { key: 'closeOnClickModal', label: '点击遮罩关闭', type: 'boolean' },
    { key: 'closeOnPressEscape', label: '按ESC关闭', type: 'boolean' },
    { key: 'showClose', label: '显示关闭按钮', type: 'boolean' }
  ],
  widget: [
    { key: 'title', label: '窗口标题', type: 'text', placeholder: '窗口标题' },
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：800px 或 50%' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：600px' },
    { key: 'fullscreen', label: '全屏显示', type: 'boolean' },
    { key: 'menuBarVisible', label: '显示菜单栏', type: 'boolean' },
    { key: 'canMinimize', label: '允许最小化', type: 'boolean' },
    { key: 'canMaximize', label: '允许最大化', type: 'boolean' },
    { key: 'canClose', label: '允许关闭', type: 'boolean' }
  ],
  grid: [
    { key: 'container', label: '容器模式', type: 'boolean' },
    { key: 'spacing', label: '间距', type: 'number', placeholder: '2' },
    { key: 'direction', label: '方向', type: 'select', options: [
      { value: 'row', label: 'Row（水平）' },
      { value: 'column', label: 'Column（垂直）' },
      { value: 'row-reverse', label: 'Row Reverse' },
      { value: 'column-reverse', label: 'Column Reverse' }
    ]},
    { key: 'justify', label: '主轴对齐', type: 'select', options: [
      { value: 'flex-start', label: 'Flex Start' },
      { value: 'center', label: 'Center' },
      { value: 'flex-end', label: 'Flex End' },
      { value: 'space-between', label: 'Space Between' },
      { value: 'space-around', label: 'Space Around' },
      { value: 'space-evenly', label: 'Space Evenly' }
    ]},
    { key: 'alignItems', label: '交叉轴对齐', type: 'select', options: [
      { value: 'flex-start', label: 'Flex Start' },
      { value: 'center', label: 'Center' },
      { value: 'flex-end', label: 'Flex End' },
      { value: 'stretch', label: 'Stretch' },
      { value: 'baseline', label: 'Baseline' }
    ]},
    { key: 'wrap', label: '换行', type: 'select', options: [
      { value: 'nowrap', label: 'No Wrap' },
      { value: 'wrap', label: 'Wrap' },
      { value: 'wrap-reverse', label: 'Wrap Reverse' }
    ]},
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：100% 或 500px' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：300px' }
  ],
  container: [
    { key: 'maxWidth', label: '最大宽度', type: 'select', options: [
      { value: 'xs', label: 'XS (444px)' },
      { value: 'sm', label: 'SM (600px)' },
      { value: 'md', label: 'MD (900px)' },
      { value: 'lg', label: 'LG (1200px)' },
      { value: 'xl', label: 'XL (1536px)' },
      { value: 'false', label: '无限制' }
    ]},
    { key: 'fixed', label: '固定宽度', type: 'boolean' },
    { key: 'disableGutters', label: '禁用内边距', type: 'boolean' },
    { key: 'width', label: '宽度', type: 'text', placeholder: '如：100%' },
    { key: 'height', label: '高度', type: 'text', placeholder: '如：300px' }
  ],
  splitpanel: [
    { key: 'orientation', label: '方向', type: 'select', options: [
      { value: 'horizontal', label: '水平' },
      { value: 'vertical', label: '垂直' }
    ]},
    { key: 'splitPosition', label: '分割位置', type: 'number', placeholder: '50（百分比）' },
    { key: 'minSize', label: '最小尺寸', type: 'number', placeholder: '20（百分比）' },
    { key: 'maxSize', label: '最大尺寸', type: 'number', placeholder: '80（百分比）' },
    { key: 'resizable', label: '可调整大小', type: 'boolean' },
    { key: 'disabled', label: '禁用', type: 'boolean' },
    { key: 'leftContent', label: '左侧内容', type: 'text', placeholder: '左侧面板内容' },
    { key: 'rightContent', label: '右侧内容', type: 'text', placeholder: '右侧面板内容' }
  ]
}

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
    // 从实例类型推断组件类型
    const instance = selectedDialogChild.value
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
  }
  return null
}

// 获取属性列表
const getPropertyList = (type: string) => {
  return propertyConfig[type] || []
}

// 获取选中组件的属性列表（支持对话框内控件）
const getSelectedPropertyList = () => {
  const type = getSelectedComponentType()
  return type ? getPropertyList(type) : []
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

// 获取选中组件的属性值（支持对话框内控件）
const getSelectedPropValue = (key: string) => {
  if (selectedComponent.value) {
    // 对于宽度和高度，从 style 中获取
    if (key === 'width' || key === 'height') {
      const style = selectedComponent.value.instance?.getProperty?.('style') || 
                   (selectedComponent.value.instance as any)?._props?.style ||
                   selectedComponent.value.style || {}
      return style[key] || (selectedComponent.value.element as HTMLElement)?.style?.[key] || ''
    }
    return getPropValue(selectedComponent.value, key)
  }
  if (selectedDialogChild.value) {
    const instance = selectedDialogChild.value
    // 对于宽度和高度，从元素的 style 中获取
    if (key === 'width' || key === 'height') {
      const element = instance.getElement?.()
      if (element) {
        const style = window.getComputedStyle(element) || (element as HTMLElement).style
        if (style[key]) {
          return style[key]
        }
      }
      // 尝试从实例的 style 属性获取
      const instanceStyle = (instance as any).getProperty?.('style') || 
                           (instance as any)?._props?.style || {}
      return instanceStyle[key] || ''
    }
    // 尝试通过 getProperty 获取（BaseCommand 的方法）
    if (instance && typeof (instance as any).getProperty === 'function') {
      const value = (instance as any).getProperty(key)
      if (value !== undefined) {
        return value
      }
    }
    // 尝试调用 getter 方法
    const getterMethod = 'get' + key.charAt(0).toUpperCase() + key.slice(1)
    if (typeof (instance as any)[getterMethod] === 'function') {
      return (instance as any)[getterMethod]()
    }
    // 尝试直接访问私有属性（通过 getProperty 或直接访问）
    if (instance && typeof (instance as any).getProperty === 'function') {
      // 尝试获取 _props 中的值
      const props = (instance as any).getProperties?.() || (instance as any)._props || {}
      if (props[key] !== undefined) {
        return props[key]
      }
    }
    // 最后尝试直接访问属性（可能是私有的）
    if (typeof (instance as any)[key] !== 'undefined') {
      return (instance as any)[key]
    }
  }
  return undefined
}

// 更新动态属性
const updateDynamicProp = (key: string, value: any) => {
  if (!selectedComponent.value) return
  
  const comp = selectedComponent.value
  
  // 特殊处理：宽度和高度通过 setStyle 设置
  if (key === 'width' || key === 'height') {
    // 对于 Container 和 Grid，需要同时更新实例的样式和元素的样式
    if (comp.type === 'container' || comp.type === 'grid') {
      // 更新实例的样式
      if (comp.instance && typeof (comp.instance as any).setStyle === 'function') {
        const currentStyle = (comp.instance as any).getProperty?.('style') || 
                            (comp.instance as any)?._props?.style || 
                            {}
        const newStyle = { ...currentStyle, [key]: value }
        ;(comp.instance as any).setStyle(newStyle as Partial<CSSStyleDeclaration>)
      }
      // 直接更新元素的样式（确保界面立即响应）
      const element = comp.element as HTMLElement
      if (element && element.style) {
        // 查找实际的容器元素（可能是 .vue-container 或 .vue-grid）
        const containerElement = element.querySelector('.vue-container') || 
                                 element.querySelector('.vue-grid') || 
                                 element
        if (containerElement && (containerElement as HTMLElement).style) {
          (containerElement as HTMLElement).style[key as any] = value
        }
        // 同时更新外层元素的样式
        element.style[key as any] = value
      }
    } else {
      // 其他组件的处理逻辑
      if (comp.instance && typeof (comp.instance as any).setStyle === 'function') {
        const currentStyle = (comp.instance as any).getProperty?.('style') || 
                            (comp.instance as any)?._props?.style || 
                            {}
        const newStyle = { ...currentStyle, [key]: value }
        ;(comp.instance as any).setStyle(newStyle as Partial<CSSStyleDeclaration>)
      } else {
        // 如果没有 setStyle，直接设置到元素的 style 上
        const element = comp.element as HTMLElement
        if (element) {
          if (element.style) {
            element.style[key as any] = value
          }
        }
      }
    }
    // 更新 props 中的样式
    if (!comp.props.style) {
      comp.props.style = {}
    }
    comp.props.style[key] = value
    comp.style[key] = value
    
    // 更新整个画布以刷新视图
    canvasComponents.value = [...canvasComponents.value]
    updateCode()
    return
  }
  
  // 更新 instance - 优先尝试调用 setter 方法（更可靠）
  if (comp.instance) {
    const setterMethod = 'set' + key.charAt(0).toUpperCase() + key.slice(1)
    if (typeof comp.instance[setterMethod] === 'function') {
      comp.instance[setterMethod](value)
    } else if (typeof comp.instance[key] !== 'undefined') {
      // 如果没有 setter，直接赋值（不推荐，但作为后备方案）
      comp.instance[key] = value
    }
  }
  
  // 更新 props
  comp.props[key] = value
  
  // Dialog、Widget、Grid、Container 特殊处理
  if (comp.type === 'dialog') {
    updateDialogElement(comp, key, value)
  } else if (comp.type === 'widget' && comp.instance) {
    // Widget：直接调用 setter 方法
    if (key === 'width' || key === 'height') {
      if (typeof (comp.instance as any).setWidth === 'function' && key === 'width') {
        ;(comp.instance as any).setWidth(value)
      }
      if (typeof (comp.instance as any).setHeight === 'function' && key === 'height') {
        ;(comp.instance as any).setHeight(value)
      }
    } else if (key === 'title') {
      if (typeof (comp.instance as any).setTitle === 'function') {
        ;(comp.instance as any).setTitle(value)
      }
    } else if (key === 'fullscreen') {
      if (typeof (comp.instance as any).setFullscreen === 'function') {
        ;(comp.instance as any).setFullscreen(value)
      }
    } else if (key === 'menuBarVisible') {
      if (typeof (comp.instance as any).setMenuBarVisible === 'function') {
        ;(comp.instance as any).setMenuBarVisible(value)
      }
    }
    
    // Widget 窗口独立渲染，不需要替换画布中的元素
    // 只是更新实例属性即可，Vue 组件会自动响应
    if (comp.instance && typeof (comp.instance as any).scheduleUpdate === 'function') {
      ;(comp.instance as any).scheduleUpdate()
    }
  } else if ((comp.type === 'grid' || comp.type === 'container') && comp.instance) {
    // Grid 和 Container：重新渲染时需要保留子组件
    const oldElement = comp.element
    const hasChildren = (comp.type === 'grid' && comp.gridInstance?.getChildren().length > 0) ||
                       (comp.type === 'container' && comp.containerInstance?.getChildren().length > 0)
    
    if (hasChildren) {
      // 如果有子组件，只更新属性，不重新渲染（避免丢失子组件）
      // setter 方法已经更新了实例的属性，Vue 组件会自动响应
      // 这里我们可能需要强制更新
      if (comp.instance && typeof (comp.instance as any).scheduleUpdate === 'function') {
        ;(comp.instance as any).scheduleUpdate()
      }
    } else {
      // 没有子组件时，可以重新渲染
      if (oldElement && oldElement.parentNode && comp.instance.unmount) {
        try {
          comp.instance.unmount()
        } catch (e) {
          // 忽略卸载错误
        }
      }
      const newElement = comp.instance.render()
      comp.element = newElement
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.replaceChild(newElement, oldElement)
      }
    }
  } else if (comp.instance && comp.instance.render) {
    // 其他组件：先卸载旧的，再重新渲染
    const oldElement = comp.element
    if (oldElement && oldElement.parentNode && comp.instance.unmount) {
      // 如果元素已挂载到 DOM，先卸载
      try {
        comp.instance.unmount()
      } catch (e) {
        // 忽略卸载错误，可能已经卸载
      }
    }
    // 重新渲染
    const newElement = comp.instance.render()
    comp.element = newElement
    
    // 如果旧元素在 DOM 中，替换它
    if (oldElement && oldElement.parentNode) {
      oldElement.parentNode.replaceChild(newElement, oldElement)
    }
  }
  
  // 更新整个画布以刷新视图
  canvasComponents.value = [...canvasComponents.value]
  updateCode()
}

// 更新选中组件的动态属性（支持对话框内控件）
const updateSelectedDynamicProp = (key: string, value: any) => {
  if (selectedComponent.value) {
    updateDynamicProp(key, value)
    return
  }
  
  if (!selectedDialogChild.value) return
  
  const instance = selectedDialogChild.value
  
  // 特殊处理：宽度和高度通过 setStyle 设置
  if (key === 'width' || key === 'height') {
    if (instance && typeof (instance as any).setStyle === 'function') {
      const currentStyle = (instance as any).getProperty?.('style') || 
                          (instance as any)?._props?.style || 
                          {}
      const newStyle = { ...currentStyle, [key]: value }
      ;(instance as any).setStyle(newStyle as Partial<CSSStyleDeclaration>)
    } else {
      // 如果没有 setStyle，直接设置到元素的 style 上
      const element = instance.getElement?.()
      if (element && (element as HTMLElement).style) {
        ;(element as HTMLElement).style[key as any] = value
      }
    }
    updateCode()
    return
  }
  
  // 尝试调用对应的 setter 方法
  const setterMethod = 'set' + key.charAt(0).toUpperCase() + key.slice(1)
  if (typeof (instance as any)[setterMethod] === 'function') {
    (instance as any)[setterMethod](value)
    
    // 重新渲染组件以反映变化
    const childInfo = dialogChildren.value.get(instance)
    if (childInfo) {
      const oldElement = instance.getElement()
      if (oldElement && oldElement.parentNode) {
        // 先卸载旧的组件实例
        if (instance.unmount && typeof instance.unmount === 'function') {
          try {
            instance.unmount()
          } catch (e) {
            // 忽略卸载错误
          }
        }
        // 重新渲染
        const newElement = instance.render()
        // 替换元素
        if (newElement && newElement !== oldElement && oldElement.parentNode) {
          childInfo.wrapper.replaceChild(newElement, oldElement)
        }
      }
    }
    
    updateCode()
  }
}

// 获取选中组件的位置 X（支持对话框内控件）
const getSelectedPositionX = (): number => {
  if (selectedComponent.value) {
    return parseInt(selectedComponent.value.style.left || '0')
  }
  if (selectedDialogChild.value) {
    const childInfo = dialogChildren.value.get(selectedDialogChild.value)
    if (childInfo) {
      return childInfo.position.x
    }
  }
  return 0
}

// 获取选中组件的位置 Y（支持对话框内控件）
const getSelectedPositionY = (): number => {
  if (selectedComponent.value) {
    return parseInt(selectedComponent.value.style.top || '0')
  }
  if (selectedDialogChild.value) {
    const childInfo = dialogChildren.value.get(selectedDialogChild.value)
    if (childInfo) {
      return childInfo.position.y
    }
  }
  return 0
}

// 更新选中组件的位置（支持对话框内控件）
const updateSelectedPosition = (direction: 'left' | 'top', value: string) => {
  const numValue = parseInt(value) || 0
  
  if (selectedComponent.value) {
    updateStyle(direction, numValue + 'px')
    return
  }
  
  if (!selectedDialogChild.value) return
  
  const childInfo = dialogChildren.value.get(selectedDialogChild.value)
  if (!childInfo) return
  
  // 更新位置
  if (direction === 'left') {
    childInfo.wrapper.style.left = numValue + 'px'
    childInfo.position.x = numValue
  } else {
    childInfo.wrapper.style.top = numValue + 'px'
    childInfo.position.y = numValue
  }
  
  updateCode()
}

// Dialog 元素更新
const updateDialogElement = (comp: CanvasComponent, key: string, value: any) => {
  const header = comp.element.querySelector('.dialog-window-header')
  const body = comp.element.querySelector('.dialog-content-area') as HTMLElement
  const footer = comp.element.querySelector('.dialog-window-footer')
  
  if (key === 'title' && header) {
    const textNode = Array.from(header.childNodes).find(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = value
    } else {
      // 如果没有文本节点，替换第一个子节点
      const nodes = Array.from(header.childNodes).filter(node => node.nodeType !== Node.ELEMENT_NODE || !(node as Element).classList.contains('dialog-window-close'))
      nodes.forEach(node => node.remove())
      header.insertBefore(document.createTextNode(value), header.firstChild)
    }
  } else if (key === 'width' && comp.element) {
    (comp.element as HTMLElement).style.width = value
  } else if (key === 'showFooter') {
    if (value && !footer && body) {
      // 创建底部
      const footerEl = document.createElement('div')
      footerEl.className = 'dialog-window-footer'
      footerEl.style.cssText = `
        padding: 12px 20px;
        border-top: 1px solid #ebeef5;
        background: #fafafa;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      `
      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = '取消'
      cancelBtn.style.cssText = 'padding: 8px 16px; border: 1px solid #dcdfe6; background: white; border-radius: 4px; cursor: pointer;'
      const confirmBtn = document.createElement('button')
      confirmBtn.textContent = '确定'
      confirmBtn.style.cssText = 'padding: 8px 16px; border: none; background: #409eff; color: white; border-radius: 4px; cursor: pointer;'
      footerEl.appendChild(cancelBtn)
      footerEl.appendChild(confirmBtn)
      comp.element.appendChild(footerEl)
    } else if (!value && footer) {
      footer.remove()
    }
  }
}

// 移除组件
const removeComponent = (index: number) => {
  canvasComponents.value.splice(index, 1)
  if (selectedComponent.value?.id === canvasComponents.value[index]?.id) {
    selectedComponent.value = null
  }
  updateCode()
}

// 移除对话框内的控件
const removeDialogChild = () => {
  if (!selectedDialogChild.value) return
  
  // 确认删除
  if (!confirm('确定要删除这个控件吗？')) {
    return
  }
  
  const instance = selectedDialogChild.value
  const childInfo = dialogChildren.value.get(instance)
  
  if (!childInfo) return
  
  // 找到对话框组件
  const dialogComp = canvasComponents.value.find(c => c.id === childInfo.dialogId && c.type === 'dialog')
  
  // 从对话框实例中移除子组件
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
  if (usedTypes.has('dialog')) imports.push('NhaiDialogCommand')
  if (usedTypes.has('widget')) imports.push('NhaiWidgetCommand')
  if (usedTypes.has('card')) imports.push('NhaiCardCommand')
  if (usedTypes.has('grid')) imports.push('NhaiGridCommand')
  if (usedTypes.has('container')) imports.push('NhaiContainerCommand')
  if (usedTypes.has('splitpanel')) imports.push('NhaiSplitPanelCommand')
  
  let code = '// 复制以下代码到 showcase 的运行框中\n\n'
  code += `const { ${imports.join(', ')} } = window\n\n`
  code += 'const container = document.createElement(\'div\')\n\n'
  
  canvasComponents.value.forEach((comp, index) => {
    switch (comp.type) {
      case 'button': {
        const btnText = comp.props?.text || '按钮'
        const btnType = comp.props?.type || 'primary'
        code += `const ${comp.type}${index} = new NhaiButtonCommand('${btnText}')\n`
        if (btnType !== 'primary') {
          code += `${comp.type}${index}.setType('${btnType}')\n`
        }
        if (comp.props?.size && comp.props.size !== 'default') {
          code += `${comp.type}${index}.setSize('${comp.props.size}')\n`
        }
        if (comp.props?.icon) {
          code += `${comp.type}${index}.setIcon('${comp.props.icon}')\n`
        }
        if (comp.props?.plain) {
          code += `${comp.type}${index}.setPlain(true)\n`
        }
        if (comp.props?.round) {
          code += `${comp.type}${index}.setRound(true)\n`
        }
        if (comp.props?.circle) {
          code += `${comp.type}${index}.setCircle(true)\n`
        }
        if (comp.props?.loading) {
          code += `${comp.type}${index}.setLoading(true)\n`
        }
        if (comp.props?.disabled) {
          code += `${comp.type}${index}.setDisabled(true)\n`
        }
        // 生成宽度和高度的样式设置
        const style = comp.props?.style || comp.style || {}
        if (style.width || style.height) {
          const styleProps: string[] = []
          if (style.width) styleProps.push(`width: '${style.width}'`)
          if (style.height) styleProps.push(`height: '${style.height}'`)
          if (styleProps.length > 0) {
            code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
          }
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      case 'input': {
        const inputProps = comp.props || {}
        code += `const ${comp.type}${index} = new NhaiInputCommand()\n`
        if (inputProps.placeholder) {
          code += `${comp.type}${index}.setPlaceholder('${inputProps.placeholder}')\n`
        }
        if (inputProps.type && inputProps.type !== 'text') {
          code += `${comp.type}${index}.setType('${inputProps.type}')\n`
        }
        if (inputProps.value) {
          code += `${comp.type}${index}.setValue('${inputProps.value}')\n`
        }
        if (inputProps.size && inputProps.size !== 'default') {
          code += `${comp.type}${index}.setSize('${inputProps.size}')\n`
        }
        if (inputProps.disabled) {
          code += `${comp.type}${index}.setDisabled(true)\n`
        }
        if (inputProps.clearable) {
          code += `${comp.type}${index}.setClearable(true)\n`
        }
        if (inputProps.showPassword) {
          code += `${comp.type}${index}.setShowPassword(true)\n`
        }
        if (inputProps.prefixIcon) {
          code += `${comp.type}${index}.configure({ prefixIcon: '${inputProps.prefixIcon}' })\n`
        }
        if (inputProps.suffixIcon) {
          code += `${comp.type}${index}.configure({ suffixIcon: '${inputProps.suffixIcon}' })\n`
        }
        if (inputProps.maxlength && inputProps.maxlength > 0) {
          code += `${comp.type}${index}.setMaxlength(${inputProps.maxlength})\n`
        }
        if (inputProps.minlength && inputProps.minlength > 0) {
          code += `${comp.type}${index}.setMinlength(${inputProps.minlength})\n`
        }
        // 生成宽度和高度的样式设置
        const inputStyle = inputProps.style || comp.style || {}
        if (inputStyle.width || inputStyle.height) {
          const styleProps: string[] = []
          if (inputStyle.width) styleProps.push(`width: '${inputStyle.width}'`)
          if (inputStyle.height) styleProps.push(`height: '${inputStyle.height}'`)
          if (styleProps.length > 0) {
            code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
          }
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      case 'select': {
        const selectProps = comp.props || {}
        code += `const ${comp.type}${index} = new NhaiSelectCommand()\n`
        if (selectProps.placeholder) {
          code += `${comp.type}${index}.setPlaceholder('${selectProps.placeholder}')\n`
        }
        if (selectProps.size && selectProps.size !== 'default') {
          code += `${comp.type}${index}.setSize('${selectProps.size}')\n`
        }
        if (selectProps.disabled) {
          code += `${comp.type}${index}.setDisabled(true)\n`
        }
        if (selectProps.clearable) {
          code += `${comp.type}${index}.setClearable(true)\n`
        }
        if (selectProps.multiple) {
          code += `${comp.type}${index}.setMultiple(true)\n`
        }
        if (selectProps.options && Array.isArray(selectProps.options) && selectProps.options.length > 0) {
          const optionsStr = selectProps.options.map((opt: any) => 
            `{label: '${opt.label || opt.value}', value: '${opt.value}'}`
          ).join(', ')
          code += `${comp.type}${index}.setOptions([${optionsStr}])\n`
        }
        // 生成宽度和高度的样式设置
        const selectStyle = selectProps.style || comp.style || {}
        if (selectStyle.width || selectStyle.height) {
          const styleProps: string[] = []
          if (selectStyle.width) styleProps.push(`width: '${selectStyle.width}'`)
          if (selectStyle.height) styleProps.push(`height: '${selectStyle.height}'`)
          if (styleProps.length > 0) {
            code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
          }
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      case 'switch': {
        const switchProps = comp.props || {}
        const switchValue = switchProps.value ?? false
        code += `const ${comp.type}${index} = new NhaiSwitchCommand(${switchValue})\n`
        if (switchProps.size && switchProps.size !== 'default') {
          code += `${comp.type}${index}.setSize('${switchProps.size}')\n`
        }
        if (switchProps.disabled) {
          code += `${comp.type}${index}.setDisabled(true)\n`
        }
        if (switchProps.activeText) {
          code += `${comp.type}${index}.setActiveText('${switchProps.activeText}')\n`
        }
        if (switchProps.inactiveText) {
          code += `${comp.type}${index}.setInactiveText('${switchProps.inactiveText}')\n`
        }
        if (switchProps.activeColor) {
          code += `${comp.type}${index}.setActiveColor('${switchProps.activeColor}')\n`
        }
        if (switchProps.inactiveColor) {
          code += `${comp.type}${index}.setInactiveColor('${switchProps.inactiveColor}')\n`
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      case 'checkbox': {
        const checkboxProps = comp.props || {}
        const checkboxText = checkboxProps.text || '复选框'
        code += `const ${comp.type}${index} = new NhaiCheckboxCommand('${checkboxText}')\n`
        if (checkboxProps.value) {
          code += `${comp.type}${index}.setValue(true)\n`
        }
        if (checkboxProps.size && checkboxProps.size !== 'default') {
          code += `${comp.type}${index}.setSize('${checkboxProps.size}')\n`
        }
        if (checkboxProps.disabled) {
          code += `${comp.type}${index}.setDisabled(true)\n`
        }
        if (checkboxProps.indeterminate) {
          code += `${comp.type}${index}.setIndeterminate(true)\n`
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      case 'card': {
        const cardProps = comp.props || {}
        const cardHeader = cardProps.header || '标题'
        const cardContent = cardProps.content || '内容'
        code += `const ${comp.type}${index} = new NhaiCardCommand('${cardHeader}', '${cardContent}')\n`
        if (cardProps.shadow && cardProps.shadow !== 'always') {
          code += `${comp.type}${index}.setShadow('${cardProps.shadow}')\n`
        }
        // 生成宽度和高度的样式设置
        const cardStyle = cardProps.style || comp.style || {}
        if (cardStyle.width || cardStyle.height) {
          const styleProps: string[] = []
          if (cardStyle.width) styleProps.push(`width: '${cardStyle.width}'`)
          if (cardStyle.height) styleProps.push(`height: '${cardStyle.height}'`)
          if (styleProps.length > 0) {
            code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
          }
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      case 'dialog': {
        const dialogProps = comp.props || {}
        const dialogTitle = dialogProps.title || '提示'
        const dialogContent = dialogProps.content || ''
        const dialogInstance = comp.dialogInstance
        
        code += `// Dialog 触发器按钮\n`
        code += `const ${comp.type}${index}Trigger = document.createElement('button')\n`
        code += `${comp.type}${index}Trigger.textContent = '点击打开对话框'\n`
        code += `${comp.type}${index}Trigger.onclick = () => {\n`
        code += `  const dialog = new NhaiDialogCommand('${dialogTitle}', '${dialogContent}')\n`
        code += `  dialog.setAppendToBody(true)\n`
        if (dialogProps.width) {
          code += `  dialog.setWidth('${dialogProps.width}')\n`
        }
        if (dialogProps.fullscreen) {
          code += `  dialog.setFullscreen(true)\n`
        }
        if (dialogProps.modal === false) {
          code += `  dialog.setModal(false)\n`
        }
        if (dialogProps.showFooter) {
          code += `  dialog.setShowFooter(true)\n`
          if (dialogProps.confirmText) {
            code += `  dialog.setConfirmText('${dialogProps.confirmText}')\n`
          }
          if (dialogProps.cancelText) {
            code += `  dialog.setCancelText('${dialogProps.cancelText}')\n`
          }
        }
        if (dialogProps.draggable) {
          code += `  dialog.setDraggable(true)\n`
        }
        if (dialogProps.center) {
          code += `  dialog.setCenter(true)\n`
        }
        if (dialogProps.closeOnClickModal) {
          code += `  dialog.setCloseOnClickModal(true)\n`
        }
        if (dialogProps.closeOnPressEscape === false) {
          code += `  dialog.setCloseOnPressEscape(false)\n`
        }
        if (dialogProps.showClose === false) {
          code += `  dialog.setShowClose(false)\n`
        }
        code += `  dialog.setModelValue(true)\n`
        code += `  dialog.render()\n`
        
        // 生成对话框内子组件的代码
        if (dialogInstance) {
          const children = dialogInstance.getChildren()
          if (children && children.length > 0) {
            // 为每个子组件生成代码
            children.forEach((child: any, childIndex: number) => {
              const childInfo = dialogChildren.value.get(child)
              if (!childInfo) return
              
              let childVarName = ''
              let childCode = ''
              
              // 根据子组件类型生成代码
              if (child instanceof NhaiButtonCommand) {
                childVarName = `dialogChild${index}_button${childIndex}`
                const text = child.getText?.() || (child as any).text || '按钮'
                const type = (child as any).type || 'primary'
                const size = (child as any).size || 'default'
                const icon = (child as any).icon
                const plain = (child as any).plain || false
                const round = (child as any).round || false
                const circle = (child as any).circle || false
                const loading = (child as any).loading || false
                const disabled = (child as any).disabled || false
                
                childCode = `  const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                if (type !== 'primary') {
                  childCode += `  ${childVarName}.setType('${type}')\n`
                }
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if (icon) {
                  childCode += `  ${childVarName}.setIcon('${icon}')\n`
                }
                if (plain) {
                  childCode += `  ${childVarName}.setPlain(true)\n`
                }
                if (round) {
                  childCode += `  ${childVarName}.setRound(true)\n`
                }
                if (circle) {
                  childCode += `  ${childVarName}.setCircle(true)\n`
                }
                if (loading) {
                  childCode += `  ${childVarName}.setLoading(true)\n`
                }
                if (disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                // 生成宽度和高度的样式设置
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('button')) {
                  imports.push('NhaiButtonCommand')
                  usedTypes.add('button')
                }
              } else if (child instanceof NhaiInputCommand) {
                childVarName = `dialogChild${index}_input${childIndex}`
                const childOptions = (child as any)._options || {}
                childCode = `  const ${childVarName} = new NhaiInputCommand()\n`
                if (childOptions.placeholder) {
                  childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                }
                if (childOptions.type && childOptions.type !== 'text') {
                  childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                }
                if (childOptions.value) {
                  childCode += `  ${childVarName}.setValue('${childOptions.value}')\n`
                }
                if (childOptions.size && childOptions.size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                }
                if (childOptions.disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if (childOptions.clearable) {
                  childCode += `  ${childVarName}.setClearable(true)\n`
                }
                if (childOptions.showPassword) {
                  childCode += `  ${childVarName}.setShowPassword(true)\n`
                }
                if (childOptions.prefixIcon) {
                  childCode += `  ${childVarName}.configure({ prefixIcon: '${childOptions.prefixIcon}' })\n`
                }
                if (childOptions.suffixIcon) {
                  childCode += `  ${childVarName}.configure({ suffixIcon: '${childOptions.suffixIcon}' })\n`
                }
                if (childOptions.maxlength && childOptions.maxlength > 0) {
                  childCode += `  ${childVarName}.setMaxlength(${childOptions.maxlength})\n`
                }
                if (childOptions.minlength && childOptions.minlength > 0) {
                  childCode += `  ${childVarName}.setMinlength(${childOptions.minlength})\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('input')) {
                  imports.push('NhaiInputCommand')
                  usedTypes.add('input')
                }
              } else if (child instanceof NhaiSelectCommand) {
                childVarName = `dialogChild${index}_select${childIndex}`
                childCode = `  const ${childVarName} = new NhaiSelectCommand()\n`
                const placeholder = (child as any).placeholder || '请选择'
                if (placeholder !== '请选择') {
                  childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                }
                const size = (child as any).size || 'default'
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if ((child as any).disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if ((child as any).clearable) {
                  childCode += `  ${childVarName}.setClearable(true)\n`
                }
                if ((child as any).multiple) {
                  childCode += `  ${childVarName}.setMultiple(true)\n`
                }
                const options = (child as any).options || []
                if (options.length > 0) {
                  const optionsStr = options.map((opt: any) => 
                    `{label: '${opt.label}', value: '${opt.value}'}`
                  ).join(', ')
                  childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('select')) {
                  imports.push('NhaiSelectCommand')
                  usedTypes.add('select')
                }
              } else if (child instanceof NhaiSwitchCommand) {
                childVarName = `dialogChild${index}_switch${childIndex}`
                const value = (child as any).value ?? false
                childCode = `  const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                const size = (child as any).size || 'default'
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if ((child as any).disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                const activeText = (child as any).activeText
                if (activeText) {
                  childCode += `  ${childVarName}.setActiveText('${activeText}')\n`
                }
                const inactiveText = (child as any).inactiveText
                if (inactiveText) {
                  childCode += `  ${childVarName}.setInactiveText('${inactiveText}')\n`
                }
                const activeColor = (child as any).activeColor
                if (activeColor) {
                  childCode += `  ${childVarName}.setActiveColor('${activeColor}')\n`
                }
                const inactiveColor = (child as any).inactiveColor
                if (inactiveColor) {
                  childCode += `  ${childVarName}.setInactiveColor('${inactiveColor}')\n`
                }
                if (!usedTypes.has('switch')) {
                  imports.push('NhaiSwitchCommand')
                  usedTypes.add('switch')
                }
              } else if (child instanceof NhaiCheckboxCommand) {
                childVarName = `dialogChild${index}_checkbox${childIndex}`
                const text = (child as any).text || '复选框'
                childCode = `  const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                if ((child as any).value) {
                  childCode += `  ${childVarName}.setValue(true)\n`
                }
                const size = (child as any).size || 'default'
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if ((child as any).disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if ((child as any).indeterminate) {
                  childCode += `  ${childVarName}.setIndeterminate(true)\n`
                }
                if (!usedTypes.has('checkbox')) {
                  imports.push('NhaiCheckboxCommand')
                  usedTypes.add('checkbox')
                }
              } else if (child instanceof NhaiCardCommand) {
                childVarName = `dialogChild${index}_card${childIndex}`
                const header = (child as any).header || '卡片标题'
                const content = (child as any).content || '卡片内容'
                childCode = `  const ${childVarName} = new NhaiCardCommand('${header}', '${content}')\n`
                if (!usedTypes.has('card')) {
                  imports.push('NhaiCardCommand')
                  usedTypes.add('card')
                }
              }
              
              if (childCode) {
                code += childCode
                code += `  ${childVarName}.render()\n`
                // 设置位置
                const posX = childInfo.position.x
                const posY = childInfo.position.y
                code += `  ${childVarName}.getElement().style.position = 'absolute'\n`
                code += `  ${childVarName}.getElement().style.left = '${posX}px'\n`
                code += `  ${childVarName}.getElement().style.top = '${posY}px'\n`
                // 添加到对话框
                code += `  dialog.addChild(${childVarName})\n`
              }
            })
          }
        }
        
        code += `  dialog.on('closed', () => dialog.unmount())\n`
        code += `}\n`
        code += `const element${index} = ${comp.type}${index}Trigger\n`
        break
      }
      case 'widget': {
        const widgetProps = comp.props || {}
        const widgetTitle = widgetProps.title || '窗口标题'
        const widgetInstance = comp.widgetInstance
        
        code += `const ${comp.type}${index} = new NhaiWidgetCommand('${widgetTitle}')\n`
        if (widgetProps.width && widgetProps.width !== '800px') {
          code += `${comp.type}${index}.setWidth('${widgetProps.width}')\n`
        }
        if (widgetProps.height && widgetProps.height !== '600px') {
          code += `${comp.type}${index}.setHeight('${widgetProps.height}')\n`
        }
        if (widgetProps.fullscreen) {
          code += `${comp.type}${index}.setFullscreen(true)\n`
        }
        if (widgetProps.menuBarVisible === false) {
          code += `${comp.type}${index}.setMenuBarVisible(false)\n`
        }
        if (widgetProps.canMinimize === false) {
          code += `${comp.type}${index}.canMinimize = false\n`
        }
        if (widgetProps.canMaximize === false) {
          code += `${comp.type}${index}.canMaximize = false\n`
        }
        if (widgetProps.canClose === false) {
          code += `${comp.type}${index}.canClose = false\n`
        }
        if (widgetProps.position && (widgetProps.position.x !== 100 || widgetProps.position.y !== 100)) {
          code += `${comp.type}${index}.setPosition(${widgetProps.position.x}, ${widgetProps.position.y})\n`
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        code += `document.body.appendChild(element${index})\n`
        
        // 生成 Widget 的子组件代码
        if (widgetInstance) {
          const children = widgetInstance.getChildren()
          if (children && children.length > 0) {
            // 使用 Set 去重，避免同一个子组件被处理多次
            const processedChildren = new Set<any>()
            let actualChildIndex = 0
            
            children.forEach((child: any) => {
              // 如果已经处理过这个子组件，跳过
              if (processedChildren.has(child)) {
                return
              }
              processedChildren.add(child)
              
              const childInfo = dialogChildren.value.get(child)
              if (!childInfo) return
              
              // 使用实际的索引（去重后的）
              const childIndex = actualChildIndex++
              
              let childVarName = ''
              let childCode = ''
              
              // 根据子组件类型生成代码（复用对话框内的完整逻辑）
              if (child instanceof NhaiButtonCommand) {
                childVarName = `widgetChild${index}_button${childIndex}`
                const text = child.getText?.() || (child as any).text || '按钮'
                const type = (child as any).type || 'primary'
                const size = (child as any).size || 'default'
                const icon = (child as any).icon
                const plain = (child as any).plain || false
                const round = (child as any).round || false
                const circle = (child as any).circle || false
                const loading = (child as any).loading || false
                const disabled = (child as any).disabled || false
                
                childCode = `  const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                if (type !== 'primary') {
                  childCode += `  ${childVarName}.setType('${type}')\n`
                }
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if (icon) {
                  childCode += `  ${childVarName}.setIcon('${icon}')\n`
                }
                if (plain) {
                  childCode += `  ${childVarName}.setPlain(true)\n`
                }
                if (round) {
                  childCode += `  ${childVarName}.setRound(true)\n`
                }
                if (circle) {
                  childCode += `  ${childVarName}.setCircle(true)\n`
                }
                if (loading) {
                  childCode += `  ${childVarName}.setLoading(true)\n`
                }
                if (disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('button')) {
                  imports.push('NhaiButtonCommand')
                  usedTypes.add('button')
                }
              } else if (child instanceof NhaiInputCommand) {
                childVarName = `widgetChild${index}_input${childIndex}`
                const childOptions = (child as any)._options || {}
                childCode = `  const ${childVarName} = new NhaiInputCommand()\n`
                if (childOptions.placeholder) {
                  childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                }
                if (childOptions.type && childOptions.type !== 'text') {
                  childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                }
                if (childOptions.value) {
                  childCode += `  ${childVarName}.setValue('${childOptions.value}')\n`
                }
                if (childOptions.size && childOptions.size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                }
                if (childOptions.disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if (childOptions.clearable) {
                  childCode += `  ${childVarName}.setClearable(true)\n`
                }
                if (childOptions.showPassword) {
                  childCode += `  ${childVarName}.setShowPassword(true)\n`
                }
                if (childOptions.prefixIcon) {
                  childCode += `  ${childVarName}.configure({ prefixIcon: '${childOptions.prefixIcon}' })\n`
                }
                if (childOptions.suffixIcon) {
                  childCode += `  ${childVarName}.configure({ suffixIcon: '${childOptions.suffixIcon}' })\n`
                }
                if (childOptions.maxlength && childOptions.maxlength > 0) {
                  childCode += `  ${childVarName}.setMaxlength(${childOptions.maxlength})\n`
                }
                if (childOptions.minlength && childOptions.minlength > 0) {
                  childCode += `  ${childVarName}.setMinlength(${childOptions.minlength})\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('input')) {
                  imports.push('NhaiInputCommand')
                  usedTypes.add('input')
                }
              } else if (child instanceof NhaiSelectCommand) {
                childVarName = `widgetChild${index}_select${childIndex}`
                childCode = `  const ${childVarName} = new NhaiSelectCommand()\n`
                const placeholder = (child as any).placeholder || '请选择'
                if (placeholder !== '请选择') {
                  childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                }
                const size = (child as any).size || 'default'
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if ((child as any).disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if ((child as any).clearable) {
                  childCode += `  ${childVarName}.setClearable(true)\n`
                }
                if ((child as any).multiple) {
                  childCode += `  ${childVarName}.setMultiple(true)\n`
                }
                const options = (child as any).options || []
                if (options.length > 0) {
                  const optionsStr = options.map((opt: any) => 
                    `{label: '${opt.label}', value: '${opt.value}'}`
                  ).join(', ')
                  childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('select')) {
                  imports.push('NhaiSelectCommand')
                  usedTypes.add('select')
                }
              } else if (child instanceof NhaiSwitchCommand) {
                childVarName = `widgetChild${index}_switch${childIndex}`
                const value = (child as any).value ?? false
                childCode = `  const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                const size = (child as any).size || 'default'
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if ((child as any).disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                const activeText = (child as any).activeText
                if (activeText) {
                  childCode += `  ${childVarName}.setActiveText('${activeText}')\n`
                }
                const inactiveText = (child as any).inactiveText
                if (inactiveText) {
                  childCode += `  ${childVarName}.setInactiveText('${inactiveText}')\n`
                }
                const activeColor = (child as any).activeColor
                if (activeColor) {
                  childCode += `  ${childVarName}.setActiveColor('${activeColor}')\n`
                }
                const inactiveColor = (child as any).inactiveColor
                if (inactiveColor) {
                  childCode += `  ${childVarName}.setInactiveColor('${inactiveColor}')\n`
                }
                if (!usedTypes.has('switch')) {
                  imports.push('NhaiSwitchCommand')
                  usedTypes.add('switch')
                }
              } else if (child instanceof NhaiCheckboxCommand) {
                childVarName = `widgetChild${index}_checkbox${childIndex}`
                const text = (child as any).text || '复选框'
                childCode = `  const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                if ((child as any).value) {
                  childCode += `  ${childVarName}.setValue(true)\n`
                }
                const size = (child as any).size || 'default'
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if ((child as any).disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if ((child as any).indeterminate) {
                  childCode += `  ${childVarName}.setIndeterminate(true)\n`
                }
                if (!usedTypes.has('checkbox')) {
                  imports.push('NhaiCheckboxCommand')
                  usedTypes.add('checkbox')
                }
              } else if (child instanceof NhaiCardCommand) {
                childVarName = `widgetChild${index}_card${childIndex}`
                const header = (child as any).header || '卡片标题'
                const content = (child as any).content || '卡片内容'
                childCode = `  const ${childVarName} = new NhaiCardCommand('${header}', '${content}')\n`
                if (!usedTypes.has('card')) {
                  imports.push('NhaiCardCommand')
                  usedTypes.add('card')
                }
              }
              
              if (childCode && childVarName) {
                code += childCode
                code += `  ${childVarName}.render()\n`
                // 设置位置
                const posX = childInfo.position.x
                const posY = childInfo.position.y
                code += `  ${childVarName}.getElement().style.position = 'absolute'\n`
                code += `  ${childVarName}.getElement().style.left = '${posX}px'\n`
                code += `  ${childVarName}.getElement().style.top = '${posY}px'\n`
                // 添加到 Widget
                code += `  ${comp.type}${index}.addChild(${childVarName})\n`
              }
            })
          }
        }
        break
      }
      case 'grid': {
        const gridProps = comp.props || {}
        code += `const ${comp.type}${index} = new NhaiGridCommand()\n`
        if (gridProps.container) {
          code += `${comp.type}${index}.setContainer(true)\n`
        }
        if (gridProps.spacing && gridProps.spacing !== 2) {
          code += `${comp.type}${index}.setSpacing(${gridProps.spacing})\n`
        }
        if (gridProps.direction && gridProps.direction !== 'row') {
          code += `${comp.type}${index}.setDirection('${gridProps.direction}')\n`
        }
        if (gridProps.justify && gridProps.justify !== 'flex-start') {
          code += `${comp.type}${index}.setJustify('${gridProps.justify}')\n`
        }
        if (gridProps.alignItems && gridProps.alignItems !== 'stretch') {
          code += `${comp.type}${index}.setAlignItems('${gridProps.alignItems}')\n`
        }
        if (gridProps.wrap && gridProps.wrap !== 'wrap') {
          code += `${comp.type}${index}.setWrap('${gridProps.wrap}')\n`
        }
        // 生成宽度和高度的样式设置
        const gridStyle = gridProps.style || comp.style || {}
        if (gridStyle.width || gridStyle.height) {
          const styleProps: string[] = []
          if (gridStyle.width) styleProps.push(`width: '${gridStyle.width}'`)
          if (gridStyle.height) styleProps.push(`height: '${gridStyle.height}'`)
          if (styleProps.length > 0) {
            code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
          }
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        
        // 生成 Grid 的子组件代码
        if (comp.gridInstance) {
          const children = comp.gridInstance.getChildren()
          if (children && children.length > 0) {
            children.forEach((child: any, childIndex: number) => {
              let childVarName = ''
              let childCode = ''
              
              // 根据子组件类型生成代码（复用对话框内的完整逻辑）
              if (child instanceof NhaiButtonCommand) {
                childVarName = `gridChild${index}_button${childIndex}`
                const text = child.getText?.() || (child as any).text || '按钮'
                const type = (child as any).type || 'primary'
                const size = (child as any).size || 'default'
                const icon = (child as any).icon
                const plain = (child as any).plain || false
                const round = (child as any).round || false
                const circle = (child as any).circle || false
                const loading = (child as any).loading || false
                const disabled = (child as any).disabled || false
                
                childCode = `const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                if (type !== 'primary') {
                  childCode += `  ${childVarName}.setType('${type}')\n`
                }
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if (icon) {
                  childCode += `  ${childVarName}.setIcon('${icon}')\n`
                }
                if (plain) {
                  childCode += `  ${childVarName}.setPlain(true)\n`
                }
                if (round) {
                  childCode += `  ${childVarName}.setRound(true)\n`
                }
                if (circle) {
                  childCode += `  ${childVarName}.setCircle(true)\n`
                }
                if (loading) {
                  childCode += `  ${childVarName}.setLoading(true)\n`
                }
                if (disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('button')) {
                  imports.push('NhaiButtonCommand')
                  usedTypes.add('button')
                }
              } else if (child instanceof NhaiInputCommand) {
                childVarName = `gridChild${index}_input${childIndex}`
                const childOptions = (child as any)._options || {}
                childCode = `const ${childVarName} = new NhaiInputCommand()\n`
                if (childOptions.placeholder) {
                  childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                }
                if (childOptions.type && childOptions.type !== 'text') {
                  childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                }
                if (childOptions.size && childOptions.size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                }
                if (childOptions.disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if (childOptions.clearable) {
                  childCode += `  ${childVarName}.setClearable(true)\n`
                }
                if (!usedTypes.has('input')) {
                  imports.push('NhaiInputCommand')
                  usedTypes.add('input')
                }
              } else if (child instanceof NhaiSelectCommand) {
                childVarName = `gridChild${index}_select${childIndex}`
                childCode = `const ${childVarName} = new NhaiSelectCommand()\n`
                const placeholder = (child as any).placeholder || '请选择'
                if (placeholder !== '请选择') {
                  childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                }
                const options = (child as any).options || []
                if (options.length > 0) {
                  const optionsStr = options.map((opt: any) => 
                    `{label: '${opt.label}', value: '${opt.value}'}`
                  ).join(', ')
                  childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                }
                if (!usedTypes.has('select')) {
                  imports.push('NhaiSelectCommand')
                  usedTypes.add('select')
                }
              } else if (child instanceof NhaiSwitchCommand) {
                childVarName = `gridChild${index}_switch${childIndex}`
                const value = (child as any).value ?? false
                childCode = `const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                if (!usedTypes.has('switch')) {
                  imports.push('NhaiSwitchCommand')
                  usedTypes.add('switch')
                }
              } else if (child instanceof NhaiCheckboxCommand) {
                childVarName = `gridChild${index}_checkbox${childIndex}`
                const text = (child as any).text || '复选框'
                childCode = `const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                if (!usedTypes.has('checkbox')) {
                  imports.push('NhaiCheckboxCommand')
                  usedTypes.add('checkbox')
                }
              }
              
              if (childCode && childVarName) {
                code += childCode
                code += `${childVarName}.render()\n`
                code += `${comp.type}${index}.addChild(${childVarName})\n`
              }
            })
          }
        }
        break
      }
      case 'container': {
        const containerProps = comp.props || {}
        code += `const ${comp.type}${index} = new NhaiContainerCommand()\n`
        if (containerProps.maxWidth !== undefined && containerProps.maxWidth !== 'lg') {
          if (containerProps.maxWidth === 'false' || containerProps.maxWidth === false) {
            code += `${comp.type}${index}.setMaxWidth(false)\n`
          } else {
            code += `${comp.type}${index}.setMaxWidth('${containerProps.maxWidth}')\n`
          }
        }
        if (containerProps.fixed) {
          code += `${comp.type}${index}.setFixed(true)\n`
        }
        if (containerProps.disableGutters) {
          code += `${comp.type}${index}.setDisableGutters(true)\n`
        }
        // 生成宽度和高度的样式设置
        const containerStyle = containerProps.style || comp.style || {}
        if (containerStyle.width || containerStyle.height) {
          const styleProps: string[] = []
          if (containerStyle.width) styleProps.push(`width: '${containerStyle.width}'`)
          if (containerStyle.height) styleProps.push(`height: '${containerStyle.height}'`)
          if (styleProps.length > 0) {
            code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
          }
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        
        // 生成 Container 的子组件代码
        if (comp.containerInstance) {
          const children = comp.containerInstance.getChildren()
          if (children && children.length > 0) {
            children.forEach((child: any, childIndex: number) => {
              let childVarName = ''
              let childCode = ''
              
              // 根据子组件类型生成代码（复用 Grid 的完整逻辑）
              if (child instanceof NhaiButtonCommand) {
                childVarName = `containerChild${index}_button${childIndex}`
                const text = child.getText?.() || (child as any).text || '按钮'
                const type = (child as any).type || 'primary'
                const size = (child as any).size || 'default'
                const icon = (child as any).icon
                const plain = (child as any).plain || false
                const round = (child as any).round || false
                const circle = (child as any).circle || false
                const loading = (child as any).loading || false
                const disabled = (child as any).disabled || false
                
                childCode = `const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                if (type !== 'primary') {
                  childCode += `  ${childVarName}.setType('${type}')\n`
                }
                if (size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${size}')\n`
                }
                if (icon) {
                  childCode += `  ${childVarName}.setIcon('${icon}')\n`
                }
                if (plain) {
                  childCode += `  ${childVarName}.setPlain(true)\n`
                }
                if (round) {
                  childCode += `  ${childVarName}.setRound(true)\n`
                }
                if (circle) {
                  childCode += `  ${childVarName}.setCircle(true)\n`
                }
                if (loading) {
                  childCode += `  ${childVarName}.setLoading(true)\n`
                }
                if (disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                if (childStyle.width || childStyle.height) {
                  const styleProps: string[] = []
                  if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                  if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                  if (styleProps.length > 0) {
                    childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                  }
                }
                if (!usedTypes.has('button')) {
                  imports.push('NhaiButtonCommand')
                  usedTypes.add('button')
                }
              } else if (child instanceof NhaiInputCommand) {
                childVarName = `containerChild${index}_input${childIndex}`
                const childOptions = (child as any)._options || {}
                childCode = `const ${childVarName} = new NhaiInputCommand()\n`
                if (childOptions.placeholder) {
                  childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                }
                if (childOptions.type && childOptions.type !== 'text') {
                  childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                }
                if (childOptions.size && childOptions.size !== 'default') {
                  childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                }
                if (childOptions.disabled) {
                  childCode += `  ${childVarName}.setDisabled(true)\n`
                }
                if (childOptions.clearable) {
                  childCode += `  ${childVarName}.setClearable(true)\n`
                }
                if (!usedTypes.has('input')) {
                  imports.push('NhaiInputCommand')
                  usedTypes.add('input')
                }
              } else if (child instanceof NhaiSelectCommand) {
                childVarName = `containerChild${index}_select${childIndex}`
                childCode = `const ${childVarName} = new NhaiSelectCommand()\n`
                const placeholder = (child as any).placeholder || '请选择'
                if (placeholder !== '请选择') {
                  childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                }
                const options = (child as any).options || []
                if (options.length > 0) {
                  const optionsStr = options.map((opt: any) => 
                    `{label: '${opt.label}', value: '${opt.value}'}`
                  ).join(', ')
                  childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                }
                if (!usedTypes.has('select')) {
                  imports.push('NhaiSelectCommand')
                  usedTypes.add('select')
                }
              } else if (child instanceof NhaiSwitchCommand) {
                childVarName = `containerChild${index}_switch${childIndex}`
                const value = (child as any).value ?? false
                childCode = `const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                if (!usedTypes.has('switch')) {
                  imports.push('NhaiSwitchCommand')
                  usedTypes.add('switch')
                }
              } else if (child instanceof NhaiCheckboxCommand) {
                childVarName = `containerChild${index}_checkbox${childIndex}`
                const text = (child as any).text || '复选框'
                childCode = `const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                if (!usedTypes.has('checkbox')) {
                  imports.push('NhaiCheckboxCommand')
                  usedTypes.add('checkbox')
                }
              }
              
              if (childCode && childVarName) {
                code += childCode
                code += `${childVarName}.render()\n`
                code += `${comp.type}${index}.addChild(${childVarName})\n`
              }
            })
          }
        }
        break
      }
      case 'splitpanel': {
        const splitProps = comp.props || {}
        code += `const ${comp.type}${index} = new NhaiSplitPanelCommand()\n`
        if (splitProps.orientation && splitProps.orientation !== 'horizontal') {
          code += `${comp.type}${index}.setOrientation('${splitProps.orientation}')\n`
        }
        if (splitProps.splitPosition && splitProps.splitPosition !== 50) {
          code += `${comp.type}${index}.setSplitPosition(${splitProps.splitPosition})\n`
        }
        if (splitProps.minSize && splitProps.minSize !== 20) {
          code += `${comp.type}${index}.setMinSize(${splitProps.minSize})\n`
        }
        if (splitProps.maxSize && splitProps.maxSize !== 80) {
          code += `${comp.type}${index}.setMaxSize(${splitProps.maxSize})\n`
        }
        if (splitProps.resizable === false) {
          code += `${comp.type}${index}.setResizable(false)\n`
        }
        if (splitProps.disabled) {
          code += `${comp.type}${index}.setDisabled(true)\n`
        }
        if (splitProps.leftContent) {
          code += `${comp.type}${index}.setLeftContent('${splitProps.leftContent}')\n`
        }
        if (splitProps.rightContent) {
          code += `${comp.type}${index}.setRightContent('${splitProps.rightContent}')\n`
        }
        code += `const element${index} = ${comp.type}${index}.render()\n`
        break
      }
      default:
        return
    }
    
    // 只为需要绝对定位的组件设置位置样式（Dialog、Widget、Grid、Container 不需要）
    if (comp.type !== 'dialog' && comp.type !== 'widget' && comp.type !== 'grid' && comp.type !== 'container') {
      code += `element${index}.style.position = 'absolute'\n`
      code += `element${index}.style.left = '${comp.style.left}'\n`
      code += `element${index}.style.top = '${comp.style.top}'\n`
    }
    
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
  ;(window as any).NhaiWidgetCommand = NhaiWidgetCommand
  ;(window as any).NhaiDialogCommand = NhaiDialogCommand
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

.btn-delete {
  width: 100%;
  padding: 10px 16px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-delete:hover {
  background: #ff7875;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.btn-delete:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 77, 79, 0.2);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1920px;
  min-height: 1080px;
  background: white;
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

.canvas-component.selected,
.dialog-child-component.selected {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.canvas-component.selected::before,
.dialog-child-component.selected::before {
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
}


/* 对话框窗口样式 - 所有样式都在 JavaScript 中设置，无需 CSS */
.dialog-content-area {
  position: relative;
}

/* 拖放到对话框时的视觉效果 */
.dialog-content-area.drag-over {
  background: repeating-linear-gradient(45deg, #ecf5ff, #ecf5ff 20px, #ffffff 20px, #ffffff 40px) !important;
  border: 2px dashed #409eff !important;
  border-radius: 4px !important;
}

.dialog-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #c0c4cc;
  font-size: 12px;
  pointer-events: none;
  transition: opacity 0.3s;
}

.dialog-content-area:has(.canvas-component) .dialog-placeholder {
  display: none;
}
</style>
