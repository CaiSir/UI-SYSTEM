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
      <textarea
        ref="editorTextarea"
        v-model="editorCode"
        @input="onCodeChange"
        class="code-textarea"
        placeholder="在这里编写 NHAI 组件代码..."
        spellcheck="false"
      ></textarea>
    </div>
    
    <div v-if="errorMessage" class="error-message">
      <h4>错误信息:</h4>
      <pre>{{ errorMessage }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { SyntaxChecker } from '../utils/SyntaxChecker'

// Props
interface Props {
  initialCode?: string
  onCodeChange?: (code: string) => void
  onCodeRun?: (code: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  initialCode: `// 创建按钮测试
console.log('🚀 开始创建按钮');

// 创建按钮
const button = NHAIObjectFactory.createButton('测试按钮');
console.log('✅ 按钮创建成功');

// 设置样式
button.setVariant('primary');
console.log('✅ 样式设置完成');

// 渲染
const element = button.render();
console.log('✅ 渲染完成');

// 添加到预览区域
const previewArea = document.querySelector('.preview-area');
if (previewArea) {
  previewArea.appendChild(element);
  console.log('✅ 按钮已添加到预览区域');
} else {
  console.error('❌ 预览区域为空');
}

console.log('🎉 测试完成');`,
  onCodeChange: () => {},
  onCodeRun: () => {}
})

// Reactive data
const editorTextarea = ref<HTMLTextAreaElement>()
const editorCode = ref(props.initialCode)
const errorMessage = ref('')
const isRunning = ref(false)

// Methods
const runCode = async () => {
  if (!editorCode.value.trim()) return
  
  isRunning.value = true
  clearError()
  
  try {
    // 触发代码运行事件，让父组件处理
    props.onCodeRun(editorCode.value)
  } catch (error) {
    console.error('Code execution error:', error)
    errorMessage.value = `代码执行错误: ${error instanceof Error ? error.message : '未知错误'}`
  } finally {
    isRunning.value = false
  }
}

const clearCode = () => {
  editorCode.value = ''
  clearError()
}

const resetCode = () => {
  editorCode.value = props.initialCode
  clearError()
}

const copyCode = () => {
  navigator.clipboard.writeText(editorCode.value).then(() => {
    alert('代码已复制到剪贴板')
  }).catch(() => {
    alert('复制失败，请手动复制')
  })
}

const clearError = () => {
  errorMessage.value = ''
}

// 语法检查
const checkSyntax = () => {
  const result = SyntaxChecker.checkSyntax(editorCode.value)
  
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
    errorMessage.value = '✓ 语法检查通过'
  }
}

// 格式化代码
const formatCode = () => {
  const formatted = SyntaxChecker.formatCode(editorCode.value)
  editorCode.value = formatted
}

// 获取代码建议
const getSuggestions = () => {
  const suggestions = SyntaxChecker.getCodeSuggestions(editorCode.value)
  
  if (suggestions.length > 0) {
    const suggestionText = suggestions.join('\n\n')
    editorCode.value = editorCode.value + '\n\n' + suggestionText
  }
}

// 代码变更处理
const onCodeChange = () => {
  props.onCodeChange(editorCode.value)
  clearError()
}

// Watch for prop changes
watch(() => props.initialCode, (newCode) => {
  if (newCode !== editorCode.value) {
    editorCode.value = newCode
  }
})

// Lifecycle
onMounted(() => {
  // 设置初始代码
  editorCode.value = props.initialCode
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
  flex-wrap: wrap;
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

.code-textarea {
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  tab-size: 2;
}

.code-textarea::placeholder {
  color: #6c757d;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-toolbar {
    gap: 4px;
  }
  
  .editor-toolbar button {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .code-textarea {
    font-size: 13px;
    padding: 12px;
  }
}
</style>
