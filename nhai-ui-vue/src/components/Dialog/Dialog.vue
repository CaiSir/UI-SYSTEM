<!--
  Dialog 对话框组件
  基于 Element Plus 的 el-dialog 组件封装
  提供完整的对话框功能，包括显示、隐藏、事件监听等
-->
<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :modal-class="computedModalClass"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="beforeClose"
    :draggable="draggable"
    :center="center"
    :align-center="alignCenter"
    :destroy-on-close="destroyOnClose"
    :close-icon="closeIcon"
    :z-index="zIndex"
    :header-aria-level="headerAriaLevel"
    :class="dialogClass"
    @update:model-value="handleUpdateModelValue"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <!-- 自定义头部插槽 -->
    <template #header v-if="$slots.header || header">
      <slot name="header">
        <span>{{ header }}</span>
      </slot>
    </template>

    <!-- 内容插槽，支持 HTML -->
    <slot>
      <div v-if="content" v-html="content"></div>
    </slot>

    <!-- 底部按钮区域 -->
    <template #footer v-if="showFooter">
      <slot name="footer">
        <span class="dialog-footer">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { ElDialog, ElButton } from 'element-plus'

/**
 * 组件属性定义
 */
interface Props {
  modelValue?: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  top?: string
  modal?: boolean
  modalClass?: string
  modalStyle?: Record<string, any> // 遮罩层自定义样式
  modalBackdrop?: boolean // 是否显示遮罩层背景
  modalFade?: boolean // 遮罩层淡入淡出动画
  appendToBody?: boolean
  lockScroll?: boolean
  openDelay?: number
  closeDelay?: number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: (done: () => void) => void
  draggable?: boolean
  center?: boolean
  alignCenter?: boolean
  destroyOnClose?: boolean
  closeIcon?: string
  zIndex?: number
  headerAriaLevel?: string
  header?: string
  content?: string
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
  dialogClass?: string // 自定义对话框样式类名
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,          // 默认隐藏
  title: '',                   // 默认无标题
  width: '50%',               // 默认宽度 50%
  fullscreen: false,          // 默认不全屏
  modal: true,                // 默认显示遮罩
  modalClass: '',             // 默认无自定义遮罩样式
  modalStyle: () => ({}),     // 默认无遮罩自定义样式
  modalBackdrop: true,        // 默认显示遮罩层背景
  modalFade: true,            // 默认启用遮罩层淡入淡出
  appendToBody: false,        // 默认不挂载到 body
  lockScroll: true,           // 默认锁定滚动
  openDelay: 0,              // 默认无打开延迟
  closeDelay: 0,              // 默认无关闭延迟
  closeOnClickModal: false,   // 默认点击遮罩不关闭（模态框需要明确操作）
  closeOnPressEscape: true,   // 默认按 ESC 关闭
  showClose: true,           // 默认显示关闭按钮
  draggable: false,          // 默认不可拖动
  center: false,             // 默认不居中
  alignCenter: false,        // 默认文本不居中
  destroyOnClose: false,     // 默认关闭不销毁
  zIndex: 2000,              // 默认层级 2000
  headerAriaLevel: '2',      // 默认标题级别
  showFooter: false,         // 默认不显示底部按钮
  confirmText: '确定',        // 默认确认按钮文本
  cancelText: '取消',         // 默认取消按钮文本
  dialogClass: ''            // 默认无自定义样式
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void  // v-model 双向绑定
  (e: 'open'): void          // 对话框开始打开
  (e: 'opened'): void        // 对话框完全打开
  (e: 'close'): void         // 对话框开始关闭
  (e: 'closed'): void        // 对话框完全关闭
  (e: 'confirm'): void      // 点击确认按钮
  (e: 'cancel'): void       // 点击取消按钮
}>()

/**
 * 计算遮罩层类名
 * 合并 modalClass 和动态样式
 */
const computedModalClass = computed(() => {
  const classes = []
  if (props.modalClass) {
    classes.push(props.modalClass)
  }
  return classes.join(' ')
})

/**
 * 应用遮罩层样式
 * 通过直接操作 DOM 元素来应用样式
 */
const applyModalStyleToOverlay = () => {
  if (!props.modal) return
  
  // 使用多次尝试，确保找到 overlay 元素
  const tryApply = (attempts = 0) => {
    const overlays = document.querySelectorAll('.el-overlay-dialog')
    
    if (overlays.length > 0) {
      const lastOverlay = overlays[overlays.length - 1] as HTMLElement
      
      // 设置背景色
      if (props.modalStyle?.backgroundColor) {
        lastOverlay.style.backgroundColor = props.modalStyle.backgroundColor
      } else if (props.modalBackdrop !== false) {
        lastOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      } else {
        lastOverlay.style.backgroundColor = 'transparent'
      }
      
      // 应用其他自定义样式
      if (props.modalStyle) {
        Object.entries(props.modalStyle).forEach(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          if (typeof value === 'string' || typeof value === 'number') {
            lastOverlay.style.setProperty(cssKey, value.toString())
          }
        })
      }
    } else if (attempts < 10) {
      // 如果没找到，等待一段时间后重试
      setTimeout(() => tryApply(attempts + 1), 50)
    }
  }
  
  tryApply()
}

// 监听 modelValue 变化，当对话框打开时应用样式
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 延迟一点时间，确保 DOM 已经渲染
    setTimeout(applyModalStyleToOverlay, 100)
  }
}, { immediate: true })

// 监听样式变化
watch(() => [props.modalStyle, props.modalBackdrop], () => {
  if (props.modelValue) {
    setTimeout(applyModalStyleToOverlay, 50)
  }
}, { deep: true })

onMounted(() => {
  if (props.modelValue) {
    setTimeout(applyModalStyleToOverlay, 100)
  }
})

/**
 * 处理 v-model 更新事件
 */
const handleUpdateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}

/**
 * 处理对话框打开事件
 */
const handleOpen = () => {
  emit('open')
}

/**
 * 处理对话框完全打开事件
 */
const handleOpened = () => {
  emit('opened')
}

/**
 * 处理对话框关闭事件
 */
const handleClose = () => {
  emit('close')
}

/**
 * 处理对话框完全关闭事件
 */
const handleClosed = () => {
  emit('closed')
}

/**
 * 处理确认按钮点击事件
 * 触发 confirm 事件并关闭对话框
 */
const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

/**
 * 处理取消按钮点击事件
 * 触发 cancel 事件并关闭对话框
 */
const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* 底部按钮区域样式 - 右对齐 */
.dialog-footer {
  text-align: right;
}
</style>

