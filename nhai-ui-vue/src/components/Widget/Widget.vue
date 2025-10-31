<template>
  <div 
    v-if="!minimized"
    class="nhai-widget"
    :class="widgetClasses"
    :style="widgetStyles"
    @mousedown="handleMouseDown"
  >
    <!-- 标题栏 -->
    <div class="widget-header" @mousedown="startDrag">
      <div class="widget-title">
        <span v-if="menuBarVisible && menuItems && menuItems.length > 0" class="menu-icon">☰</span>
        <span>{{ title }}</span>
      </div>
      <div class="widget-actions" @mousedown.stop>
        <button v-if="canMinimize" class="widget-btn minimize" @click.stop="handleMinimize" title="最小化">−</button>
        <button v-if="canMaximize" class="widget-btn maximize" @click.stop="handleMaximize" title="最大化/还原">□</button>
        <button v-if="canClose" class="widget-btn close" @click.stop="handleClose" title="关闭">×</button>
      </div>
    </div>

    <!-- 菜单栏 -->
    <div v-if="menuBarVisible" class="widget-menu-bar">
      <template v-if="menuItems && menuItems.length > 0">
        <div 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="menu-item"
          :class="{ active: item.active }"
          @click="handleMenuClick(item, index)"
        >
          {{ item.label }}
        </div>
      </template>
      <slot name="menu"></slot>
    </div>

    <!-- 内容区域 -->
    <div class="widget-content" ref="contentRef">
      <slot></slot>
    </div>
  </div>

  <!-- 最小化后的底部栏 -->
  <div 
    v-else
    class="widget-minimized-bar"
    @click="handleRestore"
  >
    <span class="minimized-title">{{ title }}</span>
    <button class="widget-btn restore" @click.stop="handleRestore" title="还原">□</button>
    <button class="widget-btn close" @click.stop="handleClose" title="关闭">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'

interface MenuItem {
  label: string
  active?: boolean
  onClick?: () => void
}

interface Props {
  title?: string
  width?: string | number
  height?: string | number
  fullscreen?: boolean
  menuBarVisible?: boolean
  menuItems?: MenuItem[]
  canMinimize?: boolean
  canMaximize?: boolean
  canClose?: boolean
  minimized?: boolean
  maximized?: boolean
  position?: { x: number; y: number }
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '窗口',
  width: '800px',
  height: '600px',
  fullscreen: false,
  menuBarVisible: true,
  canMinimize: true,
  canMaximize: true,
  canClose: true,
  minimized: false,
  maximized: false,
  position: undefined,  // undefined 表示默认居中
  zIndex: 1000
})

const emit = defineEmits<{
  minimize: []
  maximize: []
  restore: []
  close: []
  menuClick: [item: MenuItem, index: number]
  focus: []
  positionChange: [position: { x: number; y: number }]
}>()

// 监听 position prop 变化
watch(() => props.position, (newPos) => {
  if (newPos) {
    currentPosition.value = { ...newPos }
  } else {
    // position 为 undefined 时，重置为 undefined，使用居中布局
    currentPosition.value = undefined
  }
}, { deep: true })

const contentRef = ref<HTMLElement>()
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const currentPosition = ref<{ x: number; y: number } | undefined>(props.position ? { ...props.position } : undefined)

const widgetClasses = computed(() => ({
  'widget-fullscreen': props.fullscreen,
  'widget-maximized': props.maximized,
  'widget-dragging': isDragging.value
}))

const widgetStyles = computed(() => {
  if (props.fullscreen) {
    return {
      width: '100vw',
      height: '100vh',
      top: '0',
      left: '0',
      zIndex: props.zIndex
    }
  }
  if (props.maximized) {
    return {
      width: '100vw',
      height: '100vh', // 铺满整个视口，不留白
      top: '0',
      left: '0',
      zIndex: props.zIndex
    }
  }
  // 默认居中显示
  const hasPosition = props.position && currentPosition.value !== undefined
  if (hasPosition && currentPosition.value) {
    // 如果指定了 position，使用指定位置
    return {
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      left: `${currentPosition.value.x}px`,
      top: `${currentPosition.value.y}px`,
      zIndex: props.zIndex
    }
  } else {
    // 否则居中显示
    return {
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: props.zIndex
    }
  }
})

const handleMinimize = () => {
  emit('minimize')
}

const handleMaximize = () => {
  emit('maximize')
}

const handleClose = () => {
  emit('close')
}

const handleRestore = () => {
  emit('restore')
}

const handleMenuClick = (item: MenuItem, index: number) => {
  emit('menuClick', item, index)
  if (item.onClick) {
    item.onClick()
  }
}

const startDrag = (e: MouseEvent) => {
  if (props.fullscreen || props.maximized || props.minimized) return
  isDragging.value = true
  const widgetElement = (e.currentTarget as HTMLElement).closest('.nhai-widget') as HTMLElement
  if (!widgetElement) return
  
  const rect = widgetElement.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
  e.stopPropagation()
}

const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  // 计算新位置
  const newX = e.clientX - dragOffset.value.x
  const newY = e.clientY - dragOffset.value.y
  
  // 限制在窗口内
  const maxX = window.innerWidth - (typeof props.width === 'number' ? props.width : parseInt(String(props.width)) || 800)
  const maxY = window.innerHeight - (typeof props.height === 'number' ? props.height : parseInt(String(props.height)) || 600)
  
  // 如果之前是居中，现在开始拖拽，需要设置初始位置
  if (!currentPosition.value) {
    const width = typeof props.width === 'number' ? props.width : parseInt(String(props.width)) || 800
    const height = typeof props.height === 'number' ? props.height : parseInt(String(props.height)) || 600
    // 从居中位置开始计算
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    currentPosition.value = {
      x: centerX - width / 2,
      y: centerY - height / 2
    }
    // 通知父组件位置变化（从居中切换到固定位置）
    emit('positionChange', currentPosition.value)
  }
  
  currentPosition.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
  
  // 通知父组件位置变化
  emit('positionChange', currentPosition.value)
}

const stopDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  // 通知父组件位置变化（如果当前有位置）
  if (currentPosition.value) {
    emit('positionChange', currentPosition.value)
  }
}

const handleMouseDown = () => {
  // 将窗口置于最前
  emit('focus')
}

onUnmounted(() => {
  stopDrag()
})
</script>

<style scoped>
.nhai-widget {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
}

.widget-fullscreen {
  border-radius: 0;
  border: none;
}

.widget-maximized {
  border-radius: 0;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  cursor: move;
  user-select: none;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
}

.menu-icon {
  cursor: pointer;
  padding: 2px 4px;
}

.widget-actions {
  display: flex;
  gap: 4px;
}

.widget-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 16px;
  line-height: 1;
  transition: background 0.2s;
}

.widget-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.widget-btn.close:hover {
  background: #ff4444;
  color: white;
}

.widget-menu-bar {
  display: flex;
  padding: 4px 8px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  gap: 8px;
}

.menu-item {
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu-item.active {
  background: #409eff;
  color: white;
}

.widget-content {
  flex: 1;
  overflow: auto;
  padding: 12px;
  position: relative;
}

.widget-minimized-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 48px;
  min-width: 200px;
  max-width: 400px;
  background: white;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 9999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.widget-minimized-bar:hover {
  background: #fafafa;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
}

.minimized-title {
  font-weight: 500;
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 8px;
}

.widget-minimized-bar .widget-btn {
  margin-left: 4px;
  flex-shrink: 0;
}
</style>
