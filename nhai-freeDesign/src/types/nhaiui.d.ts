/**
 * NHAI UI Vue 全局类型声明
 * 为 window.NHAIUIVue 提供类型支持
 */
import type { NHAIUIVueNamespace } from '../../imports/nhaiui/index'

declare global {
  interface Window {
    /**
     * NHAI UI Vue 全局变量（UMD 格式）
     * 包含所有命令式 API 组件
     */
    NHAIUIVue: NHAIUIVueNamespace
  }
}

export {}

