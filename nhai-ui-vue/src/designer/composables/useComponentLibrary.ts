// 组件库管理 Composable
import { ref } from 'vue'
// TODO: computed 会在后续功能中使用
import type { ComponentDefinition } from '../types/designer'

const components: ComponentDefinition[] = [
  { name: '按钮', type: 'button', icon: '🔘', category: '表单' },
  { name: '输入框', type: 'input', icon: '📝', category: '表单' },
  { name: '选择器', type: 'select', icon: '🔽', category: '表单' },
  { name: '开关', type: 'switch', icon: '🔀', category: '表单' },
  { name: '复选框', type: 'checkbox', icon: '☑️', category: '表单' },
  { name: '对话框', type: 'dialog', icon: '💬', category: '反馈' },
  { name: '窗口', type: 'widget', icon: '🪟', category: '反馈' },
  { name: '卡片', type: 'card', icon: '🃏', category: '布局' },
  { name: '网格', type: 'grid', icon: '⊞', category: '布局' },
  { name: '容器', type: 'container', icon: '📦', category: '布局' },
  { name: '分割面板', type: 'splitpanel', icon: '⚡', category: '布局' },
]

export function useComponentLibrary() {
  const componentCategories = ref(['表单', '反馈', '布局'])

  const getComponentsByCategory = (category: string) => {
    return components.filter(comp => comp.category === category)
  }

  const getComponentByType = (type: string): ComponentDefinition | undefined => {
    return components.find(comp => comp.type === type)
  }

  const getAllComponents = () => components

  return {
    components: components,
    componentCategories,
    getComponentsByCategory,
    getComponentByType,
    getAllComponents
  }
}

