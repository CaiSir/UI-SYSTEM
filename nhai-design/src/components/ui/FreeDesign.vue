<template>
  <div class="freedesign-container">
    <div ref="composerContainer" class="composer-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  NHAIFrameworkRegistry, 
  VanillaAdapter, 
  NHAIComponentComposer 
} from 'nhai-framework'

const composerContainer = ref<HTMLElement>()
let composer: NHAIComponentComposer | null = null

onMounted(async () => {
  console.log('FreeDesign 组件正在初始化...')
  
  try {
    // 确保 Vanilla 适配器已注册
    const adapter = new VanillaAdapter()
    NHAIFrameworkRegistry.register(adapter)
    NHAIFrameworkRegistry.use('vanilla')
    console.log('✓ Vanilla 适配器已注册')
    
    // 创建组件组合器
    composer = new NHAIComponentComposer({
      rootPath: '/components',
      allowedTypes: ['button', 'input', 'container', 'layout'],
      enableDragDrop: true,
      enablePropertyEdit: true,
      enableTemplateSave: true,
      enableMultiSelect: true,
      showToolbar: false,
      showComponentPalette: false,
      showPropertyPanel: false,
      canvasWidth: 800,
      canvasHeight: 600,
      gridSize: 20,
      snapToGrid: true
    })

    // 渲染到容器
    if (composerContainer.value) {
      console.log('开始渲染组件组合器...')
      const element = composer.render()
      console.log('渲染结果:', element)
      console.log('元素类型:', element?.constructor?.name)
      console.log('元素标签:', element?.tagName)
      
      if (element && element instanceof HTMLElement) {
        composerContainer.value.appendChild(element)
        console.log('✓ 组件组合器已渲染到DOM')
      } else {
        console.error('❌ 渲染结果不是有效的HTMLElement:', element)
        // 创建一个简单的占位符
        const placeholder = document.createElement('div')
        placeholder.style.cssText = `
          width: 100%;
          height: 100%;
          background: #f0f0f0;
          border: 2px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 16px;
        `
        placeholder.textContent = '画布区域 - 请从左侧拖拽组件到此处'
        composerContainer.value.appendChild(placeholder)
      }
    } else {
      console.error('❌ composerContainer 未找到')
    }

    // 设置事件监听
    setupEventListeners()
    
    console.log('✓ FreeDesign 初始化完成')
  } catch (error) {
    console.error('❌ FreeDesign 初始化失败:', error)
  }
})

onUnmounted(() => {
  // 清理资源
  if (composer) {
    composer = null
  }
})

// 暴露composer实例给父组件
const getComposer = () => composer

// 暴露方法给父组件
defineExpose({
  getComposer
})

const setupEventListeners = () => {
  if (!composer) return

  // 监听组件添加事件
  composer.addEventListener('componentAdded', (data) => {
    console.log('组件已添加:', data.detail?.component || data.component)
  })

  // 监听属性更新事件
  composer.addEventListener('componentPropsUpdated', (data) => {
    console.log('组件属性已更新:', data.detail?.component || data.component, data.detail?.props || data.props)
  })

  // 监听模板保存事件
  composer.addEventListener('templateSaved', (data) => {
    console.log('模板已保存:', data.detail?.template || data.template)
    alert(`模板 "${(data.detail?.template || data.template)?.name}" 已保存成功！`)
  })

  // 监听模板加载事件
  composer.addEventListener('templateLoaded', (data) => {
    console.log('模板已加载:', data.detail?.template || data.template, data.detail?.components || data.components)
    alert(`模板 "${(data.detail?.template || data.template)?.name}" 已加载成功！`)
  })

  // 监听选择改变事件
  composer.addEventListener('selectionChanged', (selectedIds) => {
    console.log('选择改变:', selectedIds)
    if (selectedIds && selectedIds.length > 0) {
      const firstSelected = composer.getComponent(selectedIds[0])
      if (firstSelected) {
        console.log('第一个选中的组件:', firstSelected)
        
        // 更新属性面板
        updatePropertyPanel(firstSelected)
      }
    } else {
      // 没有选中组件时清空属性面板
      clearPropertyPanel()
    }
  })
  
  // 更新属性面板
  const updatePropertyPanel = (component: any) => {
    console.log('更新属性面板:', component)
    console.log('组件ID:', component?.id)
    console.log('组件定义ID:', component?.definitionId)
    console.log('组件属性:', component?.props)
    
    // 触发父组件的属性面板更新
    const event = new CustomEvent('componentSelected', {
      detail: {
        componentId: component.definitionId,
        componentData: component.props,
        component: component
      }
    })
    window.dispatchEvent(event)
  }
  
  // 清空属性面板
  const clearPropertyPanel = () => {
    console.log('清空属性面板')
    
    // 触发父组件的属性面板清空
    const event = new CustomEvent('componentDeselected', {
      detail: {}
    })
    window.dispatchEvent(event)
  }

  // 监听渲染更新事件
  composer.addEventListener('renderUpdate', (data) => {
    console.log('需要重新渲染:', (data.detail?.components || data.components)?.length, '个组件')
    
    // 手动触发重新渲染
    console.log('手动触发重新渲染...')
    const newElement = composer.render()
    console.log('新渲染元素:', newElement)
    
    // 替换容器中的内容
    if (composerContainer.value && newElement) {
      composerContainer.value.innerHTML = ''
      composerContainer.value.appendChild(newElement)
      console.log('✓ DOM已更新')
    }
    
    // 延迟检查，确保DOM更新完成
    setTimeout(() => {
      // 检查画布容器是否存在
      const canvasContainer = document.querySelector('.nhai-composer-canvas')
      if (canvasContainer) {
        console.log('✓ 画布容器已找到:', canvasContainer)
        console.log('画布容器子元素数量:', canvasContainer.children.length)
        
        // 检查是否有组件元素
        const componentElements = canvasContainer.querySelectorAll('.nhai-composer-component')
        console.log('画布中的组件元素数量:', componentElements.length)
        
        if (componentElements.length > 0) {
          console.log('✓ 组件元素已渲染到画布')
          componentElements.forEach((el, index) => {
            console.log(`组件 ${index + 1}:`, el)
          })
        } else {
          console.warn('⚠️ 画布中没有找到组件元素')
        }
      } else {
        console.error('❌ 画布容器未找到')
      }
    }, 100)
  })
}
</script>

<style scoped>
.freedesign-container {
  height: 100%;
  width: 100%;
}

.composer-container {
  height: 100%;
  width: 100%;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

/* 确保组件组合器样式正确显示 */
.composer-container :deep(.nhai-composer) {
  height: 100%;
  width: 100%;
}

.composer-container :deep(.nhai-composer-canvas) {
  background: #fafafa;
  border: none;
  width: 100%;
  height: 100%;
}

/* 隐藏不需要的面板 */
.composer-container :deep(.nhai-composer-toolbar) {
  display: none;
}

.composer-container :deep(.nhai-composer-palette) {
  display: none;
}

.composer-container :deep(.nhai-composer-properties) {
  display: none;
}

/* 确保画布占满整个空间 */
.composer-container :deep(.nhai-composer-main) {
  width: 100%;
  height: 100%;
}

.composer-container :deep(.nhai-composer-canvas-container) {
  width: 100%;
  height: 100%;
}
</style>
