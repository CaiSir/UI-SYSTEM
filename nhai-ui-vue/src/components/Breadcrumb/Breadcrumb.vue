<template>
  <el-breadcrumb :separator="separator">
    <el-breadcrumb-item
      v-for="(item, index) in items"
      :key="index"
      :to="item.href || undefined"
      :disabled="item.disabled"
      @click="handleItemClick(item, index)"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import type { BreadcrumbItem } from './types'

interface Props {
  items: BreadcrumbItem[]
  separator?: string
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  separator: '/'
})

const emit = defineEmits<{
  (e: 'itemClick', item: BreadcrumbItem, index: number): void
}>()

const handleItemClick = (item: BreadcrumbItem, index: number) => {
  if (!item.disabled) {
    emit('itemClick', item, index)
  }
}
</script>

<style scoped>
</style>

