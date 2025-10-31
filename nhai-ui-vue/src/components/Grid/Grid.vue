<template>
  <div 
    ref="gridElement"
    :class="[
      'vue-grid',
      container ? 'vue-grid--container' : ''
    ]"
    :style="gridStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  container?: boolean
  columns?: number | string  // 列数或列模板，如 12 或 "repeat(12, 1fr)"
  rows?: number | string     // 行数或行模板，可选
  templateAreas?: string     // 模板区域，如 "a a a" "b b c"
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
  justifyItems?: 'start' | 'end' | 'center' | 'stretch'
  alignItems?: 'start' | 'end' | 'center' | 'stretch'
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  spacing?: number           // 间距（Material UI 风格，实际间距 = spacing * 8px）
  gap?: string               // 自定义间距，如 "16px" 或 "1rem"
}

const props = withDefaults(defineProps<Props>(), {
  container: true,
  columns: 12,
  rows: undefined,
  templateAreas: undefined,
  autoFlow: 'row',
  justifyItems: 'start',  // 默认改为 start，避免子项过度拉伸
  alignItems: 'stretch',
  justifyContent: undefined,
  alignContent: undefined,
  spacing: 2,
  gap: undefined
})

const gridElement = ref<HTMLElement | null>(null)

const gridStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'inline-grid',  // 使用 inline-grid 让 Grid 根据内容自适应宽度
    // Grid 应该环抱着控件，使用 inline-grid 让 Grid 根据内容自适应
    // 不使用 width: 100%，避免过度拉伸
    boxSizing: 'border-box'
    // 移除 width 和 height 的 max-content 设置，让 inline-grid 自然处理
    // width: 'max-content' 可能会与 inline-grid 冲突
    // height: 'max-content' 可能会与 inline-grid 冲突
  }
  
  // container 模式主要用于父容器，在可视化编辑器中不应该强制拉伸
  // 只有当明确需要全宽时才设置 width: 100%
  // 在可视化编辑器中，Grid 应该根据内容和列数自适应宽度
  // if (props.container) {
  //   style.width = '100%'
  // }

  // 列模板
  // 关键：Grid 应该环抱着控件，根据实际子控件数量自适应列数
  if (typeof props.columns === 'number') {
    if (props.columns === 1) {
      // 单列布局：使用 max-content，确保 Grid 紧贴内容
      style.gridTemplateColumns = 'max-content'
    } else {
      // 多列布局：使用 auto 让列根据内容自适应
      // 关键是使用 auto 而不是 1fr，这样空列不会占用空间
      // 使用 repeat 但每列都是 auto，Grid 只会为有内容的列分配空间
      style.gridTemplateColumns = `repeat(${props.columns}, auto)`
      // auto 与 max-content 的区别：
      // - max-content: 列宽 = 该列中最宽的内容，但会创建所有列的 track
      // - auto: 列宽 = 内容宽度，且会根据内容自动收缩，空列宽度为 0
      // 使用 auto 可以确保 Grid 只占用实际需要的宽度
    }
  } else if (typeof props.columns === 'string') {
    style.gridTemplateColumns = props.columns
  }

  // 自动流动设置（需要在行/列模板之前设置，以便正确处理）
  const autoFlow = props.autoFlow
  
  // 行模板（如果指定）
  if (props.rows !== undefined) {
    if (typeof props.rows === 'number') {
      // 使用 auto 而不是 1fr，确保行高根据内容自适应
      style.gridTemplateRows = `repeat(${props.rows}, auto)`
    } else if (typeof props.rows === 'string') {
      style.gridTemplateRows = props.rows
    }
  } else {
    // 如果未设置 rows，根据 autoFlow 智能设置
    if (autoFlow === 'column' || autoFlow === 'column dense') {
      // 当按列排列时，让行自动创建
      style.gridAutoRows = 'auto'  // 自动行高
    } else {
      // 当按行排列时（默认），也要确保行高根据内容自适应
      style.gridAutoRows = 'auto'
    }
  }

  // 模板区域（如果指定）
  if (props.templateAreas) {
    style.gridTemplateAreas = `"${props.templateAreas}"`
  }

  // 自动流动 - 正确处理
  // 当 columns 为 1 时，强制使用 row 模式实现垂直堆叠
  if (typeof props.columns === 'number' && props.columns === 1) {
    // 单列布局：强制使用 row 模式实现垂直堆叠
    style.gridAutoFlow = 'row'  // 按行排列，单列时垂直堆叠
    style.gridTemplateColumns = 'max-content'  // 确保只有1列，使用 max-content 紧贴内容
    if (props.rows === undefined) {
      style.gridAutoRows = 'auto'
    }
  } else {
    // 多列布局或其他情况：使用用户指定的 autoFlow
    // 列模板已经在上面设置好了（使用 max-content）
    style.gridAutoFlow = autoFlow
    
    // 当 autoFlow 为 column 时，确保行模板正确应用
    if (autoFlow === 'column' || autoFlow === 'column dense') {
      // 对于 column 模式，需要确保行模板正确
      if (props.rows !== undefined && typeof props.rows === 'number') {
        // rows 已设置，保持 gridTemplateRows
      } else {
        // 未设置 rows，使用自动行高
        style.gridAutoRows = 'auto'
      }
    }
  }

  // 网格项对齐
  style.justifyItems = props.justifyItems
  style.alignItems = props.alignItems

  // 网格内容对齐（如果指定）
  if (props.justifyContent) {
    style.justifyContent = props.justifyContent
  }
  if (props.alignContent) {
    style.alignContent = props.alignContent
  }

  // 间距
  if (props.gap) {
    style.gap = props.gap
  } else {
    // Material UI 风格：spacing * 8px
    const gapValue = props.spacing * 8
    style.gap = `${gapValue}px`
  }

  return style
})
</script>

<style scoped>
.vue-grid {
  position: relative;
  /* Grid 应该环抱着控件，根据内容自适应 */
  /* display 在计算样式中设置，这里不重复设置 */
  /* 确保 Grid 紧贴内容，不留多余空白 */
  padding: 0;
  margin: 0;
  /* 不设置 width 和 height，让 inline-grid 自然处理 */
  /* inline-grid 会根据内容自动调整大小 */
}

/* .vue-grid--container {
  容器模式时，如果需要全宽，可以通过 style 属性设置
  width: 100%;
} */
</style>

