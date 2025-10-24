import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material UI ColorPicker 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialColorPicker extends NHAIWidget {
  private _value: string = '#000000'
  private _disabled: boolean = false
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _variant: 'standard' | 'outlined' | 'filled' = 'standard'
  private _format: 'hex' | 'rgb' | 'hsl' = 'hex'
  private _showAlpha: boolean = false
  private _presetColors: string[] = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#795548', '#607d8b', '#000000', '#ffffff'
  ]
  private _onChange?: (value: string) => void
  // private _onOpen?: () => void
  // private _onClose?: () => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置值
  setValue(value: string): void {
    this._value = value
  }

  value(): string {
    return this._value
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置变体
  setVariant(variant: 'standard' | 'outlined' | 'filled'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置格式
  setFormat(format: 'hex' | 'rgb' | 'hsl'): void {
    this._format = format
  }

  format(): string {
    return this._format
  }

  // 设置显示透明度
  setShowAlpha(showAlpha: boolean): void {
    this._showAlpha = showAlpha
  }

  showAlpha(): boolean {
    return this._showAlpha
  }

  // 设置预设颜色
  setPresetColors(colors: string[]): void {
    this._presetColors = colors
  }

  presetColors(): string[] {
    return this._presetColors
  }

  // 设置事件处理器
  setOnChange(handler: (value: string) => void): void {
    this._onChange = handler
  }

  // setOnOpen(handler: () => void): void {
  //   this._onOpen = handler
  // }

  // setOnClose(handler: () => void): void {
  //   this._onClose = handler
  // }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-color-picker mui-color-picker--${this._variant} mui-color-picker--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        maxWidth: '300px'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 颜色输入框
    const inputProps: any = {
      className: 'mui-color-picker-input',
      style: {
        width: '100%',
        padding: this.getPadding(),
        border: this.getBorderStyle(),
        borderRadius: this.getBorderRadius(),
        backgroundColor: this.getBackgroundColor(),
        fontSize: this.getFontSize(),
        color: 'rgba(0, 0, 0, 0.87)',
        outline: 'none',
        cursor: this._disabled ? 'not-allowed' : 'pointer',
        opacity: this._disabled ? 0.6 : 1,
        transition: 'border-color 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      disabled: this._disabled,
      value: this._value,
      onChange: (e: any) => {
        if (!this._disabled) {
          this._value = e.target.value
          if (this._onChange) {
            this._onChange(this._value)
          }
        }
      }
    }

    const inputChildren = []

    // 颜色预览
    const previewProps: any = {
      className: 'mui-color-picker-preview',
      style: {
        width: this.getPreviewSize(),
        height: this.getPreviewSize(),
        backgroundColor: this._value,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        flexShrink: 0
      }
    }
    inputChildren.push(adapter.createElement('div', previewProps))

    // 颜色值显示
    const valueProps: any = {
      className: 'mui-color-picker-value',
      style: {
        flex: 1,
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
        fontFamily: 'monospace'
      },
      value: this._value,
      onChange: (e: any) => {
        if (!this._disabled) {
          this._value = e.target.value
          if (this._onChange) {
            this._onChange(this._value)
          }
        }
      }
    }
    inputChildren.push(adapter.createElement('input', valueProps))

    // 下拉箭头
    const arrowProps: any = {
      className: 'mui-color-picker-arrow',
      style: {
        fontSize: '16px',
        color: 'rgba(0, 0, 0, 0.6)',
        flexShrink: 0
      }
    }
    inputChildren.push(adapter.createElement('span', arrowProps, ['▼']))

    inputProps.children = inputChildren
    children.push(adapter.createElement('div', inputProps))

    // 预设颜色
    if (this._presetColors.length > 0) {
      const presetProps: any = {
        className: 'mui-color-picker-presets',
        style: {
          marginTop: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 1fr))',
          gap: '4px'
        }
      }

      const presetChildren = this._presetColors.map(color => {
        const colorProps: any = {
          className: `mui-color-picker-preset ${color === this._value ? 'mui-color-picker-preset--selected' : ''}`,
          style: {
            width: '24px',
            height: '24px',
            backgroundColor: color,
            border: color === this._value ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            cursor: this._disabled ? 'not-allowed' : 'pointer',
            opacity: this._disabled ? 0.6 : 1,
            transition: 'all 0.2s ease-in-out'
          }
        }

        if (!this._disabled) {
          colorProps.onClick = () => {
            this._value = color
            if (this._onChange) {
              this._onChange(this._value)
            }
          }
          colorProps.onMouseEnter = () => {
            if (color !== this._value) {
              colorProps.style.transform = 'scale(1.1)'
            }
          }
          colorProps.onMouseLeave = () => {
            colorProps.style.transform = 'scale(1)'
          }
        }

        return adapter.createElement('div', colorProps)
      })

      presetProps.children = presetChildren
      children.push(adapter.createElement('div', presetProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getPadding(): string {
    const paddingMap: Record<string, string> = {
      small: '6px 8px',
      medium: '8px 12px',
      large: '12px 16px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getPreviewSize(): string {
    const sizeMap: Record<string, string> = {
      small: '20px',
      medium: '24px',
      large: '28px'
    }
    return sizeMap[this._size] || sizeMap.medium
  }

  private getBorderStyle(): string {
    if (this._variant === 'standard') {
      return 'none'
    }
    
    return '1px solid rgba(0, 0, 0, 0.23)'
  }

  private getBorderRadius(): string {
    return '4px'
  }

  private getBackgroundColor(): string {
    if (this._variant === 'filled') {
      return 'rgba(0, 0, 0, 0.04)'
    }
    return 'transparent'
  }
}
