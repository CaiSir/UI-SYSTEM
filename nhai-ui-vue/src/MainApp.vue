<template>
  <div class="main-app">
    <!-- 模式切换器 -->
    <div 
      class="mode-switcher"
      :class="{ expanded: isExpanded, dragging: isDragging }"
      :style="{ top: position.y + 'px', left: position.x + 'px' }"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
    >
      <button 
        class="toggle-btn"
        @click.stop="handleToggleClick"
        @mousedown="startDrag"
      >
        {{ isExpanded ? '⚙️' : (currentMode === 'showcase' ? '📚' : '🎨') }}
      </button>
      <div class="mode-buttons" @click.stop>
        <button 
          class="mode-btn"
          :class="{ active: currentMode === 'showcase' }"
          @click="currentMode = 'showcase'; isExpanded = false"
        >
          📚 组件展示
        </button>
        <button 
          class="mode-btn"
          :class="{ active: currentMode === 'designer' }"
          @click="currentMode = 'designer'; isExpanded = false"
        >
          🎨 可视化设计器
        </button>
      </div>
    </div>

    <!-- 根据模式显示不同组件 -->
    <ShowcaseApp v-if="currentMode === 'showcase'" />
    <DesignerApp v-else-if="currentMode === 'designer'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ShowcaseApp from './showcase/ShowcaseApp.vue'
import DesignerApp from './designer/DesignerApp.vue'

const currentMode = ref<'showcase' | 'designer'>('designer')
const isExpanded = ref(false)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragOffset = { x: 0, y: 0 }
let hasDragged = false // 标记是否发生了拖动

// 初始化位置
onMounted(() => {
  // 从本地存储恢复位置或使用默认位置
  const saved = localStorage.getItem('mode-switcher-position')
  if (saved) {
    position.value = JSON.parse(saved)
  } else {
    // 默认在右上角
    position.value = { x: window.innerWidth - 280, y: 20 }
  }
})

// 保存位置到本地存储
const savePosition = () => {
  localStorage.setItem('mode-switcher-position', JSON.stringify(position.value))
}

// 处理点击切换
const handleToggleClick = (event: MouseEvent) => {
  // 如果发生了拖动，则不触发点击事件
  if (hasDragged) {
    event.preventDefault()
    event.stopPropagation()
    hasDragged = false
    return
  }
  isExpanded.value = !isExpanded.value
}

const startDrag = (event: MouseEvent) => {
  if (event.button !== 0) return // 只处理左键
  
  event.preventDefault()
  event.stopPropagation()
  
  isDragging.value = true
  hasDragged = false // 重置拖动标志
  
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  dragOffset.x = event.clientX - rect.left
  dragOffset.y = event.clientY - rect.top
  
  // 禁用文本选择，提升拖动体验
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'
  
  document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: false })
  document.addEventListener('mouseup', handleMouseUp, { capture: true, passive: false })
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  // 标记发生了拖动
  hasDragged = true
  
  // 直接更新位置，不使用 requestAnimationFrame 以获得更好的响应速度
  let x = event.clientX - dragOffset.x
  let y = event.clientY - dragOffset.y
  
  // 限制在视窗内
  const maxX = window.innerWidth - 52 // 圆形按钮宽度
  const maxY = window.innerHeight - 52 // 圆形按钮高度
  x = Math.max(0, Math.min(x, maxX))
  y = Math.max(0, Math.min(y, maxY))
  
  position.value = { x, y }
}

const handleMouseUp = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  isDragging.value = false
  savePosition()
  
  // 恢复文本选择
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('mouseup', handleMouseUp, { capture: true })
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('mouseup', handleMouseUp, { capture: true })
})
</script>

<style scoped>
.main-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.mode-switcher {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: default;
  will-change: transform;
}

.mode-switcher.dragging {
  transition: none !important;
}

.toggle-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 50%;
  cursor: move;
  font-size: 20px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.toggle-btn:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transform: scale(1.05);
}

.toggle-btn:active {
  cursor: grabbing;
}

.mode-buttons {
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
  transition: all 0.3s ease;
}

.mode-switcher.expanded .mode-buttons {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.mode-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.mode-btn:hover {
  border-color: #1890ff;
  background: #f0f8ff;
}

.mode-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}
</style>

