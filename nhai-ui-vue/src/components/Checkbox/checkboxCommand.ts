import { createApp, h, defineComponent } from 'vue'
import Checkbox from './Checkbox.vue'

export class VueCheckboxCommand {
  private value: boolean = false
  private label?: string | number
  private text: string = ''
  private disabled: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private indeterminate: boolean = false
  private onChange?: (value: boolean) => void
  private _appInstance: any = null

  constructor(text: string = '') {
    this.text = text
  }

  setValue(value: boolean): void {
    this.value = value
  }

  getValue(): boolean {
    return this.value
  }

  setLabel(label: string | number): void {
    this.label = label
  }

  setText(text: string): void {
    this.text = text
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  setSize(size: 'large' | 'default' | 'small'): void {
    this.size = size
  }

  setIndeterminate(indeterminate: boolean): void {
    this.indeterminate = indeterminate
  }

  setOnChange(callback: (value: boolean) => void): void {
    this.onChange = callback
  }

  render(): HTMLElement {
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
          onChange: self.onChange
        })
      }
    })

    const app = createApp(CheckboxWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  unmount(): void {
    if (this._appInstance) {
      this._appInstance.unmount()
      this._appInstance = null
    }
  }
}

export default VueCheckboxCommand

