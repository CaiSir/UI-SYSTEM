/**
 * 全局类型声明文件
 * 为 UMD 格式的全局变量提供类型支持
 */

import type { NHAIUIVueNamespace } from './index'

declare global {
  interface Window {
    /**
     * NHAI UI Vue 全局变量（UMD 格式）
     * 
     * 使用方式：
     * ```typescript
     * // 命名空间方式
     * const button = new window.NHAIUIVue.Components.Button('按钮')
     * 
     * // 平铺导出方式
     * const button2 = new window.NHAIUIVue.NhaiButtonCommand('按钮')
     * ```
     */
    NHAIUIVue: NHAIUIVueNamespace
  }
}

export {}

