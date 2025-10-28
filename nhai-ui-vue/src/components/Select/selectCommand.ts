import { createApp, h, defineComponent } from 'vue'
import Select from './Select.vue'
import type { SelectOption } from './types'
import { BaseCommand } from '../../lib/BaseCommand'

/**
 * 下拉选择框组件命令式 API
 * 支持单选、多选、可清除、可搜索等功能
 */
export class VueSelectCommand extends BaseCommand {
  private value: string | number | Array<string | number> = ''
  private placeholder: string = '请选择'
  private disabled: boolean = false
  private clearable: boolean = false
  private multiple: boolean = false
  private size: 'large' | 'default' | 'small' = 'default'
  private options: SelectOption[] = []
  private onChange?: (value: any) => void

  constructor(placeholder: string = '请选择') {
    super()
    this.placeholder = placeholder
  }

  setValue(value: string | number | Array<string | number>): void {
    this.value = value
  }

  getValue(): any {
    return this.value
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

  setMultiple(multiple: boolean): void {
    this.multiple = multiple
  }

  setSize(size: 'large' | 'default' | 'small'): void {
    this.size = size
  }

  setOptions(options: SelectOption[]): void {
    this.options = options
  }

  addOption(option: SelectOption): void {
    this.options.push(option)
  }

  setOnChange(callback: (value: any) => void): void {
    this.onChange = callback
  }

  render(): HTMLElement {
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
          onChange: self.onChange
        })
      }
    })

    const app = createApp(SelectWrapper)
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

export default VueSelectCommand

