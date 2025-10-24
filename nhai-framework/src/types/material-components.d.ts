/**
 * NHAI Material Components 类型定义文件
 * 提供所有 Material Design 组件的类型声明和接口定义
 * 
 * @author NHAI Framework Team
 * @version 1.0.0
 * @since 2024
 */

// ========== 基础组件 (Basic Components) ==========

/**
 * 按钮类型枚举
 * 定义按钮的不同显示类型
 */
export enum ButtonType {
  /** 基础按钮 - 标准的按钮样式 */
  BASIC = "basic",
  /** 仅图标按钮 - 只显示图标，无文字 */
  ICON_ONLY = "icon-only",
  /** 仅文字按钮 - 只显示文字，无图标 */
  TEXT_ONLY = "text-only",
  /** 图标+文字按钮 - 同时显示图标和文字 */
  ICON_TEXT = "icon-text",
  /** 浮动按钮 - Material Design 的浮动操作按钮 */
  FLOATING = "floating",
  /** 下拉按钮 - 带有下拉菜单的按钮 */
  DROPDOWN = "dropdown",
  /** 切换按钮 - 可以切换状态的按钮 */
  TOGGLE = "toggle"
}

/**
 * 按钮尺寸枚举
 * 定义按钮的不同尺寸规格
 */
export enum ButtonSize {
  /** 小尺寸按钮 */
  SMALL = "small",
  /** 中等尺寸按钮 */
  MEDIUM = "medium",
  /** 大尺寸按钮 */
  LARGE = "large",
  /** 超大尺寸按钮 */
  EXTRA_LARGE = "extra-large"
}

/**
 * 按钮颜色枚举
 * Material Design 颜色系统
 */
export enum ButtonColor {
  RED = "red",
  PINK = "pink",
  PURPLE = "purple",
  DEEP_PURPLE = "deep-purple",
  INDIGO = "indigo",
  BLUE = "blue",
  LIGHT_BLUE = "light-blue",
  CYAN = "cyan",
  TEAL = "teal",
  GREEN = "green",
  LIGHT_GREEN = "light-green",
  LIME = "lime",
  YELLOW = "yellow",
  AMBER = "amber",
  ORANGE = "orange",
  DEEP_ORANGE = "deep-orange",
  BROWN = "brown",
  GREY = "grey",
  BLUE_GREY = "blue-grey"
}

/**
 * Material Design 按钮组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 * 
 * @example
 * ```typescript
 * const button = new MaterialButton('点击我')
 * button.setType(ButtonType.BASIC)
 * button.setColor(ButtonColor.BLUE)
 * button.setSize(ButtonSize.MEDIUM)
 * button.setOnClick(() => console.log('按钮被点击'))
 * ```
 */
export declare class MaterialButton extends NHAIWidget {
  private _text: string
  private _type: ButtonType
  private _variant: 'flat' | 'raised' | 'floating'
  private _color: ButtonColor
  private _size: ButtonSize
  private _disabled: boolean
  private _loading: boolean
  private _onClick?: () => void
  private _icon?: string
  private _iconPosition: 'left' | 'right'
  private _dropdownItems?: Array<{
    text: string
    value: any
    onClick?: () => void
  }>
  private _toggleState: boolean
  private _onToggle?: (state: boolean) => void

  /**
   * 创建 Material 按钮实例
   * @param text 按钮文字
   * @param parent 父组件
   */
  constructor(text?: string, parent?: NHAIObject)

  /** 设置按钮文字 */
  setText(text: string): void
  /** 获取按钮文字 */
  text(): string

  /** 设置按钮类型 */
  setType(type: ButtonType): void
  /** 获取按钮类型 */
  type(): ButtonType

  /** 设置按钮变体 */
  setVariant(variant: 'flat' | 'raised' | 'floating'): void
  /** 获取按钮变体 */
  variant(): string

  /** 设置按钮颜色 */
  setColor(color: ButtonColor): void
  /** 获取按钮颜色 */
  color(): ButtonColor

  /** 设置按钮尺寸 */
  setSize(size: ButtonSize): void
  /** 获取按钮尺寸 */
  size(): ButtonSize

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置加载状态 */
  setLoading(loading: boolean): void
  /** 获取加载状态 */
  loading(): boolean

  /** 设置图标 */
  setIcon(icon: string): void
  /** 获取图标 */
  icon(): string | undefined

  /** 设置图标位置 */
  setIconPosition(position: 'left' | 'right'): void
  /** 获取图标位置 */
  iconPosition(): string

  /** 设置下拉菜单项 */
  setDropdownItems(items: Array<{
    text: string
    value: any
    onClick?: () => void
  }>): void
  /** 获取下拉菜单项 */
  dropdownItems(): Array<{
    text: string
    value: any
    onClick?: () => void
  }> | undefined

  /** 设置切换状态 */
  setToggleState(state: boolean): void
  /** 获取切换状态 */
  toggleState(): boolean
  /** 切换状态 */
  toggle(): void

  /** 设置点击事件处理器 */
  setOnClick(handler: () => void): void
  /** 设置切换事件处理器 */
  setOnToggle(handler: (state: boolean) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

// ========== 输入组件 (Input Components) ==========

/**
 * 输入框类型枚举
 */
export enum InputType {
  /** 文本输入框 */
  TEXT = "text",
  /** 多行输入框 */
  MULTILINE = "multiline",
  /** 密码输入框 */
  PASSWORD = "password",
  /** 数字输入框 */
  NUMBER = "number",
  /** 搜索输入框 */
  SEARCH = "search",
  /** 文件输入框 */
  FILE = "file",
  /** 日期输入框 */
  DATE = "date",
  /** 邮箱输入框 */
  EMAIL = "email",
  /** URL输入框 */
  URL = "url",
  /** 电话输入框 */
  TEL = "tel"
}

/**
 * 输入框尺寸枚举
 */
export enum InputSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

/**
 * 输入框状态枚举
 */
export enum InputState {
  NORMAL = "normal",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning"
}

/**
 * Material Design 输入框组件
 * 支持多种输入类型和状态管理
 * 
 * @example
 * ```typescript
 * const input = new MaterialInput()
 * input.setType(InputType.TEXT)
 * input.setPlaceholder('请输入内容')
 * input.setLabel('用户名')
 * input.setState(InputState.NORMAL)
 * input.setOnChange((value) => console.log('输入值:', value))
 * ```
 */
export declare class MaterialInput extends NHAIWidget {
  private _value: string
  private _type: InputType
  private _placeholder: string
  private _disabled: boolean
  private _required: boolean
  private _readOnly: boolean
  private _multiline: boolean
  private _rows: number
  private _label: string
  private _helperText: string
  private _state: InputState
  private _size: InputSize
  private _maxLength: number
  private _minLength: number
  private _pattern?: string
  private _prefix?: string
  private _suffix?: string
  private _clearable: boolean
  private _showPassword: boolean
  private _onChange?: (value: string) => void
  private _onFocus?: () => void
  private _onBlur?: () => void
  private _onClear?: () => void
  private _onFileSelect?: (files: FileList) => void

  constructor(parent?: NHAIObject)

  /** 设置输入值 */
  setValue(value: string): void
  /** 获取输入值 */
  value(): string

  /** 设置输入类型 */
  setType(type: InputType): void
  /** 获取输入类型 */
  type(): InputType

  /** 设置占位符 */
  setPlaceholder(placeholder: string): void
  /** 获取占位符 */
  placeholder(): string

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置必填状态 */
  setRequired(required: boolean): void
  /** 获取必填状态 */
  required(): boolean

  /** 设置只读状态 */
  setReadOnly(readOnly: boolean): void
  /** 获取只读状态 */
  readOnly(): boolean

  /** 设置多行模式 */
  setMultiline(multiline: boolean): void
  /** 获取多行模式 */
  multiline(): boolean

  /** 设置行数 */
  setRows(rows: number): void
  /** 获取行数 */
  rows(): number

  /** 设置标签 */
  setLabel(label: string): void
  /** 获取标签 */
  label(): string

  /** 设置帮助文本 */
  setHelperText(text: string): void
  /** 获取帮助文本 */
  helperText(): string

  /** 设置状态 */
  setState(state: InputState): void
  /** 获取状态 */
  state(): InputState

  /** 设置错误状态 */
  setError(error: boolean): void
  /** 获取错误状态 */
  error(): boolean

  /** 设置成功状态 */
  setSuccess(success: boolean): void
  /** 获取成功状态 */
  success(): boolean

  /** 设置尺寸 */
  setSize(size: InputSize): void
  /** 获取尺寸 */
  size(): InputSize

  /** 设置最大长度 */
  setMaxLength(maxLength: number): void
  /** 获取最大长度 */
  maxLength(): number

  /** 设置最小长度 */
  setMinLength(minLength: number): void
  /** 获取最小长度 */
  minLength(): number

  /** 设置正则表达式 */
  setPattern(pattern: string): void
  /** 获取正则表达式 */
  pattern(): string | undefined

  /** 设置前缀 */
  setPrefix(prefix: string): void
  /** 获取前缀 */
  prefix(): string | undefined

  /** 设置后缀 */
  setSuffix(suffix: string): void
  /** 获取后缀 */
  suffix(): string | undefined

  /** 设置可清除 */
  setClearable(clearable: boolean): void
  /** 获取可清除 */
  clearable(): boolean

  /** 设置显示密码 */
  setShowPassword(showPassword: boolean): void
  /** 获取显示密码 */
  showPassword(): boolean

  /** 清除内容 */
  clear(): void

  /** 设置值变化事件处理器 */
  setOnChange(handler: (value: string) => void): void
  /** 设置获得焦点事件处理器 */
  setOnFocus(handler: () => void): void
  /** 设置失去焦点事件处理器 */
  setOnBlur(handler: () => void): void
  /** 设置清除事件处理器 */
  setOnClear(handler: () => void): void
  /** 设置文件选择事件处理器 */
  setOnFileSelect(handler: (files: FileList) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

// ========== 选择组件 (Select Components) ==========

/**
 * 选择框类型枚举
 */
export enum SelectType {
  /** 基础选择框 */
  BASIC = "basic",
  /** 多选选择框 */
  MULTIPLE = "multiple",
  /** 搜索选择框 */
  SEARCH = "search",
  /** 级联选择框 */
  CASCADE = "cascade",
  /** 标签选择框 */
  TAGS = "tags",
  /** 树形选择框 */
  TREE = "tree"
}

/**
 * 选择框尺寸枚举
 */
export enum SelectSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

/**
 * 选择框状态枚举
 */
export enum SelectState {
  NORMAL = "normal",
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning"
}

/**
 * 选择框选项接口
 */
export interface SelectOption {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
  /** 子选项 */
  children?: SelectOption[]
}

/**
 * 级联选项接口
 */
export interface CascadeOption {
  value: string | number
  label: string
  children?: CascadeOption[]
}

/**
 * 树形选项接口
 */
export interface TreeOption {
  value: string | number
  label: string
  children?: TreeOption[]
  expandable?: boolean
}

/**
 * Material Design 选择框组件
 * 支持单选、多选、搜索、级联等多种选择模式
 * 
 * @example
 * ```typescript
 * const select = new MaterialSelect()
 * select.setType(SelectType.BASIC)
 * select.setOptions([
 *   { value: '1', label: '选项1' },
 *   { value: '2', label: '选项2' }
 * ])
 * select.setOnChange((value) => console.log('选择值:', value))
 * ```
 */
export declare class MaterialSelect extends NHAIWidget {
  private _value: string | number | (string | number)[]
  private _type: SelectType
  private _options: SelectOption[]
  private _multiple: boolean
  private _disabled: boolean
  private _required: boolean
  private _size: SelectSize
  private _state: SelectState
  private _label: string
  private _placeholder: string
  private _helperText: string
  private _searchable: boolean
  private _searchPlaceholder: string
  private _cascadeOptions: CascadeOption[]
  private _treeOptions: TreeOption[]
  private _maxTags: number
  private _allowCreate: boolean
  private _onChange?: (value: string | number | (string | number)[]) => void
  private _onFocus?: () => void
  private _onBlur?: () => void
  private _onSearch?: (keyword: string) => void
  private _onCascadeChange?: (values: (string | number)[]) => void

  constructor(parent?: NHAIObject)

  /** 设置选中值 */
  setValue(value: string | number | (string | number)[]): void
  /** 获取选中值 */
  value(): string | number | (string | number)[]

  /** 设置选择类型 */
  setType(type: SelectType): void
  /** 获取选择类型 */
  type(): SelectType

  /** 设置选项列表 */
  setOptions(options: SelectOption[]): void
  /** 获取选项列表 */
  options(): SelectOption[]

  /** 添加选项 */
  addOption(option: SelectOption): void

  /** 设置多选模式 */
  setMultiple(multiple: boolean): void
  /** 获取多选模式 */
  multiple(): boolean

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置必填状态 */
  setRequired(required: boolean): void
  /** 获取必填状态 */
  required(): boolean

  /** 设置尺寸 */
  setSize(size: SelectSize): void
  /** 获取尺寸 */
  size(): SelectSize

  /** 设置状态 */
  setState(state: SelectState): void
  /** 获取状态 */
  state(): SelectState

  /** 设置标签 */
  setLabel(label: string): void
  /** 获取标签 */
  label(): string

  /** 设置占位符 */
  setPlaceholder(placeholder: string): void
  /** 获取占位符 */
  placeholder(): string

  /** 设置帮助文本 */
  setHelperText(text: string): void
  /** 获取帮助文本 */
  helperText(): string

  /** 设置可搜索 */
  setSearchable(searchable: boolean): void
  /** 获取可搜索 */
  searchable(): boolean

  /** 设置搜索占位符 */
  setSearchPlaceholder(placeholder: string): void
  /** 获取搜索占位符 */
  searchPlaceholder(): string

  /** 设置级联选项 */
  setCascadeOptions(options: CascadeOption[]): void
  /** 获取级联选项 */
  cascadeOptions(): CascadeOption[]

  /** 设置树形选项 */
  setTreeOptions(options: TreeOption[]): void
  /** 获取树形选项 */
  treeOptions(): TreeOption[]

  /** 设置最大标签数 */
  setMaxTags(maxTags: number): void
  /** 获取最大标签数 */
  maxTags(): number

  /** 设置允许创建 */
  setAllowCreate(allowCreate: boolean): void
  /** 获取允许创建 */
  allowCreate(): boolean

  /** 设置值变化事件处理器 */
  setOnChange(handler: (value: string | number | (string | number)[]) => void): void
  /** 设置获得焦点事件处理器 */
  setOnFocus(handler: () => void): void
  /** 设置失去焦点事件处理器 */
  setOnBlur(handler: () => void): void
  /** 设置搜索事件处理器 */
  setOnSearch(handler: (keyword: string) => void): void
  /** 设置级联变化事件处理器 */
  setOnCascadeChange(handler: (values: (string | number)[]) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

// ========== 表单控件 (Form Controls) ==========

/**
 * Material Design 复选框组件
 * 支持不确定状态和自定义样式
 * 
 * @example
 * ```typescript
 * const checkbox = new MaterialCheckbox()
 * checkbox.setLabel('同意条款')
 * checkbox.setChecked(true)
 * checkbox.setOnChange((checked) => console.log('选中状态:', checked))
 * ```
 */
export declare class MaterialCheckbox extends NHAIWidget {
  private _checked: boolean
  private _indeterminate: boolean
  private _disabled: boolean
  private _required: boolean
  private _size: 'small' | 'medium'
  private _color: 'primary' | 'secondary' | 'default'
  private _label: string
  private _labelPlacement: 'end' | 'start' | 'top' | 'bottom'
  private _onChange?: (checked: boolean) => void

  constructor(parent?: NHAIObject)

  /** 设置选中状态 */
  setChecked(checked: boolean): void
  /** 获取选中状态 */
  checked(): boolean

  /** 设置不确定状态 */
  setIndeterminate(indeterminate: boolean): void
  /** 获取不确定状态 */
  indeterminate(): boolean

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置必填状态 */
  setRequired(required: boolean): void
  /** 获取必填状态 */
  required(): boolean

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium'): void
  /** 获取尺寸 */
  size(): string

  /** 设置颜色 */
  setColor(color: 'primary' | 'secondary' | 'default'): void
  /** 获取颜色 */
  color(): string

  /** 设置标签 */
  setLabel(label: string): void
  /** 获取标签 */
  label(): string

  /** 设置标签位置 */
  setLabelPlacement(placement: 'end' | 'start' | 'top' | 'bottom'): void
  /** 获取标签位置 */
  labelPlacement(): string

  /** 设置变化事件处理器 */
  setOnChange(handler: (checked: boolean) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

/**
 * Material Design 单选框组件
 * 支持分组和自定义样式
 * 
 * @example
 * ```typescript
 * const radio = new MaterialRadio()
 * radio.setLabel('选项A')
 * radio.setName('group1')
 * radio.setValue('A')
 * radio.setOnChange((checked, value) => console.log('选中:', checked, value))
 * ```
 */
export declare class MaterialRadio extends NHAIWidget {
  private _checked: boolean
  private _disabled: boolean
  private _required: boolean
  private _size: 'small' | 'medium'
  private _color: 'primary' | 'secondary' | 'default'
  private _label: string
  private _labelPlacement: 'end' | 'start' | 'top' | 'bottom'
  private _name: string
  private _value: string | number
  private _onChange?: (checked: boolean, value: string | number) => void

  constructor(parent?: NHAIObject)

  /** 设置选中状态 */
  setChecked(checked: boolean): void
  /** 获取选中状态 */
  checked(): boolean

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置必填状态 */
  setRequired(required: boolean): void
  /** 获取必填状态 */
  required(): boolean

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium'): void
  /** 获取尺寸 */
  size(): string

  /** 设置颜色 */
  setColor(color: 'primary' | 'secondary' | 'default'): void
  /** 获取颜色 */
  color(): string

  /** 设置标签 */
  setLabel(label: string): void
  /** 获取标签 */
  label(): string

  /** 设置标签位置 */
  setLabelPlacement(placement: 'end' | 'start' | 'top' | 'bottom'): void
  /** 获取标签位置 */
  labelPlacement(): string

  /** 设置组名 */
  setName(name: string): void
  /** 获取组名 */
  name(): string

  /** 设置值 */
  setValue(value: string | number): void
  /** 获取值 */
  value(): string | number

  /** 设置变化事件处理器 */
  setOnChange(handler: (checked: boolean, value: string | number) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

/**
 * Material Design 开关组件
 * 支持多种颜色主题
 * 
 * @example
 * ```typescript
 * const switch = new MaterialSwitch()
 * switch.setLabel('启用通知')
 * switch.setChecked(true)
 * switch.setColor('primary')
 * switch.setOnChange((checked) => console.log('开关状态:', checked))
 * ```
 */
export declare class MaterialSwitch extends NHAIWidget {
  private _checked: boolean
  private _disabled: boolean
  private _required: boolean
  private _size: 'small' | 'medium'
  private _color: 'primary' | 'secondary' | 'default' | 'success' | 'error' | 'info' | 'warning'
  private _label: string
  private _labelPlacement: 'end' | 'start' | 'top' | 'bottom'
  private _onChange?: (checked: boolean) => void

  constructor(parent?: NHAIObject)

  /** 设置选中状态 */
  setChecked(checked: boolean): void
  /** 获取选中状态 */
  checked(): boolean

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置必填状态 */
  setRequired(required: boolean): void
  /** 获取必填状态 */
  required(): boolean

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium'): void
  /** 获取尺寸 */
  size(): string

  /** 设置颜色 */
  setColor(color: 'primary' | 'secondary' | 'default' | 'success' | 'error' | 'info' | 'warning'): void
  /** 获取颜色 */
  color(): string

  /** 设置标签 */
  setLabel(label: string): void
  /** 获取标签 */
  label(): string

  /** 设置标签位置 */
  setLabelPlacement(placement: 'end' | 'start' | 'top' | 'bottom'): void
  /** 获取标签位置 */
  labelPlacement(): string

  /** 设置变化事件处理器 */
  setOnChange(handler: (checked: boolean) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

// ========== 滑块组件 (Slider Components) ==========

/**
 * Material Design 滑块组件
 * 支持单值和范围选择
 * 
 * @example
 * ```typescript
 * const slider = new MaterialSlider()
 * slider.setMin(0)
 * slider.setMax(100)
 * slider.setValue(50)
 * slider.setStep(1)
 * slider.setOnChange((value) => console.log('滑块值:', value))
 * ```
 */
export declare class MaterialSlider extends NHAIWidget {
  private _value: number | number[]
  private _min: number
  private _max: number
  private _step: number
  private _disabled: boolean
  private _marks: boolean | Array<{
    value: number
    label?: string
  }>
  private _orientation: 'horizontal' | 'vertical'
  private _size: 'small' | 'medium'
  private _color: 'primary' | 'secondary'
  private _track: 'normal' | 'inverted' | false
  private _valueLabelDisplay: 'on' | 'auto' | 'off'
  private _onChange?: (value: number | number[]) => void

  constructor(parent?: NHAIObject)

  /** 设置滑块值 */
  setValue(value: number | number[]): void
  /** 获取滑块值 */
  value(): number | number[]

  /** 设置最小值 */
  setMin(min: number): void
  /** 获取最小值 */
  min(): number

  /** 设置最大值 */
  setMax(max: number): void
  /** 获取最大值 */
  max(): number

  /** 设置步长 */
  setStep(step: number): void
  /** 获取步长 */
  step(): number

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置标记 */
  setMarks(marks: boolean | Array<{
    value: number
    label?: string
  }>): void
  /** 获取标记 */
  marks(): boolean | Array<{
    value: number
    label?: string
  }>

  /** 设置方向 */
  setOrientation(orientation: 'horizontal' | 'vertical'): void
  /** 获取方向 */
  orientation(): string

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium'): void
  /** 获取尺寸 */
  size(): string

  /** 设置颜色 */
  setColor(color: 'primary' | 'secondary'): void
  /** 获取颜色 */
  color(): string

  /** 设置轨道 */
  setTrack(track: 'normal' | 'inverted' | false): void
  /** 获取轨道 */
  track(): string | false

  /** 设置值标签显示 */
  setValueLabelDisplay(display: 'on' | 'auto' | 'off'): void
  /** 获取值标签显示 */
  valueLabelDisplay(): string

  /** 设置变化事件处理器 */
  setOnChange(handler: (value: number | number[]) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

/**
 * Material Design 评分组件
 * 支持半星评分和自定义字符
 * 
 * @example
 * ```typescript
 * const rate = new MaterialRate()
 * rate.setMax(5)
 * rate.setValue(3.5)
 * rate.setAllowHalf(true)
 * rate.setCharacter('★')
 * rate.setOnChange((value) => console.log('评分:', value))
 * ```
 */
export declare class MaterialRate extends NHAIWidget {
  private _value: number
  private _max: number
  private _disabled: boolean
  private _readOnly: boolean
  private _size: 'small' | 'medium' | 'large'
  private _color: 'primary' | 'secondary' | 'default'
  private _precision: number
  private _allowHalf: boolean
  private _allowClear: boolean
  private _character: string
  private _onChange?: (value: number) => void
  private _onHoverChange?: (value: number) => void

  constructor(parent?: NHAIObject)

  /** 设置评分值 */
  setValue(value: number): void
  /** 获取评分值 */
  value(): number

  /** 设置最大评分 */
  setMax(max: number): void
  /** 获取最大评分 */
  max(): number

  /** 设置禁用状态 */
  setDisabled(disabled: boolean): void
  /** 获取禁用状态 */
  disabled(): boolean

  /** 设置只读状态 */
  setReadOnly(readOnly: boolean): void
  /** 获取只读状态 */
  readOnly(): boolean

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium' | 'large'): void
  /** 获取尺寸 */
  size(): string

  /** 设置颜色 */
  setColor(color: 'primary' | 'secondary' | 'default'): void
  /** 获取颜色 */
  color(): string

  /** 设置精度 */
  setPrecision(precision: number): void
  /** 获取精度 */
  precision(): number

  /** 设置允许半星 */
  setAllowHalf(allowHalf: boolean): void
  /** 获取允许半星 */
  allowHalf(): boolean

  /** 设置允许清除 */
  setAllowClear(allowClear: boolean): void
  /** 获取允许清除 */
  allowClear(): boolean

  /** 设置字符 */
  setCharacter(character: string): void
  /** 获取字符 */
  character(): string

  /** 设置变化事件处理器 */
  setOnChange(handler: (value: number) => void): void
  /** 设置悬停变化事件处理器 */
  setOnHoverChange(handler: (value: number) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

// ========== 数据展示组件 (Data Display Components) ==========

/**
 * 表格列定义接口
 */
export interface TableColumn {
  /** 列键 */
  key: string
  /** 列标题 */
  title: string
  /** 数据索引 */
  dataIndex?: string
  /** 列宽度 */
  width?: number | string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 自定义渲染函数 */
  render?: (value: any, record: any, index: number) => any
}

/**
 * 表格数据接口
 */
export interface TableData {
  [key: string]: any
}

/**
 * Material Design 表格组件
 * 支持排序、分页、自定义渲染等功能
 * 
 * @example
 * ```typescript
 * const table = new MaterialTable()
 * table.setColumns([
 *   { key: 'name', title: '姓名', sortable: true },
 *   { key: 'age', title: '年龄', align: 'center' }
 * ])
 * table.setDataSource([
 *   { name: '张三', age: 25 },
 *   { name: '李四', age: 30 }
 * ])
 * table.setPagination(true)
 * ```
 */
export declare class MaterialTable extends NHAIWidget {
  private _columns: TableColumn[]
  private _dataSource: TableData[]
  private _loading: boolean
  private _pagination: boolean
  private _pageSize: number
  private _currentPage: number
  private _total: number
  private _size: 'small' | 'medium'
  private _bordered: boolean
  private _striped: boolean
  private _hoverable: boolean
  private _sortField: string
  private _sortOrder: 'asc' | 'desc'
  private _onRowClick?: (record: TableData, index: number) => void
  private _onSort?: (field: string, order: 'asc' | 'desc') => void
  private _onPageChange?: (page: number, pageSize: number) => void

  constructor(parent?: NHAIObject)

  /** 设置列定义 */
  setColumns(columns: TableColumn[]): void
  /** 获取列定义 */
  columns(): TableColumn[]

  /** 设置数据源 */
  setDataSource(dataSource: TableData[]): void
  /** 获取数据源 */
  dataSource(): TableData[]

  /** 设置加载状态 */
  setLoading(loading: boolean): void
  /** 获取加载状态 */
  loading(): boolean

  /** 设置分页 */
  setPagination(pagination: boolean): void
  /** 获取分页 */
  pagination(): boolean

  /** 设置页面大小 */
  setPageSize(pageSize: number): void
  /** 获取页面大小 */
  pageSize(): number

  /** 设置当前页 */
  setCurrentPage(page: number): void
  /** 获取当前页 */
  currentPage(): number

  /** 设置总数 */
  setTotal(total: number): void
  /** 获取总数 */
  total(): number

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium'): void
  /** 获取尺寸 */
  size(): string

  /** 设置边框 */
  setBordered(bordered: boolean): void
  /** 获取边框 */
  bordered(): boolean

  /** 设置斑马纹 */
  setStriped(striped: boolean): void
  /** 获取斑马纹 */
  striped(): boolean

  /** 设置悬停效果 */
  setHoverable(hoverable: boolean): void
  /** 获取悬停效果 */
  hoverable(): boolean

  /** 设置行点击事件处理器 */
  setOnRowClick(handler: (record: TableData, index: number) => void): void
  /** 设置排序事件处理器 */
  setOnSort(handler: (field: string, order: 'asc' | 'desc') => void): void
  /** 设置分页变化事件处理器 */
  setOnPageChange(handler: (page: number, pageSize: number) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

/**
 * 列表项接口
 */
export interface ListItem {
  /** 项ID */
  id: string | number
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 头像 */
  avatar?: string
  /** 图标 */
  icon?: string
  /** 操作按钮 */
  actions?: Array<{
    label: string
    onClick: () => void
  }>
  [key: string]: any
}

/**
 * Material Design 列表组件
 * 支持头像、图标、操作按钮等丰富内容
 * 
 * @example
 * ```typescript
 * const list = new MaterialList()
 * list.setItems([
 *   {
 *     id: 1,
 *     title: '用户1',
 *     description: '用户描述',
 *     avatar: 'avatar1.jpg',
 *     actions: [
 *       { label: '编辑', onClick: () => console.log('编辑') }
 *     ]
 *   }
 * ])
 * list.setSelectable(true)
 * ```
 */
export declare class MaterialList extends NHAIWidget {
  private _items: ListItem[]
  private _loading: boolean
  private _size: 'small' | 'medium' | 'large'
  private _dense: boolean
  private _bordered: boolean
  private _selectable: boolean
  private _selectedItems: (string | number)[]
  private _onItemClick?: (item: ListItem, index: number) => void
  private _onItemSelect?: (selectedItems: (string | number)[]) => void

  constructor(parent?: NHAIObject)

  /** 设置列表项 */
  setItems(items: ListItem[]): void
  /** 获取列表项 */
  items(): ListItem[]

  /** 添加列表项 */
  addItem(item: ListItem): void
  /** 移除列表项 */
  removeItem(id: string | number): void

  /** 设置加载状态 */
  setLoading(loading: boolean): void
  /** 获取加载状态 */
  loading(): boolean

  /** 设置尺寸 */
  setSize(size: 'small' | 'medium' | 'large'): void
  /** 获取尺寸 */
  size(): string

  /** 设置密集模式 */
  setDense(dense: boolean): void
  /** 获取密集模式 */
  dense(): boolean

  /** 设置边框 */
  setBordered(bordered: boolean): void
  /** 获取边框 */
  bordered(): boolean

  /** 设置可选择 */
  setSelectable(selectable: boolean): void
  /** 获取可选择 */
  selectable(): boolean

  /** 设置选中项 */
  setSelectedItems(selectedItems: (string | number)[]): void
  /** 获取选中项 */
  selectedItems(): (string | number)[]

  /** 设置项点击事件处理器 */
  setOnItemClick(handler: (item: ListItem, index: number) => void): void
  /** 设置项选择事件处理器 */
  setOnItemSelect(handler: (selectedItems: (string | number)[]) => void): void

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
}

// ========== 导航组件 (Navigation Components) ==========

/**
 * 菜单栏布局类型枚举
 */
export enum MenuBarLayoutType {
  /** 水平菜单栏 */
  HORIZONTAL = "horizontal",
  /** 垂直菜单栏 */
  VERTICAL = "vertical",
  /** 下拉菜单栏 */
  DROPDOWN = "dropdown",
  /** 上下文菜单栏 */
  CONTEXT = "context"
}

/**
 * 菜单项类型枚举
 */
export enum MenuItemType {
  /** 普通菜单项 */
  ITEM = "item",
  /** 子菜单 */
  SUBMENU = "submenu",
  /** 分隔符 */
  SEPARATOR = "separator",
  /** 复选框菜单项 */
  CHECKBOX = "checkbox",
  /** 单选菜单项 */
  RADIO = "radio",
  /** 菜单组 */
  GROUP = "group"
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  /** 菜单项ID */
  id: string
  /** 菜单项类型 */
  type: MenuItemType
  /** 菜单项标签 */
  label?: string
  /** 菜单项图标 */
  icon?: string
  /** 快捷键 */
  shortcut?: string
  /** 提示信息 */
  tooltip?: string
  /** 是否可见 */
  visible?: boolean
  /** 是否启用 */
  enabled?: boolean
  /** 是否选中（用于复选框和单选） */
  checked?: boolean
  /** 子菜单项 */
  children?: MenuItem[]
  /** 点击事件处理器 */
  onClick?: () => void
  /** 切换事件处理器 */
  onToggle?: (checked: boolean) => void
  /** 自定义样式 */
  style?: Record<string, any>
  /** 自定义类名 */
  className?: string
  /** 所属组 */
  group?: string
}

/**
 * 菜单栏配置接口
 */
export interface MenuBarConfig {
  /** 布局类型 */
  layout: MenuBarLayoutType
  /** 主题 */
  theme: 'light' | 'dark'
  /** 背景色 */
  backgroundColor?: string
  /** 文字颜色 */
  textColor?: string
  /** 边框颜色 */
  borderColor?: string
  /** 是否显示阴影 */
  shadow?: boolean
  /** 是否显示图标 */
  showIcons?: boolean
  /** 是否显示快捷键 */
  showShortcuts?: boolean
  /** 是否启用动画 */
  animation?: boolean
  /** 是否响应式 */
  responsive?: boolean
}

/**
 * Material Design 菜单栏组件
 * 支持多种布局类型和丰富的菜单项类型
 * 
 * @example
 * ```typescript
 * const menuBar = new MaterialMenuBar()
 * menuBar.setLayout(MenuBarLayoutType.HORIZONTAL)
 * menuBar.setTheme('light')
 * menuBar.addItem({
 *   id: 'file',
 *   type: MenuItemType.SUBMENU,
 *   label: '文件',
 *   children: [
 *     { id: 'new', type: MenuItemType.ITEM, label: '新建', shortcut: 'Ctrl+N' },
 *     { id: 'open', type: MenuItemType.ITEM, label: '打开', shortcut: 'Ctrl+O' }
 *   ]
 * })
 * ```
 */
export declare class MaterialMenuBar extends NHAIWidget {
  private _config: MenuBarConfig
  private _items: Map<string, MenuItem>
  private _container: HTMLElement | null
  private _isRendered: boolean
  private _activeSubmenu: string | null
  private _documentClickListener: ((e: Event) => void) | null

  constructor(parent?: NHAIObject)

  /** 设置布局类型 */
  setLayout(layout: MenuBarLayoutType): MaterialMenuBar
  /** 设置主题 */
  setTheme(theme: 'light' | 'dark'): MaterialMenuBar
  /** 设置背景色 */
  setBackgroundColor(color: string): MaterialMenuBar
  /** 设置文字颜色 */
  setTextColor(color: string): MaterialMenuBar
  /** 设置边框颜色 */
  setBorderColor(color: string): MaterialMenuBar
  /** 设置阴影 */
  setShadow(enabled: boolean): MaterialMenuBar
  /** 设置图标显示 */
  setShowIcons(enabled: boolean): MaterialMenuBar
  /** 设置快捷键显示 */
  setShowShortcuts(enabled: boolean): MaterialMenuBar
  /** 设置动画 */
  setAnimation(enabled: boolean): MaterialMenuBar
  /** 设置响应式 */
  setResponsive(enabled: boolean): MaterialMenuBar
  /** 设置高度 */
  setHeight(height: number): MaterialMenuBar

  /** 设置为水平布局 */
  horizontal(): MaterialMenuBar
  /** 设置为垂直布局 */
  vertical(): MaterialMenuBar
  /** 设置为下拉布局 */
  dropdown(): MaterialMenuBar
  /** 设置为上下文布局 */
  context(): MaterialMenuBar

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
  /** 更新组件 */
  update(): void

  /** 添加菜单项 */
  addItem(item: MenuItem): MaterialMenuBar
  /** 添加子菜单 */
  addSubmenu(id: string, label: string, children: MenuItem[]): MaterialMenuBar
  /** 添加分隔符 */
  addSeparator(id: string): MaterialMenuBar
  /** 添加复选框菜单项 */
  addCheckbox(id: string, label: string, checked?: boolean, onToggle?: (checked: boolean) => void): MaterialMenuBar
  /** 添加单选菜单项 */
  addRadio(id: string, label: string, group: string, checked?: boolean, onToggle?: (checked: boolean) => void): MaterialMenuBar
  /** 移除菜单项 */
  removeItem(id: string): MaterialMenuBar
  /** 清空菜单项 */
  clearItems(): MaterialMenuBar
  /** 设置菜单项选中状态 */
  setItemChecked(id: string, checked: boolean): MaterialMenuBar
  /** 设置菜单项启用状态 */
  setItemEnabled(id: string, enabled: boolean): MaterialMenuBar
  /** 设置菜单项可见状态 */
  setItemVisible(id: string, visible: boolean): MaterialMenuBar

  /** 销毁组件，清理资源 */
  destroy(): void
}

// ========== 工具栏组件 (Toolbar Components) ==========

/**
 * 工具栏布局类型枚举
 */
export enum ToolbarLayoutType {
  /** 水平布局 */
  HORIZONTAL = "horizontal",
  /** 垂直布局 */
  VERTICAL = "vertical",
  /** 网格布局 */
  GRID = "grid",
  /** 弹性布局 */
  FLEX = "flex",
  /** 自定义布局 */
  CUSTOM = "custom"
}

/**
 * 工具栏对齐方式枚举
 */
export enum ToolbarAlignment {
  /** 开始对齐 */
  START = "start",
  /** 居中对齐 */
  CENTER = "center",
  /** 结束对齐 */
  END = "end",
  /** 两端对齐 */
  SPACE_BETWEEN = "space-between",
  /** 环绕对齐 */
  SPACE_AROUND = "space-around",
  /** 均匀对齐 */
  SPACE_EVENLY = "space-evenly"
}

/**
 * 工具栏项接口
 */
export interface ToolbarItem {
  /** 项ID */
  id: string
  /** 组件实例 */
  component: any
  /** 标签 */
  label?: string
  /** 图标 */
  icon?: string
  /** 提示信息 */
  tooltip?: string
  /** 是否可见 */
  visible?: boolean
  /** 是否启用 */
  enabled?: boolean
  /** 排序 */
  order?: number
  /** 分组 */
  group?: string
  /** 自定义样式 */
  style?: Record<string, any>
  /** 自定义类名 */
  className?: string
}

/**
 * 工具栏组接口
 */
export interface ToolbarGroup {
  /** 组ID */
  id: string
  /** 组标签 */
  label?: string
  /** 组内项目 */
  items: ToolbarItem[]
  /** 是否可见 */
  visible?: boolean
  /** 是否可折叠 */
  collapsible?: boolean
  /** 是否已折叠 */
  collapsed?: boolean
  /** 是否显示分隔符 */
  separator?: boolean
}

/**
 * 工具栏配置接口
 */
export interface ToolbarConfig {
  /** 布局类型 */
  layout: ToolbarLayoutType
  /** 对齐方式 */
  alignment: ToolbarAlignment
  /** 间距 */
  spacing: number
  /** 内边距 */
  padding: number
  /** 背景色 */
  backgroundColor?: string
  /** 边框颜色 */
  borderColor?: string
  /** 圆角 */
  borderRadius?: number
  /** 是否显示阴影 */
  shadow?: boolean
  /** 高度 */
  height?: number | string
  /** 宽度 */
  width?: number | string
  /** 是否响应式 */
  responsive?: boolean
  /** 主题 */
  theme?: 'light' | 'dark'
  /** 网格列数 */
  gridColumns?: number
}

/**
 * Material Design 工具栏组件
 * 支持命令式API动态添加控件和自定义布局
 * 
 * @example
 * ```typescript
 * const toolbar = new MaterialToolbar()
 * toolbar.setLayout(ToolbarLayoutType.HORIZONTAL)
 * toolbar.setAlignment(ToolbarAlignment.START)
 * toolbar.addButton('save', '保存', () => console.log('保存'))
 * toolbar.addIconButton('undo', 'undo', () => console.log('撤销'))
 * toolbar.addSeparator('sep1')
 * ```
 */
export declare class MaterialToolbar extends NHAIWidget {
  private _config: ToolbarConfig
  private _items: Map<string, ToolbarItem>
  private _groups: Map<string, ToolbarGroup>
  private _order: string[]
  private _container: HTMLElement | null
  private _isRendered: boolean

  constructor(parent?: NHAIObject)

  /** 设置工具栏配置 */
  setConfig(config: Partial<ToolbarConfig>): MaterialToolbar
  /** 获取工具栏配置 */
  getConfig(): ToolbarConfig

  /** 设置布局类型 */
  setLayout(layout: ToolbarLayoutType): MaterialToolbar
  /** 设置对齐方式 */
  setAlignment(alignment: ToolbarAlignment): MaterialToolbar
  /** 设置间距 */
  setSpacing(spacing: number): MaterialToolbar
  /** 设置内边距 */
  setPadding(padding: number): MaterialToolbar
  /** 设置主题 */
  setTheme(theme: 'light' | 'dark'): MaterialToolbar

  /** 添加按钮 */
  addButton(id: string, text: string, onClick?: () => void, options?: Partial<ToolbarItem>): MaterialToolbar
  /** 添加图标按钮 */
  addIconButton(id: string, icon: string, onClick?: () => void, options?: Partial<ToolbarItem>): MaterialToolbar
  /** 添加输入框 */
  addInput(id: string, placeholder?: string, onChange?: (value: string) => void, options?: Partial<ToolbarItem>): MaterialToolbar
  /** 添加选择框 */
  addSelect(id: string, options: Array<{
    value: string | number
    label: string
  }>, onChange?: (value: any) => void, selectOptions?: Partial<ToolbarItem>): MaterialToolbar
  /** 添加分隔符 */
  addSeparator(id: string, options?: Partial<ToolbarItem>): MaterialToolbar
  /** 添加标签 */
  addLabel(id: string, text: string, options?: Partial<ToolbarItem>): MaterialToolbar
  /** 添加自定义组件 */
  addCustomComponent(id: string, component: any, options?: Partial<ToolbarItem>): MaterialToolbar

  /** 添加组件组 */
  addGroup(id: string, label?: string, options?: Partial<ToolbarGroup>): MaterialToolbar
  /** 向组中添加项目 */
  addToGroup(groupId: string, item: ToolbarItem): MaterialToolbar

  /** 移除项目 */
  removeItem(id: string): MaterialToolbar
  /** 更新项目 */
  updateItem(id: string, updates: Partial<ToolbarItem>): MaterialToolbar
  /** 显示项目 */
  showItem(id: string): MaterialToolbar
  /** 隐藏项目 */
  hideItem(id: string): MaterialToolbar
  /** 启用项目 */
  enableItem(id: string): MaterialToolbar
  /** 禁用项目 */
  disableItem(id: string): MaterialToolbar
  /** 重新排序项目 */
  reorderItems(order: string[]): MaterialToolbar
  /** 清空所有项目 */
  clear(): MaterialToolbar

  /** 获取项目 */
  getItem(id: string): ToolbarItem | undefined
  /** 获取所有项目 */
  getItems(): ToolbarItem[]
  /** 获取可见项目 */
  getVisibleItems(): ToolbarItem[]
  /** 获取组 */
  getGroup(id: string): ToolbarGroup | undefined
  /** 获取所有组 */
  getGroups(): ToolbarGroup[]

  /** 设置水平布局 */
  horizontal(): MaterialToolbar
  /** 设置垂直布局 */
  vertical(): MaterialToolbar
  /** 设置网格布局 */
  grid(columns?: number): MaterialToolbar
  /** 设置弹性布局 */
  flex(): MaterialToolbar
  /** 设置自定义布局 */
  custom(layoutFunction: (items: ToolbarItem[]) => any): MaterialToolbar

  /** 设置背景色 */
  setBackgroundColor(color: string): MaterialToolbar
  /** 设置边框色 */
  setBorderColor(color: string): MaterialToolbar
  /** 设置圆角 */
  setBorderRadius(radius: number): MaterialToolbar
  /** 设置阴影 */
  setShadow(enabled: boolean): MaterialToolbar
  /** 设置尺寸 */
  setSize(width?: number | string, height?: number | string): MaterialToolbar

  /** 渲染组件 */
  render(_context?: NHAIRenderContext): any
  /** 刷新工具栏 */
  refresh(): void
}

// ========== 工厂类 (Factory Classes) ==========

/**
 * NHAI Material 组件工厂类
 * 提供便捷的组件创建方法
 * 
 * @example
 * ```typescript
 * // 创建按钮
 * const button = NHAIObjectFactory.createMaterialButton('点击我')
 * 
 * // 创建输入框
 * const input = NHAIObjectFactory.createMaterialInput()
 * 
 * // 创建菜单栏
 * const menuBar = NHAIObjectFactory.createMaterialMenuBar()
 * ```
 */
export declare class NHAIObjectFactory {
  /** 创建 Material 按钮 */
  static createMaterialButton(text?: string, parent?: NHAIObject): MaterialButton
  /** 创建 Material 输入框 */
  static createMaterialInput(parent?: NHAIObject): MaterialInput
  /** 创建 Material 选择框 */
  static createMaterialSelect(parent?: NHAIObject): MaterialSelect
  /** 创建 Material 复选框 */
  static createMaterialCheckbox(parent?: NHAIObject): MaterialCheckbox
  /** 创建 Material 单选框 */
  static createMaterialRadio(parent?: NHAIObject): MaterialRadio
  /** 创建 Material 开关 */
  static createMaterialSwitch(parent?: NHAIObject): MaterialSwitch
  /** 创建 Material 滑块 */
  static createMaterialSlider(parent?: NHAIObject): MaterialSlider
  /** 创建 Material 评分 */
  static createMaterialRate(parent?: NHAIObject): MaterialRate
  /** 创建 Material 表格 */
  static createMaterialTable(parent?: NHAIObject): MaterialTable
  /** 创建 Material 列表 */
  static createMaterialList(parent?: NHAIObject): MaterialList
  /** 创建 Material 菜单栏 */
  static createMaterialMenuBar(parent?: NHAIObject): MaterialMenuBar
  /** 创建 Material 工具栏 */
  static createMaterialToolbar(parent?: NHAIObject): MaterialToolbar
}

// ========== 导出声明 ==========

/**
 * 导出所有 Material 组件类型
 */
export {
  // 基础组件
  MaterialButton,
  MaterialInput,
  MaterialSelect,
  MaterialCheckbox,
  MaterialRadio,
  MaterialSwitch,
  MaterialSlider,
  MaterialRate,
  
  // 数据展示组件
  MaterialTable,
  MaterialList,
  
  // 导航组件
  MaterialMenuBar,
  MaterialToolbar,
  
  // 枚举类型
  ButtonType,
  ButtonSize,
  ButtonColor,
  InputType,
  InputSize,
  InputState,
  SelectType,
  SelectSize,
  SelectState,
  MenuBarLayoutType,
  MenuItemType,
  ToolbarLayoutType,
  ToolbarAlignment,
  
  // 接口类型
  SelectOption,
  CascadeOption,
  TreeOption,
  TableColumn,
  TableData,
  ListItem,
  MenuItem,
  MenuBarConfig,
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  
  // 工厂类
  NHAIObjectFactory
}

/**
 * 默认导出
 */
export default {
  // 基础组件
  MaterialButton,
  MaterialInput,
  MaterialSelect,
  MaterialCheckbox,
  MaterialRadio,
  MaterialSwitch,
  MaterialSlider,
  MaterialRate,
  
  // 数据展示组件
  MaterialTable,
  MaterialList,
  
  // 导航组件
  MaterialMenuBar,
  MaterialToolbar,
  
  // 枚举类型
  ButtonType,
  ButtonSize,
  ButtonColor,
  InputType,
  InputSize,
  InputState,
  SelectType,
  SelectSize,
  SelectState,
  MenuBarLayoutType,
  MenuItemType,
  ToolbarLayoutType,
  ToolbarAlignment,
  
  // 接口类型
  SelectOption,
  CascadeOption,
  TreeOption,
  TableColumn,
  TableData,
  ListItem,
  MenuItem,
  MenuBarConfig,
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  
  // 工厂类
  NHAIObjectFactory
}
