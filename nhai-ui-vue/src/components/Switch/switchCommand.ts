import { createApp, h, defineComponent } from 'vue'
import Switch from './Switch.vue'

export class VueSwitchCommand {
  private value: boolean = false
  private disabled: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private activeText?: string
  private inactiveText?: string
  private activeColor?: string
  private inactiveColor?: string
  private onChange?: (value: boolean) => void
  private _appInstance: any = null

  constructor(value: boolean = false) {
    this.value = value
  }

  setValue(value: boolean): void {
    this.value = value
  }

  getValue(): boolean {
    return this.value
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  setSize(size: 'large' | 'default' | 'small'): void {
    this.size = size
  }

  setActiveText(text: string): void {
    this.activeText = text
  }

  setInactiveText(text: string): void {
    this.inactiveText = text
  }

  setActiveColor(color: string): void {
    this.activeColor = color
  }

  setInactiveColor(color: string): void {
    this.inactiveColor = color
  }

  setOnChange(callback: (value: boolean) => void): void {
    this.onChange = callback
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const SwitchWrapper = defineComponent({
      setup() {
        return () => h(Switch, {
          modelValue: self.value,
          disabled: self.disabled,
          size: self.size,
          activeText: self.activeText,
          inactiveText: self.inactiveText,
          activeColor: self.activeColor,
          inactiveColor: self.inactiveColor,
          onChange: self.onChange
        })
      }
    })

    const app = createApp(SwitchWrapper)
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

export default VueSwitchCommand

