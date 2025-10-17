<template>
  <div class="preview-container">
    <div class="preview-header">
      <h3>实时预览</h3>
      <div class="preview-toolbar">
        <button @click="clearPreview" class="clear-button">清空预览</button>
        <button @click="refreshPreview" class="refresh-button" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '刷新' }}
        </button>
        <div class="framework-indicator">
          <span class="framework-badge">{{ currentFramework }}</span>
        </div>
      </div>
    </div>
    
    <div class="preview-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在渲染组件...</p>
      </div>
      
      <div v-else-if="errorMessage" class="error-state">
        <div class="error-icon">⚠️</div>
        <h4>预览错误</h4>
        <pre class="error-details">{{ errorMessage }}</pre>
      </div>
      
      <div v-else class="preview-area" ref="previewArea">
        <div v-if="isEmpty" class="empty-state">
          <div class="empty-icon">🎨</div>
          <h4>暂无预览内容</h4>
          <p>请在左侧编辑器中编写 NHAI 组件代码，然后点击"运行代码"查看预览效果</p>
        </div>
      </div>
    </div>
    
    <div v-if="executionInfo" class="execution-info">
      <div class="info-item">
        <span class="info-label">执行时间:</span>
        <span class="info-value">{{ executionInfo.executionTime }}ms</span>
      </div>
      <div class="info-item">
        <span class="info-label">组件数量:</span>
        <span class="info-value">{{ executionInfo.componentCount }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">最后更新:</span>
        <span class="info-value">{{ executionInfo.lastUpdate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
  currentFramework?: string
  isLoading?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentFramework: 'Vanilla',
  isLoading: false,
  errorMessage: ''
})

// Emits
const emit = defineEmits<{
  clear: []
  refresh: []
}>()

// Reactive data
const previewArea = ref<HTMLElement>()
const executionInfo = ref<{
  executionTime: number
  componentCount: number
  lastUpdate: string
} | null>(null)

// Computed
const isEmpty = computed(() => {
  if (!previewArea.value) return true
  return previewArea.value.children.length === 0
})

// Methods
const clearPreview = () => {
  if (previewArea.value) {
    previewArea.value.innerHTML = ''
    executionInfo.value = null
    emit('clear')
  }
}

const refreshPreview = () => {
  emit('refresh')
}

const updateExecutionInfo = (executionTime: number, componentCount: number) => {
  executionInfo.value = {
    executionTime,
    componentCount,
    lastUpdate: new Date().toLocaleTimeString()
  }
}

// Expose methods for parent component
defineExpose({
  clearPreview,
  updateExecutionInfo,
  getPreviewArea: () => previewArea.value
})

// Lifecycle
onMounted(() => {
  // Initialize preview area
  if (previewArea.value) {
    previewArea.value.classList.add('preview-area')
  }
})
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.preview-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
}

.preview-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-toolbar button {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.clear-button {
  color: #dc3545;
}

.clear-button:hover {
  background: #dc3545;
  color: white;
}

.refresh-button {
  color: #007bff;
}

.refresh-button:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.refresh-button:disabled {
  color: #6c757d;
  cursor: not-allowed;
}

.framework-indicator {
  display: flex;
  align-items: center;
}

.framework-badge {
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.preview-content {
  flex: 1;
  position: relative;
  overflow: auto;
}

.preview-area {
  width: 100%;
  height: 100%;
  padding: 20px;
  min-height: 200px;
  background: #ffffff;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6c757d;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h4 {
  margin: 0 0 12px 0;
  color: #dc3545;
  font-size: 18px;
}

.error-details {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  max-width: 100%;
  overflow-x: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  max-width: 300px;
}

.execution-info {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-label {
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  color: #495057;
  font-weight: 600;
}

/* Preview area styles for rendered components */
.preview-area :deep(*) {
  box-sizing: border-box;
}

.preview-area :deep(.nhai-button) {
  margin: 4px;
}

.preview-area :deep(.nhai-label) {
  margin: 4px 0;
}

.preview-area :deep(.nhai-input) {
  margin: 4px 0;
}

.preview-area :deep(.nhai-card) {
  margin: 8px 0;
}

.preview-area :deep(.nhai-container) {
  margin: 4px 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .preview-toolbar {
    width: 100%;
    justify-content: space-between;
  }
  
  .execution-info {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
