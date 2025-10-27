/**
 * UI 辅助类 - 封装 DOM 操作，让调用者无需关心 document.createElement
 * 提供简洁的 API 创建常见元素
 */
export class UIHelpers {
  /**
   * 创建文本元素
   */
  static createText(content: string): HTMLElement {
    const div = document.createElement('div')
    div.textContent = content
    return div
  }

  /**
   * 创建带样式的文本元素
   */
  static createStyledText(content: string, styles: Record<string, string>): HTMLElement {
    const div = document.createElement('div')
    div.textContent = content
    Object.assign(div.style, styles)
    return div
  }

  /**
   * 创建分隔符
   */
  static createSeparator(orientation: 'horizontal' | 'vertical' = 'vertical'): HTMLElement {
    const div = document.createElement('div')
    if (orientation === 'vertical') {
      div.style.width = '1px'
      div.style.background = '#ddd'
      div.style.margin = '0 8px'
    } else {
      div.style.height = '1px'
      div.style.background = '#ddd'
      div.style.margin = '8px 0'
    }
    return div
  }

  /**
   * 创建标题
   */
  static createHeading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 3): HTMLElement {
    const heading = document.createElement(`h${level}`)
    heading.textContent = text
    return heading
  }

  /**
   * 创建段落
   */
  static createParagraph(text: string): HTMLElement {
    const p = document.createElement('p')
    p.textContent = text
    return p
  }

  /**
   * 创建占位符
   */
  static createSpacer(size?: string): HTMLElement {
    const div = document.createElement('div')
    if (size) {
      div.style.width = size
      div.style.height = size
    }
    return div
  }

  /**
   * 创建空白行
   */
  static createBlankLine(): HTMLElement {
    return document.createElement('br')
  }

  /**
   * 内部方法：创建通用元素（不对外暴露）
   * 只能通过组件内部使用
   */
  static _createElement(tag: string, content?: string, props?: Record<string, any>): HTMLElement {
    const element = document.createElement(tag)
    
    // 默认样式：盒模型
    element.style.boxSizing = 'border-box'
    
    if (content) {
      element.textContent = content
    }
    
    if (props) {
      if (props.className) {
        element.className = props.className
      }
      
      if (props.style) {
        // 自定义样式会覆盖默认样式
        Object.assign(element.style, props.style)
      }
      
      if (props.id) {
        element.id = props.id
      }
      
      // 设置其他属性
      Object.keys(props).forEach(key => {
        if (!['className', 'style', 'id'].includes(key)) {
          element.setAttribute(key, props[key])
        }
      })
    }
    
    return element
  }

  /**
   * 创建行内元素
   */
  static createSpan(text: string, styles?: Record<string, string>): HTMLElement {
    const span = document.createElement('span')
    span.textContent = text
    if (styles) {
      Object.assign(span.style, styles)
    }
    return span
  }

  /**
   * 创建链接
   */
  static createLink(text: string, href: string, target: '_blank' | '_self' = '_blank'): HTMLElement {
    const a = document.createElement('a')
    a.textContent = text
    a.href = href
    a.target = target
    return a
  }

  /**
   * 创建图标占位符
   */
  static createIcon(name: string, size: number = 16): HTMLElement {
    const div = document.createElement('div')
    div.textContent = `[${name}]`
    div.style.width = `${size}px`
    div.style.height = `${size}px`
    div.style.display = 'inline-block'
    div.style.textAlign = 'center'
    div.style.fontSize = `${size}px`
    return div
  }

  /**
   * 创建状态指示器
   */
  static createStatus(text: string, color: string): HTMLElement {
    const div = document.createElement('div')
    div.textContent = text
    div.style.padding = '4px 12px'
    div.style.borderRadius = '4px'
    div.style.backgroundColor = color
    div.style.color = 'white'
    div.style.fontSize = '12px'
    return div
  }
}

// 导出便捷函数
export const createText = UIHelpers.createText.bind(UIHelpers)
export const createStyledText = UIHelpers.createStyledText.bind(UIHelpers)
export const createSeparator = UIHelpers.createSeparator.bind(UIHelpers)
export const createHeading = UIHelpers.createHeading.bind(UIHelpers)
export const createParagraph = UIHelpers.createParagraph.bind(UIHelpers)
export const createSpacer = UIHelpers.createSpacer.bind(UIHelpers)
export const createBlankLine = UIHelpers.createBlankLine.bind(UIHelpers)
export const createElement = UIHelpers.createElement.bind(UIHelpers)
export const createSpan = UIHelpers.createSpan.bind(UIHelpers)
export const createLink = UIHelpers.createLink.bind(UIHelpers)

