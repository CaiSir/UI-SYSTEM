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
  spacing?: number
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

const props = withDefaults(defineProps<Props>(), {
  container: false,
  spacing: 2,
  direction: 'row',
  justify: 'flex-start',
  alignItems: 'stretch',
  wrap: 'wrap'
})

const gridClasses = computed(() => {
  return [
    'vue-grid',
    props.container ? 'vue-grid--container' : 'vue-grid--item'
  ]
})

const gridStyles = computed(() => {
  const style: Record<string, any> = {
    display: 'flex',
    flexDirection: props.direction,
    justifyContent: props.justify,
    alignItems: props.alignItems,
    flexWrap: props.wrap
  }

  if (props.spacing > 0) {
    style.gap = `${props.spacing * 8}px`
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
  flex: 1;
}
</style>

