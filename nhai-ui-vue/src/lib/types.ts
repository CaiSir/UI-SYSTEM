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

/**
 * 菜单项接口
 */
export interface MenuItem {
  id: string
  label: string
  icon?: string
  children?: MenuItem[]
  disabled?: boolean
}

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

/**
 * 标签页项接口
 */
export interface TabItem {
  name: string
  label: string
  content: string | HTMLElement
  icon?: string
  disabled?: boolean
}

/**
 * 布局项接口
 */
export interface LayoutItem {
  id: string
  element: HTMLElement
  data?: any
}

