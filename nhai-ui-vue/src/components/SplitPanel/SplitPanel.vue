<template>
  <div 
    :class="['vue-split-panel', `vue-split-panel--${orientation}`]"
    style="position: relative; width: 100%; height: 100%;"
  >
    <div 
      :class="leftPanelClass"
      :style="leftPanelStyle"
    >
      <slot name="left">
        {{ leftContent }}
      </slot>
    </div>
    
    <div 
      v-if="resizable"
      :class="splitterClass"
      :style="splitterStyle"
      @mousedown="handleMouseDown"
    ></div>
    
    <div 
      :class="rightPanelClass"
      :style="rightPanelStyle"
    >
      <slot name="right">
        {{ rightContent }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  splitPosition?: number
  minSize?: number
  maxSize?: number
  resizable?: boolean
  disabled?: boolean
  leftContent?: string
  rightContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  splitPosition: 50,
  minSize: 20,
  maxSize: 80,
  resizable: true,
  disabled: false
})

const emit = defineEmits<{
  (e: 'resize', position: number): void
}>()

const currentPosition = ref(props.splitPosition)
const isDragging = ref(false)

const leftPanelStyle = computed(() => {
  const styles: Record<string, string | number> = {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'auto'
  }
  
  if (props.orientation === 'horizontal') {
    styles.width = `${currentPosition.value}%`
    styles.height = '100%'
  } else {
    styles.height = `${currentPosition.value}%`
    styles.width = '100%'
  }
  
  return styles
})

const rightPanelStyle = computed(() => {
  const styles: Record<string, string | number> = {
    position: 'absolute',
    overflow: 'auto'
  }
  
  const offset = props.resizable ? 5 : 0
  
  if (props.orientation === 'horizontal') {
    styles.left = `${currentPosition.value + offset}%`
    styles.right = 0
    styles.width = `${100 - currentPosition.value - offset}%`
    styles.height = '100%'
  } else {
    styles.top = `${currentPosition.value + offset}%`
    styles.bottom = 0
    styles.height = `${100 - currentPosition.value - offset}%`
    styles.width = '100%'
  }
  
  return styles
})

const splitterStyle = computed(() => {
  const styles: Record<string, string | number> = {
    position: 'absolute',
    cursor: props.orientation === 'horizontal' ? 'col-resize' : 'row-resize',
    backgroundColor: '#e0e0e0',
    userSelect: 'none'
  }
  
  if (props.orientation === 'horizontal') {
    styles.left = `${currentPosition.value}%`
    styles.width = '5px'
    styles.height = '100%'
  } else {
    styles.top = `${currentPosition.value}%`
    styles.height = '5px'
    styles.width = '100%'
  }
  
  return styles
})

const leftPanelClass = computed(() => [
  'vue-split-panel__left',
  props.disabled && 'vue-split-panel__left--disabled'
])

const rightPanelClass = computed(() => [
  'vue-split-panel__right',
  props.disabled && 'vue-split-panel__right--disabled'
])

const splitterClass = computed(() => [
  'vue-split-panel__splitter',
  isDragging.value && 'vue-split-panel__splitter--dragging'
])

const handleMouseDown = (e: MouseEvent) => {
  if (props.disabled) return
  isDragging.value = true
  e.preventDefault()
}

const handleMouseMove = () => {
  if (!isDragging.value || props.disabled) return
  
  // 计算新位置
  // 简化实现
  currentPosition.value = Math.max(props.minSize, Math.min(props.maxSize, currentPosition.value))
  emit('resize', currentPosition.value)
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.vue-split-panel {
  box-sizing: border-box;
}

.vue-split-panel__splitter {
  z-index: 10;
}

.vue-split-panel__splitter:hover {
  background-color: #ccc;
}

.vue-split-panel__splitter--dragging {
  background-color: #999;
}

.vue-split-panel__left--disabled,
.vue-split-panel__right--disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>

