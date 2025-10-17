import type { ComponentType } from '../../../lib/types'
import { 
  createGeneralButtonDemo, 
  createTextButtonDemo, 
  createModernButtonDemo, 
  createLinkButtonDemo 
} from './ButtonDemos'

export const buttonControlsData: ComponentType = {
  name: '按钮控件',
  expanded: false,
  children: [
    {
      id: 'general-button',
      title: '通用按钮',
      description: '展示通用按钮的各种变体、尺寸和状态',
      code: `// 通用按钮示例
// 1. 按钮变体
const primaryButton = NHAIObjectFactory.createButton('主要按钮')
primaryButton.setVariant('primary')
primaryButton.setWidth(120)
primaryButton.setHeight(40)
primaryButton.setOnClick(() => alert('主要按钮被点击！'))

const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
secondaryButton.setVariant('secondary')
secondaryButton.setWidth(120)
secondaryButton.setHeight(40)

const successButton = NHAIObjectFactory.createButton('成功按钮')
successButton.setVariant('success')
successButton.setWidth(120)
successButton.setHeight(40)

const warningButton = NHAIObjectFactory.createButton('警告按钮')
warningButton.setVariant('warning')
warningButton.setWidth(120)
warningButton.setHeight(40)

const dangerButton = NHAIObjectFactory.createButton('危险按钮')
dangerButton.setVariant('danger')
dangerButton.setWidth(120)
dangerButton.setHeight(40)

// 2. 按钮尺寸
const smallButton = NHAIObjectFactory.createButton('小按钮')
smallButton.setVariant('primary')
smallButton.setWidth(80)
smallButton.setHeight(30)
smallButton.setStyle({ fontSize: '12px' })

const mediumButton = NHAIObjectFactory.createButton('中等按钮')
mediumButton.setVariant('primary')
mediumButton.setWidth(120)
mediumButton.setHeight(40)
mediumButton.setStyle({ fontSize: '14px' })

const largeButton = NHAIObjectFactory.createButton('大按钮')
largeButton.setVariant('primary')
largeButton.setWidth(160)
largeButton.setHeight(50)
largeButton.setStyle({ fontSize: '16px' })

// 使用布局组织按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(primaryButton)
hbox1.addChild(secondaryButton)
hbox1.addChild(successButton)
hbox1.addChild(warningButton)
hbox1.addChild(dangerButton)
hbox2.addChild(smallButton)
hbox2.addChild(mediumButton)
hbox2.addChild(largeButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
      createDemo: createGeneralButtonDemo
    },
    {
      id: 'text-button',
      title: '文本按钮',
      description: '展示文本按钮的样式和交互效果',
      code: `// 文本按钮示例
// 1. 基础文本按钮
const textButton1 = NHAIObjectFactory.createTextButton('文本按钮')
textButton1.setColor('#007bff')
textButton1.setSize('medium')
textButton1.setWidth(120)
textButton1.setHeight(40)
textButton1.setOnClick(() => alert('文本按钮被点击！'))

// 2. 链接样式文本按钮
const textButton2 = NHAIObjectFactory.createTextButton('链接样式')
textButton2.setColor('#007bff')
textButton2.setSize('medium')
textButton2.setUnderline(true)
textButton2.setWidth(120)
textButton2.setHeight(40)

// 3. 图标样式文本按钮
const textButton3 = NHAIObjectFactory.createTextButton('图标按钮')
textButton3.setColor('#28a745')
textButton3.setSize('medium')
textButton3.setWidth(120)
textButton3.setHeight(40)
textButton3.setStyle({
  border: '1px solid #28a745',
  borderRadius: '4px'
})

// 4. 不同尺寸的文本按钮
const smallTextButton = NHAIObjectFactory.createTextButton('小按钮')
smallTextButton.setColor('#6c757d')
smallTextButton.setSize('small')
smallTextButton.setWidth(80)
smallTextButton.setHeight(30)

const mediumTextButton = NHAIObjectFactory.createTextButton('中等按钮')
mediumTextButton.setColor('#007bff')
mediumTextButton.setSize('medium')
mediumTextButton.setWidth(120)
mediumTextButton.setHeight(40)

const largeTextButton = NHAIObjectFactory.createTextButton('大按钮')
largeTextButton.setColor('#dc3545')
largeTextButton.setSize('large')
largeTextButton.setWidth(160)
largeTextButton.setHeight(50)

// 5. 不同状态的文本按钮
const normalTextButton = NHAIObjectFactory.createTextButton('正常状态')
normalTextButton.setColor('#007bff')
normalTextButton.setSize('medium')
normalTextButton.setWidth(120)
normalTextButton.setHeight(40)

const disabledTextButton = NHAIObjectFactory.createTextButton('禁用状态')
disabledTextButton.setColor('#6c757d')
disabledTextButton.setSize('medium')
disabledTextButton.setWidth(120)
disabledTextButton.setHeight(40)
disabledTextButton.setDisabled(true)

const underlineTextButton = NHAIObjectFactory.createTextButton('下划线按钮')
underlineTextButton.setColor('#007bff')
underlineTextButton.setSize('medium')
underlineTextButton.setUnderline(true)
underlineTextButton.setWidth(120)
underlineTextButton.setHeight(40)

// 使用布局组织文本按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()
const hbox3 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(textButton1)
hbox1.addChild(textButton2)
hbox1.addChild(textButton3)
hbox2.addChild(smallTextButton)
hbox2.addChild(mediumTextButton)
hbox2.addChild(largeTextButton)
hbox3.addChild(normalTextButton)
hbox3.addChild(disabledTextButton)
hbox3.addChild(underlineTextButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)
vbox.addChild(hbox3)`,
      createDemo: createTextButtonDemo
    },
    {
      id: 'modern-button',
      title: 'ModernNHAIButton',
      description: '现代化声明式按钮组件，支持多种类型、尺寸和交互方式',
      code: `// ModernNHAIButton 示例
// 注意：需要先导入 ModernNHAIButton
// import { ModernNHAIButton } from 'nhai-framework'

// 1. 基础按钮类型
const primaryButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '主要按钮',
  onClick: () => alert('Primary Button 被点击！')
})

const defaultButton = new ModernNHAIButton({
  type: 'default',
  size: 'middle',
  children: '默认按钮',
  onClick: () => alert('Default Button 被点击！')
})

const dashedButton = new ModernNHAIButton({
  type: 'dashed',
  size: 'middle',
  children: '虚线按钮',
  onClick: () => alert('Dashed Button 被点击！')
})

const textButton = new ModernNHAIButton({
  type: 'text',
  size: 'middle',
  children: '文本按钮',
  onClick: () => alert('Text Button 被点击！')
})

const linkButton = new ModernNHAIButton({
  type: 'link',
  size: 'middle',
  children: '链接按钮',
  onClick: () => alert('Link Button 被点击！')
})

// 2. 不同尺寸
const smallButton = new ModernNHAIButton({
  type: 'primary',
  size: 'small',
  children: '小按钮',
  onClick: () => alert('Small Button 被点击！')
})

const largeButton = new ModernNHAIButton({
  type: 'primary',
  size: 'large',
  children: '大按钮',
  onClick: () => alert('Large Button 被点击！')
})

// 3. 状态按钮
const disabledButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '禁用按钮',
  disabled: true
})

const loadingButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '加载按钮',
  loading: true
})

// 4. 链接功能
const externalLinkButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '外部链接',
  href: 'https://www.baidu.com',
  target: '_blank'
})

const routerButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '路由按钮',
  href: '/home',
  router: (path) => alert('路由到: ' + path)
})

// 使用布局组织按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()
const hbox3 = NHAIObjectFactory.createHBoxLayout()
const hbox4 = NHAIObjectFactory.createHBoxLayout()

// 基础类型按钮
hbox1.addChild(primaryButton.render())
hbox1.addChild(defaultButton.render())
hbox1.addChild(dashedButton.render())
hbox1.addChild(textButton.render())
hbox1.addChild(linkButton.render())

// 尺寸按钮
hbox2.addChild(smallButton.render())
hbox2.addChild(largeButton.render())

// 状态按钮
hbox3.addChild(disabledButton.render())
hbox3.addChild(loadingButton.render())

// 链接按钮
hbox4.addChild(externalLinkButton.render())
hbox4.addChild(routerButton.render())

vbox.addChild(hbox1)
vbox.addChild(hbox2)
vbox.addChild(hbox3)
vbox.addChild(hbox4)`,
      createDemo: createModernButtonDemo
    },
    {
      id: 'link-button',
      title: '链接按钮',
      description: '展示链接样式的按钮效果',
      code: `// 链接按钮示例
// 1. 普通链接按钮
const linkButton1 = NHAIObjectFactory.createButton('普通链接')
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

// 2. 悬停链接按钮
const linkButton2 = NHAIObjectFactory.createButton('悬停链接')
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

// 3. 访问过的链接按钮
const linkButton3 = NHAIObjectFactory.createButton('访问过的链接')
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
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(15)

const hbox = NHAIObjectFactory.createHBoxLayout()
hbox.setSpacing(10)
hbox.addChild(linkButton1)
hbox.addChild(linkButton2)
hbox.addChild(linkButton3)

vbox.addChild(hbox)`,
      createDemo: createLinkButtonDemo
    }
  ]
}
