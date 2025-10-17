import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../core/NHAICore"

// 卡片组件
export class NHAICard extends NHAIWidget {
    private _title: string = ''
    private _subtitle: string = ''
    private _elevation: number = 1
    private _layout?: NHAIObject
  
    constructor(parent?: NHAIObject) {
      super(parent)
    }
  
    setTitle(title: string): void {
      this._title = title
    }
  
    title(): string {
      return this._title
    }
  
    setSubtitle(subtitle: string): void {
      this._subtitle = subtitle
    }
  
    subtitle(): string {
      return this._subtitle
    }
  
    setElevation(elevation: number): void {
      this._elevation = elevation
    }
  
    elevation(): number {
      return this._elevation
    }
  
    setLayout(layout: NHAIObject): void {
      this._layout = layout
    }
  
    layout(): NHAIObject | undefined {
      return this._layout
    }
  
    render(_context?: NHAIRenderContext): any {
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (!adapter) {
        throw new Error('No framework adapter registered')
      }
  
      const props: any = {
        className: 'nhai-card',
        style: {
          ...this.getWidgetStyle(),
          ...this.getMergedStyle(),
          backgroundColor: 'var(--nhai-surface)',
          border: '1px solid var(--nhai-border)',
          borderRadius: 'var(--nhai-border-radius-lg)',
          boxShadow: `0 ${this._elevation}px ${this._elevation * 2}px rgba(0,0,0,0.1)`,
          padding: 'var(--nhai-spacing-lg)',
          transition: 'var(--nhai-transition-normal)'
        }
      }
  
      if (this._id) props.id = this._id
      if (this._className) props.className += ` ${this._className}`
  
      const children: any[] = []
  
      // 添加标题
      if (this._title) {
        const titleProps = {
          style: {
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'var(--nhai-text)'
          }
        }
        children.push(adapter.createElement('h3', titleProps, [this._title]))
      }
  
      // 添加副标题
      if (this._subtitle) {
        const subtitleProps = {
          style: {
            margin: '0 0 12px 0',
            color: '#666',
            fontSize: '14px'
          }
        }
        children.push(adapter.createElement('p', subtitleProps, [this._subtitle]))
      }
  
      // 添加布局或子控件
      if (this._layout) {
        children.push(this._layout.render(_context))
      } else {
        this.children().forEach(child => {
          children.push(child.render(_context))
        })
      }
  
      return adapter.createElement('div', props, children)
    }
  }