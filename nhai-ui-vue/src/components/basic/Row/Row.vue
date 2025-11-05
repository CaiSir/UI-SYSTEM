<template>
  <div 
    :class="rowClasses"
    :style="rowStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Row 组件 - 行容器
 * 基于 24 列栅格系统，使用 flexbox 布局
 */
interface Props {
  // 栅格间距，可以是数字（px）或数组 [水平间距, 垂直间距]
  gutter?: number | [number, number]
  
  // 水平排列方式
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  
  // 垂直对齐方式
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
  
  // 是否自动换行
  wrap?: boolean
  
  // 自定义类名
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
  wrap: true
})

const rowClasses = computed(() => {
  return [
    'nhai-row',
    props.class
  ].filter(Boolean)
})

const rowStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'flex',
    flexWrap: props.wrap ? 'wrap' : 'nowrap'
  }

  // 水平对齐
  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    'space-around': 'space-around',
    'space-between': 'space-between',
    'space-evenly': 'space-evenly'
  }
  style.justifyContent = justifyMap[props.justify] || 'flex-start'

  // 垂直对齐
  const alignMap: Record<string, string> = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
    stretch: 'stretch'
  }
  style.alignItems = alignMap[props.align] || 'flex-start'

  // 栅格间距
  if (props.gutter) {
    if (Array.isArray(props.gutter)) {
      const [horizontal, vertical] = props.gutter
      style.marginLeft = `-${horizontal / 2}px`
      style.marginRight = `-${horizontal / 2}px`
      if (vertical) {
        style.marginTop = `-${vertical / 2}px`
        style.marginBottom = `-${vertical / 2}px`
      }
      // 通过 CSS 变量传递给子组件
      style['--row-gutter-h'] = `${horizontal}px`
      style['--row-gutter-v'] = `${vertical}px`
    } else {
      const gutter = props.gutter
      style.marginLeft = `-${gutter / 2}px`
      style.marginRight = `-${gutter / 2}px`
      style['--row-gutter-h'] = `${gutter}px`
      style['--row-gutter-v'] = `${gutter}px`
    }
  }

  return style
})
</script>

<style scoped>
.nhai-row {
  position: relative;
  box-sizing: border-box;
}

/* 栅格间距通过 CSS 变量传递给 Col 组件 */
</style>

