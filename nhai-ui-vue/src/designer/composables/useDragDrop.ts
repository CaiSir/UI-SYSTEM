// 拖拽处理 Composable
import { ref, nextTick } from 'vue'
import type { CanvasComponent } from '../types/designer'
import type { Ref } from 'vue'

interface DragDropDependencies {
  canvasComponents: Ref<CanvasComponent[]>
  dialogChildren: Ref<Map<any, any>>
  layoutChildren: Ref<Map<any, any>>
  selectedComponent: Ref<CanvasComponent | null>
  selectedDialogChild: Ref<any | null>
  selectedLayoutChild: Ref<any | null>
  selectComponent: (comp: CanvasComponent) => void
  selectDialogChild: (instance: any, dialogId: string) => void
  selectLayoutChild: (instance: any, layoutId: string) => void
  clearDialogChildSelection: () => void
  clearLayoutChildSelection: () => void
  updateCode: () => void
  createChildComponentInstance: (compDef: any) => Promise<{ instance: any } | null>
  createComponent: (compDef: any, x: number, y: number) => Promise<CanvasComponent>
}

export function useDragDrop(deps: DragDropDependencies) {
  const {
    canvasComponents,
    dialogChildren,
    layoutChildren,
    selectedComponent: _selectedComponent, // TODO: 会在后续功能中使用
    selectedDialogChild,
    selectedLayoutChild,
    selectComponent,
    selectDialogChild,
    selectLayoutChild,
    clearDialogChildSelection,
    clearLayoutChildSelection,
    updateCode,
    createChildComponentInstance,
    createComponent
  } = deps

  // 拖拽的组件
  const draggedComponent = ref<any>(null)
  
  // 画布组件拖拽
  const draggedElement = ref<CanvasComponent | null>(null)
  let dragOffset = { x: 0, y: 0 }
  let rafId: number | null = null

  // 对话框子组件拖拽
  const draggedDialogChild = ref<{ instance: any; wrapper: HTMLElement; dialogId: string } | null>(null)
  let dialogChildDragOffset = { x: 0, y: 0 }

  // 布局子组件拖拽
  const draggedLayoutChild = ref<{ instance: any; element: HTMLElement; layoutId: string; layoutType: 'grid' | 'container' } | null>(null)
  let layoutChildDragOffset = { x: 0, y: 0 }

  /**
   * 处理拖拽开始
   */
  const handleDragStart = (comp: any, event: DragEvent) => {
    draggedComponent.value = comp
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  /**
   * 处理对话框区域的拖拽悬停
   */
  const handleDialogDragOver = (event: DragEvent) => {
    const dialogBody = (event.target as Element).closest('.dialog-content-area')
    if (dialogBody) {
      dialogBody.classList.add('drag-over')
    } else {
      document.querySelectorAll('.dialog-content-area').forEach(el => {
        el.classList.remove('drag-over')
      })
    }
    
    setTimeout(() => {
      if (event.type === 'dragend' || event.type === 'drop') {
        document.querySelectorAll('.dialog-content-area').forEach(el => {
          el.classList.remove('drag-over')
        })
      }
    }, 100)
  }

  /**
   * 处理放置（主要逻辑）
   * 完整实现从 DesignerApp.vue 319-908行迁移
   */
  const handleDrop = async (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation() // 防止事件冒泡导致重复触发
    if (!draggedComponent.value) return

    // 检查是否放置到布局组件（Grid、Container）内
    // 方法1：检查是否直接点击到了 Container/Grid 元素（通过 data-id）
    let layoutElementWithId: Element | null = (event.target as Element).closest('[data-id]') as Element
    if (layoutElementWithId) {
      const layoutId = layoutElementWithId.getAttribute('data-id')
      if (layoutId) {
        const layoutComp = canvasComponents.value.find(c => c.id === layoutId && (c.type === 'grid' || c.type === 'container'))
        if (layoutComp) {
          // 查找实际的布局容器元素（.qt-grid-layout 或 .vue-container）
          let layoutContainer: HTMLElement | null = null
          if (layoutComp.type === 'grid') {
            layoutContainer = layoutElementWithId.querySelector('.qt-grid-layout, .vue-grid') as HTMLElement
          } else if (layoutComp.type === 'container') {
            layoutContainer = layoutElementWithId.querySelector('.vue-container') as HTMLElement
          }
          
          // 如果找不到内部容器，使用元素本身（可能在 nextTick 中还没渲染好）
          if (!layoutContainer) {
            layoutContainer = layoutElementWithId as HTMLElement
          }
          
          if (layoutContainer && (layoutComp.gridInstance || layoutComp.containerInstance)) {
            // 创建子组件实例
            const childInstance = await createChildComponentInstance(draggedComponent.value)
            if (!childInstance) return
            
            // 确保 layoutContainer 是实际的容器元素（.vue-grid 或 .vue-container）
            const actualContainer = layoutContainer.classList.contains('qt-grid-layout') || 
                                    layoutContainer.classList.contains('vue-grid') || 
                                    layoutContainer.classList.contains('vue-container')
              ? layoutContainer
              : (layoutContainer.querySelector('.qt-grid-layout, .vue-grid, .vue-container') as HTMLElement) || layoutContainer
            
            // 创建包装器用于定位和交互（类似 Widget/Dialog）
            const wrapper = document.createElement('div')
            wrapper.className = layoutComp.type === 'grid' 
              ? 'grid-child-component layout-child-component' 
              : 'container-child-component layout-child-component'
            
            // Grid 使用 CSS Grid 布局，子控件作为 grid item 参与布局
            if (layoutComp.type === 'grid') {
              // Grid item：作为 CSS Grid 的子项，不需要 flex 属性
              wrapper.style.cssText = `
                cursor: move;
                user-select: none;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
                min-width: 0;
                min-height: 0;
              `
            } else {
              // Container 使用相对定位
              wrapper.style.cssText = `
                position: relative;
                display: inline-block;
                cursor: move;
                user-select: none;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
              `
            }
            
            wrapper.setAttribute(`data-${layoutComp.type}-child`, 'true')
            
            // 关键：在调用 addChild 之前，先设置映射指向 wrapper（空的）
            // 这样 addChild -> renderChild 会检测到 wrapper 并跳过
            const layoutInstance = layoutComp.gridInstance || layoutComp.containerInstance
            if (layoutInstance.childElements) {
              layoutInstance.childElements.set(childInstance.instance, wrapper)
            }
            
            // 现在可以安全地调用 addChild，renderChild 会检测到 wrapper 并跳过渲染
            layoutInstance.addChild(childInstance.instance)
            
            // 获取子组件元素
            let childElement = childInstance.instance.getElement()
            
            // 如果 addChild 的 renderChild 渲染了元素到 contentContainer，我们需要把它取出来
            if (childElement && childElement.parentNode) {
              const contentContainer = layoutInstance.contentContainer
              if (contentContainer && contentContainer.contains(childElement)) {
                // 从 contentContainer 中移除
                contentContainer.removeChild(childElement)
              } else if (childElement.parentNode) {
                // 如果不在 contentContainer 中，也在其他地方，也要移除
                childElement.parentNode.removeChild(childElement)
              }
            } else if (!childElement) {
              // 如果没有元素（renderChild 跳过了），才渲染（避免重复渲染）
              childElement = childInstance.instance.render()
            }
            
            if (!childElement) {
              console.warn('子组件元素未找到')
              return
            }
            
            // 将元素添加到 wrapper
            wrapper.appendChild(childElement)
            
            // Grid 子控件的特殊处理：确保子控件能正确参与 CSS Grid 布局
            if (layoutComp.type === 'grid' && childElement instanceof HTMLElement) {
              // 移除可能干扰 Grid 布局的定位样式
              if (childElement.style.position === 'absolute') {
                childElement.style.position = ''
                childElement.style.left = ''
                childElement.style.top = ''
              }
              // CSS Grid 会自动排列子控件，子控件默认填充所在的 grid cell
            }
            
            // 添加选中和拖拽功能
            wrapper.addEventListener('click', (e) => {
              e.stopPropagation()
              selectLayoutChild(childInstance.instance, layoutId)
            })
            
            wrapper.addEventListener('mousedown', (e) => {
              e.stopPropagation()
              startDragLayoutChild(childInstance.instance, wrapper, e, layoutComp.type as 'grid' | 'container')
            })
            
            // 添加到布局容器中
            actualContainer.appendChild(wrapper)
            
            // 存储映射关系
            layoutChildren.value.set(childInstance.instance, {
              instance: childInstance.instance,
              element: wrapper, // 存储 wrapper 而不是直接的 element
              layoutId: layoutId,
              layoutType: layoutComp.type as 'grid' | 'container'
            })
            
            // 更新代码
            updateCode()
            draggedComponent.value = null
            return
          }
        }
      }
    }
    
    // 方法2：检查是否放置到了 .vue-grid 或 .vue-container 内部
    const layoutContainer = (event.target as Element).closest('.qt-grid-layout, .vue-grid, .vue-container') as HTMLElement
    if (layoutContainer) {
      // 向上查找带有 data-id 的父元素
      let parentWithId: Element | null = layoutContainer.parentElement
      while (parentWithId && !parentWithId.getAttribute('data-id')) {
        parentWithId = parentWithId.parentElement
      }
      
      if (parentWithId) {
        const layoutId = parentWithId.getAttribute('data-id')
        if (layoutId) {
          const layoutComp = canvasComponents.value.find(c => c.id === layoutId && (c.type === 'grid' || c.type === 'container'))
          if (layoutComp && (layoutComp.gridInstance || layoutComp.containerInstance)) {
            // 创建子组件实例
            const childInstance = await createChildComponentInstance(draggedComponent.value)
            if (!childInstance) return
            
            // 创建包装器用于定位和交互（类似 Widget/Dialog）
            const wrapper = document.createElement('div')
            wrapper.className = layoutComp.type === 'grid' 
              ? 'grid-child-component layout-child-component' 
              : 'container-child-component layout-child-component'
            
            // Grid 使用 CSS Grid 布局，子控件作为 grid item 参与布局
            if (layoutComp.type === 'grid') {
              // Grid item：作为 CSS Grid 的子项，不需要 flex 属性
              wrapper.style.cssText = `
                cursor: move;
                user-select: none;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
                min-width: 0;
                min-height: 0;
              `
            } else {
              // Container 使用相对定位
              wrapper.style.cssText = `
                position: relative;
                display: inline-block;
                cursor: move;
                user-select: none;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
              `
            }
            
            wrapper.setAttribute(`data-${layoutComp.type}-child`, 'true')
            
            // 关键：在调用 addChild 之前，先设置映射指向 wrapper（空的）
            // 这样 addChild -> renderChild 会检测到 wrapper 并跳过
            const layoutInstance = layoutComp.gridInstance || layoutComp.containerInstance
            if (layoutInstance.childElements) {
              layoutInstance.childElements.set(childInstance.instance, wrapper)
            }
            
            // 现在可以安全地调用 addChild，renderChild 会检测到 wrapper 并跳过渲染
            layoutInstance.addChild(childInstance.instance)
            
            // 获取子组件元素
            let childElement = childInstance.instance.getElement()
            
            // 如果 addChild 的 renderChild 渲染了元素到 contentContainer，我们需要把它取出来
            if (childElement && childElement.parentNode) {
              const contentContainer = layoutInstance.contentContainer
              if (contentContainer && contentContainer.contains(childElement)) {
                // 从 contentContainer 中移除
                contentContainer.removeChild(childElement)
              } else if (childElement.parentNode) {
                // 如果不在 contentContainer 中，也在其他地方，也要移除
                childElement.parentNode.removeChild(childElement)
              }
            } else if (!childElement) {
              // 如果没有元素（renderChild 跳过了），才渲染（避免重复渲染）
              childElement = childInstance.instance.render()
            }
            
            if (!childElement) {
              console.warn('子组件元素未找到')
              return
            }
            
            // 将元素添加到 wrapper
            wrapper.appendChild(childElement)
            
            // Grid 子控件的特殊处理：确保子控件能正确参与 CSS Grid 布局
            if (layoutComp.type === 'grid' && childElement instanceof HTMLElement) {
              // 移除可能干扰 Grid 布局的定位样式
              if (childElement.style.position === 'absolute') {
                childElement.style.position = ''
                childElement.style.left = ''
                childElement.style.top = ''
              }
              // CSS Grid 会自动排列子控件，子控件默认填充所在的 grid cell
            }
            
            // 添加选中和拖拽功能
            wrapper.addEventListener('click', (e) => {
              e.stopPropagation()
              selectLayoutChild(childInstance.instance, layoutId)
            })
            
            wrapper.addEventListener('mousedown', (e) => {
              e.stopPropagation()
              startDragLayoutChild(childInstance.instance, wrapper, e, layoutComp.type as 'grid' | 'container')
            })
            
            // 添加到布局容器中
            layoutContainer.appendChild(wrapper)
            
            // 存储映射关系
            layoutChildren.value.set(childInstance.instance, {
              instance: childInstance.instance,
              element: wrapper, // 存储 wrapper 而不是直接的 element
              layoutId: layoutId,
              layoutType: layoutComp.type as 'grid' | 'container'
            })
            
            // 更新代码
            updateCode()
            draggedComponent.value = null
            return
          }
        }
      }
    }
    
    // 检查是否放置到 Widget 内容区域
    let widgetBody = (event.target as Element).closest('.widget-content') as HTMLElement
    if (widgetBody) {
      // 向上查找带有 data-id 的父元素
      let parentWithId: Element | null = widgetBody.parentElement
      while (parentWithId && !parentWithId.getAttribute('data-id')) {
        parentWithId = parentWithId.parentElement
      }
      
      if (parentWithId) {
        const widgetId = parentWithId.getAttribute('data-id')
        if (widgetId) {
          const widgetComp = canvasComponents.value.find(c => c.id === widgetId && c.type === 'widget')
          if (widgetComp && widgetComp.widgetInstance) {
            // 创建子组件实例
            const childInstance = await createChildComponentInstance(draggedComponent.value)
            if (!childInstance) return
            
            // 检查是否是 Grid，如果是则填充整个 Widget 内容区域
            const isGrid = draggedComponent.value.type === 'grid'
            
            // 计算放置位置（相对于 Widget 内容区域）
            const rect = widgetBody.getBoundingClientRect()
            const x = event.clientX - rect.left - 20
            const y = event.clientY - rect.top - 20
            
            // 关键：先创建 wrapper（但不添加内容），并立即更新 childElements 映射
            // 这样后续调用 addChild 时，renderChild 会检测到 wrapper 并跳过渲染
            const wrapper = document.createElement('div')
            wrapper.className = 'widget-child-component dialog-child-component'
            
            if (isGrid) {
              // Grid 自适应填充 Widget 内容区域
              wrapper.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                cursor: move;
                user-select: none;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
                z-index: 10;
              `
            } else {
              wrapper.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                cursor: move;
                user-select: none;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
                z-index: 10;
              `
            }
            
            wrapper.setAttribute('data-widget-child', 'true')
            
            // 关键：在调用 addChild 之前，先设置映射指向 wrapper（空的）
            // 这样 addChild -> renderChild 会检测到 wrapper 并跳过
            if (widgetComp.widgetInstance.childElements) {
              widgetComp.widgetInstance.childElements.set(childInstance.instance, wrapper)
            }
            
            // 现在可以安全地调用 addChild，renderChild 会检测到 wrapper 并跳过渲染
            widgetComp.widgetInstance.addChild(childInstance.instance)
            
            // 获取子组件元素
            let childElement = childInstance.instance.getElement()
            
            // 如果 addChild 的 renderChild 渲染了元素到 contentContainer，我们需要把它取出来
            if (childElement && childElement.parentNode) {
              const contentContainer = widgetComp.widgetInstance.contentContainer
              if (contentContainer && contentContainer.contains(childElement)) {
                // 从 contentContainer 中移除
                contentContainer.removeChild(childElement)
              } else if (childElement.parentNode) {
                // 如果不在 contentContainer 中，也在其他地方，也要移除
                childElement.parentNode.removeChild(childElement)
              }
            } else if (!childElement) {
              // 如果没有元素（renderChild 跳过了），才渲染（避免重复渲染）
              childElement = childInstance.instance.render()
            }
            
            if (!childElement) {
              console.warn('子组件元素未找到')
              return
            }
            
            // 将元素添加到 wrapper
            wrapper.appendChild(childElement)
            
            // 如果是 Grid，设置 Grid 元素填充 wrapper
            if (isGrid && childElement instanceof HTMLElement) {
              // 移除 Grid 实例可能设置的 auto 样式，确保能填充 wrapper
              if (childElement.style.width === 'auto') {
                childElement.style.width = ''
              }
              if (childElement.style.height === 'auto') {
                childElement.style.height = ''
              }
              // 设置 Grid 外层容器填充 wrapper
              childElement.style.width = '100%'
              childElement.style.height = '100%'
              // 查找 Grid 的根元素（.vue-grid）并填充
              const gridRoot = childElement.querySelector('.qt-grid-layout, .vue-grid') as HTMLElement
              if (gridRoot) {
                gridRoot.style.width = '100%'
                gridRoot.style.height = '100%'
              }
              // 使用 nextTick 确保 Vue 组件已经渲染后再设置
              nextTick(() => {
                const gridRootAsync = childElement.querySelector('.vue-grid') as HTMLElement
                if (gridRootAsync) {
                  gridRootAsync.style.width = '100%'
                  gridRootAsync.style.height = '100%'
                }
              })
            }
            
            // 添加选中和拖拽功能
            wrapper.addEventListener('click', (e) => {
              e.stopPropagation()
              selectDialogChild(childInstance.instance, widgetId) // 复用 Dialog 的选中逻辑
            })
            
            wrapper.addEventListener('mousedown', (e) => {
              e.stopPropagation()
              startDragDialogChild(childInstance.instance, wrapper, e)
            })
            
            widgetBody.appendChild(wrapper)
            
            // 存储映射关系（复用 dialogChildren）
            dialogChildren.value.set(childInstance.instance, {
              instance: childInstance.instance,
              wrapper: wrapper,
              dialogId: widgetId,
              position: isGrid ? { x: 0, y: 0 } : { x, y }
            })
            
            // 更新代码
            updateCode()
            // 重要：处理完成后，清除 draggedComponent 防止重复处理
            draggedComponent.value = null
            return
          }
        }
      }
    }
    
    // 检查是否放置到对话框内容区域
    // 优先检查 currentTarget（绑定了事件监听器的元素）
    let dialogBody = (event.currentTarget as Element).classList.contains('dialog-content-area') 
      ? (event.currentTarget as Element)
      : null
    
    // 如果没有，再检查 target 的最近父元素
    if (!dialogBody) {
      dialogBody = (event.target as Element).closest('.dialog-content-area')
    }
    if (dialogBody) {
      // 放置到对话框内部
      // 找到父对话框
      const dialogElement = dialogBody.closest('.dialog-window')
      const dialogId = dialogElement?.getAttribute('data-id')
      
      if (!dialogId) return
      
      // 找到对话框对应的 CanvasComponent
      const dialogComp = canvasComponents.value.find(c => c.id === dialogId && c.type === 'dialog')
      if (!dialogComp || !dialogComp.dialogInstance) {
        console.warn('未找到对话框实例:', dialogId)
        return
      }
      
      // 创建子组件实例
      const childInstance = await createChildComponentInstance(draggedComponent.value)
      if (!childInstance) return
      
      // 使用对话框实例的 addChild 方法添加子组件（建立父子关系）
      dialogComp.dialogInstance.addChild(childInstance.instance)
      
      // 获取子组件渲染后的元素
      const childElement = childInstance.instance.getElement()
      if (!childElement) {
        console.warn('子组件元素未找到')
        return
      }
      
      // 检查是否是 Grid，如果是则填充整个 Dialog 内容区域
      const isGrid = draggedComponent.value.type === 'grid'
      
      // 计算放置位置
      const rect = (dialogBody as HTMLElement).getBoundingClientRect()
      const x = event.clientX - rect.left - 20
      const y = event.clientY - rect.top - 20
      
      // 在可视化编辑器中，直接将子组件元素追加到对话框内容区域以便显示
      // 创建一个包装器以保持位置样式，并添加可选中、可拖拽的功能
      const wrapper = document.createElement('div')
      wrapper.className = 'dialog-child-component'
      
      if (isGrid) {
        // Grid 自适应填充 Dialog 内容区域
        wrapper.style.cssText = `
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          cursor: move;
          user-select: none;
          border: 2px solid transparent;
          border-radius: 4px;
          transition: border-color 0.2s;
        `
      } else {
        wrapper.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          cursor: move;
          user-select: none;
          border: 2px solid transparent;
          border-radius: 4px;
          transition: border-color 0.2s;
        `
      }
      
      wrapper.setAttribute('data-dialog-child', 'true')
      wrapper.appendChild(childElement)
      
      // 如果是 Grid，设置 Grid 元素填充 wrapper
      if (isGrid && childElement instanceof HTMLElement) {
        // 查找 Grid 的根元素（.vue-grid）
        const gridRoot = childElement.querySelector('.qt-grid-layout, .vue-grid') || childElement
        if (gridRoot instanceof HTMLElement) {
          gridRoot.style.width = '100%'
          gridRoot.style.height = '100%'
        }
        // 确保 wrapper 内的元素填充
        childElement.style.width = '100%'
        childElement.style.height = '100%'
      }
      
      // 添加选中状态的样式类（通过点击事件处理）
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation()
        selectDialogChild(childInstance.instance, dialogId)
      })
      
      // 添加拖拽功能
      wrapper.addEventListener('mousedown', (e) => {
        e.stopPropagation()
        startDragDialogChild(childInstance.instance, wrapper, e)
      })
      
      ;(dialogBody as HTMLElement).appendChild(wrapper)
      
      // 存储映射关系
      dialogChildren.value.set(childInstance.instance, {
        instance: childInstance.instance,
        wrapper: wrapper,
        dialogId: dialogId,
        position: isGrid ? { x: 0, y: 0 } : { x, y }
      })
      
      // 移除占位符（如果存在）
      const placeholder = (dialogBody as HTMLElement).querySelector('.dialog-placeholder')
      if (placeholder) {
        placeholder.remove()
      }
      // 清除 draggedComponent 防止重复处理
      draggedComponent.value = null
    } else {
      // 放置到画布上
      const canvasWrapper = document.querySelector('.canvas-content-wrapper')
      if (!canvasWrapper) return
      
      const rect = (canvasWrapper as HTMLElement).getBoundingClientRect()
      let x = event.clientX - rect.left - 40
      let y = event.clientY - rect.top - 20
      
      // 限制在画布范围内（全屏画布）
      const maxX = 9999
      const maxY = 9999
      x = Math.max(0, Math.min(x, maxX))
      y = Math.max(0, Math.min(y, maxY))

      // 创建组件
      const comp = await createComponent(draggedComponent.value, x, y)
      
      // 添加到画布
      canvasComponents.value.push(comp)
      
      // 选中新组件
      await nextTick()
      selectComponent(comp)
    }
    
    draggedComponent.value = null
    updateCode()
  }

  /**
   * 画布组件拖拽开始
   */
  const startDrag = (comp: CanvasComponent, event: MouseEvent) => {
    draggedElement.value = comp
    selectComponent(comp)
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    dragOffset.x = event.clientX - rect.left
    dragOffset.y = event.clientY - rect.top
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    event.preventDefault()
  }

  /**
   * 画布组件拖拽移动
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!draggedElement.value) return
    
    const canvasWrapper = document.querySelector('.canvas-content-wrapper') as HTMLElement
    if (!canvasWrapper) return
    
    const rect = canvasWrapper.getBoundingClientRect()
    let x = event.clientX - rect.left - dragOffset.x
    let y = event.clientY - rect.top - dragOffset.y
    
    x = Math.max(0, x)
    y = Math.max(0, y)
    
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    
    rafId = requestAnimationFrame(() => {
      if (!draggedElement.value) return
      
      draggedElement.value.style.left = x + 'px'
      draggedElement.value.style.top = y + 'px'
      
      const index = canvasComponents.value.findIndex(c => c.id === draggedElement.value!.id)
      if (index >= 0) {
        canvasComponents.value[index].style.left = x + 'px'
        canvasComponents.value[index].style.top = y + 'px'
      }
    })
  }

  /**
   * 画布组件拖拽结束
   */
  const handleMouseUp = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    
    updateCode()
    draggedElement.value = null
    draggedDialogChild.value = null
    draggedLayoutChild.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mousemove', handleDialogChildMouseMove)
    document.removeEventListener('mousemove', handleLayoutChildMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mouseup', handleDialogChildMouseUp)
    document.removeEventListener('mouseup', handleLayoutChildMouseUp)
  }

  /**
   * 对话框子组件拖拽开始
   */
  const startDragDialogChild = (instance: any, wrapper: HTMLElement, event: MouseEvent) => {
    const childInfo = dialogChildren.value.get(instance)
    if (!childInfo) return
    
    selectedDialogChild.value = instance
    clearDialogChildSelection()
    wrapper.classList.add('selected')
    
    draggedDialogChild.value = {
      instance: instance,
      wrapper: wrapper,
      dialogId: childInfo.dialogId
    }
    
    const rect = wrapper.getBoundingClientRect()
    dialogChildDragOffset.x = event.clientX - rect.left
    dialogChildDragOffset.y = event.clientY - rect.top
    
    document.addEventListener('mousemove', handleDialogChildMouseMove)
    document.addEventListener('mouseup', handleDialogChildMouseUp)
    event.preventDefault()
    event.stopPropagation()
  }

  /**
   * 对话框子组件拖拽移动
   */
  const handleDialogChildMouseMove = (event: MouseEvent) => {
    if (!draggedDialogChild.value) return
    
    const childInfo = dialogChildren.value.get(draggedDialogChild.value.instance)
    if (!childInfo) return
    
    // 查找 Dialog 或 Widget 内容区域
    const dialogElement = document.querySelector(`.dialog-window[data-id="${draggedDialogChild.value.dialogId}"]`)
    
    let bodyDiv: HTMLElement | null = null
    
    if (dialogElement) {
      bodyDiv = dialogElement.querySelector('.dialog-content-area') as HTMLElement
    } else {
      const widgetContainer = document.querySelector(`[data-id="${draggedDialogChild.value.dialogId}"]`)
      if (widgetContainer) {
        bodyDiv = widgetContainer.querySelector('.widget-content') as HTMLElement
        if (!bodyDiv) {
          const widgetElement = widgetContainer.querySelector('.nhai-widget')
          if (widgetElement) {
            bodyDiv = widgetElement.querySelector('.widget-content') as HTMLElement
          }
        }
      }
    }
    
    if (!bodyDiv) return
    
    const rect = bodyDiv.getBoundingClientRect()
    
    let x = event.clientX - rect.left - dialogChildDragOffset.x
    let y = event.clientY - rect.top - dialogChildDragOffset.y
    
    x = Math.max(0, Math.min(x, rect.width - 50))
    y = Math.max(0, Math.min(y, rect.height - 30))
    
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    
    rafId = requestAnimationFrame(() => {
      if (!draggedDialogChild.value) return
      
      const info = dialogChildren.value.get(draggedDialogChild.value.instance)
      if (!info) return
      
      info.wrapper.style.left = x + 'px'
      info.wrapper.style.top = y + 'px'
      info.position = { x, y }
    })
  }

  /**
   * 对话框子组件拖拽结束
   */
  const handleDialogChildMouseUp = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    
    updateCode()
    draggedDialogChild.value = null
    document.removeEventListener('mousemove', handleDialogChildMouseMove)
    document.removeEventListener('mouseup', handleDialogChildMouseUp)
  }

  /**
   * 布局子组件拖拽开始
   */
  const startDragLayoutChild = (instance: any, element: HTMLElement, event: MouseEvent, layoutType: 'grid' | 'container') => {
    const childInfo = layoutChildren.value.get(instance)
    if (!childInfo) return
    
    selectedLayoutChild.value = instance
    clearLayoutChildSelection()
    childInfo.element.classList.add('selected')
    
    const rect = element.getBoundingClientRect()
    layoutChildDragOffset.x = event.clientX - rect.left
    layoutChildDragOffset.y = event.clientY - rect.top
    
    draggedLayoutChild.value = {
      instance: instance,
      element: element,
      layoutId: childInfo.layoutId,
      layoutType: layoutType
    }
    
    document.addEventListener('mousemove', handleLayoutChildMouseMove)
    document.addEventListener('mouseup', handleLayoutChildMouseUp)
    event.preventDefault()
    event.stopPropagation()
  }

  /**
   * 布局子组件拖拽移动
   */
  const handleLayoutChildMouseMove = (event: MouseEvent) => {
    if (!draggedLayoutChild.value) return
    
    // Grid 不支持通过拖拽改变位置
    if (draggedLayoutChild.value.layoutType === 'grid') {
      return
    }
    
    const childInfo = layoutChildren.value.get(draggedLayoutChild.value.instance)
    if (!childInfo) return
    
    const layoutElement = document.querySelector(`[data-id="${draggedLayoutChild.value.layoutId}"]`)
    if (!layoutElement) return
    
    // 这里只处理 container 类型（grid 已经在上面返回了）
    const layoutContainer = layoutElement.querySelector('.vue-container') as HTMLElement
    
    if (!layoutContainer) return
    
    const rect = layoutContainer.getBoundingClientRect()
    let x = event.clientX - rect.left - layoutChildDragOffset.x
    let y = event.clientY - rect.top - layoutChildDragOffset.y
    
    x = Math.max(0, Math.min(x, rect.width - 50))
    y = Math.max(0, Math.min(y, rect.height - 30))
    
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    
    rafId = requestAnimationFrame(() => {
      if (!draggedLayoutChild.value) return
      
      const info = layoutChildren.value.get(draggedLayoutChild.value.instance)
      if (!info) return
      
      info.element.style.position = 'relative'
      info.element.style.left = x + 'px'
      info.element.style.top = y + 'px'
    })
  }

  /**
   * 布局子组件拖拽结束
   */
  const handleLayoutChildMouseUp = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    
    updateCode()
    draggedLayoutChild.value = null
    document.removeEventListener('mousemove', handleLayoutChildMouseMove)
    document.removeEventListener('mouseup', handleLayoutChildMouseUp)
  }

  return {
    // 拖拽开始和放置
    draggedComponent,
    handleDragStart,
    handleDialogDragOver,
    handleDrop,
    // 画布组件拖拽
    draggedElement,
    startDrag,
    handleMouseMove,
    handleMouseUp,
    // 对话框子组件拖拽
    draggedDialogChild,
    startDragDialogChild,
    handleDialogChildMouseMove,
    handleDialogChildMouseUp,
    // 布局子组件拖拽
    draggedLayoutChild,
    startDragLayoutChild,
    handleLayoutChildMouseMove,
    handleLayoutChildMouseUp
  }
}
