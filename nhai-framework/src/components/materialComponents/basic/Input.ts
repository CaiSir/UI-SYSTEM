import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * 输入框类型枚举
 */
export enum InputType {
  TEXT = 'text',                 // 文本输入框
  MULTILINE = 'multiline',       // 多行输入框
  PASSWORD = 'password',         // 密码输入框
  NUMBER = 'number',            // 数字输入框
  SEARCH = 'search',            // 搜索输入框
  FILE = 'file',                // 文件输入框
  DATE = 'date',                // 日期输入框
  EMAIL = 'email',               // 邮箱输入框
  URL = 'url',                  // URL输入框
  TEL = 'tel'                   // 电话输入框
}

/**
 * 输入框尺寸枚举
 */
export enum InputSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

/**
 * 输入框状态枚举
 */
export enum InputState {
  NORMAL = 'normal',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning'
}

/**
 * 输入框组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialInput extends NHAIWidget {
  private _value: string = ''                                                                                    // 输入值
  private _type: InputType = InputType.TEXT                                                                       // 输入类型
  private _placeholder: string = ''                                                                              // 占位符文本
  private _disabled: boolean = false                                                                              // 是否禁用
  private _required: boolean = false                                                                              // 是否必填
  private _readOnly: boolean = false                                                                              // 是否只读
  private _multiline: boolean = false                                                                             // 是否多行
  private _rows: number = 1                                                                                       // 行数
  private _label: string = ''                                                                                     // 标签文本
  private _helperText: string = ''                                                                                // 帮助文本
  private _state: InputState = InputState.NORMAL                                                                   // 输入框状态
  private _size: InputSize = InputSize.MEDIUM                                                                      // 输入框大小
  private _maxLength: number = 0                                                                                  // 最大长度
  private _minLength: number = 0                                                                                  // 最小长度
  private _pattern?: string                                                                                       // 正则表达式模式
  private _prefix?: string                                                                                         // 前缀文本
  private _suffix?: string                                                                                         // 后缀文本
  private _clearable: boolean = false                                                                              // 是否可清除
  private _showPassword: boolean = false                                                                           // 是否显示密码
  private _onChange?: (value: string) => void                                                                    // 变化回调函数
  private _onFocus?: () => void                                                                                   // 焦点回调函数
  private _onBlur?: () => void                                                                                    // 失焦回调函数
  private _onClear?: () => void                                                                                   // 清除回调函数
  private _onFileSelect?: (files: FileList) => void                                                              // 文件选择回调函数

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // ========== 基础属性设置 ==========

  // 设置值
  setValue(value: string): void {
    this._value = value
  }

  value(): string {
    return this._value
  }

  // 设置输入类型
  setType(type: InputType): void {
    this._type = type
    this.adjustPropertiesByType(type)
  }

  type(): InputType {
    return this._type
  }

  // 设置占位符
  setPlaceholder(placeholder: string): void {
    this._placeholder = placeholder
  }

  placeholder(): string {
    return this._placeholder
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置必填
  setRequired(required: boolean): void {
    this._required = required
  }

  required(): boolean {
    return this._required
  }

  // 设置只读
  setReadOnly(readOnly: boolean): void {
    this._readOnly = readOnly
  }

  readOnly(): boolean {
    return this._readOnly
  }

  // ========== 多行相关 ==========

  // 设置多行
  setMultiline(multiline: boolean): void {
    this._multiline = multiline
    if (multiline) {
      this._type = InputType.MULTILINE
    }
  }

  multiline(): boolean {
    return this._multiline
  }

  // 设置行数
  setRows(rows: number): void {
    this._rows = rows
  }

  rows(): number {
    return this._rows
  }

  // ========== 标签和帮助文本 ==========

  // 设置标签
  setLabel(label: string): void {
    this._label = label
  }

  label(): string {
    return this._label
  }

  // 设置帮助文本
  setHelperText(text: string): void {
    this._helperText = text
  }

  helperText(): string {
    return this._helperText
  }

  // ========== 状态相关 ==========

  // 设置状态
  setState(state: InputState): void {
    this._state = state
  }

  state(): InputState {
    return this._state
  }

  // 设置错误状态
  setError(error: boolean): void {
    this._state = error ? InputState.ERROR : InputState.NORMAL
  }

  error(): boolean {
    return this._state === InputState.ERROR
  }

  // 设置成功状态
  setSuccess(success: boolean): void {
    this._state = success ? InputState.SUCCESS : InputState.NORMAL
  }

  success(): boolean {
    return this._state === InputState.SUCCESS
  }

  // ========== 大小和限制 ==========

  // 设置大小
  setSize(size: InputSize): void {
    this._size = size
  }

  size(): InputSize {
    return this._size
  }

  // 设置最大长度
  setMaxLength(maxLength: number): void {
    this._maxLength = maxLength
  }

  maxLength(): number {
    return this._maxLength
  }

  // 设置最小长度
  setMinLength(minLength: number): void {
    this._minLength = minLength
  }

  minLength(): number {
    return this._minLength
  }

  // 设置正则表达式模式
  setPattern(pattern: string): void {
    this._pattern = pattern
  }

  pattern(): string | undefined {
    return this._pattern
  }

  // ========== 前缀后缀 ==========

  // 设置前缀
  setPrefix(prefix: string): void {
    this._prefix = prefix
  }

  prefix(): string | undefined {
    return this._prefix
  }

  // 设置后缀
  setSuffix(suffix: string): void {
    this._suffix = suffix
  }

  suffix(): string | undefined {
    return this._suffix
  }

  // ========== 特殊功能 ==========

  // 设置可清除
  setClearable(clearable: boolean): void {
    this._clearable = clearable
  }

  clearable(): boolean {
    return this._clearable
  }

  // 设置显示密码
  setShowPassword(showPassword: boolean): void {
    this._showPassword = showPassword
  }

  showPassword(): boolean {
    return this._showPassword
  }

  // 清除输入
  clear(): void {
    this._value = ''
    this._onClear?.()
  }

  // ========== 事件回调 ==========

  // 设置变化事件
  setOnChange(handler: (value: string) => void): void {
    this._onChange = handler
  }

  // 设置焦点事件
  setOnFocus(handler: () => void): void {
    this._onFocus = handler
  }

  // 设置失焦事件
  setOnBlur(handler: () => void): void {
    this._onBlur = handler
  }

  // 设置清除事件
  setOnClear(handler: () => void): void {
    this._onClear = handler
  }

  // 设置文件选择事件
  setOnFileSelect(handler: (files: FileList) => void): void {
    this._onFileSelect = handler
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    // 根据输入类型选择渲染方法
    switch (this._type) {
      case InputType.MULTILINE:
        return this.renderMultilineInput(adapter)
      case InputType.FILE:
        return this.renderFileInput(adapter)
      case InputType.SEARCH:
        return this.renderSearchInput(adapter)
      case InputType.PASSWORD:
        return this.renderPasswordInput(adapter)
      default:
        return this.renderBasicInput(adapter)
    }
  }

  // ========== 私有方法 ==========

  private adjustPropertiesByType(type: InputType): void {
    switch (type) {
      case InputType.MULTILINE:
        this._multiline = true
        break
      case InputType.PASSWORD:
        this._showPassword = false
        break
      case InputType.SEARCH:
        this._clearable = true
        break
      case InputType.FILE:
        this._placeholder = '选择文件...'
        break
      case InputType.NUMBER:
        this._pattern = '[0-9]*'
        break
      case InputType.EMAIL:
        this._pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
        break
      case InputType.URL:
        this._pattern = 'https?://.+'
        break
    }
  }

  private buildInputClasses(): string {
    let classes = ['validate']
    
    // 添加大小类
    switch (this._size) {
      case InputSize.SMALL:
        classes.push('input-small')
        break
      case InputSize.LARGE:
        classes.push('input-large')
        break
    }
    
    // 添加状态类
    switch (this._state) {
      case InputState.ERROR:
        classes.push('invalid')
        break
      case InputState.SUCCESS:
        classes.push('valid')
        break
      case InputState.WARNING:
        classes.push('warning')
        break
    }
    
    // 添加特殊类型类
    if (this._type === InputType.MULTILINE) {
      classes.push('materialize-textarea')
    }
    
    return classes.join(' ')
  }

  private buildContainerClasses(): string {
    let classes = ['input-field']
    
    // 添加大小类
    switch (this._size) {
      case InputSize.SMALL:
        classes.push('input-field-small')
        break
      case InputSize.LARGE:
        classes.push('input-field-large')
        break
    }
    
    return classes.join(' ')
  }

  private renderBasicInput(adapter: any): any {
    const children: any[] = []

    // 创建输入框
    const inputElement = this.createInputElement(adapter)
    children.push(inputElement)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建帮助文本
    if (this._helperText) {
      const helperElement = adapter.createElement('span', {
        className: 'helper-text',
        'data-error': this._state === InputState.ERROR ? this._helperText : '',
        'data-success': this._state === InputState.SUCCESS ? this._helperText : ''
      }, [this._helperText])
      children.push(helperElement)
    }

    // 创建清除按钮
    if (this._clearable && this._value) {
      const clearButton = adapter.createElement('i', {
        className: 'material-icons clear-button',
        onClick: () => this.clear()
      }, ['clear'])
      children.push(clearButton)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderMultilineInput(adapter: any): any {
    const children: any[] = []

    // 创建文本域
    const textareaElement = this.createTextareaElement(adapter)
    children.push(textareaElement)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建帮助文本
    if (this._helperText) {
      const helperElement = adapter.createElement('span', {
        className: 'helper-text',
        'data-error': this._state === InputState.ERROR ? this._helperText : '',
        'data-success': this._state === InputState.SUCCESS ? this._helperText : ''
      }, [this._helperText])
      children.push(helperElement)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderFileInput(adapter: any): any {
    const children: any[] = []

    // 创建文件输入框
    const fileInput = adapter.createElement('input', {
      type: 'file',
      className: this.buildInputClasses(),
      disabled: this._disabled,
      required: this._required,
      onChange: (e: Event) => {
        const target = e.target as HTMLInputElement
        if (target.files && this._onFileSelect) {
          this._onFileSelect(target.files)
        }
      }
    })
    children.push(fileInput)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: 'file-label'
      }, [this._label])
      children.push(labelElement)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses() + ' file-field'
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderSearchInput(adapter: any): any {
    const children: any[] = []

    // 创建搜索图标
    const searchIcon = adapter.createElement('i', {
      className: 'material-icons prefix'
    }, ['search'])
    children.push(searchIcon)

    // 创建输入框
    const inputElement = this.createInputElement(adapter)
    children.push(inputElement)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建清除按钮
    if (this._clearable && this._value) {
      const clearButton = adapter.createElement('i', {
        className: 'material-icons suffix clear-button',
        onClick: () => this.clear()
      }, ['clear'])
      children.push(clearButton)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderPasswordInput(adapter: any): any {
    const children: any[] = []

    // 创建输入框
    const inputElement = this.createInputElement(adapter)
    children.push(inputElement)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建显示/隐藏密码按钮
    const toggleButton = adapter.createElement('i', {
      className: 'material-icons suffix password-toggle',
      onClick: () => {
        this._showPassword = !this._showPassword
        // 这里需要重新渲染或更新输入框类型
      }
    }, [this._showPassword ? 'visibility' : 'visibility_off'])
    children.push(toggleButton)

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private createInputElement(adapter: any): any {
    const props: any = {
      value: this._value,
      placeholder: this._placeholder,
      disabled: this._disabled,
      required: this._required,
      readOnly: this._readOnly,
      className: this.buildInputClasses(),
      type: this._type === InputType.PASSWORD && !this._showPassword ? 'password' : this.getInputType()
    }

    if (this._maxLength > 0) {
      props.maxLength = this._maxLength
    }
    if (this._minLength > 0) {
      props.minLength = this._minLength
    }
    if (this._pattern) {
      props.pattern = this._pattern
    }

    // 添加事件处理
    if (this._onChange) {
      props.onInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        this._value = target.value
        this._onChange?.(target.value)
      }
    }

    if (this._onFocus) {
      props.onFocus = this._onFocus
    }

    if (this._onBlur) {
      props.onBlur = this._onBlur
    }

    return adapter.createElement('input', props)
  }

  private createTextareaElement(adapter: any): any {
    const props: any = {
      value: this._value,
      placeholder: this._placeholder,
      disabled: this._disabled,
      required: this._required,
      readOnly: this._readOnly,
      rows: this._rows,
      className: this.buildInputClasses()
    }

    if (this._maxLength > 0) {
      props.maxLength = this._maxLength
    }
    if (this._minLength > 0) {
      props.minLength = this._minLength
    }

    // 添加事件处理
    if (this._onChange) {
      props.onInput = (e: Event) => {
        const target = e.target as HTMLTextAreaElement
        this._value = target.value
        this._onChange?.(target.value)
      }
    }

    if (this._onFocus) {
      props.onFocus = this._onFocus
    }

    if (this._onBlur) {
      props.onBlur = this._onBlur
    }

    return adapter.createElement('textarea', props)
  }

  private getInputType(): string {
    switch (this._type) {
      case InputType.NUMBER:
        return 'number'
      case InputType.EMAIL:
        return 'email'
      case InputType.URL:
        return 'url'
      case InputType.TEL:
        return 'tel'
      case InputType.DATE:
        return 'date'
      case InputType.SEARCH:
        return 'search'
      default:
        return 'text'
    }
  }
}