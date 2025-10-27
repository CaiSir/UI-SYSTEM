<template>
  <el-menu
    :mode="mode"
    :default-active="defaultActive"
    :collapse="collapse"
    :unique-opened="uniqueOpened"
    :router="router"
    :collapse-transition="collapseTransition"
    @select="handleSelect"
  >
    <template v-for="item in items" :key="item.id">
      <!-- 单级菜单 -->
      <el-menu-item
        v-if="!item.children || item.children.length === 0"
        :index="String(item.id)"
        :disabled="item.disabled"
      >
        <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>

      <!-- 多级菜单 -->
      <el-sub-menu v-else :index="String(item.id)">
        <template #title>
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </template>
        
        <el-menu-item
          v-for="child in item.children"
          :key="child.id"
          :index="String(child.id)"
          :disabled="child.disabled"
        >
          {{ child.label }}
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem, ElSubMenu, ElIcon } from 'element-plus'

export interface MenuItem {
  id: string | number
  label: string
  icon?: string
  disabled?: boolean
  children?: MenuItem[]
}

interface Props {
  items: MenuItem[]
  mode?: 'horizontal' | 'vertical'
  defaultActive?: string
  collapse?: boolean
  uniqueOpened?: boolean
  router?: boolean
  collapseTransition?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  mode: 'horizontal',
  collapse: false,
  uniqueOpened: false,
  router: false,
  collapseTransition: true
})

const emit = defineEmits<{
  (e: 'select', index: string, indexPath: string[]): void
}>()

const handleSelect = (index: string, indexPath: string[]) => {
  emit('select', index, indexPath)
}
</script>

<style scoped>
</style>

