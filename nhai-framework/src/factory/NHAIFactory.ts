/**
 * NHAI框架无关的对象工厂
 */

import { NHAIObject } from '../core/NHAICore'
import { 
  NHAIButton, NHAITextButton, NHAILabel, NHAIInput, NHAICard, NHAIContainer, NHAIWindow 
} from '../components/NHAIComponents'
import { 
  NHAIVBoxLayout, NHAIHBoxLayout, NHAIGridLayout 
} from '../components/NHAILayouts/NHAILayouts'

export class NHAIObjectFactory {
  // 创建按钮
  static createButton(text: string = '', parent?: NHAIObject): NHAIButton {
    return new NHAIButton(text, parent)
  }

  // 创建文本按钮
  static createTextButton(text: string = '', parent?: NHAIObject): NHAITextButton {
    return new NHAITextButton(text, parent)
  }

  // 创建标签
  static createLabel(text: string = '', parent?: NHAIObject): NHAILabel {
    return new NHAILabel(text, parent)
  }

  // 创建输入框
  static createInput(parent?: NHAIObject): NHAIInput {
    return new NHAIInput(parent)
  }

  // 创建卡片
  static createCard(parent?: NHAIObject): NHAICard {
    return new NHAICard(parent)
  }

  // 创建容器
  static createContainer(parent?: NHAIObject): NHAIContainer {
    return new NHAIContainer(parent)
  }

  // 创建窗口
  static createWindow(title: string = '', parent?: NHAIObject): NHAIWindow {
    return new NHAIWindow(title, parent)
  }

  // 创建垂直布局
  static createVBoxLayout(parent?: NHAIObject): NHAIVBoxLayout {
    return new NHAIVBoxLayout(parent)
  }

  // 创建水平布局
  static createHBoxLayout(parent?: NHAIObject): NHAIHBoxLayout {
    return new NHAIHBoxLayout(parent)
  }

  // 创建网格布局
  static createGridLayout(parent?: NHAIObject): NHAIGridLayout {
    return new NHAIGridLayout(parent)
  }
}

// 导出工厂实例
export const nhaiFactory = NHAIObjectFactory
