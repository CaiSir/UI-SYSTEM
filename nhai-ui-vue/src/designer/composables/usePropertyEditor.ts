// 属性编辑器 Composable
import { nextTick } from 'vue'
import type { CanvasComponent } from '../types/designer'
import type { Ref } from 'vue'

// 辅助函数：恢复子控件到 Grid 容器
function restoreChildrenToGrid(
  actualGridContainer: HTMLElement,
  savedChildMappings: Array<{ child: any, wrapper: HTMLElement }>,
  gridInstance: any,
  compId: string,
  _compType: string,
  layoutChildren: Ref<Map<any, any>>
) {
  gridInstance.contentContainer = actualGridContainer
  
  if (savedChildMappings.length > 0) {
    gridInstance.childElements.clear()
    
    savedChildMappings.forEach(({ child, wrapper }) => {
      // 确保 wrapper 从旧位置移除
      if (wrapper.parentNode && wrapper.parentNode !== actualGridContainer) {
        wrapper.parentNode.removeChild(wrapper)
      }
      // 添加到新的 Grid 容器
      if (!actualGridContainer.contains(wrapper)) {
        actualGridContainer.appendChild(wrapper)
      }
      // 更新 gridInstance.childElements
      gridInstance.childElements.set(child, wrapper)
      
      // 同时更新 layoutChildren，确保映射关系正确
      const existingInfo = layoutChildren.value.get(child)
      if (existingInfo && existingInfo.layoutId === compId) {
        layoutChildren.value.set(child, {
          ...existingInfo,
          element: wrapper  // 更新 wrapper 引用
        })
      }
    })
    
    // 强制更新 layoutChildren 以触发响应式更新
    layoutChildren.value = new Map(layoutChildren.value)
  }
}

// 辅助函数：更新 Grid element
function updateGridElement(
  newElement: HTMLElement,
  _gridInstance: any,
  comp: any,
  savedChildMappings: Array<{ child: any, wrapper: HTMLElement }>,
  canvasComponents: Ref<any[]>,
  updateCode: () => void
) {
  // 更新 element，此时子控件已经在正确的位置了
  ;(comp.instance as any)._element = newElement
  ;(comp.instance as any)._mounted = true
  ;(comp.instance as any).didMount()
  comp.element = newElement
  
  const index = canvasComponents.value.findIndex(c => c.id === comp.id)
  if (index >= 0) {
    const renderKey = (comp._renderKey || 0) + 1
    comp._renderKey = renderKey
    canvasComponents.value[index] = { 
      ...canvasComponents.value[index], 
      element: newElement,
      _renderKey: renderKey
    }
    canvasComponents.value = [...canvasComponents.value]
    
    // 等待 DOM 更新，然后设置样式
    nextTick(() => {
      const canvasWrapper = document.querySelector(`[data-component-id="${comp.id}"]`)
      if (canvasWrapper) {
        const actualGridContainer = canvasWrapper.querySelector('.vue-grid') as HTMLElement
        if (actualGridContainer) {
          const gridAutoFlow = window.getComputedStyle(actualGridContainer).gridAutoFlow || ''
          const gridOuterElement = comp.element as HTMLElement
          
          // 不再强制设置宽度，让 Grid 根据内容自适应
          // 只设置最小尺寸确保可见
          if (!gridOuterElement.style.minWidth) {
            gridOuterElement.style.minWidth = '200px'
          }
          if (!gridOuterElement.style.minHeight) {
            gridOuterElement.style.minHeight = '100px'
          }
          
          if (gridAutoFlow.includes('column')) {
            // 垂直布局时，确保有足够高度
            const estimatedHeight = savedChildMappings.length * 100 + (savedChildMappings.length - 1) * 16 + 40
            const currentHeight = parseInt(window.getComputedStyle(actualGridContainer).height || '0')
            const minHeight = parseInt(window.getComputedStyle(actualGridContainer).minHeight || '0')
            if (currentHeight < estimatedHeight && minHeight < estimatedHeight) {
              actualGridContainer.style.minHeight = `${estimatedHeight}px`
            }
          }
        }
      }
      
      updateCode()
    })
  }
}

interface PropertyEditorDependencies {
  canvasComponents: Ref<CanvasComponent[]>
  dialogChildren: Ref<Map<any, any>>
  layoutChildren: Ref<Map<any, any>>
  selectedComponent: Ref<CanvasComponent | null>
  selectedDialogChild: Ref<any | null>
  selectedLayoutChild: Ref<any | null>
  getPropertyList: (type: string) => any[]
  updateCode: () => void
}

export function usePropertyEditor(deps: PropertyEditorDependencies) {
  const {
    canvasComponents,
    dialogChildren,
    layoutChildren,
    selectedComponent,
    selectedDialogChild,
    selectedLayoutChild,
    getPropertyList: _getPropertyList, // TODO: 会在后续功能中使用
    updateCode
  } = deps

  /**
   * 获取组件属性值
   */
  const getPropValue = (comp: CanvasComponent, key: string) => {
    if (key === 'left' || key === 'top') {
      const styleValue = comp.style[key]
      return styleValue ? parseInt(styleValue) : 0
    }
    return comp.props[key] ?? ''
  }

  /**
   * 获取选中组件的属性值（支持对话框内控件和布局子控件）
   */
  const getSelectedPropValue = (key: string) => {
    // 优先检查对话框内控件
    if (selectedDialogChild.value) {
      const instance = selectedDialogChild.value
      const childInfo = dialogChildren.value.get(instance)
      
      if (key === 'left' || key === 'top') {
        return childInfo?.position?.[key] || 0
      }
      
      // 根据组件类型获取属性
      // TODO: 实现完整的属性获取逻辑（从原文件复制，约100行）
      return (instance as any)?.[key] ?? (instance as any)?._options?.[key] ?? ''
    }
    
    // 检查布局子控件
    if (selectedLayoutChild.value) {
      const instance = selectedLayoutChild.value
      const childInfo = layoutChildren.value.get(instance)
      
      if (key === 'left' || key === 'top') {
        return childInfo?.position?.[key] || 0
      }
      
      // TODO: 实现完整的属性获取逻辑
      return (instance as any)?.[key] ?? (instance as any)?._options?.[key] ?? ''
    }
    
    // 画布组件
    if (selectedComponent.value) {
      return getPropValue(selectedComponent.value, key)
    }
    
    return ''
  }

  /**
   * 更新对话框元素
   */
  const updateDialogElement = (comp: CanvasComponent, key: string, value: any) => {
    const header = comp.element.querySelector('.dialog-window-header')
    const body = comp.element.querySelector('.dialog-content-area') as HTMLElement
    const footer = comp.element.querySelector('.dialog-window-footer')
    
    if (key === 'title' && header) {
      const textNode = Array.from(header.childNodes).find(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = value
      } else {
        const nodes = Array.from(header.childNodes).filter(node => node.nodeType !== Node.ELEMENT_NODE || !(node as Element).classList.contains('dialog-window-close'))
        nodes.forEach(node => node.remove())
        header.insertBefore(document.createTextNode(value), header.firstChild)
      }
    } else if (key === 'width' && comp.element) {
      (comp.element as HTMLElement).style.width = value
    } else if (key === 'showFooter') {
      if (value && !footer && body) {
        const footerEl = document.createElement('div')
        footerEl.className = 'dialog-window-footer'
        footerEl.style.cssText = `
          padding: 12px 20px;
          border-top: 1px solid #ebeef5;
          background: #fafafa;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        `
        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = '取消'
        cancelBtn.style.cssText = 'padding: 8px 16px; border: 1px solid #dcdfe6; background: white; border-radius: 4px; cursor: pointer;'
        const confirmBtn = document.createElement('button')
        confirmBtn.textContent = '确定'
        confirmBtn.style.cssText = 'padding: 8px 16px; border: none; background: #409eff; color: white; border-radius: 4px; cursor: pointer;'
        footerEl.appendChild(cancelBtn)
        footerEl.appendChild(confirmBtn)
        comp.element.appendChild(footerEl)
      } else if (!value && footer) {
        footer.remove()
      }
    }
  }

  /**
   * 更新动态属性
   * 完整实现从 DesignerApp.vue 2279-2720行迁移
   */
  const updateDynamicProp = (key: string, value: any) => {
    if (!selectedComponent.value) return
    
    const comp = selectedComponent.value
    
    // 特殊处理：宽度和高度通过 setStyle 设置
    if (key === 'width' || key === 'height') {
      // 对于 Container 和 Grid，需要同时更新实例的样式和元素的样式
      if (comp.type === 'container' || comp.type === 'grid') {
        if (comp.instance && typeof (comp.instance as any).setStyle === 'function') {
          const currentStyle = (comp.instance as any).getProperty?.('style') || 
                              (comp.instance as any)?._props?.style || 
                              {}
          const newStyle = { ...currentStyle, [key]: value }
          ;(comp.instance as any).setStyle(newStyle as Partial<CSSStyleDeclaration>)
        }
        const element = comp.element as HTMLElement
        if (element && element.style) {
          const containerElement = element.querySelector('.vue-container') || 
                                   element.querySelector('.vue-grid') || 
                                   element
          if (containerElement && (containerElement as HTMLElement).style) {
            (containerElement as HTMLElement).style[key as any] = value
          }
          element.style[key as any] = value
        }
      } else {
        if (comp.instance && typeof (comp.instance as any).setStyle === 'function') {
          const currentStyle = (comp.instance as any).getProperty?.('style') || 
                              (comp.instance as any)?._props?.style || 
                              {}
          const newStyle = { ...currentStyle, [key]: value }
          ;(comp.instance as any).setStyle(newStyle as Partial<CSSStyleDeclaration>)
        } else {
          const element = comp.element as HTMLElement
          if (element && element.style) {
            element.style[key as any] = value
          }
        }
      }
      if (!comp.props.style) {
        comp.props.style = {}
      }
      comp.props.style[key] = value
      comp.style[key] = value
      canvasComponents.value = [...canvasComponents.value]
      updateCode()
      return
    }
    
    // 对于 Grid 和 Container，在调用 setter 之前先禁用自动更新
    if ((comp.type === 'grid' || comp.type === 'container') && comp.instance) {
      const wasMounted = (comp.instance as any)._mounted
      if (wasMounted) {
        (comp.instance as any)._mounted = false
        ;(comp.instance as any)._updateScheduled = false
      }
    }
    
    // 更新 instance - 优先尝试调用 setter 方法
    if (comp.instance) {
      // Grid 组件不支持这些属性，直接跳过 setter 调用
      if (comp.type === 'grid' && (key === 'direction' || key === 'justify' || key === 'wrap')) {
        // 这些属性不存在于 NhaiGridCommand，只更新 props，不调用 setter
        comp.props[key] = value
        canvasComponents.value = [...canvasComponents.value]
        updateCode()
        return
      }
      
      const setterMethod = 'set' + key.charAt(0).toUpperCase() + key.slice(1)
      if (typeof comp.instance[setterMethod] === 'function') {
        if ((comp.type === 'grid') && (key === 'columns' || key === 'rows')) {
          if (value && !isNaN(value) && !value.includes('repeat') && !value.includes('fr') && !value.includes('px') && !value.includes('%')) {
            comp.instance[setterMethod](parseInt(value, 10))
          } else {
            comp.instance[setterMethod](value)
          }
        } else {
          comp.instance[setterMethod](value)
        }
      } else if (typeof comp.instance[key] !== 'undefined') {
        comp.instance[key] = value
      }
    }
    
    // 更新 props
    comp.props[key] = value
    
    // Dialog、Widget、Grid、Container 特殊处理
    if (comp.type === 'dialog') {
      updateDialogElement(comp, key, value)
    } else if (comp.type === 'widget' && comp.instance) {
      if (key === 'width' || key === 'height') {
        if (typeof (comp.instance as any).setWidth === 'function' && key === 'width') {
          ;(comp.instance as any).setWidth(value)
        }
        if (typeof (comp.instance as any).setHeight === 'function' && key === 'height') {
          ;(comp.instance as any).setHeight(value)
        }
      } else if (key === 'title') {
        if (typeof (comp.instance as any).setTitle === 'function') {
          ;(comp.instance as any).setTitle(value)
        }
      } else if (key === 'fullscreen') {
        if (typeof (comp.instance as any).setFullscreen === 'function') {
          ;(comp.instance as any).setFullscreen(value)
        }
      } else if (key === 'menuBarVisible') {
        if (typeof (comp.instance as any).setMenuBarVisible === 'function') {
          ;(comp.instance as any).setMenuBarVisible(value)
        }
      }
      if (comp.instance && typeof (comp.instance as any).scheduleUpdate === 'function') {
        ;(comp.instance as any).scheduleUpdate()
      }
    } else if ((comp.type === 'grid' || comp.type === 'container') && comp.instance) {
      // Grid 和 Container 使用 Vue 组件，需要重新渲染才能正确更新
      if (comp.instance && typeof (comp.instance as any).unmount === 'function') {
        try {
          (comp.instance as any).unmount()
        } catch (e) {
          console.warn('卸载 Grid/Container 失败:', e)
        }
      }
      
      if (comp.instance && typeof (comp.instance as any).doRender === 'function') {
        try {
          const gridInstance = comp.instance as any
          const savedChildMappings: Array<{ child: any, wrapper: HTMLElement }> = []
          
          // 同时从 gridInstance.childElements 和 layoutChildren 中获取子组件映射
          // 因为子控件的 wrapper 可能存储在 layoutChildren 中
          if (gridInstance.childElements && gridInstance.childElements.size > 0) {
            gridInstance.childElements.forEach((wrapper: HTMLElement, child: any) => {
              if (wrapper && child) {
                if (wrapper.parentNode) {
                  wrapper.parentNode.removeChild(wrapper)
                }
                savedChildMappings.push({ child, wrapper })
              }
            })
          }
          
          // 也从 layoutChildren 中获取，确保不遗漏
          layoutChildren.value.forEach((info, childInstance) => {
            if (info.layoutId === comp.id && info.layoutType === comp.type) {
              // 检查是否已经在 savedChildMappings 中
              const exists = savedChildMappings.some(item => item.child === childInstance)
              if (!exists && info.element) {
                // 从父节点中移除，但保留 wrapper
                if (info.element.parentNode) {
                  info.element.parentNode.removeChild(info.element)
                }
                savedChildMappings.push({ child: childInstance, wrapper: info.element })
              }
            }
          })
          
          if ((comp.instance as any)._appInstance) {
            try {
              ;(comp.instance as any)._appInstance.unmount()
            } catch (e) {
              console.warn('卸载旧 Vue 应用失败:', e)
            }
          }
          
          const newElement = (comp.instance as any).doRender()
          
          // 关键：在更新 element 之前，必须先将子控件添加到新的 Grid 容器
          // 因为 v-html 会使用 outerHTML，如果子控件不在 element 内部，会被丢失
          // 使用 nextTick 确保 Vue 组件已经挂载，然后立即添加子控件
          nextTick(() => {
            // 同步查找，因为 Vue 组件应该已经挂载
            let actualGridContainer = newElement.querySelector('.vue-grid') as HTMLElement
            
            // 如果找不到，等待一下再尝试（Vue 组件可能需要更多时间渲染）
            if (!actualGridContainer) {
              setTimeout(() => {
                actualGridContainer = newElement.querySelector('.vue-grid') as HTMLElement
                if (actualGridContainer) {
                  restoreChildrenToGrid(actualGridContainer, savedChildMappings, gridInstance, comp.id, comp.type, layoutChildren)
                  // 子控件已添加，现在更新 element
                  updateGridElement(newElement, gridInstance, comp, savedChildMappings, canvasComponents, updateCode)
                } else {
                  // 如果还是找不到，直接更新 element，子控件会在后续通过 DOM 操作恢复
                  updateGridElement(newElement, gridInstance, comp, savedChildMappings, canvasComponents, updateCode)
                  // 尝试从 DOM 中找到并恢复子控件
                  nextTick(() => {
                    const canvasWrapper = document.querySelector(`[data-component-id="${comp.id}"]`)
                    if (canvasWrapper) {
                      const gridContainer = canvasWrapper.querySelector('.vue-grid') as HTMLElement
                      if (gridContainer) {
                        restoreChildrenToGrid(gridContainer, savedChildMappings, gridInstance, comp.id, comp.type, layoutChildren)
                      }
                    }
                  })
                }
              }, 100)
            } else {
              // 立即恢复子控件到新 element
              restoreChildrenToGrid(actualGridContainer, savedChildMappings, gridInstance, comp.id, comp.type, layoutChildren)
              // 子控件已添加，现在更新 element（此时子控件已经包含在 newElement.outerHTML 中了）
              updateGridElement(newElement, gridInstance, comp, savedChildMappings, canvasComponents, updateCode)
            }
          })
        } catch (e) {
          console.error('[DesignerApp.updateDynamicProp] doRender() 失败:', e)
        }
      }
    } else if (comp.instance && comp.instance.render) {
      const oldElement = comp.element
      if (oldElement && oldElement.parentNode && comp.instance.unmount) {
        try {
          comp.instance.unmount()
        } catch (e) {
          // 忽略卸载错误
        }
      }
      const newElement = comp.instance.render()
      comp.element = newElement
      
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.replaceChild(newElement, oldElement)
      }
    }
    
    canvasComponents.value = [...canvasComponents.value]
    updateCode()
  }

  /**
   * 更新选中组件的动态属性
   */
  const updateSelectedDynamicProp = (key: string, value: any) => {
    // 优先处理对话框内控件
    if (selectedDialogChild.value) {
      // TODO: 实现对话框子控件的属性更新
      updateCode()
      return
    }
    
    // 处理布局子控件
    if (selectedLayoutChild.value) {
      // TODO: 实现布局子控件的属性更新
      updateCode()
      return
    }
    
    // 处理画布组件
    if (selectedComponent.value) {
      updateDynamicProp(key, value)
    }
  }

  /**
   * 获取选中组件的位置 X
   */
  const getSelectedPositionX = (): number => {
    if (selectedDialogChild.value) {
      const childInfo = dialogChildren.value.get(selectedDialogChild.value)
      return childInfo?.position?.x || 0
    }
    if (selectedLayoutChild.value) {
      const childInfo = layoutChildren.value.get(selectedLayoutChild.value)
      return childInfo?.position?.x || 0
    }
    if (selectedComponent.value) {
      const left = selectedComponent.value.style.left
      return left ? parseInt(left) : 0
    }
    return 0
  }

  /**
   * 获取选中组件的位置 Y
   */
  const getSelectedPositionY = (): number => {
    if (selectedDialogChild.value) {
      const childInfo = dialogChildren.value.get(selectedDialogChild.value)
      return childInfo?.position?.y || 0
    }
    if (selectedLayoutChild.value) {
      const childInfo = layoutChildren.value.get(selectedLayoutChild.value)
      return childInfo?.position?.y || 0
    }
    if (selectedComponent.value) {
      const top = selectedComponent.value.style.top
      return top ? parseInt(top) : 0
    }
    return 0
  }

  /**
   * 更新选中组件的位置
   */
  const updateSelectedPosition = (direction: 'left' | 'top', value: string) => {
    const numValue = parseInt(value) || 0
    
    if (selectedDialogChild.value) {
      const childInfo = dialogChildren.value.get(selectedDialogChild.value)
      if (childInfo) {
        if (direction === 'left') {
          childInfo.wrapper.style.left = numValue + 'px'
          childInfo.position.x = numValue
        } else {
          childInfo.wrapper.style.top = numValue + 'px'
          childInfo.position.y = numValue
        }
        updateCode()
      }
      return
    }
    
    if (selectedLayoutChild.value) {
      // TODO: 实现布局子控件的位置更新
      updateCode()
      return
    }
    
    if (selectedComponent.value) {
      selectedComponent.value.style[direction] = numValue + 'px'
      updateCode()
    }
  }

  return {
    getPropValue,
    getSelectedPropValue,
    updateDynamicProp,
    updateSelectedDynamicProp,
    getSelectedPositionX,
    getSelectedPositionY,
    updateSelectedPosition,
    updateDialogElement // 已在上面定义（第82行）
  }
}

