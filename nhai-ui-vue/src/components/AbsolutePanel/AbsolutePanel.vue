<template>
  <div class="absolute-panel" :style="panelStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%'
})

const panelStyle = computed(() => ({
  position: 'relative',
  width: props.width,
  height: props.height,
  backgroundColor: props.backgroundColor,
  boxSizing: 'border-box'
}))
</script>

<style scoped>
.absolute-panel {
  position: relative;
}
</style>

