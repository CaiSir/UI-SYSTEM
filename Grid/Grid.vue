<template>
  <div 
    :class="gridClasses"
    :style="gridStyles"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  container?: boolean
  // Grid 容器属性
  columns?: number | string
  rows?: number | string
  templateAreas?: string
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
  justifyItems?: 'start' | 'end' | 'center' | 'stretch'
  alignItems?: 'start' | 'end' | 'center' | 'stretch'
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  // 通用属性
  spacing?: number | string
  gap?: string
  // Grid 项目属性
  column?: string
  row?: string
  area?: string
  justifySelf?: 'start' | 'end' | 'center' | 'stretch'
  alignSelf?: 'start' | 'end' | 'center' | 'stretch'
}

const props = withDefaults(defineProps<Props>(), {
  container: true,
  columns: 12,
  autoFlow: 'row',
  justifyItems: 'stretch',
  alignItems: 'stretch',
  spacing: 2
})

const gridClasses = computed(() => {
  return [
    'vue-grid',
    props.container ? 'vue-grid--container' : 'vue-grid--item'
  ]
})

const gridStyles = computed(() => {
  const style: Record<string, any> = {}
  
  if (props.container) {
    // Grid 容器样式
    style.display = 'grid'
    style.gridAutoFlow = props.autoFlow || 'row'
    style.justifyItems = props.justifyItems
    style.alignItems = props.alignItems
    
    const isColumnFlow = props.autoFlow === 'column' || props.autoFlow === 'column dense'
    
    // 处理列模板
    if (typeof props.columns === 'number') {
      style.gridTemplateColumns = `repeat(${props.columns}, 1fr)`
    } else if (props.columns) {
      style.gridTemplateColumns = props.columns
    }
    
    // 处理行模板
    if (isColumnFlow) {
      // 当 autoFlow 是 column 时，不使用 grid-template-rows，使用 grid-auto-rows
      if (props.rows) {
        style.gridAutoRows = typeof props.rows === 'number' ? '1fr' : String(props.rows)
      } else {
        style.gridAutoRows = 'auto'
      }
      // 确保不设置 grid-template-rows
      style.gridTemplateRows = 'none'
    } else {
      // 当 autoFlow 是 row 时，正常处理
      if (props.rows) {
        if (typeof props.rows === 'number') {
          style.gridTemplateRows = `repeat(${props.rows}, 1fr)`
        } else {
          style.gridTemplateRows = props.rows
        }
      } else {
        style.gridAutoRows = 'auto'
      }
    }
    
    // 处理网格区域
    if (props.templateAreas) {
      style.gridTemplateAreas = props.templateAreas
    }
    
    // 网格容器对齐
    if (props.justifyContent) {
      style.justifyContent = props.justifyContent
    }
    if (props.alignContent) {
      style.alignContent = props.alignContent
    }
  } else {
    // Grid 项目样式
    if (props.column) {
      style.gridColumn = props.column
    }
    if (props.row) {
      style.gridRow = props.row
    }
    if (props.area) {
      style.gridArea = props.area
    }
    if (props.justifySelf) {
      style.justifySelf = props.justifySelf
    }
    if (props.alignSelf) {
      style.alignSelf = props.alignSelf
    }
  }
  
  // 间距处理
  if (props.gap) {
    style.gap = props.gap
  } else if (props.spacing) {
    if (typeof props.spacing === 'number') {
      style.gap = `${props.spacing}px`
    } else {
      style.gap = props.spacing
    }
  }

  return style
})
</script>

<style scoped>
.vue-grid {
  box-sizing: border-box;
}

.vue-grid--container {
  width: 100%;
}

.vue-grid--item {
  min-width: 0;
}
</style>