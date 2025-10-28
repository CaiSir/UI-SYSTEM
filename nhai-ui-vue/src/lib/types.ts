/**
 * 公共类型定义
 */

/**
 * 命令式组件渲染结果
 */
export interface CommandRenderResult {
  element: HTMLElement
  mounted: boolean
}

/**
 * 通用选项接口
 */
export interface Option<T = string> {
  label: string
  value: T
  disabled?: boolean
}

