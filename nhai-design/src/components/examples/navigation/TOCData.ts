import type { ComponentType } from '../../../lib/types'
import {
  createBasicTOCDemo,
  createCollapsibleTOCDemo,
  createStyledTOCDemo
} from './TOCDemos'

export const tocComponentData: ComponentType = {
  name: '目录栏',
  expanded: false,
  children: [
    {
      id: 'basic-toc',
      title: '基础目录栏',
      description: '展示基本的目录栏结构和使用方法',
      code: `// 基础目录栏示例
// 1. 导入必要的模块
import { NHAICore } from 'nhai-framework'
import { MaterialTableOfContents } from 'nhai-framework'

// 2. 初始化核心
const core = new NHAICore()

// 3. 定义目录结构
const tocItems = [
  {
    id: 'intro',
    label: '介绍',
    level: 1,
    href: '#intro',
    children: [
      {
        id: 'intro-1',
        label: '快速开始',
        level: 2,
        href: '#intro-1'
      },
      {
        id: 'intro-2',
        label: '安装指南',
        level: 2,
        href: '#intro-2'
      }
    ]
  },
  {
    id: 'components',
    label: '组件',
    level: 1,
    href: '#components',
    children: [
      {
        id: 'components-1',
        label: '基础组件',
        level: 2,
        href: '#components-1',
        children: [
          {
            id: 'components-1-1',
            label: '按钮',
            level: 3,
            href: '#components-1-1'
          }
        ]
      }
    ]
  }
]

// 4. 创建目录栏实例
const toc = new MaterialTableOfContents()
toc.setItems(tocItems)
toc.setCollapsible(true)
toc.setDefaultExpandAll(true)
toc.setSize('medium')
toc.setVariant('default')

// 5. 渲染组件
const renderer = core.getRenderer()
const element = toc.render(renderer)
container.appendChild(element)

// 6. 控制方法
toc.expandAll()              // 展开所有项
toc.collapseAll()            // 折叠所有项
toc.toggleExpand('intro')    // 切换指定项的展开/折叠
toc.setActiveKey('intro')    // 设置当前活动项`,
      createDemo: createBasicTOCDemo
    },
    {
      id: 'collapsible-toc',
      title: '可折叠目录栏',
      description: '展示可折叠目录栏的交互功能',
      code: `// 可折叠目录栏示例
import { MaterialTableOfContents } from 'nhai-framework'

const tocItems = [
  {
    id: 'chapter1',
    label: '第一章：NHAI 框架介绍',
    level: 1,
    href: '#chapter1',
    children: [
      {
        id: 'chapter1-1',
        label: '核心特性',
        level: 2,
        href: '#chapter1-1'
      },
      {
        id: 'chapter1-2',
        label: '架构设计',
        level: 2,
        href: '#chapter1-2'
      }
    ]
  },
  {
    id: 'chapter2',
    label: '第二章：目录栏组件',
    level: 1,
    href: '#chapter2',
    children: [
      {
        id: 'chapter2-1',
        label: '基本用法',
        level: 2,
        href: '#chapter2-1'
      }
    ]
  }
]

const toc = new MaterialTableOfContents()
toc.setItems(tocItems)
toc.setCollapsible(true)           // 启用折叠功能
toc.setDefaultExpandAll(false)      // 默认不展开
toc.setSize('medium')

// 交互控制
const expandBtn = document.createElement('button')
expandBtn.textContent = '展开全部'
expandBtn.onclick = () => toc.expandAll()

const collapseBtn = document.createElement('button')
collapseBtn.textContent = '折叠全部'
collapseBtn.onclick = () => toc.collapseAll()

// 展开/折叠特定项
toc.expand('chapter1')        // 展开指定项
toc.collapse('chapter1')      // 折叠指定项
toc.toggleExpand('chapter1')   // 切换状态`,
      createDemo: createCollapsibleTOCDemo
    },
    {
      id: 'styled-toc',
      title: '多种样式目录栏',
      description: '展示目录栏的不同样式和尺寸',
      code: `// 多种样式目录栏示例
const toc = new MaterialTableOfContents()

// 设置基本属性
toc.setItems(tocItems)
toc.setCollapsible(true)

// 1. 样式变体
toc.setVariant('default')    // 默认样式
toc.setVariant('bordered')   // 边框样式（活动项左侧边框）
toc.setVariant('compact')   // 紧凑样式

// 2. 尺寸大小
toc.setSize('small')         // 小尺寸
toc.setSize('medium')        // 中等尺寸（默认）
toc.setSize('large')         // 大尺寸

// 3. 缩进设置
toc.setIndentSize(16)        // 设置每级缩进大小（像素）

// 4. 活动项设置
toc.setActiveKey('intro')    // 设置当前活动项

// 5. 事件处理
toc.setOnItemClick((item, index) => {
  console.log('点击了:', item.label)
  console.log('索引:', index)
})

// 动态切换样式
const styleSelector = document.createElement('select')
styleSelector.innerHTML = \`
  <option value="default">默认</option>
  <option value="bordered">边框</option>
  <option value="compact">紧凑</option>
\`

styleSelector.onchange = () => {
  toc.setVariant(styleSelector.value)
  // 重新渲染
  updateTOC()
}`,
      createDemo: createStyledTOCDemo
    }
  ]
}

