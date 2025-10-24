import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * 选择框类型枚举
 */
export enum SelectType {
  BASIC = 'basic',             // 基础选择框
  MULTIPLE = 'multiple',       // 多选选择框
  SEARCH = 'search',           // 搜索选择框
  CASCADE = 'cascade',         // 级联选择框
  TAGS = 'tags',               // 标签选择框
  TREE = 'tree'                // 树形选择框
}

/**
 * 选择框尺寸枚举
 */
export enum SelectSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

/**
 * 选择框状态枚举
 */
export enum SelectState {
  NORMAL = 'normal',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  children?: SelectOption[]  // 用于级联选择
}

export interface CascadeOption {
  value: string | number
  label: string
  children?: CascadeOption[]
}

export interface TreeOption {
  value: string | number
  label: string
  children?: TreeOption[]
  expandable?: boolean
}

/**
 * 选择框组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialSelect extends NHAIWidget {
  private _value: string | number | (string | number)[] = ''                                                     // 选中值
  private _type: SelectType = SelectType.BASIC                                                                   // 选择框类型
  private _options: SelectOption[] = []                                                                           // 选项列表
  private _multiple: boolean = false                                                                              // 是否多选
  private _disabled: boolean = false                                                                              // 是否禁用
  private _required: boolean = false                                                                              // 是否必填
  private _size: SelectSize = SelectSize.MEDIUM                                                                   // 选择框大小
  private _state: SelectState = SelectState.NORMAL                                                                 // 选择框状态
  private _label: string = ''                                                                                     // 标签文本
  private _placeholder: string = ''                                                                               // 占位符文本
  private _helperText: string = ''                                                                                // 帮助文本
  private _searchable: boolean = false                                                                             // 是否可搜索
  private _searchPlaceholder: string = '搜索...'                                                                   // 搜索占位符
  private _cascadeOptions: CascadeOption[] = []                                                                   // 级联选项
  private _treeOptions: TreeOption[] = []                                                                         // 树形选项
  private _maxTags: number = 0                                                                                    // 最大标签数
  private _allowCreate: boolean = false                                                                            // 是否允许创建新选项
  private _onChange?: (value: string | number | (string | number)[]) => void                                    // 变化回调函数
  private _onFocus?: () => void                                                                                   // 焦点回调函数
  private _onBlur?: () => void                                                                                    // 失焦回调函数
  private _onSearch?: (keyword: string) => void                                                                   // 搜索回调函数
  private _onCascadeChange?: (values: (string | number)[]) => void                                              // 级联变化回调函数

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // ========== 基础属性设置 ==========

  // 设置值
  setValue(value: string | number | (string | number)[]): void {
    this._value = value
  }

  value(): string | number | (string | number)[] {
    return this._value
  }

  // 设置选择框类型
  setType(type: SelectType): void {
    this._type = type
    this.adjustPropertiesByType(type)
  }

  type(): SelectType {
    return this._type
  }

  // 设置选项
  setOptions(options: SelectOption[]): void {
    this._options = options
  }

  options(): SelectOption[] {
    return this._options
  }

  // 添加选项
  addOption(option: SelectOption): void {
    this._options.push(option)
  }

  // ========== 多选相关 ==========

  // 设置多选
  setMultiple(multiple: boolean): void {
    this._multiple = multiple
    if (multiple) {
      this._type = SelectType.MULTIPLE
    }
  }

  multiple(): boolean {
    return this._multiple
  }

  // ========== 状态和大小 ==========

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

  // 设置大小
  setSize(size: SelectSize): void {
    this._size = size
  }

  size(): SelectSize {
    return this._size
  }

  // 设置状态
  setState(state: SelectState): void {
    this._state = state
  }

  state(): SelectState {
    return this._state
  }

  // ========== 标签和帮助文本 ==========

  // 设置标签
  setLabel(label: string): void {
    this._label = label
  }

  label(): string {
    return this._label
  }

  // 设置占位符
  setPlaceholder(placeholder: string): void {
    this._placeholder = placeholder
  }

  placeholder(): string {
    return this._placeholder
  }

  // 设置帮助文本
  setHelperText(text: string): void {
    this._helperText = text
  }

  helperText(): string {
    return this._helperText
  }

  // ========== 搜索相关 ==========

  // 设置可搜索
  setSearchable(searchable: boolean): void {
    this._searchable = searchable
    if (searchable) {
      this._type = SelectType.SEARCH
    }
  }

  searchable(): boolean {
    return this._searchable
  }

  // 设置搜索占位符
  setSearchPlaceholder(placeholder: string): void {
    this._searchPlaceholder = placeholder
  }

  searchPlaceholder(): string {
    return this._searchPlaceholder
  }

  // ========== 级联选择相关 ==========

  // 设置级联选项
  setCascadeOptions(options: CascadeOption[]): void {
    this._cascadeOptions = options
    this._type = SelectType.CASCADE
  }

  cascadeOptions(): CascadeOption[] {
    return this._cascadeOptions
  }

  // ========== 树形选择相关 ==========

  // 设置树形选项
  setTreeOptions(options: TreeOption[]): void {
    this._treeOptions = options
    this._type = SelectType.TREE
  }

  treeOptions(): TreeOption[] {
    return this._treeOptions
  }

  // ========== 标签选择相关 ==========

  // 设置最大标签数
  setMaxTags(maxTags: number): void {
    this._maxTags = maxTags
  }

  maxTags(): number {
    return this._maxTags
  }

  // 设置允许创建
  setAllowCreate(allowCreate: boolean): void {
    this._allowCreate = allowCreate
  }

  allowCreate(): boolean {
    return this._allowCreate
  }

  // ========== 事件回调 ==========

  // 设置变化事件
  setOnChange(handler: (value: string | number | (string | number)[]) => void): void {
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

  // 设置搜索事件
  setOnSearch(handler: (keyword: string) => void): void {
    this._onSearch = handler
  }

  // 设置级联变化事件
  setOnCascadeChange(handler: (values: (string | number)[]) => void): void {
    this._onCascadeChange = handler
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    // 根据选择框类型选择渲染方法
    switch (this._type) {
      case SelectType.MULTIPLE:
        return this.renderMultipleSelect(adapter)
      case SelectType.SEARCH:
        return this.renderSearchSelect(adapter)
      case SelectType.CASCADE:
        return this.renderCascadeSelect(adapter)
      case SelectType.TAGS:
        return this.renderTagsSelect(adapter)
      case SelectType.TREE:
        return this.renderTreeSelect(adapter)
      case SelectType.BASIC:
      default:
        return this.renderBasicSelect(adapter)
    }
  }

  // ========== 私有方法 ==========

  private adjustPropertiesByType(type: SelectType): void {
    switch (type) {
      case SelectType.MULTIPLE:
        this._multiple = true
        break
      case SelectType.SEARCH:
        this._searchable = true
        break
      case SelectType.CASCADE:
        this._placeholder = '请选择...'
        break
      case SelectType.TAGS:
        this._multiple = true
        this._allowCreate = true
        break
      case SelectType.TREE:
        this._placeholder = '请选择节点...'
        break
    }
  }

  private buildSelectClasses(): string {
    let classes = ['browser-default']
    
    // 添加大小类
    switch (this._size) {
      case SelectSize.SMALL:
        classes.push('select-small')
        break
      case SelectSize.LARGE:
        classes.push('select-large')
        break
    }
    
    // 添加状态类
    switch (this._state) {
      case SelectState.ERROR:
        classes.push('invalid')
        break
      case SelectState.SUCCESS:
        classes.push('valid')
        break
      case SelectState.WARNING:
        classes.push('warning')
        break
    }
    
    return classes.join(' ')
  }

  private buildContainerClasses(): string {
    let classes = ['input-field']
    
    // 添加大小类
    switch (this._size) {
      case SelectSize.SMALL:
        classes.push('input-field-small')
        break
      case SelectSize.LARGE:
        classes.push('input-field-large')
        break
    }
    
    return classes.join(' ')
  }

  private renderBasicSelect(adapter: any): any {
    const children: any[] = []

    // 创建选择框
    const selectElement = this.createSelectElement(adapter)
    children.push(selectElement)

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
        'data-error': this._state === SelectState.ERROR ? this._helperText : ''
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

  private renderMultipleSelect(adapter: any): any {
    const children: any[] = []

    // 创建多选选择框
    const selectElement = this.createSelectElement(adapter)
    children.push(selectElement)

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
        'data-error': this._state === SelectState.ERROR ? this._helperText : ''
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

  private renderSearchSelect(adapter: any): any {
    const children: any[] = []

    // 创建搜索输入框
    const searchInput = adapter.createElement('input', {
      type: 'text',
      placeholder: this._searchPlaceholder,
      className: 'search-input',
      onInput: (e: Event) => {
        const target = e.target as HTMLInputElement
        this._onSearch?.(target.value)
      }
    })
    children.push(searchInput)

    // 创建选择框
    const selectElement = this.createSelectElement(adapter)
    children.push(selectElement)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses() + ' search-select'
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderCascadeSelect(adapter: any): any {
    const children: any[] = []

    // 创建级联选择器
    const cascadeContainer = adapter.createElement('div', {
      className: 'cascade-select'
    })

    // 这里需要实现级联选择的复杂逻辑
    // 包括多级选择框的创建和联动

    children.push(cascadeContainer)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderTagsSelect(adapter: any): any {
    const children: any[] = []

    // 创建标签容器
    const tagsContainer = adapter.createElement('div', {
      className: 'tags-container'
    })

    // 创建已选择的标签
    if (Array.isArray(this._value)) {
      this._value.forEach((val, index) => {
        const tag = adapter.createElement('span', {
          className: 'tag',
          onClick: () => this.removeTag(index)
        }, [this.getOptionLabel(val), ' ×'])
        tagsContainer.appendChild(tag)
      })
    }

    // 创建输入框
    const inputElement = adapter.createElement('input', {
      type: 'text',
      placeholder: this._placeholder,
      className: 'tags-input',
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          const target = e.target as HTMLInputElement
          if (target.value.trim()) {
            this.addTag(target.value.trim())
            target.value = ''
          }
        }
      }
    })
    tagsContainer.appendChild(inputElement)

    children.push(tagsContainer)

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses() + ' tags-select'
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private renderTreeSelect(adapter: any): any {
    const children: any[] = []

    // 创建树形选择器
    const treeContainer = adapter.createElement('div', {
      className: 'tree-select'
    })

    // 这里需要实现树形选择的复杂逻辑
    // 包括树形结构的渲染和选择

    children.push(treeContainer)

    // 创建标签
    if (this._label) {
      const labelElement = adapter.createElement('label', {
        className: this._label ? 'active' : ''
      }, [this._label])
      children.push(labelElement)
    }

    // 创建容器
    const containerProps: any = {
      className: this.buildContainerClasses()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    return adapter.createElement('div', containerProps, children)
  }

  private createSelectElement(adapter: any): any {
    const props: any = {
      disabled: this._disabled,
      required: this._required,
      className: this.buildSelectClasses()
    }

    if (this._multiple) {
      props.multiple = true
    }

    if (this._placeholder && !this._multiple) {
      props.className += ' validate'
    }

    // 添加事件处理
    if (this._onChange) {
      props.onChange = (e: Event) => {
        const target = e.target as HTMLSelectElement
        if (this._multiple) {
          const selectedValues = Array.from(target.selectedOptions).map(option => option.value)
          this._value = selectedValues
          this._onChange?.(selectedValues)
        } else {
          this._value = target.value
          this._onChange?.(target.value)
        }
      }
    }

    if (this._onFocus) {
      props.onFocus = this._onFocus
    }

    if (this._onBlur) {
      props.onBlur = this._onBlur
    }

    // 创建选项
    const optionElements = this.createOptionElements(adapter)

    return adapter.createElement('select', props, optionElements)
  }

  private createOptionElements(adapter: any): any[] {
    const elements: any[] = []

    // 添加占位符选项
    if (this._placeholder && !this._multiple) {
      const placeholderOption = adapter.createElement('option', {
        value: '',
        disabled: true,
        selected: !this._value
      }, [this._placeholder])
      elements.push(placeholderOption)
    }

    // 添加选项
    this._options.forEach(option => {
      const optionProps: any = {
        value: String(option.value),
        disabled: option.disabled
      }

      // 设置选中状态
      if (this._multiple) {
        if (Array.isArray(this._value) && this._value.includes(option.value)) {
          optionProps.selected = true
        }
      } else {
        if (this._value === option.value) {
          optionProps.selected = true
        }
      }

      const optionElement = adapter.createElement('option', optionProps, [option.label])
      elements.push(optionElement)
    })

    return elements
  }

  private getOptionLabel(value: string | number): string {
    const option = this._options.find(opt => opt.value === value)
    return option ? option.label : String(value)
  }

  private addTag(tagValue: string): void {
    if (Array.isArray(this._value)) {
      if (!this._value.includes(tagValue)) {
        this._value.push(tagValue)
        this._onChange?.(this._value)
      }
    } else {
      this._value = [tagValue]
      this._onChange?.(this._value)
    }
  }

  private removeTag(index: number): void {
    if (Array.isArray(this._value)) {
      this._value.splice(index, 1)
      this._onChange?.(this._value)
    }
  }
}