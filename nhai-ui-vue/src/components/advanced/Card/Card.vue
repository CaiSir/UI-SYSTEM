<template>
  <el-card
    :header="header"
    :shadow="shadow"
    :body-style="bodyStyle"
    :class="cardClass"
  >
    <template #header v-if="hasHeader">
      <slot name="header">{{ header }}</slot>
    </template>

    <slot>
      {{ content }}
    </slot>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard } from 'element-plus'

interface Props {
  header?: string
  shadow?: 'always' | 'hover' | 'never'
  bodyStyle?: Record<string, any>
  content?: string
  cardClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'always',
  cardClass: ''
})

const hasHeader = computed(() => !!props.header)
</script>

<style scoped>
</style>

