// 示例数据类型定义
export interface ExampleItem {
  id: string
  title: string
  description: string
  code: string
  createDemo: () => void
}

export interface ComponentType {
  name: string
  expanded: boolean
  children: ExampleItem[]
}

export interface Category {
  name: string
  expanded: boolean
  children: ComponentType[]
}

// 框架类型定义
export interface Framework {
  name: string
  label: string
}

// 演示函数类型
export type DemoFunction = () => void
