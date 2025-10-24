import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface DialogAction {
  label: string
  onClick: () => void
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  disabled?: boolean
}

/**
 * Material UI Dialog 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialDialog extends NHAIWidget {
  private _open: boolean = false
  private _title: string = ''
  private _content: string | NHAIObject = ''
  private _actions: DialogAction[] = []
  private _size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false = 'sm'
  private _fullWidth: boolean = false
  private _fullScreen: boolean = false
  private _closable: boolean = true
  private _maskClosable: boolean = true
  private _centered: boolean = false
  private _onClose?: () => void
  private _onOpen?: () => void
  private _dialogChildren: NHAIObject[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置打开状态
  setOpen(open: boolean): void {
    this._open = open
    if (open && this._onOpen) {
      this._onOpen()
    }
  }

  open(): boolean {
    return this._open
  }

  // 打开对话框
  show(): void {
    this.setOpen(true)
  }

  // 关闭对话框
  hide(): void {
    this.setOpen(false)
    if (this._onClose) {
      this._onClose()
    }
  }

  // 设置标题
  setTitle(title: string): void {
    this._title = title
  }

  title(): string {
    return this._title
  }

  // 设置内容
  setContent(content: string | NHAIObject): void {
    this._content = content
  }

  content(): string | NHAIObject {
    return this._content
  }

  // 设置操作按钮
  setActions(actions: DialogAction[]): void {
    this._actions = actions
  }

  actions(): DialogAction[] {
    return this._actions
  }

  // 添加操作按钮
  addAction(action: DialogAction): void {
    this._actions.push(action)
  }

  // 设置大小
  setSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false): void {
    this._size = size
  }

  size(): string | false {
    return this._size
  }

  // 设置全宽
  setFullWidth(fullWidth: boolean): void {
    this._fullWidth = fullWidth
  }

  fullWidth(): boolean {
    return this._fullWidth
  }

  // 设置全屏
  setFullScreen(fullScreen: boolean): void {
    this._fullScreen = fullScreen
  }

  fullScreen(): boolean {
    return this._fullScreen
  }

  // 设置可关闭
  setClosable(closable: boolean): void {
    this._closable = closable
  }

  closable(): boolean {
    return this._closable
  }

  // 设置遮罩可关闭
  setMaskClosable(maskClosable: boolean): void {
    this._maskClosable = maskClosable
  }

  maskClosable(): boolean {
    return this._maskClosable
  }

  // 设置居中
  setCentered(centered: boolean): void {
    this._centered = centered
  }

  centered(): boolean {
    return this._centered
  }

  // 设置事件处理器
  setOnClose(handler: () => void): void {
    this._onClose = handler
  }

  setOnOpen(handler: () => void): void {
    this._onOpen = handler
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._dialogChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    if (!this._open) {
      return null
    }

    const containerProps: any = {
      className: 'mui-dialog-container',
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: 9999,
        display: 'flex',
        alignItems: this._centered ? 'center' : 'flex-start',
        justifyContent: 'center',
        padding: this._centered ? '24px' : '48px 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        animation: 'mui-dialog-fade-in 0.3s ease-out'
      }
    }

    if (this._maskClosable) {
      containerProps.onClick = (e: any) => {
        if (e.target === e.currentTarget) {
          this.hide()
        }
      }
    }

    const children = []

    // 对话框
    const dialogProps: any = {
      className: `mui-dialog ${this._fullScreen ? 'mui-dialog--fullscreen' : ''}`,
      style: {
        backgroundColor: '#ffffff',
        borderRadius: this._fullScreen ? '0' : '4px',
        boxShadow: '0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)',
        maxWidth: this._fullScreen ? '100%' : this.getMaxWidth(),
        maxHeight: this._fullScreen ? '100%' : '90vh',
        width: this._fullWidth ? '100%' : 'auto',
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        animation: 'mui-dialog-slide-in 0.3s ease-out',
        ...this.getDialogStyles()
      }
    }

    dialogProps.onClick = (e: any) => {
      e.stopPropagation()
    }

    const dialogChildren = []

    // 标题栏
    if (this._title || this._closable) {
      const headerProps: any = {
        className: 'mui-dialog-header',
        style: {
          padding: '16px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }

      const headerChildren = []

      // 标题
      if (this._title) {
        const titleProps: any = {
          className: 'mui-dialog-title',
          style: {
            fontSize: '1.25rem',
            fontWeight: '500',
            color: 'rgba(0, 0, 0, 0.87)',
            margin: '0',
            flex: 1
          }
        }
        headerChildren.push(adapter.createElement('h2', titleProps, [this._title]))
      }

      // 关闭按钮
      if (this._closable) {
        const closeProps: any = {
          className: 'mui-dialog-close',
          style: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: 'rgba(0, 0, 0, 0.6)',
            transition: 'background-color 0.2s ease-in-out'
          }
        }

        closeProps.onClick = () => this.hide()
        closeProps.onMouseEnter = () => {
          closeProps.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
        }
        closeProps.onMouseLeave = () => {
          closeProps.style.backgroundColor = 'transparent'
        }

        closeProps.children = ['×']
        headerChildren.push(adapter.createElement('button', closeProps))
      }

      headerProps.children = headerChildren
      dialogChildren.push(adapter.createElement('div', headerProps))
    }

    // 内容区域
    const contentProps: any = {
      className: 'mui-dialog-content',
      style: {
        padding: '24px',
        flex: 1,
        overflow: 'auto'
      }
    }

    const contentChildren = []

    if (typeof this._content === 'string') {
      contentChildren.push(this._content)
    } else {
      const contentElement = this._content.render(_context)
      contentChildren.push(contentElement)
    }

    // 子组件
    this._dialogChildren.forEach(child => {
      const childElement = child.render(_context)
      contentChildren.push(childElement)
    })

    contentProps.children = contentChildren
    dialogChildren.push(adapter.createElement('div', contentProps))

    // 操作按钮
    if (this._actions.length > 0) {
      const actionsProps: any = {
        className: 'mui-dialog-actions',
        style: {
          padding: '8px 24px 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }

      const actionButtons = this._actions.map(action => {
        const buttonProps: any = {
          className: `mui-dialog-action-button mui-dialog-action-button--${action.variant || 'text'}`,
          style: {
            padding: '8px 16px',
            border: this.getButtonBorder(action.variant || 'text'),
            borderRadius: '4px',
            backgroundColor: this.getButtonBackground(action.variant || 'text', action.color || 'primary'),
            color: this.getButtonColor(action.variant || 'text', action.color || 'primary'),
            cursor: action.disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease-in-out',
            opacity: action.disabled ? 0.6 : 1
          }
        }

        if (!action.disabled) {
          buttonProps.onClick = () => {
            action.onClick()
            this.hide()
          }
        }

        return adapter.createElement('button', buttonProps, [action.label])
      })

      actionsProps.children = actionButtons
      dialogChildren.push(adapter.createElement('div', actionsProps))
    }

    dialogProps.children = dialogChildren
    children.push(adapter.createElement('div', dialogProps))

    return adapter.createElement('div', containerProps, children)
  }

  private getMaxWidth(): string {
    if (this._fullScreen) return '100%'
    
    const maxWidthMap: Record<string, string> = {
      xs: '444px',
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px'
    }
    
    return maxWidthMap[this._size as string] || maxWidthMap.sm
  }

  private getDialogStyles(): Record<string, any> {
    if (this._fullScreen) {
      return {
        width: '100vw',
        height: '100vh',
        margin: '0',
        borderRadius: '0'
      }
    }
    
    return {}
  }

  private getButtonBorder(variant: string): string {
    if (variant === 'outlined') {
      return '1px solid rgba(0, 0, 0, 0.23)'
    }
    return 'none'
  }

  private getButtonBackground(variant: string, color: string): string {
    if (variant === 'contained') {
      const colorMap: Record<string, string> = {
        primary: '#1976d2',
        secondary: '#dc004e',
        success: '#2e7d32',
        error: '#d32f2f',
        info: '#0288d1',
        warning: '#ed6c02'
      }
      return colorMap[color] || colorMap.primary
    }
    return 'transparent'
  }

  private getButtonColor(variant: string, color: string): string {
    if (variant === 'contained') {
      return '#ffffff'
    }
    
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      error: '#d32f2f',
      info: '#0288d1',
      warning: '#ed6c02'
    }
    return colorMap[color] || colorMap.primary
  }
}
