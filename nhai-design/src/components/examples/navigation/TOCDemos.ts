import type { DemoFunction } from '../../../lib/types'

// 基础目录栏演示
export const createBasicTOCDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const NHAICore = (window as any).NHAICore
    const MaterialTableOfContents = (window as any).MaterialTableOfContents

    if (!NHAICore || !MaterialTableOfContents) {
      demoArea.innerHTML = '<div style="color: red; padding: 20px;">MaterialTableOfContents 组件未加载</div>'
      return
    }

    const core = new NHAICore()
    const renderer = core.getRenderer()

    // 创建基础目录结构
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
              },
              {
                id: 'components-1-2',
                label: '输入框',
                level: 3,
                href: '#components-1-2'
              }
            ]
          },
          {
            id: 'components-2',
            label: '导航组件',
            level: 2,
            href: '#components-2'
          }
        ]
      },
      {
        id: 'api',
        label: 'API',
        level: 1,
        href: '#api',
        children: [
          {
            id: 'api-1',
            label: '核心 API',
            level: 2,
            href: '#api-1'
          }
        ]
      }
    ]

    const toc = new MaterialTableOfContents()
    toc.setItems(tocItems)
    toc.setCollapsible(true)
    toc.setDefaultExpandAll(true)
    toc.setSize('medium')
    toc.setVariant('default')

    demoArea.innerHTML = ''
    const element = toc.render(renderer)
    demoArea.appendChild(element)

    // 将 toc 实例保存到窗口，供交互使用
    ;(window as any).currentTOC = toc
  } catch (error) {
    console.error('创建基础目录栏演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 可折叠目录栏演示
export const createCollapsibleTOCDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const NHAICore = (window as any).NHAICore
    const MaterialTableOfContents = (window as any).MaterialTableOfContents

    if (!NHAICore || !MaterialTableOfContents) {
      demoArea.innerHTML = '<div style="color: red; padding: 20px;">MaterialTableOfContents 组件未加载</div>'
      return
    }

    const core = new NHAICore()
    const renderer = core.getRenderer()

    // 创建可折叠的目录结构
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
          },
          {
            id: 'chapter1-3',
            label: '性能优化',
            level: 2,
            href: '#chapter1-3',
            children: [
              {
                id: 'chapter1-3-1',
                label: '渲染优化',
                level: 3,
                href: '#chapter1-3-1'
              },
              {
                id: 'chapter1-3-2',
                label: '内存管理',
                level: 3,
                href: '#chapter1-3-2'
              }
            ]
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
          },
          {
            id: 'chapter2-2',
            label: '高级功能',
            level: 2,
            href: '#chapter2-2'
          }
        ]
      }
    ]

    const toc = new MaterialTableOfContents()
    toc.setItems(tocItems)
    toc.setCollapsible(true)
    toc.setDefaultExpandAll(false)
    toc.setSize('medium')
    toc.setVariant('default')

    // 添加控制按钮
    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px;'

    const controls = document.createElement('div')
    controls.style.cssText = 'margin-bottom: 20px; display: flex; gap: 10px;'

    const expandBtn = document.createElement('button')
    expandBtn.textContent = '展开全部'
    expandBtn.onclick = () => toc.expandAll()
    controls.appendChild(expandBtn)

    const collapseBtn = document.createElement('button')
    collapseBtn.textContent = '折叠全部'
    collapseBtn.onclick = () => toc.collapseAll()
    controls.appendChild(collapseBtn)

    container.appendChild(controls)

    const tocElement = toc.render(renderer)
    container.appendChild(tocElement)

    demoArea.innerHTML = ''
    demoArea.appendChild(container)

    ;(window as any).currentTOC = toc
  } catch (error) {
    console.error('创建可折叠目录栏演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 多种样式目录栏演示
export const createStyledTOCDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const NHAICore = (window as any).NHAICore
    const MaterialTableOfContents = (window as any).MaterialTableOfContents

    if (!NHAICore || !MaterialTableOfContents) {
      demoArea.innerHTML = '<div style="color: red; padding: 20px;">MaterialTableOfContents 组件未加载</div>'
      return
    }

    const core = new NHAICore()
    const renderer = core.getRenderer()

    const tocItems = [
      {
        id: 'item1',
        label: '文档导航',
        level: 1,
        href: '#item1',
        children: [
          {
            id: 'item1-1',
            label: '快速入门',
            level: 2,
            href: '#item1-1'
          }
        ]
      },
      {
        id: 'item2',
        label: '组件库',
        level: 1,
        href: '#item2',
        children: [
          {
            id: 'item2-1',
            label: '基础组件',
            level: 2,
            href: '#item2-1'
          },
          {
            id: 'item2-2',
            label: '布局组件',
            level: 2,
            href: '#item2-2'
          }
        ]
      }
    ]

    const container = document.createElement('div')
    container.style.cssText = 'padding: 20px;'

    // 创建样式选择器
    const styleSelector = document.createElement('div')
    styleSelector.style.cssText = 'margin-bottom: 20px;'

    const label = document.createElement('label')
    label.textContent = '选择样式: '
    label.style.cssText = 'margin-right: 10px;'

    const select = document.createElement('select')
    select.innerHTML = `
      <option value="default">默认</option>
      <option value="bordered">边框</option>
      <option value="compact">紧凑</option>
    `
    select.style.cssText = 'padding: 5px 10px; border-radius: 4px; border: 1px solid #ddd;'

    styleSelector.appendChild(label)
    styleSelector.appendChild(select)

    container.appendChild(styleSelector)

    // 创建尺寸选择器
    const sizeSelector = document.createElement('div')
    sizeSelector.style.cssText = 'margin-bottom: 20px;'

    const sizeLabel = document.createElement('label')
    sizeLabel.textContent = '选择尺寸: '
    sizeLabel.style.cssText = 'margin-right: 10px;'

    const sizeSelect = document.createElement('select')
    sizeSelect.innerHTML = `
      <option value="small">小</option>
      <option value="medium" selected>中</option>
      <option value="large">大</option>
    `
    sizeSelect.style.cssText = 'padding: 5px 10px; border-radius: 4px; border: 1px solid #ddd;'

    sizeSelector.appendChild(sizeLabel)
    sizeSelector.appendChild(sizeSelect)

    container.appendChild(sizeSelector)

    // 创建目录栏
    const toc = new MaterialTableOfContents()
    toc.setItems(tocItems)
    toc.setCollapsible(true)
    toc.setDefaultExpandAll(true)
    toc.setVariant('default')
    toc.setSize('medium')

    const tocContainer = document.createElement('div')
    const tocElement = toc.render(renderer)
    tocContainer.appendChild(tocElement)
    container.appendChild(tocContainer)

    // 添加交互
    select.onchange = () => {
      toc.setVariant(select.value as any)
      tocContainer.innerHTML = ''
      const newElement = toc.render(renderer)
      tocContainer.appendChild(newElement)
    }

    sizeSelect.onchange = () => {
      toc.setSize(sizeSelect.value as any)
      tocContainer.innerHTML = ''
      const newElement = toc.render(renderer)
      tocContainer.appendChild(newElement)
    }

    demoArea.innerHTML = ''
    demoArea.appendChild(container)

    ;(window as any).currentTOC = toc
  } catch (error) {
    console.error('创建多种样式目录栏演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

