<template>
  <div class="showcase-app">
    <!-- 顶部导航 -->
    <header class="showcase-header">
      <div class="header-left">
        <h1>NHAI UI Vue</h1>
        <span class="tagline">组件库展示系统</span>
      </div>
      <div class="header-right">
        <button class="btn-primary" @click="runCode">运行代码</button>
        <button class="btn-secondary" @click="resetCode">重置</button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="showcase-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 左侧组件树 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <h3 v-if="!sidebarCollapsed">组件列表</h3>
          <div class="sidebar-actions">
            <button v-if="!sidebarCollapsed" class="btn-toggle-expand" @click="toggleExpandAll" :title="isAllExpanded ? '全部收起' : '全部展开'">
              <el-icon>
                <ArrowUp v-if="isAllExpanded" />
                <ArrowDown v-else />
              </el-icon>
            </button>
            <button class="btn-toggle-sidebar" @click="toggleSidebar" :title="sidebarCollapsed ? '展开列表' : '收起列表'">
              <el-icon>
                <ArrowRight v-if="sidebarCollapsed" />
                <ArrowLeft v-else />
              </el-icon>
            </button>
          </div>
        </div>
        <div class="component-tree">
          <div 
            v-for="category in treeData" 
            :key="category.name"
            class="tree-category"
          >
            <div 
              class="category-header"
              @click="toggleCategory(category)"
            >
              <el-icon class="category-main-icon" :title="category.name">
                <component :is="getCategoryIcon(category.name)" />
              </el-icon>
              <el-icon v-if="!sidebarCollapsed" class="category-icon" :class="{ 'icon-expanded': category.expanded }">
                <ArrowRight />
              </el-icon>
              <span v-if="!sidebarCollapsed">{{ category.name }}</span>
            </div>
            
            <transition name="slide-fade">
              <div v-if="category.expanded && !sidebarCollapsed" class="category-items">
                <template v-for="item in category.children" :key="'id' in item ? item.id : item.name">
                  <!-- 子分类 -->
                  <div 
                    v-if="('type' in item && item.type === 'subcategory') || ('children' in item && !('id' in item))"
                    class="tree-subcategory"
                  >
                    <div 
                      class="subcategory-header"
                      @click.stop="toggleSubCategory(item)"
                    >
                      <el-icon class="subcategory-icon" :class="{ 'icon-expanded': 'expanded' in item && item.expanded }">
                        <ArrowRight />
                      </el-icon>
                      <span>{{ 'name' in item ? item.name : '' }}</span>
                    </div>
                    
                    <transition name="slide-fade">
                      <div v-if="'expanded' in item && item.expanded" class="subcategory-items">
                        <div 
                          v-for="example in ('children' in item ? item.children : [])" 
                          :key="example.id"
                          class="tree-item"
                          :class="{ active: currentExample?.id === example.id }"
                          @click="selectExample(example)"
                        >
                          <span class="item-title">{{ example.title }}</span>
                          <span class="item-description">{{ example.description }}</span>
                        </div>
                      </div>
                    </transition>
                  </div>
                  
                  <!-- 普通示例 -->
                  <div 
                    v-else-if="'id' in item"
                    class="tree-item"
                    :class="{ active: currentExample?.id === item.id }"
                    @click="selectExample(item)"
                  >
                    <span class="item-title">{{ item.title }}</span>
                    <span class="item-description">{{ item.description }}</span>
                  </div>
                </template>
              </div>
            </transition>
          </div>
        </div>
      </aside>

      <!-- 中间编辑区 -->
      <section 
        class="editor-section" 
        :class="{ 'resizing': isResizing }"
        :style="{ 
          left: (sidebarCollapsed ? 70 : 321) + 'px',
          right: (previewWidth + 10) + 'px'
        }"
      >
        <div class="editor-header">
          <h3>{{ currentExample?.title || '选择组件查看代码' }}</h3>
        </div>
        <div ref="editorContainer" class="editor-container"></div>
      </section>

      <!-- 可拖动分割线 -->
      <div 
        v-if="!isPreviewFullscreen"
        class="resizer" 
        @mousedown="startResize"
        :class="{ 'resizing': isResizing }"
        :style="{ right: previewWidth + 'px' }"
      ></div>

      <!-- 右侧预览区 -->
      <section 
        class="preview-section" 
        :class="{ 'fullscreen': isPreviewFullscreen }" 
        :style="{ 
          width: previewWidth + 'px',
          right: '0px'
        }"
      >
        <div class="preview-header">
          <h3>实时预览</h3>
          <button class="btn-fullscreen" @click="togglePreviewFullscreen" :title="isPreviewFullscreen ? '退出全屏' : '全屏'">
            <el-icon>
              <FullScreen />
            </el-icon>
          </button>
        </div>
        <div class="preview-container" ref="previewArea"></div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ArrowRight, ArrowLeft, ArrowDown, ArrowUp, FullScreen, Box, Tools, ShoppingBag } from '@element-plus/icons-vue'
import { showcaseData } from './showcaseData.ts'
import { 
  AbsolutePanelCommand,
  NhaiButtonCommand,
  NhaiInputCommand,
  NhaiSelectCommand,
  NhaiSwitchCommand,
  NhaiCheckboxCommand,
  NhaiCardCommand,
  NhaiBreadcrumbCommand,
  NhaiTabsCommand,
  NhaiMenuBarCommand,
  NhaiSplitPanelCommand,
  NhaiGridCommand,
  NhaiContainerCommand,
  NhaiWidgetCommand,
  NhaiRowCommand,
  NhaiColCommand,
  NhaiDialogCommand,
  NhaiLayoutBuilderCommand
} from '../components'
let editor: any = null

const previewArea = ref<HTMLElement>()
// 使用 reactive 确保响应式更新
const treeData = reactive(showcaseData.map(category => ({
  ...category,
  children: category.children.map((item: any) => ({
    ...item,
    children: item.children || []
  }))
})))
const currentExample = ref<any>(null)
const sidebarCollapsed = ref(false)
const isPreviewFullscreen = ref(false)

// 预览区域宽度
const previewWidth = ref(0)
const isResizing = ref(false)
const savedPreviewWidth = ref(0) // 保存预览区域的宽度

// 初始化宽度
const initWidths = (preservePreview = false) => {
  const sidebarWidth = sidebarCollapsed.value ? 50 : 280
  const totalWidth = window.innerWidth - sidebarWidth - 10 // 减去侧边栏和分割线宽度
  
  // 如果是第一次初始化，或者预览宽度没有被保存，则平均分配
  if (previewWidth.value === 0 || (!preservePreview && savedPreviewWidth.value === 0)) {
    previewWidth.value = totalWidth / 2
    savedPreviewWidth.value = previewWidth.value
    // 编辑器宽度由 left 和 right 自动计算，不需要设置
  } else {
    // 保持预览区域宽度不变
    previewWidth.value = savedPreviewWidth.value
    // 编辑器宽度由 left 和 right 自动计算
  }
}

// 开始拖动调整大小
const startResize = (e: MouseEvent) => {
  if (isPreviewFullscreen.value) return
  
  e.preventDefault()
  e.stopPropagation()
  
  isResizing.value = true
  const startX = e.clientX
  const startPreviewWidth = previewWidth.value

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // 直接更新，不使用 requestAnimationFrame 以获得更好的响应速度
    const diff = startX - e.clientX // 向右拖动时减小预览宽度
    const editorLeft = sidebarCollapsed.value ? 70 : 321
    const maxWidth = window.innerWidth - editorLeft - 10 // 10px是分割线宽度
    
    // 计算新的预览宽度（向右拖动时减小）
    const newPreviewWidth = Math.max(300, Math.min(maxWidth - 300, startPreviewWidth + diff))
    
    previewWidth.value = newPreviewWidth
    savedPreviewWidth.value = newPreviewWidth // 更新保存的预览宽度
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove, { capture: true })
    document.removeEventListener('mouseup', handleMouseUp, { capture: true })
    document.body.style.userSelect = '' // 恢复文本选择
    document.body.style.cursor = ''
  }

  // 禁用文本选择，提升拖动体验
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'col-resize'
  
  document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: false })
  document.addEventListener('mouseup', handleMouseUp, { capture: true, passive: false })
}

// 计算是否全部展开
const isAllExpanded = computed(() => {
  return treeData.every(category => {
    if (!category.expanded) return false
    return category.children.every((item: any) => {
      if ('expanded' in item) {
        return item.expanded
      }
      return true
    })
  })
})

const toggleCategory = (category: any) => {
  category.expanded = !category.expanded
}

const toggleSubCategory = (subCategory: any) => {
  subCategory.expanded = !subCategory.expanded
}

// 切换全部展开/收起
const toggleExpandAll = () => {
  const shouldExpand = !isAllExpanded.value
  treeData.forEach(category => {
    category.expanded = shouldExpand
    category.children.forEach((item: any) => {
      if ('expanded' in item) {
        item.expanded = shouldExpand
      }
    })
  })
}

// 切换侧边栏
const toggleSidebar = () => {
  // 在切换前保存预览区域宽度
  if (previewWidth.value > 0) {
    savedPreviewWidth.value = previewWidth.value
  }
  
  // 切换状态 - 预览区域宽度保持不变
  sidebarCollapsed.value = !sidebarCollapsed.value
  
  // 预览区域宽度不变，编辑器宽度由 left 和 right 自动计算
  if (savedPreviewWidth.value > 0) {
    previewWidth.value = savedPreviewWidth.value
  } else {
    initWidths()
  }
}

// 获取分类图标
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, any> = {
    '基础组件': Box,        // 盒子图标，表示基础组件
    '高级组件': Tools,      // 工具图标，表示高级功能组件
    '业务组件': ShoppingBag // 购物袋图标，表示业务场景组件
  }
  return iconMap[categoryName] || Box
}

// 切换预览全屏
const togglePreviewFullscreen = () => {
  isPreviewFullscreen.value = !isPreviewFullscreen.value
  if (isPreviewFullscreen.value) {
    // 进入全屏时，收起侧边栏和编辑区
    sidebarCollapsed.value = true
  }
}

const initEditor = async () => {
  await nextTick()
  const container = document.querySelector('.editor-container') as HTMLElement
  if (!container) return

  try {
    const { EditorView } = await import('codemirror')
    const { javascript } = await import('@codemirror/lang-javascript')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    const { lintGutter, linter } = await import('@codemirror/lint')
    
    // 确保容器有明确的高度
    if (container.offsetHeight === 0) {
      await nextTick()
    }
    
    // TypeScript/JavaScript 语法检查器 - 使用 TypeScript 编译器 API
    const jsLinter = linter(async (view) => {
      const diagnostics: any[] = []
      const code = view.state.doc.toString()
      
      if (!code.trim()) {
        return diagnostics
      }
      
      try {
        // 使用 TypeScript 编译器 API 进行语法检查
        const ts = await import('typescript')
        
        // 创建 TypeScript 源文件
        const sourceFile = ts.createSourceFile(
          'temp.ts',
          code,
          ts.ScriptTarget.Latest,
          true // setParentNodes
        )
        
        // 简化版：直接使用 TypeScript 的语法检查
        // 只检查语法错误，不进行完整的类型检查（避免性能问题）
        const options = {
          target: ts.ScriptTarget.Latest,
          module: ts.ModuleKind.ESNext,
          strict: false,
          skipLibCheck: true,
          noEmit: true,
          allowJs: true,
          checkJs: false,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'], // 包含浏览器全局对象类型
          types: [] // 不加载任何类型定义，避免类型检查太严格
        }
        
        // 使用简化的方式获取语法诊断
        const host = {
          getSourceFile: (fileName: string) => {
            if (fileName === 'temp.ts' || fileName === 'temp.js') {
              return sourceFile
            }
            return undefined
          },
          writeFile: () => {},
          getCurrentDirectory: () => '',
          getCanonicalFileName: (fileName: string) => fileName,
          getNewLine: () => '\n',
          useCaseSensitiveFileNames: () => true,
          fileExists: (fileName: string) => {
            // 检查是否是标准库文件
            if (fileName.startsWith('lib.') || fileName.includes('lib.dom.d.ts')) {
              return true
            }
            return fileName === 'temp.ts' || fileName === 'temp.js'
          },
          readFile: (fileName: string) => {
            if (fileName === 'temp.ts' || fileName === 'temp.js') {
              return code
            }
            // 返回空字符串，让 TypeScript 使用内置的类型定义
            return ''
          },
          getDefaultLibFileName: () => {
            // 返回 DOM 库文件
            return 'lib.dom.d.ts'
          }
        }
        
        const program = ts.createProgram(['temp.ts'], options, host)
        
        // 只获取语法诊断（更快，更准确）
        const tsDiagnostics: any[] = [...program.getSyntacticDiagnostics(sourceFile)]
        
        // 过滤掉浏览器全局对象相关的错误
        // 浏览器全局对象列表（这些在浏览器环境中总是可用的）
        const browserGlobals = [
          'alert', 'confirm', 'prompt',
          'console', 'document', 'window', 'location', 'navigator', 'history',
          'localStorage', 'sessionStorage',
          'fetch', 'XMLHttpRequest',
          'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
          'requestAnimationFrame', 'cancelAnimationFrame',
          'Element', 'HTMLElement', 'Document', 'Window'
        ]
        
        // 如果语法检查通过，可以可选地检查一些基本语义错误
        if (tsDiagnostics.length === 0) {
          // 只检查明显的语义错误，避免完整的类型检查
          const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile)
          
          for (const diagnostic of semanticDiagnostics) {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
            
            // 跳过浏览器全局对象的错误
            const isBrowserGlobalError = browserGlobals.some(global => 
              message.includes(`Cannot find name '${global}'`) || 
              message.includes(`'${global}' is not defined`) ||
              message.includes(`Cannot find name "${global}"`)
            )
            
            if (isBrowserGlobalError) {
              continue // 跳过浏览器全局对象的错误
            }
            
            // 只报告明确的错误，跳过类型相关的警告
            if (diagnostic.category === ts.DiagnosticCategory.Error && 
                !message.includes('is declared but its value is never read') &&
                !message.includes('implicitly has an') &&
                !message.includes('any') &&
                !message.includes('Parameter') &&
                !message.includes('Argument of type')) {
              tsDiagnostics.push(diagnostic)
            }
          }
        } else {
          // 即使有语法错误，也要过滤掉浏览器全局对象的错误
          const filteredDiagnostics: any[] = []
          for (const diagnostic of tsDiagnostics) {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
            const isBrowserGlobalError = browserGlobals.some(global => 
              message.includes(`Cannot find name '${global}'`) || 
              message.includes(`'${global}' is not defined`) ||
              message.includes(`Cannot find name "${global}"`)
            )
            
            if (!isBrowserGlobalError) {
              filteredDiagnostics.push(diagnostic)
            }
          }
          // 替换为过滤后的诊断
          tsDiagnostics.length = 0
          tsDiagnostics.push(...filteredDiagnostics)
        }
        
        // 将 TypeScript 诊断转换为 CodeMirror 诊断
        for (const diagnostic of tsDiagnostics) {
          if (!diagnostic.start || !diagnostic.length) continue
          
          const start = diagnostic.start
          const end = start + diagnostic.length
          
          try {
            // 获取错误消息
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
            
            diagnostics.push({
              from: start,
              to: end,
              severity: diagnostic.category === ts.DiagnosticCategory.Error ? 'error' : 
                       diagnostic.category === ts.DiagnosticCategory.Warning ? 'warning' : 'info',
              message: message
            })
          } catch (e) {
            // 如果无法定位行，跳过这个诊断
            console.warn('无法定位诊断位置:', diagnostic)
          }
        }
      } catch (error: any) {
        // 如果 TypeScript 导入失败，回退到基础检查
        console.warn('TypeScript 编译器不可用，使用基础检查:', error)
        
        // 基础语法检查：使用 Function 构造函数
        try {
          const wrappedCode = `(function() { ${code} })`
          new Function(wrappedCode)
        } catch (funcError: any) {
          const errorMsg = funcError.message || '语法错误'
          const positionMatch = errorMsg.match(/position\s+(\d+)/i)
          
          if (positionMatch) {
            const pos = parseInt(positionMatch[1])
            const actualPos = Math.max(0, pos - 16)
            try {
              const line = view.state.doc.lineAt(actualPos)
              diagnostics.push({
                from: line.from,
                to: Math.min(line.to, actualPos + 10),
                severity: 'error',
                message: errorMsg.split('\n')[0].replace(/position\s+\d+/i, '').trim() || '语法错误'
              })
            } catch (e) {
              diagnostics.push({
                from: Math.min(actualPos, code.length - 1),
                to: Math.min(actualPos + 1, code.length),
                severity: 'error',
                message: errorMsg.split('\n')[0] || '语法错误'
              })
            }
          }
        }
      }
      
      return diagnostics
    })
    
    editor = new EditorView({
      parent: container,
      doc: currentExample.value?.code || '',
      extensions: [
        javascript({ typescript: true }), // 启用 TypeScript 支持
        lintGutter(),
        jsLinter,
        oneDark,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            // 自动保存或其他操作
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            width: '100%'
          },
          '.cm-scroller': {
            height: '100%',
            overflow: 'auto'
          }
        })
      ]
    })
  } catch (error) {
    console.error('初始化编辑器失败:', error)
  }
}

const selectExample = (item: any) => {
  currentExample.value = item
  if (editor && item.code) {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: item.code
      }
    })
  }
}

const getCodeFromEditor = () => {
  if (!editor) return ''
  return editor.state.doc.toString()
}

const runCode = async () => {
  if (!previewArea.value) return
  
  try {
    const code = getCodeFromEditor()
    
    // 直接执行代码，类已经从 window 中获取
    const result = new Function('window', `with(window) { ${code} }`)(window)
    
    previewArea.value.innerHTML = ''
    if (result instanceof HTMLElement) {
      previewArea.value.appendChild(result)
    } else if (result && typeof result === 'object' && result.element) {
      previewArea.value.appendChild(result.element)
    }
  } catch (error: any) {
    previewArea.value!.innerHTML = `
      <div style="padding: 20px; background: #fff2f0; color: #ff4d4f; border-radius: 4px;">
        <h4 style="margin-top: 0;">❌ 错误</h4>
        <p style="margin: 8px 0;"><strong>${error.name}:</strong> ${error.message}</p>
        <pre style="background: #fff; padding: 10px; border-radius: 4px; overflow-x: auto;">${error.stack || error.toString()}</pre>
      </div>
    `
  }
}

const resetCode = () => {
  if (currentExample.value && editor) {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: currentExample.value.code
      }
    })
  }
}

onMounted(async () => {
  // 初始化宽度
  initWidths()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => initWidths(false))
  
  // 暴露所有组件类到全局作用域，以便代码执行
  ;(window as any).AbsolutePanelCommand = AbsolutePanelCommand
  ;(window as any).NhaiButtonCommand = NhaiButtonCommand
  ;(window as any).NhaiInputCommand = NhaiInputCommand
  ;(window as any).NhaiSelectCommand = NhaiSelectCommand
  ;(window as any).NhaiSwitchCommand = NhaiSwitchCommand
  ;(window as any).NhaiCheckboxCommand = NhaiCheckboxCommand
  ;(window as any).NhaiCardCommand = NhaiCardCommand
  ;(window as any).NhaiBreadcrumbCommand = NhaiBreadcrumbCommand
  ;(window as any).NhaiTabsCommand = NhaiTabsCommand
  ;(window as any).NhaiMenuBarCommand = NhaiMenuBarCommand
  ;(window as any).NhaiSplitPanelCommand = NhaiSplitPanelCommand
  ;(window as any).NhaiGridCommand = NhaiGridCommand
  ;(window as any).NhaiContainerCommand = NhaiContainerCommand
  ;(window as any).NhaiWidgetCommand = NhaiWidgetCommand
  ;(window as any).NhaiRowCommand = NhaiRowCommand
  ;(window as any).NhaiColCommand = NhaiColCommand
  ;(window as any).NhaiDialogCommand = NhaiDialogCommand
  ;(window as any).NhaiLayoutBuilderCommand = NhaiLayoutBuilderCommand
  
  console.log('所有组件类已暴露到全局作用域')
  
  // 初始化编辑器
  await initEditor()
  
  // 默认选择第一个示例（支持嵌套结构）
  const findFirstExample = (category: any): any => {
    if (!category?.children) return null
    
    for (const item of category.children) {
      // 如果是子分类，递归查找
      if (item.type === 'subcategory' || item.children) {
        const example = findFirstExample(item)
        if (example) return example
      } 
      // 如果是示例，直接返回
      else if (item.id) {
        return item
      }
    }
    return null
  }
  
  const firstExample = findFirstExample(treeData[0])
  if (firstExample) {
    selectExample(firstExample)
  }
})
</script>

<style scoped>
.showcase-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.showcase-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: white;
  letter-spacing: -0.5px;
}

.tagline {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 400;
}

.header-right {
  display: flex;
  gap: 12px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.showcase-main {
  flex: 1;
  position: relative;
  background: #e8e8e8;
  overflow: hidden;
}


.preview-section.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 1000 !important;
  background: white !important;
  margin: 0 !important;
  border: none !important;
  min-width: 100vw !important;
}

.sidebar {
  background: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  border-right: 1px solid #e8e8e8;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  transition: width 0.2s ease, padding 0.2s ease;
  will-change: width, padding;
  z-index: 1;
}

.sidebar.collapsed {
  padding: 20px 8px;
  overflow: visible;
  width: 50px;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  position: relative;
  gap: 12px;
}

.sidebar.collapsed .sidebar-header {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
  justify-content: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.sidebar-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.btn-toggle-expand {
  padding: 8px;
  font-size: 16px;
  background: #f0f0f0;
  color: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.btn-toggle-expand:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-toggle-sidebar {
  padding: 8px;
  font-size: 16px;
  background: #f0f0f0;
  color: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.btn-toggle-sidebar:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.sidebar.collapsed .btn-toggle-sidebar {
  margin: 0 auto;
}

.tree-category {
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  transition: background 0.2s ease, transform 0.15s ease;
  font-weight: 500;
  color: #2c3e50;
  background: linear-gradient(to right, #f8f9fa, transparent);
}

.sidebar.collapsed .category-header {
  padding: 12px 6px;
  justify-content: center;
  gap: 0;
  flex-direction: column;
}

.category-header:hover {
  background: linear-gradient(to right, #e9ecef, #f8f9fa);
  transform: translateX(2px);
}

.sidebar.collapsed .category-header:hover {
  transform: none;
  background: #e9ecef;
}

.category-name-collapsed {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
  display: inline-block;
}

.category-main-icon {
  width: 20px;
  height: 20px;
  font-size: 18px;
  color: #667eea;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 8px;
}

.sidebar.collapsed .category-main-icon {
  width: 28px;
  height: 28px;
  font-size: 24px;
  margin-right: 0;
  color: #667eea;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
}

.sidebar.collapsed .category-header:hover .category-main-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.5));
}

.category-icon {
  width: 16px;
  height: 16px;
  font-size: 14px;
  color: #667eea;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 4px;
  will-change: transform;
}

.sidebar.collapsed .category-icon {
  width: 14px;
  height: 14px;
  font-size: 12px;
}

.category-icon.icon-expanded {
  transform: rotate(90deg);
}

.sidebar.collapsed .category-icon.icon-expanded {
  transform: rotate(90deg);
}

.category-items {
  margin-left: 20px;
  margin-top: 8px;
  padding-left: 12px;
  border-left: 2px solid #f0f0f0;
}

.tree-subcategory {
  margin-bottom: 12px;
}

.subcategory-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;
}

.subcategory-header:hover {
  background: #e9ecef;
  border-color: #667eea;
  transform: translateX(4px);
}

.subcategory-icon {
  width: 14px;
  height: 14px;
  font-size: 12px;
  color: #667eea;
  transition: transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.subcategory-icon.icon-expanded {
  transform: rotate(90deg);
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.subcategory-items {
  margin-left: 20px;
  padding-left: 8px;
  border-left: 1px dashed #e0e0e0;
}

.tree-item {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.tree-item:hover {
  background: linear-gradient(to right, #e7f3ff, #f0f8ff);
  border-color: #b3d9ff;
  transform: translateX(4px);
}

.tree-item.active {
  background: linear-gradient(to right, #b3d9ff, #d6ebff);
  border-color: #667eea;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.item-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.4;
}

.tree-item.active .item-title {
  color: #667eea;
  font-weight: 600;
}

.item-description {
  display: block;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.editor-section, .preview-section {
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
  min-width: 300px;
  position: absolute;
  top: 0;
  bottom: 0;
}

.editor-section {
  transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1), right 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: left, right;
  overflow: hidden;
}

.editor-section.resizing {
  transition: none !important;
}

.preview-section:not(.fullscreen) {
  min-width: 300px;
  transition: none !important; /* 完全移除过渡动画，避免任何闪烁 */
  will-change: width;
  position: absolute;
  right: 0;
}

/* 可拖动分割线 */
.resizer {
  width: 10px;
  background: #e8e8e8;
  cursor: col-resize;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10;
  transition: background 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  will-change: background;
}

.resizer:hover {
  background: #667eea;
}

.resizer.resizing {
  background: #667eea;
  cursor: col-resize;
  transition: none !important;
}

.resizer::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #d0d0d0;
  transform: translateX(-50%);
}

.resizer:hover::before {
  background: #667eea;
  width: 3px;
}

.editor-header, .preview-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3, .preview-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
  width: 100%;
}

.editor-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor-container::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.editor-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.editor-container::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.editor-container :deep(.cm-editor) {
  height: 100%;
  font-size: 14px;
}

.editor-container :deep(.cm-scroller) {
  overflow: auto !important;
  height: 100%;
}

.editor-container :deep(.cm-scroller::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

.editor-container :deep(.cm-scroller::-webkit-scrollbar-track) {
  background: #f5f5f5;
}

.editor-container :deep(.cm-scroller::-webkit-scrollbar-thumb) {
  background: #d0d0d0;
  border-radius: 4px;
}

.editor-container :deep(.cm-scroller::-webkit-scrollbar-thumb:hover) {
  background: #b0b0b0;
}

/* Lint 错误检测样式 */
.editor-container :deep(.cm-lintGutter) {
  width: 18px;
  padding-left: 4px;
}

.editor-container :deep(.cm-lintGutter .cm-lintMarker) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4d4f;
  cursor: pointer;
  display: inline-block;
  margin-top: 2px;
}

.editor-container :deep(.cm-lintGutter .cm-lintMarker:hover) {
  transform: scale(1.2);
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
}

.editor-container :deep(.cm-lintGutter .cm-lintMarker-warning) {
  background: #faad14;
}

.editor-container :deep(.cm-lintGutter .cm-lintMarker-warning:hover) {
  box-shadow: 0 0 4px rgba(250, 173, 20, 0.5);
}

.editor-container :deep(.cm-lintGutter .cm-lintMarker-info) {
  background: #1890ff;
}

.editor-container :deep(.cm-lintGutter .cm-lintMarker-info:hover) {
  box-shadow: 0 0 4px rgba(24, 144, 255, 0.5);
}

.editor-container :deep(.cm-lintRange) {
  background: rgba(255, 77, 79, 0.1);
  border-bottom: 2px solid #ff4d4f;
}

.editor-container :deep(.cm-lintRange-warning) {
  background: rgba(250, 173, 20, 0.1);
  border-bottom: 2px solid #faad14;
}

.editor-container :deep(.cm-lintRange-info) {
  background: rgba(24, 144, 255, 0.1);
  border-bottom: 2px solid #1890ff;
}

/* Lint Tooltip 样式 */
.editor-container :deep(.cm-tooltip) {
  background: #fff !important;
  border: 1px solid #e8e8e8 !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  padding: 8px 12px !important;
  font-size: 13px !important;
  max-width: 400px !important;
  min-width: 200px !important;
  color: #333 !important;
  z-index: 1000 !important;
}

.editor-container :deep(.cm-tooltip-lint) {
  background: #fff !important;
  border: 1px solid #e8e8e8 !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  padding: 8px 12px !important;
  font-size: 13px !important;
  max-width: 400px !important;
  min-width: 200px !important;
  color: #333 !important;
  z-index: 1000 !important;
}

.editor-container :deep(.cm-tooltip-lint .cm-lintMessage),
.editor-container :deep(.cm-tooltip .cm-lintMessage) {
  color: #ff4d4f !important;
  margin: 0 !important;
  padding: 4px 0 !important;
  line-height: 1.5 !important;
  display: block !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.editor-container :deep(.cm-tooltip-lint .cm-lintMessage::before),
.editor-container :deep(.cm-tooltip .cm-lintMessage::before) {
  content: '⚠ ' !important;
  margin-right: 6px !important;
}

.editor-container :deep(.cm-tooltip-lint .cm-lintMessage-warning),
.editor-container :deep(.cm-tooltip .cm-lintMessage-warning) {
  color: #faad14 !important;
}

.editor-container :deep(.cm-tooltip-lint .cm-lintMessage-warning::before),
.editor-container :deep(.cm-tooltip .cm-lintMessage-warning::before) {
  content: '⚠ ' !important;
}

.editor-container :deep(.cm-tooltip-lint .cm-lintMessage-info),
.editor-container :deep(.cm-tooltip .cm-lintMessage-info) {
  color: #1890ff !important;
}

.editor-container :deep(.cm-tooltip-lint .cm-lintMessage-info::before),
.editor-container :deep(.cm-tooltip .cm-lintMessage-info::before) {
  content: 'ℹ ' !important;
}

/* 确保 tooltip 内容可见 */
.editor-container :deep(.cm-tooltip-lint ul),
.editor-container :deep(.cm-tooltip-lint ol),
.editor-container :deep(.cm-tooltip ul),
.editor-container :deep(.cm-tooltip ol) {
  margin: 0 !important;
  padding-left: 20px !important;
  list-style: none !important;
}

.editor-container :deep(.cm-tooltip-lint li),
.editor-container :deep(.cm-tooltip li) {
  margin: 4px 0 !important;
  padding: 0 !important;
}

/* 确保 tooltip 文本可见 */
.editor-container :deep(.cm-tooltip-lint *),
.editor-container :deep(.cm-tooltip *) {
  color: inherit !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.preview-section {
  border-right: none;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background: #fafafa;
}

.preview-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.preview-container::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.preview-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.preview-container::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.btn-fullscreen {
  padding: 8px;
  font-size: 16px;
  background: #f0f0f0;
  color: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.btn-fullscreen:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
</style>
