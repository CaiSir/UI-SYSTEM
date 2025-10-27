<template>
  <div :class="['vue-layout-builder', layoutClass]" :style="layoutStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  layoutType?: 'vbox' | 'hbox' | 'grid' | 'container'
  direction?: 'row' | 'column'
  spacing?: number
  padding?: string
  gap?: string
  width?: string
  height?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  layoutType: 'vbox',
  direction: 'column',
  spacing: 0,
  padding: '0',
  gap: '8px'
})

const layoutClass = computed(() => {
  return `vue-layout-builder--${props.layoutType}`
})

const layoutStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'flex',
    flexDirection: props.direction,
    padding: props.padding,
    gap: props.gap
  }

  if (props.width) {
    style.width = props.width
  }

  if (props.height) {
    style.height = props.height
  }

  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
  }

  return style
})
</script>

<style scoped>
.vue-layout-builder {
  box-sizing: border-box;
}

.vue-layout-builder--vbox {
  flex-direction: column;
}

.vue-layout-builder--hbox {
  flex-direction: row;
}

.vue-layout-builder--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.vue-layout-builder--container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

