import { createApp, h, defineComponent } from 'vue'
import Switch from './Switch.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface SwitchOptions extends IBaseCommandProps {
  value?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  activeText?: string
  inactiveText?: string
  activeColor?: string
  inactiveColor?: string
  onChange?: (value: boolean) => void
}

export interface SwitchEvents extends IBaseCommandEvents {
  change: (value: boolean) => void
}

export class NhaiSwitchCommand extends BaseCommand<SwitchOptions, SwitchEvents> {
  private value: boolean = false
  private disabled: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private activeText?: string
  private inactiveText?: string
  private activeColor?: string
  private inactiveColor?: string
  private onChange?: (value: boolean) => void

  constructor(valueOrOptions: boolean | SwitchOptions = false) {
    const options: SwitchOptions = typeof valueOrOptions === 'boolean' 
      ? { value: valueOrOptions }
      : valueOrOptions
    super(options)
    
    this.value = options.value ?? false
    this.disabled = options.disabled ?? false
    this.size = options.size ?? 'default'
    this.activeText = options.activeText
    this.inactiveText = options.inactiveText
    this.activeColor = options.activeColor
    this.inactiveColor = options.inactiveColor
    this.onChange = options.onChange
    
    Object.assign(this._props, {
      value: this.value,
      disabled: this.disabled,
      size: this.size,
      activeText: this.activeText,
      inactiveText: this.inactiveText,
      activeColor: this.activeColor,
      inactiveColor: this.inactiveColor,
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

  setActiveText(text: string): this {
    this.activeText = text
    this.setProperty('activeText', text)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setInactiveText(text: string): this {
    this.inactiveText = text
    this.setProperty('inactiveText', text)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setActiveColor(color: string): this {
    this.activeColor = color
    this.setProperty('activeColor', color)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setInactiveColor(color: string): this {
    this.inactiveColor = color
    this.setProperty('inactiveColor', color)
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

    const app = createApp(SwitchWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiSwitchCommand

