<template>
  <div 
    :class="[
      'vue-container',
      `vue-container--${maxWidth === false ? 'false' : maxWidth}`,
      fixed ? 'vue-container--fixed' : ''
    ]"
    :style="containerStyle"
  >
    <slot>
      {{ content }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fixed?: boolean
  disableGutters?: boolean
  content?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'lg',
  fixed: false,
  disableGutters: false
})

const maxWidthMap: Record<string, string> = {
  xs: '444px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px'
}

const containerStyle = computed(() => {
  const style: Record<string, any> = {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  if (props.maxWidth !== false) {
    style.maxWidth = maxWidthMap[props.maxWidth]
  }

  if (!props.disableGutters) {
    style.paddingLeft = '16px'
    style.paddingRight = '16px'
  }

  if (props.fixed) {
    style.maxWidth = props.maxWidth !== false ? maxWidthMap[props.maxWidth] : 'none'
  }

  return style
})
</script>

<style scoped>
.vue-container {
  box-sizing: border-box;
}

.vue-container--fixed {
  max-width: 100%;
}
</style>

