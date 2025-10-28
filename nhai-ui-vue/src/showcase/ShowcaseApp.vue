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
    <div class="showcase-main">
      <!-- 左侧组件树 -->
      <aside class="sidebar">
        <h3>组件列表</h3>
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
              <i :class="category.expanded ? 'icon-up' : 'icon-down'"></i>
              <span>{{ category.name }}</span>
            </div>
            
            <div v-if="category.expanded" class="category-items">
              <div 
                v-for="item in category.children" 
                :key="item.id"
                class="tree-item"
                :class="{ active: currentExample?.id === item.id }"
                @click="selectExample(item)"
              >
                <span class="item-title">{{ item.title }}</span>
                <span class="item-description">{{ item.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中间编辑区 -->
      <section class="editor-section">
        <div class="editor-header">
          <h3>{{ currentExample?.title || '选择组件查看代码' }}</h3>
        </div>
        <div ref="editorContainer" class="editor-container"></div>
      </section>

      <!-- 右侧预览区 -->
      <section class="preview-section">
        <div class="preview-header">
          <h3>实时预览</h3>
        </div>
        <div class="preview-container" ref="previewArea"></div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
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
  NhaiContainerCommand
} from '../components'
let editor: any = null

const previewArea = ref<HTMLElement>()
const treeData = ref(showcaseData)
const currentExample = ref<any>(null)

const toggleCategory = (category: any) => {
  category.expanded = !category.expanded
}

const initEditor = async () => {
  await nextTick()
  const container = document.querySelector('.editor-container') as HTMLElement
  if (!container) return

  try {
    const { EditorView } = await import('codemirror')
    const { javascript } = await import('@codemirror/lang-javascript')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    
    editor = new EditorView({
      parent: container,
      doc: currentExample.value?.code || '',
      extensions: [
        javascript(),
        oneDark,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            // 自动保存或其他操作
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
  
  console.log('所有组件类已暴露到全局作用域')
  
  // 初始化编辑器
  await initEditor()
  
  // 默认选择第一个示例
  if (treeData.value[0]?.children?.[0]) {
    selectExample(treeData.value[0].children[0])
  }
})
</script>

<style scoped>
.showcase-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.showcase-header {
  background: white;
  padding: 12px 24px;
  padding-right: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #1890ff;
}

.tagline {
  color: #8c8c8c;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #d9d9d9;
}

.showcase-main {
  flex: 1;
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  gap: 1px;
  background: #e8e8e8;
  overflow: hidden;
}

.sidebar {
  background: white;
  overflow-y: auto;
  padding: 16px;
}

.sidebar h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.tree-category {
  margin-bottom: 12px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  user-select: none;
}

.category-header:hover {
  background: #f5f5f5;
}

.category-items {
  margin-left: 16px;
}

.tree-item {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}

.tree-item:hover {
  background: #e6f7ff;
}

.tree-item.active {
  background: #bae7ff;
}

.item-title {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.item-description {
  display: block;
  font-size: 12px;
  color: #8c8c8c;
}

.editor-section, .preview-section {
  background: white;
  display: flex;
  flex-direction: column;
}

.editor-header, .preview-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.editor-header h3, .preview-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.editor-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.editor-container :deep(.cm-editor) {
  height: 100%;
  font-size: 14px;
}

.editor-container :deep(.cm-scroller) {
  height: 100%;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style>
