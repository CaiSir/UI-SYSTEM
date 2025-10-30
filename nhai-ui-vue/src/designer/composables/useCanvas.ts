// 画布管理 Composable
import { ref } from 'vue'
import type { CanvasComponent } from '../types/designer'

export function useCanvas() {
  const canvasComponents = ref<CanvasComponent[]>([])
  const selectedComponent = ref<CanvasComponent | null>(null)

  const selectComponent = (comp: CanvasComponent) => {
    selectedComponent.value = comp
  }

  const removeComponent = (index: number) => {
    canvasComponents.value.splice(index, 1)
    if (selectedComponent.value?.id === canvasComponents.value[index]?.id) {
      selectedComponent.value = null
    }
  }

  const clearCanvas = () => {
    if (canvasComponents.value.length > 0 && confirm('确定要清空画布吗？')) {
      canvasComponents.value = []
      selectedComponent.value = null
      return true
    }
    return false
  }

  const getComponentById = (id: string): CanvasComponent | undefined => {
    return canvasComponents.value.find(c => c.id === id)
  }

  const addComponent = (component: CanvasComponent) => {
    canvasComponents.value.push(component)
  }

  const updateComponent = (id: string, updates: Partial<CanvasComponent>) => {
    const index = canvasComponents.value.findIndex(c => c.id === id)
    if (index >= 0) {
      canvasComponents.value[index] = { ...canvasComponents.value[index], ...updates }
    }
  }

  return {
    canvasComponents,
    selectedComponent,
    selectComponent,
    removeComponent,
    clearCanvas,
    getComponentById,
    addComponent,
    updateComponent
  }
}

