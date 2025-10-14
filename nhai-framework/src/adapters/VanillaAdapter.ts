/**
 * NHAI原生JavaScript适配器
 * 用于原生JavaScript环境
 */

import { NHAIFrameworkAdapter } from '../core/NHAICore'

export class VanillaAdapter implements NHAIFrameworkAdapter {
  name = 'vanilla'

  createElement(tag: string, props?: any, children?: any[]): HTMLElement {
    const element = document.createElement(tag)
    
    // 设置属性
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value)
        } else if (key === 'className') {
          element.className = value as string
        } else if (key === 'id') {
          element.id = value as string
        } else if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.slice(2).toLowerCase()
          element.addEventListener(eventName, value as EventListener)
        } else {
          element.setAttribute(key, String(value))
        }
      })
    }

    // 添加子元素
    if (children) {
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child))
        } else if (child instanceof HTMLElement) {
          element.appendChild(child)
        } else if (child && typeof child === 'object' && child.render) {
          element.appendChild(child.render())
        }
      })
    }

    return element
  }

  mount(element: HTMLElement, container: HTMLElement): void {
    container.appendChild(element)
  }

  unmount(element: HTMLElement): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  updateProps(element: HTMLElement, props: any): void {
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value)
      } else if (key === 'className') {
        element.className = value as string
      } else if (key === 'id') {
        element.id = value as string
      } else {
        element.setAttribute(key, String(value))
      }
    })
  }

  addEventListener(element: HTMLElement, event: string, handler: EventListener): void {
    element.addEventListener(event, handler)
  }

  removeEventListener(element: HTMLElement, event: string, handler: EventListener): void {
    element.removeEventListener(event, handler)
  }
}

// 导出适配器实例
export const vanillaAdapter = new VanillaAdapter()
