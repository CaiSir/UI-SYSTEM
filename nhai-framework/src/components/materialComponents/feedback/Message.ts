import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface MessageConfig {
  id?: string | number
  content: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  closable?: boolean
  onClose?: () => void
}

/**
 * Material UI Message 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialMessage extends NHAIWidget {
  private _messages: MessageConfig[] = []
  private _position: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' = 'top'
  private _maxCount: number = 3
  private _duration: number = 4500
  private _closable: boolean = true
  private _onMessageClose?: (message: MessageConfig) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 显示消息
  show(config: MessageConfig): void {
    const message: MessageConfig = {
      id: config.id || Date.now() + Math.random(),
      content: config.content,
      type: config.type || 'info',
      duration: config.duration !== undefined ? config.duration : this._duration,
      closable: config.closable !== undefined ? config.closable : this._closable,
      onClose: config.onClose
    }

    this._messages.push(message)

    // 限制最大数量
    if (this._messages.length > this._maxCount) {
      this._messages = this._messages.slice(-this._maxCount)
    }

    // 自动关闭
    if (message.duration && message.duration > 0) {
      setTimeout(() => {
        this.close(message.id!)
      }, message.duration)
    }
  }

  // 显示成功消息
  success(content: string, config?: Partial<MessageConfig>): void {
    this.show({ ...config, content, type: 'success' })
  }

  // 显示错误消息
  error(content: string, config?: Partial<MessageConfig>): void {
    this.show({ ...config, content, type: 'error' })
  }

  // 显示警告消息
  warning(content: string, config?: Partial<MessageConfig>): void {
    this.show({ ...config, content, type: 'warning' })
  }

  // 显示信息消息
  info(content: string, config?: Partial<MessageConfig>): void {
    this.show({ ...config, content, type: 'info' })
  }

  // 关闭消息
  close(id: string | number): void {
    const index = this._messages.findIndex(msg => msg.id === id)
    if (index > -1) {
      const message = this._messages[index]
      this._messages.splice(index, 1)

      if (message.onClose) {
        message.onClose()
      }

      if (this._onMessageClose) {
        this._onMessageClose(message)
      }
    }
  }

  // 关闭所有消息
  closeAll(): void {
    this._messages.forEach(message => {
      if (message.onClose) {
        message.onClose()
      }
    })
    this._messages = []
  }

  // 设置位置
  setPosition(position: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'): void {
    this._position = position
  }

  position(): string {
    return this._position
  }

  // 设置最大数量
  setMaxCount(maxCount: number): void {
    this._maxCount = maxCount
  }

  maxCount(): number {
    return this._maxCount
  }

  // 设置默认持续时间
  setDuration(duration: number): void {
    this._duration = duration
  }

  duration(): number {
    return this._duration
  }

  // 设置可关闭
  setClosable(closable: boolean): void {
    this._closable = closable
  }

  closable(): boolean {
    return this._closable
  }

  // 设置消息关闭事件
  setOnMessageClose(handler: (message: MessageConfig) => void): void {
    this._onMessageClose = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    if (this._messages.length === 0) {
      return null
    }

    const containerProps: any = {
      className: `mui-message-container mui-message-container--${this._position}`,
      style: {
        position: 'fixed',
        zIndex: 9999,
        ...this.getPositionStyles()
      }
    }

    const children = this._messages.map(message => this.renderMessage(message, adapter))

    return adapter.createElement('div', containerProps, children)
  }

  private renderMessage(message: MessageConfig, adapter: any): any {
    const messageProps: any = {
      className: `mui-message mui-message--${message.type}`,
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        marginBottom: '8px',
        backgroundColor: this.getBackgroundColor(message.type!),
        color: this.getTextColor(message.type!),
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: '300px',
        maxWidth: '500px',
        fontSize: '14px',
        fontWeight: '400',
        animation: 'mui-message-slide-in 0.3s ease-out'
      }
    }

    const children = []

    // 图标
    const iconProps: any = {
      className: 'mui-message-icon',
      style: {
        marginRight: '8px',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center'
      }
    }
    children.push(adapter.createElement('span', iconProps, [this.getIcon(message.type!)]))

    // 内容
    const contentProps: any = {
      className: 'mui-message-content',
      style: {
        flex: 1,
        lineHeight: '1.4'
      }
    }
    children.push(adapter.createElement('span', contentProps, [message.content]))

    // 关闭按钮
    if (message.closable) {
      const closeProps: any = {
        className: 'mui-message-close',
        style: {
          marginLeft: '8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'inherit',
          transition: 'background-color 0.2s ease-in-out'
        }
      }

      closeProps.onClick = () => this.close(message.id!)
      closeProps.onMouseEnter = () => {
        closeProps.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      }
      closeProps.onMouseLeave = () => {
        closeProps.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
      }

      closeProps.children = ['×']
      children.push(adapter.createElement('span', closeProps))
    }

    messageProps.children = children
    return adapter.createElement('div', messageProps)
  }

  private getPositionStyles(): Record<string, any> {
    const styles: Record<string, any> = {}

    switch (this._position) {
      case 'top':
        styles.top = '24px'
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        break
      case 'top-left':
        styles.top = '24px'
        styles.left = '24px'
        break
      case 'top-right':
        styles.top = '24px'
        styles.right = '24px'
        break
      case 'bottom':
        styles.bottom = '24px'
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        break
      case 'bottom-left':
        styles.bottom = '24px'
        styles.left = '24px'
        break
      case 'bottom-right':
        styles.bottom = '24px'
        styles.right = '24px'
        break
    }

    return styles
  }

  private getBackgroundColor(type: string): string {
    const colorMap: Record<string, string> = {
      success: '#e8f5e8',
      error: '#ffebee',
      warning: '#fff3e0',
      info: '#e3f2fd'
    }
    return colorMap[type] || colorMap.info
  }

  private getTextColor(type: string): string {
    const colorMap: Record<string, string> = {
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#ed6c02',
      info: '#1976d2'
    }
    return colorMap[type] || colorMap.info
  }

  private getIcon(type: string): string {
    const iconMap: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }
    return iconMap[type] || iconMap.info
  }
}
