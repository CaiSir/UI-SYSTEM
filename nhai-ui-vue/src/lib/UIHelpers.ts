/**
 * UI 辅助工具类
 * 提供创建常见 UI 元素的便捷方法
 */

/**
 * 创建文本元素
 */
export function createText(content: string): HTMLElement {
  const div = document.createElement('div')
  div.textContent = content
  return div
}

/**
 * 创建带样式的文本元素
 */
export function createStyledText(content: string, styles: Record<string, string>): HTMLElement {
  const div = document.createElement('div')
  div.textContent = content
  Object.assign(div.style, styles)
  return div
}

/**
 * 创建分隔符
 */
export function createSeparator(orientation: 'horizontal' | 'vertical' = 'vertical'): HTMLElement {
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
export function createHeading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 3): HTMLElement {
  const heading = document.createElement(`h${level}`)
  heading.textContent = text
  return heading
}

/**
 * 创建段落
 */
export function createParagraph(text: string): HTMLElement {
  const p = document.createElement('p')
  p.textContent = text
  return p
}

/**
 * 创建占位符
 */
export function createSpacer(size?: string): HTMLElement {
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
export function createBlankLine(): HTMLElement {
  return document.createElement('br')
}

/**
 * 创建行内元素
 */
export function createSpan(text: string, styles?: Record<string, string>): HTMLElement {
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
export function createLink(text: string, href: string, target: '_blank' | '_self' = '_blank'): HTMLElement {
  const a = document.createElement('a')
  a.textContent = text
  a.href = href
  a.target = target
  return a
}

/**
 * UI 辅助工具类（静态方法版本，向后兼容）
 */
export class UIHelpers {
  static createText = createText
  static createStyledText = createStyledText
  static createSeparator = createSeparator
  static createHeading = createHeading
  static createParagraph = createParagraph
  static createSpacer = createSpacer
  static createBlankLine = createBlankLine
  static createSpan = createSpan
  static createLink = createLink
}

