<template>
  <div class="online-editor">
    <div class="editor-header">
      <h3>NHAI 在线编辑器</h3>
      <button @click="runCode" class="run-button" :disabled="isRunning">
        {{ isRunning ? '运行中...' : '运行代码' }}
      </button>
    </div>
    
    <div class="editor-content">
      <div class="code-panel">
        <textarea 
          v-model="code" 
          placeholder="在这里输入 NHAI 组件代码..."
          class="code-textarea"
        ></textarea>
      </div>
      
      <div class="preview-panel" :class="{ 'fullscreen': isFullscreen }">
        <div class="preview-header">
          <h4>实时预览</h4>
          <div class="preview-controls">
            <button @click="toggleFullscreen" class="fullscreen-button">
              {{ isFullscreen ? '退出全屏' : '全屏预览' }}
            </button>
            <button @click="clearPreview" class="clear-button">清空</button>
          </div>
        </div>
        <div ref="previewContainer" class="preview-container"></div>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Props
interface Props {
  initialCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialCode: ''
})

// 响应式数据
const code = ref(props.initialCode || `// 简单按钮测试
console.log('开始创建按钮...')

// 创建按钮
const button = NHAIObjectFactory.createButton('点击我')
console.log('按钮创建完成:', button)

button.setVariant('primary')
console.log('设置按钮样式完成')

button.setOnClick(() => {
  console.log('按钮被点击了！')
  alert('按钮被点击了！')
})
console.log('设置点击事件完成')

console.log('按钮测试完成')`)

const previewContainer = ref<HTMLElement>()
const isRunning = ref(false)
const error = ref('')
const isFullscreen = ref(false)

// 运行代码
const runCode = async () => {
  console.log('开始运行代码...')
  console.log('代码内容:', code.value.substring(0, 100) + '...')
  
  if (!code.value.trim()) {
    console.log('代码为空，跳过执行')
    return
  }
  
  isRunning.value = true
  error.value = ''
  
  try {
    // 清空预览区域
    if (previewContainer.value) {
      previewContainer.value.innerHTML = ''
      console.log('预览区域已清空')
    }
    
    // 检查 NHAIObjectFactory 是否可用
    const nhaiFactory = (window as any)?.NHAIObjectFactory || (globalThis as any)?.NHAIObjectFactory
    if (!nhaiFactory) {
      throw new Error('NHAIObjectFactory 不可用，请确保框架已正确加载')
    }
    console.log('NHAIObjectFactory 可用:', nhaiFactory)
    
    // 创建执行函数
    const executeCode = new Function(`
      // 确保必要的变量可用
      const NHAIObjectFactory = (typeof window !== 'undefined' && window.NHAIObjectFactory) || (typeof globalThis !== 'undefined' && globalThis.NHAIObjectFactory)
      const document = (typeof window !== 'undefined' && window.document) || (typeof globalThis !== 'undefined' && globalThis.document)
      const console = (typeof window !== 'undefined' && window.console) || (typeof globalThis !== 'undefined' && globalThis.console)
      
      console.log('执行环境准备完成')
      console.log('NHAIObjectFactory:', NHAIObjectFactory)
      console.log('document:', document)
      
      // 检查 NHAIObjectFactory 是否可用
      if (!NHAIObjectFactory) {
        throw new Error('NHAIObjectFactory 不可用，请确保框架已正确加载')
      }
      
      // 执行用户代码
      try {
        console.log('开始执行用户代码...')
        ${code.value}
        console.log('用户代码执行完成')
        
        // 检查是否有创建的组件需要渲染
        console.log('检查是否有组件需要渲染...')
        
        // 自动检测和渲染组件
        const previewArea = document.querySelector('.preview-container')
        if (previewArea) {
          console.log('找到预览区域:', previewArea)
          console.log('预览区域当前子元素数量:', previewArea.children.length)
          
          // 自动检测创建的组件并渲染
          console.log('开始自动检测组件...')
          
          // 检查常见的组件变量名
          const componentVars = [
            'button', 'label', 'input', 'container', 'window', 'card', 'vbox', 'hbox', 'grid',
            'primaryButton', 'secondaryButton', 'successButton', 'warningButton', 'dangerButton',
            'smallButton', 'mediumButton', 'largeButton', 'normalButton', 'disabledButton', 'loadingButton',
            'textButton1', 'textButton2', 'textButton3', 'smallTextButton', 'mediumTextButton', 'largeTextButton',
            'linkButton1', 'linkButton2', 'linkButton3', 'smallLinkButton', 'largeLinkButton',
            'basicLabel', 'titleLabel', 'subtitleLabel', 'bodyLabel', 'captionLabel',
            'leftLabel', 'centerLabel', 'rightLabel',
            'basicInput', 'textInput', 'emailInput', 'passwordInput', 'numberInput',
            'normalInput', 'disabledInput', 'readonlyInput',
            'hbox1', 'hbox2', 'hbox3', 'vbox1', 'vbox2'
          ]
          let renderedCount = 0
          let mainContainer = null
          let allComponents = []
          
          // 收集所有 NHAI 组件
          for (const varName of componentVars) {
            try {
              if (typeof eval(varName) !== 'undefined') {
                const component = eval(varName)
                console.log(\`找到组件 \${varName}:\`, component)
                
                // 检查是否是 NHAI 组件
                if (component && 
                    typeof component.render === 'function' && 
                    component.constructor && 
                    component.constructor.name && 
                    component.constructor.name.startsWith('NHAI')) {
                  allComponents.push({ name: varName, component: component })
                  console.log(\`\${varName} 是有效的 NHAI 组件\`)
                  
                  // 如果是容器组件，显示子元素数量
                  if (component._children) {
                    console.log(\`\${varName} 有 \${component._children.length} 个子元素\`)
                  }
                }
              }
            } catch (e) {
              // 变量不存在，继续检查下一个
            }
          }
          
          console.log(\`找到 \${allComponents.length} 个 NHAI 组件\`)
          
          // 查找主容器（优先级：container > window > card > vbox > hbox）
          const containerPriority = ['container', 'window', 'card', 'vbox', 'hbox']
          for (const containerName of containerPriority) {
            const found = allComponents.find(c => c.name === containerName)
            if (found) {
              mainContainer = found.component
              console.log(\`使用 \${found.name} 作为主容器\`)
              break
            }
          }
          
          // 如果找到主容器，直接渲染它
          if (mainContainer) {
            const element = mainContainer.render()
            previewArea.appendChild(element)
            renderedCount++
            console.log(\`主容器已渲染到预览区域\`)
            
            // 检查主容器的子元素数量
            if (mainContainer._children) {
              console.log(\`主容器包含 \${mainContainer._children.length} 个子元素\`)
            }
          } else {
            // 如果没有找到容器，尝试自动构建布局
            console.log('没有找到主容器，尝试自动构建布局...')
            
            // 查找所有布局组件
            const layoutComponents = allComponents.filter(c => 
              c.name.includes('vbox') || c.name.includes('hbox') || c.name.includes('container')
            )
            
            if (layoutComponents.length > 0) {
              // 使用第一个布局组件作为主容器
              const layout = layoutComponents[0]
              console.log(\`使用 \${layout.name} 作为布局容器\`)
              const element = layout.component.render()
              previewArea.appendChild(element)
              renderedCount++
            } else {
              // 如果没有布局组件，尝试渲染单个组件
              for (const comp of allComponents) {
                const element = comp.component.render()
                previewArea.appendChild(element)
                renderedCount++
                console.log(\`\${comp.name} 已自动渲染到预览区域\`)
              }
            }
          }
          
          // 如果仍然没有渲染任何内容，尝试查找所有可能的 NHAI 组件
          if (renderedCount === 0) {
            console.log('尝试查找所有可能的 NHAI 组件...')
            
            // 获取当前作用域中的所有变量
            const scopeVars = Object.keys(window).concat(Object.keys(globalThis))
            for (const varName of scopeVars) {
              try {
                if (typeof eval(varName) !== 'undefined') {
                  const component = eval(varName)
                  
                  // 检查是否是 NHAI 组件
                  if (component && 
                      typeof component.render === 'function' && 
                      component.constructor && 
                      component.constructor.name && 
                      component.constructor.name.startsWith('NHAI')) {
                    console.log(\`找到 NHAI 组件 \${varName}:\`, component)
                    const element = component.render()
                    previewArea.appendChild(element)
                    renderedCount++
                    console.log(\`\${varName} 已渲染到预览区域\`)
                  }
                }
              } catch (e) {
                // 忽略错误，继续检查下一个
              }
            }
          }
          
          console.log(\`自动渲染完成，共渲染了 \${renderedCount} 个组件\`)
        } else {
          console.error('预览区域未找到')
        }
      } catch (userError) {
        console.error('用户代码执行错误:', userError)
        throw userError
      }
    `)
    
    console.log('执行函数创建完成')
    
    // 执行代码
    executeCode()
    console.log('代码执行完成')
    
  } catch (err) {
    console.error('代码执行失败:', err)
    error.value = err instanceof Error ? err.message : '代码执行失败'
  } finally {
    isRunning.value = false
    console.log('代码执行结束')
  }
}

// 清空预览
const clearPreview = () => {
  if (previewContainer.value) {
    previewContainer.value.innerHTML = ''
  }
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

// 组件挂载时检查 NHAIObjectFactory
onMounted(() => {
  // 延迟检查，确保 window 对象完全初始化
  setTimeout(() => {
    const nhaiFactory = (window as any)?.NHAIObjectFactory || (globalThis as any)?.NHAIObjectFactory
    if (!nhaiFactory) {
      error.value = 'NHAIObjectFactory 未初始化，请刷新页面重试'
    }
  }, 100)
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
})

// 监听 initialCode 变化
watch(() => props.initialCode, (newCode) => {
  if (newCode && newCode !== code.value) {
    code.value = newCode
    console.log('代码已更新:', newCode.substring(0, 100) + '...')
  }
}, { immediate: true })

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.online-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.editor-header h3 {
  margin: 0;
  color: #333;
}

.run-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.run-button:hover:not(:disabled) {
  background: #0056b3;
}

.run-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.editor-content {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
}

.code-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.code-textarea {
  width: 100%;
  height: 100%;
  border: none;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  background: #fafafa;
}

.preview-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.preview-panel.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  box-shadow: none;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.preview-header h4 {
  margin: 0;
  color: #333;
}

.preview-controls {
  display: flex;
  gap: 8px;
}

.fullscreen-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.fullscreen-button:hover {
  background: #218838;
}

.clear-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.clear-button:hover {
  background: #c82333;
}

.preview-container {
  padding: 16px;
  min-height: 200px;
  background: white;
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.preview-panel.fullscreen .preview-container {
  height: calc(100vh - 80px);
  padding: 32px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-top: 1px solid #f5c6cb;
  font-size: 14px;
}
</style>
