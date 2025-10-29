import { createApp, h, defineComponent } from 'vue'
import Select from './Select.vue'
import type { SelectOption } from './types'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface SelectOptions extends IBaseCommandProps {
  value?: string | number | Array<string | number>
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  size?: 'large' | 'default' | 'small'
  options?: SelectOption[]
  onChange?: (value: any) => void
}

export interface SelectEvents extends IBaseCommandEvents {
  change: (value: any) => void
}

/**
 * 下拉选择框组件命令式 API
 * 支持单选、多选、可清除、可搜索等功能
 */
export class NhaiSelectCommand extends BaseCommand<SelectOptions, SelectEvents> {
  private value: string | number | Array<string | number> = ''
  private placeholder: string = '请选择'
  private disabled: boolean = false
  private clearable: boolean = false
  private multiple: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private options: SelectOption[] = []
  private onChange?: (value: any) => void

  constructor(placeholderOrOptions: string | SelectOptions = '请选择') {
    const options: SelectOptions = typeof placeholderOrOptions === 'string' 
      ? { placeholder: placeholderOrOptions }
      : placeholderOrOptions
    super(options)
    
    this.value = options.value ?? ''
    this.placeholder = options.placeholder ?? '请选择'
    this.disabled = options.disabled ?? false
    this.clearable = options.clearable ?? false
    this.multiple = options.multiple ?? false
    this.size = options.size ?? 'default'
    this.options = options.options ?? []
    this.onChange = options.onChange
    
    Object.assign(this._props, {
      value: this.value,
      placeholder: this.placeholder,
      disabled: this.disabled,
      clearable: this.clearable,
      multiple: this.multiple,
      size: this.size,
      options: this.options,
      onChange: this.onChange,
      ...options
    })
  }

  setValue(value: string | number | Array<string | number>): this {
    this.value = value
    this.setProperty('value', value)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getValue(): any {
    return this.getProperty('value') ?? this.value
  }

  setPlaceholder(placeholder: string): this {
    this.placeholder = placeholder
    this.setProperty('placeholder', placeholder)
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

  setClearable(clearable: boolean): this {
    this.clearable = clearable
    this.setProperty('clearable', clearable)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setMultiple(multiple: boolean): this {
    this.multiple = multiple
    this.setProperty('multiple', multiple)
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

  setOptions(options: SelectOption[]): this {
    this.options = options
    this.setProperty('options', options)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  addOption(option: SelectOption): this {
    this.options.push(option)
    this.setProperty('options', [...this.options])
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setOnChange(callback: (value: any) => void): this {
    this.onChange = callback
    this.setProperty('onChange', callback)
    return this
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const SelectWrapper = defineComponent({
      setup() {
        return () => h(Select, {
          modelValue: self.value,
          placeholder: self.placeholder,
          disabled: self.disabled,
          clearable: self.clearable,
          multiple: self.multiple,
          size: self.size,
          options: self.options,
          onChange: (value: any) => {
            self.value = value
            if (self.onChange) {
              self.onChange(value)
            }
            self.emit('change', value)
          }
        })
      }
    })

    const app = createApp(SelectWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }

  renderFallback(): HTMLElement {
    const select = document.createElement('select')
    select.className = 'el-select'
    select.disabled = this.disabled

    if (this.options.length > 0) {
      const placeholder = document.createElement('option')
      placeholder.value = ''
      placeholder.text = this.placeholder
      select.appendChild(placeholder)

      this.options.forEach(option => {
        const optionEl = document.createElement('option')
        optionEl.value = String(option.value)
        optionEl.text = option.label
        select.appendChild(optionEl)
      })
    }

    if (this.onChange) {
      select.addEventListener('change', (e) => {
        this.value = (e.target as HTMLSelectElement).value
        this.onChange!(this.value)
      })
    }

    return select
  }
}

export default NhaiSelectCommand

