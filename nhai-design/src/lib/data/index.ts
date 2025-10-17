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
  }
]
