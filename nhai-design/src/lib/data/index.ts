import type { Category } from '../types'
import { buttonControlsData } from './components/buttons/ButtonData'
import { labelControlsData } from './components/labels/LabelData'

// 树形目录数据
export const treeData: Category[] = [
  {
    name: '基础控件',
    expanded: false,
    children: [
      buttonControlsData,
      labelControlsData,
      {
        name: '输入框控件',
        expanded: false,
        children: [
          {
            id: 'basic-input',
            title: '基础输入框',
            description: '展示基础输入框的样式和功能',
            code: `// 基础输入框示例
const input = NHAIObjectFactory.createInput()
input.setPlaceholder('请输入内容')
input.setWidth(200)
input.setHeight(40)
input.setStyle({
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '8px 12px',
  fontSize: '14px'
})

// 添加到容器
const container = NHAIObjectFactory.createContainer()
container.addChild(input)`,
            createDemo: () => {
              const demoArea = document.querySelector('.demo-area') as HTMLElement
              if (!demoArea) return
              
              try {
                const container = (window as any).NHAIObjectFactory.createContainer()
                const input = (window as any).NHAIObjectFactory.createInput()
                input.setPlaceholder('请输入内容')
                input.setWidth(200)
                input.setHeight(40)
                input.setStyle({
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '14px'
                })
                
                container.addChild(input)
                
                demoArea.innerHTML = ''
                const element = container.render()
                demoArea.appendChild(element)
              } catch (error) {
                console.error('创建基础输入框演示时出错:', error)
                demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      },
      {
        name: '布局控件',
        expanded: false,
        children: [
          {
            id: 'basic-layout',
            title: '基础布局',
            description: '展示基础布局控件的使用',
            code: `// 基础布局示例
const container = NHAIObjectFactory.createContainer()
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox = NHAIObjectFactory.createHBoxLayout()

// 创建一些子元素
const label1 = NHAIObjectFactory.createLabel('标签1')
const label2 = NHAIObjectFactory.createLabel('标签2')
const button = NHAIObjectFactory.createButton('按钮')

// 添加到布局
hbox.addChild(label1, label2)
vbox.addChild(hbox, button)
container.addChild(vbox)`,
            createDemo: () => {
              const demoArea = document.querySelector('.demo-area') as HTMLElement
              if (!demoArea) return
              
              try {
                const container = (window as any).NHAIObjectFactory.createContainer()
                const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
                const hbox = (window as any).NHAIObjectFactory.createHBoxLayout()
                
                const label1 = (window as any).NHAIObjectFactory.createLabel('标签1')
                const label2 = (window as any).NHAIObjectFactory.createLabel('标签2')
                const button = (window as any).NHAIObjectFactory.createButton('按钮')
                
                hbox.addChild(label1, label2)
                vbox.addChild(hbox, button)
                container.addChild(vbox)
                
                demoArea.innerHTML = ''
                const element = container.render()
                demoArea.appendChild(element)
              } catch (error) {
                console.error('创建基础布局演示时出错:', error)
                demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: '高级控件',
    expanded: false,
    children: [
      {
        name: '容器控件',
        expanded: false,
        children: [
          {
            id: 'basic-container',
            title: '基础容器',
            description: '展示基础容器的使用',
            code: `// 基础容器示例
const container = NHAIObjectFactory.createContainer()
container.setStyle({
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  backgroundColor: '#f8f9fa'
})

// 添加子元素
const label = NHAIObjectFactory.createLabel('容器内容')
const button = NHAIObjectFactory.createButton('容器按钮')

container.addChild(label, button)`,
            createDemo: () => {
              const demoArea = document.querySelector('.demo-area') as HTMLElement
              if (!demoArea) return
              
              try {
                const container = (window as any).NHAIObjectFactory.createContainer()
                container.setStyle({
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa'
                })
                
                const label = (window as any).NHAIObjectFactory.createLabel('容器内容')
                const button = (window as any).NHAIObjectFactory.createButton('容器按钮')
                
                container.addChild(label, button)
                
                demoArea.innerHTML = ''
                const element = container.render()
                demoArea.appendChild(element)
              } catch (error) {
                console.error('创建基础容器演示时出错:', error)
                demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      },
      {
        name: '窗口控件',
        expanded: false,
        children: [
          {
            id: 'basic-window',
            title: '基础窗口',
            description: '展示基础窗口的使用',
            code: `// 基础窗口示例
const window = NHAIObjectFactory.createWindow()
window.setTitle('示例窗口')
window.setWidth(300)
window.setHeight(200)

// 添加内容
const label = NHAIObjectFactory.createLabel('窗口内容')
window.addChild(label)`,
            createDemo: () => {
              const demoArea = document.querySelector('.demo-area') as HTMLElement
              if (!demoArea) return
              
              try {
                const window = (window as any).NHAIObjectFactory.createWindow()
                window.setTitle('示例窗口')
                window.setWidth(300)
                window.setHeight(200)
                
                const label = (window as any).NHAIObjectFactory.createLabel('窗口内容')
                window.addChild(label)
                
                demoArea.innerHTML = ''
                const element = window.render()
                demoArea.appendChild(element)
              } catch (error) {
                console.error('创建基础窗口演示时出错:', error)
                demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      }
    ]
  },
  {
    name: '专业控件',
    expanded: false,
    children: [
      {
        name: '组件组合器',
        expanded: false,
        children: [
          {
            id: 'component-composer',
            title: '组件组合器',
            description: '可视化组件组合和设计工具',
            code: `// 组件组合器示例
import { NHAIComponentComposer } from 'nhai-framework'

// 创建组件组合器
const composer = new NHAIComponentComposer({
  rootPath: '/components',
  allowedTypes: ['button', 'input', 'container', 'layout'],
  enableDragDrop: true,
  enablePropertyEdit: true,
  enableTemplateSave: true,
  enableMultiSelect: true,
  showToolbar: true,
  showComponentPalette: true,
  showPropertyPanel: true,
  canvasWidth: 800,
  canvasHeight: 600,
  gridSize: 20,
  snapToGrid: true
})

// 渲染组合器
const element = composer.render()
document.body.appendChild(element)

// 监听事件
composer.on('componentAdded', (data) => {
  console.log('组件已添加:', data.component)
})

composer.on('templateSaved', (data) => {
  console.log('模板已保存:', data.template)
})`,
            createDemo: () => {
              const demoArea = document.querySelector('.demo-area') as HTMLElement
              if (!demoArea) return
              
              try {
                // 创建组件组合器
                const composer = new (window as any).NHAIComponentComposer({
                  rootPath: '/components',
                  allowedTypes: ['button', 'input', 'container', 'layout'],
                  enableDragDrop: true,
                  enablePropertyEdit: true,
                  enableTemplateSave: true,
                  enableMultiSelect: true,
                  showToolbar: true,
                  showComponentPalette: true,
                  showPropertyPanel: true,
                  canvasWidth: 600,
                  canvasHeight: 400,
                  gridSize: 20,
                  snapToGrid: true
                })
                
                // 渲染组合器
                demoArea.innerHTML = ''
                const element = composer.render()
                demoArea.appendChild(element)
                
                // 监听事件
                composer.addEventListener('componentAdded', (data: any) => {
                  console.log('组件已添加:', data.detail.component)
                })
                
                composer.addEventListener('templateSaved', (data: any) => {
                  console.log('模板已保存:', data.detail.template)
                  alert(`模板 "${data.detail.template.name}" 已保存成功！`)
                })
                
              } catch (error) {
                console.error('创建组件组合器演示时出错:', error)
                demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error instanceof Error ? error.message : String(error)}</div>`
              }
            }
          }
        ]
      }
    ]
  }
]
