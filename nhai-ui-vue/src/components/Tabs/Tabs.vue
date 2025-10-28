<template>
  <el-tabs
    v-model="activeTab"
    :type="type"
    :tab-position="tabPosition"
    :stretch="stretch"
    :addable="addable"
    :editable="editable"
    @tab-click="handleTabClick"
    @tab-remove="handleTabRemove"
    @tab-add="handleTabAdd"
    @edit="handleEdit"
  >
    <el-tab-pane
      v-for="tab in items"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
      :disabled="tab.disabled"
      :closable="tab.closable"
    >
      {{ tab.content }}
      <slot :name="tab.name">{{ tab.content }}</slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'

export interface TabItem {
  name: string
  label: string
  content?: string
  disabled?: boolean
  closable?: boolean
}

interface Props {
  modelValue?: string
  items: TabItem[]
  type?: 'card' | 'border-card' | ''
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  stretch?: boolean
  addable?: boolean
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  items: () => [],
  tabPosition: 'top',
  stretch: false,
  addable: false,
  editable: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'tabClick', tab: TabItem): void
  (e: 'tabRemove', name: string): void
  (e: 'tabAdd', name: string): void
  (e: 'edit', name: string, action: 'add' | 'remove'): void
}>()

const activeTab = ref(props.modelValue || (props.items[0]?.name || ''))

watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue
})

watch(activeTab, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleTabClick = (tab: TabItem) => {
  emit('tabClick', tab)
}

const handleTabRemove = (name: string) => {
  emit('tabRemove', name)
}

const handleTabAdd = (name: string) => {
  emit('tabAdd', name)
}

const handleEdit = (name: string, action: 'add' | 'remove') => {
  emit('edit', name, action)
}
</script>

<style scoped>
</style>

