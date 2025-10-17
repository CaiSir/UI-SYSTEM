import type { DemoFunction } from '../../../lib/types'

// 基础标签演示
export const createBasicLabelDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const container = (window as any).NHAIObjectFactory.createContainer()
    
    // 基础标签
    const basicLabel = (window as any).NHAIObjectFactory.createLabel('基础标签')
    basicLabel.setFontSize(14)
    basicLabel.setColor('#333')
    basicLabel.setWidth(100)
    basicLabel.setHeight(30)

    const titleLabel = (window as any).NHAIObjectFactory.createLabel('标题标签')
    titleLabel.setFontSize(18)
    titleLabel.setColor('#2c3e50')
    titleLabel.setFontWeight('bold')
    titleLabel.setWidth(120)
    titleLabel.setHeight(40)

    const subtitleLabel = (window as any).NHAIObjectFactory.createLabel('副标题标签')
    subtitleLabel.setFontSize(16)
    subtitleLabel.setColor('#7f8c8d')
    subtitleLabel.setFontWeight('normal')
    subtitleLabel.setWidth(140)
    subtitleLabel.setHeight(35)

    const bodyLabel = (window as any).NHAIObjectFactory.createLabel('正文标签')
    bodyLabel.setFontSize(14)
    bodyLabel.setColor('#34495e')
    bodyLabel.setWidth(100)
    bodyLabel.setHeight(30)

    const captionLabel = (window as any).NHAIObjectFactory.createLabel('说明文字')
    captionLabel.setFontSize(12)
    captionLabel.setColor('#95a5a6')
    captionLabel.setWidth(80)
    captionLabel.setHeight(25)

    // 使用布局组织标签
    const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(10)
    vbox.addChild(basicLabel)
    vbox.addChild(titleLabel)
    vbox.addChild(subtitleLabel)
    vbox.addChild(bodyLabel)
    vbox.addChild(captionLabel)

    container.addChild(vbox)

    demoArea.innerHTML = ''
    const element = container.render()
    demoArea.appendChild(element)
  } catch (error) {
    console.error('创建基础标签演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 样式标签演示
export const createStyledLabelDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const container = (window as any).NHAIObjectFactory.createContainer()
    
    // 不同颜色的标签
    const redLabel = (window as any).NHAIObjectFactory.createLabel('红色标签')
    redLabel.setColor('#e74c3c')
    redLabel.setFontSize(14)
    redLabel.setWidth(100)
    redLabel.setHeight(30)

    const greenLabel = (window as any).NHAIObjectFactory.createLabel('绿色标签')
    greenLabel.setColor('#27ae60')
    greenLabel.setFontSize(14)
    greenLabel.setWidth(100)
    greenLabel.setHeight(30)

    const blueLabel = (window as any).NHAIObjectFactory.createLabel('蓝色标签')
    blueLabel.setColor('#3498db')
    blueLabel.setFontSize(14)
    blueLabel.setWidth(100)
    blueLabel.setHeight(30)

    const orangeLabel = (window as any).NHAIObjectFactory.createLabel('橙色标签')
    orangeLabel.setColor('#f39c12')
    orangeLabel.setFontSize(14)
    orangeLabel.setWidth(100)
    orangeLabel.setHeight(30)

    const purpleLabel = (window as any).NHAIObjectFactory.createLabel('紫色标签')
    purpleLabel.setColor('#9b59b6')
    purpleLabel.setFontSize(14)
    purpleLabel.setWidth(100)
    purpleLabel.setHeight(30)

    // 使用布局组织标签
    const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(10)
    vbox.addChild(redLabel)
    vbox.addChild(greenLabel)
    vbox.addChild(blueLabel)
    vbox.addChild(orangeLabel)
    vbox.addChild(purpleLabel)

    container.addChild(vbox)

    demoArea.innerHTML = ''
    const element = container.render()
    demoArea.appendChild(element)
  } catch (error) {
    console.error('创建样式标签演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 综合标签演示
export const createComprehensiveLabelDemo: DemoFunction = () => {
  const demoArea = document.querySelector('.demo-area') as HTMLElement
  if (!demoArea) return

  try {
    const container = (window as any).NHAIObjectFactory.createContainer()
    
    // 基础标签
    const basicLabel = (window as any).NHAIObjectFactory.createLabel('基础标签')
    basicLabel.setFontSize(14)
    basicLabel.setColor('#333')
    basicLabel.setWidth(100)
    basicLabel.setHeight(30)

    // 标题标签
    const titleLabel = (window as any).NHAIObjectFactory.createLabel('标题标签')
    titleLabel.setFontSize(18)
    titleLabel.setColor('#2c3e50')
    titleLabel.setFontWeight('bold')
    titleLabel.setWidth(120)
    titleLabel.setHeight(40)

    // 副标题标签
    const subtitleLabel = (window as any).NHAIObjectFactory.createLabel('副标题标签')
    subtitleLabel.setFontSize(16)
    subtitleLabel.setColor('#7f8c8d')
    subtitleLabel.setFontWeight('normal')
    subtitleLabel.setWidth(140)
    subtitleLabel.setHeight(35)

    // 正文标签
    const bodyLabel = (window as any).NHAIObjectFactory.createLabel('正文标签')
    bodyLabel.setFontSize(14)
    bodyLabel.setColor('#34495e')
    bodyLabel.setWidth(100)
    bodyLabel.setHeight(30)

    // 说明文字
    const captionLabel = (window as any).NHAIObjectFactory.createLabel('说明文字')
    captionLabel.setFontSize(12)
    captionLabel.setColor('#95a5a6')
    captionLabel.setWidth(80)
    captionLabel.setHeight(25)

    // 水平布局的标签
    const leftLabel = (window as any).NHAIObjectFactory.createLabel('左对齐')
    leftLabel.setFontSize(14)
    leftLabel.setColor('#2c3e50')
    leftLabel.setWidth(80)
    leftLabel.setHeight(30)

    const centerLabel = (window as any).NHAIObjectFactory.createLabel('居中')
    centerLabel.setFontSize(14)
    centerLabel.setColor('#2c3e50')
    centerLabel.setWidth(80)
    centerLabel.setHeight(30)

    const rightLabel = (window as any).NHAIObjectFactory.createLabel('右对齐')
    rightLabel.setFontSize(14)
    rightLabel.setColor('#2c3e50')
    rightLabel.setWidth(80)
    rightLabel.setHeight(30)

    // 使用布局组织标签
    const vbox = (window as any).NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)

    const hbox = (window as any).NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(10)
    hbox.addChild(leftLabel, centerLabel, rightLabel)

    vbox.addChild(basicLabel, titleLabel, subtitleLabel, bodyLabel, captionLabel, hbox)

    container.addChild(vbox)

    demoArea.innerHTML = ''
    const element = container.render()
    demoArea.appendChild(element)
  } catch (error) {
    console.error('创建综合标签演示时出错:', error)
    demoArea.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}
