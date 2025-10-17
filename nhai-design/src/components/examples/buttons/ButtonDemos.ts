import type { DemoFunction } from '../../../lib/types'

// 通用按钮演示
export const createGeneralButtonDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const container = (window as any).NHAIObjectFactory.createContainer()
    
    // 按钮变体
    const primaryButton = (window as any).NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(120)
    primaryButton.setHeight(40)
    primaryButton.setOnClick(() => alert('主要按钮被点击！'))

    const secondaryButton = (window as any).NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(120)
    secondaryButton.setHeight(40)

    const successButton = (window as any).NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(120)
    successButton.setHeight(40)

    const warningButton = (window as any).NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(120)
    warningButton.setHeight(40)

    const dangerButton = (window as any).NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(120)
    dangerButton.setHeight(40)

    // 按钮尺寸
    const smallButton = (window as any).NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })

    const mediumButton = (window as any).NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })

    const largeButton = (window as any).NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })

    // 使用布局组织按钮
    const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
    const hbox1 = (window as any).NHAIObjectFactory.createHBoxLayout()
    const hbox2 = (window as any).NHAIObjectFactory.createHBoxLayout()

    hbox1.addChild(primaryButton)
    hbox1.addChild(secondaryButton)
    hbox1.addChild(successButton)
    hbox1.addChild(warningButton)
    hbox1.addChild(dangerButton)
    hbox2.addChild(smallButton)
    hbox2.addChild(mediumButton)
    hbox2.addChild(largeButton)
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)

    container.addChild(vbox)

    demoArea.innerHTML = ''
    const element = container.render()
    demoArea.appendChild(element)
  } catch (error) {
    console.error('创建通用按钮演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 文本按钮演示
export const createTextButtonDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const container = (window as any).NHAIObjectFactory.createContainer()
    
    // 文本按钮 - 使用 createTextButton
    const textButton1 = (window as any).NHAIObjectFactory.createTextButton('文本按钮')
    textButton1.setColor('#007bff')
    textButton1.setSize('medium')
    textButton1.setWidth(120)
    textButton1.setHeight(40)
    textButton1.setOnClick(() => alert('文本按钮被点击！'))
    
    const textButton2 = (window as any).NHAIObjectFactory.createTextButton('链接样式')
    textButton2.setColor('#007bff')
    textButton2.setSize('medium')
    textButton2.setUnderline(true)
    textButton2.setWidth(120)
    textButton2.setHeight(40)
    
    const textButton3 = (window as any).NHAIObjectFactory.createTextButton('图标按钮')
    textButton3.setColor('#28a745')
    textButton3.setSize('medium')
    textButton3.setWidth(120)
    textButton3.setHeight(40)
    textButton3.setStyle({
      border: '1px solid #28a745',
      borderRadius: '4px'
    })
    
    // 不同尺寸的文本按钮
    const smallTextButton = (window as any).NHAIObjectFactory.createTextButton('小按钮')
    smallTextButton.setColor('#6c757d')
    smallTextButton.setSize('small')
    smallTextButton.setWidth(80)
    smallTextButton.setHeight(30)
    
    const mediumTextButton = (window as any).NHAIObjectFactory.createTextButton('中等按钮')
    mediumTextButton.setColor('#007bff')
    mediumTextButton.setSize('medium')
    mediumTextButton.setWidth(120)
    mediumTextButton.setHeight(40)
    
    const largeTextButton = (window as any).NHAIObjectFactory.createTextButton('大按钮')
    largeTextButton.setColor('#dc3545')
    largeTextButton.setSize('large')
    largeTextButton.setWidth(160)
    largeTextButton.setHeight(50)
    
    // 不同状态的文本按钮
    const normalTextButton = (window as any).NHAIObjectFactory.createTextButton('正常状态')
    normalTextButton.setColor('#007bff')
    normalTextButton.setSize('medium')
    normalTextButton.setWidth(120)
    normalTextButton.setHeight(40)
    
    const disabledTextButton = (window as any).NHAIObjectFactory.createTextButton('禁用状态')
    disabledTextButton.setColor('#6c757d')
    disabledTextButton.setSize('medium')
    disabledTextButton.setWidth(120)
    disabledTextButton.setHeight(40)
    disabledTextButton.setDisabled(true)
    
    const underlineTextButton = (window as any).NHAIObjectFactory.createTextButton('下划线按钮')
    underlineTextButton.setColor('#007bff')
    underlineTextButton.setSize('medium')
    underlineTextButton.setUnderline(true)
    underlineTextButton.setWidth(120)
    underlineTextButton.setHeight(40)
    
    // 使用布局组织文本按钮
    const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = (window as any).NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(textButton1)
    hbox1.addChild(textButton2)
    hbox1.addChild(textButton3)
    
    const hbox2 = (window as any).NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallTextButton)
    hbox2.addChild(mediumTextButton)
    hbox2.addChild(largeTextButton)
    
    const hbox3 = (window as any).NHAIObjectFactory.createHBoxLayout()
    hbox3.setSpacing(10)
    hbox3.addChild(normalTextButton)
    hbox3.addChild(disabledTextButton)
    hbox3.addChild(underlineTextButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    vbox.addChild(hbox3)
    
    container.addChild(vbox)

    demoArea.innerHTML = ''
    const element = container.render()
    demoArea.appendChild(element)
  } catch (error) {
    console.error('创建文本按钮演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// ModernNHAIButton 演示
export const createModernButtonDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    // 检查 ModernNHAIButton 是否可用
    if (typeof (window as any).ModernNHAIButton === 'undefined') {
      demoArea.innerHTML = `
        <div style="padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; color: #856404;">
          <h4>⚠️ ModernNHAIButton 未加载</h4>
          <p>ModernNHAIButton 组件需要从 nhai-framework 中导入。</p>
          <p>请确保已正确导入：</p>
          <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0;">
import { ModernNHAIButton } from 'nhai-framework'
          </pre>
          <p>或者使用传统按钮组件进行演示。</p>
        </div>
      `
      return
    }

    // 清空演示区域
    demoArea.innerHTML = ''
    
    // 创建演示容器
    const demoContainer = document.createElement('div')
    demoContainer.style.cssText = `
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    `
    
    // 创建 ModernNHAIButton 实例
    const primaryButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '主要按钮',
      onClick: () => alert('Primary Button 被点击！')
    })

    const defaultButton = new (window as any).ModernNHAIButton({
      type: 'default',
      size: 'middle',
      children: '默认按钮',
      onClick: () => alert('Default Button 被点击！')
    })

    const dashedButton = new (window as any).ModernNHAIButton({
      type: 'dashed',
      size: 'middle',
      children: '虚线按钮',
      onClick: () => alert('Dashed Button 被点击！')
    })

    const textButton = new (window as any).ModernNHAIButton({
      type: 'text',
      size: 'middle',
      children: '文本按钮',
      onClick: () => alert('Text Button 被点击！')
    })

    const linkButton = new (window as any).ModernNHAIButton({
      type: 'link',
      size: 'middle',
      children: '链接按钮',
      onClick: () => alert('Link Button 被点击！')
    })

    // 不同尺寸
    const smallButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'small',
      children: '小按钮',
      onClick: () => alert('Small Button 被点击！')
    })

    const largeButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'large',
      children: '大按钮',
      onClick: () => alert('Large Button 被点击！')
    })

    // 状态按钮
    const disabledButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '禁用按钮',
      disabled: true
    })

    const loadingButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '加载按钮',
      loading: true
    })

    // 链接功能
    const externalLinkButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '外部链接',
      href: 'https://www.baidu.com',
      target: '_blank'
    })

    const routerButton = new (window as any).ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '路由按钮',
      href: '/home',
      router: (path: string) => alert('路由到: ' + path)
    })

    // 创建按钮组
    const buttonGroups = [
      {
        title: '基础类型按钮',
        buttons: [primaryButton, defaultButton, dashedButton, textButton, linkButton]
      },
      {
        title: '尺寸按钮',
        buttons: [smallButton, largeButton]
      },
      {
        title: '状态按钮',
        buttons: [disabledButton, loadingButton]
      },
      {
        title: '链接功能按钮',
        buttons: [externalLinkButton, routerButton]
      }
    ]

    // 渲染按钮组
    buttonGroups.forEach(group => {
      const groupDiv = document.createElement('div')
      groupDiv.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        background: white;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `
      
      const title = document.createElement('h4')
      title.textContent = group.title
      title.style.cssText = `
        margin: 0 0 15px 0;
        color: #333;
        font-size: 16px;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      `
      
      const buttonContainer = document.createElement('div')
      buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      `
      
      group.buttons.forEach(button => {
        const buttonElement = button.render()
        if (buttonElement.tag) {
          // 创建实际的 DOM 元素
          const element = document.createElement(buttonElement.tag)
          
          // 设置属性
          if (buttonElement.props) {
            Object.keys(buttonElement.props).forEach(key => {
              if (key === 'style' && typeof buttonElement.props[key] === 'object') {
                Object.assign(element.style, buttonElement.props[key])
              } else if (key === 'onClick') {
                element.addEventListener('click', buttonElement.props[key])
              } else {
                element.setAttribute(key, buttonElement.props[key])
              }
            })
          }
          
          // 设置内容
          if (buttonElement.children) {
            element.textContent = buttonElement.children
          }
          
          buttonContainer.appendChild(element)
        }
      })
      
      groupDiv.appendChild(title)
      groupDiv.appendChild(buttonContainer)
      demoContainer.appendChild(groupDiv)
    })

    // 添加到演示区域
    demoArea.appendChild(demoContainer)
    
  } catch (error) {
    console.error('创建 ModernNHAIButton 演示时出错:', error)
    demoArea.innerHTML = `
      <div style="color: red; padding: 20px;">
        演示创建失败: ${error.message}
        <br><br>
        <strong>可能的解决方案：</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>确保已正确导入 ModernNHAIButton</li>
          <li>检查 nhai-framework 是否正确加载</li>
          <li>查看浏览器控制台获取详细错误信息</li>
        </ul>
      </div>
    `
  }
}

// 链接按钮演示
export const createLinkButtonDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const container = (window as any).NHAIObjectFactory.createContainer()
    
    // 链接按钮 - 模拟链接样式的按钮
    const linkButton1 = (window as any).NHAIObjectFactory.createButton('普通链接')
    linkButton1.setVariant('primary')
    linkButton1.setWidth(120)
    linkButton1.setHeight(40)
    linkButton1.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal'
    })
    
    const linkButton2 = (window as any).NHAIObjectFactory.createButton('悬停链接')
    linkButton2.setVariant('primary')
    linkButton2.setWidth(120)
    linkButton2.setHeight(40)
    linkButton2.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#0056b3',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal',
      transition: 'color 0.3s ease'
    })
    
    const linkButton3 = (window as any).NHAIObjectFactory.createButton('访问过的链接')
    linkButton3.setVariant('primary')
    linkButton3.setWidth(120)
    linkButton3.setHeight(40)
    linkButton3.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#6c757d',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal'
    })
    
    // 使用布局组织链接按钮
    const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox = (window as any).NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(10)
    hbox.addChild(linkButton1)
    hbox.addChild(linkButton2)
    hbox.addChild(linkButton3)
    
    vbox.addChild(hbox)
    
    container.addChild(vbox)

    demoArea.innerHTML = ''
    const element = container.render()
    demoArea.appendChild(element)
  } catch (error) {
    console.error('创建链接按钮演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error instanceof Error ? error.message : String(error)}</div>`
  }
}
