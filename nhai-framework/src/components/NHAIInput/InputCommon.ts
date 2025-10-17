import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from "../../core/NHAICore"

// 输入框组件
export class NHAIInput extends NHAIWidget {
    private _placeholder: string = ''
    private _value: string = ''
    private _type: 'text' | 'password' | 'email' | 'number' = 'text'
    private _onChange?: (value: string) => void
  
    constructor(parent?: NHAIObject) {
      super(parent)
    }
  
    setPlaceholder(placeholder: string): void {
      this._placeholder = placeholder
    }
  
    placeholder(): string {
      return this._placeholder
    }
  
    setValue(value: string): void {
      this._value = value
    }
  
    value(): string {
      return this._value
    }
  
    setType(type: 'text' | 'password' | 'email' | 'number'): void {
      this._type = type
    }
  
    type(): string {
      return this._type
    }
  
    setOnChange(handler: (value: string) => void): void {
      this._onChange = handler
    }
  
    render(_context?: NHAIRenderContext): any {
      const adapter = NHAIFrameworkRegistry.getCurrent()
      if (!adapter) {
        throw new Error('No framework adapter registered')
      }
  
      const props: any = {
        className: 'nhai-input',
        type: this._type,
        placeholder: this._placeholder,
        value: this._value,
        style: {
          ...this.getWidgetStyle(),
          ...this.getMergedStyle(),
          display: 'block',
          width: '100%',
          padding: 'var(--nhai-spacing-sm) var(--nhai-spacing-md)',
          border: '1px solid var(--nhai-border)',
          borderRadius: 'var(--nhai-border-radius-md)',
          fontSize: 'var(--nhai-font-size-sm)',
          lineHeight: 'var(--nhai-line-height-normal)',
          color: 'var(--nhai-text)',
          backgroundColor: 'var(--nhai-surface)',
          transition: 'var(--nhai-transition-normal)'
        }
      }
  
      if (this._id) props.id = this._id
      if (this._className) props.className += ` ${this._className}`
      if (this._onChange) {
        props.onChange = (e: any) => {
          const value = e.target?.value || e
          this._value = value
          this._onChange?.(value)
        }
      }
  
      return adapter.createElement('input', props)
    }
  }