<template>
  <div class="code-editor-container">
    <div class="editor-header">
      <h3>代码编辑器</h3>
      <div class="editor-toolbar">
        <button @click="runCode" class="run-button" :disabled="isRunning">
          {{ isRunning ? '运行中...' : '运行代码' }}
        </button>
        <button @click="checkSyntax" class="check-button">语法检查</button>
        <button @click="formatCode" class="format-button">格式化</button>
        <button @click="getSuggestions" class="suggest-button">建议</button>
        <button @click="clearCode" class="clear-button">清空</button>
        <button @click="resetCode" class="reset-button">重置</button>
        <button @click="copyCode" class="copy-button">复制</button>
      </div>
    </div>
    
    <div class="editor-content">
      <div ref="editorContainer" class="monaco-editor"></div>
    </div>
    
    <div v-if="errorMessage" class="error-message">
      <h4>错误信息:</h4>
      <pre>{{ errorMessage }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { SyntaxChecker } from '../../lib/utils/SyntaxChecker'

// Props
interface Props {
  initialCode?: string
  onCodeChange?: (code: string) => void
  onCodeRun?: (code: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  initialCode: `// NHAI 组件示例
const container = NHAIObjectFactory.createContainer()

// 创建按钮
const button = NHAIObjectFactory.createButton('点击我')
button.setVariant('primary')
button.setWidth(120)
button.setHeight(40)
button.setOnClick(() => alert('按钮被点击！'))

// 创建标签
const label = NHAIObjectFactory.createLabel('欢迎使用NHAI')
label.setFontSize(16)
label.setColor('#2c3e50')

// 添加到容器
container.addChild(label)
container.addChild(button)

// 渲染到预览区域
const element = container.render()
document.querySelector('.preview-area')?.appendChild(element)`,
  onCodeChange: () => {},
  onCodeRun: () => {}
})

// Reactive data
const editorContainer = ref<HTMLElement>()
const editor = ref<monaco.editor.IStandaloneCodeEditor>()
const errorMessage = ref('')
const isRunning = ref(false)

// Monaco editor configuration
const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  value: props.initialCode,
  language: 'javascript',
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 20,
  wordWrap: 'on',
  tabSize: 2,
  insertSpaces: true,
  renderWhitespace: 'selection',
  bracketPairColorization: { enabled: true },
  suggest: {
    showKeywords: true,
    showSnippets: true
  },
  // 启用语法检查
  validate: true,
  quickSuggestions: true,
  suggestOnTriggerCharacters: true
}

// Initialize Monaco editor
const initEditor = async () => {
  try {
    if (editorContainer.value) {
      editor.value = monaco.editor.create(editorContainer.value, editorOptions)
      
      // Add custom NHAI completions
      setupNHAICompletions(monaco)
      
      // Listen for content changes
      editor.value.onDidChangeModelContent(() => {
        const code = editor.value?.getValue() || ''
        props.onCodeChange(code)
        clearError()
      })
      
      // Add keyboard shortcuts
      editor.value.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
        runCode()
      })
    }
  } catch (error) {
    console.error('Failed to initialize Monaco editor:', error)
    errorMessage.value = `编辑器初始化失败: ${error}`
  }
}

// Setup NHAI-specific code completions
const setupNHAICompletions = (monacoInstance: typeof monaco) => {
  monacoInstance.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: 'NHAIObjectFactory',
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: 'NHAIObjectFactory',
          documentation: 'NHAI对象工厂，用于创建各种UI组件'
        },
        {
          label: 'createButton',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createButton(\'${1:按钮文本}\')',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '创建按钮组件'
        },
        {
          label: 'createLabel',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createLabel(\'${1:标签文本}\')',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '创建标签组件'
        },
        {
          label: 'createInput',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createInput()',
          documentation: '创建输入框组件'
        },
        {
          label: 'createCard',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createCard()',
          documentation: '创建卡片组件'
        },
        {
          label: 'createContainer',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createContainer()',
          documentation: '创建容器组件'
        },
        {
          label: 'createVBoxLayout',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createVBoxLayout()',
          documentation: '创建垂直布局'
        },
        {
          label: 'createHBoxLayout',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'NHAIObjectFactory.createHBoxLayout()',
          documentation: '创建水平布局'
        },
        {
          label: 'setVariant',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'setVariant(\'${1:primary}\')',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '设置组件变体样式'
        },
        {
          label: 'setWidth',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'setWidth(${1:100})',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '设置组件宽度'
        },
        {
          label: 'setHeight',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'setHeight(${1:40})',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '设置组件高度'
        },
        {
          label: 'setOnClick',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'setOnClick(() => {\n  ${1:// 点击事件处理}\n})',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '设置点击事件'
        },
        {
          label: 'setStyle',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'setStyle({\n  ${1:// 样式属性}\n})',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '设置自定义样式'
        },
        {
          label: 'addChild',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'addChild(${1:child})',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: '添加子组件'
        },
        {
          label: 'render',
          kind: monacoInstance.languages.CompletionItemKind.Method,
          insertText: 'render()',
          documentation: '渲染组件为DOM元素'
        }
      ]
      
      return { suggestions }
    }
  })
}

// Methods
const runCode = async () => {
  if (!editor.value) return
  
  const code = editor.value.getValue()
  if (!code.trim()) return
  
  isRunning.value = true
  clearError()
  
  try {
    // 触发代码运行事件，让父组件处理
    props.onCodeRun(code)
  } catch (error) {
    console.error('Code execution error:', error)
    errorMessage.value = `代码执行错误: ${error.message}`
  } finally {
    isRunning.value = false
  }
}


const clearCode = () => {
  if (editor.value) {
    editor.value.setValue('')
    clearError()
  }
}

const resetCode = () => {
  if (editor.value) {
    editor.value.setValue(props.initialCode)
    clearError()
  }
}

const copyCode = () => {
  if (editor.value) {
    const code = editor.value.getValue()
    navigator.clipboard.writeText(code).then(() => {
      alert('代码已复制到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }
}

const clearError = () => {
  errorMessage.value = ''
}

// 语法检查
const checkSyntax = () => {
  if (!editor.value) return
  
  const code = editor.value.getValue()
  const result = SyntaxChecker.checkSyntax(code)
  
  if (!result.valid) {
    const errorMessages = result.errors.map(error => 
      `第 ${error.line} 行: ${error.message}`
    ).join('\n')
    
    errorMessage.value = `语法错误:\n${errorMessages}`
  } else if (result.warnings.length > 0) {
    const warningMessages = result.warnings.map(warning => 
      `第 ${warning.line} 行: ${warning.message}`
    ).join('\n')
    
    errorMessage.value = `警告:\n${warningMessages}`
  } else {
    errorMessage.value = ''
  }
}

// 格式化代码
const formatCode = () => {
  if (!editor.value) return
  
  const code = editor.value.getValue()
  const formatted = SyntaxChecker.formatCode(code)
  editor.value.setValue(formatted)
}

// 获取代码建议
const getSuggestions = () => {
  if (!editor.value) return
  
  const code = editor.value.getValue()
  const suggestions = SyntaxChecker.getCodeSuggestions(code)
  
  if (suggestions.length > 0) {
    const suggestionText = suggestions.join('\n\n')
    const currentCode = editor.value.getValue()
    editor.value.setValue(currentCode + '\n\n' + suggestionText)
  }
}

// Watch for prop changes
watch(() => props.initialCode, (newCode) => {
  if (editor.value && newCode !== editor.value.getValue()) {
    editor.value.setValue(newCode)
  }
})

// Lifecycle
onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.dispose()
  }
})
</script>

<style scoped>
.code-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;
}

.editor-header h3 {
  margin: 0;
  color: #cccccc;
  font-size: 16px;
  font-weight: 500;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
}

.editor-toolbar button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.run-button {
  background: #007acc;
  color: white;
}

.run-button:hover:not(:disabled) {
  background: #005a9e;
}

.run-button:disabled {
  background: #666;
  cursor: not-allowed;
}

.clear-button {
  background: #dc3545;
  color: white;
}

.clear-button:hover {
  background: #c82333;
}

.reset-button {
  background: #6c757d;
  color: white;
}

.reset-button:hover {
  background: #5a6268;
}

.copy-button {
  background: #28a745;
  color: white;
}

.copy-button:hover {
  background: #218838;
}

.check-button {
  background: #ffc107;
  color: #212529;
}

.check-button:hover {
  background: #e0a800;
}

.format-button {
  background: #6f42c1;
  color: white;
}

.format-button:hover {
  background: #5a32a3;
}

.suggest-button {
  background: #20c997;
  color: white;
}

.suggest-button:hover {
  background: #1aa179;
}

.editor-content {
  flex: 1;
  position: relative;
}

.monaco-editor {
  width: 100%;
  height: 100%;
}

.error-message {
  padding: 12px 16px;
  background: #2d1b1b;
  border-top: 1px solid #3e1e1e;
  color: #ff6b6b;
}

.error-message h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.error-message pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
