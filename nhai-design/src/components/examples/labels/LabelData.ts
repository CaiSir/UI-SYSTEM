import type { ComponentType } from '../../../lib/types'
import { 
  createBasicLabelDemo, 
  createStyledLabelDemo, 
  createComprehensiveLabelDemo 
} from './LabelDemos'

export const labelControlsData: ComponentType = {
  name: '标签控件',
  expanded: false,
  children: [
    {
      id: 'basic-label',
      title: '基础标签',
      description: '展示基础标签的样式和属性',
      code: `// 基础标签示例
const basicLabel = NHAIObjectFactory.createLabel('基础标签')
basicLabel.setFontSize(14)
basicLabel.setColor('#333')
basicLabel.setWidth(100)
basicLabel.setHeight(30)

const titleLabel = NHAIObjectFactory.createLabel('标题标签')
titleLabel.setFontSize(18)
titleLabel.setColor('#2c3e50')
titleLabel.setFontWeight('bold')
titleLabel.setWidth(120)
titleLabel.setHeight(40)

const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
subtitleLabel.setFontSize(16)
subtitleLabel.setColor('#7f8c8d')
subtitleLabel.setFontWeight('normal')
subtitleLabel.setWidth(140)
subtitleLabel.setHeight(35)

const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
bodyLabel.setFontSize(14)
bodyLabel.setColor('#34495e')
bodyLabel.setWidth(100)
bodyLabel.setHeight(30)

const captionLabel = NHAIObjectFactory.createLabel('说明文字')
captionLabel.setFontSize(12)
captionLabel.setColor('#95a5a6')
captionLabel.setWidth(80)
captionLabel.setHeight(25)

// 使用布局组织标签
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(10)
vbox.addChild(basicLabel)
vbox.addChild(titleLabel)
vbox.addChild(subtitleLabel)
vbox.addChild(bodyLabel)
vbox.addChild(captionLabel)`,
      createDemo: createBasicLabelDemo
    },
    {
      id: 'styled-label',
      title: '样式标签',
      description: '展示不同颜色和样式的标签',
      code: `// 样式标签示例
const redLabel = NHAIObjectFactory.createLabel('红色标签')
redLabel.setColor('#e74c3c')
redLabel.setFontSize(14)
redLabel.setWidth(100)
redLabel.setHeight(30)

const greenLabel = NHAIObjectFactory.createLabel('绿色标签')
greenLabel.setColor('#27ae60')
greenLabel.setFontSize(14)
greenLabel.setWidth(100)
greenLabel.setHeight(30)

const blueLabel = NHAIObjectFactory.createLabel('蓝色标签')
blueLabel.setColor('#3498db')
blueLabel.setFontSize(14)
blueLabel.setWidth(100)
blueLabel.setHeight(30)

const orangeLabel = NHAIObjectFactory.createLabel('橙色标签')
orangeLabel.setColor('#f39c12')
orangeLabel.setFontSize(14)
orangeLabel.setWidth(100)
orangeLabel.setHeight(30)

const purpleLabel = NHAIObjectFactory.createLabel('紫色标签')
purpleLabel.setColor('#9b59b6')
purpleLabel.setFontSize(14)
purpleLabel.setWidth(100)
purpleLabel.setHeight(30)

// 使用布局组织标签
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(10)
vbox.addChild(redLabel)
vbox.addChild(greenLabel)
vbox.addChild(blueLabel)
vbox.addChild(orangeLabel)
vbox.addChild(purpleLabel)`,
      createDemo: createStyledLabelDemo
    },
    {
      id: 'comprehensive-label',
      title: '综合标签',
      description: '展示标签的综合应用和布局',
      code: `// 综合标签示例
const basicLabel = NHAIObjectFactory.createLabel('基础标签')
basicLabel.setFontSize(14)
basicLabel.setColor('#333')
basicLabel.setWidth(100)
basicLabel.setHeight(30)

const titleLabel = NHAIObjectFactory.createLabel('标题标签')
titleLabel.setFontSize(18)
titleLabel.setColor('#2c3e50')
titleLabel.setFontWeight('bold')
titleLabel.setWidth(120)
titleLabel.setHeight(40)

const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
subtitleLabel.setFontSize(16)
subtitleLabel.setColor('#7f8c8d')
subtitleLabel.setFontWeight('normal')
subtitleLabel.setWidth(140)
subtitleLabel.setHeight(35)

const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
bodyLabel.setFontSize(14)
bodyLabel.setColor('#34495e')
bodyLabel.setWidth(100)
bodyLabel.setHeight(30)

const captionLabel = NHAIObjectFactory.createLabel('说明文字')
captionLabel.setFontSize(12)
captionLabel.setColor('#95a5a6')
captionLabel.setWidth(80)
captionLabel.setHeight(25)

// 水平布局的标签
const leftLabel = NHAIObjectFactory.createLabel('左对齐')
leftLabel.setFontSize(14)
leftLabel.setColor('#2c3e50')
leftLabel.setWidth(80)
leftLabel.setHeight(30)

const centerLabel = NHAIObjectFactory.createLabel('居中')
centerLabel.setFontSize(14)
centerLabel.setColor('#2c3e50')
centerLabel.setWidth(80)
centerLabel.setHeight(30)

const rightLabel = NHAIObjectFactory.createLabel('右对齐')
rightLabel.setFontSize(14)
rightLabel.setColor('#2c3e50')
rightLabel.setWidth(80)
rightLabel.setHeight(30)

// 使用布局组织标签
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(15)

const hbox = NHAIObjectFactory.createHBoxLayout()
hbox.setSpacing(10)
hbox.addChild(leftLabel, centerLabel, rightLabel)

vbox.addChild(basicLabel, titleLabel, subtitleLabel, bodyLabel, captionLabel, hbox)`,
      createDemo: createComprehensiveLabelDemo
    }
  ]
}
