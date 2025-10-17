/**
 * 现代化 NHAI 组件 API 设计
 * 参考 Ant Design 等成熟框架的设计模式
 */

// 1. 声明式 Props 接口
export interface NHAIButtonProps {
  // 基础属性
  children?: string
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  size?: 'small' | 'middle' | 'large'
  shape?: 'default' | 'circle' | 'round'
  
  // 状态
  disabled?: boolean
  loading?: boolean
  
  // 样式
  className?: string
  style?: Record<string, any>
  color?: string
  
  // 交互
  onClick?: (event: Event) => void
  
  // 链接功能
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  router?: (path: string) => void
  
  // 图标
  icon?: string
  
  // 其他
  htmlType?: 'button' | 'submit' | 'reset'
  block?: boolean
}

// 2. 现代化组件实现
export class ModernNHAIButton {
  private props: NHAIButtonProps
  private cachedStyle: Record<string, any> | null = null
  private cachedClassName: string | null = null
  
  constructor(props: NHAIButtonProps) {
    this.props = { ...props }
  }
  
  // 样式缓存机制
  private getCachedStyle(): Record<string, any> {
    if (!this.cachedStyle) {
      this.cachedStyle = this.computeStyle()
    }
    return this.cachedStyle
  }
  
  private getCachedClassName(): string {
    if (!this.cachedClassName) {
      this.cachedClassName = this.computeClassName()
    }
    return this.cachedClassName
  }
  
  // 样式计算（只在 props 变化时重新计算）
  private computeStyle(): Record<string, any> {
    const { type, size, color, style, block } = this.props
    
    const baseStyle: Record<string, any> = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      textDecoration: 'none',
      ...(block && { width: '100%' })
    }
    
    // 尺寸样式
    const sizeStyles = {
      small: { padding: '4px 8px', fontSize: '12px', minHeight: '24px' },
      middle: { padding: '6px 12px', fontSize: '14px', minHeight: '32px' },
      large: { padding: '8px 16px', fontSize: '16px', minHeight: '40px' }
    }
    
    // 类型样式
    const typeStyles = {
      primary: {
        backgroundColor: color || '#1890ff',
        color: '#fff',
        border: `1px solid ${color || '#1890ff'}`
      },
      default: {
        backgroundColor: '#fff',
        color: '#000',
        border: '1px solid #d9d9d9'
      },
      dashed: {
        backgroundColor: '#fff',
        color: '#000',
        border: '1px dashed #d9d9d9'
      },
      text: {
        backgroundColor: 'transparent',
        color: color || '#1890ff',
        border: 'none'
      },
      link: {
        backgroundColor: 'transparent',
        color: color || '#1890ff',
        border: 'none',
        textDecoration: 'underline'
      }
    }
    
    return {
      ...baseStyle,
      ...sizeStyles[size || 'middle'],
      ...typeStyles[type || 'default'],
      ...style
    }
  }
  
  // 类名计算
  private computeClassName(): string {
    const { type, size, disabled, loading, className } = this.props
    
    const classes = [
      'nhai-button',
      `nhai-button--${type || 'default'}`,
      `nhai-button--${size || 'middle'}`,
      disabled && 'nhai-button--disabled',
      loading && 'nhai-button--loading',
      className
    ].filter(Boolean)
    
    return classes.join(' ')
  }
  
  // 更新 props（触发缓存失效）
  updateProps(newProps: Partial<NHAIButtonProps>): void {
    const hasStyleChange = this.hasStyleChange(newProps)
    const hasClassNameChange = this.hasClassNameChange(newProps)
    
    this.props = { ...this.props, ...newProps }
    
    // 只在相关属性变化时清除缓存
    if (hasStyleChange) {
      this.cachedStyle = null
    }
    if (hasClassNameChange) {
      this.cachedClassName = null
    }
  }
  
  private hasStyleChange(newProps: Partial<NHAIButtonProps>): boolean {
    const styleProps = ['type', 'size', 'color', 'style', 'block']
    return styleProps.some(prop => prop in newProps)
  }
  
  private hasClassNameChange(newProps: Partial<NHAIButtonProps>): boolean {
    const classNameProps = ['type', 'size', 'disabled', 'loading', 'className']
    return classNameProps.some(prop => prop in newProps)
  }
  
  // 渲染方法
  render(): any {
    const { 
      children, 
      href, 
      target, 
      router, 
      onClick, 
      disabled, 
      loading,
      htmlType = 'button'
    } = this.props
    
    const style = this.getCachedStyle()
    const className = this.getCachedClassName()
    
    // 处理点击事件
    const handleClick = (event: Event) => {
      if (disabled || loading) return
      
      // 路由处理
      if (router && href && target === '_self') {
        event.preventDefault()
        router(href)
      }
      
      // 自定义点击处理
      if (onClick) {
        onClick(event)
      }
    }
    
    // 根据是否有链接决定渲染元素
    if (href && !disabled) {
      return {
        tag: 'a',
        props: {
          href,
          target,
          className,
          style,
          onClick: handleClick
        },
        children: children
      }
    }
    
    return {
      tag: 'button',
      props: {
        type: htmlType,
        className,
        style,
        onClick: handleClick,
        disabled: disabled || loading
      },
      children: loading ? 'Loading...' : children
    }
  }
}

// 3. 使用示例
export const ModernButtonExample = {
  // 基础使用
  basic: () => {
    const button = new ModernNHAIButton({
      type: 'primary',
      size: 'large',
      children: '点击我',
      onClick: () => console.log('clicked')
    })
    return button.render()
  },
  
  // 链接按钮
  link: () => {
    const button = new ModernNHAIButton({
      type: 'link',
      href: 'https://example.com',
      target: '_blank',
      children: '外部链接'
    })
    return button.render()
  },
  
  // 路由按钮
  router: () => {
    const router = (path: string) => {
      console.log(`Navigate to: ${path}`)
    }
    
    const button = new ModernNHAIButton({
      type: 'primary',
      href: '/home',
      router: router,
      children: '首页'
    })
    return button.render()
  }
}
