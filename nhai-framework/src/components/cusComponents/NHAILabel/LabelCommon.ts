import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../../core/NHAICore"

// 标签组件
export class NHAILabel extends NHAIWidget {
    private _text: string = ''
    private _fontSize: number | string = 14
    private _fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder' | number = 'normal'
    private _color: string = 'inherit'
    private _align: 'left' | 'center' | 'right' = 'left'
  
    constructor(text: string = '', parent?: NHAIObject) {
      super(parent)
      this._text = text
    }
  
    setText(text: string): void {
      this._text = text
    }
  
    text(): string {
      return this._text
    }
  
    setFontSize(size: number | string): void {
      this._fontSize = size
    }
  
    fontSize(): number | string {
      return this._fontSize
    }
  
    setFontWeight(weight: 'normal' | 'bold' | 'lighter' | 'bolder' | number): void {
      this._fontWeight = weight
    }
  
    fontWeight(): string | number {
      return this._fontWeight
    }
  
    setColor(color: string): void {
      this._color = color
    }
  
    color(): string {
      return this._color
    }
  
    setAlignment(align: 'left' | 'center' | 'right'): void {
      this._align = align
    }
  
    alignment(): string {
      return this._align
    }
  
    render(_context?: NHAIRenderContext): any {
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (!adapter) {
        throw new Error('No framework adapter registered')
      }
  
      const props: any = {
        className: 'nhai-label',
        style: {
          ...this.getWidgetStyle(),
          ...this.getMergedStyle(),
          fontSize: typeof this._fontSize === 'number' ? `${this._fontSize}px` : this._fontSize,
          fontWeight: this._fontWeight,
          color: this._color,
          textAlign: this._align,
          display: 'block',
          marginBottom: 'var(--nhai-spacing-xs)'
        }
      }
  
      if (this._id) props.id = this._id
      if (this._className) props.className += ` ${this._className}`
  
      return adapter.createElement('div', props, [this._text])
    }
  }