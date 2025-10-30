// 设计器相关类型定义

export interface CanvasComponent {
  id: string
  type: string
  instance: any
  element: HTMLElement
  props: any
  style: any
  isInDialog?: boolean
  parentDialogId?: string
  dialogWrapper?: HTMLElement
  dialogInstance?: any  // 对话框命令实例（仅 dialog 类型）
  gridInstance?: any    // 网格命令实例（仅 grid 类型）
  containerInstance?: any  // 容器命令实例（仅 container 类型）
  widgetInstance?: any  // Widget 窗口命令实例（仅 widget 类型）
  _renderKey?: number   // 用于强制 Vue 重新渲染的键
}

export interface DialogChildInfo {
  instance: any
  wrapper: HTMLElement
  dialogId: string
  position: { x: number; y: number }
}

export interface LayoutChildInfo {
  instance: any
  element: HTMLElement
  layoutId: string
  layoutType: 'grid' | 'container'
  position?: { x: number; y: number }
}

export interface ComponentDefinition {
  name: string
  type: string
  icon: string
  category: string
}

export interface PropertyConfig {
  key: string
  label: string
  type: string
  placeholder?: string
  options?: Array<{ value: string | number | boolean; label: string }>
}
