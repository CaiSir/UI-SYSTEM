import { createApp, h, defineComponent } from 'vue'
import Input from './Input.vue'
import { BaseCommand } from '../../lib/BaseCommand'

/**
 * Vue 输入框的命令式封装
 */
export class NhaiInputCommand extends BaseCommand {
  private value: string = ''
  private type: 'text' | 'textarea' | 'password' = 'text'
  private placeholder: string = '请输入'
  private disabled: boolean = false
  private clearable: boolean = false
  private showPassword: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private maxlength?: number
  private minlength?: number
  private onBlur?: (event: FocusEvent) => void
  private onChange?: (value: string) => void
  private onFocus?: (event: FocusEvent) => void

  constructor(placeholder: string = '请输入') {
    super()
    this.placeholder = placeholder
  }

  setValue(value: string): void {
    this.value = value
  }

  getValue(): string {
    return this.value
  }

  setType(type: 'text' | 'textarea' | 'password'): void {
    this.type = type
  }

  setPlaceholder(placeholder: string): void {
    this.placeholder = placeholder
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  setClearable(clearable: boolean): void {
    this.clearable = clearable
  }

  setShowPassword(showPassword: boolean): void {
    this.showPassword = showPassword
  }

  setSize(size: 'large' | 'default' | 'small'): void {
    this.size = size
  }

  setMaxlength(maxlength: number): void {
    this.maxlength = maxlength
  }

  setMinlength(minlength: number): void {
    this.minlength = minlength
  }

  setOnBlur(callback: (event: FocusEvent) => void): void {
    this.onBlur = callback
  }

  setOnFocus(callback: (event: FocusEvent) => void): void {
    this.onFocus = callback
  }

  setOnChange(callback: (value: string) => void): void {
    this.onChange = callback
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const InputWrapper = defineComponent({
      setup() {
        return () => h(Input, {
          modelValue: self.value,
          type: self.type,
          placeholder: self.placeholder,
          disabled: self.disabled,
          clearable: self.clearable,
          showPassword: self.showPassword,
          size: self.size,
          maxlength: self.maxlength,
          minlength: self.minlength,
          onBlur: self.onBlur,
          onFocus: self.onFocus,
          onChange: self.onChange
        })
      }
    })

    const app = createApp(InputWrapper)
    app.mount(container)
    this._appInstance = app
    
    this._element = container
    this._mounted = true

    return container
  }

  override unmount(): void {
    super.unmount()
  }

  renderFallback(): HTMLElement {
    const input = document.createElement('input')
    input.type = this.type === 'password' ? 'password' : 'text'
    input.placeholder = this.placeholder
    input.disabled = this.disabled
    input.value = this.value

    if (this.onChange) {
      input.addEventListener('input', (e) => {
        this.value = (e.target as HTMLInputElement).value
        this.onChange!(this.value)
      })
    }

    return input
  }
}

export default NhaiInputCommand

