<template>
  <el-button
    :type="type"
    :size="size"
    :plain="plain"
    :round="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { ElButton } from 'element-plus'

interface Props {
  text?: string
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  round?: boolean
  circle?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'default',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
/* 组件样式 */
</style>

