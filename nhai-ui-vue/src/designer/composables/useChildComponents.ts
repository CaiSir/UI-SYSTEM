// 子组件管理 Composable（对话框和布局组件的子组件）
import { ref } from 'vue'
import type { DialogChildInfo, LayoutChildInfo } from '../types/designer'

export function useChildComponents() {
  // 对话框内控件的映射
  const dialogChildren = ref<Map<any, DialogChildInfo>>(new Map())
  const selectedDialogChild = ref<any | null>(null)

  // 布局组件内控件的映射
  const layoutChildren = ref<Map<any, LayoutChildInfo>>(new Map())
  const selectedLayoutChild = ref<any | null>(null)

  // 对话框子组件相关
  const addDialogChild = (instance: any, info: DialogChildInfo) => {
    dialogChildren.value.set(instance, info)
  }

  const removeDialogChild = (instance: any) => {
    dialogChildren.value.delete(instance)
    if (selectedDialogChild.value === instance) {
      selectedDialogChild.value = null
    }
  }

  const getDialogChild = (instance: any): DialogChildInfo | undefined => {
    return dialogChildren.value.get(instance)
  }

  const selectDialogChild = (instance: any) => {
    selectedDialogChild.value = instance
  }

  const clearDialogChildSelection = () => {
    dialogChildren.value.forEach(info => {
      info.wrapper.classList.remove('selected')
    })
  }

  // 布局子组件相关
  const addLayoutChild = (instance: any, info: LayoutChildInfo) => {
    layoutChildren.value.set(instance, info)
  }

  const removeLayoutChild = (instance: any) => {
    layoutChildren.value.delete(instance)
    if (selectedLayoutChild.value === instance) {
      selectedLayoutChild.value = null
    }
  }

  const getLayoutChild = (instance: any): LayoutChildInfo | undefined => {
    return layoutChildren.value.get(instance)
  }

  const selectLayoutChild = (instance: any) => {
    selectedLayoutChild.value = instance
  }

  const clearLayoutChildSelection = () => {
    layoutChildren.value.forEach(info => {
      info.element.classList.remove('selected')
    })
  }

  return {
    // 对话框子组件
    dialogChildren,
    selectedDialogChild,
    addDialogChild,
    removeDialogChild,
    getDialogChild,
    selectDialogChild,
    clearDialogChildSelection,
    // 布局子组件
    layoutChildren,
    selectedLayoutChild,
    addLayoutChild,
    removeLayoutChild,
    getLayoutChild,
    selectLayoutChild,
    clearLayoutChildSelection
  }
}

