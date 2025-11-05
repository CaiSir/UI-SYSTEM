import { createApp, h, defineComponent } from 'vue'
import Checkbox from './Checkbox.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand'

// 类型定义
export interface CheckboxOptions extends IBaseCommandProps {
  value?: boolean
  label?: string | number
  text?: string
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  indeterminate?: boolean
  onChange?: (value: boolean) => void
}

export interface CheckboxEvents extends IBaseCommandEvents {
  change: (value: boolean) => void
}

export class NhaiCheckboxCommand extends BaseCommand<CheckboxOptions, CheckboxEvents> {
  private value: boolean = false
  private label?: string | number
  private text: string = ''
  private disabled: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private indeterminate: boolean = false
  private onChange?: (value: boolean) => void

  constructor(textOrOptions: string | CheckboxOptions = '') {
    const options: CheckboxOptions = typeof textOrOptions === 'string' 
      ? { text: textOrOptions }
      : textOrOptions
    super(options)
    
    this.value = options.value ?? false
    this.label = options.label
    this.text = options.text ?? ''
    this.disabled = options.disabled ?? false
    this.size = options.size ?? 'default'
    this.indeterminate = options.indeterminate ?? false
    this.onChange = options.onChange
    
    Object.assign(this._props, {
      value: this.value,
      label: this.label,
      text: this.text,
      disabled: this.disabled,
      size: this.size,
      indeterminate: this.indeterminate,
      onChange: this.onChange,
      ...options
    })
  }

  setValue(value: boolean): this {
    this.value = value
    this.setProperty('value', value)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getValue(): boolean {
    return this.getProperty('value') ?? this.value
  }

  setLabel(label: string | number): this {
    this.label = label
    this.setProperty('label', label)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setText(text: string): this {
    this.text = text
    this.setProperty('text', text)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setDisabled(disabled: boolean): this {
    this.disabled = disabled
    this.setProperty('disabled', disabled)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setSize(size: 'large' | 'default' | 'small'): this {
    this.size = size
    this.setProperty('size', size)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setIndeterminate(indeterminate: boolean): this {
    this.indeterminate = indeterminate
    this.setProperty('indeterminate', indeterminate)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setOnChange(callback: (value: boolean) => void): this {
    this.onChange = callback
    this.setProperty('onChange', callback)
    return this
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const CheckboxWrapper = defineComponent({
      setup() {
        return () => h(Checkbox, {
          modelValue: self.value,
          label: self.label,
          text: self.text,
          disabled: self.disabled,
          size: self.size,
          indeterminate: self.indeterminate,
          onChange: (value: boolean) => {
            self.value = value
            if (self.onChange) {
              self.onChange(value)
            }
            self.emit('change', value)
          }
        })
      }
    })

    const app = createApp(CheckboxWrapper)
    app.mount(container)
    this._appInstance = app
    
    this._element = container
    this._mounted = true

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiCheckboxCommand

