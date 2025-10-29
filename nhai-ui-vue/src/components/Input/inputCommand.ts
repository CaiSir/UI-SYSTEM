import { createApp, h, defineComponent, ref, type App, type ComponentPublicInstance } from 'vue'
import Input from './Input.vue'
import { BaseCommand, IBaseCommandEvents, IBaseCommandProps } from '../../lib/BaseCommand'

// 类型定义
export interface InputOptions extends IBaseCommandProps {
  value?: string
  type?: 'text' | 'textarea' | 'password'
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  showPassword?: boolean
  prefixIcon?: string
  suffixIcon?: string
  maxlength?: number
  minlength?: number
  size?: 'large' | 'default' | 'small'
}

export interface InputEvents extends IBaseCommandEvents {
  change: (value: string) => void
  blur: (event: FocusEvent) => void
  focus: (event: FocusEvent) => void
  input: (value: string) => void
}


/**
 *  Vue 输入框命令式封装
 */
export class NhaiInputCommand extends BaseCommand<InputOptions, InputEvents> {
  private _options: Required<InputOptions>
  public _appInstance: App | null = null
  private _componentInstance: ComponentPublicInstance<typeof Input> | null = null

  constructor(options: InputOptions = {}) {
    super(options)
    
    // 统一配置处理：支持字符串快捷方式
    const finalOptions = typeof options === 'string' ? { placeholder: options } : options
    
    // 合并默认值和传入的 options
    const mergedOptions: Required<InputOptions> = {
      id: '',
      className: '',
      style: {},
      value: '',
      type: 'text',
      placeholder: '请输入',
      disabled: false,
      clearable: false,
      showPassword: false,
      prefixIcon: '',
      suffixIcon: '',
      maxlength: 0,
      minlength: 0,
      size: 'default',
      ...finalOptions
    }
    
    this._options = mergedOptions
    // 同步到 BaseCommand 的 _props
    Object.assign(this._props, mergedOptions)
  }

  // ==================== 配置方法 ====================
  
  configure(options: Partial<InputOptions>): this {
    Object.assign(this._options, options)
    this._updateComponentProps()
    return this
  }

  setValue(value: string): this {
    this._options.value = value
    this.setProperty('value' as keyof InputOptions, value)
    return this
  }

  getValue(): string {
    return this.getProperty('value') || ''
  }

  setType(type: 'text' | 'textarea' | 'password'): this {
    return this.configure({ type })
  }

  setPlaceholder(placeholder: string): this {
    return this.configure({ placeholder })
  }

  setDisabled(disabled: boolean): this {
    return this.configure({ disabled })
  }

  setClearable(clearable: boolean): this {
    return this.configure({ clearable })
  }

  setShowPassword(showPassword: boolean): this {
    return this.configure({ showPassword })
  }

  setSize(size: 'large' | 'default' | 'small'): this {
    return this.configure({ size })
  }

  setMaxlength(maxlength: number): this {
    return this.configure({ maxlength })
  }

  setMinlength(minlength: number): this {
    return this.configure({ minlength })
  }

  

  // ==================== 组件控制方法 ====================

  focus(): this {
    this._componentInstance?.focus()
    return this
  }

  blur(): this {
    this._componentInstance?.blur()
    return this
  }

  clear(): this {
    this._componentInstance?.clear()
    return this
  }

  // ==================== 渲染方法 ====================

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    const InputWrapper = defineComponent({
      setup(_, { expose }) {
        const inputRef = ref<ComponentPublicInstance<typeof Input>>()

        const handleUpdateModelValue = (value: string) => {
          self._options.value = value
        }

        const handleChange = (value: string) => {
          self.emit('change', value)
        }

        const handleBlur = (event: FocusEvent) => {
          self.emit('blur', event)
        }

        const handleFocus = (event: FocusEvent) => {
          self.emit('focus', event)
        }

        const handleInput = (value: string) => {
          self.emit('input', value)
        }

        // 暴露方法给命令类
        expose({
          setValue: (value: string) => {
            inputRef.value?.setValue(value)
          },
          getValue: () => {
            return inputRef.value?.getValue() || self._options.value
          },
          focus: () => {
            inputRef.value?.focus()
          },
          blur: () => {
            inputRef.value?.blur()
          },
          clear: () => {
            inputRef.value?.clear()
          }
        })

        return () => h(Input, {
          ref: inputRef,
          modelValue: self._options.value,
          type: self._options.type,
          placeholder: self._options.placeholder,
          disabled: self._options.disabled,
          clearable: self._options.clearable,
          showPassword: self._options.showPassword,
          prefixIcon: self._options.prefixIcon,
          suffixIcon: self._options.suffixIcon,
          maxlength: self._options.maxlength,
          minlength: self._options.minlength,
          size: self._options.size,
          onBlur: handleBlur,
          onFocus: handleFocus,
          onChange: handleChange,
          onInput: handleInput,
          'onUpdate:modelValue': handleUpdateModelValue
        })
      }
    })

    const app = createApp(InputWrapper)
    
    // 挂载并获取组件实例
    const instance = app.mount(container) as ComponentPublicInstance<typeof Input>
    this._componentInstance = instance
    this._appInstance = app

    return container
  }

  // 更新组件属性（不重新渲染）
  private _updateComponentProps(): void {
    if (this._componentInstance && this._mounted) {
      // 对于值的变化，使用 setValue 方法
      this._componentInstance.setValue(this._options.value)
      // 其他属性变化需要重新渲染，但这里简化处理
      // 在实际项目中，可以考虑更细粒度的更新
    }
  }

  override unmount(): void {
    if (this._appInstance) {
      this._appInstance.unmount()
      this._appInstance = null
      this._componentInstance = null
    }
    super.unmount()
  }

  renderFallback(): HTMLElement {
    const input = document.createElement('input')
    input.type = this._options.type === 'password' ? 'password' : 'text'
    input.placeholder = this._options.placeholder
    input.disabled = this._options.disabled
    input.value = this._options.value
    input.className = 'fallback-input'

    // 同步事件系统
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value
      this._options.value = value
      this.emit('change', value)
      this.emit('input', value)
    })

    input.addEventListener('blur', (e) => {
      this.emit('blur', e)
    })

    input.addEventListener('focus', (e) => {
      this.emit('focus', e)
    })

    return input
  }
}

export default NhaiInputCommand