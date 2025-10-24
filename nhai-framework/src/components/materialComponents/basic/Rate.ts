import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material Rate 组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialRate extends NHAIWidget {
  private _value: number = 0                                                                                      // 当前评分值
  private _max: number = 5                                                                                        // 最大评分值
  private _disabled: boolean = false                                                                              // 是否禁用
  private _readOnly: boolean = false                                                                              // 是否只读
  private _size: 'small' | 'medium' | 'large' = 'medium'                                                          // 大小：小、中、大
  private _color: 'primary' | 'secondary' | 'default' = 'primary'                                                 // 颜色：主要、次要、默认
  private _precision: number = 1                                                                                 // 精度（小数位数）
  private _allowHalf: boolean = false                                                                             // 是否允许半星
  private _allowClear: boolean = true                                                                              // 是否允许清除
  private _character: string = '★'                                                                                // 评分字符
  private _onChange?: (value: number) => void                                                                     // 变化回调函数
  private _onHoverChange?: (value: number) => void                                                                 // 悬停变化回调函数

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置值
  setValue(value: number): void {
    this._value = Math.min(Math.max(value, 0), this._max)
  }

  value(): number {
    return this._value
  }

  // 设置最大值
  setMax(max: number): void {
    this._max = max
  }

  max(): number {
    return this._max
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置只读状态
  setReadOnly(readOnly: boolean): void {
    this._readOnly = readOnly
  }

  readOnly(): boolean {
    return this._readOnly
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置颜色
  setColor(color: 'primary' | 'secondary' | 'default'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置精度
  setPrecision(precision: number): void {
    this._precision = precision
  }

  precision(): number {
    return this._precision
  }

  // 设置允许半星
  setAllowHalf(allowHalf: boolean): void {
    this._allowHalf = allowHalf
  }

  allowHalf(): boolean {
    return this._allowHalf
  }

  // 设置允许清除
  setAllowClear(allowClear: boolean): void {
    this._allowClear = allowClear
  }

  allowClear(): boolean {
    return this._allowClear
  }

  // 设置字符
  setCharacter(character: string): void {
    this._character = character
  }

  character(): string {
    return this._character
  }

  // 设置事件处理器
  setOnChange(handler: (value: number) => void): void {
    this._onChange = handler
  }

  setOnHoverChange(handler: (value: number) => void): void {
    this._onHoverChange = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-rate-container mui-rate-container--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        opacity: this._disabled ? 0.6 : 1
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 生成星星
    for (let i = 1; i <= this._max; i++) {
      const starProps: any = {
        className: `mui-rate-star mui-rate-star--${this._size}`,
        style: {
          fontSize: this.getSizeStyles().fontSize,
          color: this.getStarColor(i),
          cursor: this._disabled || this._readOnly ? 'default' : 'pointer',
          transition: 'color 0.2s ease-in-out',
          position: 'relative',
          display: 'inline-block'
        }
      }

      if (!this._disabled && !this._readOnly) {
        starProps.onClick = () => this.handleStarClick(i)
        starProps.onMouseEnter = () => this.handleStarHover(i)
        starProps.onMouseLeave = () => this.handleStarLeave()
      }

      // 半星支持
      if (this._allowHalf && this.isHalfStar(i)) {
        const halfStarProps: any = {
          className: 'mui-rate-star-half',
          style: {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '50%',
            overflow: 'hidden',
            color: this.getColorValue()
          }
        }
        starProps.children = [
          adapter.createElement('span', halfStarProps, [this._character]),
          adapter.createElement('span', { style: { color: 'rgba(0, 0, 0, 0.26)' } }, [this._character])
        ]
      } else {
        starProps.children = [this._character]
      }

      children.push(adapter.createElement('span', starProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getSizeStyles(): Record<string, any> {
    const sizeMap: Record<string, Record<string, any>> = {
      small: {
        fontSize: '16px'
      },
      medium: {
        fontSize: '20px'
      },
      large: {
        fontSize: '24px'
      }
    }
    
    return sizeMap[this._size] || sizeMap.medium
  }

  private getStarColor(index: number): string {
    if (index <= this._value) {
      return this.getColorValue()
    }
    return 'rgba(0, 0, 0, 0.26)'
  }

  private getColorValue(): string {
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e',
      default: '#ffc107'
    }
    return colorMap[this._color] || colorMap.primary
  }

  private isHalfStar(index: number): boolean {
    if (!this._allowHalf) return false
    const diff = this._value - (index - 1)
    return diff > 0 && diff < 1
  }

  private handleStarClick(index: number): void {
    if (this._disabled || this._readOnly) return
    
    let newValue = index
    
    // 如果允许清除且点击的是当前值，则清除
    if (this._allowClear && this._value === index) {
      newValue = 0
    }
    
    this._value = newValue
    
    if (this._onChange) {
      this._onChange(this._value)
    }
  }

  private handleStarHover(index: number): void {
    if (this._disabled || this._readOnly) return
    
    if (this._onHoverChange) {
      this._onHoverChange(index)
    }
  }

  private handleStarLeave(): void {
    if (this._disabled || this._readOnly) return
    
    if (this._onHoverChange) {
      this._onHoverChange(this._value)
    }
  }
}
