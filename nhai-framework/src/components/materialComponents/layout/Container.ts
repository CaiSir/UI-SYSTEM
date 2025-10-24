import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI Container 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialContainer extends NHAIWidget {
  private _containerMaxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false = 'lg'
  private _fixed: boolean = false
  private _disableGutters: boolean = false
  private _containerChildren: NHAIObject[] = []

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置最大宽度
  setMaxWidth(maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false): void {
    this._containerMaxWidth = maxWidth
  }

  maxWidth(): string | false {
    return this._containerMaxWidth
  }

  // 设置固定宽度
  setFixed(fixed: boolean): void {
    this._fixed = fixed
  }

  fixed(): boolean {
    return this._fixed
  }

  // 设置禁用间距
  setDisableGutters(disableGutters: boolean): void {
    this._disableGutters = disableGutters
  }

  disableGutters(): boolean {
    return this._disableGutters
  }

  // 添加子组件
  addChild(child: NHAIObject): void {
    super.addChild(child)
    this._containerChildren.push(child)
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-container ${this._fixed ? 'mui-container--fixed' : ''}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: this._disableGutters ? '0' : '16px',
        paddingRight: this._disableGutters ? '0' : '16px',
        ...this.getContainerMaxWidthStyles()
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = []

    // 渲染子组件
    this._containerChildren.forEach(child => {
      const childElement = child.render(_context)
      children.push(childElement)
    })

    return adapter.createElement('div', containerProps, children)
  }

  private getContainerMaxWidthStyles(): Record<string, any> {
    if (this._containerMaxWidth === false) {
      return {}
    }

    const maxWidthMap: Record<string, string> = {
      xs: '444px',
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px'
    }

    const maxWidth = maxWidthMap[this._containerMaxWidth]
    if (!maxWidth) return {}

    if (this._fixed) {
      return {
        maxWidth: maxWidth,
        width: maxWidth
      }
    } else {
      return {
        maxWidth: maxWidth
      }
    }
  }
}
