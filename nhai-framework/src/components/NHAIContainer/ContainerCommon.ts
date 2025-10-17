import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../core/NHAICore"

// 容器组件
export class NHAIContainer extends NHAIWidget {
    private _layout?: NHAIObject
  
    constructor(parent?: NHAIObject) {
      super(parent)
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
        className: 'nhai-container',
        style: {
          ...this.getWidgetStyle(),
          ...this.getMergedStyle(),
          position: 'relative'
        }
      }
  
      if (this._id) props.id = this._id
      if (this._className) props.className += ` ${this._className}`
  
      const children: any[] = []
  
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