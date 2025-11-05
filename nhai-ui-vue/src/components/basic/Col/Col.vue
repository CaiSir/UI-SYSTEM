<template>
  <div 
    :class="colClasses"
    :style="colStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Col 组件 - 列容器
 * 基于 24 列栅格系统
 */
interface ResponsiveProps {
  span?: number      // 栅格占位格数，可选 0-24
  offset?: number    // 栅格左侧的间隔格数
  push?: number      // 栅格向右移动格数
  pull?: number      // 栅格向左移动格数
  order?: number     // 栅格顺序
}

interface Props extends ResponsiveProps {
  // 默认栅格属性（用于所有断点）
  span?: number
  offset?: number
  push?: number
  pull?: number
  order?: number
  
  // 响应式断点配置
  xs?: number | ResponsiveProps    // <576px
  sm?: number | ResponsiveProps    // ≥576px
  md?: number | ResponsiveProps    // ≥768px
  lg?: number | ResponsiveProps    // ≥992px
  xl?: number | ResponsiveProps    // ≥1200px
  xxl?: number | ResponsiveProps   // ≥1600px
  
  // 自定义类名
  class?: string
  
  // Flex 布局属性
  flex?: string | number           // flex 属性值
}

const props = withDefaults(defineProps<Props>(), {
  span: undefined,
  offset: 0,
  push: 0,
  pull: 0
})

const colClasses = computed(() => {
  const classes: string[] = ['nhai-col']
  
  // 基础类名
  if (props.span !== undefined) {
    classes.push(`nhai-col-span-${props.span}`)
  }
  if (props.offset) {
    classes.push(`nhai-col-offset-${props.offset}`)
  }
  if (props.push) {
    classes.push(`nhai-col-push-${props.push}`)
  }
  if (props.pull) {
    classes.push(`nhai-col-pull-${props.pull}`)
  }
  
  // 响应式类名
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
  breakpoints.forEach(breakpoint => {
    const value = props[breakpoint]
    if (value !== undefined) {
      if (typeof value === 'number') {
        classes.push(`nhai-col-${breakpoint}-${value}`)
      } else {
        if (value.span !== undefined) {
          classes.push(`nhai-col-${breakpoint}-${value.span}`)
        }
        if (value.offset) {
          classes.push(`nhai-col-${breakpoint}-offset-${value.offset}`)
        }
        if (value.push) {
          classes.push(`nhai-col-${breakpoint}-push-${value.push}`)
        }
        if (value.pull) {
          classes.push(`nhai-col-${breakpoint}-pull-${value.pull}`)
        }
        if (value.order !== undefined) {
          classes.push(`nhai-col-${breakpoint}-order-${value.order}`)
        }
      }
    }
  })
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.filter(Boolean)
})

const colStyle = computed(() => {
  const style: Record<string, any> = {}
  
  // Flex 属性
  if (props.flex !== undefined) {
    style.flex = typeof props.flex === 'number' ? `${props.flex} 1 0%` : props.flex
  }
  
  // Order（如果没有设置 flex，使用 order）
  if (props.order !== undefined) {
    style.order = props.order
  }
  
  // 栅格间距通过父组件 Row 设置的 CSS 变量传递
  // 这里使用 CSS 变量，实际值由 Row 组件设置
  style.paddingLeft = 'calc(var(--row-gutter-h, 0px) / 2)'
  style.paddingRight = 'calc(var(--row-gutter-h, 0px) / 2)'
  style.paddingTop = 'calc(var(--row-gutter-v, 0px) / 2)'
  style.paddingBottom = 'calc(var(--row-gutter-v, 0px) / 2)'
  
  return style
})
</script>

<style scoped>
.nhai-col {
  position: relative;
  max-width: 100%;
  box-sizing: border-box;
  flex: 0 0 auto;
}

/* 基础栅格样式 - 使用 flexbox */
.nhai-col-span-0 {
  display: none;
}

/* 生成 1-24 列的样式 */
.nhai-col-span-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
.nhai-col-span-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
.nhai-col-span-3 { flex: 0 0 12.5%; max-width: 12.5%; }
.nhai-col-span-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
.nhai-col-span-5 { flex: 0 0 20.83333333%; max-width: 20.83333333%; }
.nhai-col-span-6 { flex: 0 0 25%; max-width: 25%; }
.nhai-col-span-7 { flex: 0 0 29.16666667%; max-width: 29.16666667%; }
.nhai-col-span-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
.nhai-col-span-9 { flex: 0 0 37.5%; max-width: 37.5%; }
.nhai-col-span-10 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
.nhai-col-span-11 { flex: 0 0 45.83333333%; max-width: 45.83333333%; }
.nhai-col-span-12 { flex: 0 0 50%; max-width: 50%; }
.nhai-col-span-13 { flex: 0 0 54.16666667%; max-width: 54.16666667%; }
.nhai-col-span-14 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
.nhai-col-span-15 { flex: 0 0 62.5%; max-width: 62.5%; }
.nhai-col-span-16 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
.nhai-col-span-17 { flex: 0 0 70.83333333%; max-width: 70.83333333%; }
.nhai-col-span-18 { flex: 0 0 75%; max-width: 75%; }
.nhai-col-span-19 { flex: 0 0 79.16666667%; max-width: 79.16666667%; }
.nhai-col-span-20 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
.nhai-col-span-21 { flex: 0 0 87.5%; max-width: 87.5%; }
.nhai-col-span-22 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
.nhai-col-span-23 { flex: 0 0 95.83333333%; max-width: 95.83333333%; }
.nhai-col-span-24 { flex: 0 0 100%; max-width: 100%; }

/* Offset */
.nhai-col-offset-1 { margin-left: 4.16666667%; }
.nhai-col-offset-2 { margin-left: 8.33333333%; }
.nhai-col-offset-3 { margin-left: 12.5%; }
.nhai-col-offset-4 { margin-left: 16.66666667%; }
.nhai-col-offset-5 { margin-left: 20.83333333%; }
.nhai-col-offset-6 { margin-left: 25%; }
.nhai-col-offset-7 { margin-left: 29.16666667%; }
.nhai-col-offset-8 { margin-left: 33.33333333%; }
.nhai-col-offset-9 { margin-left: 37.5%; }
.nhai-col-offset-10 { margin-left: 41.66666667%; }
.nhai-col-offset-11 { margin-left: 45.83333333%; }
.nhai-col-offset-12 { margin-left: 50%; }
.nhai-col-offset-13 { margin-left: 54.16666667%; }
.nhai-col-offset-14 { margin-left: 58.33333333%; }
.nhai-col-offset-15 { margin-left: 62.5%; }
.nhai-col-offset-16 { margin-left: 66.66666667%; }
.nhai-col-offset-17 { margin-left: 70.83333333%; }
.nhai-col-offset-18 { margin-left: 75%; }
.nhai-col-offset-19 { margin-left: 79.16666667%; }
.nhai-col-offset-20 { margin-left: 83.33333333%; }
.nhai-col-offset-21 { margin-left: 87.5%; }
.nhai-col-offset-22 { margin-left: 91.66666667%; }
.nhai-col-offset-23 { margin-left: 95.83333333%; }

/* Push/Pull (使用 position) */
.nhai-col-push-1 { left: 4.16666667%; }
.nhai-col-push-2 { left: 8.33333333%; }
.nhai-col-push-3 { left: 12.5%; }
.nhai-col-push-4 { left: 16.66666667%; }
.nhai-col-push-5 { left: 20.83333333%; }
.nhai-col-push-6 { left: 25%; }
.nhai-col-push-7 { left: 29.16666667%; }
.nhai-col-push-8 { left: 33.33333333%; }
.nhai-col-push-9 { left: 37.5%; }
.nhai-col-push-10 { left: 41.66666667%; }
.nhai-col-push-11 { left: 45.83333333%; }
.nhai-col-push-12 { left: 50%; }
.nhai-col-push-13 { left: 54.16666667%; }
.nhai-col-push-14 { left: 58.33333333%; }
.nhai-col-push-15 { left: 62.5%; }
.nhai-col-push-16 { left: 66.66666667%; }
.nhai-col-push-17 { left: 70.83333333%; }
.nhai-col-push-18 { left: 75%; }
.nhai-col-push-19 { left: 79.16666667%; }
.nhai-col-push-20 { left: 83.33333333%; }
.nhai-col-push-21 { left: 87.5%; }
.nhai-col-push-22 { left: 91.66666667%; }
.nhai-col-push-23 { left: 95.83333333%; }

.nhai-col-pull-1 { right: 4.16666667%; }
.nhai-col-pull-2 { right: 8.33333333%; }
.nhai-col-pull-3 { right: 12.5%; }
.nhai-col-pull-4 { right: 16.66666667%; }
.nhai-col-pull-5 { right: 20.83333333%; }
.nhai-col-pull-6 { right: 25%; }
.nhai-col-pull-7 { right: 29.16666667%; }
.nhai-col-pull-8 { right: 33.33333333%; }
.nhai-col-pull-9 { right: 37.5%; }
.nhai-col-pull-10 { right: 41.66666667%; }
.nhai-col-pull-11 { right: 45.83333333%; }
.nhai-col-pull-12 { right: 50%; }
.nhai-col-pull-13 { right: 54.16666667%; }
.nhai-col-pull-14 { right: 58.33333333%; }
.nhai-col-pull-15 { right: 62.5%; }
.nhai-col-pull-16 { right: 66.66666667%; }
.nhai-col-pull-17 { right: 70.83333333%; }
.nhai-col-pull-18 { right: 75%; }
.nhai-col-pull-19 { right: 79.16666667%; }
.nhai-col-pull-20 { right: 83.33333333%; }
.nhai-col-pull-21 { right: 87.5%; }
.nhai-col-pull-22 { right: 91.66666667%; }
.nhai-col-pull-23 { right: 95.83333333%; }

/* 响应式断点样式 - 仅展示部分关键断点，完整版本可使用工具生成 */
/* xs: <576px */
@media (max-width: 575.98px) {
  .nhai-col-xs-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
  .nhai-col-xs-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .nhai-col-xs-3 { flex: 0 0 12.5%; max-width: 12.5%; }
  .nhai-col-xs-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .nhai-col-xs-6 { flex: 0 0 25%; max-width: 25%; }
  .nhai-col-xs-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .nhai-col-xs-12 { flex: 0 0 50%; max-width: 50%; }
  .nhai-col-xs-24 { flex: 0 0 100%; max-width: 100%; }
}

/* sm: ≥576px */
@media (min-width: 576px) {
  .nhai-col-sm-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
  .nhai-col-sm-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .nhai-col-sm-3 { flex: 0 0 12.5%; max-width: 12.5%; }
  .nhai-col-sm-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .nhai-col-sm-6 { flex: 0 0 25%; max-width: 25%; }
  .nhai-col-sm-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .nhai-col-sm-12 { flex: 0 0 50%; max-width: 50%; }
  .nhai-col-sm-24 { flex: 0 0 100%; max-width: 100%; }
}

/* md: ≥768px */
@media (min-width: 768px) {
  .nhai-col-md-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
  .nhai-col-md-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .nhai-col-md-3 { flex: 0 0 12.5%; max-width: 12.5%; }
  .nhai-col-md-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .nhai-col-md-6 { flex: 0 0 25%; max-width: 25%; }
  .nhai-col-md-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .nhai-col-md-12 { flex: 0 0 50%; max-width: 50%; }
  .nhai-col-md-24 { flex: 0 0 100%; max-width: 100%; }
}

/* lg: ≥992px */
@media (min-width: 992px) {
  .nhai-col-lg-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
  .nhai-col-lg-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .nhai-col-lg-3 { flex: 0 0 12.5%; max-width: 12.5%; }
  .nhai-col-lg-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .nhai-col-lg-6 { flex: 0 0 25%; max-width: 25%; }
  .nhai-col-lg-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .nhai-col-lg-12 { flex: 0 0 50%; max-width: 50%; }
  .nhai-col-lg-24 { flex: 0 0 100%; max-width: 100%; }
}

/* xl: ≥1200px */
@media (min-width: 1200px) {
  .nhai-col-xl-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
  .nhai-col-xl-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .nhai-col-xl-3 { flex: 0 0 12.5%; max-width: 12.5%; }
  .nhai-col-xl-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .nhai-col-xl-6 { flex: 0 0 25%; max-width: 25%; }
  .nhai-col-xl-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .nhai-col-xl-12 { flex: 0 0 50%; max-width: 50%; }
  .nhai-col-xl-24 { flex: 0 0 100%; max-width: 100%; }
}

/* xxl: ≥1600px */
@media (min-width: 1600px) {
  .nhai-col-xxl-1 { flex: 0 0 4.16666667%; max-width: 4.16666667%; }
  .nhai-col-xxl-2 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .nhai-col-xxl-3 { flex: 0 0 12.5%; max-width: 12.5%; }
  .nhai-col-xxl-4 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .nhai-col-xxl-6 { flex: 0 0 25%; max-width: 25%; }
  .nhai-col-xxl-8 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .nhai-col-xxl-12 { flex: 0 0 50%; max-width: 50%; }
  .nhai-col-xxl-24 { flex: 0 0 100%; max-width: 100%; }
}
</style>

