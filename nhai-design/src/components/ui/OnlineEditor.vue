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
const code = ref(props.initialCode || `// NHAI 组件测试
console.log('开始创建组件...')

// 1. 使用传统 NHAIObjectFactory 创建按钮
const button1 = NHAIObjectFactory.createButton('传统按钮')
button1.setVariant('primary')
button1.setOnClick(() => {
  console.log('传统按钮被点击了！')
  alert('传统按钮被点击了！')
})

// 2. 使用 ModernNHAIButton 创建按钮（现在可以与 NHAI 布局兼容）
const button2 = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '现代按钮',
  onClick: () => {
    console.log('现代按钮被点击了！')
    alert('现代按钮被点击了！')
  }
})

// 3. 创建一个容器来展示按钮
const container = NHAIObjectFactory.createVBoxLayout()
container.addChild(button1)
container.addChild(button2)  // ModernNHAIButton 现在可以添加到 NHAI 布局中

console.log('组件创建完成')
console.log('传统按钮:', button1)
console.log('现代按钮:', button2)
console.log('容器:', container)`)

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
      const ModernNHAIButton = (typeof window !== 'undefined' && window.ModernNHAIButton) || (typeof globalThis !== 'undefined' && globalThis.ModernNHAIButton)
      const document = (typeof window !== 'undefined' && window.document) || (typeof globalThis !== 'undefined' && globalThis.document)
      const console = (typeof window !== 'undefined' && window.console) || (typeof globalThis !== 'undefined' && globalThis.console)
      
      console.log('执行环境准备完成')
      console.log('NHAIObjectFactory:', NHAIObjectFactory)
      console.log('ModernNHAIButton:', ModernNHAIButton)
      console.log('document:', document)
      
      // 检查 NHAIObjectFactory 是否可用
      if (!NHAIObjectFactory) {
        throw new Error('NHAIObjectFactory 不可用，请确保框架已正确加载')
      }
      
      // 虚拟DOM转真实DOM的辅助函数
      function createElementFromVDOM(vdom) {
        if (typeof vdom === 'string' || typeof vdom === 'number') {
          return document.createTextNode(String(vdom))
        }
        
        if (!vdom || typeof vdom !== 'object' || !vdom.tag) {
          return document.createTextNode('')
        }
        
        const element = document.createElement(vdom.tag)
        
        // 设置属性
        if (vdom.props) {
          for (const [key, value] of Object.entries(vdom.props)) {
            if (key === 'className') {
              element.className = value
            } else if (key === 'style' && typeof value === 'object') {
              Object.assign(element.style, value)
            } else if (key.startsWith('on') && typeof value === 'function') {
              const eventName = key.slice(2).toLowerCase()
              element.addEventListener(eventName, value)
            } else if (value !== undefined && value !== null) {
              element.setAttribute(key, value)
            }
          }
        }
        
        // 处理子元素
        if (vdom.children) {
          if (Array.isArray(vdom.children)) {
            vdom.children.forEach(child => {
              element.appendChild(createElementFromVDOM(child))
            })
          } else {
            element.appendChild(createElementFromVDOM(vdom.children))
          }
        }
        
        return element
      }
      
      // ModernNHAIButton 包装器，使其与 NHAI 布局系统兼容
      function createModernButtonWrapper(modernButton) {
        return {
          render: function() {
            try {
              // 直接调用原始 ModernNHAIButton 的 render 方法，而不是包装器的
              const vdom = modernButton.render()
              console.log('ModernNHAIButton 渲染结果:', vdom)
              
              // 直接在这里实现虚拟DOM到真实DOM的转换
              if (typeof vdom === 'string' || typeof vdom === 'number') {
                return document.createTextNode(String(vdom))
              }
              
              if (!vdom || typeof vdom !== 'object' || !vdom.tag) {
                console.warn('ModernNHAIButton 返回了无效的虚拟DOM:', vdom)
                return document.createTextNode('')
              }
              
              const element = document.createElement(vdom.tag)
              
              // 设置属性
              if (vdom.props) {
                for (const [key, value] of Object.entries(vdom.props)) {
                  if (key === 'className') {
                    element.className = value
                  } else if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value)
                  } else if (key.startsWith('on') && typeof value === 'function') {
                    const eventName = key.slice(2).toLowerCase()
                    element.addEventListener(eventName, value)
                  } else if (key !== 'children') {
                    element.setAttribute(key, value)
                  }
                }
              }
              
              // 处理子元素
              if (vdom.children) {
                if (Array.isArray(vdom.children)) {
                  vdom.children.forEach(child => {
                    if (typeof child === 'string' || typeof child === 'number') {
                      element.appendChild(document.createTextNode(String(child)))
                    } else if (child && typeof child === 'object' && child.tag) {
                      // 递归处理子元素
                      const childElement = createElementFromVDOM(child)
                      if (childElement) {
                        element.appendChild(childElement)
                      }
                    }
                  })
                } else if (typeof vdom.children === 'string' || typeof vdom.children === 'number') {
                  element.textContent = String(vdom.children)
                }
              }
              
              console.log('ModernNHAIButton 创建的DOM元素:', element)
              return element
            } catch (error) {
              console.error('ModernNHAIButton 渲染失败:', error)
              return document.createTextNode('渲染失败')
            }
          },
          _children: [],
          addChild: function() {
            // ModernNHAIButton 不支持子元素
            console.warn('ModernNHAIButton 不支持添加子元素')
          },
          removeChild: function() {
            console.warn('ModernNHAIButton 不支持移除子元素')
          }
        }
      }
      
      // 重写 ModernNHAIButton 构造函数，使其返回包装器
      const OriginalModernNHAIButton = ModernNHAIButton
      window.ModernNHAIButton = function(props) {
        const modernButton = new OriginalModernNHAIButton(props)
        return createModernButtonWrapper(modernButton)
      }
      
      // 复制原始构造函数的静态属性
      Object.setPrototypeOf(window.ModernNHAIButton, OriginalModernNHAIButton)
      Object.assign(window.ModernNHAIButton, OriginalModernNHAIButton)
      
      // 创建一个全局的 ModernNHAIButton 实例，用于处理直接调用的情况
      window.ModernNHAIButtonInstance = new OriginalModernNHAIButton({
        type: 'default',
        children: 'Default Button'
      })
      
      // 不重写 ModernNHAIButton 的 render 方法，保持原始行为
      
      // 创建一个全局的 ModernNHAIButton 包装器，用于处理所有可能的调用
      window.ModernNHAIButtonWrapper = function(button) {
        return createModernButtonWrapper(button)
      }
      
      // 重写 NHAI 布局系统的 render 方法，添加 ModernNHAIButton 兼容性
      function patchNHAILayouts() {
        try {
          // 尝试从不同的地方获取 NHAI 布局类
          let NHAIVBoxLayout = null
          let NHAIHBoxLayout = null
          
          // 方法1: 从 window 对象获取
          if (typeof window !== 'undefined') {
            NHAIVBoxLayout = window.NHAIVBoxLayout
            NHAIHBoxLayout = window.NHAIHBoxLayout
          }
          
          // 方法2: 从全局作用域获取
          if (!NHAIVBoxLayout) {
            try {
              NHAIVBoxLayout = eval('NHAIVBoxLayout')
            } catch (e) {
              console.log('无法从全局作用域获取 NHAIVBoxLayout')
            }
          }
          
          if (!NHAIHBoxLayout) {
            try {
              NHAIHBoxLayout = eval('NHAIHBoxLayout')
            } catch (e) {
              console.log('无法从全局作用域获取 NHAIHBoxLayout')
            }
          }
          
          // 方法3: 从 NHAIObjectFactory 获取
          if (!NHAIVBoxLayout && NHAIObjectFactory) {
            try {
              const vbox = NHAIObjectFactory.createVBoxLayout()
              NHAIVBoxLayout = vbox.constructor
            } catch (e) {
              console.log('无法从 NHAIObjectFactory 获取 NHAIVBoxLayout')
            }
          }
          
          if (!NHAIHBoxLayout && NHAIObjectFactory) {
            try {
              const hbox = NHAIObjectFactory.createHBoxLayout()
              NHAIHBoxLayout = hbox.constructor
            } catch (e) {
              console.log('无法从 NHAIObjectFactory 获取 NHAIHBoxLayout')
            }
          }
          
          console.log('NHAIVBoxLayout:', NHAIVBoxLayout)
          console.log('NHAIHBoxLayout:', NHAIHBoxLayout)
          
          if (NHAIVBoxLayout && NHAIVBoxLayout.prototype) {
            const originalVBoxRender = NHAIVBoxLayout.prototype.render
            NHAIVBoxLayout.prototype.render = function(context) {
              // 修复子组件
              if (this._children) {
                this._children = this._children.map(child => {
                  console.log('VBoxLayout 检查子组件:', child, '类型:', child?.constructor?.name)
                  if (child && child.constructor && child.constructor.name === 'ModernNHAIButton') {
                    console.log('在 VBoxLayout 中发现 ModernNHAIButton，正在修复...')
                    return createModernButtonWrapper(child)
                  }
                  // 检查是否是虚拟DOM对象
                  if (child && typeof child === 'object' && child.tag && child.props) {
                    console.log('在 VBoxLayout 中发现虚拟DOM对象，正在修复...')
                    return createModernButtonWrapper({ render: () => child })
                  }
                  // 检查是否是文本节点
                  if (typeof child === 'string' || (child && child.constructor && child.constructor.name === 'Text')) {
                    console.log('在 VBoxLayout 中发现文本节点，正在修复...')
                    return {
                      render: () => document.createTextNode(String(child)),
                      _children: [],
                      addChild: () => {},
                      removeChild: () => {}
                    }
                  }
                  return child
                })
              }
              return originalVBoxRender.call(this, context)
            }
            console.log('NHAIVBoxLayout 已修补')
          }
          
          if (NHAIHBoxLayout && NHAIHBoxLayout.prototype) {
            const originalHBoxRender = NHAIHBoxLayout.prototype.render
            NHAIHBoxLayout.prototype.render = function(context) {
              // 修复子组件
              if (this._children) {
                this._children = this._children.map(child => {
                  console.log('HBoxLayout 检查子组件:', child, '类型:', child?.constructor?.name)
                  if (child && child.constructor && child.constructor.name === 'ModernNHAIButton') {
                    console.log('在 HBoxLayout 中发现 ModernNHAIButton，正在修复...')
                    return createModernButtonWrapper(child)
                  }
                  // 检查是否是虚拟DOM对象
                  if (child && typeof child === 'object' && child.tag && child.props) {
                    console.log('在 HBoxLayout 中发现虚拟DOM对象，正在修复...')
                    return createModernButtonWrapper({ render: () => child })
                  }
                  // 检查是否是文本节点
                  if (typeof child === 'string' || (child && child.constructor && child.constructor.name === 'Text')) {
                    console.log('在 HBoxLayout 中发现文本节点，正在修复...')
                    return {
                      render: () => document.createTextNode(String(child)),
                      _children: [],
                      addChild: () => {},
                      removeChild: () => {}
                    }
                  }
                  return child
                })
              }
              return originalHBoxRender.call(this, context)
            }
            console.log('NHAIHBoxLayout 已修补')
          }
          
          if (!NHAIVBoxLayout && !NHAIHBoxLayout) {
            console.warn('无法找到 NHAI 布局类，跳过修补')
          }
          
        } catch (error) {
          console.error('修补 NHAI 布局系统时出错:', error)
        }
      }
      
      // 执行补丁
      patchNHAILayouts()
      
      // 重写全局的 ModernNHAIButton 构造函数，确保所有实例都被包装
      const GlobalModernNHAIButton = window.ModernNHAIButton
      window.ModernNHAIButton = function(props) {
        const modernButton = new OriginalModernNHAIButton(props)
        return createModernButtonWrapper(modernButton)
      }
      
      // 复制所有静态属性和方法
      Object.setPrototypeOf(window.ModernNHAIButton, OriginalModernNHAIButton)
      Object.assign(window.ModernNHAIButton, OriginalModernNHAIButton)
      
      // 添加一个全局的组件修复函数，用于修复任何遗漏的 ModernNHAIButton 实例
      function fixModernButtonComponents(container) {
        if (!container || !container._children) return
        
        for (let i = 0; i < container._children.length; i++) {
          const child = container._children[i]
          
          // 检查是否是 ModernNHAIButton 实例但没有 render 方法
          if (child && 
              child.constructor && 
              child.constructor.name === 'ModernNHAIButton' && 
              typeof child.render !== 'function') {
            console.log('发现未包装的 ModernNHAIButton 实例，正在修复...')
            container._children[i] = createModernButtonWrapper(child)
          }
          
          // 递归检查子容器
          if (child && child._children) {
            fixModernButtonComponents(child)
          }
        }
      }
      
      // 执行用户代码
      try {
        console.log('开始执行用户代码...')
        ${code.value}
        console.log('用户代码执行完成')
        
        // 立即修复所有可能的 ModernNHAIButton 实例
        console.log('开始全局修复 ModernNHAIButton 实例...')
        
        // 遍历所有可能的变量名，查找并修复 ModernNHAIButton 实例
        const allPossibleVars = [
          'button', 'label', 'input', 'container', 'window', 'card', 'vbox', 'hbox', 'grid',
          'primaryButton', 'secondaryButton', 'successButton', 'warningButton', 'dangerButton',
          'smallButton', 'mediumButton', 'largeButton', 'normalButton', 'disabledButton', 'loadingButton',
          'textButton1', 'textButton2', 'textButton3', 'smallTextButton', 'mediumTextButton', 'largeTextButton',
          'linkButton1', 'linkButton2', 'linkButton3', 'smallLinkButton', 'largeLinkButton',
          'basicLabel', 'titleLabel', 'subtitleLabel', 'bodyLabel', 'captionLabel',
          'leftLabel', 'centerLabel', 'rightLabel',
          'basicInput', 'textInput', 'emailInput', 'passwordInput', 'numberInput',
          'normalInput', 'disabledInput', 'readonlyInput',
          'hbox1', 'hbox2', 'hbox3', 'vbox1', 'vbox2',
          'button1', 'button2', 'button3', 'modernButton', 'traditionalButton'
        ]
        
        for (const varName of allPossibleVars) {
          try {
            if (typeof eval(varName) !== 'undefined') {
              const obj = eval(varName)
              if (obj && obj.constructor && obj.constructor.name === 'ModernNHAIButton') {
                console.log(\`发现未包装的 ModernNHAIButton 实例: \${varName}\`)
                // 重新赋值包装后的实例
                eval(\`\${varName} = ModernNHAIButtonWrapper(\${varName})\`)
                console.log(\`\${varName} 已重新包装\`)
              }
            }
          } catch (e) {
            // 变量不存在，继续检查下一个
          }
        }
        
        console.log('全局修复完成')
        
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
            'hbox1', 'hbox2', 'hbox3', 'vbox1', 'vbox2',
            'button1', 'button2', 'button3', 'modernButton', 'traditionalButton'
          ]
          let renderedCount = 0
          let mainContainer = null
          let allComponents = []
          let virtualDOMObjects = []
          
          // 收集所有组件和虚拟DOM对象
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
                // 检查是否是虚拟DOM对象（ModernNHAIButton的render结果）
                else if (component && 
                         typeof component === 'object' && 
                         component.tag && 
                         component.props && 
                         typeof component.tag === 'string') {
                  virtualDOMObjects.push({ name: varName, vdom: component })
                  console.log(\`\${varName} 是虚拟DOM对象:\`, component)
                }
                // 检查是否是 ModernNHAIButton 实例
                else if (component && 
                         component.constructor && 
                         component.constructor.name === 'ModernNHAIButton') {
                  // 将 ModernNHAIButton 实例包装为兼容的组件
                  const wrappedComponent = createModernButtonWrapper(component)
                  allComponents.push({ name: varName, component: wrappedComponent })
                  console.log(\`\${varName} 是 ModernNHAIButton 实例，已包装\`)
                }
              }
            } catch (e) {
              // 变量不存在，继续检查下一个
            }
          }
          
          console.log(\`找到 \${allComponents.length} 个 NHAI 组件\`)
          console.log(\`找到 \${virtualDOMObjects.length} 个虚拟DOM对象\`)
          
          // 修复所有容器中的 ModernNHAIButton 实例
          console.log('开始修复容器中的 ModernNHAIButton 实例...')
          for (const comp of allComponents) {
            if (comp.component && comp.component._children) {
              fixModernButtonComponents(comp.component)
            }
          }
          console.log('ModernNHAIButton 实例修复完成')
          
          // 处理虚拟DOM对象
          if (virtualDOMObjects.length > 0) {
            console.log('开始处理虚拟DOM对象...')
            
            // 创建一个简单的容器来放置虚拟DOM对象
            const container = document.createElement('div')
            container.style.cssText = 'display: flex; flex-direction: column; gap: 10px; padding: 20px;'
            
            for (const vdomObj of virtualDOMObjects) {
              try {
                const element = createElementFromVDOM(vdomObj.vdom)
                container.appendChild(element)
                console.log(\`虚拟DOM对象 \${vdomObj.name} 已渲染\`)
                renderedCount++
              } catch (error) {
                console.error(\`渲染虚拟DOM对象 \${vdomObj.name} 失败:\`, error)
              }
            }
            
            previewArea.appendChild(container)
            console.log('虚拟DOM对象容器已添加到预览区域')
          }
          
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
            try {
              console.log('开始渲染主容器:', mainContainer)
              console.log('主容器类型:', mainContainer.constructor.name)
              console.log('主容器子元素:', mainContainer._children)
              
              const element = mainContainer.render()
              console.log('主容器渲染结果:', element)
              console.log('渲染结果类型:', element?.constructor?.name)
              console.log('渲染结果是否为DOM元素:', element instanceof Element)
              
              if (element && element instanceof Element) {
                previewArea.appendChild(element)
                renderedCount++
                console.log(\`主容器已渲染到预览区域\`)
                
                // 检查渲染的元素内容
                console.log('渲染元素内容:', element.innerHTML)
                console.log('渲染元素子元素数量:', element.children.length)
                console.log('渲染元素样式:', element.style.cssText)
                console.log('预览区域内容:', previewArea.innerHTML)
                console.log('预览区域子元素数量:', previewArea.children.length)
                
                // 检查主容器的子元素数量
                if (mainContainer._children) {
                  console.log(\`主容器包含 \${mainContainer._children.length} 个子元素\`)
                }
              } else {
                console.error('主容器渲染结果不是有效的DOM元素:', element)
                throw new Error('主容器渲染结果不是有效的DOM元素')
              }
            } catch (error) {
              console.error('渲染主容器时出错:', error)
              // 如果主容器渲染失败，尝试单独渲染其他组件
              for (const comp of allComponents) {
                if (comp.component !== mainContainer) {
                  try {
                    console.log('尝试单独渲染组件:', comp.name)
                    const element = comp.component.render()
                    console.log('组件渲染结果:', element)
                    if (element && element instanceof Element) {
                      previewArea.appendChild(element)
                      renderedCount++
                      console.log(\`\${comp.name} 已单独渲染到预览区域\`)
                    } else {
                      console.error(\`组件 \${comp.name} 渲染结果不是有效的DOM元素:\`, element)
                    }
                  } catch (compError) {
                    console.error(\`渲染组件 \${comp.name} 失败:\`, compError)
                  }
                }
              }
            }
          } else if (allComponents.length > 0) {
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
              try {
                const element = layout.component.render()
                previewArea.appendChild(element)
                renderedCount++
              } catch (error) {
                console.error(\`渲染布局组件 \${layout.name} 失败:\`, error)
                // 如果布局组件渲染失败，尝试单独渲染其他组件
                for (const comp of allComponents) {
                  if (comp.component !== layout.component) {
                    try {
                      const element = comp.component.render()
                      previewArea.appendChild(element)
                      renderedCount++
                      console.log(\`\${comp.name} 已单独渲染到预览区域\`)
                    } catch (compError) {
                      console.error(\`渲染组件 \${comp.name} 失败:\`, compError)
                    }
                  }
                }
              }
            } else {
              // 如果没有布局组件，尝试渲染单个组件
              for (const comp of allComponents) {
                try {
                  const element = comp.component.render()
                  previewArea.appendChild(element)
                  renderedCount++
                  console.log(\`\${comp.name} 已自动渲染到预览区域\`)
                } catch (error) {
                  console.error(\`渲染组件 \${comp.name} 失败:\`, error)
                }
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
