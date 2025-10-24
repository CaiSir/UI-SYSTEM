import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../../core/NHAICore"

// 窗口组件
export class NHAIWindow extends NHAIWidget {
    private _title: string = ''
    private _layout?: NHAIObject
  
    constructor(title: string = '', parent?: NHAIObject) {
      super(parent)
      this._title = title
    }
  
    setTitle(title: string): void {
      this._title = title
    }
  
    title(): string {
      return this._title
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
        className: 'nhai-window',
        style: {
          ...this.getWidgetStyle(),
          ...this.getMergedStyle(),
          backgroundColor: 'var(--nhai-surface)',
          border: '1px solid var(--nhai-border)',
          borderRadius: 'var(--nhai-border-radius-lg)',
          boxShadow: 'var(--nhai-shadow-lg)',
          padding: 'var(--nhai-spacing-lg)'
        }
      }
  
      if (this._id) props.id = this._id
      if (this._className) props.className += ` ${this._className}`
  
      const children: any[] = []
  
      // 添加标题
      if (this._title) {
        const titleProps = {
          style: {
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--nhai-text)',
            borderBottom: '1px solid var(--nhai-border)',
            paddingBottom: '8px'
          }
        }
        children.push(adapter.createElement('h2', titleProps, [this._title]))
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
  