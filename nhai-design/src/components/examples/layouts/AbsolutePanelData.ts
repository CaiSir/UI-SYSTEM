import type { ComponentType } from '../../../lib/types'

export const absolutePanelData: ComponentType = {
  name: '绝对定位面板 (AbsolutePanel)',
  expanded: false,
  children: [
    {
      id: 'absolute-panel-basic',
      title: '基础绝对定位',
      description: '使用 AbsolutePanelCommand 创建绝对定位容器，自由放置组件',
      code: `// 基础绝对定位面板示例
import { AbsolutePanelCommand, VueButtonCommand } from 'nhai-ui-vue'

// 创建绝对定位面板
const panel = new AbsolutePanelCommand('800px', '600px')
panel.setBackgroundColor('#f0f0f0')

// 添加按钮到指定位置
const button1 = new VueButtonCommand('按钮 1')
button1.setType('primary')
panel.addWidgetAt('btn1', button1, { x: 50, y: 50 }, { width: 100, height: 40 })

const button2 = new VueButtonCommand('按钮 2')
button2.setType('success')
panel.addWidgetAt('btn2', button2, { x: 200, y: 50 }, { width: 100, height: 40 })

const button3 = new VueButtonCommand('按钮 3')
button3.setType('warning')
panel.addWidgetAt('btn3', button3, { x: 50, y: 150 }, { width: 100, height: 40 })

// 渲染面板
return panel.render()`,
      createDemo: () => {
        const demoArea = document.querySelector('.demo-area') as HTMLElement
        if (!demoArea) return
        
        try {
          const AbsolutePanelCommand = (window as any).AbsolutePanelCommand
          const VueButtonCommand = (window as any).VueButtonCommand

          if (!AbsolutePanelCommand || !VueButtonCommand) {
            demoArea.innerHTML = `<div style="color: red; padding: 20px;">需要安装 nhai-ui-vue 包</div>`
            return
          }

          const panel = new AbsolutePanelCommand('800px', '600px')
          panel.setBackgroundColor('#f0f0f0')

          const button1 = new VueButtonCommand('按钮 1')
          button1.setType('primary')
          panel.addWidgetAt('btn1', button1, { x: 50, y: 50 }, { width: 100, height: 40 })

          const button2 = new VueButtonCommand('按钮 2')
          button2.setType('success')
          panel.addWidgetAt('btn2', button2, { x: 200, y: 50 }, { width: 100, height: 40 })

          const button3 = new VueButtonCommand('按钮 3')
          button3.setType('warning')
          panel.addWidgetAt('btn3', button3, { x: 50, y: 150 }, { width: 100, height: 40 })

          demoArea.innerHTML = ''
          const element = panel.render()
          demoArea.appendChild(element)
        } catch (error) {
          console.error('创建绝对定位面板演示时出错:', error)
          demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
        }
      }
    },
    {
      id: 'absolute-panel-multi-components',
      title: '多组件绝对定位',
      description: '使用 AbsolutePanelCommand 管理多个不同类型组件的绝对定位',
      code: `// 多组件绝对定位示例
import { AbsolutePanelCommand, VueButtonCommand, VueInputCommand, VueSelectCommand } from 'nhai-ui-vue'

const panel = new AbsolutePanelCommand('100%', '700px')
panel.setBackgroundColor('#f5f5f5')

// 添加按钮
const button1 = new VueButtonCommand('主要按钮')
button1.setType('primary')
panel.addWidgetAt('btn1', button1, { x: 50, y: 50 }, { width: 120, height: 40 })

// 添加输入框
const input = new VueInputCommand()
input.setPlaceholder('请输入文本...')
panel.addWidgetAt('input1', input, { x: 50, y: 120 }, { width: 250, height: 40 })

// 添加选择框
const select = new VueSelectCommand()
select.setOptions([
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' }
])
select.setPlaceholder('请选择...')
panel.addWidgetAt('select1', select, { x: 50, y: 190 }, { width: 250, height: 40 })

// 添加更多按钮
for (let i = 0; i < 5; i++) {
  const btn = new VueButtonCommand(\`按钮 \${i + 1}\`)
  btn.setType(i % 2 === 0 ? 'primary' : 'success')
  panel.addWidgetAt(\`btn\${i}\`, btn, { x: 50 + i * 140, y: 270 }, { width: 100, height: 40 })
}

return panel.render()`,
      createDemo: () => {
        const demoArea = document.querySelector('.demo-area') as HTMLElement
        if (!demoArea) return
        
        try {
          const AbsolutePanelCommand = (window as any).AbsolutePanelCommand
          const VueButtonCommand = (window as any).VueButtonCommand
          const VueInputCommand = (window as any).VueInputCommand
          const VueSelectCommand = (window as any).VueSelectCommand

          if (!AbsolutePanelCommand || !VueButtonCommand || !VueInputCommand || !VueSelectCommand) {
            demoArea.innerHTML = `<div style="color: red; padding: 20px;">需要安装 nhai-ui-vue 包</div>`
            return
          }

          const panel = new AbsolutePanelCommand('100%', '700px')
          panel.setBackgroundColor('#f5f5f5')

          const button1 = new VueButtonCommand('主要按钮')
          button1.setType('primary')
          panel.addWidgetAt('btn1', button1, { x: 50, y: 50 }, { width: 120, height: 40 })

          const input = new VueInputCommand()
          input.setPlaceholder('请输入文本...')
          panel.addWidgetAt('input1', input, { x: 50, y: 120 }, { width: 250, height: 40 })

          const select = new VueSelectCommand()
          select.setOptions([
            { label: '选项 1', value: '1' },
            { label: '选项 2', value: '2' },
            { label: '选项 3', value: '3' }
          ])
          select.setPlaceholder('请选择...')
          panel.addWidgetAt('select1', select, { x: 50, y: 190 }, { width: 250, height: 40 })

          for (let i = 0; i < 5; i++) {
            const btn = new VueButtonCommand(`按钮 ${i + 1}`)
            btn.setType(i % 2 === 0 ? 'primary' : 'success')
            panel.addWidgetAt(`btn${i}`, btn, { x: 50 + i * 140, y: 270 }, { width: 100, height: 40 })
          }

          demoArea.innerHTML = ''
          const element = panel.render()
          demoArea.appendChild(element)
        } catch (error) {
          console.error('创建多组件绝对定位演示时出错:', error)
          demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
        }
      }
    },
    {
      id: 'absolute-panel-dynamic',
      title: '动态定位和大小调整',
      description: '展示如何动态更新组件的位置和大小',
      code: `// 动态定位示例
import { AbsolutePanelCommand, VueButtonCommand } from 'nhai-ui-vue'

const panel = new AbsolutePanelCommand('100%', '500px')
panel.setBackgroundColor('#e8f4f8')

// 创建多个按钮
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    const btn = new VueButtonCommand(\`(\${row},\${col})\`)
    btn.setType('primary')
    const x = 50 + col * 120
    const y = 50 + row * 60
    panel.addWidgetAt(\`btn-\${row}-\${col}\`, btn, { x, y }, { width: 100, height: 40 })
  }
}

// 更新特定组件的位置
const position = panel.getPosition('btn-1-2')
console.log('btn-1-2 的位置:', position)

// 动态调整组件大小
const size = panel.getSize('btn-2-1')
console.log('btn-2-1 的大小:', size)

return panel.render()`,
      createDemo: () => {
        const demoArea = document.querySelector('.demo-area') as HTMLElement
        if (!demoArea) return
        
        try {
          const AbsolutePanelCommand = (window as any).AbsolutePanelCommand
          const VueButtonCommand = (window as any).VueButtonCommand

          if (!AbsolutePanelCommand || !VueButtonCommand) {
            demoArea.innerHTML = `<div style="color: red; padding: 20px;">需要安装 nhai-ui-vue 包</div>`
            return
          }

          const panel = new AbsolutePanelCommand('100%', '500px')
          panel.setBackgroundColor('#e8f4f8')

          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
              const btn = new VueButtonCommand(`(${row},${col})`)
              btn.setType('primary')
              const x = 50 + col * 120
              const y = 50 + row * 60
              panel.addWidgetAt(`btn-${row}-${col}`, btn, { x, y }, { width: 100, height: 40 })
            }
          }

          demoArea.innerHTML = ''
          const element = panel.render()
          demoArea.appendChild(element)
        } catch (error) {
          console.error('创建动态定位演示时出错:', error)
          demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
        }
      }
    }
  ]
}

